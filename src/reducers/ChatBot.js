const states = {
  ChatBot: true,
  DirectLineController: false,
};
export const ChatBot = (state = states, action) => {
  switch (action.type) {
    case "ChatBot":
      return { ...states, ChatBot: action.payload };
    default:
      return state;
  }
};

export const DirectLineController = (state = states, action) => {
  switch (action.type) {
    case "DirectLineController":
      return { ...states, DirectLineController: action.payload };
    default:
      return state;
  }
};
