import { React, useContext, useEffect } from "react";
import { authDataContext } from "./Context";
import { Redirect } from "react-router-dom";
import Axios from "axios";

const Logout = () => {
  const { isLoggedIn, setIsLoggedIn } = useContext(authDataContext);

  useEffect(() => {
    Axios.get("/api/users/logout")
      .then((response) => {
        setIsLoggedIn(false);
      })
      .catch((err) => {});
  }, []);

  return <div>{isLoggedIn && <Redirect to="/home" />}</div>;
};

export default Logout;
