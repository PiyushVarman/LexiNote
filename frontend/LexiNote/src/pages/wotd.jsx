import { Link } from "react-router-dom"
import { useState } from "react";
import './wotd.css'

export default function WOTD(){
    const [results, setResults] = useState([]);
    const [error, setError] = useState("");

    const handleRandom = async () => {
        try{
            const response = await fetch("http://localhost:5000/random");
            
            if (!response.ok)
            {
                throw new Error();
            }

            const data=await response.json();
            setResults(data);
            setError("");
        }
        catch (err)
        {
            setResults([]);
            setError("Could not fetch random word");
        }
    };

        const formatPOS = (pos) => {
    const map = {
        n: "Noun",
        v: "Verb",
        a: "Adjective",
        r: "Adverb",
        s: "Adjective",
    };

    return map[pos] || pos;
};

    return(
        <>
            <main>
                <h1>Random Word</h1>
                <button onClick={handleRandom}>Generate!</button>
                <div className="results">
                {error && <p className="error">{error}</p>}

                {results.length > 0 && (
                <>
                    <h2>{results[0].word.replace(/_/g," ")}</h2>

                    {results.map((item, index) => (
                    <div key={index} className="meaning">
                        <p>
                        <em>{formatPOS(item.pos)}</em>
                        </p>
                        <p>{item.definition}</p>
                        {item.synonyms && item.synonyms.length > 0 && (
                        <p>
                            <strong>Synonyms:</strong>{" "}
                            {item.synonyms.map(syn => syn.replace(/_/g," ")).join(", ")}
                        </p>
                        )}
                    </div>
                    ))}
                </>
                )}
            </div>
            </main>
        </>
    );
}