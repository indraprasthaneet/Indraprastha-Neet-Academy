import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setUserData, setInitializing } from "../redux/userSlice"; // adjust path if needed

const serverUrl = import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

/**
 * Custom hook to rehydrate user session from backend
 * - Checks for valid cookie
 * - Updates Redux with user data
 * - Runs on app initialization and handles persistence
 */
const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Check authentication status when component mounts
    const checkAuthStatus = async () => {
      // mark initializing true at the start of the check
      dispatch(setInitializing(true));
      try {
        const response = await axios.get(`${serverUrl}/api/auth/check`, {
          withCredentials: true
        });
        
        if (response.data.success && response.data.authenticated) {
          dispatch(setUserData(response.data.user));
        } else {
          // no session
          dispatch(setUserData(null));
        }
      } catch (error) {
        console.log("Auth check error:", error);
        dispatch(setUserData(null));
      }
    };

    checkAuthStatus();
  }, [dispatch]);
};

export default useGetCurrentUser;
