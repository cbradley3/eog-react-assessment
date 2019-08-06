import * as actions from '../../store/actions';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Provider, createClient, useQuery } from 'urql';

const client = createClient({
  url: 'https://react.eogresources.com/graphql'
});

export default props => {
  return (
    <Provider value={client}>
      <MeasurementChart metric={props} />
    </Provider>
  );
};

const MeasurementChart = props => {
  const [measurements, setMeasurements] = useState([]);

  const { metric } = props;

  const query = `query {
    getMeasurements(input: {metricName: "${metric.metricName}"}) {
        metric
        value
        unit
        at
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

    const newData = data.getMeasurements;
    if (newData.length > 10) {
      const dataChunk = newData.slice(newData.length - 20);
      setMeasurements(dataChunk);
    }
  }, [dispatch, error, data, measurements]);

  if (fetching) return <LinearProgress />;

  return (
    <LineChart width={900} height={400} data={measurements}>
      <Line type="monotone" dataKey="value" stroke="rgba(204, 0, 0, 1)" />
      <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
      <XAxis dataKey="at" />
      <YAxis />
      <Tooltip />
    </LineChart>
  );
};