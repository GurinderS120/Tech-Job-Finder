import "./about.css";
import { Link, Switch, Route, Router } from "react-router-dom";
import React, { useEffect, useState } from "react";
import Cat from "./cat";
import Gurinder from "./gurinder";
import Zubin from "./zubin";
import Brandon from "./brandon";
import Sebastian from "./sebastian";
import Anudeep from "./anudeep.js";
import TestSearchPage from "./testSearchPage";
import TestResultPage from "./testResultPage";
import HomePage from "./homePage";
import SearchResultPage from "./searchResultPage";
import {
  searchDataContext,
  authDataContext,
  jobDetailContext,
  userInfoContext,
} from "./Context";
import Register from "./register";
import Login from "./login";
import Logout from "./logout";
import PostJobs from "./postJobs";
import Profile from "./profile";
import FileUpload from "./uploadFile";
import AdvanceSearch from "./advanceSearch";
import CanProfile from "./canProfile.js";

import CompanyInfo from "./company_info_dashboard";
import AdminDashBoard from "./admin_dashboard";

import Axios from "axios";
import JobListing from "./jobListing";

function App() {
  // Define the global state(data) that will be shared
  // among components.
  const [searchData, setSearchData] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCandidate, setIsCandidate] = useState(true);
  const [jobDetails, setJobDetails] = useState(null);

  // Fetch initial info from the backend like if a user is logged in
  // or not, and this function(react hook) will get triggered whenever
  // a user refresh their page
  useEffect(() => {
    Axios.get("/api/users/authStatus")
      .then((response) => {
        if (response.data.isLoggedIn) {
          setIsLoggedIn(true);

          if (response.data.isRecruiter) {
            // console.log("logged in as recruiter");
            setIsCandidate(false);
          } else {
            setIsCandidate(true);
          }
        } else {
          setIsLoggedIn(false);
        }
      })
      .catch((err) => {
        setIsLoggedIn(false);
      });
  }, []);

  return (
    // Change: Removed the unnecessary body tag
    <>
      <header>
        <nav>
          <div className="nav-links">
            <div className="nav-links-container">
              <p className="website-logo">Tech Connect</p>
              <ul className="nav_links">
                <li>
                  <Link to="/home">Home</Link>
                </li>
                <li>
                  <p>Search</p>
                  <ul>
                    <li>
                      {/* Change: Removed the anchor tags to remove the warnings 
                 Also changed 'class' to its jsx equivalent 'className' in 
                 our individual files like: gurinder.js, ...*/}
                      <Link to="/testSearchPage">Basic</Link>
                      <Link to="/advanceSearchPage">Advance</Link>
                    </li>
                  </ul>
                </li>
                {isLoggedIn ? (
                  <li>
                    <Link to="/logout">Logout</Link>
                  </li>
                ) : (
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                )}

                <li>
                  {isLoggedIn && (
                    <>
                      <Link to="/Profile">Profile</Link>
                    </>
                  )}
                </li>

                <li>
                  <p>About Us</p>
                  <ul>
                    <li>
                      {/* Change: Removed the anchor tags to remove the warnings 
                 Also changed 'class' to its jsx equivalent 'className' in 
                 our individual files like: gurinder.js, ...*/}
                      <Link to="/zubin">Zubin Kanga</Link>
                      <Link to="/brandon">Brandon Butler</Link>
                      <Link to="/anudeep">Anudeep Katukojwala</Link>
                      <Link to="/sebastian">Sebastian Wcislo</Link>
                      <Link to="/cat">Cat Tuong Vu</Link>
                      <Link to="/gurinder">Gurinder Singh</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className="test-mssg-container">
            <p className="test-site-mssg">
              SFSU Software Engineering Project CSC 648-848, Spring 2022. For
              Demonstration Only
            </p>
          </div>
        </nav>
      </header>

      <Switch>
        <authDataContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
          {isLoggedIn && isCandidate && (
            <>
              <Route path="/UploadResume">
                <FileUpload
                  fileInfo="Resume"
                  multipleFiles={false}
                  fileTypes=".pdf"
                  user="candidate"
                />
              </Route>
              <Route path="/Profile">
                <CanProfile />
              </Route>
            </>
          )}

          {isLoggedIn && !isCandidate && (
            <>
              <Route path="/Profile">
                <PostJobs />
              </Route>
            </>
          )}

          {!isLoggedIn && (
            <>
              <Route path="/Register">
                <Register />
              </Route>
              <userInfoContext.Provider value={{ isCandidate, setIsCandidate }}>
                <Route path="/Login">
                  <Login />
                </Route>
              </userInfoContext.Provider>
            </>
          )}

          {isLoggedIn && (
            <Route path="/Logout">
              <Logout />
            </Route>
          )}

          <Route path="/zubin">
            <Zubin />
          </Route>
          <Route path="/brandon">
            <Brandon />
          </Route>
          <Route path="/Anudeep">
            <Anudeep />
          </Route>
          <Route path="/sebastian">
            <Sebastian />
          </Route>
          <Route path="/cat">
            <Cat />
          </Route>
          <Route path="/gurinder">
            <Gurinder />
          </Route>
          <Route path="/home">
            <HomePage />
          </Route>
          <Route path="/SearchResultPage">
            <SearchResultPage />
          </Route>

          <jobDetailContext.Provider value={{ jobDetails, setJobDetails }}>
            <Route path="/advanceSearchPage">
              <AdvanceSearch />
            </Route>
            <Route path="/JobListing">
              <JobListing />
            </Route>
          </jobDetailContext.Provider>

          {/* <Route path="/PostJobs">
          </Route> */}

          <Route path="/CompanyInfo">
            <CompanyInfo />
          </Route>
          <Route path="/AdminDashBoard">
            <AdminDashBoard />
          </Route>

          {/* searchDataContext.Provider  basically wraps around
        the components in which we want to access our global state(data)
        */}
          <searchDataContext.Provider value={{ searchData, setSearchData }}>
            <Route path="/testSearchPage">
              <TestSearchPage />
            </Route>
            <Route path="/testResultPage">
              <TestResultPage />
            </Route>
          </searchDataContext.Provider>
        </authDataContext.Provider>
      </Switch>
    </>
  );
}

export default App;
