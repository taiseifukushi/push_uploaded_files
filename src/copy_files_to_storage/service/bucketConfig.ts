import { readFile } from "fs/promises"
import { bucketConfig } from "src/types";

const loadedConfig = () => {
	const path = "config/cloud_storage_config.json";
	const parsedConfig = JSON.parse(readFile(path, "utf-8"));
	// const parsedConfig = JSON.parse(await readFile(path, "utf-8").then((content) => { return content }));
	return parsedConfig;
};

export const loadedBucketConfig = (): bucketConfig => {
	const config = loadedConfig();
	const bucketConfig: bucketConfig = {
		bucketName: config.bucketName,
		storageFileName: config.storageFileName,
		contentType: config.contentType,
	};
	return bucketConfig;
};