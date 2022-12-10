// https://github.com/googleapis/google-api-nodejs-client?utm_source=developers.google.com&utm_medium=referral#typescript

import {
	google,
	drive_v3,
	Auth,
	Common,
} from "googleapis";

const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
    keyFile: "config/credentials.json",
    scopes: "https://www.googleapis.com/auth/drive",
});

export const drive: drive_v3.Drive = google.drive({
	version: "v3",
	auth,
});

// export const googleDriveServiceAuth: googleDriveServiceAuth =
// 	new google.auth.GoogleAuth({
// 		keyFile: path.join("config", "credentials.json"),
// 		scopes: "https://www.googleapis.com/auth/drive",
// 	});

async function testList(){
    const listParams: drive_v3.Params$Resource$Files$List = {
		pageSize: 10,
		fields: "nextPageToken, files(id, name)",
	};
    const res = await drive.files.list(listParams);
    const files = res.data.files;
    if (files)
		if (files.length === 0) {
			console.log("No files found.");
			return;
		}
    return files;
}
// const res = await drive.files.list(listParams);
// const listResults: drive_v3.Schema$FileList = res.data;
const lll = testList().catch(console.error);
console.log(lll);
console.log(lll.then((res) => console.log(res)));
// console.log(lll);

// async function listFiles(authClient) {
// 	const drive = google.drive({ version: "v3", auth: authClient });
// 	const res = await drive.files.list({
// 		pageSize: 10,
// 		fields: "nextPageToken, files(id, name)",
// 	});
// 	const files = res.data.files;
// 	if (files.length === 0) {
// 		console.log("No files found.");
// 		return;
// 	}

// 	console.log("Files:");
// 	files.map((file) => {
// 		console.log(`${file.name} (${file.id})`);
// 	});
// }

// authorize().then(listFiles).catch(console.error);