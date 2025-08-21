const multer = require('multer');
const path = require('path');
const { createUploadDirectory } = require('../path/path');

// Define where to store uploaded files and set their names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subdirectory = 'tasks'; // Subdirectory for Excel files
    const uploadPath = createUploadDirectory(subdirectory);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

// Allowed MIME types for PDF and DOC/DOCX files
const allowedMimeTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/jpg',
  'image/webp',
];

// File filter to validate MIME type
const fileFilter = (req, file, cb) => {
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC/DOCX and image files are allowed'), false);
  }
};

// Max file size: 40MB
const maxSize = 40 * 1024 * 1024; // 40MB in bytes

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSize },
});

module.exports = { upload };
