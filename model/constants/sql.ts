export const TEXT_MAX_LENGTH = 2000;

export const MYSQL_TYPE_INTERNAL_ID = 'INT(10) UNSIGNED';
export const MYSQL_TYPE_PUBLIC_ID = 'CHAR(36)';
export const MYSQL_TYPE_TEXT = `VARCHAR(${TEXT_MAX_LENGTH})`;
export const MYSQL_TYPE_TIMESTAMP = 'INT(10) UNSIGNED NOT NULL';
export const MYSQL_TYPE_ENUM = 'VARCHAR(64)';
export const MYSQL_TYPE_IMAGE_WH = 'SMALLINT';

export const EDIT_TIME_COLS = `createdOn ${MYSQL_TYPE_TIMESTAMP},
    updatedOn ${MYSQL_TYPE_TIMESTAMP},
    INDEX updatedOn_idx (updatedOn)`;

export const GAME_SHARE_LINK_LENGTH = 32;
export const GAME_SHARE_LINK_CHARSET =
  '1234567890' + 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
