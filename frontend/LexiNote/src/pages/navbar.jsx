import { Link } from "react-router-dom"
import "./Navbar.css"

export default function Navbar(){
    return(
        <div className="topnav">
            <Link className="home" to="/">✏️LexiNote</Link>
            <Link className="link" to="/dictionary">Dictionary📕</Link>
            <Link className="link" to="/editor">Text Editor📝</Link>
            <Link className="link" to="/status">Status📊</Link>
            <Link className="link" to="/">Empty Home</Link>
			<button className="dark_mode">⏾</button>
        </div>
    );
}