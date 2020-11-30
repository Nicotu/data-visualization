import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { setTimeout } from "timers";

import {
  fetchUsers,
  selectUsers,
  selectResults,
  sortByValue,
  filterByValue,
  goToPage,
} from "./userDataSlice";

const Table = styled.table`
  width: 90%;
  margin: 0 auto;
`;

const TableRow = styled.tr`
  &:nth-child(odd) {
    background-color: #f4f5ff;
  }
`;

const TableData = styled.td`
  vertical-align: middle;
  padding: 15px 10px;
  text-align: ${(props) => (props.center ? "center" : "left")};
  width: ${(props) => (props.cellWidth ? props.cellWidth : "auto")};
`;

const ColumnHeader = styled.td`
  background-color: #232856;
  color: white;
  padding: 15px 10px;
  text-align: left;
  font-weight: 500;
  text-align: ${(props) => (props.center ? "center" : "left")};
  width: ${(props) => (props.cellWidth ? props.cellWidth : "auto")};
  vertical-align: middle;
  cursor: pointer;

  &:hover {
    background-color: #626688;
  }
`;

const PageNum = styled.span`
  padding: 1px;
  margin-right: 5px;
  background-color: ${(props) => (props.selected ? "blue" : "white")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border: 1px solid black;
  height: 30px;
  width: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:hover {
    background-color: blue;
    color: white;
  }
`;

const getRows = (items) => {
  return items.map((item, index) => (
    <TableRow key={`row-${index}`}>
      <TableData>{item.first_name}</TableData>
      <TableData>{item.last_name}</TableData>
      <TableData>{item.email}</TableData>
      <TableData>{item.date_of_birth}</TableData>
      <TableData cellWidth="150px">{item.industry}</TableData>
      <TableData>{item.salary}</TableData>
      <TableData center>{item.years_of_experience}</TableData>
    </TableRow>
  ));
};

export const UserTable = (props) => {
  const dispatch = useDispatch();
  const dataStatus = useSelector((state) => state.userData.status);
  const pages = useSelector((state) => state.userData.totalPages);
  const currentPage = useSelector((state) => state.userData.currentPage);
  const results = useSelector(selectResults);
  const users = useSelector(selectUsers);
  const [currentFilter, setCurrentFilter] = useState();

  const dataRows = getRows(users);
  const resultsRows = getRows(results);

  const filterInput = (e) => {
    setTimeout(() => {
      const input = e.target.value;
      dispatch(filterByValue(input));
      setCurrentFilter(e.target.value);
    }, 100);
  };

  useEffect(() => {
    if (dataStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [dataStatus, dispatch]);

  const pageItems = [...Array(pages)].map((item, index) => {
    console.log(pages);

    return (
      <PageNum
        selected={index + 1 === currentPage}
        onClick={() => dispatch(goToPage(index + 1))}
      >
        {index + 1}
      </PageNum>
    );
  });

  return (
    <>
      <div>{pageItems}</div>
      <input onChange={(e) => filterInput(e)} />
      <Table>
        <thead>
          <TableRow>
            <ColumnHeader onClick={() => dispatch(sortByValue("first_name"))}>
              First Name
            </ColumnHeader>

            <ColumnHeader onClick={() => dispatch(sortByValue("last_name"))}>
              Last Name
            </ColumnHeader>

            <ColumnHeader>Email</ColumnHeader>

            <ColumnHeader
              onClick={() => dispatch(sortByValue("date_of_birth", "date"))}
            >
              DOB
            </ColumnHeader>

            <ColumnHeader onClick={() => dispatch(sortByValue("industry"))}>
              Industry
            </ColumnHeader>

            <ColumnHeader onClick={() => dispatch(sortByValue("salary"))}>
              Salary
            </ColumnHeader>

            <ColumnHeader
              cellWidth="100px"
              onClick={() => dispatch(sortByValue("first_name"))}
            >
              Years of experience
            </ColumnHeader>
          </TableRow>
        </thead>

        {results?.length > 0 && (
          <>
            <p>Results for: {currentFilter}</p>
            <tbody>{resultsRows}</tbody>
          </>
        )}

        {results?.length <= 0 && !currentFilter?.length && (
          <tbody>{dataRows}</tbody>
        )}
      </Table>
    </>
  );
};
