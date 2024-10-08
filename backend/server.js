const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db'); // Function to connect to your MongoDB
const authRoutes = require('./routes/authRoutes'); // Routes for authentication
const folderRoutes = require('./routes/folderRoutes'); // Updated to match casing
const path = require('path');


dotenv.config();
connectDB(); // Connect to the database

const app = express();

app.use(cors());
app.use(express.json()); // Middleware for parsing JSON bodies

// Set up routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/folders', folderRoutes); // Folder routes
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


const PORT = process.env.PORT || 5003; 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
