import { useLoaderData } from "react-router";
import rss, { type FollowRSSPathSchema } from "~/api/rss";
import type { Route } from "./+types/rss-detail";

export async function loader({ context, request, params }: Route.LoaderArgs) {
  const response = await rss.list(0, 10, params.category);
  return response;
}

const Page = () => {
  const data = useLoaderData<{
    total: number;
    results: FollowRSSPathSchema[];
  }>();
  console.log(data);
  return (
    <div>
      {data.results.map((it) => (
        <div key={it.id}>{it.rss_path}</div>
      ))}
    </div>
  );
};

export default Page;
