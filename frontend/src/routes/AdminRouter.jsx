
import { Navigate } from "react-router-dom";
const AdminRoute = ({ children }) => {

  if (children = "admin") {
    return <Navigate to="/user/login" replace />;
  }
  return children;
};

export default AdminRoute;
