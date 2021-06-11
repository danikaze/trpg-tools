import { generateUniqueId, getDb } from '@utils/db';
import { getSystemNotePcFields } from '@model/global';
import { selectNote } from '@model/note';
import { DbUser } from '@model/user/sql';
import { UserAuthData } from '@model/user';
import { DbWidgetDef, sql as widgetDefSql } from '@model/widget-def/sql';
import {
  WidgetKeyType,
  WidgetKeyTypeData,
  WidgetProps,
} from '@model/widget-def/interface';
import { SelectWidgetDefData } from '@model/widget-def';
import { DbWidgetKey, sql } from './sql';

export interface WidgetKeyData<T extends WidgetKeyType> {
  widgetKeyId: DbWidgetKey['widgetKeyId'];
  widgetDefId: DbWidgetDef['widgetDefId'];
  name: string;
  userId: DbUser['userId'];
  data: WidgetKeyTypeData[T];
}

export interface WidgetKeyAndTypeData<T extends WidgetKeyType>
  extends WidgetKeyData<T> {
  type: T;
  html: string;
  js: string;
  css: string;
  images: SelectWidgetDefData['images'];
}

export async function createWidgetKey<T extends WidgetKeyType>(
  user: UserAuthData,
  widgetDefId: DbWidgetDef['widgetDefId'],
  name: string,
  data: WidgetKeyTypeData[T]
): Promise<DbWidgetKey['widgetKeyId']> {
  const db = await getDb();
  const widgetKeyId = generateUniqueId();
  const params = {
    widgetKeyId,
    widgetDefId,
    name,
    userId: user.userId,
    data: JSON.stringify(data),
  };
  await sql.insertWidgetKey(db, params);

  return params.widgetKeyId;
}

export async function deleteWidgetKey(
  user: UserAuthData,
  widgetKeyId: DbWidgetKey['widgetKeyId']
): Promise<void> {
  const db = await getDb();
  const res = await sql.deleteWidgetKey(db, {
    widgetKeyId,
    userId: user.userId,
  });

  if (!res.affectedRows) {
    throw new Error('No key found to delete or not enough permissions');
  }
}

export async function selectWidgetKey<T extends WidgetKeyType>(
  widgetKeyId: DbWidgetKey['widgetKeyId']
): Promise<WidgetKeyAndTypeData<T>> {
  const db = await getDb();
  const res = await sql.selectWidgetKey(db, { widgetKeyId });

  if (!res) {
    throw new Error('No key found with the provided ID');
  }

  const images = await widgetDefSql.selectWidgetDefImages(db, {
    widgetDefId: res.widgetDefId,
  });

  const data = JSON.parse(res.data) as WidgetKeyTypeData[T];
  return {
    widgetKeyId,
    data,
    type: res.type as T,
    widgetDefId: res.widgetDefId,
    name: res.name,
    userId: res.userId,
    html: res.html,
    js: res.js,
    css: res.css,
    images: images.map((img) => ({
      name: img.name,
      imageId: img.imageId,
      path: img.path,
    })),
  };
}

export async function selectAllUserWidgetKeys<T extends WidgetKeyType>(
  user: UserAuthData
): Promise<WidgetKeyData<T>[]> {
  const db = await getDb();
  const res = await sql.selectAllUserWidgetKeys(db, {
    userId: user.userId,
  });

  return res.map((row) => {
    const data = JSON.parse(row.data);

    return {
      data,
      widgetDefId: row.widgetDefId,
      name: row.name,
      widgetKeyId: row.widgetKeyId,
      userId: user.userId,
    };
  });
}

export async function selectUserWidgetKeys<T extends WidgetKeyType>(
  user: UserAuthData,
  types: T[]
): Promise<WidgetKeyData<T>[]> {
  const db = await getDb();
  const res = await sql.selectUserWidgetKeys(db, {
    types,
    userId: user.userId,
  });

  return res.map((row) => {
    const data = JSON.parse(row.data);

    return {
      data,
      widgetDefId: row.widgetDefId,
      name: row.name,
      widgetKeyId: row.widgetKeyId,
      userId: user.userId,
    };
  });
}

export async function renameWidgetKey(
  user: UserAuthData,
  widgetKeyId: DbWidgetKey['widgetKeyId'],
  name: DbWidgetKey['name']
): Promise<void> {
  const db = await getDb();

  const res = await sql.renameWidgetKey(db, {
    widgetKeyId,
    name,
    userId: user.userId,
  });

  if (!res.affectedRows) {
    throw new Error('No key found with the provided ID');
  }
}

export async function getWidgetData<T extends WidgetKeyType>(
  user: UserAuthData,
  type: T,
  data: WidgetKeyTypeData[T]
): Promise<WidgetProps[T]> {
  const note = await selectNote(user, data.noteId);
  const fields = await getSystemNotePcFields();

  return {
    note,
    fields,
  } as WidgetProps[T];
}
