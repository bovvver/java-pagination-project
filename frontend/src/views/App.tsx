import { useEffect, useMemo } from "react";
import { Route, Routes } from "react-router-dom";
import Form from "@components/AuthenticationForm";
import WelcomePage from "@views/WelcomePage";
import useAuth from "@hooks/useAuth";
import RedirectIfNotAuthenticated from "../components/RedirectIfNotAuthenticated";
import Toast from "../components/Toast";
import { jwtToken } from "@env/environments";
import { apiClient } from "@api/ApiClient";
import DogTable from "./DogTable";

const App = () => {
  const { handleLogout, authenticate } = useAuth();

  useMemo(() => {
    apiClient.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response && error.response.status == 401) {
          handleLogout();
        } else {
          return Promise.reject(error);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (localStorage.getItem(jwtToken) !== null) {
      authenticate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const publicRoutes = [{ path: "/", component: <Form /> }];

  const protectedRoutes = [
    { path: "/logged", component: <WelcomePage /> },
    { path: "/list", component: <DogTable /> },
  ];

  return (
    <>
      <Toast />
      <Routes>
        {publicRoutes.map((route, idx) => (
          <Route path={route.path} key={idx} element={route.component} />
        ))}
        {protectedRoutes.map((route, idx) => (
          <Route
            path={route.path}
            key={idx}
            element={
              <>
                <RedirectIfNotAuthenticated>
                  {route.component}
                </RedirectIfNotAuthenticated>
              </>
            }
          />
        ))}
      </Routes>
    </>
  );
};

export default App;