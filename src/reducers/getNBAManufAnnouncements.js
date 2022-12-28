export default function (state = {}, action) {
  switch (action.type) {
    case 'getNBAManufAnnouncements': {
      state = JSON.parse(action.payload.data);
      let NO_OF_MATERIALS = state?.Table[0].NO_OF_MATERIALS;
      let UNDERSTOCK = state?.Table1[0].UNDERSTOCK;
      let OVERSTOCK = state?.Table2[0].OVERSTOCK;
      let NUMBER_OF_LTS_EXPIRING = state.Table3[0].NUMBER_OF_LTS_EXPIRING;
      let MAT_COUNT = state.Table4[0].MAT_COUNT;

      return { NO_OF_MATERIALS, UNDERSTOCK, OVERSTOCK, NUMBER_OF_LTS_EXPIRING, MAT_COUNT };
    }

    case 'START_LOAD':
      state = {};
      return state;
    default:
      return state;
  }
}
