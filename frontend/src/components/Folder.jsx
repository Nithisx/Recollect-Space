import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Header from "./Header"


const FolderPage = () => {
    const { folderId } = useParams();
    const [folder, setFolder] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate(); // Hook for navigation

    useEffect(() => {
        const fetchFolder = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`http://localhost:5003/api/folders/${folderId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const folderData = response.data.folder;
                setFolder(folderData || {});
                setPhotos(folderData?.photos || []);
            } catch (error) {
                console.error(error);
                setErrorMessage('Could not fetch folder details.');
            }
        };

        fetchFolder();
    }, [folderId]);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setErrorMessage('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('photo', file);

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            await axios.post(`http://localhost:5003/api/folders/${folderId}/upload`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });

            const response = await axios.get(`http://localhost:5003/api/folders/${folderId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const updatedFolder = response.data.folder;
            setPhotos(updatedFolder?.photos || []);
            alert('Photo uploaded successfully!');
            setFile(null);
        } catch (error) {
            console.error(error);
            setErrorMessage('Error uploading file.');
        }
    };

    const handleAddBlockClick = () => {
        navigate(`/folders/${folderId}/blog`); // Navigate to the blog page
    };

    if (errorMessage) {
        return <p className="text-red-500 text-center">{errorMessage}</p>;
    }

    if (!folder) {
        return <p className="text-gray-700 text-center">Loading folder...</p>;
    }

    return (
        <>
        <Header/>
        <div className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">{folder.name || 'Untitled Folder'}</h1>
                <button 
                    onClick={handleAddBlockClick} 
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow-md">
                    Add Block
                </button>
            </div>

            <h2 className="text-xl font-semibold mb-4 text-gray-700">Photos</h2>

            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {photos.length > 0 ? (
                    photos.map((photo) => (
                        <li key={photo._id} className="mb-4">
                            <img
                                className="w-full h-48 object-cover rounded-lg shadow-md"
                                src={`data:${photo.contentType};base64,${photo.data}`}
                                alt="Uploaded"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Uploaded at: {new Date(photo.uploadedAt).toLocaleString()}
                            </p>
                        </li>
                    ))
                ) : (
                    <p className="text-gray-600">No photos uploaded yet.</p>
                )}
            </ul>

            <form onSubmit={handleUpload} className="mt-6">
                <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-2" htmlFor="fileUpload">
                        Upload a Photo
                    </label>
                    <input
                        id="fileUpload"
                        type="file"
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-600 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button 
                    type="submit" 
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md">
                    Upload Photo
                </button>
            </form>
        </div>
        
        </>
    );
};

export default FolderPage;
