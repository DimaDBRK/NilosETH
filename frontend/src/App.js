// dark mode
import CssBaseline from '@mui/material/CssBaseline'
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState, useContext, useMemo, useEffect, createContext  } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Routes, Route } from 'react-router-dom';

// components & pages
import Layout from 'pages/layout';
import Home from './components/Home';
import Login from 'pages/login';
import SignUp from 'pages/register';
import Payment from 'pages/payment';
import User from 'pages/user';


export const AppContext = createContext(null);

function App() {
  // theme 
  const mode = useSelector((state) => state.global.mode);
  const theme = useMemo(()=> createTheme({
    palette: {
      mode,
    },
  }), 
  [mode]);

  //user
  const [token, setToken] =  useState(null);
  const [isLogin, setIsLogin] =  useState(false);
  const [userinfo, setUserInfo] = useState("");
  
  return (
    <div className="app">
      <AppContext.Provider value ={{ token, setToken, isLogin, setIsLogin, userinfo, setUserInfo }}>
        <ThemeProvider theme = {theme}>
          <CssBaseline /> 
          <Routes>
            <Route element={<Layout/>}>
              {isLogin ? (<Route path='/' element={<Navigate to="/user" replace/>}/>)
              :(<Route path='/' element={<Home title="Homepage"/>}/>)
              }
              <Route path='/login' element={<Login title='Login'/>}/>
              <Route path='/register' element={<SignUp title='Register'/>}/>
              <Route path='/user' element={<User title='User'/>}/>
              <Route path='/payment' element={<Payment title='Payment'/>}/>
            </Route>
          </Routes>
        </ThemeProvider>
      </AppContext.Provider>
    </div>
  );
}

export default App;
