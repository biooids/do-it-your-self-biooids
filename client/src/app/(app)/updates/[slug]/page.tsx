// src/app/updates/[slug]/page.tsx

import UpdateDetails from "@/components/pages/updates/UpdateDetails";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Update Details",
};

export default async function UpdateDetailsPage({
  params,
}: {
  // Update the type to a Promise
  params: Promise<{ slug: string }>;
}) {
  // Await the params to get the value
  const { slug } = await params;

  return (
    <div>
      <UpdateDetails updateId={slug} />
    </div>
  );
}
