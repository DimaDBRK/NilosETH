import React from 'react';
import { useContext, useEffect, useState }  from "react";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Grid, MenuItem, Select, InputLabel, FormControl, Button, CardActionArea, CardActions, Box, IconButton, Paper } from '@mui/material';

import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from "axios";
import { AppContext } from "App";
// Dialog
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

const AccountCard = (props) => {

  const setMsg = props.setMsg;
  const account = props.account;
  const allAccounts = props.allAccounts;

  const { isLogin,  token } = useContext(AppContext);
  
  const [ balance, setBalance] = useState(0.0);
  // Funding
  const [ fromPrivateKey, setFromPrivateKey] = useState("");
  const [ fundAmount, setFundAmount] = useState(0);
  // Keys
  const [ accountKeys, setAccountKeys] = useState();
  // Payment
  const [ toPaymentAccount, setToPaymentAccount] = useState("");
  const [ toPaymentId, setToPaymentID] = useState("");
  const [ paymentAmount, setPaymentAmount] = useState(0);

  // Dialog
  const [openFund, setOpenFund] = useState(false);
  // Show Keys
  const [openKeys, setOpenKeys] = useState(false);
  // Payment
  const [openPayment, setOpenPayment] = useState(false);

 // get balance
 useEffect(()=>{
  if (account.id) {
    getAccountBalance();
    // getItems();
  }
}, [])


  // requests
  const getAccountBalance = async () =>{
    // set the Authorization header - token
    try {
      const headers = {
        "x-access-token": `${token}`,
      };
      // request by User ID
      const res = await axios.post(`/payment/balance`, { "accountIds":[account.id] } );
      if (res.status === 200 || res.status === 201) {
        console.log('res=>', res.data);
        setBalance(res.data[account.id])
        setMsg("");
      }
    } catch (err) {
      const errMsg = err.response.data.message || err.response.statusText || "An error occurred";
      setMsg(errMsg);
    }
  }; 
  
  // Funding
  const fundAccount = async (toAccountId, fromPrivateKey, amount) => {
    // set the Authorization header - token
  
    try {
      const headers = {
        "x-access-token": `${token}`,
      };
      // request by User ID
      const res = await axios.post(`/payment/funding`, 
        { 
          "fromPrivateKey": fromPrivateKey,
          "toAccountId": toAccountId, 
          "amount": amount
        } 
      );
      if (res.status === 200 || res.status === 201) {
        console.log('res=>', res.data);
        setMsg("Funding OK");
        getAccountBalance();
        setOpenFund(false);

      }
    } catch (err) {
      const errMsg = err.response.data.message || err.response.statusText || "An error occurred";
      setMsg(errMsg);
    }
  }; 

  // Get Account info by ID => Show keys
  
  const getAccountsKeys = async () =>{
    // set the Authorization header - token
    try {
      const headers = {
        "x-access-token": `${token}`,
      };
      // request by User ID
      const res = await axios.get(`/account/${account.id}`, { headers });
      console.log('res=>', res.data);
      setAccountKeys(res.data)
      setMsg("");
    
    } catch (err) {
      const errMsg = err.response.data.message || err.response.statusText || "An error occurred";
      setMsg(errMsg);
    }
  };

  // Funding
  const payment = async (fromId, toId, amount) => {
    // set the Authorization header - token
  
    try {
      const headers = {
        "x-access-token": `${token}`,
      };
      // request by User ID
      const res = await axios.post(`/payment`, 
        { 
          "from": fromId,
          "to": toId, 
          "amount": amount
        } 
      );
      if (res.status === 200 || res.status === 201) {
        console.log('res=>', res.data);
        setMsg("Payment OK");
        getAccountBalance();
        setOpenPayment(false);

      }
    } catch (err) {
      const errMsg = err.response.data.message || err.response.statusText || "An error occurred";
      setMsg(errMsg);
    }
  }; 
  
  // functions
  //  Funding
  const handleClickFundAccount = () => {
    // event.preventDefault();
    console.log("Fund account");
    // Open dialog block
    setOpenFund(true);
  }
  
  // Close Fund Dialog
  const handleCloseFund = () => {
    setOpenFund(false);
    setMsg(""); 
  };

  // handleChangeFromPrivateKey

  const handleChangeFromPrivateKey = (e) => {
    setMsg(""); 
    const inputPrivateKey = e.target.value;
    setFromPrivateKey(inputPrivateKey);
  };

  const handleChangeFundAmount = (e) => {
    setMsg(""); 
    const fundAmount = e.target.value;
    setFundAmount(+fundAmount);
  };

  // Show Keys
  const handleClickShowKeys = () => {
    // event.preventDefault();
    console.log("Show Keys");
    // Open dialog block
    setOpenKeys(true);
    getAccountsKeys();
  }
  //  Close Keys Dialog
  const handleCloseKeys = () => {
    setOpenKeys(false);
    setMsg(""); 
  };

  // Payment
  const handleClickPaymentAccount = () => {
    // event.preventDefault();
    console.log("Payment");
    // Open dialog block
    setOpenPayment(true);
  }
  
  // Close Payment Dialog
  const handleClosePayment = () => {
    setOpenPayment(false);
    setMsg(""); 
    setToPaymentAccount("");
    setPaymentAmount(0);
    setToPaymentID("");
  };

  const handleChangePaymentAmount = (e) => {
    setMsg(""); 
    const paymentAmount = e.target.value;
    setPaymentAmount(+paymentAmount);
  };

  const handleChangeToAccount = (e) => {
    // find account ID ny Publick key
    const findAccountIdByPublicKey = (publicKeyToFind) => {
      const account = allAccounts.find(account => account.publicKey === publicKeyToFind);
      return account ? account.id : "";
    };

    setMsg(""); 
    const inputToAccount = e.target.value;
    setToPaymentAccount(inputToAccount);
    const accID = findAccountIdByPublicKey(inputToAccount);
    // if (accID) {
    //   setToPaymentID();
    // }
    setToPaymentID(accID);

  };

  const handleChangeToPaymentID = (e) => {
    // find by ID
    const findPublicKeyById = (id) => {
      const account = allAccounts.find(account => account.id === id);
      return account ? account.publicKey : null;
    };

    setMsg(""); 
    const inputToPaymentId = e.target.value;
    setToPaymentID(inputToPaymentId);
    const accountByID = findPublicKeyById(inputToPaymentId);
    setToPaymentAccount(accountByID || "");
  };

 
  




  return (
    <Box>
      <Card sx={{ minWidth: 440 }}>
        <CardActionArea onClick={getAccountBalance}>
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              ID: {account.id}   Balance: {(+balance).toFixed(2)} ETH
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Address: {account?.publicKey}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions>
          <Button 
            size="small" 
            color="primary"
            variant="outlined"
            onClick={handleClickPaymentAccount}
          >
            Payment
          </Button>
          <Button 
            size="small" 
            color="secondary"
            variant="outlined"
            onClick={handleClickShowKeys}
          >
            Show Keys
          </Button>
          <Button 
            size="small" 
            color="success"
            variant="outlined"
            onClick={handleClickFundAccount}
          >
            Fund account
          </Button>
        </CardActions>
      </Card>
    {/* Dialog Fund */}
    <Dialog
        open={openFund}
        onClose={handleCloseFund}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
           
          },
        }}
      >
        <DialogTitle>Account Funding</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To fund account input from which Ganache account PRIVATE KEY and amount.
          </DialogContentText>
            {/* Private key */}
            <Grid container spacing={2}>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="fromPrivateKey"
                  label="From Private Key"
                  name="fromPrivateKey"
                  autoComplete="fromPrivateKey"
                  InputLabelProps={{ shrink: true }}
                  onChange ={ handleChangeFromPrivateKey }
                />
                </Grid>
                <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="fundamount"
                  label="Amount"
                  name="fundamount"
                  autoComplete="fundamount"
                  onChange ={ handleChangeFundAmount }
                />
              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleCloseFund}
          >
            Close
          </Button>
          <Button onClick={() => {fundAccount(account.id, fromPrivateKey, fundAmount); } }>Fund</Button>
        </DialogActions>
      </Dialog>
      {/* End Dialog Fund */}

      {/* Show Keys Dialog */}
      <Dialog
        open={openKeys}
        onClose={handleCloseKeys}
      >
        <DialogTitle> Account Information</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ID
          <Typography variant="body2">
              {accountKeys?.id}
            </Typography>
          </DialogContentText>
          <DialogContentText>
            ACCOUNT ADDRESS (PUBLIC)
            <Typography variant="body2">
              {accountKeys?.publicKey}
            </Typography>
                      
          </DialogContentText>
          <DialogContentText>
            PRIVATE KEY
            <Typography variant="body2">
              {accountKeys?.privateKey}
            </Typography>
          </DialogContentText>
         
        
            
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseKeys}>Done</Button>
        </DialogActions>
      </Dialog>
      {/* End Show Keys Dialog */}

      {/* Dialog Payment */}
    <Dialog
        open={openPayment}
        onClose={handleClosePayment}
        PaperProps={{
          component: 'form',
          onSubmit: (event) => {
            event.preventDefault();
           
          },
        }}
      >
        <DialogTitle>Payment to account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Insert Public Key (Account) or chose Account ID.
            
          </DialogContentText>
            <Grid container spacing={2}>
              
              <Grid item xs={6}>
              {/* ID chose */}
              <FormControl  sx={{ minWidth: 120 }}>
                <InputLabel id="toPaymentId">Account ID</InputLabel>
                  <Select
                    size="small"
                    labelId="toPaymentId"
                    value={toPaymentId}
                    label="Account ID"
                    onChange={(e) => {handleChangeToPaymentID(e); setMsg("")}} 
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    { allAccounts.length > 0 && (allAccounts.map(item => {
                      return (
                        <MenuItem key ={item.id} value={item.id}>{item.id}</MenuItem>
                      );
                      })
                    )}
                  </Select>
              </FormControl>
              </Grid>
              {/* Amount */}
              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="paymantamount"
                  label="Amount"
                  name="paymantamount"
                  autoComplete="paymantamount"
                  value={paymentAmount}
                  onChange ={ handleChangePaymentAmount }
                />
              </Grid>
              <Grid item xs={12}>
                {/* to account */}
                <TextField
                  required
                  fullWidth
                  size="small"
                  id="toaccount"
                  label="To Account (Public Key)"
                  name="toaccount"
                  value={toPaymentAccount}
                  autoComplete="toaccount"
                  onChange ={ handleChangeToAccount }
                />
              </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClosePayment}
            
          >
            Close
          </Button>
          <Button 
            disabled={toPaymentId == ""}
            variant="contained"
            onClick={() => {payment(account.id, toPaymentId, paymentAmount); } }
          >
              Pay
          </Button>
        </DialogActions>
      </Dialog>
      {/* End Dialog Payment */}


  </Box>
  );
}

export default AccountCard;