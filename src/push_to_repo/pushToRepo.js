const { Storage } = require("@google-cloud/storage");
const storage = new Storage();
const ff = require("@google-cloud/functions-framework");
const path = require("path");
const fs = require("fs");
const cwd = path.join(__dirname, "..");
const  simpleGit = require("simple-git");
const repositoryUrl = process.env.RepositoryUrl;
const repositoryName = process.env.RepositoryName;

function downloadCloudStorageBucketFile(bucketName, fileName, destFileName) {
	async function downloadFile() {
		const options = {
			destination: destFileName,
		};

		await storage.bucket(bucketName).file(fileName).download(options);

		console.log(
			`gs://${bucketName}/${fileName} downloaded to ${destFileName}.`
		);
		return;
	}

	downloadFile().catch(console.error);s
}

async function cloneGitRepostory(repositoryUrl) {
	await simpleGit().clone(repositoryUrl, cwd);
	return;
}

async function pushGitRepostory(workingDirectory) {
	const git = simpleGit(workingDirectory);
	const branchName = new Date().toLocaleString().replace(/\/|:| /g, "")
	const commitmessage = `update_cloud_storage-${branchName}`;

	git.checkoutLocalBranch(branchName);
	git.add('*')
		 .commit(commitmessage)
		 .addRemote('origin', repositoryUrl)
		 .push(['-u', 'origin', branchName])
}

// bucketの中身を削除する
function deleteBucketContent(bucketName, fileName) {
	async function deleteFile() {
		await storage.bucket(bucketName).file(fileName).delete(deleteOptions);
		console.log(`gs://${bucketName}/${fileName} deleted`);
	}

	deleteFile().catch(console.error);
}

// Entrypoint
ff.cloudEvent("pushToRepo", (cloudEvent) => {
	console.log(`Event ID: ${cloudEvent.id}`, `Event Type: ${cloudEvent.type}`);

	const bucketName = cloudEvent.data.bucket;
	const bucketFileName = cloudEvent.data.name;
	const destFileName = path.join(cwd, `${bucketFileName}.txt`);

	cloneGitRepostory(repositoryUrl);

	const destFileNamePath = `${cwd}/${repositoryName}/${destFileName}`

	downloadCloudStorageBucketFile(bucketName, bucketFileName, destFileNamePath);
	pushGitRepostory(repositoryName)
	deleteBucketContent(bucketName, bucketFileName);

	return;
});