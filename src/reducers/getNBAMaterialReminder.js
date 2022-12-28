export default function (state = {}, action) {
  switch (action.type) {
    case 'getNBAMaterialReminder': {
      state = JSON.parse(action.payload.data);
      let inv_date = state?.Table[0]?.Inventory_Exhaust_Date;
      let Reorder_date = state?.Table[0]?.Reorder_Date;
      let LeadTime_date = state?.Table1[0]?.Leadtime_TillDate;
      return { inv_date, LeadTime_date, Reorder_date };
    }

    case 'START_LOAD':
      state = {};
      return state;
    default:
      return state;
  }
}
