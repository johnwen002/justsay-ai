import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "" },
    {
      name: "description",
      content: "Local News. See breaking local news, events, and much more. ",
    },
  ];
}

export default function Home() {
  return <>111</>;
}
