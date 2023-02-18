import { drive_v3 } from "googleapis";
import { driveV3Service } from "../service/driveV3Auth";
import * as fs from "fs"; 
import { GaxiosResponse } from "gaxios";


export async function listFiles(): Promise<GaxiosResponse<drive_v3.Schema$FileList>>{
  const listParams: drive_v3.Params$Resource$Files$List = {
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  };
  return await driveV3Service.files.list(listParams);
}

export async function getFiles(fileId: string, fileName: string): Promise<void> {
  const dest = fs.createWriteStream(`./tmp/${fileName}`);
  return new Promise((resolve, reject) => {
    driveV3Service.files.get(
      {
        fileId: fileId,
        alt: "media",
      },
      {
        responseType: "stream",
      },
      (_err, res) => {
        if (res) {
          res.data.pipe(dest).on("finish", () => {
            resolve();
          });
        } else {
          reject("response is undefined or null");
        }
      }
    );
  });
}

export async function downloadFiles(): Promise<void[]> {
	const result = await listFiles();
	const filesList = result.data.files;
	const _array: Promise<void>[] = [];

	if (filesList === undefined) {
		console.log("response is undefined or null");
		return [];
	}

	for (const file of filesList) {
		if (
			file["id"] === null ||
			file["id"] === undefined ||
			file["name"] === null ||
			file["name"] === undefined ||
			file["mimeType"] === "application/vnd.google-apps.folder"
		) {
			console.log("name");
			continue;
		}
		_array.push(getFiles(file["id"], file["name"]));
	}
	return Promise.all(_array);
}

downloadFiles()
	.then(() => {
		console.log("File downloading successfully");
	})
	.catch((error) => {
		console.error("Error downloading file:", error);
	});
