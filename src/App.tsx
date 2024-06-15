import { DarkThemeToggle } from "flowbite-react";
import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Board from "./Components/Board";
import TopNav from "./Components/TopNav";
import Dashboard from "./Pages/Dashboard";
import Tasks from "./Pages/Tasks";
import Projects from "./Pages/Projects";


function App() {
  return (
    
      
      <Router>
           <Routes>
                  <Route  path='/' element={< Dashboard/>}></Route>
                 <Route  path='/Projects/:projectId' element={<Tasks />}></Route>
                 <Route path='/Projects' element={<Projects />}></Route>
          </Routes> 
          </Router>
  );
    
}

export default App;
