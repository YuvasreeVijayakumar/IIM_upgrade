import React, { useState } from 'react';
import botImage from '../../../public/img/bot_3.gif';
import close from '../../../public/img/Close-icon.png';
import botlogo from '../../../public/img/bot_logo.svg';

import { useSelector, useDispatch } from 'react-redux';
import ReactWebChat, { createDirectLine } from 'botframework-webchat';
import { DirectLineController, ChatBot } from '../../actions';
import { Col, Row } from 'antd';

const ChatWindow = () => {
  const dispatch = useDispatch();
  const [directLine, setDirectLine] = useState();
  const [value, setValue] = useState(1);
  const styleSet = window.WebChat.createStyleSet({
    // bubbleBackground: "rgb(92, 146, 254)", //rgba(0, 0, 255, .1)
    // bubbleFromUserBackground: "orange", //rgba(0, 255, 0, .1)
    rootHeight: '100%',
    rootWidth: '100%',
    backgroundColor: '#1a3681'
  });

  // After generated, you can modify the CSS rules.
  // Change font family and weight.
  styleSet.textContent = {
    ...styleSet.textContent,
    fontFamily: "'Comic Sans MS', 'Arial', sans-serif"
  };
  const avatarOptions = {
    botAvatarInitials: <img src={botlogo} alt="chatbot" className={'bot-logo-css'} />,
    userAvatarInitials: (
      <span className="initialstyle">{sessionStorage.getItem('userInitial')}</span>
    )
  };

  const toggle = () => {
    dispatch(ChatBot(true));
    dispatch(DirectLineController(false));
  };

  //
  const DirectLineControllers = useSelector(
    (state) => state.DirectLineController.DirectLineController
  );

  if (DirectLineControllers) {
    if (value === 1) {
      setValue('2');
      setValue(2);

      var script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.src = 'https://cdn.botframework.com/botframework-webchat/latest/webchat.js';
      document.getElementsByTagName('head')[0].appendChild(script);
      setDirectLine(
        createDirectLine({
          token: 'aGY1n1QMYC0.c_Ug0C4SUDCdi-ZS63eZQSumYsDG32aPX-zKVWLTC7o'
        })
      );
    }
  }

  return (
    <>
      <nav className={'navbar-expand-lg  navbar-dark fixed-bottom chatbot-wrap chat-open'}>
        <div className="ChatHeader" style={{ position: 'relative' }}>
          <Row>
            <Col span={6}>
              <img src={botlogo} alt="chatbot" className={'bot-logo'} />
            </Col>
            <Col span={18} className="pad-t-5 ">
              <p className="bot-logo-head">Ines</p>
              <span className="bot-logo-sub-head">Lumen Inventory</span>
            </Col>
          </Row>
        </div>

        <div id="webchat" className={'web-bot'}>
          <ReactWebChat directLine={directLine} styleSet={styleSet} styleOptions={avatarOptions} />
        </div>
      </nav>
      <div>
        {/* eslint-disable-next-line */}
        <a className="navbar-brand">
          <img src={close} onClick={() => toggle()} alt="close" className={'close-icon'} />
        </a>
      </div>
    </>
  );
};

function Chat() {
  const dispatch = useDispatch();
  const toggle = () => {
    dispatch(ChatBot(false));
    dispatch(DirectLineController(true));
  };

  const toggler = useSelector((state) => state.ChatBot.ChatBot);
  return toggler ? (
    // eslint-disable-next-line
    <a className="navbar-brand">
      <img src={botImage} onClick={() => toggle()} alt="chatbot" className={'BotImg'} />
    </a>
  ) : (
    <ChatWindow />
  );
}

export default Chat;
