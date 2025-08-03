import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
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

    // Convert file to buffer
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: 'buffer' });

    // Get sheet information
    const sheetsInfo = workbook.SheetNames.map(sheetName => {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
      
      return {
        name: sheetName,
        rowCount: data.length,
        columnCount: data[0]?.length || 0,
        headers: data[0] || [],
        hasData: data.length > 1
      };
    });

    return NextResponse.json({
      sheets: sheetsInfo,
      totalSheets: workbook.SheetNames.length
    }, { status: 200 });

  } catch (error) {
    console.error('Error reading Excel file:', error);
    return NextResponse.json(
      { 
        error: 'Failed to read Excel file',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}