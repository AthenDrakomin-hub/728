export interface Me {
  id: number;
  account: string;
  nickname?: string;
  avatar?: string;
  role: string;
  credit: number;
  points: number;
  inviteCode: string;
  invitedByCode: string | null;
  openRoomBlocked: boolean;
}

export const ROLE_LABEL: Record<string, string> = {
  player: "玩家",
  agent: "高级代理",
  top_agent: "顶级代理",
  customer_service: "客服",
  admin: "管理员",
};
