import React, { useEffect, useRef, useState } from "react";
import Spinner from "../components/Spinner";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { updateState } from "../utils/state";

const AdminDashboard = () => {
  const [users, setUsers] = useState();
  const [sortedUsers, setSortedUsers] = useState();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const refreshButtonRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsersFromServer = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/admin/users");
        const data = await res.json();
        setLoading(false);
        if (data.success === true) {
          setUsers(data.data.users);
          setSortedUsers(data.data.users);
        }
        if (data.success === false) {
          navigate("/admin");
        }
      } catch(err) {
        setLoading(false);
        console.error(err.message);
      }
    }
    fetchUsersFromServer();                         
  }, []);


  const sortUsers = (searchString) => {
    searchString = searchString.toLowerCase();
    setSortedUsers(users);
    if (searchString.length > 0) {
      setSortedUsers((preSortedUsers) => {
        return preSortedUsers.filter((user) => user.username.toLowerCase().includes(searchString));
      });
    }
  }

  const deleteUser = async (e) => {
    try {
      e.target.innerText = "...";
      const userID = e.target.parentElement.parentElement.children[2].innerText;
      const res = await fetch(`/api/v1/admin/user/${userID}`, {
        method: "DELETE"
      });
      e.target.innerText = "Delete";
      if (res.status === 204) {
        setSortedUsers((preUsers) => {
          return preUsers.filter((user) => user._id !== userID);
        });
        setUsers((preUsers) => {
          return preUsers.filter((user) => user._id !== userID);
        });
      }
    } catch(err) {
      console.error(err.message);
    }
  }

  const refreshTable = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/v1/admin/users");
      const data = await res.json();
      setLoading(false);
      if (data.success === true) {
        setUsers(data.data.users);
        setSortedUsers(data.data.users);
      }
      if (data.success === false) {
        return setMessage("Your access token has expired. Please log out and log in again to continue.");
      }
    } catch(err) {
      setLoading(false);
      console.error(err.message);
    }
  }

  const blockUser = async (e) => {
    try {
      e.target.innerText = "...";
      const userID = e.target.parentElement.parentElement.children[2].innerText;
      const res = await fetch(`/api/v1/admin/user/block/${userID}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          blocked: true
        })
      });
      const data = await res.json();
      const userToUpdateInList = data.data.user;
      setSortedUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user._id === userToUpdateInList._id ? userToUpdateInList : user
        );
      });
      setUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user._id === userToUpdateInList._id ? userToUpdateInList : user
        );
      });
      e.target.innerText = "Block";
    } catch(err) {
      console.error(err.message);
    }
  }


  const unBlockUser = async (e) => {
    try {
      e.target.innerText = "...";
      const userID = e.target.parentElement.parentElement.children[2].innerText;
      const res = await fetch(`/api/v1/admin/user/un-block/${userID}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({
          blocked: false
        })
      });
      const data = await res.json();
      const userToUpdateInList = data.data.user;
      setSortedUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user._id === userToUpdateInList._id ? userToUpdateInList : user
        );
      });
      setUsers((prevUsers) => {
        return prevUsers.map((user) =>
          user._id === userToUpdateInList._id ? userToUpdateInList : user
        );
      });
      e.target.innerText = "Un Block";
    } catch(err) {
      console.log(err.message);
    }
  }



  const logout = async () => {
    try {
      const res = await fetch("/api/v1/admin/logout");
      const data = await res.json();
      if (data.success === true) {
        updateState("admin", false);
        navigate("/home");
      }
    } catch(err) {
      console.log(err.message);
    }
  }

  return (
    <React.Fragment>
      <h4 className="text-center fw-bold text-secondary mt-4">Admin Dashboard</h4>
      <div className="d-flex justify-content-center align-items-baseline gap-2">
        <div className="d-flex justify-content-center mt-3 gap-2 border border-2 align-items-center rounded" style={{width: "400px"}}>
          <input 
            className="outline-none border-none p-2 w-100 ms-1 fw-bold" 
            placeholder="Type username to search ...."
            onFocus={(e) => e.target.parentElement.classList.add("border-primary")}
            onBlur={(e) => e.target.parentElement.classList.remove("border-primary")}
            onChange={(e) => sortUsers(e.target.value)}
          />
          <img src="/images/icons/search-icon.png" alt="icon" className="icon me-3"/>
        </div>
        <button className="p-2 btn btn-success px-4 fw-bold" onClick={refreshTable} ref={refreshButtonRef}>Refresh</button>
        <button className="p-2 btn btn-info px-4 fw-bold" onClick={logout}>Logout</button>
      </div>
      { loading && (
            <div className="mt-4">
              <Spinner 
                labelCss={"text-success"}
                spinnerCss={"text-success"}
                spinnerHeight={"25px"}
                spinnerWidth={"25px"}
              >
                Loading
              </Spinner>
            </div>
          )
        }
      {
        message && <div className="alert alert-danger mt-4 mx-auto fw-bold" role="alert" style={{maxWidth: "600px"}}>
          {message}
        </div>
      }
      {
        users && users.length === 0 && <div className="alert alert-danger mt-4 mx-auto fw-bold" role="alert" style={{width: "400px"}}>
          User records are available in the database.
        </div>
      }
      {
        sortedUsers && sortedUsers.length === 0 && users.length !== 0 && <div className="alert alert-success mt-4 mx-auto fw-bold" role="alert" style={{width: "400px"}}>
          No user records found for the searched name ....
       </div>       
      }
      {
        users && users.length > 0 && sortedUsers && sortedUsers.length > 0 && message === "" && <div className="table-responsive mt-4 px-5 mx-auto" style={{maxHeight: "450px", maxWidth: "1200px"}}>
            <table className="table text-center table-hover text-left align-middle border border-2">
              <thead className="table-secondary position-sticky top-0">
                <tr>
                  <th>S.No</th>
                  <th>Avatar</th>
                  <th>User Id</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers && sortedUsers.length > 0 && sortedUsers.map((user, index) => {
                  return (
                    <tr key={index}>
                      <td className="fw-bold text-secondary">{index + 1}</td>
                      <td>
                        <img src={user.avatar} alt="avatar" className="rounded-circle border border-3" style={{height: "40px", width: "40px"}}/>
                      </td>
                      <td className="fw-bold text-secondary">{user._id}</td>
                      <td className="fw-bold text-secondary">{user.username}</td>
                      <td className="fw-bold text-secondary">{user.email}</td>
                      <td >
                        { !user.isBlocked ? <Button type="button" bgColor="btn-primary" handler={blockUser}>Block</Button> :
                          <Button type="button" bgColor="btn-success" handler={unBlockUser}>Unblock</Button>
                        }
                      </td>
                      <td >
                        <Button type="button" bgColor="btn-danger" handler={deleteUser}>Delete</Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
          </table>
        </div>
      }
    </React.Fragment>
  );
}

export default AdminDashboard;