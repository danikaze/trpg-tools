export const INTERNAL_ID = 'INT(10) UNSIGNED NOT NULL';
export const PUBLIC_ID = 'CHAR(36) NOT NULL';
export const LOCAL_SALT_SIZE = 16;
export const IMAGE_URL_ROWTYPE = `VARCHAR(255) NOT NULL DEFAULT ''`;
export const TIMESTAMP = 'INT(10) UNSIGNED NOT NULL';
export const EDIT_TIME_COLS = `createdOn ${TIMESTAMP}, updatedOn ${TIMESTAMP}`;
