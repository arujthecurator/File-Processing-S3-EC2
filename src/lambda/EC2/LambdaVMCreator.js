const AWS = require('aws-sdk');
const url=""; // enter the s3 file path url here that needs to be added to the EC2 Instance, something like this- s3://bucket-name/InputFile.txt

// Configure AWS, alternatively can use AWS Cognito as well
AWS.config.update({
  region: 'us-east-1', // enter your region name
  accessKeyId: '**********', // enter your accessKeyId here
  secretAccessKey: '*********' // enter your secretAccessKey here
});

async function launchEC2Instance(customParameter, textFilePath) {
    const ec2 = new AWS.EC2();
    const sourceBucketName=""; //enter the source s3 bucket name
    const targetBucketName=""; // enter the target s3 bucket name
    const scriptFileName="fileAppender.sh";
    const outputPath="/tmp/"
    const textFileName=textFilePath.split('/').pop();

  // User data script
  const userDataScript = `
  # Extract just the file name from the full S3 path of the text file
  textFileName=$(basename ${textFilePath})
  
  # Download the script file
  aws s3 cp s3://${sourceBucketName}/${scriptFileName} /tmp/${scriptFileName}
  
  # Download the text file based on its full S3 path
  aws s3 cp ${textFilePath} /tmp/${textFileName}
  
  # Ensure the script is executable
  chmod +x /tmp/${scriptFileName}
  
  # Execute the script with the text file and custom parameter, capture output
  /tmp/${scriptFileName} /tmp/${textFileName} ${customParameter} > ${outputPath} 2>&1
  
  # Upload the output back to S3
  aws s3 cp ${outputPath} s3://${targetBucketName}/script_output.txt
`;

  // Parameters for EC2 instance
  const params = {
    ImageId: '', // Specify the AMI ID of the instance you want to launch, looks like this: ami-********
    InstanceType: '', // Specify the instance type
    MinCount: 1,
    MaxCount: 1,
    UserData: Buffer.from(userDataScript).toString('base64') // Encoding the user data as Base64
  };

  try {
        const data = await ec2.runInstances(params).promise();
        const instanceId = data.Instances[0].InstanceId;
        console.log("Instance ID:", instanceId);

        // Wait for the instance to be in running state
        await ec2.waitFor('instanceRunning', { InstanceIds: [instanceId] }).promise();
        console.log("Instance is now running");
    
        console.log("Waiting before terminating instance...");
        await new Promise(resolve => setTimeout(resolve, 10000)); // 5 minutes wait

        // Terminate the instance
        console.log("Terminating instance:", instanceId);
        await ec2.terminateInstances({ InstanceIds: [instanceId] }).promise();
        console.log("Instance terminated.");
    }
    catch (err) {
    console.error("Error:", err);
    }
}
launchEC2Instance("Hellow World",url );