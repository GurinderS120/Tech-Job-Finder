import { React, useState, useEffect } from "react";
import rpa from "./img/RoboticProcessAutomation.png";
import aiandmi from "./img/aimi.png";
import fivege from "./img/5g.png";
import augmir from "./img/augmi.png";
import blockc from "./img/blockchai.png";
import cyb from "./img/cyber.png";
import edgec from "./img/edge.png";
import ioth from "./img/iot.png";
import quantc from "./img/quan.png";
import vr from "./img/virtualr.png";


import defImg from "./img/wallpaper.png";

// Axios is a library used to send requests
// to our backend server.
import Axios from "axios";

const images = new Map();

// As we add new images for tech areas we can also populate the following map
// ,and if a techarea doesn't have an image we use the 'defImg' as the default
// image
images.set("AiAndMl", aiandmi);
images.set("FiveG", fivege);
images.set("AugmentedReality", augmir);
images.set("Blockchain", blockc);
images.set("CyberSecurity", cyb);
images.set("EdgeComputing", edgec);
images.set("InternetOfThings", ioth);
images.set("QuantumComputing", quantc);
images.set("VirtualReality", vr);
images.set("RoboticProcessAutomation", rpa);

const HomePage = () => {
  const [techAreas, setTechAreas] = useState(null);

  useEffect(() => {
    Axios.get("/api/passions")
      .then((response) => {
        const data = response.data[0].allTechAreas
          .slice(5, -1)
          .replace(/[']+/g, "")
          .split(",");

        setTechAreas(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <section className="page-container homePage">
      {!techAreas ? (
        <h3 className="page-heading">Loading...</h3>
      ) : (
        <>
          <h3 className="page-heading">
            Welcome, we provide job information about the following tech trends
            of 2022!
          </h3>
          <div className="imgs-container">
            {techAreas.map((techArea, techAreaIdx) => {
              return (
                <article className="card-img" key={techAreaIdx}>
                  <p>{techArea}</p>
                  <img
                    src={images.has(techArea) ? images.get(techArea) : defImg}
                    alt={techArea}
                  />
                </article>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
};

export default HomePage;
