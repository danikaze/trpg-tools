import * as WebSocket from 'ws';
import { WidgetKeyType } from '@model/widget-def/interface';
import { WidgetKeyData } from '@model/widget-key';
import { getLogger, NsLogger } from '../logger';

export abstract class WsHandler<M extends {}> {
  protected readonly sockets: WebSocket[] = [];
  protected readonly type: string;
  protected readonly widgetId: string;
  protected readonly widget: WidgetKeyData<WidgetKeyType>;
  protected readonly logger: NsLogger;

  constructor(
    type: string,
    widgetId: string,
    widget: WidgetKeyData<WidgetKeyType>
  ) {
    this.type = type;
    this.widgetId = widgetId;
    this.widget = widget;
    this.logger = getLogger(`WsHandler:${type}`);
  }

  public async addSocket(ws: WebSocket) {
    try {
      await this.isReady();
    } catch (e) {
      return this.endHandler();
    }
    this.sockets.push(ws);
    this.logger.debug(
      `New connection (${this.sockets.length}) [${this.widgetId}]`
    );

    ws.on('message', this.handleMessage);
    ws.onclose = () => this.closeSocket(ws);

    if (!IS_PRODUCTION) {
      const handleDebug = (type: string) => {
        this.logger.debug(`${type} received`);
      };

      ws.on('error', handleDebug);
      ws.on('upgrade', handleDebug);
      ws.on('open', handleDebug);
      ws.on('ping', handleDebug);
      ws.on('unexpected-message', handleDebug);
      ws.on('upgrade', handleDebug);
    }

    if (this.sockets.length === 1) {
      this.onFirstConnection();
    }

    this.onNewConnection();
  }

  protected abstract isReady(): Promise<void>;

  protected broadcast<T extends string | {}>(msg: T): void {
    const data = typeof msg === 'string' ? msg : JSON.stringify(msg);

    for (const ws of this.sockets) {
      ws.send(data);
    }
  }

  protected async endHandler(): Promise<void> {
    if (this.sockets.length > 0) {
      while (this.sockets.length > 1) {
        const ws = this.sockets.pop()!;
        ws!.close();
      }
      this.onLastClose();
      const ws = this.sockets.pop()!;
      ws.close();
    }
    await this.onTerminate();
  }

  protected onNewConnection: () => void = () => {};
  protected onFirstConnection: () => void = () => {};
  protected onMessage: (message: M) => void = () => {};
  protected onClose: () => void = () => {};
  protected onLastClose: () => void = () => {};
  protected onTerminate: () => Promise<void> = async () => {};

  private closeSocket(ws: WebSocket) {
    this.onClose();
    if (this.sockets.length === 1) {
      this.onLastClose();
    }
    const index = this.sockets.indexOf(ws);
    this.sockets.splice(index, 1);
    this.logger.debug(
      `Socket (${index}) [${this.widgetId}] closed from client. ${this.sockets.length} remaining`
    );
  }

  private readonly handleMessage = (message: string): void => {
    try {
      const json = JSON.parse(message) as M;
      this.onMessage(json);
    } catch (e) {
      this.logger.error(`Error when parsing the message: ${message}`);
    }
  };
}
