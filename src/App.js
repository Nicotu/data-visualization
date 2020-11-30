import React from "react";
import "./App.css";
import { Counter } from "./features/counter/Counter";
import { UserTable } from "./features/userData/userTable";

function App() {
  return (
    <div className="App">
      <UserTable />
    </div>
  );
}

export default App;
