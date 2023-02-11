import { Bucket, Storage } from "@google-cloud/storage";
import stream from "stream";
import config from "config";
import glob from "glob";

type Auth = {
	projectId: string;
	keyFilename: string;
};

const CloudStorageAuth: Auth = {
  projectId: config.get("projectId"),
  keyFilename: "config/credentials.json",
};

const filesToUpload = (): string[] | void => {
  glob("./tmp/upload/*", (err, files) => {
    console.log(files);
  });
}

const uploadToStorage = (auth: Auth): void => {
  const storage: Storage = new Storage(auth);
  const bucketName: string = config.get("bucketName");
  const myBucket: Bucket = storage.bucket(bucketName);
	
  const list = filesToUpload();
  if (list === undefined) {
    return;
  }
  for (const destFileName of list) {
    const uploadContent = `tmp/upload/${destFileName}`;
    const newFileName = myBucket.file(destFileName);
	
    const passthroughStream = new stream.PassThrough();
    passthroughStream.write(uploadContent);
    passthroughStream.end();
	
    try {
      passthroughStream
        .pipe(newFileName.createWriteStream());
    } catch (err) {
      console.error(err);
    }
  }
  return;
};

uploadToStorage(CloudStorageAuth);