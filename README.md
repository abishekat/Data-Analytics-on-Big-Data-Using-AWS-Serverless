Steps to install, run and test the application. Prerequisites are npm installed in the local machine.
STEP 1.	Install AWS CLI in the local terminal with the necessary user access [4].
STEP 2.	Configure AWS CLI for CodeCommit [5].
STEP 3.	Create a layer with the required library for running the application, i.e., protobuf and jwt [6].
STEP 4.	In the local terminal, run the command “npm install -g serverless”
STEP 5.	In the local terminal, run the command, “sls create -t aws-nodejs -p <project-name>”
STEP 6.	Run “npm init -y”
STEP 7.	Run “npm install --save aws-sdk protobuf jwt serverless-offline”
STEP 8.	Put the files “handler.js”, “buildspec.yml”, “userpackage.proto” and “serverless.yml”
STEP 9.	Create a CodeCommit repository in AWS
STEP 10.	Run “git init”
STEP 11.	Run “git add .”
STEP 12.	Run “git commit -am “first commit””.
STEP 13.	Run “git remote add origin <repo url>”.
STEP 14.	Run “git push --set-upstream origin”
STEP 15.	Create a pipeline with the below steps [7].
STEP 16.	Add CodeCommit as a repository.
STEP 17.	Create a CodeBuild using environment variables as “buildspec.yml” and ENV_NAME=prod-env”.
STEP 18.	Select “skip stage” in the deployment stage, as it’s serverless.
STEP 19.	CodePipeline starts building, and an endpoint will be generated for the application.
STEP 20.	Add the data sets to the S3 bucket created.
STEP 21.	Copy the “event.json” from the repository and use postman or API Gateway or the lambda function generated to test the application functionality.
