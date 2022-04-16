const { Storage } = require('@google-cloud/storage');
const path = require('path');


const storage = new Storage({
    projectId: "vastram-d3e69",
    keyFilename: "vastram-d3e69-firebase-adminsdk-awb3i-6cc802e6a8.json"
})


let bucketName = "gs://vastram-d3e69.appspot.com";


exports.fireBaseStorage = async(request, response, next) => {
    try {
        for (i = 0; i < 4; i++) {
            console.log("durgesh in firbase" + request)
            await storage.bucket(bucketName).upload(path.join(__dirname, '../', "public/images/") + request.files[i].filename, {
                gzip: true,
                metedata: {
                    metedata: {
                        firebaseStorageDownloadTokens: "abcddcba "
                    }
                }
            })
        }
    } catch (error) {
        console.log(error)
    }
    next();
}