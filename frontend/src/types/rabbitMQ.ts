
export type SendActions = 'login' | 'logout' | 'message' | 'dmmessage';

export type ReceiveActions = 'message' | 'inventoryupdate' | 'hudupdate' | 'minimapupdate';

export interface RabbitMQPayload {
  action: SendActions | ReceiveActions;
  user: string;
  character: string,
  verifyToken: string,
  data: any
}
