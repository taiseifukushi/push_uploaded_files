import { CloudStorageBucket } from "../../src/service/cloudStorageAuth";
import glob from "glob";
import {
	listUploadFiles,
	modifyFileName,
	uploadToStorage,
} from "../../src/01_copy_files_to_storage/uploadToStorage";

jest.mock("glob");
jest.mock("stream");
jest.mock("../service/cloudStorageAuth");

describe("uploadToStorage", () => {
	it("lists files and uploads to the storage", async () => {
		const files = ["tmp/file1.txt", "tmp/file2.txt"];
		(glob as unknown as jest.Mock).mockImplementation((_, cb) => {
			cb(null, files);
		});

		const modifyFiles = modifyFileName(files);
		expect(modifyFiles).toEqual(files);

		await uploadToStorage();
		expect(CloudStorageBucket.file).toHaveBeenCalledTimes(files.length);
	});

	it("modifies the file name", () => {
		const files = ["tmp/file1.txt", "tmp/file2.txt"];
		const modifyFiles = modifyFileName(files);
		expect(modifyFiles).toEqual(files);
	});

	it("lists upload files", async () => {
		const files = ["tmp/file1.txt", "tmp/file2.txt"];
		(glob as unknown as jest.Mock).mockImplementation((_, cb) => {
			cb(null, files);
		});
		const list = await listUploadFiles();
		expect(list).toEqual(files);
	});
});
