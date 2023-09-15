import React, { useContext } from "react";
import { searchDataContext } from "./Context";

const TestResultPage = (props) => {
  const { searchData, setSearchData } = useContext(searchDataContext);

  return (
    <section className="search-results-container">
      <h1>Here are the results: </h1>
      <section className="search-results">
        {/* There might be a situation where the searchData[] is
        empty -- meaning server hasn't sent any data yet. So, that's
        why we need to ensure that searchData[] is not empty, before 
        call a map method on it. */}
        {searchData[0] &&
          // Here we are basically going over each data entry in our data
          // array and adding html tags and attributes on that data, so it
          // can be displayed in the browser. Remember map method returns
          // new array and in this case of data entries that can be rendered
          // in our browser.
          searchData[0].map((entry, arrIndex) => {
            return (
              <article key={arrIndex} className="data-entry-card">
                {Object.keys(entry).map((item, propIndex) => {
                  return (
                    <p key={propIndex}>
                      <strong>{item}:</strong> {entry[item]}
                    </p>
                  );
                })}
              </article>
            );
          })}
      </section>
    </section>
  );
};
export default TestResultPage;
