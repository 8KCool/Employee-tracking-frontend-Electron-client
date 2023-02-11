const req = require('request');
const { IPC_URL } = require('../enums');

/* 
    login and get user data
*/
function loginAPI(username, password, callback) {
    // req.get(IPC_URL.LOGIN_URL, function(err,res,body) {
    //     if (err) {
    //         return console.log(err);
    //     }
    //     if(res.statusCode == '200'){
          
    //     }
    //     else{
    //       const options = {
    //         type: 'info',
    //         message: 'Incorrect username or password! Please Check.'
    //       };
    //     }
    //   });

    let employeeData = {
        id: 1,   // employee Id
        name: username,
        screenshotInterval: 3,  // screenshot count 3 / 1min
        idleTimeLimit: 10,   // I guess it is 10 second for test  
    }
    callback("success", employeeData);
}

/*
    when play button is clicked 
    - get current server time
    - get current capture state in current time(10mins) ;
*/
function getCurrentIdleState(employeeData, callback) {
    
    let returnData = {
        LeftTime: 34,  //  if I start capture in 8.47  -> leftTime : 13
        LeftCaptureCnt : 2, // (if admin set 3)  // left screencapture count
    }

    callback("success", returnData);
}


/* 
    update idletime and mouse/keyboard state
*/
function updateActionAPI(actionData, callback) {
    console.log(actionData);
    callback("success");
}

module.exports = {
    loginAPI, getCurrentIdleState, updateActionAPI
}