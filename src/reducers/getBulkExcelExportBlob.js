export default function (state = {}, action) {
  switch (action.type) {
    case 'getBulkExcelExportBlob':
      state = action.payload.data;
      return state;
    case 'START_LOAD':
      state = {};
      return state;
    default:
      return state;
  }
}
