import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from './pages/home.jsx'
import Status from './pages/status.jsx'
import Navbar from './pages/navbar.jsx'
import Dictionary from './pages/dictionary.jsx'
import Editor from './pages/editor.jsx'
import WOTD from './pages/wotd.jsx'

export default function App() {
  return (
    <>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/status" element={<Status/>} />
        <Route path="/dictionary" element={<Dictionary/>} />
        <Route path="/editor" element={<Editor/>}/>
        <Route path="/wotd" element={<WOTD/>}/>
      </Routes>
    </>
  );
}
