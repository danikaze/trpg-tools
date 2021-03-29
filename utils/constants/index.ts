export const PRODUCT_NAME = 'TRPG Tools';

/** Folder where ALL the uploads will be stored */
const UPLOADS_FOLDER = 'uploads';
/** Folders where the uploaded images will be stored */
export const UPLOADS_IMG_FOLDER = `${UPLOADS_FOLDER}/images`;
/**
 * Folders where the thumbnails will be stored
 * {type} will be replaced by the `ImageType`
 */
export const THUMBNAILS_FOLDER = 'public/static/thumbs/{type}';

/** Public URLs are relative to this folder */
export const PUBLIC_URL_FOLDER = 'public';

export const UPLOAD_PATH_MAX_CHARS = 255;

/*
 * Users
 */
export const LOCAL_SALT_SIZE = 16;
export const USERNAME_MAX_CHARS = 32;
export const PASSWORD_MAX_CHARS = 255;
export const TWITTER_PROFILE_LENGTH = 36;

/*
 * Games
 */

/** Maximum length for Game.name */
export const GAME_NAME_MAX_CHARS = 255;
/** Maximum length for Game.description */
export const GAME_DESC_MAX_CHARS = 2000;

/*
 * Notes and fields
 */
export const FIELD_COL_NAME_MAX_LENGTH = 255;
export const NOTE_TYPE_COL_NAME_MAX_LENGTH = 255;
export const NOTE_COL_NAME_MAX_LENGTH = 255;
export const GAME_NOTE_TEXTFIELD_MAX_CHARS = 255;
export const GAME_NOTE_TEXTAREA_MAX_CHARS = 2000;
export const FIELD_TEXT_MAX_LENGTH = Math.max(
  GAME_NOTE_TEXTFIELD_MAX_CHARS,
  GAME_NOTE_TEXTAREA_MAX_CHARS
);

/*
 * Treasure generator
 */
export const TREASURE_CR_QUANTITY_MIN = 1;
export const TREASURE_CR_QUANTITY_MAX = 99;

/*
 * Widgets
 */
export const WIDGET_UPDATE_INTERVAL = 2000;
