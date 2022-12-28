export default function (state = [{}], action) {
  switch (action.type) {
    case 'getBulkExport': {
      let PageCount = '';
      let TableData = {};
      state = JSON.parse(action.payload.data);
      PageCount = state.Table[0]?.TOTAL_COUNT;
      TableData = state?.Table1;

      return { PageCount, TableData };
    }

    case 'START_LOAD':
      return state;
    default:
      return state;
  }
}
