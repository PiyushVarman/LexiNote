import { Link } from "react-router-dom"
import './dictionary.css'

export default function Dictionary(){
    return(
        <>
            <main>
                <h1>Dictionary Page</h1>
                <form>
                    <input type="text" placeholder="Input Word"></input>
                </form>
            </main>
        </>
    );
}