import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";
import app from '../config/firebaseInit';


const auth = getAuth(app);

const logout = async (navigate) => {
  signOut(auth).then(() => {
    toast.success("Logout Successful");
    navigate("/signin", { replace: true });
  }).catch((error) => {
    console.error(`Logout failed: `, error);
    toast.error("Logout Failed");
  });
};

export default logout;