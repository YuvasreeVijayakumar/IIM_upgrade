export const getCapGovMaterialReport1ReducerLoader = (state = true, action) => {
  switch (action.type) {
    case 'getCapGovMaterialReport1Loader':
      return action.payload;
    default:
      return state;
  }
};
export const getCapGovInfoForMaterial1ReducerLoader = (state = true, action) => {
  switch (action.type) {
    case 'getCapGovInfoForMaterial1Loader':
      return action.payload;
    default:
      return state;
  }
};
