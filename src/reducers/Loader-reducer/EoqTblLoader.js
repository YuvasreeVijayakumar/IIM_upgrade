const states = {
  EoqTblLoader: true,
};
export const EoqTblLoader = (state = states, action) => {
  switch (action.type) {
    case "EoqTblLoader":
      return { ...states, EoqTblLoader: action.payload };
    default:
      return state;
  }
};
