import { NextRequest } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { noStoreJson, requireStaff } from '@/lib/require-staff';

// Full person data interface
interface PersonData {
  NAMA: string;
  NIK: string;
  NO_KK: string;
  ALAMAT: string;
  AGAMA: string;
  PEKERJAAN: string;
  RT: string;
  RW: string;
  JK: string;
  TMPT_LHR: string;
  TGL_LHR: string;
  NAMA_AYAH?: string;
  NAMA_IBU?: string;
  STATUS?: string;
  PDDK_AKHIR?: string;
}



export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nik: string }> }
) {
  const denied = await requireStaff(request);
  if (denied) return denied;

  try {
    const { nik } = await params;

    if (!nik) {
      return noStoreJson(
        { error: 'NIK is required' },
        { status: 400 }
      );
    }

    // Query Firestore villagers collection
    const villagersRef = adminDb().collection('villagers');
    const snapshot = await villagersRef.where('NIK', '==', nik).limit(1).get();

    if (snapshot.empty) {
      return noStoreJson(
        { error: 'Person not found' },
        { status: 404 }
      );
    }

    const doc = snapshot.docs[0];
    const data = doc.data();

    // Convert Firestore data to PersonData format
    const person: PersonData = {
      NAMA: data.NAMA?.toString() || '',
      NIK: data.NIK?.toString() || '',
      NO_KK: data.NO_KK?.toString() || '',
      ALAMAT: data.ALAMAT?.toString() || '',
      AGAMA: data.AGAMA?.toString() || '',
      PEKERJAAN: data.PEKERJAAN?.toString() || '',
      RT: data.NO_RT?.toString() || '',
      RW: data.NO_RW?.toString() || '',
      JK: data.JK?.toString() || '',
      TMPT_LHR: data.TMPT_LHR?.toString() || '',
      TGL_LHR: data.TGL_LHR?.toString() || '',
      NAMA_AYAH: data.NAMA_AYAH?.toString(),
      NAMA_IBU: data.NAMA_IBU?.toString(),
      STATUS: data.STATUS?.toString(),
      PDDK_AKHIR: data.PDDK_AKHIR?.toString()
    };

    return noStoreJson(person);
  } catch (error) {
    console.error('Error fetching person data:', error);
    return noStoreJson(
      { error: 'Failed to fetch person data' },
      { status: 500 }
    );
  }
}