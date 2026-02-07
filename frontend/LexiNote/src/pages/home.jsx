import { Link } from "react-router-dom";
import "./home.css"

export default function Home(){
    return (
        <>
            <main className="flex flex-col justify-center">
                <h1 className="!text-8xl !py-5 text-white font-bold font-['Montserrat']">LexiNote</h1>
                <div className="outline bg-gray-900 rounded-xl mx-10 mb-10 p-10 text-xl red hover:scale-101 hover:bg-gray-800 transition-all duration-500 font-['consolas'] italic">LexiNote is the all-in-one website for your word processing needs.<br/>Equipped with a powerful dictionary and versatile text editor, all on the web.
                </div>
                <div className="flex flex-row ml-50 mr-50 justify-center gap-x-[1vw] *:bg-blue-500 *hover:shadow-xl *:hover:scale-110 *:hover:rounded-xl *:hover:shadow-2xl *:active:scale-95 *:active:shadow-none *:transtion *:duration-200 *:transition-all: *duration-10">
                <Link to="/dictionary" className="hello text-2xl outline p-5 text-white hover:shadow-2xl">Dictionary</Link>
                <Link to="/editor" className="hello text-2xl outline px-10 pt-5">Editor</Link>
                </div>
            </main>
        </>
    );
}