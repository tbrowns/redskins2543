import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { createUserWithEmailAndPassword } from "firebase/auth";
import { db, auth } from '../firebase';
import { doc, setDoc } from "firebase/firestore"; 

import './login.scss'

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSignup() {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

        async function addUser() {
          await setDoc(doc(db, "users", `${user.uid}` ), {
            username,
            tokens: 0
          });

          console.log("Document written with ID: ", user.uid);
          window.location.href = '/Login';
        }

        addUser();
        

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..
      });
    
  }

  return (
    <section class="container forms">        
      <div class="form signup">
        <div class="form-content">
          <header>Sign up</header>

          <form action="#">
          <div class="field input-field">
              <input onInput={(e) => setUsername(e.target.value)} type="text" placeholder="Enter your name" class="input" />
            </div>

            <div class="field input-field">
              <input onInput={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" class="input"/>
            </div>

            <div class="field input-field">
              <input onInput={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" class="password"/>
            </div>

            <div class="field input-field">
              <input type="password" placeholder="Confirm your password" class="password" />
              <i class="bx bx-hide eye-icon"></i>
            </div>

            <div class="field button-field">
              <button onClick={handleSignup} type="button" id="sign-up-btn">Signup</button>
            </div>

          </form>

          <div class="form-link">
            <span>Already have an account? <Link to="/Login" class="link login-link">Login</Link></span>
          </div>

        </div>

        </div>
    </section>
  )
}

export default Register