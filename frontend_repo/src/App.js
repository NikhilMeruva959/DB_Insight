import React, { useEffect, useState } from "react";
import Navbar from "./components/Navbar";
import StatusBar from "./components/StatusBar";

import { useSelector } from "react-redux";
import { returnState } from "./state/db_name/DBSlice";

function App() {
  const [dbNames, setDbNames] = useState([]);
  const [schemaNames, setSchemaNames] = useState([]);
  const [schemaCount, setSchemaCount] = useState(0);

  useEffect(() => {
    // Fetch the database name from the backend
    fetch("http://localhost:3002/get-db-names")
      .then((response) => response.json())
      .then((data) => {
        console.log("HERE 1");
        console.log("Fetched db names", data); // Log the schema count
        setDbNames(data);
      })
      .catch((error) => console.error("There was an error!", error));

    fetch("http://localhost:3002/get-schema-number")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched schema count:", data); // Log the schema count
        setSchemaCount(data.schemaRowCount); // Ensure this matches the property name in your response
      })
      .catch((error) => console.error("There was an error!", error));

    fetch("http://localhost:3002/get-schema-names")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched schema names:", data); // Log the schema count
        setSchemaNames(data.schemaNameArray); // Ensure this matches the property name in your response
      })
      .catch((error) => console.error("There was an error!", error));
  }, []);

  // const stateVar = useSelector(returnState);

  return (
    <>
      {/* <LoginPage /> */}
      <Navbar />
      <StatusBar />
      <div>
        <p>DB Names: {}</p>
        <p>Schema Count: {schemaCount}</p>
        <p>Schema Names: </p>
        {schemaNames.map((schema, index) => (
          <li key={index}>{schema.schema_name}</li>
        ))}
      </div>
    </>
  );
}

export default App;
