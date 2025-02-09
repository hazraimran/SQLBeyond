import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "../../../styles/LeftSidebar.css";
import tables from "../../../data/tables";
import thinkingImage from "../../../assets/Thinking.png";
import helpfulImage from "../../../assets/Helpful.webp";
import happyImage from "../../../assets/Happy.png";
import Typewriter from "typewriter-effect";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThumbtack } from "@fortawesome/free-solid-svg-icons";

const LeftSidebar = ({
  imageState,
  message,
  handleTableContent,
  expectedOutput,
  handleAnimationClick,
}) => {
  const [expandedTable, setExpandedTable] = useState(null);

  const handleToggle = (tableName, index) => {
    setExpandedTable(expandedTable === tableName ? null : tableName);
  };

  const getImageSrc = () => {
    switch (imageState) {
      case "helpful":
        return helpfulImage;
      case "happy":
        return happyImage;
      default:
        return thinkingImage;
    }
  };

  return (
    <div className="left-sidebar">
      <div className="left-sidebar-top">
        <div className="message-container">
          {message && (
            <div className="message">
              <p>
                Current Task: <span>{message}</span>
              </p>
              <h4>Expected Output (Top 5 Rows):</h4>
              {/* <table className="sample-table">
                <thead>
                  <tr>
                    {expectedOutput.length > 0 &&
                      Object.keys(expectedOutput[0]).map((col, index) => (
                        <th key={index}>{col}</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {expectedOutput.length > 0 ? (
                    expectedOutput.map((row, rowIndex) => (
                      <tr key={rowIndex}>
                        {Object.values(row).map((val, colIndex) => (
                          <td key={colIndex}>{val}</td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="100%">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table> */}
              <div className="sample-table-container">
                <table className="sample-table">
                  <thead>
                    <tr>
                      {expectedOutput.length > 0 &&
                        Object.keys(expectedOutput[0]).map((col, index) => (
                          <th key={index}>{col}</th>
                        ))}
                    </tr>
                  </thead>
                  <tbody>
                    {expectedOutput.length > 0 ? (
                      expectedOutput.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {Object.values(row).map((val, colIndex) => (
                            <td key={colIndex}>{val}</td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="100%">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="sidebar-heading">Tables</h2>
      <div className="left-sidebar-bottom">
        <ul>
          {tables.map((table, index) => (
            <li key={index}>
              <div
                onClick={() => handleToggle(table.name, index)}
                className="table-name"
              >
                {expandedTable === table.name ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )}
                <span className="tables-headers">
                  <div>{table.name}</div>
                  {expandedTable === table.name && (
                    <div className="tooltip-container">
                      <FontAwesomeIcon
                        icon={faThumbtack}
                        className="pin-icon"
                        onClick={() => {
                          handleAnimationClick();
                          handleTableContent(table);
                        }}
                      />
                      <span className="tooltip">Pin this table</span>
                    </div>
                  )}
                </span>
              </div>
              {expandedTable === table.name && (
                <div className="table-columns">
                  <ul>
                    {table.columns.map((column, idx) => (
                      <li key={idx} className="column">
                        <strong>{column.name}</strong>: {column.type}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

LeftSidebar.propTypes = {
  imageState: PropTypes.string.isRequired,
  message: PropTypes.string,
  handleTableContent: PropTypes.func.isRequired,
  expectedOutput: PropTypes.array,
  // currentQuestion: PropTypes.shape({
  //   question: PropTypes.string.isRequired,
  //   difficulty: PropTypes.string.isRequired,
  //   expectedOutput: PropTypes.array, // Array of objects representing expected output
  // }).isRequired,
};

export default LeftSidebar;
