#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <file_path> <custom_parameter>"
    exit 1
fi

# Assign the arguments to variables
filePath="$1"
customParameter="$2"

# Append the custom parameter to the file
echo "${customParameter}" >> "${filePath}"
