To run the application, 


1. create an `.env` files with following keys
```dotenv
S3_ENDPOINTURI=<your minio server here>
S3_ACCESSKEY=<typical s3 access keys>
S3_SECRET=<typical s3 secret keys>
S3_BUCKET=<the s3 bucket name we will be uploading/downloading to>
```

2. run script ``npm install`` to start installing dependencies
3. run script ``npm run start`` to upload the file `sample-file.md` from upload folder

You should see results from the terminal console...




