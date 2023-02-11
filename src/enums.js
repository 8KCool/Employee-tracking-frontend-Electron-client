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

const IPC_URL = {
  LOGIN_URL: 'https://100.100.100.100',
}

module.exports = {
  IPC_CHANNELS,
  CREDENTIALS,
  IPC_URL
};