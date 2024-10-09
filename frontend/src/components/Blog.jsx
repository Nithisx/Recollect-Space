import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from "./Header"

const BlogPage = () => {
    const { folderId } = useParams(); // Get the folder ID from the URL
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [blogs, setBlogs] = useState([]); // State to hold the blogs
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

    // Fetch the blogs when the component mounts
    useEffect(() => {
        const fetchBlogs = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await axios.get(`http://localhost:5003/api/folders/${folderId}/blogs`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setBlogs(response.data);  // Set the blogs in state
            } catch (error) {
                console.error(error);
                setErrorMessage('Error fetching blogs.');
            }
        };

        fetchBlogs();
    }, [folderId]);

    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (e) => {
        setContent(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !content) {
            setErrorMessage('Please fill in both the title and content.');
            return;
        }

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                throw new Error('No token found');
            }

            const response = await axios.post(`http://localhost:5003/api/folders/${folderId}/blog`, {
                title,
                content,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setSuccessMessage('Blog block saved successfully!');
            setBlogs([response.data.blog, ...blogs]);  // Add the new blog to the list
            setTitle('');  // Clear the form
            setContent('');
            setErrorMessage(''); // Clear any previous error
            setIsModalOpen(false); // Close the modal after success
        } catch (error) {
            console.error(error);
            setErrorMessage('Error saving the blog block.');
        }
    };

    return (
        <>

        <Header/>
        <div className="p-4">
            <h1 className="text-2xl font-bold">Create a Block for Folder: {folderId}</h1>

            {errorMessage && <p className="text-red-500">{errorMessage}</p>}
            {successMessage && <p className="text-green-500">{successMessage}</p>}

            {/* Button to open modal */}
            <button
                className="bg-blue-600 text-white px-4 py-2 rounded mb-4"
                onClick={() => setIsModalOpen(true)}
            >
                Add New Blog Block
            </button>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
                        <h2 className="text-2xl mb-4">Add a Blog Block</h2>
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                                    Block Title
                                </label>
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Enter block title"
                                    value={title}
                                    onChange={handleTitleChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                                    Block Content
                                </label>
                                <textarea
                                    id="content"
                                    placeholder="Enter block content"
                                    value={content}
                                    onChange={handleContentChange}
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                                />
                            </div>
                            <div className="flex justify-end">
                                <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded mr-2" onClick={() => setIsModalOpen(false)}>
                                    Cancel
                                </button>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
                                    Save Block
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Display existing blogs */}
            <div className="mt-8">
                <h2 className="text-xl font-bold">Existing Blogs</h2>
                {blogs.length > 0 ? (
                    <ul>
                        {blogs.map((blog) => (
                            <li key={blog._id} className="mb-4 p-4 border rounded">
                                <h3 className="text-lg font-semibold">{blog.title}</h3>
                                <p className="text-gray-700">{blog.content}</p>
                                <small className="text-gray-500">Created at: {new Date(blog.createdAt).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No blogs have been written for this folder yet.</p>
                )}
            </div>
        </div>
        
        </>
    );
};

export default BlogPage;
