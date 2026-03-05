import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navbar.css"

export default function Navbar(){
    const [isLight, setIsLight] = useState(localStorage.getItem("theme") === "light");

    useEffect(() => {
        if (isLight) {
            document.body.classList.add("light-mode");
            localStorage.setItem("theme", "light");
        } else {
            document.body.classList.remove("light-mode");
            localStorage.setItem("theme", "dark");
        }
    }, [isLight]);

    return(
        <div className="topnav">
            <Link className="home" to="/">✏️LexiNote</Link>
            <Link className="link" to="/dictionary">Dictionary📕</Link>
            <Link className="link" to="/random_word">Random Word</Link>
            <Link className="link" to="/editor">Text Editor📝</Link>
            <Link className="link" to="/status">Status📊</Link>
			<button id="theme-toggle" className="theme-btn" onClick={() => setIsLight(!isLight)}>
                <span id="theme-icon">{isLight ? "☀️" : "🌙"}</span>
            </button>
        </div>
    );
}