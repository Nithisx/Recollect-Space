

// export default FolderPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const FolderPage = () => {
    const { folderId } = useParams();
    const [folder, setFolder] = useState(null);
    const [photos, setPhotos] = useState([]);
    const [file, setFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchFolder = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found');
                }
    
                // Ensure you use folderId to fetch the folder
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

    if (errorMessage) {
        return <p className="text-red-500">{errorMessage}</p>;
    }

    if (!folder) {
        return <p>Loading folder...</p>;
    }

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold">{folder.name || 'Untitled Folder'}</h1>
            <h2 className="text-xl">Photos</h2>
            <ul>
                {photos.length > 0 ? (
                    photos.map((photo) => (
                        <li key={photo._id} className="mb-4">
                            <img 
                                src={`data:${photo.contentType};base64,${photo.data}`} 
                                alt="Uploaded" 
                                width="200" 
                            />
                            <p>Uploaded at: {new Date(photo.uploadedAt).toLocaleString()}</p>
                        </li>
                    ))
                ) : (
                    <p>No photos uploaded yet.</p>
                )}
            </ul>
            <form onSubmit={handleUpload}>
                <input type="file" onChange={handleFileChange} />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Upload Photo</button>
            </form>
        </div>
    );
};

export default FolderPage;
