const IPC_CHANNELS = {
    SCREENSHOT: 'screenshot',
    SCREENSHOT_COMPLETE: 'screenshot-complete',
    SCREENSHOT_CANCEL: 'screenshot-cancel',
    SCREENSHOT_HIDE_CURRENT_WINDOW: 'hide-current-window',
    SCREENSHOT_CLOSE_CURRENT_WINDOW: 'close-current-window',
    SCREENSHOT_SAVE_DIR: 'screenshot-save-dir',
    ALERT_MSG: 'alert-msg',
    PLAY_STATE: 'play-state',
    SIGNIN: 'signin',
    SIGNIN_REPLY: 'signin_reply',
    MAIN_START: 'main_start'
  };

const CREDENTIALS = {
  accessKeyId: "AKIAUUC6CHKCYAO6POXS",
  secretAccessKey: "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"
};

// const IPC_URL = {
//   WEBSERVER_URL: 'http://localhost:5000',
//   VERIFYUSER_URL: '/api/verifyUser',
//   GETCURRENTSTATE_URL: '/api/get_current_state',
//   UPLOADSTATE_URL: '/api/upload_state',
// }

const IPC_URL = {
    WEBSERVER_URL: 'http://api.workship.in',
    VERIFYUSER_URL: '/auth/login',
    GETCURRENTSTATE_URL: '/api/get_current_state',
    UPLOADSTATE_URL: '/api/upload_state',
  }

module.exports = {
  IPC_CHANNELS,
  CREDENTIALS,
  IPC_URL
};