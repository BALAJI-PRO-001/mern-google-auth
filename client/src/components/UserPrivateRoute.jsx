import { Navigate, Outlet } from "react-router-dom";
import { getState } from "../utils/state";

const UserPrivateRoute = () => {
  const currentUser = JSON.parse(getState("currentUser"));
  return (
    currentUser ? <Outlet /> : <Navigate to="/sign-in"/>
  );
}

export default UserPrivateRoute;