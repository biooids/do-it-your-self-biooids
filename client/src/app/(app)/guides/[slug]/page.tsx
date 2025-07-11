import GuideDetails from "@/components/pages/guides/GuideDetails";

// 1. Make the component an 'async' function
export default async function GuideDetailsPage({
  params,
}: {
  // 2. Type params as a Promise
  params: Promise<{ slug: string }>;
}) {
  // 3. Await the params to get the actual value
  const { slug } = await params;

  return (
    <div>
      <GuideDetails postId={slug} />
    </div>
  );
}
