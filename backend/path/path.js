const fs = require("fs");
const path = require("path");

// Define the base directory where uploads will be stored
const baseUploadDirectory = "./uploads";

// Create the base uploads directory if it doesn't exist
if (!fs.existsSync(baseUploadDirectory)) {
    fs.mkdirSync(baseUploadDirectory, { recursive: true });
}

// Define a function to check and create subdirectories as needed
const createUploadDirectory = (directory) => {
    const uploadDirectory = path.join(baseUploadDirectory, directory);
    if (!fs.existsSync(uploadDirectory)) {
        fs.mkdirSync(uploadDirectory, { recursive: true });
    }
    return uploadDirectory;
};

module.exports = {
    createUploadDirectory,
    baseUploadDirectory,
};