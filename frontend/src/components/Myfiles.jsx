import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; 
import Header from './Header';
import folderIcon from '../assets/folder.png'; 

export const Myfiles = () => {
  const [folders, setFolders] = useState({ memory: [], documents: [], other: [] });
  const [user, setUser] = useState(null);
  const navigate = useNavigate();    

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    if (loggedInUser) {
      setUser(loggedInUser);
      fetchFolders(loggedInUser._id);
    }
  }, []);

  // Fetch folders from the backend, now storing both the folder ID and name
  const fetchFolders = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No token found');
      }
      console.log('userId:', userId);


      const response = await axios.get(`http://localhost:5003/api/folders/user/${userId}`, {  // Correct URL
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      

      const fetchedFolders = response.data.folders;
      const organizedFolders = { memory: [], documents: [], other: [] };

      fetchedFolders.forEach((folder) => {
        organizedFolders[folder.section].push({ id: folder._id, name: folder.name }); // Storing folder ID along with name
      });

      setFolders(organizedFolders);
    } catch (error) {
      console.error('Error fetching folders:', error.response ? error.response.data : error.message);
    }

  };

  // Create a folder and save it to the database
  const addFolder = async (section) => {
    const folderName = prompt('Enter folder name:');
    if (folderName && user) {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          throw new Error('No token found');
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.post(
          'http://localhost:5003/api/folders/create-folder',
          {
            name: folderName,
            section: section,
            userId: user._id,
          },
          config
        );

        // Update folder state after successful creation
        setFolders((prevState) => ({
          ...prevState,
          [section]: [...prevState[section], { id: response.data.folder._id, name: folderName }],
        }));
      } catch (error) {
        console.error('Error creating folder:', error.response ? error.response.data : error.message);
      }
    }
  };

  // Render folders dynamically and navigate to specific folder on click
  const renderFolders = (section) => {
    return folders[section].map((folder, index) => (
      <div
        key={index}
        className="flex flex-col items-center gap-1 cursor-pointer"
        onClick={() => navigate(`/folder/${folder.id}`)} // Navigate to the folder page by folder ID
      >
        <img src={folderIcon} alt="Folder" className="w-20 h-20" />
        <p className="text-sm">{folder.name}</p>
      </div>
    ));
  };

  return (
    <>
      <Header />
      <div className="flex flex-col h-screen">
        <div className="flex flex-1 mt-6">
          <div className="w-1/3 flex flex-col items-center gap-8 shadow-2xl">
            <p className="m-5 text-blue-600 text-2xl font-semibold">Quick Access</p>
            <input
              type="text"
              className="border border-gray-400 rounded-lg p-3 w-3/4 shadow-md"
              placeholder="Search or Add Files"
            />
          </div>

          <div className="w-2/3 flex flex-col justify-between p-6">
            {/* Memory Section */}
            <div>
              <div className="flex justify-between">
                <h3 className="text-2xl font-semibold mb-4">Memory</h3>
                <button
                  onClick={() => addFolder('memory')}
                  className="text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 py-2 px-4 rounded-md"
                >
                  Create Folder
                </button>
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-2">{renderFolders('memory')}</div>
              </div>
            </div>

            {/* Documents Section */}
            <div>
              <div className="flex justify-between">
                <h3 className="text-2xl font-semibold mb-4">Documents</h3>
                <button
                  onClick={() => addFolder('documents')}
                  className="text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 py-2 px-4 rounded-md"
                >
                  Create Folder
                </button>
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-2">{renderFolders('documents')}</div>
              </div>
            </div>

            {/* Other Files Section */}
            <div>
              <div className="flex justify-between">
                <h3 className="text-2xl font-semibold">Other Files</h3>
                <button
                  onClick={() => addFolder('other')}
                  className="text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 py-2 px-4 rounded-md"
                >
                  Create Folder
                </button>
              </div>
              <div className="overflow-x-auto">
                <div className="flex gap-2">{renderFolders('other')}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Myfiles;
