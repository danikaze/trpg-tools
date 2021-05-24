import { DbWidgetDef } from '@model/widget-def/sql';
import { CreateWidgetDefData } from '@model/widget-def';
import { callApi } from '@utils/call-api';
import {
  CreateWidgetDefResponse,
  CreateWidgetDefQuery,
  CreateWidgetDefBody,
  DeleteWidgetDefBody,
  DeleteWidgetDefQuery,
  DeleteWidgetDefResponse,
  UpdateWidgetDefResponse,
  UpdateWidgetDefBody,
  UpdateWidgetDefQuery,
} from './interface';

export async function callCreateWidgetDef(
  widgetDef: CreateWidgetDefData
): Promise<CreateWidgetDefResponse> {
  const res = await callApi<
    CreateWidgetDefResponse,
    CreateWidgetDefQuery,
    CreateWidgetDefBody
  >(`widget-def`, 'POST', {
    data: widgetDef,
  });

  return res.data;
}

export async function callUpdateWidgetDefApi(
  widgetDefId: DbWidgetDef['widgetDefId'],
  widgetDef: CreateWidgetDefData,
  lastUpdate: DbWidgetDef['updatedOn']
): Promise<UpdateWidgetDefResponse> {
  const res = await callApi<
    UpdateWidgetDefResponse,
    UpdateWidgetDefQuery,
    UpdateWidgetDefBody
  >(`widget-def/${widgetDefId}`, 'PUT', {
    data: {
      ...widgetDef,
      lastUpdate,
    },
  });

  return { updatedOn: res.data.updatedOn };
}

export async function callDeleteWidgetDefApi(
  widgetDefId: DbWidgetDef['widgetDefId']
): Promise<DeleteWidgetDefResponse> {
  const res = await callApi<
    DeleteWidgetDefResponse,
    DeleteWidgetDefQuery,
    DeleteWidgetDefBody
  >(`widget-def/${widgetDefId}`, 'DELETE');

  return res.data;
}
