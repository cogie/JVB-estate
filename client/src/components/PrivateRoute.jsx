import { useSelector } from "react-redux"
import { Outlet, Navigate} from "react-router-dom";

//make profile private if not authenticate
export default function PrivateRoute() {
    const {currentUser} =  useSelector((state) => state.user);
  return currentUser ? <Outlet/> : <Navigate to = '/sign-in'/>;
}
