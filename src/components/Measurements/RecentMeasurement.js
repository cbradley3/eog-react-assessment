import * as actions from '../../store/actions';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { Provider, createClient, useQuery } from 'urql';

const client = createClient({
  url: 'https://react.eogresources.com/graphql'
});
const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  }
}));
export default props => {
  return (
    <Provider value={client}>
      <RecentMeasurement metric={props} />
    </Provider>
  );
};

const RecentMeasurement = props => {
  const { metric } = props;

  const [measurement, setMeasurement] = useState({});

  const classes = useStyles();

const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      at
      value
      metric
      unit
    }
  }
}
`;

  const dispatch = useDispatch();

  const [result] = useQuery({
    query
  });

  const { data, fetching, error } = result;

  useEffect(() => {
    if (error) {
      dispatch({
        type: actions.API_ERROR,
        error: error.message
      });
      return;
    }
    if (!data) return;

    const measurementData = data.getRecentMeasurement;
    setMeasurement(measurementData);
  }, [dispatch, error, data, measurement]);

  if (fetching) return <LinearProgress />;
  return (
    <div>
      <Paper className={classes.root}>
        <Typography variant="h6" component="h1">
          {metric.metricName
            ? `Last ${metric.metricName} Measurement`
            : 'Waiting for Selected Metric'}
        </Typography>
        <Typography component="p">
          {metric.metricName
            ? `Measurement: "value"`
            : null}
        </Typography>
      </Paper>
    </div>
  );
};