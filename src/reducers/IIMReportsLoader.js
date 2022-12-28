export const getBulkExportReducerLoader = (state = true, action) => {
  switch (action.type) {
    case 'getBulkExportLoader':
      return action.payload;
    default:
      return state;
  }
};
export const getBulkExportColValuesReducerLoader = (state = true, action) => {
  switch (action.type) {
    case 'getBulkExportColValuesLoader':
      return action.payload;
    default:
      return state;
  }
};
