import { useRef, useState } from "react";
import PropTypes from "prop-types";
// import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "../../styles/LeftSidebar.css";
import tables from "../../data/tables";
import thinkingImage from "../../assets/Thinking.png";
import helpfulImage from "../../assets/Helpful.webp";
import happyImage from "../../assets/Happy.png";
import Typewriter from "typewriter-effect";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';


const LeftSidebar = ({ imageState, message, handleTableContent }) => {
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
      <h2 className="sidebar-heading">Tables</h2>

      <div className="left-sidebar-top">
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
                  {expandedTable === table.name && 
                      <FontAwesomeIcon icon={faThumbtack} className="pin-icon" onClick={() => handleTableContent(table)}/>
                  }
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

      <div className="left-sidebar-bottom">
        <div className="message-container">
          {message && (
            <div className="message">
              <Typewriter
                options={{
                  strings: [message],
                  autoStart: true,
                  loop: true, // Set to false to prevent looping
                  delay: 50,
                  pauseFor: 60000, // Pauses for 60 seconds after typing the message
                }}
              />
            </div>
          )}
        </div>
        <div className="image-container">
          <img src={getImageSrc()} alt={imageState} className="sidebar-image" />
        </div>
      </div>
    </div>
  );
};

LeftSidebar.propTypes = {
  imageState: PropTypes.string.isRequired,
  message: PropTypes.string,
};

export default LeftSidebar;
