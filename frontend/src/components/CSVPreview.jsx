import React from "react";
import { useTable } from "react-table";
import OptionsTable from "./OptionsTable";

const CSVPreview = ({
  csvData,
  importType,
  options,
  importOptions,
  handleOptionChange,
}) => {
  const columns = React.useMemo(
    () =>
      Object.keys(csvData[0] || {}).map((key) => ({
        Header: key,
        accessor: key,
        Cell: ({ value }) => {
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value);
          }
          return value;
        },
      })),
    [csvData]
  );

  const data = React.useMemo(() => csvData.slice(0, 2), [csvData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  if (csvData.length === 0) {
    return null;
  }

  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <h4>CSV Preview</h4>
      <table
        {...getTableProps()}
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginBottom: "1em",
        }}
      >
        <thead style={{ backgroundColor: "#f2f2f2" }}>
          {headerGroups.map((headerGroup) => {
            const { key, ...restHeaderGroupProps } =
              headerGroup.getHeaderGroupProps();
            return (
              <tr key={key} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: columnKey, ...restColumnProps } =
                    column.getHeaderProps();
                  return (
                    <th
                      key={columnKey}
                      {...restColumnProps}
                      style={{
                        borderBottom: "1px solid #ddd",
                        padding: "0.5em",
                        textAlign: "left",
                      }}
                    >
                      {column.render("Header")}
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            const { key, ...restRowProps } = row.getRowProps();
            return (
              <tr
                key={key}
                {...restRowProps}
                style={{ borderBottom: "1px solid #ddd" }}
              >
                {row.cells.map((cell) => {
                  const { key: cellKey, ...restCellProps } =
                    cell.getCellProps();
                  return (
                    <td
                      key={cellKey}
                      {...restCellProps}
                      style={{ padding: "0.5em" }}
                    >
                      {cell.render("Cell")}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>

      <OptionsTable
        options={options}
        importOptions={importOptions}
        handleOptionChange={handleOptionChange}
      />
    </div>
  );
};

export default CSVPreview;
