import { readFile, writeFile } from "fs/promises"

async function searchFile() {
	const { GoogleAuth } = require("google-auth-library");
	const { google } = require("googleapis");
    const config = readFile("config/config.json"); 
	const auth = new GoogleAuth({
		scopes: "https://www.googleapis.com/auth/drive",
		config
	});
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
		throw err;
	}
}
