import { describe } from "node:test";

import * as fs from "fs";
import {
	listFiles,
	getFiles,
	downloadFiles,
} from "../../src/01_copy_files_to_storage/downloadFiles";
import { drive_v3 } from "googleapis";
import { driveV3Service } from "../../src/service/driveV3Auth";
import { GaxiosResponse } from "googleapis-common";

jest.mock("../service/driveV3Auth"); // モック化する

describe("downloadFiles", () => {
	beforeEach(() => {
		jest.clearAllMocks(); // 各テスト実行前にモックをクリアする
	});

	it("downloads all files", async () => {
		const files: GaxiosResponse<drive_v3.Schema$FileList> = {
			data: {
				files: [
					{
						id: "file-id-1",
						name: "file-name-1",
						mimeType: "application/octet-stream",
					},
					{
						id: "file-id-2",
						name: "file-name-2",
						mimeType: "application/vnd.google-apps.folder",
					},
					{
						id: "file-id-3",
						name: "file-name-3",
						mimeType: "application/pdf",
					},
				],
			},
		};
		// driveV3Service.files.list() の戻り値をモックする
		(driveV3Service.files.list as jest.Mock).mockResolvedValueOnce(files);

		const writeFileSpy = jest.spyOn(fs, "createWriteStream");
		const closeSpy = jest.spyOn(fs.WriteStream.prototype, "close");

		await downloadFiles();

		// ファイルがダウンロードされたかを確認する
		expect(writeFileSpy).toHaveBeenCalledTimes(2);
		expect(closeSpy).toHaveBeenCalledTimes(2);
	});

	it("handles errors", async () => {
		// driveV3Service.files.list() のエラーをモックする
		(driveV3Service.files.list as jest.Mock).mockRejectedValueOnce("error");

		await expect(downloadFiles()).rejects.toEqual("error");
	});
});
