const { app, BrowserWindow, ipcMain, dialog } = require('electron')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

const { IPC_CHANNELS } = require('./enums');
const { startCapture, mouseEvent, keyEvent } = require('./components/ScreenShot');
const { uploadToS3 } = require('./components/UploadAws3');
const { loginAPI } = require('./components/api');
const path = require('path');
const ioHook = require('iohook');
const md5 = require("blueimp-md5");

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 330,
    height: 680,
    icon: path.join(__dirname, 'assets/icon.ico'),
    autoHideMenuBar: true,
    backgroundColor: '#ffff',
    fullscreenable: true,
    titleBarStyle: 'customButtonsOnHover',
    transparent: true,
    frame: true,
    roundedCorners: false,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.


var employeeData = null;

// login
ipcMain.on(IPC_CHANNELS.SIGNIN, (event, username, password) => {

  if (username && password) {
    let cryptPassword = md5(password);

    loginAPI(username, cryptPassword, function (res, data) { // to get Employee Data
      if (res.statusCode == '200') {
        employeeData = JSON.parse(data);
        event.sender.send(IPC_CHANNELS.MAIN_START, employeeData);
      } else {
        const options = {
          type: 'info',
          message: data
        };
        dialog.showMessageBox(null, options);
      }
    });
  }
  else {
    const options = {
      type: 'info',
      message: 'Username or password is required!'
    };
    dialog.showMessageBox(null, options);
  }
});

// capture image
ipcMain.on(IPC_CHANNELS.SCREENSHOT, (e,
  {
  } = {}) => {
  startCapture(e, employeeData, uploadToS3);
});

ioHook.on('mousemove', (event) => {
  mouseEvent();
});

ioHook.on('keydown', (event) => {
  keyEvent();
});

// Register and start hook
ioHook.start();

// Alternatively, pass true to start in DEBUG mode.
ioHook.start(true);

  // False to disable DEBUG. Cleaner terminal output.
  // ioHook.start(false);