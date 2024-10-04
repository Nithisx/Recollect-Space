import React, { useState } from 'react';
import Header from './Header';
import folder from '../assets/folder.png';

export const Myfiles = () => {
  const [folders, setFolders] = useState({ memory: [], documents: [], other: [] });

  const addFolder = (section) => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      setFolders((prevState) => ({
        ...prevState,
        [section]: [...prevState[section], folderName],
      }));
    }
  };

  const renderFolders = (section) => {
    return folders[section].map((folderName, index) => (
      <div key={index} className="flex flex-col items-center gap-1">
        <img src={folder} alt="Folder" className="w-20 h-20" /> 
        <p className="text-sm">{folderName}</p>
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
                <div className="flex gap-2">{renderFolders('memory')}</div> {/* Horizontal scrolling and reduced gap */}
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
                <div className="flex gap-2">{renderFolders('documents')}</div> {/* Horizontal scrolling and reduced gap */}
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
                <div className="flex gap-2">{renderFolders('other')}</div> {/* Horizontal scrolling and reduced gap */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Myfiles;
