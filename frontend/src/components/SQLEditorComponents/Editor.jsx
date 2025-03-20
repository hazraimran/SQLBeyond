import { useState, memo } from "react";
import PropTypes from "prop-types";
import CodeMirror from "@uiw/react-codemirror";
import { sql } from "@codemirror/lang-sql";
import "../../styles/Editor.css";

const Editor = ({
  progress, // Current progress/points
  setQuery,
  query,
  executeQuery,
  submitQuery,
  buttonsDisabled,
  gameData, // Add gameData as a prop
}) => {
  const [content, setContent] = useState(query);

  // Define max XP based on difficulty level
  const getMaxXP = () => {
    switch (gameData.currentDifficulty) {
      case "easy":
        return 100;
      case "medium":
        return 220;
      case "hard":
        return 380;
      default:
        return 100; // Default fallback
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div>
          Current XP: {progress}/{getMaxXP()}
        </div>
        <div className="buttons">
          <div className="tooltip-container-editor">
            <button
              className="clear button"
              onClick={() => {
                console.log("clear click");
                setQuery("");
                setContent("");
              }}
              disabled={buttonsDisabled}
            >
              Clear
            </button>
            <span className="tooltip">Clear the editor!</span>
          </div>

          <div className="tooltip-container-editor">
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
            <span className="tooltip">Run the query (test)!</span>
          </div>

          {/* little bug here, when user clicks submit it doesn't sometimes */}
          <div className="tooltip-container-editor">
            <button
              className="submit button"
              onClick={() => {
                console.log("sub clicked");
                setQuery(content);
                submitQuery(content); // Submit query for full comparison
              }}
              disabled={buttonsDisabled}
            >
              Submit
            </button>
            <span className="tooltip">Submit to evaluate your query!</span>
          </div>
        </div>
      </div>
      <div className="editor">
        <CodeMirror
          value={content}
          extensions={[sql()]}
          onChange={(value) => {
            setContent(value);
            setQuery(value); // Update the parent query state in real-time
          }}
          style={{ height: "100%" }}
          height="100%"
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
