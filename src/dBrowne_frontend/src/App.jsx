import { useState } from 'react';
import { Routes, Route} from 'react-router-dom';
import { dBrowne_backend } from 'declarations/dBrowne_backend';

import { Post, Home, Login, Register, Header, Profile } from './components';
import './index.scss';

function App() {
  const [greeting, setGreeting] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    dBrowne_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <main>
      <Header/>
      <Routes>
        <Route path="/*" element={<Home/>} />
        <Route path="/Post" element={<Post />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Register" element={<Register />} />

        <Route path="/Profile" element={<Profile />} />

      </Routes>
    </main>
  );
}

export default App;
