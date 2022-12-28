export const ReportFilterToggle = (state = false, action) => {
  switch (action.type) {
    case 'ReportFilterToggle':
      return action.payload;
    default:
      return state;
  }
};
