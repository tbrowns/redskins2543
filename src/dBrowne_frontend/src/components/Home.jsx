import React, { useEffect, useState } from 'react';
import { BsEmojiSmile } from "react-icons/bs";
import { collection, query,getDoc, getDocs, doc, updateDoc } from "firebase/firestore";
import { db, auth } from '../firebase';
import './home.css';

import { getUserCredentials} from '../Utils/LocalStorage';

function Home() {
  const [postIds, setPostIds] = useState(new Set());
  const [posts, setPosts] = useState([]);

  const [currentUserId, setCurrentUserId] = useState("anonymous");

  useEffect(() => {

    try{
      setCurrentUserId(getUserCredentials().uid);

    }catch (error) { window.location.href = '/Login';}

    const getPosts = async () => {
      const q = query(collection(db, "posts"));
      const querySnapshot = await getDocs(q);
      const postList = [];
      const postIdSet = new Set();
      querySnapshot.forEach((doc) => {
        postList.push({ id: doc.id, ...doc.data(), likes: new Set(doc.data().likes) });
        postIdSet.add(doc.id);

      });
      setPosts(shuffleArray(postList)); // Shuffle the array before setting state
      setPostIds(postIdSet);
    }
    getPosts();
  }, [ ]);

  const shuffleArray = (array) => {
    // Durstenfeld shuffle algorithm
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleLike = async (postId) => {
    if (currentUserId === "anonymous") return;
      
    try {
      if (!postIds.has(postId)) return; // Post ID not found in Set
      
      const postIndex = posts.findIndex(post => post.id === postId);
      const post = posts[postIndex];

      const docRef = doc(db, "users", `${post.uid}`);
      const docSnap = await getDoc(docRef);
      let totalLikes 

      if (docSnap.exists()){
        totalLikes = docSnap.data().total_likes;
      }


      if (post.likes.has(currentUserId)) {
        // User has already liked the post, remove like
        post.likes.delete(currentUserId);
        totalLikes--;

      } else {
        // User has not liked the post, add like
        post.likes.add(currentUserId);
        totalLikes++;
      }

      const likeRef = doc(db, "users", `${post.uid}`);
      await updateDoc(likeRef, {
        total_likes:  totalLikes,
      
      });


      const updatedPost = { ...post, like_count: post.likes.size };

      const postRef = doc(db, "posts", postId);
      await updateDoc(postRef, {
        like_count: updatedPost.like_count,
        likes: [...post.likes]
      });

      setPosts(prevPosts => {
        const updatedPosts = [...prevPosts];
        updatedPosts[postIndex] = updatedPost;
        return updatedPosts;
      });
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  return (
    <div className="post-container">
      {posts.map((post) => (
        <div key={post.id} className="post">
          <img src={post.photo} alt="post" />
          <div className="post-content">
            <h1>{post.username}</h1>
            <p>{post.caption}</p>
            <button className="like_btn"
              onClick={() => handleLike(post.id)}>
              <BsEmojiSmile style={{ color: (post.likes).has(currentUserId) ? "pink" : "black", fontSize: "1.5rem" }} />
              <span>{post.like_count}</span>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Home;
