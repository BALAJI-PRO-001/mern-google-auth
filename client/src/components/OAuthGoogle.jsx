import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import app from "../utils/firebase";
import Button from "./Button";
import { useNavigate } from "react-router-dom";
import { stateNewState } from "../utils/state";
import React, { useRef } from "react";

const OAuthGoogle = () => {
  const navigator = useNavigate();
  const modelButtonRef = useRef();

  const handleGoogleAuth = async (e) => {
    e.preventDefault();
    e.target.setAttribute("disabled", "");
    try {
      const provider = new GoogleAuthProvider();
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch("/api/v1/auth/google", {
        headers: { "Content-Type": "application/json"},
        method: "POST",
        body: JSON.stringify({
          username: result.user.displayName,
          email: result.user.email,
          avatar: result.user.photoURL
        }),
        credentials: "include"
      });

      const data = await res.json();

      if (res.status === 403) {
        modelButtonRef.current.click();
      }

      if (data.success === true) {
        stateNewState("currentUser", data.data.user);
        navigator("/");
      }
      e.target.removeAttribute("disabled", "");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <React.Fragment>
      <Button 
        type={"button"} 
        bgColor={"btn-danger"} 
        handler={handleGoogleAuth}
      >
        Continue with google
      </Button>
      <button
        ref={modelButtonRef} 
        type="button" 
        className="btn btn-danger fw-bold w-100 p-2 d-none" 
        data-bs-toggle="modal" 
        data-bs-target="#message-modal"
      ></button>  
      <div
        className="modal fade"
        id="message-modal"
        tabIndex="-1"
        aria-labelledby="messageModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title text-primary fw-bold" id="messageModalLabel">
                Important Message!
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
            <p className="m-0 fw-bold text-danger">Your account has been blocked by the admin. Please try signing in with another account.</p>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-success fw-bold"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default OAuthGoogle;
