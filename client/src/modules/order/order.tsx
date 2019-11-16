import React, { useEffect, useState } from "react";
import { makeStyles, createStyles } from "@material-ui/core/styles";
import {
  Typography,
  Button,
  Grid,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell
} from "@material-ui/core";
// import axios from "axios";
import AddCoffee from "./add-coffee";
import { IOrderItem, IOrder } from "../../models";

// const apiUrl = "http://localhost:5001/api/";
export interface IOrderProps {
  order: IOrder | undefined;
}

const Order = (props: IOrderProps) => {
  const classes = useStyles();

  const [items, setItems] = useState(new Array<IOrderItem>());
  const [order, setOrder] = useState();
  const [showAddCoffee, setShowAddCoffee] = useState(false);

  const startAddCoffee = () => {
    setShowAddCoffee(true);
  };

  const coffeeAdded = (coffee: IOrderItem) => {
    if (coffee) {
      items.push(coffee);
      setItems(items);
    }

    setShowAddCoffee(false);
  };

  const save = () => {};

  async function fetchOrders() {
    try {
      // setOrders([]);
    } catch (err) {
      console.log(err);
    }
  }

  const initOrder = () => {
    if (!props.order) {
      setOrder({});
    } else {
      setOrder(props.order);
    }
  };

  useEffect(() => {
    initOrder();
  }, []);

  return (
    <div>
      <Typography component="h2" variant="h6" gutterBottom>
        Order
      </Typography>

      {!showAddCoffee && (
        <div>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                id="customer"
                name="customer"
                label="Customer"
                fullWidth
              />
            </Grid>
          </Grid>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Ship To</TableCell>
                <TableCell>Payment Method</TableCell>
                <TableCell align="right">Sale Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(row => (
                <TableRow>
                  <TableCell>{row.productVariation.name}</TableCell>
                  <TableCell>{row.productVariation.name}</TableCell>
                  <TableCell>{row.productVariation.name}</TableCell>
                  <TableCell>{row.productVariation.name}</TableCell>
                  <TableCell align="right">
                    {row.productVariation.name}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className={classes.buttons}>
            <Button
              onClick={startAddCoffee}
              color="primary"
              variant="contained"
            >
              Add coffee
            </Button>
            <Button onClick={save} color="primary" variant="contained">
              Save order
            </Button>
          </div>
        </div>
      )}

      {showAddCoffee && <AddCoffee order={"Hello"} onAdd={coffeeAdded} />}
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

export default Order;
