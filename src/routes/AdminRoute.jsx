import { Navigate } from "react-router-dom";
import { ACCESS_TOKEN } from "../api/constants";
import { parseJwt } from "../utils/jwt";

function AdminRoute({ children }) {
  const token =
    localStorage.getItem(ACCESS_TOKEN) || sessionStorage.getItem(ACCESS_TOKEN);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const payload = parseJwt(token);
  const isAdmin = payload?.is_staff || payload?.is_superuser;

  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default AdminRoute;