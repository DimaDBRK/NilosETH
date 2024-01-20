import * as React from 'react';
import { useState, useContext } from "react";
import { Alert, Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from "@mui/material";

import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

import { useTheme } from '@mui/material/styles';
import { AppContext } from "../App";
import axios from "axios";
import { useNavigate, useLocation } from 'react-router-dom';

const Register = (props) => {
  const [username, setName] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isButton, setIsButton] = useState(true);
  
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  
  // click on button
  const handleClick = async (e) => {
    e.preventDefault();
    setMsg("");
    // -> Register
    try {
      const res = await axios.post(`/user`, { username, password });
      if (res.status === 200 ||res.status === 201) {
        console.log(res.data);
        setMsg("");
        navigate("/login"); //to Login
        
      }
    } catch (err) {
      console.log(err.response);
      setMsg(err.response.data.message); // to show in the same alert part
    }
  }

  // change username
  const handleChangeName = (e) => {
    setMsg(""); 
    const username = e.target.value;
    
    // if length
    if (username.length > 1) {
      setName(username);
   
    } else {
      setMsg("Very Short User Name!"); 
   
    };
  }

   // change password
   const handleChangePassword = (e) => {
    setMsg(""); 
    setPassword(e.target.value);
    // check length
    if (e.target.value.length < 3 ) {
      setMsg("Password is less 3 symbols!"); 
      setIsButton(true);
    } else {
      setIsButton(false);
    }
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
            Register
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
                  onChange ={ handleChangeName }
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
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={handleClick}
              disabled={isButton}
            >
              SignUp
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link  sx={{color:theme.palette.secondary[200]}} variant="body3" onClick={()=>{ navigate("/login")}}>
                Already have an account? Login
                </Link>
              </Grid>
            </Grid>
          </Box> 
       
        </Box>

  );
}

export default Register;