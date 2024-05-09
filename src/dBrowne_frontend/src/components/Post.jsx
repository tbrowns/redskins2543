import React, { useState } from 'react';

import {db, storage} from '../firebase';
import { doc, setDoc } from "firebase/firestore"; 
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {motion} from 'framer-motion'

import './post.css'
import {getUserCredentials} from '../Utils/LocalStorage'

function Post() {
  const userCredentials = getUserCredentials();
  const username = userCredentials.username;
  
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState('');

  function uploadFile(e) {
    if(image == null) return;

    e.target.disabled=true;
    setLoading(true);
    const partKey = Date.now();

    const storageRef = ref(storage, `images/${username}-${partKey}.jpg`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on('state_changed', 
      (snapshot) => {
        const percentage = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
    
        setProgress(percentage);
       
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        // Handle successful uploads on complete

        async function addItem(downloadURL) {
          await setDoc(doc(db, "posts", `${partKey}` ), {
            uid: userCredentials.uid,
            username,
            photo: downloadURL,
            caption,
            like_count: 0,
            likes:[]
      
          });
      
        }
        
        setImageURL(null);
        setProgress(0);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
          addItem(downloadURL);
        
        });

        
      }
    );

    e.target.disabled = false;
    setLoading(false);
  }

  const handleImage = (e) => {
    const selectedImage = e.target.files[0];
    if (!selectedImage) return;

    setImage(selectedImage);
    setImageURL(URL.createObjectURL(selectedImage));

  };

  

  return (
    <div className='post'>
      {imageURL && (
        <div className='progress_bar_container'>
          <div className="progress_bar"
            style={{ width: `${progress}%`}}
          />
        </div>
      )}

      <div className='post_form'>

      {imageURL && 
        <div className='image_details'>
          <img src={imageURL} />

          <div className='image_caption'>
            <textarea onChange={(e) => setCaption(e.target.value)} placeholder='Write a caption...'></textarea>
          </div>
        </div>

      }

      <div className='image_upload'>
        <input onInput={handleImage} type='file' name='uploadimage' accept='image/*' />

      </div>

      <motion.button onClick={uploadFile} 
        whileHover={{ scale: 1.1, backgroundColor: 'whitesmoke' }}
        whileTap={{ scale: 0.9 }} 
        type="button"> 
        Upload 
      </motion.button>

      </div>
      
    </div>
  )
}

export default Post