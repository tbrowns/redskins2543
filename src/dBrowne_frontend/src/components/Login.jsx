import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db, auth } from '../firebase';

import './login.css'
import { setUserCredentials } from '../Utils/LocalStorage';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    console.log(email, password);
  }, [email, password]);

  function handleLogin() {
    

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;

    

        const docRef = doc(db, "users", `${user.uid}`);

        async function getDocData() {
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()){
            setUserCredentials({uid: user.uid, ...docSnap.data()});
            console.log("Document data:", docSnap.data());
          }

          window.location.href = '/';

        }

        getDocData();
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        // ..

        console.log(errorCode, errorMessage);
      });
    
  }

  return (
    <section class="container forms">
      <div class="form login">
        <div class="form-content">
          <header>Login</header>

          <form action="#">
            <div class="field input-field">
              <input onInput={(e) => setEmail(e.target.value)} type="email" placeholder="Enter your email" class="input" name="email"/>
            </div>

            <div class="login-error">
              <p>Invalid email</p>
            </div>

            <div class="field input-field">
              <input onInput={(e) => setPassword(e.target.value)} type="password" placeholder="Enter your password" class="password" id="login-password" name="password"/>
              <i class="bx bx-hide eye-icon"></i>
            </div>

            <div class="login-error">
              <p>Wrong password</p>
            </div>

            <div class="form-link">
              <a href="#" class="forgot-pass">Forgot password?</a>
            </div>

            <div class="field button-field">
              <button onClick={handleLogin} type="button" id="login-btn">Login</button>
            </div>

          </form>

          <div class="form-link">
            <span>Don't have an account? <Link to="/Register" class="link signup-link">Signup</Link></span>
          </div>

        </div>

        </div>

      
    </section>
  )
}

export default Login