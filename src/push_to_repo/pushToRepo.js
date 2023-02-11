const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const ff = require("@google-cloud/functions-framework");
const path = require("path");
const fs = require("fs");
const cwd = path.join(__dirname, "..");
const simpleGit = require("simple-git");
const repositoryUrl = process.env.RepositoryUrl;
const repositoryName = process.env.RepositoryName;

async function downloadCloudStorageBucketFile(bucketName, fileName, destFileName) {
	const options = {
		destination: destFileName,
	};
	await storage.bucket(bucketName).file(fileName).download(options);
	console.log(`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`);
}

async function cloneGitRepository(repositoryUrl) {
	await simpleGit().clone(repositoryUrl, cwd);
}

async function pushGitRepository(workingDirectory) {
	const git = simpleGit(workingDirectory);
	const branchName = new Date().toLocaleString().replace(/\/|:| /g, "");
	const commitMessage = `update_cloud_storage-${branchName}`;

	await git.checkoutLocalBranch(branchName);
	await git.add("*").commit(commitMessage);
	await git.addRemote("origin", repositoryUrl);
	await git.push(["-u", "origin", branchName]);
}

async function deleteBucketContent(bucketName, fileName) {
	await storage.bucket(bucketName).file(fileName).delete();
	console.log(`gs://${bucketName}/${fileName} deleted`);
}

ff.cloudEvent("pushToRepo", async (cloudEvent) => {
	console.log(`Event ID: ${cloudEvent.id}`, `Event Type: ${cloudEvent.type}`);

	const bucketName = cloudEvent.data.bucket;
	const bucketFileName = cloudEvent.data.name;
	const destFileName = path.join(cwd, `${repositoryName}`, `${bucketFileName}.txt`);

	await cloneGitRepository(repositoryUrl);
	await downloadCloudStorageBucketFile(bucketName, bucketFileName, destFileName);
	await pushGitRepository(repositoryName);
	await deleteBucketContent(bucketName, bucketFileName);
});
