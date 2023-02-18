const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const ff = require("@google-cloud/functions-framework");
const path = require("path");
const fs = require("fs");
const cwd = path.join(__dirname, "..");
const simpleGit = require("simple-git");
const repositoryUrl = process.env.REPOSITORY_URL; // `https://${USER}:${PASS}@${REPO}`
const repositoryName = process.env.REPOSITORY_NAME;

async function downloadCloudStorageBucketFile(
	bucketName,
	fileName,
	destFileName
) {
	try {
		const options = {
			destination: destFileName,
		};
		await storage.bucket(bucketName).file(fileName).download(options);
		console.log(
			`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
		);
	} catch (error) {
		if (error.code === "ENOENT") {
			console.error(
				`downloadCloudStorageBucketFile The directory ${path.dirname(
					destFileName
				)} does not exist.`
			);
		} else {
			console.error(
				`downloadCloudStorageBucketFile downloading file ${fileName} from bucket: ${error}`
			);
		}
	}
}

async function cloneGitRepository(repositoryUrl, cloneRepoPath) {
	try {
		await simpleGit().clone(repositoryUrl, cloneRepoPath);
	} catch (error) {
		console.error("cloneGitRepository", error);
	}
}

async function pushGitRepository() {
	try {
		const branchName = new Date().toLocaleString().replace(/\/|:| /g, "");
		const commitMessage = `update_cloud_storage-${branchName}`;
		const git = simpleGit();
		await git.addConfig("user.name", "github-actions[bot]");
		await git.addConfig(
			"user.email",
			"github-actions[bot]@users.noreply.github.com"
		);
		await git.checkoutLocalBranch(branchName);
		await git.add("*").commit(commitMessage);
		await git.push(["origin", branchName]);
	} catch (error) {
		console.error("pushGitRepository", error);
	}
}

async function deleteBucketContent(bucketName, fileName) {
	try {
		await storage.bucket(bucketName).file(fileName).delete();
		console.log(`gs://${bucketName}/${fileName} deleted`);
	} catch (error) {
		console.error("deleteBucketContent", error);
	}
}

function modifyFileName(fileName) {
	return fileName.replace(/tmp/g, "doc");
}

ff.cloudEvent("pushToRepo", async (cloudEvent) => {
	console.log(`Event ID: ${cloudEvent.id}`, `Event Type: ${cloudEvent.type}`);

	const bucketName = cloudEvent.data.bucket;
	const bucketFileName = cloudEvent.data.name;
	const tmpDir = `tmp`;

	fs.mkdirSync(tmpDir, { recursive: true });
	await cloneGitRepository(repositoryUrl, tmpDir);

	process.chdir(tmpDir);
	await downloadCloudStorageBucketFile(
		bucketName,
		bucketFileName,
		modifyFileName(bucketFileName)
	);
	await pushGitRepository();
	await deleteBucketContent(bucketName, bucketFileName);
});
