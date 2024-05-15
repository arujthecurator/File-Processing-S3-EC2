# File-Processing-S3-EC2
This project aims to build a pipeline for updating the contents of a file with the description provided and storing in the Database using S3 Bucket, DynamoDB, and EC2 instance

# Overview
This Repository provides step-by-step instructions for setting up a responsive UI pipeline to upload descriptions and files to AWS S3 bucket, store metadata in Dynamo DB, and process files using an EC2 instance. It involves deploying a front-end script for the form, configuring AWS Lambda functions for backend operations, and setting up EC2 for file processing.

# Prerequisites
- AWS Account with access to S3, Lambda, EC2, DynamoDB, and API Gateway
- Node.js installed on your machine
- An IAM role with permissions for Lambda to access S3, DynamoDB, and EC2
- AWS CLI installed and configured on your machine

# Installation & Setup

## Clone this repository

```bash
git clone <repository-url>
cd <repository-name>
```

## Install Dependencies

- Navigate to the project directory and install the necessary dependencies (especially things like @aws-sdk, dynamodb-client, nanoid).

```bash
npm install
```
## Configure AWS Credentials

- Make sure your AWS credentials are configured by running:

```bash
aws configure
```

Enter your AWS Access Key ID, Secret Access Key, and default region when prompted

# Deploying the Front End

## Deploy FileUpload.js

This script handles the UI form for uploads. Deploy it to your web hosting service or locally for testing.

# Setting Up AWS Lambda Functions
## Deploy LambdaPost.js

This function uploads files to S3 and stores descriptions and paths in DynamoDB.

- Create a new Lambda function in AWS Management Console
- Upload LambdaPost.js as the function code
- Set the trigger as API Gateway and configure the API endpoint

## Deploy LambdaVMCreator.js

This function triggers an EC2 instance for file processing.

- Create another Lambda function in AWS Management Console
- Upload LambdaVMCreator.js as the function code
- Configure the trigger as needed (e.g., S3 event)

# Configuring AWS EC2
## Set Up EC2 Instance
Configure an EC2 instance with the necessary software and scripts for file processing.

- Launch an EC2 instance via AWS Management Console or AWS CLI
- Attach the prepared IAM role for S3 and DynamoDB access

## Automate Script Execution

Ensure your file processing script executes automatically, triggered by LambdaVMCreator.js.

## Usage

- Access the deployed UI to upload a file and description.
- Submitting the form uploads the file to S3 and stores the description and file path in DynamoDB.
- LambdaVMCreator.js processes the file, appends the description, and uploads it to a different S3 bucket. The new path is stored in DynamoDB.
