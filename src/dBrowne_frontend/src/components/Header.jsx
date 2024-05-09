import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RxAvatar } from "react-icons/rx";

import './header.css'
import { getUserCredentials } from '../Utils/LocalStorage';

function Header() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [username, setUsername] = useState('');
    const location = useLocation();

    useEffect(() => {
        // Update pageName whenever the location changes
        const pageName = location.pathname;
        
        // Check if the user is signed in based on the pageName
        const userSignedIn = pageName !== '/Login';
        
        // Update isSignedIn state and username based on userSignedIn
        setIsSignedIn(userSignedIn);
        if (userSignedIn) {
            const userData = getUserCredentials();
            if (userData)
                setUsername(userData.username);
        }
    }, [location]);

    return (
        <div className='header'>
            <div className='logo'>PicMe</div>
            <div className='links'>
                <Link to='/'>
                    <button>Home</button>
                </Link>
                <Link to='/Post'>
                    <button>Post</button>
                </Link>
            </div>
            <div className='profile'>
                {isSignedIn ?
                    <Link to='/Profile' className='profile_link' >
                        <div className='image_container'>
                            <div><RxAvatar /></div>
                            <div>{username}</div>
                        </div>
                    </Link> :
                    <Link to='/Login'>
                        <button>Login</button>
                    </Link>
                }
            </div>
        </div>
    )
}

export default Header;
