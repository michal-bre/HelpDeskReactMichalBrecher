import { Navigate } from "react-router-dom";
import { useUserContext } from "../Context/UserContext";

const RootRedirect: React.FC = () => {
  const { user } = useUserContext();

  if (!user) return <Navigate to="/login" replace />;

  const role = user.userDetails.role; 
  return <Navigate to={`/${role}/dashboard`} replace />;
};

export default RootRedirect;
