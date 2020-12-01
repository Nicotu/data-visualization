import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";
import { setTimeout } from "timers";

import {
  fetchUsers,
  selectResults,
  sortByValue,
  filterByValue,
  goToPage,
  changeLimit,
} from "./userDataSlice";

const Table = styled.table`
  width: 100%;
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

const PaginationBar = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const PageList = styled.ul`
  max-width: 70%;
`;

const PageNum = styled.li`
  padding: 1px;
  margin-right: 5px;
  background-color: ${(props) => (props.selected ? "#232856" : "white")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border: 1px solid black;
  height: 30px;
  width: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-bottom: 10px;

  &:hover {
    background-color: #232856;
    color: white;
  }
`;

const PageLimit = styled.div`
  margin-left: auto;

  span {
    margin-right: 10px;
  }
`;

const SearchTerm = styled.span`
  font-weight: 500;
  display: inline-block;
  margin-left: 5px;
`;

const LimitButton = styled.button`
  background-color: ${(props) => (props.selected ? "#232856" : "white")};
  color: ${(props) => (props.selected ? "white" : "black")};
  border: 1px solid black;
  height: 30px;
  width: 30px;
  margin-left: 10px;
  cursor: pointer;
`;

const SearchBar = styled.div`
  margin-bottom: 20px;

  p {
    margin-bottom: 5px;
  }

  input {
    height: 30px;
    padding: 0 10px;
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
  const currentLimit = useSelector((state) => state.userData.pageLimit);
  const results = useSelector(selectResults);
  const [currentFilter, setCurrentFilter] = useState();

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
      <SearchBar>
        <p>
          Search:
          <SearchTerm>
            {currentFilter?.length > 0 ? currentFilter : ""}
          </SearchTerm>
        </p>
        <input
          type="text"
          name="filterInput"
          onChange={(e) => filterInput(e)}
        />
      </SearchBar>

      <PaginationBar>
        <PageList>{pageItems}</PageList>

        <PageLimit>
          <span>display:</span>
          <LimitButton
            selected={currentLimit === 20}
            onClick={() => dispatch(changeLimit(20))}
          >
            20
          </LimitButton>
          <LimitButton
            selected={currentLimit === 10}
            onClick={() => dispatch(changeLimit(10))}
          >
            10
          </LimitButton>
        </PageLimit>
      </PaginationBar>

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

        <tbody>{resultsRows}</tbody>
      </Table>
    </>
  );
};
