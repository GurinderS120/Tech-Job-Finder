import { React, useContext } from "react";
import { jobDetailContext } from "./Context";

const JobListing = () => {
  const { jobDetails } = useContext(jobDetailContext);

  return (
    <section className="search-results">
      {
        // Here we are basically going over each job entry in our jobs
        // array and adding html tags and attributes on that data, so it
        // can be displayed in the browser. Remember map method returns
        // new array and in this case of job entries that can be rendered
        // in our browser.
        jobDetails && (
          <article className="data-entry-card">
            {Object.keys(jobDetails["jobInfo"][0]).map((key, propIndex) => {
              return (
                <p key={propIndex}>
                  <strong>{key}:</strong> {jobDetails["jobInfo"][0][key]}
                </p>
              );
            })}
            <p>
              <strong>Desired_Skills:</strong>
              {jobDetails["desSkills"]
                .map((skill, skillIdx) => {
                  return ` ${Object.values(skill)}`;
                })
                .toString()}
            </p>
          </article>
        )
      }
    </section>
  );
};

export default JobListing;
