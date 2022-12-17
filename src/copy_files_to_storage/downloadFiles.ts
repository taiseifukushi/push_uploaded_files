import { drive_v3 } from "googleapis";
import { driveV3Service } from "./service/driveV3Auth";
import * as fs from "fs"; 

const downloadFiles = async (): Promise<void> => {
	const listParams: drive_v3.Params$Resource$Files$List = {
		pageSize: 10,
		fields: "nextPageToken, files(id, name)",
	};
	const lists = await driveV3Service.files.list(listParams);

	if (lists.data.files == undefined) {
		return;
	}
	for (const file of lists.data.files) {
		if (file["mimeType"] != "application/vnd.google-apps.folder") {
			return;
		}
		if (file["name"] == null) {
			continue;
		}
		if (file["name"] == null || file["name"] == undefined) {
			continue;
		}
		const dest = fs.createWriteStream(
			`./tmp/upload/${file["name"]}`
		);
		if (file["id"]) {
			// eslint-disable-next-line @typescript-eslint/await-thenable
			await driveV3Service.files.get(
				{
					fileId: file["id"],
					alt: "media",
				},
				{
					responseType: "stream",
				},
				(err, res) => {
						// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
						res?.data.pipe(dest);
					}
				);
			}
		}
	return;
};

async () => await downloadFiles();
