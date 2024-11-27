// import React, { useEffect, useState } from 'react';
import Departments from './Components/Departments';
import Employee from './Components/Employee';
import { Navbar } from './Components/Navbar';
import Projects from './Components/Projects';
import './App.css'


// import { Employee } from './Components/Employee';

const App = () => {

  return (
    <>
        <Navbar />
      <div className='container'>
        <Employee />
        <Departments />
        <Projects/>
      </div>
    </>
  );
};

export default App;
