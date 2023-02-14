
const { CREDENTIALS } = require('./../enums');

var AWS = require('aws-sdk');
// const sharp = require('sharp');

AWS.config.update({
    credentials: CREDENTIALS,
    region: 'ap-south-1'
});
const s3 = new AWS.S3();

// upload image to AWS S3
function uploadImageToAWS(image, filename) {
    console.log(filename);
    // sharp(image).resize(1366, 768).toBuffer((err, buffer) => {
    //     if (err) {
    //         console.error(err);
    //     }
    //     else {
    //         console.log("start to upload here");
    //         const paramsAWS = {
    //             Bucket: 'emt-image-workship',
    //             Key: filename,
    //             Body: buffer,
    //             ContentType: 'image/png',
    //         }
    //         s3.upload(paramsAWS, (err, data) => {
    //             if (err) {
    //                 console.error(err);
    //             }
    //             console.log('Screenshot successfully uploaded to ${data.Location}');
    //         });
    //     }
    // });
}

const uploadToS3 = (file, employeeId, realfilepath) => {
    // console.log(file);
    console.log("upload start image");
    const s3Params = {
        Bucket: 'emt-image-workship',
        Key: realfilepath,
        Body: file,
        ContentType: 'image/png'
    };

    s3.upload(s3Params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(`File uploaded to S3: ${data.Location}`);
        }
    });
};

module.exports = {
    uploadImageToAWS, uploadToS3
};;