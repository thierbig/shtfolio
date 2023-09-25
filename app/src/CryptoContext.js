import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("USD");
  const [symbol, setSymbol] = useState("$");
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    type: "success",
  });
  const [user, setUser] = useState(null);
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [watchlist, setWatchlist] = useState([]);

  const handleLogOut = () => {
    // Remove the token from local storage or cookies
    localStorage.removeItem("token"); // or cookies, depending on where you store it

    // Set user state back to null or initial state
    setUser(null);

    setAlert({
      open: true,
      type: "success",
      message: "Logout Successful!",
    });
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post("/api/v1/auth/login", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token); // Storing token in local storage
      setUser(response.data.user); // Assuming the user data is also returned
      setAlert({
        open: true,
        type: "success",
        message: "Login Successful!",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.error
          : "An error occurred",
        type: "error",
      });
    }
  };

  const handleRegister = async (email, password) => {
    try {
      const response = await axios.post("/api/v1/auth/register", {
        email,
        password,
      });
      const token = response.data.token;
      localStorage.setItem("token", token); // Storing token in local storage
      setUser(response.data.user); // Assuming the user data is also returned
      setAlert({
        open: true,
        type: "success",
        message: "Registration Successful!",
      });
    } catch (error) {
      setAlert({
        open: true,
        message: error.response
          ? error.response.data.error
          : "An error occurred",
        type: "error",
      });
    }
  };

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const response = await axios.get("/api/v1/auth/check-auth", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data.user);
    } catch (error) {
      // Handle error
    }
  };

  useEffect(() => {
    if (user) {
      axios
        .get(`/api/v1/watchlist/${user?.uid}`)
        .then((response) => {
          try{
            if (response.data.coins) {
              setWatchlist(response.data.coins);
            } else {
              console.log("No Items in Watchlist");
            }
          }catch(err){}
        })
        .catch((error) => {
          console.error("Error fetching watchlist:", error);
        });
    }
  }, [user]);

  //useEffect(() => {
  //checkAuth()
  //}, []);
  const fetchCoins = async () => {
    setLoading(true);
    const { data } = await axios.get(`/api/v1/coins?currency=${currency}`);
    setCoins(data);
    setLoading(false);
  };

  useEffect(() => {
    if (currency === "CAD") setSymbol("$");
    else if (currency === "USD") setSymbol("$");

    fetchCoins();
  }, [currency]);

  return (
    <Crypto.Provider
      value={{
        currency,
        setCurrency,
        symbol,
        alert,
        setAlert,
        user,
        coins,
        loading,
        watchlist,
        handleLogin,
        handleRegister,
        checkAuth,
        handleLogOut,
      }}
    >
      {children}
    </Crypto.Provider>
  );
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
