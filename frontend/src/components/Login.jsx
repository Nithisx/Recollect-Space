import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Import Axios for API requests
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const showSignup = () => {
        setIsLoginVisible(false);
        setEmail('');
        setPassword('');
        setErrorMessage('');
    };

    const showLogin = () => {
        setIsLoginVisible(true);
        setEmail('');
        setPassword('');
        setErrorMessage('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
      
        if (!email || !password) {
          setErrorMessage('Please fill in both fields.');
          return;
        }
      
        try {
          if (isLoginVisible) {
            // Login API call
            const response = await axios.post('http://localhost:5003/api/auth/login', { email, password });
            const loggedInUser = response.data.user;
            const token = response.data.token; // Get the token from response
      
            localStorage.setItem('authToken', token); // Store token correctly
            localStorage.setItem('user', JSON.stringify(loggedInUser));
            setUser(loggedInUser);
      
            alert('Login successful');
            navigate('/');
          } else {
            // Signup API call
            const response = await axios.post('http://localhost:5003/api/auth/register', { email, password });
            const signedUpUser = response.data.user;
            const token = response.data.token; // Get the token from response
      
            localStorage.setItem('authToken', token); // Store token correctly
            localStorage.setItem('user', JSON.stringify(signedUpUser));
            setUser(signedUpUser);
      
            alert('Signup successful');
            navigate('/');
          }
        } catch (error) {
          setErrorMessage(error.response.data.message || 'An error occurred');
        }
      
        setEmail('');
        setPassword('');
      };
      

    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        alert("Logged out successfully");
    };

    if (user) {
        return (
            <>
                <Header />
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="bg-white p-8 rounded-lg shadow-md text-center">
                        <h2 className="text-xl font-medium">Welcome, {user.email}!</h2>
                        <button
                            onClick={handleLogout}
                            className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition mt-4"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="bg-white rounded-lg flex overflow-hidden w-full max-w-3xl h-96 relative">
                    <div
                        className={`w-1/2 p-8 transition-transform duration-500 ${isLoginVisible ? 'scale-100' : 'scale-0'}`}
                    >
                        <h1 className="text-xl font-medium">Log In</h1>
                        <p className="text-sm text-gray-600">Login to your account to upload or download pictures, videos, or music.</p>
                        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                                    placeholder="Enter Your Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <a href="#" className="text-sm text-blue-500">Forgot Password?</a>
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                                    Login <i className="fas fa-angle-right"></i>
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-sm mt-4">
                            Don't have an account yet?{' '}
                            <span className="text-blue-500 cursor-pointer" onClick={showSignup}>
                                Sign up
                            </span>
                        </p>
                    </div>

                    {/* Signup Container */}
                    <div
                        className={`w-1/2 p-8 transition-transform duration-500 ${isLoginVisible ? 'scale-0' : 'scale-100'}`}
                    >
                        <h1 className="text-xl font-medium">Signup</h1>
                        <p className="text-sm text-gray-600">Create your account to upload or download pictures, videos, or music.</p>
                        {errorMessage && <p className="text-red-500 text-sm mt-2">{errorMessage}</p>}
                        <form onSubmit={handleSubmit} className="mt-4">
                            <div className="mb-3">
                                <input
                                    type="email"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                                    placeholder="Enter Your Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none"
                                    placeholder="Enter Your Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center justify-between">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700 transition">
                                    Signup <i className="fas fa-angle-right"></i>
                                </button>
                            </div>
                        </form>
                        <p className="text-center text-sm mt-4">
                            Already have an account?{' '}
                            <span className="text-blue-500 cursor-pointer" onClick={showLogin}>
                                Login here
                            </span>
                        </p>
                    </div>

                    {/* Banner */}
                    <div
                        className={`absolute right-0 top-0 h-full w-1/2 transition-transform duration-500 ${isLoginVisible ? 'translate-x-0' : '-translate-x-full'}`}
                    >
                        <img
                            src="https://img.freepik.com/free-vector/abstract-flat-design-background_23-2148450082.jpg?size=626&ext=jpg&ga=GA1.1.1286474015.1708934801&semt=sph"
                            alt="Banner"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Login;
