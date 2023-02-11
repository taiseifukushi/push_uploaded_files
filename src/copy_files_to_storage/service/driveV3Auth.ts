import { google, drive_v3, Auth } from "googleapis"; // https://github.com/googleapis/google-api-nodejs-client?utm_source=developers.google.com&utm_medium=referral#typescript

const auth: Auth.GoogleAuth = new google.auth.GoogleAuth({
  keyFile: "config/credentials.json",
  scopes: "https://www.googleapis.com/auth/drive",
});

export const driveV3Service: drive_v3.Drive = google.drive({
  version: "v3",
  auth,
});
