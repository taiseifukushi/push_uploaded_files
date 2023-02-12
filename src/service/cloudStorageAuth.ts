import { Bucket, Storage } from "@google-cloud/storage";
import config from "config";

interface CloudStorageAuth {
	projectId: string;
	keyFilename: string;
}

interface CloudStorageBucketConfig {
	bucketName: string
}

const cloudStorageAuth: CloudStorageAuth = {
	projectId: config.get("project_id"),
	keyFilename: "config/credential.json",
};

const cloudStorageBucketConfig: CloudStorageBucketConfig = {
	bucketName: config.get("bucketName"),
};

const CloudStorageService: Storage = new Storage(cloudStorageAuth);

export const CloudStorageBucket: Bucket = CloudStorageService.bucket(
	cloudStorageBucketConfig.bucketName
);
