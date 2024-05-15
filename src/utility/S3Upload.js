import S3 from "aws-sdk/clients/s3";
import AWS from "aws-sdk/global";

export const S3Upload = (file, filename) => {
    return new Promise((resolve, reject) => {
        const identityPool = ""; //enter your Cognito Pool Id here, can look something like this- us-east-1:********-****-
        AWS.config.update({
            region: "us-east-1", // Replace with your actual region
            credentials: new AWS.CognitoIdentityCredentials({
                IdentityPoolId: identityPool,
            }),
        });

        const S3Client = new S3();
        const date = new Date();

        const params = {
            Bucket: "", // enter your S3 bucket name here
            Key: filename + date.getTime(),
            Body: file,
            ContentType: file.type,
        };

        S3Client.upload(params, function(err, data) {
            if (err) {
                console.error("Error uploading file:", err);
                reject(err);
            } else {
                console.log("File uploaded successfully:", data);
                resolve(data);
            }
        });
    });
};
