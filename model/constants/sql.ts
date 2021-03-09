export const INTERNAL_ID = 'INT(10) UNSIGNED';
export const PUBLIC_ID = 'CHAR(36)';
export const LOCAL_SALT_SIZE = 16;
export const TIMESTAMP = 'INT(10) UNSIGNED NOT NULL';
export const EDIT_TIME_COLS = `createdOn ${TIMESTAMP},
    updatedOn ${TIMESTAMP},
    INDEX updatedOn_idx (updatedOn)`;
export const ENUM_TYPE = 'VARCHAR(64)';

export const GAME_SHARE_LINK_LENGTH = 16;
export const GAME_SHARE_LINK_CHARSET =
  '1234567890' + 'abcdefghijklmnopqrstuvwxyz' + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
