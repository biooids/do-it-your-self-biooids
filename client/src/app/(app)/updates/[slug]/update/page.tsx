// src/app/updates/[id]/update/page.tsx
import EditUpdatePage from "@/components/pages/updates/EditUpdate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Edit Update",
};

export default async function EditUpdate({
  params,
}: {
  // Update type to a Promise containing 'id'
  params: Promise<{ id: string }>;
}) {
  // Await params and get the 'id'
  const { id } = await params;

  return <EditUpdatePage updateId={id} />;
}
