import { generateUniqueId, getDb, getTimestamp } from '../../utils/db';
import { getSystemNotePcFields } from '../global';
import { selectNote } from '../note';
import { UserAuthData } from '../user';
import { DbWidgetDef, DbWidgetDefImage, sql } from './sql';
import { WidgetKeyType, WidgetKeyTypeData, WidgetProps } from './interface';
import { DbImage, DbImageThumbnail } from '@model/image/sql';

export interface CreateWidgetDefData {
  type: WidgetKeyType;
  name: string;
  html: DbWidgetDef['html'];
  js: DbWidgetDef['js'];
  css: DbWidgetDef['css'];
  images: Pick<DbWidgetDefImage, 'imageId' | 'name'>[];
}

export interface UpdateWidgetDefData extends CreateWidgetDefData {
  widgetDefId: DbWidgetDef['widgetDefId'];
}

export type UpdateWidgetDefReturnData = Pick<DbWidgetDef, 'updatedOn'>;

export interface SelectWidgetDefData {
  widgetDefId: DbWidgetDef['widgetDefId'];
  type: DbWidgetDef['type'];
  name: DbWidgetDef['name'];
  userId: DbWidgetDef['userId'];
  html: DbWidgetDef['html'];
  js: DbWidgetDef['js'];
  css: DbWidgetDef['css'];
  updatedOn: DbWidgetDef['updatedOn'];
  images: SelectWidgetDefImageData[];
}

export interface SelectWidgetDefImageData {
  name: DbWidgetDefImage['name'];
  imageId: DbImage['imageId'];
  path: DbImageThumbnail['path'];
}

export type SelectAllWidgetDefData = Pick<
  SelectWidgetDefData,
  'widgetDefId' | 'type' | 'name' | 'userId'
>;

export type CreateWidgetDefReturnData = Pick<
  SelectWidgetDefData,
  'widgetDefId' | 'updatedOn'
>;

export async function createWidgetDef(
  user: UserAuthData,
  widgetDef: CreateWidgetDefData
): Promise<CreateWidgetDefReturnData> {
  const db = await getDb();
  const widgetDefId = generateUniqueId();
  const userId = user.userId;
  const time = getTimestamp();
  const params = {
    widgetDefId,
    userId,
    time,
    ...widgetDef,
  };

  db.transaction(async () => {
    await sql.insertWidgetDef(db, params);
    widgetDef.images.forEach((img) => {
      sql.insertWidgetDefImage(db, {
        ...img,
        widgetDefId,
      });
    });
  });

  return {
    widgetDefId: params.widgetDefId,
    updatedOn: time,
  };
}

export async function updateWidgetDef(
  user: UserAuthData,
  lastUpdate: DbWidgetDef['updatedOn'],
  widgetDef: UpdateWidgetDefData
): Promise<UpdateWidgetDefReturnData> {
  const db = await getDb();
  const updatedOn = getTimestamp();

  const res = await sql.updateWidgetDef(db, {
    ...widgetDef,
    lastUpdate,
    updatedOn,
    userId: user.userId,
  });

  if (!res.affectedRows) {
    throw new Error(
      'No widget definition found to update, not enough permissions or the note was updated somewhere else'
    );
  }

  return { updatedOn };
}

export async function deleteWidgetDef(
  user: UserAuthData,
  widgetDefId: DbWidgetDef['widgetDefId']
): Promise<void> {
  const db = await getDb();
  const res = await sql.deleteWidgetDef(db, {
    widgetDefId,
    userId: user.userId,
  });

  if (!res.affectedRows) {
    throw new Error(
      'No widget definition found to delete or not enough permissions'
    );
  }
}

export async function selectWidgetDef(
  user: UserAuthData,
  widgetDefId: DbWidgetDef['widgetDefId']
): Promise<SelectWidgetDefData> {
  const db = await getDb();
  const res = await sql.selectWidgetDef(db, {
    widgetDefId,
    userId: user.userId,
  });

  if (!res) {
    throw new Error('No widget def found with the provided ID');
  }

  const images = await sql.selectWidgetDefImages(db, { widgetDefId });

  return {
    widgetDefId,
    name: res.name,
    type: res.type,
    userId: res.userId,
    html: res.html,
    js: res.js,
    css: res.css,
    updatedOn: res.updatedOn,
    images: images.map((img) => ({
      name: img.name,
      imageId: img.imageId,
      path: img.path,
    })),
  };
}

export async function selectAllUserWidgetDefs(
  user: UserAuthData
): Promise<SelectAllWidgetDefData[]> {
  const db = await getDb();
  const res = await sql.selectAllUserWidgetDefs(db, {
    userId: user.userId,
  });

  return res.map((row) => {
    return {
      type: row.type,
      name: row.name,
      widgetDefId: row.widgetDefId,
      userId: row.userId,
    };
  });
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
