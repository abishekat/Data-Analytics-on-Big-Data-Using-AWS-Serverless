# gRPC-Gradle-MongoDB-RabbitMQ

1. [Abishek Arumugam Thiruselvi](https://www.abishekarumugam.com)('40218896')

## Steps to install, run and test the application. Prerequisites are npm installed in the local machine.
1.	Install AWS CLI in the local terminal with the necessary user access [4].
2.	Configure AWS CLI for CodeCommit [5].
3.	Create a layer with the required library for running the application, i.e., protobuf and jwt [6].
4.	In the local terminal, run the command “npm install -g serverless”
5.	In the local terminal, run the command, “sls create -t aws-nodejs -p <project-name>”
6.	Run “npm init -y”
7.	Run “npm install --save aws-sdk protobuf jwt serverless-offline”
8.	Put the files “handler.js”, “buildspec.yml”, “userpackage.proto” and “serverless.yml”
9.	Create a CodeCommit repository in AWS
10.	Run “git init”
11.	Run “git add .”
12.	Run “git commit -am “first commit””.
13.	Run “git remote add origin <repo url>”.
14.	Run “git push --set-upstream origin”
15.	Create a pipeline with the below  [7].
16.	Add CodeCommit as a repository.
17.	Create a CodeBuild using environment variables as “buildspec.yml” and ENV_NAME=prod-env”.
18.	Select “skip stage” in the deployment stage, as it’s serverless.
19.	CodePipeline starts building, and an endpoint will be generated for the application.
20.	Add the data sets to the S3 bucket created.
21.	Copy the “event.json” from the repository and use postman or API Gateway or the lambda function generated to test the application functionality.
