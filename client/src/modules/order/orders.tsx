import React, { useEffect, useState } from "react";
import { Route, Link, BrowserRouter as Router } from "react-router-dom";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox
} from "@material-ui/core";
import axios from "axios";

const apiUrl = "http://localhost:5001/api/";

const Orders = () => {
  const classes = useStyles();

  const [orders, setOrders] = useState([]);

  async function fetchOrders() {
    try {
      setOrders([]);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div>
      <Typography variant="h6" gutterBottom>
        Orders
      </Typography>
      <div className={classes.buttons}>
        <Link to={"/order"}>New order</Link>
      </div>
    </div>
  );
};

const useStyles = makeStyles(theme =>
  createStyles({
    buttons: {
      marginTop: theme.spacing(2),
      display: "flex",
      justifyContent: "flex-end"
    }
  })
);

export default Orders;
