import { Link } from "react-router-dom"
import { useState } from "react";
import "./dictionary.css";

export default function Dictionary() {
  const [word, setWord] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!word.trim()) return;

    try {
      const response = await fetch(`https://lexinote.onrender.com/word/${word}`);
      console.log("Response status:", response.status);
      console.log(results);
      if (!response.ok) {
        throw new Error("Word not found");
      }

      const data = await response.json();
      setResults(data);
      setError("");
    } catch (err) {
      setResults([]);
      setError("Word not found");
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

  return (
    <main>
      <h1>Dictionary</h1>
      <div className="search-box">
        <input type="text" placeholder="Search a word..." value={word} onChange={(e) => setWord(e.target.value)}onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className="results">
        {error && <p className="error">{error}</p>}

        {results.length > 0 && (
          <>
            <h2>{results[0].word}</h2>
            <br/>
            <p>{results.length} found</p>
            <br/>
            {results.map((item, index) => (
              <div key={index} className="meaning">
                <p><em>{formatPOS(item.pos)}</em></p>
                <p>{item.definition}</p>
                {item.synonyms && item.synonyms.length > 0 && (
                  <p>
                    <strong>Synonyms:</strong> {item.synonyms.join(", ")}
                  </p>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </main>
  );
}