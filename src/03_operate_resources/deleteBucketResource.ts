import { CloudStorageBucket } from "../service/cloudStorageAuth";

const fileName: string = process.argv[2];

async function deleteFile(fileName: string): Promise<void> {
  try {
    await CloudStorageBucket.file(fileName).delete();
    console.log(`${fileName} deleted`);
  } catch (error) {
    console.error(error);
  }
}

// docker compose exec app yarn ts-node src/03_operate_resources/deleteBucketResource.ts "tmp/sample.pdf"
deleteFile(fileName)
	.then(() => {
		console.log("File deleted successfully");
	})
	.catch((error) => {
		console.error("Error deleting file:", error);
});
