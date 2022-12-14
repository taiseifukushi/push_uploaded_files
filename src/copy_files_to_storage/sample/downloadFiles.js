// https://cloud.google.com/storage/docs/uploading-objects?hl=ja#storage-upload-object-nodejs
// https://cloud.google.com/storage/docs/uploads-downloads?hl=ja#client-libraries
// https://cloud.google.com/storage/docs/streaming-uploads?hl=ja#prereq-code-samples

const path = require("path");
const { google } = require("googleapis");
const fs = require("fs");

const downloadFiles = async () => {
	const auth = new google.auth.GoogleAuth({
		keyFile: path.join("config", "credentials.json"),
		scopes: ["https://www.googleapis.com/auth/drive"],
	});

	const drive = google.drive({ version: "v3", auth: auth });
	const params = { pageSize: 10 };
	const res1 = await drive.files.list(params);

	for (const file of res1.data.files) {
		if (file["mimeType"] != "application/vnd.google-apps.folder") {
			let dest = fs.createWriteStream(`./tmp/uploaded/${file["name"]}`);
			await drive.files.get(
				{
					fileId: file["id"],
					alt: "media",
				},
				{
					responseType: "stream",
				},
				(error, r) => {
					{
						r.data.pipe(dest);
					}
				}
				);
			}
	}
	return;
}

downloadFiles();
