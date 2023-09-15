import React from "react";
import "./about.css";

const CompanyInfo = () => {
  return (
    <section className="dashboard"> //Dashboard
          <article className = "dashboard_head">
            <h1 id="center"> Example Dashboard </h1>
            <p id="content">User Analysis here/Main Company Info here</p>
          </article>
          <div class="dashboard_container">
          <article className = "dashboard_item">
          <h2 id="center"> Example Item</h2>
          <p id="content">Top Tech Articles/Additional Company Info</p>
          </article>
          <article className = "dashboard_item">
          <h2 id="center"> Example Item</h2>
          </article>
          <article className = "dashboard_item">
          <h2 id="center"> Example Item</h2>
          </article>
          <article className = "dashboard_item">
          <h2 id="center"> Example Item</h2>
          </article>
          <article className = "dashboard_item">
          <h2 id="center"> Example Item</h2>
          </article>
          <article className = "dashboard_item">
          <h2 id="center"> Example Item</h2>
          </article>
          </div>
    </section>
  );
};

export default CompanyInfo;