// max size of the header of a file (i.e. "data:image/jpeg;base64,") in bytes
const FILE_HEADER_SIZE_B = 64;

const GAME_IMAGE_MAX_SIZE_B = 1e6; // 1mb
const NOTE_IMAGE_MAX_SIZE_B = 1e6; // 1mb
const BODY_MAX_SIZE_B = FILE_HEADER_SIZE_B + Math.max(GAME_IMAGE_MAX_SIZE_B);

module.exports = {
  GAME_IMAGE_MAX_SIZE_B,
  NOTE_IMAGE_MAX_SIZE_B,
  BODY_MAX_SIZE_B,
  I18N_OPTIMIZED_NAMESPACES_ENABLED: true,
  AUTH_ENABLED: true,
  AUTH_LOGIN_PAGE: '/login',
  AUTH_LOGIN_SUCCESS_PAGE: '/?logged=1',
  AUTH_LOGIN_FAIL_PAGE: '/login?fail=1',
  AUTH_LOGOUT_PAGE: '/login?logout',
  AUTH_DO_LOGOUT_URL: '/auth/logout',
  AUTH_LOGIN_REDIRECT_PARAM: 'r',
  AUTH_FORBIDDEN_PAGE: '/forbidden',
  AUTH_LOCAL_DO_LOGIN_URL: '/auth/local/login',
  AUTH_TWITTER_LOGIN_PAGE: '/auth/twitter',
  WEB_SOCKET_PATH: '/ws',
  WEB_SOCKET_PORT: 8089,
};
