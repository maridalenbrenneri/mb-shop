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
  Button
} from "@material-ui/core";
import axios from "axios";

const apiUrl = "http://localhost:5001/api/";

const Dashboard = () => {
  const classes = useStyles();

  const [stats, setStats] = useState();
  const [statsLastUpdated, setStatsLastUpdated] = useState();

  async function fetchStats() {
    try {
      const response = await axios(`${apiUrl}admin/stats`);
      setStats(response.data.data);
      setStatsLastUpdated(response.data.lastUpdated);
    } catch (err) {
      console.log(err);
    }
  }

  const updateStats = async () => {
    try {
      const response = await axios(`${apiUrl}admin/importstats`);
      setStats(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (!stats) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div>
      <Typography variant="h4" component="h1">
        Dashboard
      </Typography>

      <Paper>
        <h1>
          {stats.subscriptionActiveCount + stats.giftSubscriptionCount} aktive
          abos
        </h1>

        <p>
          {stats.subscriptionFortnightlyCount +
            stats.giftSubscriptionFortnightlyCount}
          annenhver uke,
          {stats.subscriptionMonthlyCount + stats.giftSubscriptionMonthlyCount}
          månedlig
        </p>
        <p>
          Antall poser per måned:
          <strong>{stats.subsciptionsBagsPerMonthCount}</strong> <br />
          Antall poser 1. tirsdag :
          <strong>
            {stats.subsciptionsBagsPerMonthlyCount +
              stats.subsciptionsBagsPerFortnightlyCount}
          </strong>
          <br />
          Antall poser 3. tirsdag:
          <strong> {stats.subsciptionsBagsPerFortnightlyCount} </strong>
          <br />
          Gyldne abosnittet:
          <strong>
            {stats.subsciptionsBagsPerMonthCount /
              (stats.subscriptionActiveCount + stats.giftSubscriptionCount)}
          </strong>
          <br />
          Abos på pause: {stats.subscriptionOnHoldCount} <br />
          Gaveabos: {stats.giftSubscriptionCount}
        </p>
      </Paper>

      <Paper className={classes.root}>
        Annenhver uke
        <pre className={classes.pre}>
          {JSON.stringify(stats.bagCountFortnightly)}
        </pre>
        Månads
        <pre className={classes.pre}>
          {JSON.stringify(stats.bagCountMonthly)}
        </pre>
        {/* <Table className={classes.table} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Dessert (100g serving)</TableCell>
              <TableCell align="right">Calories</TableCell>
              <TableCell align="right">Fat&nbsp;(g)</TableCell>
              <TableCell align="right">Carbs&nbsp;(g)</TableCell>
              <TableCell align="right">Protein&nbsp;(g)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.bagCountFortnightly.map((row: any) => (
              <TableRow key={row.name}>
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                <TableCell align="right">{row.carbs}</TableCell>
                <TableCell align="right">{row.protein}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table> */}
      </Paper>

      <p>
        <div>Data last updated {statsLastUpdated}</div>
        <Button onClick={updateStats} color="primary" variant="contained">
          Update now
        </Button>
      </p>
    </div>
  );
};

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      width: "100%",
      overflowX: "auto"
    },
    table: {
      minWidth: 650
    },
    pre: {
      whiteSpace: "pre-wrap"
    }
  })
);

export default Dashboard;
