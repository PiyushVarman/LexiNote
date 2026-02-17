import { Link } from "react-router-dom"
import './wotd.css'

export default function WOTD(){
    return(
        <>
            <main>
                <h1>Random Word</h1>
                <div className="word">
                    <p className="header">WORD</p>
                    <p className="definition">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aut rerum ipsam, esse necessitatibus maxime odit ipsa error, dolores dignissimos expedita ab. Beatae corrupti ut laborum aliquid ratione sed cumque iste.</p>
                </div>
            </main>
        </>
    );
}