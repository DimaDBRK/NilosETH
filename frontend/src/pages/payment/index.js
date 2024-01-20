import { useContext, useEffect, useState }  from "react";
import { AppContext } from "App";
import 
{ Alert,
  Box, 
  Typography, 
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails 
} from "@mui/material";
import Header from "components/Header";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import axios from "axios";

const Payment = (props) => {
  const [payments, setPayments] = useState([]);
  
  const [msg, setMsg] = useState("");
  const { token, setToken } = useContext(AppContext);

  //web page title for browser
  const title = props.title;
  useEffect(() => {
    document.title = title;
  },[]);
   
  //theme
  const theme = useTheme();
  
       
  // get Payment info
  useEffect(()=>{
    getPayment();
  }, [])
    
  // requests
  const getPayment = async () =>{
    // set the Authorization header - token
    try {
      const headers = {
        "x-access-token": `${token}`,
      };
      // request by User ID
      const res = await axios.get(`/payment`, { headers });
      console.log('res=>', res.data);
      // Sort payments by ID 
      const sortedPayments = res.data.sort((a, b) => b.id - a.id);
      setPayments(sortedPayments)
      setMsg("");
    
    } catch (err) {
      const errMsg = err.response.data.message || err.response.statusText || "An error occurred";
      setMsg(errMsg);
    }
  };   
  
  // Data Grid settings
  const columns = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.1,
    },
    {
      field: "fromPublicKey",
      headerName: "Form",
      flex: 0.5,
      // Access nested property
      valueGetter: (params) => params.row.from.publicKey, 
    },
    {
      field: "toPublicKey",
      headerName: "To",
      flex: 0.5,
      // Access nested property
      valueGetter: (params) => params.row.to.publicKey, 
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 0.1,
    }
  ]

  return(
    <Box 
      m="1.5rem 2.5rem"
        >
        <Header title="Payments" subtitle="transactions" />
        { msg != "" && <Alert severity="warning">{msg}</Alert>}
        <Box>
          <DataGrid
            loading={payments.length < 1}
            getRowId={(row) => row.id || 0}
            rows={payments || []}
            columns={columns}
            slots={{ toolbar: GridToolbar }}
          />
        </Box>
      </Box>
  )
}

export default Payment;