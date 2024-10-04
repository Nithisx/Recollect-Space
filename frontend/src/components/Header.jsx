import React from 'react';
import { Link } from 'react-router-dom'; 
import profile from '../assets/profile.png';  

export const Header = () => {
    return (
        <header className="poppins-light bg-white shadow-md w-full">
            <div className="container mx-auto flex items-center justify-between py-4 px-6">
                <div className="text-2xl font-semibold">
                    <Link to="/" className="text-gray-800 hover:text-gray-600 transition-colors">
                        Memory Keeper
                    </Link>
                </div>

                <nav className="flex space-x-6 text-lg">
                    <Link
                        to="/"
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                        Home
                    </Link>
                    <Link
                        to="/myfiles"
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                        My Files
                    </Link>
                    <Link
                        to="/aboutus"
                        className="text-gray-700 hover:text-blue-600 transition-colors duration-200"
                    >
                        About Us
                    </Link>
                </nav>

                <div>
                    <Link to="/auth">
                        <img src={profile} alt="Profile" className="w-10 h-10 rounded-full" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
