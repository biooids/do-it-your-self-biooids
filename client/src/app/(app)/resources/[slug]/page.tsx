import ResourceDetails from "@/components/pages/resources/ResourceDetails";

// The function is already async, which is correct
export default async function ResourceDetailPage({
  params,
}: {
  // 1. Update the type to be a Promise
  params: Promise<{ slug: string }>;
}) {
  // 2. Await the params to get the actual slug value
  const { slug } = await params;

  return (
    <div>
      {/* 3. Use the awaited slug */}
      <ResourceDetails postId={slug} />
    </div>
  );
}
