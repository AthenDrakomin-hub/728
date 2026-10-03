import GameClient from "./GameClient";

export function generateStaticParams() {
  return [
    { type: "texas" },
    { type: "jinhua" },
    { type: "sangong" },
    { type: "niuniu" },
  ];
}

export default async function Page({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  return <GameClient params={Promise.resolve({ type })} />;
}
