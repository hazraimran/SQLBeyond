// src/components/SQLEditor.jsx
import { useState } from "react";
import Editor from "./SQLEditorComponents/Editor";
import "../styles/SQLEditor.css";

const SQLEditor = () => {
  const [query, setQuery] = useState("SELECT * FROM Customers");
  const [result, setResult] = useState([]);

  const executeQuery = async (query) => {
    try {
      const response = await fetch("http://localhost:5001/execute-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      const data = await response.json();
      if (response.ok) {
        setResult(data.results);
      } else {
        setResult([{ error: "Error executing query" }]);
      }
    } catch (error) {
      console.error("Error:", error);
      setResult([{ error: "Error connecting to server" }]);
    }
  };

  return (
    <div className="sql-editor-container">
      <div className="sidebar left-sidebar">
        <h1>Left Sidebar</h1>
      </div>
      <div className="main-editor">
        <h2>SQL Editor</h2>
        <Editor setQuery={setQuery} query={query} executeQuery={executeQuery} />
        <div className="result">
          <h3>Query Result:</h3>
          {Array.isArray(result) ? (
            <table>
              <thead>
                <tr>
                  {result.length > 0 &&
                    Object.keys(result[0]).map((key) => (
                      <th key={key}>{key}</th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {result.map((row, index) => (
                  <tr key={index}>
                    {Object.values(row).map((value, i) => (
                      <td key={i}>{value}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <pre>{result}</pre>
          )}
        </div>
      </div>
      <div className="sidebar right-sidebar">
        <h1>Right Sidebar</h1>
      </div>
    </div>
  );
};

export default SQLEditor;
