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
	const delete_file_name = "tmp/sample.pdf";

	it("should delete a file from the bucket", async () => {
		await deleteFile(delete_file_name);
		expect(CloudStorageBucket.file).toHaveBeenCalledWith("tmp/sample.pdf");
		expect(
			CloudStorageBucket.file(delete_file_name).delete
		).toHaveBeenCalled();
	});

	it("should handle errors when deleting the file", async () => {
		(
			CloudStorageBucket.file(delete_file_name).delete as jest.Mock
		).mockRejectedValue(new Error("Error deleting file"));

		await expect(deleteFile("tmp/sample.pdf")).rejects.toThrow(
			"Error deleting file"
		);
	});
});
