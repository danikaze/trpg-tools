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

/** Maximum length for Game.name */
export const GAME_NAME_MAX_CHARS = 255;
/** Maximum length for Game.description */
export const GAME_DESC_MAX_CHARS = 2000;

/*
 * Treasure generator
 */
export const TREASURE_CR_QUANTITY_MIN = 1;
export const TREASURE_CR_QUANTITY_MAX = 99;
