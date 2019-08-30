import * as actions from "../../store/actions";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import LinearProgress from "@material-ui/core/LinearProgress";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { Provider, createClient, useQuery } from "urql";

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));
export default props => {
  return (
    <Provider value={client}>
      <LastKnownMeasurement metric={props} />
    </Provider>
  );
};

const LastKnownMeasurement = props => {
  const { metric } = props;

  const [heartBeat, setHeartBeat] = useState({});

  const classes = useStyles();

  const query = `
 {
  getLastKnownMeasurement(metricName: "${metric.metricName}") {
      at
      value
      metric
      unit
  }
}
`;

  const dispatch = useDispatch();

  const [result] = useQuery({
    query
  });

  useEffect(() => {
    const timer = setTimeout(() => {
    const nextHeartBeat = Date.now()
    setHeartBeat(nextHeartBeat)
    }, 1000);
    return () => clearTimeout(timer);
  }, );

  console.log(result); console.log(heartBeat);

  const { data={}, fetching, error } = result;

  const { at, value, unit } = data.getLastKnownMeasurement || {}

  if (fetching) return <LinearProgress />;
  return (
    <div>
      <Paper className={classes.root}>
      
        <Typography variant="h6" component="h1">
          {metric.metricName
            ? `Last ${metric.metricName} Measurement`
            : "Waiting for Selected Metric"}
        </Typography>
        <Typography component="p">
          {metric.metricName ? `Measurement: ${value} ${unit}` : null}
        </Typography>
      </Paper>
    </div>
  );
};
