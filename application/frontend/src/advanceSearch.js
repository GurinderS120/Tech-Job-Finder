import React, { useEffect, useRef, useState, useContext } from "react";
import { jobDetailContext } from "./Context";
import { Redirect } from "react-router-dom";
import Axios from "axios";
import "./components.css";

const AdvanceSearch = () => {
  // Create states to hold initial data required for our search
  // to work
  const techAreas = useRef(["Select Tech Area"]);
  const jobTypes = useRef([{ type: "Select Job Type" }]);
  const [jobs, setJobs] = useState(null);

  // Create states for user input
  const [jobTitle, setJobTitle] = useState("");
  const [userJobType, setUserJobType] = useState("Select Job Type");
  const [userTechArea, setUserTechArea] = useState("Select Tech Area");
  const [jobRole, setJobRole] = useState("");
  const [skills, setSkills] = useState("");
  const [company, setCompany] = useState("");
  const [isRedir, setIsRedir] = useState(false);

  const { setJobDetails } = useContext(jobDetailContext);

  // The following function will handle user's request to show more details
  // about a job
  const showJobDetails = (id) => {
    // console.log(`Job id: ${id} was selected`);
    Axios.get("/api/listing/", {
      params: { jobId: id },
    })
      .then((response) => {
        // console.log(response.data["jobInfo"][0]);
        // console.log(response.data["desSkills"]);
        setJobDetails(response.data);
        setIsRedir(true);
      })
      .catch((err) => {});
  };

  // The following functions gets called when the user wants to submit
  // their search query
  const handleSubmission = (e) => {
    // This will prevent the page from reloading
    e.preventDefault();

    // Store the user input in an object that will get passed in the params
    // of the 'get' request made using axios
    const options = {
      jobTitle: jobTitle,
      jobType: userJobType === "Select Job Type" ? "" : userJobType,
      techArea: userTechArea === "Select Tech Area" ? "" : userTechArea,
      jobRole: jobRole,
      skills: skills,
      company: company,
    };

    Axios.get("/api/search/advance", { params: options })
      .then((response) => {
        setJobs(response.data);
        // console.log(response.data);
      })
      .catch((err) => {
        console.log(err);
      });

    // console.log("Search was submitted");
  };

  // Fetch techAreas,jobTypes, and jobs from the database by making a request to our backend
  useEffect(() => {
    // let cancel = false;
    Axios.get("/api/search/content")
      .then((response) => {
        // console.log(response.data["techAreas"][0].allTechAreas);
        const data = response.data["techAreas"][0].allTechAreas
          .slice(5, -1)
          .replace(/[']+/g, "")
          .split(",");

        techAreas.current = techAreas.current.concat(data);
        jobTypes.current = jobTypes.current.concat(response.data["jobTypes"]);
        // if (cancel) return;
        setJobs(response.data["allJobs"]);
      })
      .catch((err) => {
        console.log(err);
      });

    // return () => {
    //   cancel = true;
    // };
  }, []);

  return (
    <section className="page-container">
      {!jobs ? (
        <h3 className="page-heading">Loading...</h3>
      ) : (
        <>
          {isRedir && <Redirect to="/JobListing" />}
          <h3 className="page-heading">Advance Search</h3>
          <form
            className="advance-search-form input-form-fields"
            onSubmit={handleSubmission}
          >
            {/* Job Title */}
            <article className="search-component">
              <label htmlFor="job-title">Title</label>
              <input
                type="text"
                id="job-title"
                placeholder="Desired Job Title.."
                onChange={(e) => {
                  setJobTitle(e.target.value);
                }}
              />
            </article>
            {/* Job Type */}
            <article className="search-component">
              <label htmlFor="job-type">Job Type</label>
              <select
                id="job-type"
                onChange={(e) => {
                  setUserJobType(e.target.value);
                }}
              >
                {jobTypes.current &&
                  jobTypes.current.map((job, jobIndex) => {
                    return (
                      <option key={jobIndex} value={job.type}>
                        {job.type}
                      </option>
                    );
                  })}
              </select>
            </article>
            {/* Tech Area */}
            <article className="search-component">
              <label htmlFor="tech-area">Tech Area</label>
              <select
                id="tech-area"
                onChange={(e) => {
                  setUserTechArea(e.target.value);
                }}
              >
                {techAreas.current &&
                  techAreas.current.map((techArea, techAreaIdx) => {
                    return (
                      <option key={techAreaIdx} value={techArea}>
                        {techArea}
                      </option>
                    );
                  })}
              </select>
            </article>
            {/* Job Role */}
            <article className="search-component">
              <label htmlFor="job-role">Job Role</label>
              <input
                type="text"
                id="job-role"
                placeholder="Desired Job Role.."
                onChange={(e) => {
                  setJobRole(e.target.value);
                }}
              />
            </article>
            {/* Skills */}
            <article className="search-component">
              <label htmlFor="skills">Skills</label>
              <input
                type="text"
                id="skills"
                placeholder="Skills"
                onChange={(e) => {
                  setSkills(e.target.value);
                }}
              />
            </article>
            {/* Company Name */}
            <article className="search-component">
              <label htmlFor="company">Company</label>
              <input
                type="text"
                id="company"
                placeholder="Company Name"
                onChange={(e) => {
                  setCompany(e.target.value);
                }}
              />
            </article>
            {/* Salary Range */}
            {/* Hour Range */}
            {/* Submit Search */}
            <button type="submit">Submit</button>
          </form>

          {/* Display the search results */}
          <section className="search-results-container advanced-search-container">
            <h1>Number of records that matched your query: {jobs.length}</h1>
            <section className="search-results">
              {
                // Here we are basically going over each job entry in our jobs
                // array and adding html tags and attributes on that data, so it
                // can be displayed in the browser. Remember map method returns
                // new array and in this case of job entries that can be rendered
                // in our browser.
                jobs.map((entry, arrIndex) => {
                  return (
                    <article
                      key={arrIndex}
                      onClick={() => showJobDetails(entry.id)}
                      className="data-entry-card"
                    >
                      {Object.keys(entry)
                        .filter((key) => key !== "id")
                        .map((key, propIndex) => {
                          return (
                            <p key={propIndex}>
                              <strong>{key}:</strong> {entry[key]}
                            </p>
                          );
                        })}
                    </article>
                  );
                })
              }
            </section>
          </section>
        </>
      )}
    </section>
  );
};

export default AdvanceSearch;
