import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";

import { fetchUsers, selectUsers, sortByValue } from "./userDataSlice";

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

export const UserTable = (props) => {
  const dispatch = useDispatch();
  const dataStatus = useSelector((state) => state.userData.status);
  const users = useSelector(selectUsers);

  useEffect(() => {
    console.log(dataStatus);

    if (dataStatus === "idle") {
      dispatch(fetchUsers());
    }
  }, [dataStatus, dispatch]);

  const rows = users.map((item, index) => (
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

  return (
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
      <tbody>{rows}</tbody>
    </Table>
  );
};