const states = {
  UploadFileFlag: false,
};
export const UploadFileFlags = (state = states, action) => {
  switch (action.type) {
    case "UploadFileFlag":
      return { ...states, UploadFileFlag: action.payload };
    default:
      return state;
  }
};
