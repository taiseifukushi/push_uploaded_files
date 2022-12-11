import { drive_v3 } from "googleapis";
import { driveV3Service } from "./service/driveV3Auth";
import * as fs from "fs"; 

// type Files = drive_v3.Schema$File[]

const listInDrive = async () => {
    const listParams: drive_v3.Params$Resource$Files$List = {
        pageSize: 10,
        fields: "nextPageToken, files(id, name)",
    };
    const res = await driveV3Service.files.list(listParams).then((f) => {
        console.log(f.data.files);
        return f.data.files;
    });
    return res;
}

const downloadFiles = async () => {
    const fileId = "1kCokseof3kuVe5zX5Sn0Au8miwXmPn_e";
    try {
        const data = await driveV3Service.files.get({
            fileId: fileId,
			alt: "media",
		});
        console.log(data)
        return data.status;
    } catch (err) {
        console.log(err);
        throw err;
    }
};

downloadFiles().catch((err) => console.error(err));
// console.log(result);
// console.log(typeof result);
