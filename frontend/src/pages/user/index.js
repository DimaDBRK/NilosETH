import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import { Alert, Grid, Link ,Avatar, TextField, Box, MenuItem, InputLabel, Select, FormControl, FormControlLabel, Checkbox, Button, Typography, useTheme, FormHelperText } from "@mui/material";
import Header from "components/Header";
import AccountCard from 'components/AccountCard';


import { useNavigate } from 'react-router-dom';
import axios from "axios";

const User = (props) => {
  // accounts
  const [accounts, setAccounts] = useState([]);
  const [allAccounts, setAllAccounts] = useState([])

  const [msg, setMsg] = useState("");
  const { isLogin, setIsLogin, userinfo, setUserInfo, token, setToken } = useContext(AppContext);
  
  //web page title for browser
  const title = props.title;
  useEffect(() => {
    document.title = title;
  },[]);
  
  //theme
  const theme = useTheme();

  const navigate = useNavigate();
  
  // get user's accounts 
  useEffect(()=>{
    if (userinfo) {
      console.log("userinfo on user page=>", userinfo )
      getUserAccounts();
      // getItems();
    }
  }, [userinfo])

   // get All accounts 
   useEffect(()=>{
      getAllAccounts();
   }, [userinfo, accounts])

  // requests

  const getUserAccounts = async () =>{
    // set the Authorization header - token
    try {
      const headers = {
        "x-access-token": `${token}`,
      };
      // request by User ID
      const res = await axios.get(`/user/${userinfo.id}`, { headers });
      console.log('res=>', res.data);
      setAccounts(res.data.accounts)
      setMsg("");
    
    } catch (err) {
      const errMsg = err.response.data.message || err.response.statusText || "An error occurred";
      setMsg(errMsg);
    }
  };  
  
  const getAllAccounts = async () =>{
    // set the Authorization header - token
    try {
      const headers = {
        "x-access-token": `${token}`,
      };
      // request to /account
      const res = await axios.get(`/account`, { headers });
      console.log('getAllAccounts=>', res.data);
      setAllAccounts(res.data)
      setMsg("");
    
    } catch (err) {
      const errMsg = err.response.data.message || err.response.statusText || "An error occurred";
      setMsg(errMsg);
    }
  };  


  
  // functions
  //  add new account
  const handleClickAddNewAccount = async (event) => {
    // event.preventDefault();
    console.log("Add account");
    try {
      const res = await axios.post(`/account`, { "user": userinfo.id });
      if (res.status === 200 || res.status === 201) {
        console.log(res.data);
        setMsg("New account created");
        // update account for user list
        getUserAccounts();
      }
    } catch (err) {
      console.log(err);
      setMsg(err.response.data.message || err.response.statusText || "An error occurred"); // to show in the same part
    }
  }
  

  const  findCategoryTitleById = (array, id) => {
    if (id) {
      const item = array.find(item => item.id === id);
      return item ? item.title : null;
    }
    return "";
   };

     



  
   

    return(
      <Box m="1.5rem 2.5rem">
        <Header title="MY ACCOUNTS" subtitle="Mange accounts" />
        { msg != "" && <Alert severity="warning">{msg}</Alert>}
                       
          <Box
            display="flex"
            flexDirection="row"
            alignItems="flex-start"
            alignContent="center"
            gap={1}
            >
              {/* Add new category button */}
              <Button
                variant="contained"
                sx={{ ml: 1 }}
                disabled={false}
                onClick={handleClickAddNewAccount}
              >
                Add
              </Button>
            </Box>
            <Box>
        {/* Accounts list */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          alignContent="center"
          gap={1}
        >
        { accounts.length > 0 ? 
        
          accounts.map(account => (
            <AccountCard key={account?.id} account={account} allAccounts={allAccounts} setMsg={setMsg} />
          
          )) 
          : "No accounts."}
        </Box>
        
        </Box>
      </Box>
    )
}

export default User;