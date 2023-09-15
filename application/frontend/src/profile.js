import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <section className="page-container profile-page-container">
      <h3 className="page-heading">Profiles</h3>
      <article className="profiles-page-content-container container">
        <Link to="/UploadResume">Student</Link>
        <Link to="/PostJobs">Company</Link>
      </article>
    </section>
  );
};

export default Profile;
