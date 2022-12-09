import { readFile, writeFile } from "fs/promises";

async function downloadFile(realFileId: string) {
	const { GoogleAuth } = require("google-auth-library");
	const { google } = require("googleapis");
	const auth = new GoogleAuth({
		scopes: "https://www.googleapis.com/auth/drive",
	});
	const service = google.drive({ version: "v3", auth });
	const fileId = realFileId;

	try {
		const file = await service.files.get({
			fileId: fileId,
			alt: "media",
		});
		console.log(file.status);
		return file.status;
	} catch (err) {
		throw err;
	}
}
