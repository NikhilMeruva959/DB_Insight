const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    title: "DataBase Insight API",
    description:
      "There are over 5000 databases in an org across the globe. Create an Application for the DBA team to automate some of the routine tasks by providing Self service features like - creating user id, data refresh, create db requests. The application will also store database related details in one centralized app to help DBA Team to catalog all database info in the centralized app and use it for backup audits, user access audit and much more.",
  },
  host: "localhost:3002",
};

const outputFile = "./swagger-output.json";
const routes = ["./index.js"];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);

swaggerAutogen(outputFile, routes, doc).then(() => {
  require("./index.js"); // Your project's root file
});
