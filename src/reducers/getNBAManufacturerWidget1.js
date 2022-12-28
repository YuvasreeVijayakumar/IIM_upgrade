export default function (state = {}, action) {
  switch (action.type) {
    case 'getNBAManufacturerWidget1': {
      state = JSON.parse(action.payload.data);
      let Total_Capex = state?.Table[0].Total_Capex;
      let avg_early_days = state?.Table1[0].avg_early_days;
      let SLA_MET = state?.Table2[0].SLA_MET;

      return { Total_Capex, avg_early_days, SLA_MET };
    }

    case 'START_LOAD':
      state = {};
      return state;
    default:
      return state;
  }
}
