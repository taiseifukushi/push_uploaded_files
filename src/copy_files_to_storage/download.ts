import { readFile, writeFile } from "fs/promises";
// const { GoogleAuth } = require("google-auth-library");
// const auth = new GoogleAuth({
// 	scopes: "https://www.googleapis.com/auth/drive",
// });

async function downloadFile(realFileId: string) {
	const config = readFile("config/config.json"); 
	const { google } = require("googleapis");

	const service = google.drive({ version: "v3", auth });
	const files = [];
	try {
		const res = await service.files.list({
			q: "mimeType='image/jpeg'",
			fields: "nextPageToken, files(id, name)",
			spaces: "drive",
		});
		Array.prototype.push.apply(files, res.files);
		res.data.files.forEach(function (file) {
			console.log("Found file:", file.name, file.id);
		});
		return res.data.files;
	} catch (err) {
		console.log(err);
		throw err;
	}
}

downloadFile()
