
const capture = require('screenshot-desktop');
const { clearInterval } = require('timers');
const { IPC_CHANNELS } = require('./../enums');
const { getCurrentIdleState, updateActionAPI } = require('./api');
const robot = require("@jitsi/robotjs");

var fs = require('fs');
let count = 0, timerId = -1;
let lastEventTime = 0;
let lastMouseEventTime = 0;
let lastKeyEventTime = 0;
let mMouseIdleTotalTime = 0;
let mKeyIdleTotalTime = 0;
let mIdleTimeLimit = 0;
let startTime = 0;
let userData = null;
let currentShotCount = 0;
let currentShotArray = [];

const uploadMouseKeyAction = (type, idleTime = 0) => {
    let current = new Date().getTime();
    timeRange = (new Date().getTime() - startTime) / 1000;
    if (lastKeyEventTime == 0) {
        mKeyIdleTotalTime = timeRange;
        lastKeyEventTime = current;
    }
    if (lastMouseEventTime == 0) {
        mMouseIdleTotalTime = timeRange;
        lastMouseEventTime = current;
    }
    if (idleTime < mIdleTimeLimit) {
        idleTime = 0;
    }
    if (lastEventTime == 0) {
        idleTime = timeRange;
    }
    var updateData = {
        employeeData: userData,
        mouseIdleTime: mMouseIdleTotalTime + (current - lastMouseEventTime) / 1000,
        keyIdleTime: mKeyIdleTotalTime + (current - lastKeyEventTime) / 1000,
        timeRange: timeRange,
        type: type,
        idleTime: idleTime,
        s3shot_count: currentShotCount,
        s3shot_screen_array: currentShotArray
    }

    updateActionAPI(updateData, function (msg) {
        lastEventTime = 0;
        lastMouseEventTime = 0;
        lastKeyEventTime = 0;
        mMouseIdleTotalTime = 0;
        mKeyIdleTotalTime = 0;
        startTime = new Date().getTime();
    });
}

const mouseEvent = () => {

    if (timerId != -1) {
        checkMouseKeyBoardAction();
        let currentTime = new Date().getTime();
        if (lastEventTime == 0) {
            lastEventTime = currentTime;
        }
        if (lastMouseEventTime == 0) {
            lastMouseEventTime = currentTime;
        }
        var time = (currentTime - lastMouseEventTime) / 1000;
        if (time >= 1) {
            mMouseIdleTotalTime += time;
        }
        lastMouseEventTime = currentTime;
    }
}
const keyEvent = () => {
    if (timerId != -1) {
        checkMouseKeyBoardAction();
        let currentTime = new Date().getTime();
        if (lastEventTime == 0) {
            lastEventTime = currentTime;
        }
        if (lastKeyEventTime == 0) {
            lastKeyEventTime = currentTime;
        }

        var time = (currentTime - lastKeyEventTime) / 1000
        if (time >= 1) {
            mKeyIdleTotalTime += time;
        }
        lastKeyEventTime = currentTime;
    }
}


function checkMouseKeyBoardAction() {
    if (timerId != -1) {
        let currentTime = new Date().getTime();
        if (lastEventTime == 0) {
            lastEventTime = currentTime;
        }
        if ((currentTime - lastEventTime) / 1000 >= mIdleTimeLimit) {
            uploadMouseKeyAction("idle limit", (currentTime - lastEventTime) / 1000);
        }
        lastEventTime = currentTime;
    }
}

let currentState = null;
let timeOutArray = [];

