import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./editor.css";

export default function Editor() {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const [status, setStatus] = useState("Ready");
  const [wordCount, setWordCount] = useState(0);

  // Initialize Quill (default toolbar like original)
  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });

      quillRef.current.on("text-change", () => {
        const text = quillRef.current.getText().trim();
        const words =
          text.length > 0 ? text.split(/\s+/).length : 0;
        setWordCount(words);
      });
    }
  }, []);

  // Upload
  const handleUpload = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Uploading...");

    try {
      const response = await fetch(
        "https://lexinote.onrender.com/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      quillRef.current.root.innerHTML = data.content;
      setStatus("File Loaded");
    } catch {
      setStatus("Upload Failed");
    }
  };

  // Save
  const handleSave = async () => {
    setStatus("Saving...");

    const html = quillRef.current.root.innerHTML;

    const response = await fetch(
      "https://lexinote.onrender.com/save",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: html }),
      }
    );

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "edited.docx";
    a.click();

    setStatus("Downloaded");
  };

  // Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="container">
      <div className="toolbar">
        <button className="buttons" onClick={() => fileInputRef.current.click()}>Upload</button>

        <button className="buttons" onClick={handleSave}>Download</button>

        <input
          type="file"
          accept=".docx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </div>

      <div
        id="editortools"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
    
        <div ref={editorRef} id="editor"></div>
      </div>

      <div className="status-bar">
        <span>Words: {wordCount}</span>&nbsp;
        <span>Status: {status}</span>
      </div>
    </div>
  );
}