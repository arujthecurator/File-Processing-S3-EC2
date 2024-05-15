import React, { useState } from 'react';
import { S3Upload } from '../utility/S3Upload';
// import { launchEC2Instance } from '../lambda/EC2/LambdaVMCreator';

const FileUpload = () => {

    const [text, setText] = useState('');
    const [file, setFile] = useState(null);

    const handleTextChange = (e) => {
    setText(e.target.value);
    };

    const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    };


const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    // Call S3Upload function to upload file
    try {
        const uploadResponse = await S3Upload(file, file.name); // Pass file and filename to S3Upload function
        console.log('Upload response:', uploadResponse);

        // Assuming uploadResponse contains the path of the uploaded file in S3
        const filePath = uploadResponse.Location; // Update this line based on your actual response structure
        console.log('filepath:', filePath);

        console.log('Text:', text); // Handle text input here

        // Data to be sent in the POST request
        const postData = {
            input_text: text, // Assuming `text` is the text you want to send
            input_file_path: filePath, // The path of the uploaded file in S3
        };

        // Trigger the POST API call with the file text and the location of the file
        // The API created using Aws Gateway might look something like this- https://**********.execute-api.us-east-1.amazonaws.com/methodName
        const apiResponse = await fetch('https://**********.execute-api.us-east-1.amazonaws.com/methodName', {
            method: 'POST',
            headers: {
                'Access-Control-Allow-Origin' : '*',
                'Access-Control-Allow-Headers':'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Credentials' : true,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(postData),
        });

        if (apiResponse.ok) { // Check if the request was successful
            const apiResult = await apiResponse.json(); // Parse JSON response
            console.log('API Response:', apiResult);
            console.log('Message:', apiResult.message);
            console.log('Data:', apiResult.data);
            console.log('Input Text:', apiResult.data.input_text);
            console.log('Input File Path:', apiResult.data.input_file_path);
            console.log('ID:', apiResult.data.id);// Handle your API response here

            //launchEC2Instance(apiResult.data.input_text,apiResult.data.input_file_path);
        } else {
            console.error('API Request failed:', await apiResponse.text());
        }
    } catch (error) {
        console.error('Error:', error.response.data);
    }
};

  return (
    <div className='main-page'>
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="text">Text input: </label>
                <input
                type="text"
                id="text"
                value={text}
                onChange={handleTextChange}
                />
            </div>
            <br/>
            <div>
                <label htmlFor="file">File input: </label>
                <input
                type="file"
                id="file"
                
                onChange={handleFileChange}
                />
                {file ? (
                <p>Selected file: {file.name}</p>
                ) : (
                <p>No file chosen</p>
                )}
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
    
  );
};

export default FileUpload;
