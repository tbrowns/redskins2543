import React, { useEffect, useState } from 'react'
import { BsEmojiSmile } from "react-icons/bs";
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import { signOut } from "firebase/auth";

import { getUserCredentials, removeUserCredentials } from '../Utils/LocalStorage';

import './profile.css'
import './home.css'


function Profile() {
    const userCredentials = getUserCredentials();
    const [postIds, setPostIds] = useState(new Set());
    const [posts, setPosts] = useState([]);
    const [totalLikes, setTotalLikes] = useState(userCredentials.total_likes);
    const [userName, setUserName] = useState(userCredentials.username);

    const handleSignOut = () => {
      removeUserCredentials();
      window.location.href = '/';
    };
    
    useEffect(() => {
      const getPosts = async () => {
        const q = query(collection(db, "posts"), where("username", "==", userName));
        const querySnapshot = await getDocs(q);
        const postList = [];
        const postIdSet = new Set();
        querySnapshot.forEach((doc) => {
          postList.push({ id: doc.id, ...doc.data(), likes: new Set(doc.data().likes) });
          postIdSet.add(doc.id);
  
        });
        setPosts(postList); // Shuffle the array before setting state
        setPostIds(postIdSet);
      }
      getPosts();
    }, []);
  
  
    return (
      <div className="profile">
        <div className='profile-header'>
          <div className="profile-info">
            <p>Tokens</p> 
            <p className='tokens'>{(totalLikes*0.01).toFixed(2)}</p>
          </div>
          <button className='signout' onClick={handleSignOut}>Sign Out</button>
        </div>
        <div className="post-container">
        {posts.map((post) => (
          <div key={post.id} className="post">
            <img src={post.photo} alt="post" />
            <div className="post-content">
              <p>{post.caption}</p>
              <button className="like_btn">
                <BsEmojiSmile style={{ color:"pink", fontSize: "1.5rem" }} />
                <span>{post.like_count}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      </div>
    );
  }

export default Profile