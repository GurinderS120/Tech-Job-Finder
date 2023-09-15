import React from "react";

const InputMssg = ({ isValid, message }) => {
  return (
    <article
      className={`display-input-messages-${
        isValid ? "valid" : "invalid"
      } messages`}
    >
      <p>{message}</p>
    </article>
  );
};

export default InputMssg;
