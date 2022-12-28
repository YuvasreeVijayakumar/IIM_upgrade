export const SwitchData = (state = false, action) => {
  switch (action.type) {
    case 'SwitchData':
      return action.payload;
    default:
      return state;
  }
};
