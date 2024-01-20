import React from 'react';
import { useState, useCallback, useContext, useEffect } from 'react';
import { Box, useMediaQuery } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "components/Navbar";
import { AppContext } from "App";
import { jwtDecode } from 'jwt-decode';
import axios from "axios";

const Layout = () => {
    const [msg, setMsg] = useState('');
    // media query desktop - true
    const isNonMobile = useMediaQuery("(min-width: 600px)");
    const { token, setToken } = useContext(AppContext);
    const { userinfo, setUserInfo } = useContext(AppContext);
    const { isLogin, setIsLogin } = useContext(AppContext);



  const handleTokenChange = useCallback((newToken) => {
    try {
      const payload = jwtDecode(newToken);
      setToken(newToken);
      setUserInfo(payload);
      setIsLogin(true);
    } catch (error) {
      console.error("Error decoding token:", error);
    }
  }, [setToken, setUserInfo, setIsLogin]);

  useEffect(() => {
    const storedToken = localStorage.getItem("MmToken");
    if (storedToken) {
      handleTokenChange(storedToken);
    }
  }, [handleTokenChange]);

 

  return (
    <Box 
      display={isNonMobile ? "flex": "block"} 
      // width="100%" 
      height="100%">
    
        <Box flexGrow={1}>
            <Navbar
                user={userinfo.name|| ""}
             />
            <Outlet/>
        </Box>
    </Box>
  )
}

export default Layout;