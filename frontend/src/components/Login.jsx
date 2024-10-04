import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, signInWithRedirect, FacebookAuthProvider} from "firebase/auth";
import { app } from '../../../backend/firebase';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Header from './Header'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [isLoginVisible, setIsLoginVisible] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [user, setUser] = useState(null);


    const navigate = useNavigate();
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();


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

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage('');



        if (!email || !password) {
            setErrorMessage('Please fill in both fields.');
            return;
        }

        if (isLoginVisible) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const loggedInUser = userCredential.user;
                    localStorage.setItem('user', JSON.stringify(loggedInUser));
                    setUser(loggedInUser);
                    alert("Login successful");
                    navigate('/')

                })
                .catch((error) => {
                    setErrorMessage(error.message);
                });
        } else {
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    const signedUpUser = userCredential.user;
                    localStorage.setItem('user', JSON.stringify(signedUpUser));
                    setUser(signedUpUser);
                    alert("Signup successful");
                    navigate('/')
                })
                .catch((error) => {
                    setErrorMessage(error.message);
                });
        }

        setEmail('');
        setPassword('');
    };

    const handleLogout = () => {
        // Clear localStorage and log out user
        localStorage.removeItem('user');
        setUser(null);
        alert("Logged out successfully");
    };

    // if (user) {
    //     return (
    //         <>
    //             <Header />
    //             <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //                 <div className="bg-white p-8 rounded-lg shadow-md text-center">
    //                     <h2 className="text-xl font-medium">Welcome, {user.email}!</h2>
    //                     <button
    //                         onClick={handleLogout}
    //                         className="bg-red-600 text-white px-4 py-2 rounded shadow hover:bg-red-700 transition mt-4"
    //                     >
    //                         Logout
    //                     </button>
    //                 </div>
    //             </div>
    //         </>
    //     );
    // }


    const logininwithgoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/')
            }).catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
            });

    }

    const sigininwithgoogle = () => {
        signInWithRedirect(auth, provider);
        navigate('/')
    }

    const logininwithfacebook = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                const user = result.user;
                const credential = FacebookAuthProvider.credentialFromResult(result);
                const accessToken = credential.accessToken;
                localStorage.setItem('user', JSON.stringify(user));

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.customData.email;
                const credential = FacebookAuthProvider.credentialFromError(error);
            });
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
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300" onClick={logininwithfacebook}>
                                <i className="fab fa-facebook-f text-blue-600"></i>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300" onClick={logininwithgoogle}>
                                <i className="fab fa-google text-red-500"></i>
                            </button>
                        </div>
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
                        <div className="mt-4 flex items-center justify-center gap-2">
                            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300" onClick={logininwithfacebook}>
                                <i className="fab fa-facebook-f text-blue-600"></i>
                            </button>
                            <button className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300" onClick={sigininwithgoogle}>
                                <i className="fab fa-google text-red-500"></i>
                            </button>
                        </div>
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
