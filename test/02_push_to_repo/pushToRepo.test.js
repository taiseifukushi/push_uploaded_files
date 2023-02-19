const simpleGit = require("simple-git");
const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const path = require("path");
const fs = require("fs");

describe("downloadCloudStorageBucketFile", () => {
	it("should download a file from a Google Cloud Storage bucket", async () => {
		const bucketName = "test-bucket";
		const fileName = "test-file.txt";
		const destFileName = "dest-file.txt";
		const fakeFile = "fake file contents";

		// mock the Google Cloud Storage bucket file download method
		storage.bucket = jest.fn().mockReturnValue({
			file: jest.fn().mockReturnValue({
				download: jest.fn().mockResolvedValue(fakeFile),
			}),
		});

		// call the function
		await downloadCloudStorageBucketFile(
			bucketName,
			fileName,
			destFileName
		);

		// assert that the function called the correct methods and with the correct arguments
		expect(storage.bucket).toHaveBeenCalledWith(bucketName);
		expect(storage.bucket().file).toHaveBeenCalledWith(fileName);
		expect(storage.bucket().file().download).toHaveBeenCalledWith({
			destination: destFileName,
		});

		// assert that the file was correctly written to disk
		expect(fs.readFileSync(destFileName, "utf-8")).toEqual(fakeFile);
	});

	it("should throw an error if the directory does not exist", async () => {
		const bucketName = "test-bucket";
		const fileName = "test-file.txt";
		const destFileName = "non-existent-directory/dest-file.txt";

		// mock the Google Cloud Storage bucket file download method to throw an error
		storage.bucket = jest.fn().mockReturnValue({
			file: jest.fn().mockReturnValue({
				download: jest.fn().mockRejectedValue({ code: "ENOENT" }),
			}),
		});

		// call the function
		await expect(
			downloadCloudStorageBucketFile(bucketName, fileName, destFileName)
		).rejects.toThrow(
			`downloadCloudStorageBucketFile The directory ${path.dirname(
				destFileName
			)} does not exist.`
		);
	});
});
