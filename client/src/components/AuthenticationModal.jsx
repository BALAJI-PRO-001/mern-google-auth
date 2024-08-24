import {useRef, useState } from "react";
import { getState, updateState } from "../utils/state";
import { useNavigate } from "react-router-dom";

const AuthenticationModal = (props) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [border, setBorder] = useState("border-dark");
  const [message, setMessage] = useState("");
  const currentUser = JSON.parse(getState("currentUser"));
  const closeButtonRef = useRef();
  const navigate = useNavigate();

  const onChangeHandler = (e) => {
    setPassword(e.target.value);
  }

  const deleteUser = async () => {
    try {
      setMessage("Loading ....");
      setLoading(true);
      const res = await fetch(`/api/v1/user/${currentUser._id}`, {
        method: "DELETE", 
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          email: currentUser.email,
          password: password
        }),
        credentials: "include"
      });

      if (res.status === 204) {
        updateState("currentUser", null);
        setBorder("border-success");
        setMessage("Your account has been successfully deleted ....");
        if (closeButtonRef.current) {
          setTimeout(() => {
            closeButtonRef.current.click();
            navigate("/home");
          }, 2500);
        }
        return;
      }

      const data = await res.json();
      setLoading(false);
      setMessage("");

      if (data.statusCode === 404) {
        setBorder("border-danger");
        setMessage("Error: Your account has already been deleted ....");
        return;
      }

      if (data.statusCode === 401) {
        setBorder("border-danger");
        setMessage("Error: Please enter a valid password for this account ....");
        setTimeout(() => {
          reset();
        }, 2500);
        return;
      }

    } catch(err) {
      console.error(err.message);
    }
  }

  const reset = () => {
    setMessage("");
    setBorder("border-dark");
  }

  return (
    <div
      className="modal fade"
      id="authentication-modal"
      tabIndex="-1"
      aria-labelledby="authenticationModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-primary fw-bold" id="authenticationModalLabel">
              Authentication Required
            </h5>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
              disabled={loading}
            ></button>
          </div>
          <div className="modal-body">
            <p className="m-0 fw-bold text-danger">Are you sure you want to permanently delete your account?</p>
            <p className="m-0 fw-bold">Please enter valid your account password:</p>
            <input onChange={onChangeHandler} value={password} type="password" className={`fw-bold mt-2 w-100 rounded border-none border ${border} border-2 p-2 outline-none`}/>
            <p className={`fw-bold ${message && message.includes("Error: ") ? "text-danger" : "text-success"} m-0 mt-2`}>{message.split("Error: ")[1] ? message.split("Error: ")[1] : message}</p>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-success fw-bold"
              data-bs-dismiss="modal"
              disabled={loading}
            >
              Close
            </button>
            <button
              type="button"
              className="d-none"
              data-bs-dismiss="modal"
              ref={closeButtonRef}
            >
              Hidden Close Button
            </button>
            <button type="button" className="btn btn-danger fw-bold" onClick={deleteUser} disabled={loading} >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationModal;
