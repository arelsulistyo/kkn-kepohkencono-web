import { notFound } from "next/navigation";
import LetterWorkspace from "@/components/layanan-surat/workspace/LetterWorkspace";
import { LETTER_IDS, isLetterId } from "../../data/services";

export const dynamicParams = false;

export function generateStaticParams() {
  return LETTER_IDS.map((id) => ({ id }));
}

export default async function BuatSuratPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!isLetterId(id)) notFound();
  return <LetterWorkspace letterId={id} />;
}
