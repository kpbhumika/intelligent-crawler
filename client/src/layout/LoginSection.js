import { useContext, useEffect } from "react";
import { AuthContext } from "../auth/provider/AuthProvider";
import axios from "axios";

const LoginSection = () => {
  const { isUserFetched, currentUser, setCurrentUser, setIsUserFetched } =
    useContext(AuthContext);
  const fetchCurrentUser = async () => {
    const response = await axios.get("/current-user");
    if (response.data) {
      setCurrentUser(response.data);
    }
    setIsUserFetched(true);
  };

  useEffect(() => {
    if (!isUserFetched) {
      fetchCurrentUser();
    }
  }, [isUserFetched, fetchCurrentUser]);

  const redirectLogin = () => {
    window.location.href = "/login";
  };
  const redirectHome = () => {
    window.location.href = "/";
  };

  const handleLogin = () => {
    if (currentUser) {
      console.log("Already logged in. No action.");
    } else {
      redirectLogin();
    }
  };

  const logoutUser = async () => {
    try {
      // Make the POST request
      axios
        .post("/logoutuser")
        .then((response) => {
          // Handle success
          console.log("Response:", response.data);
          const { success } = response.data;
          if (success) {
            setCurrentUser(null);
            setIsUserFetched(false);
            redirectHome();
          }
        })
        .catch((error) => {
          // Handle error
          console.error("Error:", error);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {currentUser ? (
        <button className="btn btn-light" onClick={logoutUser}>
          Log Out
        </button>
      ) : (
        <button className="btn btn-light" onClick={handleLogin}>
          Log In
        </button>
      )}
    </>
  );
};

export { LoginSection };
