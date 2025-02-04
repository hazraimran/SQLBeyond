import "../../styles/DisplayTables.css";
import TableTab from "./TableTab";

const DisplayTables = ({ tableContent, removeTable }) => {
    return (
        <div className="display-table-container">
            <div className="pinned-tables-container">
                {
                    tableContent.length === 0 
                    ?
                    <h1>There's 0 tables pinned!</h1>
                    :
                    tableContent.map(table => {
                        return (
                            <TableTab table={table} removeTable={removeTable}/>
                        );
                    })
                }
            </div>
        </div>
    );
}

export default DisplayTables;