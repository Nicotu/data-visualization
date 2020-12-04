import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import styled from "styled-components/macro";

import { Line, Bar, Pie } from "react-chartjs-2";
import { getDataRange } from "../../app/helper";
import Chart from "../charts/chart";

import {
  fetchUsers,
  selectResults,
  selectUsers,
} from "../userData/userDataSlice";

const ChartDashboard = styled.div`
  display: flex;
  /* align-items: center; */
  flex-wrap: wrap;
`;

const ChartContainer = styled.div`
  position: relative;
  background-color: #f2f5fa;
  flex: 1 1 calc(50% - 20px);
  margin: 10px;
  padding: 25px;
  max-width: calc(50% - 20px);
`;

const ageGroups = ["15-24", "25-35", "36-45", "46-50", "51-59", "59-100"];
const salaryGroups = [
  "0-18000",
  "18000-24000",
  "250000-350000",
  "350000-50000",
  "50000-120000",
  "12000-200000",
];

const exerienceGroups = ["1-2", "2-4", "4-7", "7-10"];

const UserCharts = () => {
  const dispatch = useDispatch();
  const dataStatus = useSelector((state) => state.userData.status);
  const users = useSelector(selectUsers);
  const [dobData, setDobData] = useState();
  const [salaryData, setSalaryData] = useState();
  const [experienceData, setExperienceData] = useState();

  useEffect(() => {
    if (dataStatus === "idle") {
      dispatch(fetchUsers());
    }

    if (dataStatus === "succeeded") {
      getDataRange(users, ageGroups, "date_of_birth", "date").then((data) => {
        setDobData(data);
      });

      getDataRange(users, salaryGroups, "salary", "number").then((data) => {
        setSalaryData(data);
      });

      getDataRange(
        users,
        exerienceGroups,
        "years_of_experience",
        "number"
      ).then((data) => {
        setExperienceData(data);
      });
    }
  }, [dataStatus, dispatch]);

  return (
    <ChartDashboard>
      <ChartContainer>
        <p>Age Bracket</p>
        <Chart type="pie" data={dobData} />
      </ChartContainer>

      <ChartContainer>
        <p>Salary range</p>
        <Chart type="bar" data={salaryData} />
      </ChartContainer>

      <ChartContainer>
        <p>Experience range</p>
        <Chart type="doughnut" data={experienceData} />
      </ChartContainer>
    </ChartDashboard>
  );
};

export default UserCharts;
