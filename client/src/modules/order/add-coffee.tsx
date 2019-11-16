import React, { useEffect, useState } from "react";
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
import { IOrderItem } from "../../models";
import { Products } from "./products";

const apiUrl = "http://localhost:5001/api/";

interface IAddCoffeeProps {
  order: string;
  onAdd(coffee: IOrderItem | null): any;
}

const AddCoffee = (props: IAddCoffeeProps) => {
  const classes = useStyles();

  const add = () => {
    props.onAdd({
      quantity: 1,
      price: 70,
      product: Products[0],
      productVariation: Products[0].productVariations[0]
    });
  };

  const cancel = () => {
    props.onAdd(null);
  };

  return (
    <div>
      <Typography component="h3" variant="subtitle1" gutterBottom>
        Add coffee
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="coffe_size"
            name="coffe_size"
            label="Bag type"
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="coffee_price"
            name="coffee_price"
            label="Price"
            fullWidth
            autoComplete="coffee_price"
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="coffee_quantity"
            name="coffee_quantity"
            label="Quantity"
            fullWidth
            autoComplete="coffee_quantity"
          />
        </Grid>
      </Grid>
      <div className={classes.buttons}>
        <Button onClick={cancel} color="default" variant="contained">
          Cancel
        </Button>
        <Button onClick={add} color="primary" variant="contained">
          Add to order
        </Button>
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

export default AddCoffee;
