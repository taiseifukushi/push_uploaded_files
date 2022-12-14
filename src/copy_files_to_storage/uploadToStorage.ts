import { Bucket, Storage } from "@google-cloud/storage";
import stream from "stream";
import config from "config";
import * as fs from "fs"; 
import glob from "glob";

type Auth = {
	projectId: string;
	keyFilename: string;
};
const CloudStorageAuth: Auth = {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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
	if (list == undefined) {
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
				.pipe(newFileName.createWriteStream())
				.on("finish", (res: any) => {
					console.log(res);
				});
		} catch (err) {
			console.error(err);
		}
	}
	return;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-call
uploadToStorage(CloudStorageAuth);