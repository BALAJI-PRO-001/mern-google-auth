import { getState } from "../utils/state";
import { Outlet, Navigate } from "react-router-dom";

const AdminPrivateRoute = () => {
  const isAdminAuthenticated = getState("admin") === "true" ? true : false ;
  return (
    isAdminAuthenticated ? <Outlet /> : <Navigate to={"/admin"}/>
  );
}

export default AdminPrivateRoute;