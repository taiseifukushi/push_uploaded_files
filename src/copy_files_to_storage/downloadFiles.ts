import { google, drive_v3 } from "googleapis";
import { driveV3Service } from "./service/driveV3Auth";
import { GaxiosResponse } from "gaxios";
import * as fs from "fs"; 
import { Readable } from "stream";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const listInDrive = async () => {
	const listParams: drive_v3.Params$Resource$Files$List = {
		pageSize: 10,
		fields: "nextPageToken, files(id, name)",
	};
	await driveV3Service.files.list(listParams).then((res) => {
		if (typeof res.data.files == "undefined") {
			return;
		}
		for (const file of res.data.files) {
			const dest = fs.createWriteStream("./name");
			// const dest = fs.createWriteStream("./" + file["name"]);
			if (typeof file == "undefined") {
				return;
			}
			if (file["id"] && file["name"]) {
				driveV3Service.files.get({
					fileId: file["id"],
					alt: "media",
				},
				{
					responseType: "stream",
				}, (error, res) => {
					if (res && res.data) {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
						res.data.pipe(dest);
					}
				})
			}
		}
	})
};


// const downloadFiles = async () => {
// // const downloadFiles = async (): Promise<GaxiosResponse<drive_v3.Schema$File>> => {
//     const files = listInDrive();
// 	for (const file in files) {
// 		// const fileId = "1kCokseof3kuVe5zX5Sn0Au8miwXmPn_e";
// 		if (typeof file == "undefined") {
// 			const result =  await driveV3Service.files.get({
// 				fileId: "1kCokseof3kuVe5zX5Sn0Au8miwXmPn_e",
// 				alt: "media"
// 			}).then((res) => {
// 				console.log(res);
// 				return res;
// 			}).catch((err) => {
// 				return console.error(err);
// 			});
// 		}
// 	}
// 	return;
// };

async () => await listInDrive().then((res) => { return res });
// console.log(aaa);

// const copyToCloudStorageAsync = async (fileId: string, bucketName: string, storageFileName: string, contentType: string): Promise<void> => {
// 	const media = await driveV3Service.files.get(
// 		{ fileId, supportsTeamDrives: true, alt: "media" },
// 		{ responseType: "stream" }
// 	);

// 	const storage = new Storage();
// 	const bucket = storage.bucket(bucketName);
// 	const uploadFile = bucket.file(storageFileName);

// 	await new Promise<void>((resolve, reject) => {
// 		const downloadStream = media.data;
// 		const uploadStream = uploadFile.createWriteStream({
// 			metadata: {
// 				cacheControl: "no-cache",
// 				contentType,
// 			},
// 		});
// 		downloadStream.pipe(uploadStream);
// 		downloadStream.on("error", reject);
// 		uploadStream.on("error", reject);
// 		uploadStream.on("finish", resolve);
// 	});
// }

// copyToCloudStorageAsync("aaaaaa", "bbbbbb", "cccccc", "dddddd");
