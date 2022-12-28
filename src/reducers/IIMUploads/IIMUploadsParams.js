const states = {
  forecast: false,
  leadTime: false,
  materialOnBoard: false
};

export const HandleforecastModal = (state = states, action) => {
  switch (action.type) {
    case 'HandleforecastModal':
      return { ...states, forecast: action.payload };
    default:
      return state;
  }
};
export const HandleleadTimeModal = (state = states, action) => {
  switch (action.type) {
    case 'HandleleadTimeModal':
      return { ...states, leadTime: action.payload };
    default:
      return state;
  }
};
export const HandlematerialOnBoardModal = (state = states, action) => {
  switch (action.type) {
    case 'HandlematerialOnBoardModal':
      return { ...states, materialOnBoard: action.payload };
    default:
      return state;
  }
};
