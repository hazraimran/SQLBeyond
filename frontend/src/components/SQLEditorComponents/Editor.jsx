// src/components/SQLEditorComponents/Editor.jsx
import { useState, memo } from "react";
import PropTypes from "prop-types";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import "../../styles/Editor.css";

const Editor = ({ setQuery, query, executeQuery }) => {
  const [content, setContent] = useState(query);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="buttons">
          <button
            className="clear button"
            onClick={() => {
              setQuery("");
              setContent(""); // Clear the editor content as well
            }}
          >
            Clear
          </button>
          <button
            className="run button"
            onClick={() => {
              setQuery(content);
              executeQuery(content);
            }}
          >
            Run
          </button>
        </div>
      </div>
      <div className="editor">
        <CodeMirror
          value={content}
          extensions={[sql()]}
          onChange={(value) => setContent(value)}
        />
      </div>
    </div>
  );
};

Editor.propTypes = {
  setQuery: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  executeQuery: PropTypes.func.isRequired,
};

export default memo(Editor);
