import React, { useEffect, useRef, useState } from "react";
// import { searchDataContext } from "./Context";
// import SearchResultPage from "./searchResultPage";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";

// Axios is a library used to send requests
// to our backend server.
import Axios from "axios";
import InputMssg from "./inputMssg";

// Helper functions
const isValidLen = (input, length) => {
  return input.length > 0 && input.length <= length ? true : false;
};

const isEmail = (email) => {
  const validEmail =
    /^(?=.{1,45}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
  return validEmail.test(email);
};

const isValidPassion = (passion) => {
  return passion.length <= 0 || passion === "Select Your Passion"
    ? false
    : true;
};

const isValidPass = (password) => {
  const validPassword = /^(?=.{8,13}$)[0-9a-zA-Z]+$/;
  return validPassword.test(password) ? true : false;
};

const Register = () => {
  // UseState hook(special function provided by React) is
  // used to manage state(data)
  const [candName, setCandName] = useState("");
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [userPassion, setUserPassion] = useState("");
  const [candDescription, setCandDescription] = useState("");
  const [regisSuccess, setRegisSuccess] = useState(false);

  // Create refs to directly manipulate the dom elements, it's used
  // when we need to directly change something in dom like setting
  // a focus on an element
  const cName = useRef(null);
  const emailR = useRef(null);
  const passionR = useRef(null);
  const candNR = useRef(null);
  const cpass = useRef(null);
  const passR = useRef(null);
  const cdescriptR = useRef(null);

  // To help display input validation message
  const [infoMessage, setInfoMessage] = useState("");
  const [showMssgFor, setShowMssgFor] = useState("");
  const [isValid, setIsValid] = useState(false);
  const newVal = useRef("");

  const passions = useRef(["Select Your Passion"]);
  const [arePassions, setArePassions] = useState(false);

  // Get initial data from the backend, like the tech areas/passions
  useEffect(() => {
    let cancel = false;
    Axios.get("/api/passions")
      .then((response) => {
        const data = response.data[0].allTechAreas
          .slice(5, -1)
          .replace(/[']+/g, "")
          .split(",");

        passions.current = passions.current.concat(data);
        if (cancel) return;
        setArePassions(true);
      })
      .catch((err) => {
        console.log(err);
      });

    return () => {
      cancel = true;
    };
  }, []);

  // Set up errors if user input is not valid, it is used for live inline
  // input validation
  useEffect(() => {
    switch (newVal.current) {
      case "cname":
        if (!isValidLen(companyName, 45)) {
          cName.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          cName.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "email":
        if (!isEmail(email)) {
          emailR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          emailR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "pass":
        if (!isValidPass(password)) {
          passR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          passR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "cpass":
        if (!(password === confirmPassword)) {
          cpass.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          cpass.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "candName":
        if (!isValidLen(candName, 45)) {
          candNR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          candNR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "passion":
        if (!isValidPassion(userPassion)) {
          passionR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          passionR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      case "cdescript":
        cdescriptR.current.classList.remove("invalid-input");
        setIsValid(true);
        break;
      default:
        break;
    }
  }, [
    companyName,
    email,
    candName,
    password,
    confirmPassword,
    userPassion,
    candDescription,
  ]);

  // To help us update values in respective input fields
  const handleChange = (event) => {
    switch (event.target.name) {
      case "candidate":
        setIsRecruiter(false);
        setShowMssgFor("");
        setInfoMessage("");
        break;
      case "recruiter":
        setIsRecruiter(true);
        setShowMssgFor("");
        setInfoMessage("");
        break;
      case "comname":
        setCompanyName(event.target.value);
        setShowMssgFor("cname");
        newVal.current = "cname";
        setInfoMessage("Company name must not exceed 45 chars");
        break;
      case "Email":
        setEmail(event.target.value);
        setShowMssgFor("email");
        newVal.current = "email";
        setInfoMessage(
          "Email must not exceed 45 chars and must follow proper format"
        );
        break;
      case "cdescript":
        setCandDescription(event.target.value);
        setShowMssgFor("cdescript");
        newVal.current = "cdescript";
        setInfoMessage("Please tell us what you are looking for");
        break;
      case "candName":
        setCandName(event.target.value);
        setShowMssgFor("candName");
        newVal.current = "candName";
        setInfoMessage("Your name must not exceed 45 chars");
        break;
      case "passion":
        setUserPassion(event.target.value);
        setShowMssgFor("passion");
        newVal.current = "passion";
        setInfoMessage("Please select your passion");
        break;
      case "pass":
        setPassword(event.target.value);
        setShowMssgFor("pass");
        newVal.current = "pass";
        setInfoMessage(
          "Password must be alphanumeric and between 8 and 13 chars long"
        );
        break;
      case "cpass":
        setConfirmPassword(event.target.value);
        setShowMssgFor("cpass");
        newVal.current = "cpass";
        setInfoMessage("Passwords must match");
        break;
      default:
        setInfoMessage("");
        setShowMssgFor("");
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

    if (isRecruiter) {
      if (!isValidLen(companyName, 45)) {
        errors.push(cName);
      }
    } else {
      if (!isValidLen(candName, 45)) {
        errors.push(candNR);
      }
      if (!isValidPassion(userPassion)) {
        errors.push(passionR);
      }
    }

    if (!isValidPass(password)) {
      errors.push(passR);
      errors.push(cpass);
    } else {
      if (!(password === confirmPassword)) {
        errors.push(cpass);
      }
    }

    if (!isEmail(email)) {
      errors.push(emailR);
    }

    return errors;
  };

  const cleanErrInp = (errors) => {
    for (let i = 0; i < errors.length; i++) {
      switch (errors[i]) {
        case "candNR":
          errors[i] = candNR;
          break;
        case "cName":
          errors[i] = cName;
          break;
        case "passionR":
          errors[i] = passionR;
          break;
        case "emailR":
          errors[i] = emailR;
          break;
        case "cpass":
          errors[i] = cpass;
          break;
        case "passR":
          errors[i] = passR;
          break;
        default:
          break;
      }
    }

    // console.log(errors);
    handleErrors(errors);
  };

  // Handle registeration request
  const handleReg = () => {
    // Ensure that the inputs are valid
    const errors = validate();

    if (errors.length > 0) {
      handleErrors(errors);
      return;
    }

    // This will get populated with user entered data and this object is
    // what will be sent to the backend
    const data = {};

    // We will store user provided data into our 'data' object based
    // on who the user wants to register as: a candidate or a recruiter
    if (isRecruiter) {
      data.isRec = true;
      data.companyName = companyName;
      data.candDescription = candDescription;
      data.email = email;
      data.password = password;
      data.confirmPassword = confirmPassword;
    } else {
      data.isRec = false;
      data.candName = candName;
      data.userPassion = userPassion;
      data.email = email;
      data.password = password;
      data.confirmPassword = confirmPassword;
    }

    // Now that we have our data we can send it to the backend by making
    // an HTTP request to our backend using Axios
    Axios.post("/api/users/register", data)
      .then(function (response) {
        if (response.data.length > 0) {
          cleanErrInp(response.data);
        } else {
          // console.log(response);
          setShowMssgFor("emailConfMssg");
          setIsValid(false);
          setInfoMessage(
            "Please confirm your email in order to finish registeration"
          );

          setTimeout(() => {
            setRegisSuccess(true);
          }, 1000);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  return (
    <section className="page-container">
      {!arePassions ? (
        <h3 className="page-heading">Loading...</h3>
      ) : (
        <>
          <h3 className="page-heading">Register</h3>
          <article className="card input-form-card">
            <div className="toggle-candidate-recruiter-container">
              <button
                name="candidate"
                className={`toggle-candidate-${
                  isRecruiter ? "valid" : "invalid"
                }`}
                onClick={handleChange}
              >
                Candidate
              </button>
              <button
                name="recruiter"
                className={`toggle-recruiter-${
                  isRecruiter ? "invalid" : "valid"
                }`}
                onClick={handleChange}
              >
                Company
              </button>
            </div>
            <article className="form-container input-form-fields">
              {isRecruiter ? (
                <>
                  {/* Company name */}
                  <input
                    className="middle_input"
                    type="text"
                    placeholder="Company Name"
                    name="comname"
                    ref={cName}
                    // As the name imply onChange
                    // function helps us to update
                    // a state(data), in this case
                    // we are updating the freeSearch
                    onChange={handleChange}
                    value={companyName}
                  />
                  {showMssgFor === "cname" && (
                    <InputMssg isValid={isValid} message={infoMessage} />
                  )}
                  {/* Email */}
                  <input
                    className="middle_input"
                    type="text"
                    placeholder="Email"
                    name="Email"
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
                  {/* Candidate Description */}
                  <input
                    className="middle_input"
                    type="text"
                    placeholder="Actively Looking For"
                    name="cdescript"
                    ref={cdescriptR}
                    value={candDescription}
                    // As the name imply onChange
                    // function helps us to update
                    // a state(data), in this case
                    // we are updating the freeSearch
                    onChange={handleChange}
                  />
                  {showMssgFor === "cdescript" && (
                    <InputMssg isValid={isValid} message={infoMessage} />
                  )}
                </>
              ) : (
                <>
                  {/* Candidate's Name */}
                  <input
                    className="middle_input"
                    type="text"
                    placeholder="Name"
                    name="candName"
                    ref={candNR}
                    value={candName}
                    // As the name imply onChange
                    // function helps us to update
                    // a state(data), in this case
                    // we are updating the freeSearch
                    onChange={handleChange}
                  />
                  {showMssgFor === "candName" && (
                    <InputMssg isValid={isValid} message={infoMessage} />
                  )}
                  {/* Candidate's passion */}
                  <select name="passion" ref={passionR} onChange={handleChange}>
                    {passions.current &&
                      passions.current.map((passion, passionIdx) => {
                        return (
                          <option key={passionIdx} value={passion}>
                            {passion}
                          </option>
                        );
                      })}
                  </select>
                  {showMssgFor === "passion" && (
                    <InputMssg isValid={isValid} message={infoMessage} />
                  )}
                  {/* email */}
                  <input
                    className="middle_input_p"
                    type="text"
                    placeholder="Email"
                    name="Email"
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
                </>
              )}

              {/* password */}
              <input
                className="middle_input"
                type="password"
                ref={passR}
                value={password}
                placeholder="Password"
                name="pass"
                // value={password}
                // As the name imply onChange
                // function helps us to update
                // a state(data), in this case
                // we are updating the freeSearch
                onChange={handleChange}
              />
              {showMssgFor === "pass" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}

              {/* confirm password */}
              <input
                type="password"
                placeholder="Confirm Password"
                name="cpass"
                ref={cpass}
                value={confirmPassword}
                // As the name imply onChange
                // function helps us to update
                // a state(data), in this case
                // we are updating the freeSearch
                onChange={handleChange}
              />
              {showMssgFor === "cpass" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}
              {showMssgFor === "emailConfMssg" && (
                <InputMssg isValid={isValid} message={infoMessage} />
              )}

              <button onClick={() => handleReg()}>Register</button>

              {/* Login, register message */}
              <article className="login-register-message">
                <p>
                  Already have an account?
                  <Link to="/Login"> Login</Link>
                </p>
              </article>

              {regisSuccess && <Redirect to="/Login" />}
            </article>
          </article>
        </>
      )}
    </section>
  );
};

export default Register;
