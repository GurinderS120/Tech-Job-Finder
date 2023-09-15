import React, { useState, useEffect } from "react";
import InputMssg from "./inputMssg";
import Axios from "axios";

const FileUpload = ({ fileInfo, multipleFiles, fileTypes, user }) => {
  // To store and update selected file
  const [file, setFile] = useState();

  // To help display messages to users
  const [infoMessage, setInfoMessage] = useState("");
  const [showMssgFor, setShowMssgFor] = useState("");
  const [isValid, setIsValid] = useState(false);

  // To handle file selection
  const handleFileSelection = (event) => {
    setFile(event.target.files[0]);
  };

  // To handle file upload
  const handleFileUpload = (event) => {
    // This will prevent the unncessary
    // reload of the page
    event.preventDefault();

    if (!file) {
      setShowMssgFor("file");
      setIsValid(false);
      setInfoMessage("You need to upload a file");
      return;
    }

    if (file.name.length > 34) {
      setShowMssgFor("file");
      setIsValid(false);
      setInfoMessage("Filename must not exceed 30 characters");
      return;
    }

    let formData = new FormData();

    formData.append("file", file, file.name);
    formData.append("user", user);
    formData.append("fileInfo", fileInfo);
    formData.append("fileType", fileTypes);

    Axios.post("/api/users/fileUpload", formData)
      .then((response) => {
        if (response.data.isSuccess) {
          setShowMssgFor("succ/fail");
          setIsValid(true);
          setInfoMessage(`${fileInfo} was added successfully`);
        } else {
          setShowMssgFor("succ/fail");
          setIsValid(false);
          setInfoMessage("Something went wrong, please try again later");
        }
      })
      .catch((err) => {
        // console.log(err);
        setShowMssgFor("succ/fail");
        setIsValid(false);
        setInfoMessage("Something went wrong, please try again later");
      });
  };

  // To ensure that when user selects a file we provide them with a preview
  useEffect(() => {
    const previewFile = () => {
      // Display selected file
      if (file) {
        // console.log(`Selected file's name: ${file.name}\n
        //          Selected file's type: ${file.type}\n
        //          Selected file's size: ${file.size}\n
        //          Selected file was last modified at: ${new Date(
        //            file.lastModified
        //          )}\n
        //          Selected file was uploaded at: ${new Date()}`);
        if (file.name.length > 34) {
          setShowMssgFor("file");
          setIsValid(false);
          setInfoMessage("Filename must not exceed 30 characters");
          const preview = document.getElementById("preview-file");
          preview.data = "";
        } else {
          setShowMssgFor("");
          setIsValid(true);
          setInfoMessage("");
          const source = URL.createObjectURL(file);
          const preview = document.getElementById("preview-file");
          preview.data = source;
        }
      }
    };
    previewFile();
  }, [file]);

  // Return the component to be rendered
  return (
    <section className="page-container">
      <h3 className="page-heading">Please upload your {fileInfo}</h3>
      <form className="file-upload-form" onSubmit={handleFileUpload}>
        <article className="file-upload-area file-info input-form-fields">
          <input
            type="file"
            name="selected-file"
            className="file-upload-selection"
            onChange={handleFileSelection}
            accept={fileTypes}
            multiple={multipleFiles}
          />
          <button className="file-upload-button button" type="submit">
            Upload
          </button>
          {showMssgFor === "file" && (
            <InputMssg isValid={isValid} message={infoMessage} />
          )}
          {showMssgFor === "succ/fail" && (
            <InputMssg isValid={isValid} message={infoMessage} />
          )}
        </article>
      </form>
      <article className="file-preview-area">
        {/* To enable preview of the file */}
        <object
          id="preview-file"
          type="application/pdf"
          aria-label="PDF-preview-window"
        ></object>
      </article>
    </section>
  );
};

export default FileUpload;
