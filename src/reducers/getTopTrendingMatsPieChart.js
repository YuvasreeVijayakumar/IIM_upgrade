export default function (state = [{}], action) {
  switch (action.type) {
    case 'getTopTrendingMatsPieChart': {
      let Count = 0;
      let PieValue = {};
      let PieKey = [];
      let PieNum = [];
      state = JSON.parse(action.payload.data);
      Count = state.Table[0]?.MATNR_COUNT;
      PieValue = state?.Table1;
      PieKey = PieValue.map((d) => d.TREND);
      PieNum = PieValue.map((d) => d.TREND_COUNT);

      return { Count, PieValue, PieKey, PieNum };
    }

    case 'START_LOAD':
      state = {};
      return state;
    default:
      return state;
  }
}
