// Import necessary AWS SDK clients and commands
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand ,GetCommand} = require("@aws-sdk/lib-dynamodb");
const { nanoid } = require("nanoid");

// Create an instance of the DynamoDBDocumentClient
const client = DynamoDBDocumentClient.from(
    new DynamoDBClient({ region: "us-east-1" }) // Specify your region
);

exports.handler = async (event) => {
    // Generate a unique ID using nanoid
    const id = nanoid();

    // Assume event.body is a stringified JSON object and parse it
    const { input_text, input_file_path } = JSON.parse(event.body);
    // const input_text="testlambfeawdanow";
    // const input_file_path="fan/ewfnlk/nfaewfnrn.com";

    // Define parameters for inserting data into DynamoDB
    const params = {
        TableName: process.env.TABLE_NAME, // Ensure this environment variable is set in the environment
        Item: {
            id, // Auto-generated ID
            input_text, // Text input from the frontend
            input_file_path // S3 path from the frontend
        }
    };

    try {
        // Use the PutCommand to insert the item into DynamoDB
        await client.send(new PutCommand(params));
        const getParams = {
            TableName: process.env.TABLE_NAME, // Ensure this environment variable is set in the environment
            Key: {
                id // Use the generated ID to retrieve the item
            }
        };

        // Use the GetCommand to retrieve the item from DynamoDB
        const response = await client.send(new GetCommand(getParams));

        // Return a success response with the retrieved item
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Entry saved and retrieved successfully", data: response.Item }),
            headers: { "Content-Type": "application/json" }
        };

        
    } catch (error) {
        console.error("DynamoDB error:", error);

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Failed to save entry" }),
            headers: { "Content-Type": "application/json" }
        };
    }
};
