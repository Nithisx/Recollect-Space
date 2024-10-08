const Folder = require('../models/folderModel');
const User = require('../models/user'); // Assuming user model exists

// Define the createFolder function
const createFolder = async (req, res) => {
    try {
        const { name, section, userId } = req.body;

        const existingFolder = await Folder.findOne({ name, userId });
        if (existingFolder) {
            return res.status(400).json({ message: 'Folder already exists' });
        }

        const newFolder = new Folder({
            name,
            section,
            userId
        });
        await newFolder.save();

        res.status(201).json({ message: 'Folder created successfully', folder: newFolder });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Define the getFoldersByUserId function
const getFoldersByUserId = async (req, res) => {
    try {
        const { userId } = req.params; // Get userId from the route parameters
        const folders = await Folder.find({ userId }); // Fetch folders by userId

        if (!folders.length) {
            return res.status(404).json({ message: 'No folders found for this user' });
        }

        res.status(200).json({ folders });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

// Route setup

// Define the uploadPhoto function
const uploadPhoto = async (req, res) => {
    const { folderId } = req.params;

    try {
        const folder = await Folder.findById(folderId);
        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        folder.photos.push({
            data: req.file.buffer,
            contentType: req.file.mimetype,
            uploadedAt: new Date()
        });

        await folder.save();

        res.status(200).json({ folder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error uploading photo' });
    }
};

// Define the getFolderById function
// Define the getFolderById function
const getFolderById = async (req, res) => {
    try {
        const { folderId } = req.params;
        const folder = await Folder.findById(folderId);

        if (!folder) {
            return res.status(404).json({ message: 'Folder not found' });
        }

        const photos = folder.photos.map(photo => ({
            ...photo._doc,
            data: photo.data.toString('base64'), // Convert buffer to base64 string
        }));

        res.status(200).json({ folder: { ...folder._doc, photos } });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// Export all functions correctly
module.exports = {
    createFolder,
    getFoldersByUserId,
    uploadPhoto,
    getFolderById,
};
