const { Storage } = require("@google-cloud/storage");
const stream = require("stream");
const config = require("config");
const CloudStorageAuth = {
	projectId: config.get("projectId"),
	keyFilename: "config/credentials.json",
};

const uploadToStorage = async (auth) => {
// const uploadToStorage = async (bucketName, filePath, destFileName) => {
	const storage = new Storage(auth);
	const bucketName = config.get("bucketName");
    const myBucket = storage.bucket(bucketName);
	const destFileName = "sample.pdf";
    const file = myBucket.file(destFileName);
	const content = "tmp/upload/sample.pdf";

    const passthroughStream = new stream.PassThrough();
	passthroughStream.write(content);
	passthroughStream.end();

    const result = passthroughStream.pipe(file.createWriteStream()).on("finish", (res) => {
        console.log(res);
    });
    console.log(result);
    return;
};

uploadToStorage(CloudStorageAuth).catch(console.error);