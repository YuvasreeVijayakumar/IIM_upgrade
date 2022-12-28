const states = {
    ChatBotToggler: true,
  }
  export const ChatBotToggler = (state = states, action) => {
    switch (action.type) {
      case "ChatBotToggler":
        return { ...states, ChatBotToggler: action.payload };
      default:
        return state;
    }
  };
  