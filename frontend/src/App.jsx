import { useState } from 'react';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Myfiles from './components/Myfiles';
import { Aboutus } from './components/Aboutus';

function App() {

  return (
      <>
          <Router>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/auth' element={<Login/>}/>
              <Route path='/myfiles' element={<Myfiles/>}/>
              <Route path='/aboutus' element={<Aboutus/>}/>


            </Routes>
          </Router>

      </>
  );
}

export default App;
