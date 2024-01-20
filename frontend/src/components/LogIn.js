import * as React from 'react';
import { useState, useContext, useCallback } from "react";
import { Alert, Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from "@mui/material";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useTheme } from '@mui/material/styles';
import { AppContext } from "../App";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const LogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isButton, setIsButton] = useState(true);
  
  const {setToken} = useContext(AppContext);
  const {setRefreshToken} =  useContext(AppContext);
  const { isLogin, setIsLogin } = useContext(AppContext);
  const { userinfo, setUserInfo } = useContext(AppContext);
  
  
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  const location = useLocation();

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
  
  // click on button
  const handleClick = async (e) => {
    
   

    e.preventDefault();
    setMsg("");
    // -> Login
    try {
      console.log("Click");
      const res = await axios.post(`/auth/login`, { username, password });
      console.log(res.data);
      if (res.status === 200 || res.status === 201) {
        console.log(res.data);
        // store token to local storage
        localStorage.setItem('MmToken', res.data.access_token);
        handleTokenChange(res.data.access_token);
        // setToken(res.data.access_token);
        setMsg("");
        // setIsLogin(true);
        const origin = location.state?.from?.pathname || '/';
        // console.log("origin=>", origin)
        navigate(origin); //to origin or main page /
      }
    } catch (err) {
      console.log(err.response);
      setMsg(err.response.data.message); // to show in the same part
    }
  }

 

  // change username
  const handleChangeUsername = (e) => {
    setMsg(""); 
    const inputUsername = e.target.value;
    
    // if username
    if (inputUsername) {
      setUsername(inputUsername);
      if (password.length >= 3) {setIsButton(false)};
    } else {
      setMsg("Wrong User Name format!"); 
      setIsButton(true);
    };
  }

   // change password
   const handleChangePassword = (e) => {
    setMsg(""); 
    setPassword(e.target.value);
    // check length
    if (e.target.value?.length >= 3 ) {
      setIsButton(false);
    } else {
      setMsg("Password is less 3 symbols!"); 
      setIsButton(true);
    };
  }
  return (
        <Box
          sx={{
            marginTop: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            maxWidth: 450,
                px: 2,
                py: 1,
                width: '100%'
          }}
        >
          { msg.length > 1 && <Alert severity="warning">{msg}</Alert>}
           
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Login
          </Typography>
       

          <Box component="form" noValidate sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="User Name"
                  name="username"
                  autoComplete="username"
                  onChange ={ handleChangeUsername }
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete='off'
                  onChange ={ handleChangePassword }
                />
              </Grid>
            </Grid>
            <Button
              id="button-login"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
              disabled={isButton}
            >
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link  sx={{color:theme.palette.secondary[200]}} variant="body3" onClick={()=>{ navigate("/register")}}>
                  Don't have an account? Register
                </Link>
              </Grid>
            </Grid>
          </Box> 
       
        </Box>

  );
}

export default LogIn;