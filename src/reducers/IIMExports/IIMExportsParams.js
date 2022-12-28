const states = {
  Page: 1,
  SizePerPage: 10,
  sortField: 'Cap_Gov_Request',
  sortOrder: 'DESC',
  SearchValue: [],
  initialpage: 'Capgov_request'
};
export const InitialpageRender = (state = states, action) => {
  switch (action.type) {
    case 'InitialpageRender':
      return { ...states, initialpage: action.payload };
    default:
      return state;
  }
};
export const UpdatePage = (state = states, action) => {
  switch (action.type) {
    case 'UpdatePage':
      return { ...states, Page: action.payload };
    default:
      return state;
  }
};

export const UpdateSizePerPage = (state = states, action) => {
  switch (action.type) {
    case 'UpdateSizePerPage':
      return { ...states, SizePerPage: action.payload };
    default:
      return state;
  }
};

export const UpdateSorting = (state = states, action) => {
  switch (action.type) {
    case 'UpdateSorting':
      return {
        ...states,
        sortOrder: action.payload.sortOrder,
        sortField: action.payload.sortField
      };
    default:
      return state;
  }
};

// export const UpdateSearchValue = (state = states, action) => {
//   switch (action.type) {
//     case 'UpdateSearchValue': {
//       let val = action.payload.data;
//       let col = action.payload.col;
//       let checkedArray = state.SearchValue.filter((d) => Object.keys(d) != col);

//       return { ...state, SearchValue: [...checkedArray, { [col]: val }] };
//     }
//     case 'ClearUpdateSearchValue':
//       return { ...state, SearchValue: [] };

//     default:
//       return state;
//   }
// };

export const UpdateSearchValue = (state = states, action) => {
  switch (action.type) {
    case 'UpdateSearchValue':
      return { ...states, SearchValue: action.payload };
    default:
      return state;
  }
};
