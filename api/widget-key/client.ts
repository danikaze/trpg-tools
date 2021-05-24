import { DbWidgetKey } from '@model/widget-key/sql';
import { DbNote } from '@model/note/sql';
import { callApi } from '@utils/call-api';
import {
  CreateWidgetKeyResponse,
  CreateWidgetKeyQuery,
  CreateWidgetKeyBody,
  DeleteWidgetKeyBody,
  DeleteWidgetKeyQuery,
  DeleteWidgetKeyResponse,
  UpdateWidgetKeyResponse,
  UpdateWidgetKeyBody,
  UpdateWidgetKeyQuery,
} from './interface';

export async function callCreateWidgetKey(
  widgetDefId: DbWidgetKey['widgetDefId'],
  name: string,
  noteId: DbNote['noteId']
): Promise<CreateWidgetKeyResponse> {
  const res = await callApi<
    CreateWidgetKeyResponse,
    CreateWidgetKeyQuery,
    CreateWidgetKeyBody
  >(`widget-key`, 'POST', {
    data: {
      widgetDefId,
      name,
      noteId,
    },
  });

  return res.data;
}

export async function callUpdateWidgetKeyApi(
  widgetKeyId: DbWidgetKey['widgetKeyId'],
  name: DbWidgetKey['name']
): Promise<UpdateWidgetKeyResponse> {
  const res = await callApi<
    UpdateWidgetKeyResponse,
    UpdateWidgetKeyQuery,
    UpdateWidgetKeyBody
  >(`widget-key/${widgetKeyId}`, 'PUT', { data: { name } });

  return res.data;
}

export async function callDeleteWidgetKeyApi(
  widgetKeyId: DbWidgetKey['widgetKeyId']
): Promise<DeleteWidgetKeyResponse> {
  const res = await callApi<
    DeleteWidgetKeyResponse,
    DeleteWidgetKeyQuery,
    DeleteWidgetKeyBody
  >(`widget-key/${widgetKeyId}`, 'DELETE');

  return res.data;
}
