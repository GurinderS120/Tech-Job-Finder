import React, { useContext } from "react";
import { useState } from "react";
import { searchDataContext } from "./Context";
import { Link } from "react-router-dom";

// Axios is a library used to send requests
// to our backend server.
import Axios from "axios";

const SearchResultPage = () => {
  // UseState hook(special function provided by React) is
  // used to manage state(data), for example - freeSearch is
  // initialized to "", and later according to user input
  // we update it using the setFreeSearch().
  const [jobTitle, setJobTitle] = useState("");
  const [jobLocation, setJobLocation] = useState("");
  const [jobType, setJobType] = useState("Intern/full time");
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [jobExperience, setJobExperience] = useState("no experience needed");
  const { searchData, setSearchData } = useContext(searchDataContext);

  const handleSearch = () => {
    // Inside the get request we are inserting
    // query parameters that contains user-entered
    // text, and user-entered category.
    Axios.get("/api/get", {
      params: {
        jobTitle: jobTitle,
        jobType: jobType,
        jobLocation: jobLocation,
      },
    })
      .then((response) => {
        setSearchData([response.data]);
      })
      .catch((err) => {
        console.log(`failed because of ${err}`);
      });
  };

  return (
    <section className="page-container">
      <h3 id="search-result-page-heading">Search Result</h3>
      <article className="card">
        <div className="toggle-candidate-recruiter-container">
          <button
            id="toggle-candidate"
            onClick={(e) => {
              setIsRecruiter(false);
            }}
          >
            Find a Job
          </button>
          <button
            id="toggle-recruiter"
            onClick={(e) => {
              setIsRecruiter(true);
            }}
          >
            Find a Candidate
          </button>
        </div>
        <article className="form-container">
          {/* Search */}
          {/* Job Title */}
          <input
            type="text"
            placeholder="Job Title"
            name="jobTitle"
            value={jobTitle}
            // As the name imply onChange
            // function helps us to update
            // a state(data), in this case
            // we are updating the freeSearch
            onChange={(e) => {
              setJobTitle(e.target.value);
            }}
          />
          {/* Job Type */}
          <select
            id="job-type"
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
            }}
          >
            <option value="Intern/full time">Intern/full time</option>
            <option value="Intern/part time">Intern/part time</option>
            <option value="Entry-level">Entry-level</option>
          </select>

          

          {isRecruiter ? (
            <select
              id="job-experience"
              value={jobExperience}
              onChange={(e) => {
                setJobExperience(e.target.value);
              }}
            >
              <option value="no experience needed">0 years</option>
              <option value="at least 1 year">1 year</option>
              <option value="at least 2 years">2 years</option>
              <option value="at least 3 years">3 years</option>
            </select>
          ) : (
            // Job location
            <input
              type="text"
              placeholder="Location"
              name="location"
              value={jobLocation}
              // As the name imply onChange
              // function helps us to update
              // a state(data), in this case
              // we are updating the freeSearch
              onChange={(e) => {
                setJobLocation(e.target.value);
              }}
            />
          )}

          {/* Once the user is done entering the search
        query, they can decide to hit the Search button, which
        will trigger the call to the handleSearch() where we
        handle the logic regarding sending request to our server */}
          <button onClick={() => handleSearch()}>Search</button>
        </article>

        {/* Login, register message */}
        <article className="login-register-message">
          <p>
            No account? <Link to="/Register">Register</Link> to get notify
          </p>
          <p>
            <Link to="/Login"> Login</Link>
          </p>
        </article>
      </article>
    </section>
  );
};

export default SearchResultPage;
