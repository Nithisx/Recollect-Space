const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const folderSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    section: {
        type: String,
        enum: ['memory', 'documents', 'other'],
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    photos: [
        {
            data: Buffer, // Store the image data as a Buffer
            contentType: String, // Store the content type of the image
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ]
}, { timestamps: true });

const Folder = mongoose.model('Folder', folderSchema);
module.exports = Folder;
