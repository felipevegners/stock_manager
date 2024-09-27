/* eslint-disable react/prop-types */
import { createContext, useEffect, useReducer } from "react";
import { message } from "antd";
import { userLogin } from "../controllers/UserController";
import API from "../services/api";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

const authReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload);
      return {
        ...state,
        isLogged: true
      };
    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        ...state,
        isLogged: false
      };
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, { isLogged: false });

  const login = async (email, password) => {
    try {
      const res = await userLogin(email, password);
      if (res.response?.status === 400) {
        message.error(res.response.data.message);
      }
      API.defaults.headers.Authorization = `Bearer ${res.token}`;
      dispatch({ type: "LOGIN_SUCCESS", payload: res.token });
    } catch (error) {
      console.log(error);
      message.error("Problema ao autenticar, tente novamente!");
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
  };

  const isAuthenticated = () => {
    const presentToken = localStorage.getItem("token");
    if (presentToken) {
      const decodedToken = jwtDecode(presentToken);
      localStorage.setItem("userId", decodedToken.user.id);
      localStorage.setItem("username", decodedToken.user.name);
      localStorage.setItem("roles", decodedToken.user.roles);
      return decodedToken.exp * 1000 > Date.now();
    } else {
      localStorage.removeItem("token");
      return false;
    }
  };

  const getAuthHeader = () => {
    if (state.token) {
      return { Authorization: `Bearer ${state.token}` };
    }
    return {};
  };

  useEffect(() => {
    isAuthenticated();
  }, []);

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, isAuthenticated, getAuthHeader }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
