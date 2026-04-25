import multer from 'multer';

// Configure multer for memory storage
const storage = multer.memoryStorage();

// File filter for images
const imageFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
  }
};

// File size limit (5MB)
const limits = {
  fileSize: 5 * 1024 * 1024, // 5MB
};

export const uploadImage = multer({
  storage,
  fileFilter: imageFilter,
  limits,
}).single('image');

export const uploadSignature = multer({
  storage,
  fileFilter: imageFilter,
  limits,
}).single('signature');

export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 5MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  } else if (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
  next();
};