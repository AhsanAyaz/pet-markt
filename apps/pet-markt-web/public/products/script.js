const fs = require("fs");
const path = require("path");

// Folder path
const folderPath = "./"; // Replace with your folder path

// Read the folder
fs.readdir(folderPath, (err, files) => {
  if (err) {
    return console.error("Unable to scan folder:", err);
  }

  // Filter and get only image files
  const imageFiles = files.filter((file) => {
    // Check for common image file extensions
    return [".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg"].includes(
      path.extname(file).toLowerCase()
    );
  });

  // Log the names of the image files
  console.log("Image files:", imageFiles);
});
