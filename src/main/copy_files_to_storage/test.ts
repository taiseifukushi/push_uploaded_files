const { Storage } = require('@google-cloud/storage');
import { google } from "googleapis";
import { Readable } from "stream";
import { readFile, writeFile } from "fs/promises";

async function copyToCloudStorageAsync(fileId: string, bucketName: string, storageFileName: string, contentType: string): Promise<void> {
    const authClient = await google.auth.getClient({
        scopes: "https://www.googleapis.com/auth/drive"
    });
    const drive = google.drive({ version: "v3", auth: authClient });
    const media = await drive.files.get({ fileId, supportsTeamDrives: true, alt: "media" }, { responseType: "stream" });

    const storage = new Storage();
    const bucket = storage.bucket(bucketName)
    const uploadFile = bucket.file(storageFileName);

    await new Promise<void>((resolve, reject) => {
        const downloadStream = media.data as Readable;
        const uploadStream = uploadFile.createWriteStream({
        metadata: {
            cacheControl: "no-cache",
            contentType
        }
        });
        downloadStream.pipe(uploadStream);
        downloadStream.on("error", reject);
        uploadStream.on("error", reject);
        uploadStream.on("finish", resolve);
    });
}

copyToCloudStorageAsync("aaaaaa", "bbbbbb", "cccccc", "dddddd");
