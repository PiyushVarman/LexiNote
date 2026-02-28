import { useEffect, useRef, useState } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./editor.css";
const Font = Quill.import("formats/font");
Font.whitelist = ["sans-serif", "serif", "monospace"];
Quill.register(Font, true);

export default function Editor() {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const fileInputRef = useRef(null);

  const [status, setStatus] = useState("Ready");
  const [wordCount, setWordCount] = useState(0);
  const [docTitle, setDocTitle] = useState("");
  

  useEffect(() => {
    if (!quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
        modules: {
          toolbar: "#toolbar", // attach to manual toolbar
        },
      });

      quillRef.current.on("text-change", () => {
        const text = quillRef.current.getText().trim();
        const words =
          text.length > 0 ? text.split(/\s+/).length : 0;
        setWordCount(words);
      });
    }
  }, []);

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
    a.download = `${docTitle||"Untitled Document"}.docx`;
    a.click();

    setStatus("Downloaded");
  };

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
        <input
          type="file"
          accept=".docx"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </div>

      {/* Visible Drop Zone */}
      <div id="dropZone" onDrop={handleDrop} onDragOver={handleDragOver}>
        Drag & Drop .docx file here
      </div>

      <input
      type="text"
      id="docTitle"
      className="doc-title"
      value={docTitle}
      onChange={(e) => setDocTitle(e.target.value)}
      placeholder="Enter Document Name"
      />

      {/* EXACT TOOLBAR — inserted here without moving layout */}
      <div id="toolbar">
        <select className="ql-font" title="Font"></select>
        <select className="ql-size" title="Size"></select>
        <button className="ql-bold" title="Bold"></button>
        <button className="ql-italic" title="Italicize"></button>
        <button className="ql-underline" title="Underline"></button>
        <button className="ql-strike" title="Strikethrough"></button>
        <select className="ql-color" title="Font Colour"></select>
        <select className="ql-background" title="Highlight"></select>
        <select className="ql-align" title=""></select>
        <button className="ql-list" value="ordered" title="Ordered List"></button>
        <button className="ql-list" value="bullet" title="Bullets"></button>
      </div>

      <div id="editortools">
        <div ref={editorRef} id="editor"></div>
      </div>

      <div className="status-bar">
        <span>Words: {wordCount}</span> | &nbsp;
        <span>Status: {status}</span>
      </div>

      <div className="toolbar">
        <button
          className="buttons"
          onClick={() => fileInputRef.current.click()}
        >
          📂 Upload File
        </button>

        <button className="buttons" onClick={handleSave}>
          💾 Download
        </button>
      </div>
    </div>
  );
}