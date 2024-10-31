// src/components/QueryResult.jsx
// import React from "react";
import PropTypes from "prop-types";

const QueryResult = ({ results }) => {
  if (!results.length) return <p>No results to display</p>;

  const headers = Object.keys(results[0]);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header) => (
            <th key={header}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {results.map((row, index) => (
          <tr key={index}>
            {headers.map((header) => (
              <td key={header}>{row[header]}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

// Define prop types for validation
QueryResult.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default QueryResult;
