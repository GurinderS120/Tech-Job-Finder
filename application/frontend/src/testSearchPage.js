import React, { useContext } from "react";
import { useState } from "react";
// import { Link } from "react-router-dom";
import { searchDataContext } from "./Context";
import { Redirect } from "react-router-dom";

// Axios is a library used to send requests
// to our backend server.
import Axios from "axios";

const TestSearchPage = () => {
  // UseState hook(special function provided by React) is
  // used to manage state(data), for example - freeSearch is
  // initialized to "", and later according to user input
  // we update it using the setFreeSearch().
  const [freeSearch, setFreeSearch] = useState("");
  const [displayLink, setDisplayLink] = useState(false);
  const [category, setcategory] = useState("all");
  const { searchData, setSearchData } = useContext(searchDataContext);

  const handleSearch = () => {
    // Inside the get request we are inserting
    // query parameters that contains user-entered
    // text, and user-entered category.

    let validRequest = false;

    if (freeSearch.length <= 40) {
      if (freeSearch.match(/^$|^[0-9a-zA-Z ]+$/)) {
        console.log(
          "Search term length is less than or equal to 40 and all characters are alphanumeric"
        );
        validRequest = true;
      } else {
        console.log("Entered search term is not alphanumeric");
        alert("Please ensure that the search term is alphanumeric");
      }
    } else {
      console.log("Search term length is greater than 40 characters");
      alert("Please ensure that the search term's length is <= 40 characters");
    }

    if (validRequest) {
      Axios.get("/api/get", {
        params: { searchTerm: freeSearch, category: category },
      })
        .then((response) => {
          setSearchData([response.data]);
          setDisplayLink(true);
        })
        .catch((err) => {
          console.log(`failed because of ${err}`);
          setDisplayLink(false);
        });
    }
  };

  return (
    <section className="testHomePage">
      <article className="teamInfo">
        <h2>CSC648-02</h2>
        <p>Gurinder Singh</p>
        <p>Anudeep Katukojwala</p>
        <p>Sebastian Wcislo</p>
        <p>Cat Tuong Vu</p>
        <p>Zubin Kanga</p>
        <p>Brandon Butler</p>
      </article>
      <article className="search testHomePageSearch">
        <input
          type="text"
          placeholder="Search"
          name="freeTextEntry"
          value={freeSearch}
          // As the name imply onChange
          // function helps us to update
          // a state(data), in this case
          // we are updating the freeSearch
          onChange={(e) => {
            setFreeSearch(e.target.value);
          }}
        />
        <select
          id="catagories"
          value={category}
          onChange={(e) => {
            setcategory(e.target.value);
          }}
        >
          <option value="all">All</option>
          <option value="city">City</option>
          <option value="tech_area">Tech Area</option>
          <option value="jobType">Job Type</option>
        </select>
        {/* Once the user is done entering the search
        query, they can decide to hit the sumbit button, which
        will trigger the call to the handleSearch() where we
        handle the logic regarding sending request to our server */}
        <button onClick={handleSearch}>Submit</button>
      </article>
      <article className="test-result-message">
        {/* Once the user has hit the sumbit button and the server
        has sent the appropriate data, then we can redirect the user
        the page where we show those search results*/}
        {displayLink && <Redirect to="/TestResultPage" />}
      </article>
    </section>
  );
};

export default TestSearchPage;
