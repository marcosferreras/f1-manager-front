/*!

=========================================================
* Argon Dashboard React - v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import PublicLayout from "layouts/Public.js";
import TeamsLayout from "layouts/Teams.js";
import { SnackbarProvider } from 'notistack';
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute";
import AuthContext from "services/auth/AuthContext";
import { AxiosInterceptorsSetup } from "services/auth/AuthInterceptor";
import App from './App';

const root = ReactDOM.createRoot(document.getElementById("root"));

/*const permalinks = await fetch("https://api.example.com/permalinks").then((res) => res.json());

function mapPermalinksToRoutes(permalinks) {
  return permalinks.map((permalink) => {
    return (
      <Route
        path={permalink.permalink}
        component={() => {
          window.location.href = permalink.permalink;
          return null;
        }}
      />
    );
  });
}*/

root.render(
  <SnackbarProvider maxSnack={3} preventDuplicate anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }} classes={{ base: 'h1' }}>
    <App />
  </SnackbarProvider>
)


