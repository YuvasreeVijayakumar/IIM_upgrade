export default function (state = ['data'], action) {
  switch (action.type) {
    case 'getTopTrendingMatsDD':
      state = JSON.parse(action.payload.data);
      return state;
    case 'START_LOAD':
      state = {};
      return state;
    default:
      return state;
  }
}