export default function (state = {}, action) {
  switch (action.type) {
    case 'getNBAManufacturerWidget2': {
      state = JSON.parse(action.payload.data);
      let materials = state?.Table[0].MATERIALS;
      let vendors = state?.Table1[0].VENDORS;
      let leadtime = state?.Table2[0].MEDIAN_LEADTIME;

      return { materials, vendors, leadtime };
    }

    case 'START_LOAD':
      state = {};
      return state;
    default:
      return state;
  }
}
