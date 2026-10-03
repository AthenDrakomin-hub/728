import RoomClient from "./RoomClient";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RoomClient params={Promise.resolve({ id })} />;
}

// 预生成 100 个房间 ID 的静态页面，足够当前使用
export function generateStaticParams() {
  return Array.from({ length: 100 }, (_, i) => ({ id: String(i + 1) }));
}
