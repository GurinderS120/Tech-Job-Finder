import React, { useState, useEffect, useRef, useContext } from "react";
import Axios from "axios";
import InputMssg from "./inputMssg";
import { Redirect } from "react-router-dom";
// import { jobDetailContext } from "./Context";

// Helper functions
const isValidLen = (input, length) => {
  return input.length > 0 && input.length <= length ? true : false;
};

const isEmail = (email) => {
  const validEmail =
    /^(?=.{1,45}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
  return validEmail.test(email);
};

const isValidTechArea = (techArea) => {
  return techArea.length <= 0 || techArea === "Select Tech Area" ? false : true;
};

const PostJobs = () => {
  // Store user entered information
  // Create states to hold initial data required for our search
  // to work
  const techAreas = useRef(["Select Tech Area"]);

  const [techArea, setTeachArea] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [email, setEmail] = useState("");
  const [jobType, setJobType] = useState("");
  const [desSkill, setDesSkill] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [description, setDescription] = useState("");
  const [isFetchDone, setIsFetchDone] = useState(false);

  const emailR = useRef(null);
  const jobTypeR = useRef(null);
  const jobTitleR = useRef(null);
  const techAreaR = useRef(null);
  const descriptR = useRef(null);
  const roleR = useRef(null);
  const desSkillR = useRef(null);

  const originalList = useRef(null);

  // To help display input validation message
  const [infoMessage, setInfoMessage] = useState("");
  const [showMssgFor, setShowMssgFor] = useState("");
  const [isValid, setIsValid] = useState(false);
  // const [isNewJob, setIsNewJob] = useState(false);
  const [postedJobs, setPostedJobs] = useState(null);
  const newVal = useRef("");
  const [arePosts, setArePosts] = useState(false);
  const [submitChange, setSubmitChange] = useState(false);

  const [checked, setChecked] = useState([]);
  const [isRedir, setIsredir] = useState(false);

  // const { setJobDetails } = useContext(jobDetailContext);

  // Fetch techAreas from the database by making a request to our backend
  useEffect(() => {
    Axios.get("/api/passions")
      .then((response) => {
        const data = response.data[0].allTechAreas
          .slice(5, -1)
          .replace(/[']+/g, "")
          .split(",");

        techAreas.current = techAreas.current.concat(data);
        setIsFetchDone(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    Axios.get("/api/jobs/postedJobs")
      .then((response) => {
        originalList.current = [];
        // console.log(response.data);
        let updatedList = [...checked];
        for (const job of response.data) {
          originalList.current.push(job.id);
          if (job.Active) {
            // console.log(job.id);
            updatedList = [...updatedList, parseInt(job.id)];
          }
        }

        // console.log("Original List in useEffect", originalList.current);

        // console.log(updatedList);
        setChecked(updatedList);
        // console.log(checked);
        setPostedJobs(response.data);
        setArePosts(true);
      })
      .catch((err) => {});
  }, []);

  // Set up errors if user input is not valid, it is used for live inline
  // input validation
  useEffect(() => {
    switch (newVal.current) {
      case "email":
        if (!isEmail(email)) {
          emailR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          emailR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "descript":
        if (!isValidLen(description, 175)) {
          descriptR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          descriptR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "jobTitle":
        if (!isValidLen(jobTitle, 45)) {
          jobTitleR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          jobTitleR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "techArea":
        if (!isValidTechArea(techArea)) {
          techAreaR.current.classList.add("invalid-input");
          // console.log("Invalid tech area");
          // console.log(techArea);
          setIsValid(false);
        } else {
          // console.log("Valid tech area");
          // console.log(techArea);
          techAreaR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "jobType":
        if (!isValidLen(jobType, 45)) {
          jobTypeR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          jobTypeR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "role":
        if (!isValidLen(jobRole, 45)) {
          roleR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          roleR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "desSkill":
        if (!isValidLen(desSkill, 45)) {
          desSkillR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          desSkillR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      default:
        break;
    }
  }, [email, description, jobTitle, jobType, techArea, jobRole, desSkill]);

  const jobStatusChange = (e) => {
    // setSubmitChange(!submitChange);
    // console.log("In Job Status Change");
    // console.log(e.target.value);
    let updatedList = [...checked];
    // console.log(updatedList);
    if (e.target.checked) {
      // console.log("Add");
      updatedList = [...checked, parseInt(e.target.value)];
    } else {
      // console.log("Remove");
      // console.log(`Removing job: ${checked.indexOf(e.target.value)}`);
      updatedList.splice(checked.indexOf(parseInt(e.target.value)), 1);
    }
    setChecked(updatedList);
    setSubmitChange(true);
  };

  const submitJobChange = (e) => {
    // console.log(checked);
    // console.log(originalList.current);
    Axios.get("/api/jobs/changeStatus", {
      params: { originalJobsIds: originalList.current, activeJobsIds: checked },
    })
      .then((response) => {
        // setShowMssgFor("s/f");
        // console.log(response);
        // setInfoMessage("The jobs' statuses were changed successfully");
        // setIsValid(true);
        setIsredir(true);
      })
      .catch((err) => {
        // console.log(err);
        // setShowMssgFor("s/f");
        // setInfoMessage(
        //   "Something went wrong, the jobs' statuses weren't changed"
        // );
        // setIsValid(false);
        setIsredir(true);
      });
  };

  // Handle change in input
  const handleChange = (event) => {
    switch (event.target.name) {
      case "email":
        setEmail(event.target.value);
        setShowMssgFor("email");
        newVal.current = "email";
        setInfoMessage(
          "Email must not exceed 45 chars and must follow proper format"
        );
        break;
      case "descript":
        setDescription(event.target.value);
        setShowMssgFor("descript");
        newVal.current = "descript";
        setInfoMessage(
          "Brief description of a candidate you are looking for, and it should not exceed 175 chars"
        );
        break;
      case "jobTitle":
        setJobTitle(event.target.value);
        setShowMssgFor("jobTitle");
        newVal.current = "jobTitle";
        setInfoMessage("Job title must not exceed 45 chars");
        break;
      case "techArea":
        setTeachArea(event.target.value);
        setShowMssgFor("techArea");
        newVal.current = "techArea";
        setInfoMessage("Please select the tech area");
        break;
      case "jobType":
        setJobType(event.target.value);
        setShowMssgFor("jobType");
        newVal.current = "jobType";
        setInfoMessage("Job type must not exceed 45 chars");
        break;
      case "role":
        setJobRole(event.target.value);
        setShowMssgFor("role");
        newVal.current = "role";
        setInfoMessage("Desired role must not exceed 45 chars");
        break;
      case "desSkill":
        setDesSkill(event.target.value);
        setShowMssgFor("desSkill");
        newVal.current = "desSkill";
        setInfoMessage("Desired skill must not exceed 45 chars");
        break;
      default:
        break;
    }
  };

  const handleErrors = (errors) => {
    for (const error of errors) {
      error.current.classList.add("invalid-input");
    }
  };

  const validate = () => {
    const errors = [];

    if (!isValidTechArea(techArea)) {
      errors.push(techAreaR);
    }

    if (!isValidLen(jobTitle, 45)) {
      errors.push(jobTitleR);
    }

    if (!isValidLen(jobRole, 45)) {
      errors.push(roleR);
    }

    if (!isValidLen(desSkill, 45)) {
      errors.push(desSkillR);
    }

    if (!isValidLen(jobType, 45)) {
      errors.push(jobTypeR);
    }

    if (!isValidLen(description, 175)) {
      errors.push(descriptR);
    }

    if (!isEmail(email)) {
      errors.push(emailR);
    }

    return errors;
  };

  const cleanErrInp = (errors) => {
    for (let i = 0; i < errors.length; i++) {
      switch (errors[i]) {
        case "descriptR":
          errors[i] = descriptR;
          break;
        case "jobTitleR":
          errors[i] = jobTitleR;
          break;
        case "jobTypeR":
          errors[i] = jobTypeR;
          break;
        case "emailR":
          errors[i] = emailR;
          break;
        case "techAreaR":
          errors[i] = techAreaR;
          break;
        case "roleR":
          errors[i] = roleR;
          break;
        case "desSkillR":
          errors[i] = desSkillR;
          break;
        default:
          break;
      }
    }

    // console.log(errors);
    handleErrors(errors);
  };

  // Send data with post request to the backend
  const handlePostSubmission = (event) => {
    event.preventDefault();
    // Ensure that the inputs are valid
    const errors = validate();

    if (errors.length > 0) {
      handleErrors(errors);
      return;
    }

    // This will get populated with user entered data and this object is
    // what will be sent to the backend
    const data = {};

    // We will store user provided data into our 'data' object
    data.techArea = techArea;
    data.descript = description;
    data.jobType = jobType;
    data.jobTitle = jobTitle;
    data.role = jobRole;
    data.desSkill = desSkill;
    data.email = email;
    data.date = new Date().toISOString().slice(0, 19).replace("T", " ");

    // Now that we have our data we can send it to the backend by making
    // an HTTP request to our backend using Axios
    Axios.post("/api/jobs/newJob", data)
      .then(function (response) {
        if (response.data.errors.length > 0) {
          cleanErrInp(response.data);
        } else {
          // console.log(response);
          if (response.data.isSuccess) {
            setShowMssgFor("success/failure");
            setIsValid(true);
            // setIsNewJob(true);
            setInfoMessage("Congratulations, job was successfully added");
          } else {
            setShowMssgFor("success/failure");
            setIsValid(false);
            setInfoMessage("Something went wrong, job was not added");
          }
        }
      })
      .catch(function (error) {
        console.log(error);
        setShowMssgFor("success/failure");
        setIsValid(false);
        setInfoMessage("Something went wrong, job was not added");
      });
  };

  const isChecked = (item) => checked.includes(item);

  return (
    <section className="page-container">
      {isRedir && <Redirect to="/advanceSearchPage" />}
      {!isFetchDone || !arePosts ? (
        <h3 className="page-heading">Loading...</h3>
      ) : (
        <>
          {isRedir && <Redirect to="/advanceSearchPage" />}
          <h3 className="page-heading">Post Job</h3>
          <article className="card input-form-card post-jobs-card">
            <form
              className="form-container input-form-fields post-jobs-input-form-fields"
              onSubmit={handlePostSubmission}
            >
              {/* Select Tech Area */}
              <select
                className="job-tech-area-selection selection"
                value={techArea}
                ref={techAreaR}
                name="techArea"
                onChange={handleChange}
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
              {showMssgFor === "techArea" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {/* Enter Job Title */}
              <input
                type="text"
                name="jobTitle"
                placeholder="Job title"
                className="job-title"
                value={jobTitle}
                ref={jobTitleR}
                onChange={handleChange}
              />
              {showMssgFor === "jobTitle" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {/* Enter Job Type */}
              <input
                type="text"
                name="jobType"
                value={jobType}
                ref={jobTypeR}
                placeholder="Job type"
                className="job-type"
                onChange={handleChange}
              />
              {showMssgFor === "jobType" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {/* Enter role */}
              <input
                type="text"
                name="role"
                value={jobRole}
                ref={roleR}
                placeholder="Role"
                className="role"
                onChange={handleChange}
              />
              {showMssgFor === "role" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {/* Enter desired skill */}
              <input
                type="text"
                name="desSkill"
                value={desSkill}
                ref={desSkillR}
                placeholder="Desired skill"
                className="des-skill"
                onChange={handleChange}
              />
              {showMssgFor === "desSkill" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {/* email */}
              <input
                type="text"
                placeholder="Contact email"
                name="email"
                ref={emailR}
                value={email}
                // As the name imply onChange
                // function helps us to update
                // a state(data), in this case
                // we are updating the freeSearch
                onChange={handleChange}
              />
              {showMssgFor === "email" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {/* Enter Job Description */}
              <textarea
                name="descript"
                placeholder="Description"
                className="job-description"
                value={description}
                ref={descriptR}
                onChange={handleChange}
              />
              {showMssgFor === "descript" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {showMssgFor === "success/failure" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {/* Submit Job Post */}
              <button className="job-post-upload-button button" type="submit">
                Submit
              </button>
            </form>
          </article>
          {/* Display the search results */}
          <section className="search-results-container advanced-search-container">
            <h1>Number of jobs you have posted so far: {postedJobs.length}</h1>
            {submitChange && (
              <button className="button" onClick={submitJobChange}>
                Change Job Status
              </button>
            )}
            {/* {showMssgFor === "s/f" && (
              <div className="message-container">
                <InputMssg isValid={isValid} message={infoMessage} />
              </div>
            )} */}
            <section className="search-results">
              {
                // Here we are basically going over each job entry in our jobs
                // array and adding html tags and attributes on that data, so it
                // can be displayed in the browser. Remember map method returns
                // new array and in this case of job entries that can be rendered
                // in our browser.
                postedJobs &&
                  postedJobs.map((entry, arrIndex) => {
                    return (
                      <article
                        key={arrIndex}
                        // onClick={() => showJobDetails(entry.id)}
                        className="data-entry-card"
                      >
                        <p>
                          <label htmlFor="job-status">
                            <strong>Active: </strong>
                          </label>
                          <input
                            id="job-status"
                            value={Object.values(entry)[1]}
                            type="checkbox"
                            checked={isChecked(Object.values(entry)[1])}
                            onChange={jobStatusChange}
                          />
                        </p>
                        {Object.keys(entry)
                          .filter((key) => key !== "id" && key !== "Active")
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

export default PostJobs;
