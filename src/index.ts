import 'dotenv/config'
import {GetObjectCommand, PutObjectCommand, PutObjectCommandInput, S3Client} from '@aws-sdk/client-s3'
import fs from "fs";


//this is the file we are going to upload and download (located from the upload folder)
const FILE_NAME =  "sample-file.md"


let _s3Client: S3Client = null

function getClient(): S3Client {
    if (!_s3Client) {
        //get the values from env
        const endpointUri = process.env.S3_ENDPOINTURI
        const secret = process.env.S3_SECRET
        const accessKey = process.env.S3_ACCESSKEY

        //setup the s3 client configuration
        _s3Client = new S3Client({
            endpoint: `https://${endpointUri}`,
            region: 'us-east-1',
            credentials: {
                accessKeyId: accessKey,
                secretAccessKey: secret,
            },
            forcePathStyle:true, //we need this so that it can work well with nginx

        })

    }
    return _s3Client
}



/**
 * Using S3 client we will upload the file located at upload folder
 */
async function uploadFile() {

    //from the current path we will get the file
    const filePath = `${process.cwd()}/upload/${FILE_NAME}`

    //get it's content
    const fileContent = fs.readFileSync(filePath)

    //set the params for uploading to s3
    const bucketParams: PutObjectCommandInput = {
        Bucket: process.env.S3_BUCKET,
        Key: FILE_NAME,
        Body: fileContent,
    }
    await getClient().send(new PutObjectCommand(bucketParams))
}

/**
 * Get the file
 */
async function getFile() {
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET,
        Key: FILE_NAME
    });

    const response = await getClient().send(command);
    // The Body object also has 'transformToByteArray' and 'transformToWebStream' methods.
     const result = await response.Body.transformToString();

    //this will just show on the console the test file that was uploaded
    console.log(result , "getFile.Result")

}



//We are using the module: module from tsConfig, we can use top level async/await
//we running this via tsx command line tool (as an alternative to ts-node)
try {
    await uploadFile()
    await getFile()
}   finally {
    console.log("Everything is done....")
}

