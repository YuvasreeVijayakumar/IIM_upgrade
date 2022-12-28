const states = {
  getTotalQuantityAndCapexLoader: true,
};
export const getTotalQuantityAndCapexLoader = (state = states, action) => {
  switch (action.type) {
    case "getTotalQuantityAndCapexLoader":
      return { ...states, getTotalQuantityAndCapexLoader: action.payload };
    default:
      return state;
  }
};
