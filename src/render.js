
const { ipcRenderer } = require('electron');
const { Timer } = require('timer-node');
const timer = new Timer({ label: 'test-timer' });

const { IPC_CHANNELS } = require('./enums');

const startCapture = document.getElementById('startCapture');


const loginpage = document.getElementById('loginpage');
const mainpage = document.getElementById('mainpage');
const capturefield = document.getElementById('capturefield');


const realTime = document.getElementById('realtime');
const folder = document.getElementById('folder');

startCapture.addEventListener('click', e => {
  ipcRenderer.send(IPC_CHANNELS.SCREENSHOT);
});

folder.addEventListener('click', e => {
  ipcRenderer.send(IPC_CHANNELS.SCREENSHOT_SAVE_DIR);
});

// show alert message
ipcRenderer.on(IPC_CHANNELS.ALERT_MSG, (e, {
  msg
} = {}) => {
  alert(msg);
});

let flag = 0;
ipcRenderer.on(IPC_CHANNELS.SCREENSHOT_COMPLETE, (e, {
  count, path
} = {}) => {
});

// mainpage start
ipcRenderer.on(IPC_CHANNELS.MAIN_START, (e, employeeData) => {
  mainpage.classList.remove('display-hide');
  loginpage.classList.add('display-hide');
  capturefield.innerHTML = employeeData.name;
});


// listener changed play state
ipcRenderer.on(IPC_CHANNELS.PLAY_STATE, (e, {
  state
} = {}) => {
  if (state == "played") {
    if (flag == 0) {
      timer.start();
      flag = 1;
    } else timer.resume();
    startCapture.classList.remove('btn-start-capture');
    startCapture.classList.add('btn-stop-capture');
    realTime.classList.remove('start-time-text');
    realTime.classList.add('stop-time-text');
    setInterval(setRealtimeFunc, 1000);
  }
  else if (state == "stopped") {
    timer.pause();
    startCapture.classList.remove('btn-stop-capture');
    startCapture.classList.add('btn-start-capture');
    realTime.classList.remove('stop-time-text');
    realTime.classList.add('start-time-text');
  }
});

var hh = 0, mm = 0, ss = 0;
function setRealtimeFunc() {
  if (timer.time().h < 10) hh = '0' + timer.time().h;
  else hh = timer.time().h;
  if (timer.time().m < 10) mm = '0' + timer.time().m;
  else mm = timer.time().m;
  if (timer.time().s < 10) ss = '0' + timer.time().s;
  else ss = timer.time().s;
  document.getElementById('realtime').innerHTML = hh + ' : ' + mm + ' : ' + ss;
}