/**  
 * function is to start capture
 * when play button is clicked
*/
const startCapture = (e, employeeData, uploadToS3) => {
    userData = employeeData;
    if (timerId == -1) {   // play capture
        mIdleTimeLimit = employeeData.idleTimeLimit;
        // 1. get current Capture State from server
        getCurrentIdleState(employeeData, function (res, data) {
            currentShotArray = [];
            currentShotCount = 0;

            currentState = JSON.parse(data);
            var firstData = {
                LeftTime: currentState.LeftTime,
                LeftCaptureCnt: employeeData.screenShotInterval - currentState.LeftCapture
            }
            console.log(firstData);
            currentState = firstData;
            startTime = new Date().getTime();
            // mouseCheck(employeeData, uploadToS3);
            e.sender.send(IPC_CHANNELS.PLAY_STATE, {
                state: "played"
            });
            timerId = 0;
            var leftTime = currentState.LeftTime;
            captureAuto(employeeData, uploadToS3);  // for left time

            timeOutArray.push(setTimeout(() => {   // to start 0s
                captureAuto(employeeData, uploadToS3);
                // mouseCheck(employeeData, uploadToS3);   /// first time limit ended
                uploadMouseKeyAction("end 1 section", (new Date().getTime() - lastEventTime) / 1000);

                timerId = setInterval(() => {
                    captureAuto(employeeData, uploadToS3);
                    uploadMouseKeyAction("end 1 section", (new Date().getTime() - lastEventTime) / 1000);
                    // mouseCheck(employeeData, uploadToS3); // time limit ended
                }, 60 * 10 * 1000);   // 10 mins = 60s * 10 
            }, leftTime * 1000));

        });
    } else {   // pause capture
        uploadMouseKeyAction("pause capture", (new Date().getTime() - lastEventTime) / 1000);
        console.log("clicked pause button");
        clearInterval(timerId);
        timeOutArray.forEach(element => {
            clearTimeout(element);
        });
        e.sender.send(IPC_CHANNELS.PLAY_STATE, {
            state: "stopped"
        });
        count = 0;
        timerId = -1;
    }
};

/**  
 * function is upload screenshot auto (random)
*/
let oldTime = 0;
const captureAuto = (employeeData, uploadToS3) => {  // this is random screenshot to upload
    for (var i = 0; i < currentState.LeftCaptureCnt; i++) {
        var time = getRandomInt(currentState.LeftTime);
        var timeOut = time + oldTime;
        console.log(timeOut);  // upload time during 1 minutes
        currentState.LeftTime -= time;
        if (timerId != -1) {
            timeOutArray.push(setTimeout(() => {
                console.log("start capture");
                if (timerId != -1) {
                    captureScreen(employeeData._id, uploadToS3);
                }
            }, timeOut * 1000));
            oldTime = timeOut;
        }
    }
    oldTime = 0;
    currentState.LeftTime = 600;
    currentState.LeftCaptureCnt = employeeData.screenShotInterval;
}

function getRandomInt(max) {
    max--;
    return Math.floor(Math.random() * max) + 1;
}


/**  
 * function is to get IdleTime of mouse
*/
// const getIdleTime = (idleTimeLimit, captureScreen) => {
//     let idleTime = (new Date().getTime() - lastEventTime) / 1000;
//     let timer = setInterval(() => {
//         if (idleTime < idleTimeLimit)
//             idleTime = (new Date().getTime() - lastEventTime) / 1000;
//         else {
//             console.log('start capturing');
//             clearInterval(timer);
//             captureScreen();
//         }
//     }, 1000);
// };

/**  
 * function is to capture screenshots and upload them to cloud storage
*/
const captureScreen = (employeeId, uploadToS3) => {
    capture.listDisplays().then(displays => {
        displays.forEach(display => {
            capture({ display: display.id }).then((image) => {
                if ((display.id === "\\\\.\\DISPLAY1") || (display.id === "\\\\.\\DISPLAY2")) {
                    let displayType = 1;
                    if (display.id === "\\\\.\\DISPLAY1") {
                        displayType = 1;
                    }
                    if (display.id === "\\\\.\\DISPLAY2")
                        displayType = 2;
                    // uploadToS3(image, employeeId, displayType);
                    let realfilepath = `${employeeId}/${Date.now()}_${displayType}.png`;
                    currentShotArray.push({
                        filepath: realfilepath,
                    });
                    let filepath = "./capture/" + new Date().getTime() + ".png";
                    fs.writeFile(filepath, image, function (err) {
                        if (err) return console.log(err.message);

                        var message = 'Saved SS to ' + filepath;
                        console.log(message);
                    });
                }
            });
        });
        currentShotCount++;
    });
}

/**  
 * function is to check mouse and keyboard state
*/
// const mouseCheck = (employeeData, uploadToS3) => {
//     getIdleTime(employeeData.idleTimeLimit, () => {
//         captureScreen(employeeData.employeeId, uploadToS3);
//     });
// }

module.exports = {
    startCapture, mouseEvent, keyEvent
};