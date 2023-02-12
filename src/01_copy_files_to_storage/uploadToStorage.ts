import stream from "stream";
import glob from "glob";
import { CloudStorageBucket } from "../service/cloudStorageAuth";

function listUploadFiles(): Promise<string[]> {
	return new Promise((resolve, reject) => {
		glob("tmp/*", (err, files) => {
			if (err) {
				reject(err);
			} else {
				const modifyFiles: string[] = modifyFileName(files);
				console.log(modifyFiles);
				resolve(modifyFiles);
			}
		});
	});
}

function modifyFileName(fileList: string[]): string[] {
	return fileList;
}

async function uploadToStorage(): Promise<void> {
	const list = await listUploadFiles();
	for (const destFileName of list) {
		const uploadContent = `tmp/${destFileName}`;
		const newFileName = CloudStorageBucket.file(destFileName);

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
}

uploadToStorage()
	.then(() => {
		console.log("File uploading successfully");
	})
	.catch((error) => {
		console.error("Error uploading file:", error);
});
