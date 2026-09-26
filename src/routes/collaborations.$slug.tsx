import { createFileRoute, redirect } from "@tanstack/react-router";
import { collaborations } from "@/data/collaborations";

export const Route = createFileRoute("/collaborations/$slug")({
  beforeLoad: ({ params }) => {
    const story = collaborations.find((item) => item.slug === params.slug);
    if (story?.publicStory && story.intro?.trim() && story.objectives?.length) {
      throw redirect({ to: "/collaborate/$slug", params: { slug: params.slug }, statusCode: 301 });
    }
    throw redirect({ to: "/collaborate", statusCode: 301 });
  },
});
