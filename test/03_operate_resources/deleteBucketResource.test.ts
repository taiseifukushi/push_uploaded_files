import { deleteFile } from "../../src/03_operate_resources/deleteBucketResource";
import { CloudStorageBucket } from "../../src/service/cloudStorageAuth";

jest.mock("../../src/service/cloudStorageAuth", () => {
	return {
		CloudStorageBucket: {
			file: jest.fn().mockReturnThis(),
			delete: jest.fn().mockResolvedValue(""),
		},
	};
});

describe("deleteFile", () => {
	it("should delete a file from the bucket", async () => {
		await deleteFile("tmp/sample.pdf");
		expect(CloudStorageBucket.file).toHaveBeenCalledWith("tmp/sample.pdf");
		expect(CloudStorageBucket.file().delete).toHaveBeenCalled();
	});

	it("should handle errors when deleting the file", async () => {
		(CloudStorageBucket.file().delete as jest.Mock).mockRejectedValue(
			new Error("Error deleting file")
		);

		await expect(deleteFile("tmp/sample.pdf")).rejects.toThrow(
			"Error deleting file"
		);
	});
});
