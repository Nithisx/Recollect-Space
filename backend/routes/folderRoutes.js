
const express = require('express');
const router = express.Router();
const folderController = require('../controllers/folderController');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');

// Use memory storage for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('File type not allowed'), false);
        }
    }
});

// Folder routes
router.post('/create-folder', protect, folderController.createFolder);
router.get('/:folderId', protect, folderController.getFolderById); // Change to get folder by ID
router.get('/user/:userId', protect, folderController.getFoldersByUserId);
router.post('/:folderId/upload', protect, upload.single('photo'), folderController.uploadPhoto);

module.exports = router;


