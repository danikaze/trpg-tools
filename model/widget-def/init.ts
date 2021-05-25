import { basename, join } from 'path';
import { DbInitFunction } from '../../utils/mysql';
import { storeImageInDb } from '../../utils/store-image-in-db';
import {
  WIDGET_DEF_IMAGE_NAME_MAX_LENGTH,
  WIDGET_DEF_NAME_MAX_LENGTH,
} from '../../utils/constants';
import {
  EDIT_TIME_COLS,
  MYSQL_TYPE_ENUM,
  MYSQL_TYPE_INTERNAL_ID,
  MYSQL_TYPE_PUBLIC_ID,
} from '../constants/sql';
import { DbImage } from '../image/sql';
import { SYSTEM_USER } from '../user';
import { createWidgetDef } from '.';

import { html as pjBordersHtml } from './system/pj-borders/html';
import { css as pjBordersCss } from './system/pj-borders/css';
import { js as pjBordersJs } from './system/pj-borders/js';

import { html as pjHpHtml } from './system/pj-hp/html';
import { css as pjHpCss } from './system/pj-hp/css';
import { js as pjHpJs } from './system/pj-hp/js';

import { html as pjSheetHtml } from './system/pj-sheet/html';
import { css as pjSheetCss } from './system/pj-sheet/css';
import { js as pjSheetJs } from './system/pj-sheet/js';
import { DbWidgetDef } from './sql';

export type SystemWidgetDef = 'charStatusBorders' | 'charHp' | 'charSheet';
export const systemWidgetDefIds = {} as Record<
  SystemWidgetDef,
  DbWidgetDef['widgetDefId']
>;

export const initWidgetDefs: DbInitFunction = async (db) => {
  const sql = [
    `
    CREATE TABLE IF NOT EXISTS widget_defs (
      widgetDefId ${MYSQL_TYPE_PUBLIC_ID} PRIMARY KEY,
      userId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      type ${MYSQL_TYPE_ENUM} NOT NULL,
      name VARCHAR(${WIDGET_DEF_NAME_MAX_LENGTH}) NOT NULL,
      html TEXT NOT NULL,
      js TEXT NOT NULL,
      css TEXT NOT NULL,
      ${EDIT_TIME_COLS},

      FOREIGN KEY (userId)
        REFERENCES users(userId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )
    `,
    `
    CREATE TABLE IF NOT EXISTS widget_def_images (
      widgetDefId ${MYSQL_TYPE_PUBLIC_ID} NOT NULL,
      imageId ${MYSQL_TYPE_INTERNAL_ID} NOT NULL,
      name VARCHAR(${WIDGET_DEF_IMAGE_NAME_MAX_LENGTH}) NOT NULL,

      INDEX imageId_type_idx (widgetDefId, name),

      FOREIGN KEY (widgetDefId)
        REFERENCES widget_defs(widgetDefId)
        ON UPDATE CASCADE
        ON DELETE CASCADE,

        FOREIGN KEY (imageId)
        REFERENCES images(imageId)
        ON UPDATE CASCADE
        ON DELETE CASCADE
    )
    `,
  ];

  await db.executeSyncSql(
    sql,
    `${basename(__dirname)}/${basename(__filename)}`
  );

  // Store images into the database
  const imageNames = [
    'ac-bg.png',
    'broken-glass.png',
    'sheet-bg.png',
    'stat-bg.png',
  ] as const;

  const imageIds = (
    await Promise.all(
      imageNames.map((img) =>
        storeImageInDb(SYSTEM_USER, join(__dirname, 'system', 'images', img), [
          'widgetDef',
        ])
      )
    )
  ).reduce((all, image, i) => {
    all[imageNames[i]] = image.imageId;
    return all;
  }, {} as { [img in typeof imageNames[number]]: DbImage['imageId'] });

  // charStatusBorders
  systemWidgetDefIds.charStatusBorders = (
    await createWidgetDef(SYSTEM_USER, {
      type: 'charNote',
      name: 'Character Status Borders',
      html: pjBordersHtml,
      css: pjBordersCss,
      js: pjBordersJs,
      images: [{ name: 'Broken Glass', imageId: imageIds['broken-glass.png'] }],
    })
  ).widgetDefId;

  // charHp
  systemWidgetDefIds.charHp = (
    await createWidgetDef(SYSTEM_USER, {
      type: 'charNote',
      name: 'Character HP',
      html: pjHpHtml,
      css: pjHpCss,
      js: pjHpJs,
      images: [],
    })
  ).widgetDefId;

  // charSheet
  systemWidgetDefIds.charSheet = (
    await createWidgetDef(SYSTEM_USER, {
      type: 'charNote',
      name: 'Character Sheet',
      html: pjSheetHtml,
      css: pjSheetCss,
      js: pjSheetJs,
      images: [
        { name: 'Armor Class BG', imageId: imageIds['ac-bg.png'] },
        { name: 'Character sheet BG', imageId: imageIds['sheet-bg.png'] },
        { name: 'Stat value BG', imageId: imageIds['stat-bg.png'] },
      ],
    })
  ).widgetDefId;
};
