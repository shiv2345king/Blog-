import React from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../store/userSlice";
import { userService } from "../../api/services/userService";

function LogoutBtn() {
  const dispatch = useDispatch();

  const logoutHandler = async () => {
    try {
      await userService.logout();
      dispatch(logout());
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition duration-300"
      onClick={logoutHandler}
    >
      Logout
    </button>
  );
}

export default LogoutBtn;