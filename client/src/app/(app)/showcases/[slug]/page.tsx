import ShowcaseDetails from "@/components/pages/showcases/ShowcaseDetails";

export default async function ShowcaseDetailsPage({
  params,
}: {
  // Update the type to a Promise
  params: Promise<{ slug: string }>;
}) {
  // Await the params to get the value
  const { slug } = await params;

  return (
    <div>
      <ShowcaseDetails postId={slug} />
    </div>
  );
}
