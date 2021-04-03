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
  type: DbWidgetKey['type'],
  name: string,
  noteId: DbNote['noteId']
): Promise<CreateWidgetKeyResponse> {
  const res = await callApi<
    CreateWidgetKeyResponse,
    CreateWidgetKeyQuery,
    CreateWidgetKeyBody
  >(`widget-key`, 'POST', {
    data: {
      type,
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
    UpdateWidgetKeyBody,
    UpdateWidgetKeyQuery,
    UpdateWidgetKeyResponse
  >(`widget-key/${widgetKeyId}`, 'PUT', { data: { name } });

  return res.data;
}

export async function callDeleteWidgetKeyApi(
  widgetKeyId: DbWidgetKey['widgetKeyId']
): Promise<DeleteWidgetKeyResponse> {
  const res = await callApi<
    DeleteWidgetKeyBody,
    DeleteWidgetKeyQuery,
    DeleteWidgetKeyResponse
  >(`widget-key/${widgetKeyId}`, 'DELETE');

  return res.data;
}
