import { generateUniqueId, getDb } from '../../utils/db';
import { getSystemNotePcFields } from '../global';
import { selectNote } from '../note';
import { DbUser } from '../user/sql';
import { UserAuthData } from '../user';
import { DbWidgetKey, sql } from './sql';
import {
  WidgetKeyType as WKT,
  WidgetKeyTypeData,
  WidgetProps,
} from './interface';

export type WidgetKeyType = WKT;

export interface WidgetKeyData<T extends WidgetKeyType> {
  widgetKeyId: DbWidgetKey['widgetKeyId'];
  type: WidgetKeyType;
  name: string;
  userId: DbUser['userId'];
  data: WidgetKeyTypeData[T];
}

export async function createWidgetKey<T extends WidgetKeyType>(
  user: UserAuthData,
  type: T,
  name: string,
  data: WidgetKeyTypeData[T]
): Promise<DbWidgetKey['widgetKeyId']> {
  const db = await getDb();
  const widgetKeyId = generateUniqueId();
  const params = {
    widgetKeyId,
    type,
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
): Promise<WidgetKeyData<T>> {
  const db = await getDb();
  const res = await sql.selectWidgetKey(db, { widgetKeyId });

  if (!res) {
    throw new Error('No key found with the provided ID');
  }

  const data = JSON.parse(res.data) as WidgetKeyTypeData[T];
  return {
    widgetKeyId,
    data,
    name: res.name,
    type: res.type,
    userId: res.userId,
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
      type: row.type,
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
      type: row.type,
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
