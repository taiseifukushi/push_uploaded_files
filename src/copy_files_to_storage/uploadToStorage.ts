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

const filesToUpload = (): Promise<string[]> => {
	return new Promise((resolve, reject) => {
		glob("./tmp/*", (err, files) => {
			if (err) {
				reject(err);
			} else {
				console.log(files);
				resolve(files);
			}
		});
	});
};

const uploadToStorage = async (auth: Auth): Promise<void> => {
	const storage: Storage = new Storage(auth);
	const bucketName: string = config.get("bucketName");
	const myBucket: Bucket = storage.bucket(bucketName);

	const list = await filesToUpload();
	for (const destFileName of list) {
		const uploadContent = `tmp/upload/${destFileName}`;
		const newFileName = myBucket.file(destFileName);

		const passthroughStream = new stream.PassThrough();
		passthroughStream.write(uploadContent);
		passthroughStream.end();

		try {
			passthroughStream.pipe(newFileName.createWriteStream());
		} catch (err) {
			console.error(err);
		}
	}
	return;
};

// eslint-disable-next-line @typescript-eslint/no-floating-promises
(async () => {
	try {
		await uploadToStorage(CloudStorageAuth);
	} catch (err) {
		console.error(err);
	}
})();
