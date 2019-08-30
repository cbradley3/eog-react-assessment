import * as actions from "../actions";

const initialState = {
  metric: ""
};

const metricsRecevied = (state, action) => {
  const { getMetric } = action;
  const { metric } = getMetric;

  return {
    metric
  };
};

const handlers = {
  [actions.METRICS_RECEIVED]: metricsRecevied
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
