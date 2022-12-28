export default function (state = {}, action) {
  switch (action.type) {
    case 'getNBAManufOrdersChart':
      state = JSON.parse(action.payload.data);

      return state.Table;
    case 'START_LOAD':
      state = {};
      return state;
    default:
      return state;
  }
}
