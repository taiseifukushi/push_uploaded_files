import { drive_v3 } from "googleapis";
import { driveV3Service } from "./service/driveV3Auth";
import * as fs from "fs"; 
import { GaxiosResponse } from "googleapis-common";


async function listFiles(): Promise<GaxiosResponse<drive_v3.Schema$FileList>>{
  const listParams: drive_v3.Params$Resource$Files$List = {
    pageSize: 10,
    fields: "nextPageToken, files(id, name)",
  };
  return await driveV3Service.files.list(listParams);
}

async function getFiles(fileId: string, fileName: string): Promise<void> {
  const dest = fs.createWriteStream(`./tmp/upload/${fileName}`);
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

async function downloadFiles(): Promise<void[] | void> {
  const result = await listFiles();
  const filesList = result.data.files;
  const _array = [];
	
  if (filesList === undefined) {
    return;
  }
  for (const file of filesList) {
    if (file["mimeType"] != "application/vnd.google-apps.folder") {
      continue;
    }
    if (file["name"] === null || file["name"] === undefined) {
      continue;
    }
    if (file["id"]) {
      _array.push(await getFiles(file["id"], file["name"]));
    }
  }
  console.log(_array);
  try {
		return _array;
	} catch (error) {
		console.error(error);
	}
}

(async () => {
	try {
		await Promise.all(downloadFiles());
	} catch (error) {
		console.error(error);
	}
})();

