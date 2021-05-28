import {
  CreateWidgetDefData,
  UpdateWidgetDefReturnData,
} from '@model/widget-def';
import { DbWidgetDef } from '@model/widget-def/sql';

export type CreateWidgetDefResponse = {
  widgetDefId: DbWidgetDef['widgetDefId'];
};
export type CreateWidgetDefQuery = {};
export type CreateWidgetDefBody = CreateWidgetDefData;

export type UpdateWidgetDefResponse = UpdateWidgetDefReturnData;
export type UpdateWidgetDefQuery = {};
export type UpdateWidgetDefBody = CreateWidgetDefData & {
  lastUpdate: DbWidgetDef['updatedOn'];
};

export type DeleteWidgetDefResponse = {};
export type DeleteWidgetDefQuery = {};
export type DeleteWidgetDefBody = {};
