import React, {useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getState } from "../utils/state";

const Header = () => {
  const currentUser = JSON.parse(getState("currentUser"));
  const navbarRef = useRef();
  const navigate = useNavigate();

  const toggleNavBar = () => {
    navbarRef.current.classList.toggle("d-none");
  }

  return (
    <header className="bg-white shadow w-100 p-3 d-flex flex-column gap-1 flex-md-row justify-content-between align-items-center">
      <div className="d-flex justify-content-between align-items-center w-100">
        <Link to={"/home"} className="text-decoration-none fw-bold text-secondary fs-5 ms-3">MERN Google Auth</Link>
        <div className="d-flex align-items-center gap-3">
          <div className="d-flex flex-column d-md-none" onClick={toggleNavBar}>
            <div className="bg-secondary rounded mt-1" style={{height: "4px", width: "25px"}}></div>
            <div className="bg-secondary rounded mt-1" style={{height: "4px", width: "25px"}}></div>
            <div className="bg-secondary rounded mt-1" style={{height: "4px", width: "25px"}}></div>
          </div>
          {
            currentUser && (
              <div className="rounded-circle border border-1 d-md-none"
                style={{
                  backgroundImage: `url('${currentUser.avatar}')`,
                  backgroundPosition: "center", 
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "cover",
                  height: "40px",
                  width: "40px"
                }}
               onClick={() => navigate("/account")}
              ></div>
            )
          }
        </div>
      </div>
      <nav ref={navbarRef} className="d-none d-md-block d-flex flex-column flex-md-row gap-1 align-items-center text-nowrap" style={{width: "250px"}}>
        <Link to={"/home"} className="text-decoration-none fg-gray fw-bold link px-2 py-1 rounded w-100 text-center">Home</Link>
        <Link to={"/sign-in"} className="text-decoration-none fg-gray fw-bold link px-2 py-1 rounded w-100 text-center">Sign In</Link>
        <Link to={"/sign-up"} className="text-decoration-none fg-gray fw-bold link px-2 py-1 rounded w-100 text-center">Sign Up</Link>        
      </nav>
      {
        currentUser && (
          <div className="rounded-circle border border-1 d-none d-md-block"
            style={{
              backgroundImage: `url('${currentUser.avatar}')`,
              backgroundPosition: "center", 
              backgroundRepeat: "no-repeat",
              backgroundSize: "cover",
              height: "40px",
              width: "40px",
              minWidth: "40px"
            }}
            onClick={() => navigate("/account")}
          ></div>
        )
        }
    </header>
  );
}

export default Header;