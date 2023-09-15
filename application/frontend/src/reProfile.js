import React, { useContext } from "react";
import { useState } from "react";
import { searchDataContext } from "./Context";
import { Link } from "react-router-dom";

// Axios is a library used to send requests
// to our backend server.
import Axios from "axios";

const reProfile = () => {
    return (
        <section className="testHomePage">
         <div>   
          Hello from recruiter
        </div>
        </section>
      );
    };
  
  export default reProfile;
  