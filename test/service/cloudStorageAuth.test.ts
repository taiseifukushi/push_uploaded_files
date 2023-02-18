import { Bucket } from "@google-cloud/storage";
import config from "config";
import { CloudStorageBucket } from "../../src/service/cloudStorageAuth";

// mock config module
jest.mock("config");

describe("Cloud Storage", () => {
	beforeAll(() => {
		// mock config values
		jest.spyOn(config, "get").mockImplementation((key: string) => {
			if (key === "project_id") {
				return "test-project-id";
			} else if (key === "bucketName") {
				return "test-bucket-name";
			} else {
				throw new Error("Unexpected config key");
			}
		});
	});

	afterAll(() => {
		jest.restoreAllMocks();
	});

	it("should create a Bucket instance", () => {
		expect(CloudStorageBucket).toBeInstanceOf(Bucket);
		expect(CloudStorageBucket.name).toEqual("test-bucket-name");
	});
});
