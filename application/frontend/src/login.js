import React from "react";
import { useState, useRef, useEffect, useContext } from "react";
// import { searchDataContext } from "./Context";
// import SearchResultPage from "./searchResultPage";
// import { Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import { Redirect } from "react-router-dom";
import { authDataContext, userInfoContext } from "./Context";
import InputMssg from "./inputMssg";

// Axios is a library used to send requests
// to our backend server.
import Axios from "axios";

// Helper functions
const isEmail = (email) => {
  const validEmail =
    /^(?=.{1,45}$)[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,3}$/;
  return validEmail.test(email);
};

const isValidPass = (password) => {
  const validPassword = /^(?=.{8,13}$)[0-9a-zA-Z]+$/;
  return validPassword.test(password) ? true : false;
};

const Login = (props) => {
  // UseState hook(special function provided by React) is
  // used to manage state(data)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // To help display input validation message
  const [infoMessage, setInfoMessage] = useState("");
  const [showMssgFor, setShowMssgFor] = useState("");
  const [isRecruiter, setIsRecruiter] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const newVal = useRef("");

  const { setIsLoggedIn } = useContext(authDataContext);
  const { setIsCandidate } = useContext(userInfoContext);

  // Create refs to directly manipulate the dom elements, it's used
  // when we need to directly change something in dom like setting
  // a focus on an element
  const emailR = useRef(null);
  const passR = useRef(null);

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
      case "pass":
        if (!isValidPass(password)) {
          passR.current.classList.add("invalid-input");
          setIsValid(false);
        } else {
          passR.current.classList.remove("invalid-input");
          setIsValid(true);
        }
        break;
      default:
        break;
    }
  }, [email, password]);

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
      case "Email":
        setEmail(event.target.value);
        setShowMssgFor("email");
        newVal.current = "email";
        setInfoMessage(
          "Email must not exceed 45 chars and must follow proper format"
        );
        break;
      case "pass":
        setPassword(event.target.value);
        setShowMssgFor("pass");
        newVal.current = "pass";
        setInfoMessage(
          "Password must be alphanumeric and between 8 and 13 chars long"
        );
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

    if (!isValidPass(password)) {
      errors.push(passR);
    }

    if (!isEmail(email)) {
      errors.push(emailR);
    }

    return errors;
  };

  const cleanErrInp = (errors) => {
    for (let i = 0; i < errors.length; i++) {
      switch (errors[i]) {
        case "emailR":
          errors[i] = emailR;
          break;
        case "passR":
          errors[i] = passR;
          break;
        default:
          break;
      }
    }

    console.log(errors);
    handleErrors(errors);
  };

  // Handle registeration request
  const handleLogin = () => {
    // Ensure that the inputs are valid
    let isUnmount = false;
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
    } else {
      data.isRec = false;
    }

    data.email = email;
    data.password = password;

    // Now that we have our data we can send it to the backend by making
    // an HTTP request to our backend using Axios
    Axios.post("/api/users/login", data)
      .then(function (response) {
        if (response.data.errors.length > 0) {
          cleanErrInp(response.data.errors);
        } else {
          // console.log(response);
          if (response.data.user.length === 0) {
            if (response.data.serverErr) {
              if (!isUnmount) {
                setInfoMessage(
                  "Something went wrong on the server, please try again later"
                );
              }
            } else {
              if (!isUnmount) {
                setInfoMessage(
                  "Invalid email/password, or email isn't verified"
                );
              }
            }

            if (!isUnmount) {
              setShowMssgFor("success/fail");
              setIsValid(false);
            }
          } else {
            if (!isUnmount) {
              setShowMssgFor("success/fail");
              setInfoMessage("Login was successfull");
              setLoginSuccess(true);
              setIsLoggedIn(true);
              setIsCandidate(!isRecruiter);
            }
            // timer = setTimeout(() => {

            // }, 2000);
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });

    return () => {
      isUnmount = true;
    };
  };

  return (
    <section className="page-container">
      {loginSuccess && <Redirect to="/Profile" />}
      <h3 className="page-heading">Login</h3>
      <article className="card input-form-card">
        <div className="toggle-candidate-recruiter-container">
          <button
            name="candidate"
            className={`toggle-candidate-${isRecruiter ? "valid" : "invalid"}`}
            onClick={handleChange}
          >
            Candidate
          </button>
          <button
            name="recruiter"
            className={`toggle-recruiter-${isRecruiter ? "invalid" : "valid"}`}
            onClick={handleChange}
          >
            Company
          </button>
        </div>
        <article className="form-container input-form-fields">
          {/* email */}
          <input
            className="middle_input"
            type="text"
            placeholder="Email"
            name="Email"
            value={email}
            ref={emailR}
            // As the name imply onChange
            // function helps us to update
            // a state(data), in this case
            // we are updating the freeSearch
            onChange={handleChange}
          />
          {showMssgFor === "email" && (
            <InputMssg isValid={isValid} message={infoMessage} />
          )}
          {/* password */}
          <input
            type="password"
            value={password}
            placeholder="Password"
            name="pass"
            ref={passR}
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
          {showMssgFor === "success/fail" && (
            <InputMssg isValid={isValid} message={infoMessage} />
          )}
          <button onClick={handleLogin}>Login</button>

          {/* Login, register message */}
          <article className="login-register-message">
            <p>
              No account? <Link to="/Register">Register</Link> to get notify
            </p>
          </article>
        </article>
      </article>
    </section>
  );
};

export default Login;
