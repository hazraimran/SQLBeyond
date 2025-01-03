import { useRef, useState } from "react";
import PropTypes from "prop-types";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import "../../styles/LeftSidebar.css";
import tables from "../../data/tables";
import thinkingImage from "../../assets/Thinking.png";
import helpfulImage from "../../assets/Helpful.webp";
import happyImage from "../../assets/Happy.png";
import Typewriter from "typewriter-effect";

const LeftSidebar = ({ imageState, message }) => {
  const [expandedTable, setExpandedTable] = useState(null);
  const refs = useRef([]);

  const scroll = (index) => {
    if(index === 10) 
      return refs.current[index].scrollIntoView({ behavior: "smooth", block: "end"});

    refs.current[index+1].scrollIntoView({ behavior: "smooth", block: "center"}); 
  }

  const handleToggle = (tableName, index) => {
    let displayTable = document.querySelector('.left-sidebar-top ul');

    if(expandedTable===tableName){
      displayTable.classList.remove("open-table");
    }
    else{
      displayTable.classList.add("open-table");
    }

    setExpandedTable(expandedTable === tableName ? null : tableName);

    scroll(index);
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
            <li key={index} ref={(el) => refs.current[index] = el}>
              <div
                onClick={() => handleToggle(table.name, index)}
                className="table-name"
              >
                {/* {expandedTable === table.name ? (
                  <FaChevronDown />
                ) : (
                  <FaChevronRight />
                )} */}
                {table.name}
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
