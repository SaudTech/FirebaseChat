import { getAuth, signOut } from "firebase/auth";
import { toast } from "react-toastify";

const auth = getAuth();
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