import { Link } from "react-router-dom"
import './status.css'

export default function Status(){
    return(
        <>
            <main className="status">
                <h1>Status</h1>
                <p>Built on the <strong>MERN</strong> Stack</p>
                <div className="text">
                    <p><strong><br/>MongoDB:</strong> Contains more than 2,00,000 words with definitions, parts of speech and synonyms, all hosted online.</p>
                    <p><strong>Express.js: </strong>Acts as the connection between the frontend and the backend</p>
                    <p><strong>React.js: </strong>Versatile tool used for frontend design and functionality</p>
                    <p><strong>Node.js: </strong>Provides server-side runtime environment</p>
                </div>
                <br/><br/>
                <a className='linktext' href="https://github.com/piyushvarman/lexinote">Source Code</a>
            </main>
        </>
    );
}