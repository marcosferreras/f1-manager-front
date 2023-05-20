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
import React, { useState } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";

import "assets/plugins/nucleo/css/nucleo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "assets/scss/argon-dashboard-react.scss";

import AdminLayout from "layouts/Admin.js";
import AuthLayout from "layouts/Auth.js";
import PublicLayout from "layouts/Public.js";
import TeamsLayout from "layouts/Teams.js";
import ProtectedRoute from "components/ProtectedRoute/ProtectedRoute";
import AuthContext from "services/auth/AuthContext";
import { ROLES } from "constants";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AxiosInterceptorsSetup } from "services/auth/AuthInterceptor";

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

const App = () => {
  const accessToken = JSON.parse(localStorage.getItem('authData'));
  const [authData, setAuthData] = useState(accessToken);
  const theme = createTheme({
    palette: {
      primary: {
        main: '#b20600',
        dark: '#525f7f',
        contrastText: '#fff',
      }
    },
  });

  return (
    <AuthContext.Provider value={{ authData, setAuthData }}>
      <AxiosInterceptorsSetup />
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <Switch>
            <Route path="/auth" render={(props) => <AuthLayout {...props} />} />
            <ProtectedRoute path="/admin" targetRole={ROLES.ADMIN} render={(props) => <AdminLayout {...props} />} />
            <ProtectedRoute path="/teams" targetRole={ROLES.MANAGER} render={(props) => <TeamsLayout {...props} />} />
            <Route path="/" render={(props) => <PublicLayout {...props} />} />
          </Switch>
        </BrowserRouter>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

export default App;


