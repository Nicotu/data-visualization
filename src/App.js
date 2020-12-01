import React from "react";
import styled from "styled-components";
import "./App.css";
import { UserTable } from "./features/userData/userTable";

const Container = styled.div`
  width: 90%;
  margin: 0 auto;

  h1 {
    font-weight: 500;
    font-size: 40px;
    margin-top: 20px;
    margin-bottom: 10px;
    display: block;
  }
`;

function App() {
  return (
    <Container>
      <h1>Yobota</h1>
      <UserTable />
    </Container>
  );
}

export default App;
