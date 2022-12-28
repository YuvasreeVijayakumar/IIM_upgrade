export const ReportNavHideShow = (state = false, action) => {
  switch (action.type) {
    case 'ReportNavHideShow':
      return action.payload;
    default:
      return state;
  }
};
