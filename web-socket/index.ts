import * as WebSocket from 'ws';
import { validate } from 'uuid';
import { DbWidgetKey } from '../model/widget-key/sql';
import { WidgetKeyType } from '../model/widget-def/interface';
import { WidgetKeyAndTypeData } from '../model/widget-key';
import { WsHandler } from '../utils/ws/base-handler';
import { SelectNotesWsHandler } from './select-notes';

const webSocketHandlers = {
  charSheet: SelectNotesWsHandler,
  charStatus: SelectNotesWsHandler,
  charStatusBorders: SelectNotesWsHandler,
  charHp: SelectNotesWsHandler,
};

const handlers: Partial<{ [type: string]: WsHandler<{}> }> = {};

export interface WssGreetingMsg {
  widgetId: DbWidgetKey['widgetKeyId'];
}

export enum CloseEventCode {
  PROTOCOL_ERROR = 1002,
  UNSUPPORTED_DATA = 1003,
}

export type WebSocketHandlerType = keyof typeof webSocketHandlers;

export function createWebSocketHandler(
  ws: WebSocket,
  widgetKeyId: DbWidgetKey['widgetKeyId'],
  widget: WidgetKeyData<WidgetKeyType>
): WsHandler<{}> {
  const { type } = widget;
  const Handler = webSocketHandlers[type];
  if (!Handler) {
    throw new Error(`Unknown WebSocketHandler type ${type}`);
  }

  let handler = handlers[widgetKeyId];
  if (!handler) {
    handler = new Handler(type, widgetKeyId, widget);
    handlers[widgetKeyId] = handler;
  }

  handler.addSocket(ws);

  return handler;
}

export function isValidGreetingMsg(data: unknown): data is WssGreetingMsg {
  try {
    return validate((data as WssGreetingMsg).widgetId);
  } catch (e) {
    return false;
  }
}
