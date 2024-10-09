import { useState } from 'react';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import Myfiles from './components/Myfiles';
import { Aboutus } from './components/Aboutus';
import FolderPage from './components/Folder'
import BlogPage from './components/Blog'

function App() {

  return (
      <>
          <Router>
            <Routes>
              <Route path='/' element={<Home/>}/>
              <Route path='/auth' element={<Login/>}/>
              <Route path='/myfiles' element={<Myfiles/>}/>
              <Route path='/aboutus' element={<Aboutus/>}/>
              <Route path="/folder/:folderId" element={<FolderPage />}/>
              <Route path="/folders/:folderId/blog" element={<BlogPage />} />
            </Routes>
          </Router>

      </>
  );
}

export default App;
