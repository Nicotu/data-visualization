import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import "./App.css";
import { UserTable } from "./features/userData/userTable";
import userCharts from "./features/userCharts/userCharts";

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
    <Router>
      <Container>
        <h1>Yobota</h1>

        <Switch>
          <Route exact path="/" component={UserTable} />
          <Route exact path="/charts" component={userCharts} />
        </Switch>
      </Container>
    </Router>
  );
}

export default App;
