import { Link } from "react-router-dom"
import './dictionary.css'

export default function Dictionary(){
    return(
        <>
            <main>
                <h1>Dictionary</h1>
                <div class="search-box">
                    <input type="text" id="searchInpu" placeholder="Search a word..." />
                    <button id="searchBtn">Search</button>
                </div>
            </main>
        </>
    );
}