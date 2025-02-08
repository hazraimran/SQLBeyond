import { useState, memo } from "react";
import PropTypes from "prop-types";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import "../../styles/Editor.css";

const Editor = ({
  setQuery,
  query,
  executeQuery,
  submitQuery,
  buttonsDisabled,
}) => {
  const [content, setContent] = useState(query);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="buttons">
          <button
            className="clear button"
            onClick={() => {
              setQuery("");
              setContent("");
            }}
            disabled={buttonsDisabled}
          >
            Clear
          </button>
          <button
            className="run button"
            onClick={() => {
              setQuery(content);
              executeQuery(content, true); // Pass true to fetch only 10 rows
            }}
            disabled={buttonsDisabled}
          >
            Run
          </button>
          <button
            className="submit button"
            onClick={() => {
              setQuery(content);
              submitQuery(content); // Submit query for full comparison
            }}
            disabled={buttonsDisabled}
          >
            Submit
          </button>
        </div>
      </div>
      <div className="editor" >
        <CodeMirror
          value={content}
          extensions={[sql()]}
          onChange={(value) => {
            setContent(value);
            setQuery(value); // Update the parent query state in real-time
          }}
        />
      </div>
    </div>
  );
};

Editor.propTypes = {
  setQuery: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  executeQuery: PropTypes.func.isRequired,
  submitQuery: PropTypes.func.isRequired, // Submit button function
  buttonsDisabled: PropTypes.bool.isRequired,
};

export default memo(Editor);
