import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import FileUpload from "./uploadFile";

// Axios is a library used to send requests
// to our backend server.
import Axios from "axios";

const CanProfile = () => {
  // To store states/data
  // const [latestResume, setLatestResume] = useState(false);
  const [file, setFile] = useState(null);
  const [fileLength, setFileLength] = useState(0);
  // const [isPreview, setIsPreview] = useState(true);
  // const [skills, setSkills] = useState(null);
  // const [source, setSource] = useState(null);

  // Get the most up to date resume uploaded by the candidate
  useEffect(() => {
    let cancel = false;
    const options = {
      responseType: "arraybuffer",
      headers: {
        Accept: "application/pdf",
      },
    };

    Axios.get("/api/users/file", options)
      .then((response) => {
        // setLatestResume(true);
        // console.log(response.data.byteLength);
        setFileLength(response.data.byteLength);
        const file = new Blob([response.data], { type: "application/pdf" });
        if (cancel) return;
        setFile(file);

        // const sourceUrl = URL.createObjectURL(file);
        // const preview = document.getElementById("preview-file");
        // preview.data = sourceUrl;
      })
      .catch((err) => {
        console.log(err);
        setFile(null);
      });

    return () => {
      cancel = true;
    };
  }, []);

  // Get the student skills
  // useEffect(() => {
  //   Axios.get("/api/users/skills")
  //     .then((response) => {
  //       setSkills(response.data);
  //       console.log(response.data);
  //     })
  //     .catch((err) => {});
  // }, []);

  // The following function will allow the user to preview their document
  // const handlePreview = () => {
  //   if (isPreview || !file.size) {
  //     setSource("");
  //   } else {
  //     setSource(URL.createObjectURL(file));
  //   }

  //   setIsPreview(!isPreview);
  // };

  return (
    <section className="page-container">
      {!file ? (
        <h3 className="page-heading">Loading...</h3>
      ) : (
        <>
          <article className="file-info input-form-fields">
            {/* <p>Download: </p>
            <a id="download-resume" href={file.url} download={file.name}>
              {file.url}
            </a> */}
            {file.size ? (
              <>
                <p>
                  Want to update your resume?
                  <Link to="/UploadResume"> Update</Link>
                </p>
              </>
            ) : (
              <p>
                Want to upload your resume?
                <Link to="/UploadResume"> Upload</Link>
              </p>
            )}

            {/* {skills["desSkills"].map((item, index) => (
              <div key={index}>
                <input value={item["name"]} type="checkbox" />
                <span>{item["name"]}</span>
              </div>
            ))} */}
          </article>
          <article className="file-preview-area">
            {/* To enable preview of the file */}
            <object
              id="preview-file"
              type="application/pdf"
              aria-label="PDF-preview-window"
              data={!fileLength ? "" : URL.createObjectURL(file)}
            ></object>
          </article>
        </>
      )}
    </section>
  );
};

export default CanProfile;
