import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { adminDb } from '@/lib/firebase-admin';
import { requireStaff } from '@/lib/require-staff';

export async function POST(req: NextRequest) {
  const denied = await requireStaff(req);
  if (denied) return denied;

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const sheetName = formData.get('sheetName') as string | null;
    const rowStart = formData.get('rowStart') as string | null;
    const rowEnd = formData.get('rowEnd') as string | null;

    if (!file || !sheetName || !rowStart || !rowEnd) {
      return NextResponse.json(
        { error: 'Missing required fields: file, sheetName, rowStart, or rowEnd' },
        { status: 400 }
      );
    }

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Please upload an Excel file (.xlsx or .xls)' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    if (!workbook.SheetNames.includes(sheetName)) {
      return NextResponse.json(
        { 
          error: `Sheet '${sheetName}' not found. Available sheets: ${workbook.SheetNames.join(', ')}` 
        },
        { status: 400 }
      );
    }

    const parsedRowStart = parseInt(rowStart, 10);
    const parsedRowEnd = parseInt(rowEnd, 10);
    
    if (isNaN(parsedRowStart) || parsedRowStart < 1) {
      return NextResponse.json(
        { error: 'Row start must be a positive number >= 1' },
        { status: 400 }
      );
    }
    
    if (isNaN(parsedRowEnd) || parsedRowEnd < parsedRowStart) {
      return NextResponse.json(
        { error: 'Row end must be a number >= row start' },
        { status: 400 }
      );
    }

    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

    if (data.length === 0) {
      return NextResponse.json(
        { error: 'Sheet is empty' },
        { status: 400 }
      );
    }

    const headers = data[0] as string[];
    if (!headers || headers.length === 0) {
      return NextResponse.json(
        { error: 'No headers found in the first row' },
        { status: 400 }
      );
    }

    const collectionRef = adminDb().collection('villagers');
    const uploadedRecords = [];
    const errors = [];

    const dataRows = data.slice(1);
    
    if (parsedRowStart > dataRows.length + 1) {
      return NextResponse.json(
        { error: `Row start (${parsedRowStart}) exceeds available data rows (${dataRows.length + 1})` },
        { status: 400 }
      );
    }
    
    const startIndex = parsedRowStart - 2;
    const endIndex = Math.min(parsedRowEnd - 1, dataRows.length);
    const rowsToProcess = endIndex - startIndex;

    for (let i = startIndex; i < endIndex; i++) {
      const row = dataRows[i];
      
      if (!row || row.every(cell => !cell && cell !== 0)) {
        continue;
      }

      try {
        const docData: any = {
          RW: sheetName,
          uploadedAt: new Date().toISOString(),
        };

        headers.forEach((header, index) => {
          if (header && header.trim()) {
            const cellValue = row[index];
            if (cellValue !== undefined && cellValue !== null) {
              docData[header.trim()] = cellValue;
            }
          }
        });

        if (docData.NAMA) {
          docData.NAMA_LOWER = docData.NAMA.toString().toLowerCase();
        }

        const hasData = Object.keys(docData).some(key => 
          key !== 'RW' && key !== 'uploadedAt' && docData[key] !== undefined && docData[key] !== null
        );

        if (hasData) {
          const nameField = Object.keys(docData).find(key => 
            key.toLowerCase().includes('nama') || key.toLowerCase() === 'name'
          );
          const nikField = Object.keys(docData).find(key => 
            key.toLowerCase().includes('nik') || key.toLowerCase().includes('ktp')
          );

          let docRef;
          let isUpdate = false;

          if (nameField && nikField && docData[nameField] && docData[nikField]) {
            try {
              const existingQuery = await collectionRef
                .where(nameField, '==', docData[nameField])
                .where(nikField, '==', docData[nikField])
                .limit(1)
                .get();

              if (!existingQuery.empty) {
                const existingDoc = existingQuery.docs[0];
                await existingDoc.ref.update(docData);
                docRef = { id: existingDoc.id };
                isUpdate = true;
              } else {
                docRef = await collectionRef.add(docData);
              }
            } catch (duplicateError) {
              if (duplicateError instanceof Error && duplicateError.message.includes('ALREADY_EXISTS')) {
                const retryQuery = await collectionRef
                  .where(nameField, '==', docData[nameField])
                  .where(nikField, '==', docData[nikField])
                  .limit(1)
                  .get();
                
                if (!retryQuery.empty) {
                  const existingDoc = retryQuery.docs[0];
                  await existingDoc.ref.update(docData);
                  docRef = { id: existingDoc.id };
                  isUpdate = true;
                } else {
                  throw duplicateError;
                }
              } else {
                throw duplicateError;
              }
            }
          } else {
            docRef = await collectionRef.add(docData);
          }

          uploadedRecords.push({ 
            id: docRef.id, 
            rowIndex: i + 2,
            isUpdate: isUpdate 
          });
        }
      } catch (error) {
        console.error(`Error processing row ${i + 2}:`, error);
        errors.push({
          rowIndex: i + 2,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const updatedRecords = uploadedRecords.filter(record => record.isUpdate).length;
    const newRecords = uploadedRecords.length - updatedRecords;

    return NextResponse.json({
      message: 'Data upload completed',
      summary: {
        totalRowsProcessed: rowsToProcess,
        successfulUploads: uploadedRecords.length,
        newRecords: newRecords,
        updatedRecords: updatedRecords,
        errorCount: errors.length,
        sheetName,
        uploadedRecords: uploadedRecords.slice(0, 10),
        errors: errors.slice(0, 5)
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Error uploading data:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const denied = await requireStaff(req);
  if (denied) return denied;

  return NextResponse.json(
    { message: 'Upload endpoint is ready. Use POST to upload Excel files.' },
    { status: 200 }
  );
}