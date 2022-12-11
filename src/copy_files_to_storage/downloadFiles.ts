import { google, drive_v3 } from "googleapis";
import { driveV3Service } from "./service/driveV3Auth";
import * as fs from "fs"; 
import { Readable } from "stream";
import { readFile, writeFile } from "fs/promises";
import { CreateBucketRequest, Storage } from "@google-cloud/storage";

// type Files = drive_v3.Schema$File[]

const listInDrive = async () => {
    const listParams: drive_v3.Params$Resource$Files$List = {
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
    };
    const res = await driveV3Service.files.list(listParams).then((f) => {
        console.log(f.data.files);
        return f.data.files;
    });
    return res;
}

const downloadFiles = async () => {
    // const files = listInDrive();
    const fileId = "1kCokseof3kuVe5zX5Sn0Au8miwXmPn_e";
    try {
        const data = await driveV3Service.files.get({
            fileId: fileId,
			alt: "media",
		});
        console.log(data)
        return data.status;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

downloadFiles().catch((err) => console.error(err));

const copyToCloudStorageAsync = async (fileId: string, bucketName: string, storageFileName: string, contentType: string): Promise<void> => {
	const media = await driveV3Service.files.get(
		{ fileId, supportsTeamDrives: true, alt: "media" },
		{ responseType: "stream" }
	);

	const storage = new Storage();
	const bucket = storage.bucket(bucketName);
	const uploadFile = bucket.file(storageFileName);

	await new Promise<void>((resolve, reject) => {
		const downloadStream = media.data;
		const uploadStream = uploadFile.createWriteStream({
			metadata: {
				cacheControl: "no-cache",
				contentType,
			},
		});
		downloadStream.pipe(uploadStream);
		downloadStream.on("error", reject);
		uploadStream.on("error", reject);
		uploadStream.on("finish", resolve);
	});
}

// copyToCloudStorageAsync("aaaaaa", "bbbbbb", "cccccc", "dddddd");
