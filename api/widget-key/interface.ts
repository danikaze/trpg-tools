import { DbNote } from '@model/note/sql';
import { DbWidgetKey } from '@model/widget-key/sql';

export type CreateWidgetKeyResponse = DbWidgetKey['widgetKeyId'];
export type CreateWidgetKeyQuery = {};
export type CreateWidgetKeyBody = {
  type: DbWidgetKey['type'];
  name: DbWidgetKey['name'];
  noteId: DbNote['noteId'];
};

export type UpdateWidgetKeyResponse = {};
export type UpdateWidgetKeyQuery = {};
export type UpdateWidgetKeyBody = {
  name: DbWidgetKey['name'];
};

export type DeleteWidgetKeyResponse = {};
export type DeleteWidgetKeyQuery = {};
export type DeleteWidgetKeyBody = {};
