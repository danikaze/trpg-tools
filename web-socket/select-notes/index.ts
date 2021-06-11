import { WebSocketHandlerType } from '..';
import { selectNote } from '@model/note';
import { DbNote } from '@model/note/sql';
import { UserAuthData } from '@model/user';
import { DbWidgetKey } from '@model/widget-key/sql';
import { WidgetKeyType } from '@model/widget-def/interface';
import { WidgetKeyData } from '@model/widget-key';
import { WsHandler } from '@utils/ws/base-handler';
import { WIDGET_UPDATE_INTERVAL } from '@utils/constants';

export class SelectNotesWsHandler extends WsHandler<{}> {
  protected ready: Promise<void>;
  protected intervalHandler: number | undefined;
  protected noteId: DbNote['noteId'];
  protected user: UserAuthData;
  protected lastMsg: string | undefined;

  constructor(
    type: WebSocketHandlerType,
    widgetKeyId: DbWidgetKey['widgetKeyId'],
    widget: WidgetKeyData<WidgetKeyType>
  ) {
    super(type, widgetKeyId, widget);

    this.noteId = widget.data.noteId;
    this.user = { userId: widget.userId } as UserAuthData;
    this.ready = Promise.resolve();
  }

  protected isReady = async () => this.ready;

  protected onFirstConnection = () => {
    setInterval(this.pollData, WIDGET_UPDATE_INTERVAL);
  };

  protected onLastClose = () => {
    clearInterval(this.intervalHandler);
  };

  protected onTerminate = async () => {
    clearInterval(this.intervalHandler);
  };

  private readonly pollData = async () => {
    const data = await selectNote(this.user, this.noteId);
    if (!data) {
      this.endHandler();
      return;
    }
    const msg = JSON.stringify(data);
    if (this.lastMsg === msg) return;
    this.lastMsg = msg;
    this.broadcast(msg);
  };
}
