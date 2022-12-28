import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Layout } from 'antd';
import {} from '../../actions';
import Kpi from '../Kpi/Kpi';
import ChatBot from '../DashBoard/ChatBot';
import KpiWidjet from './KpiWidjet';

const { Footer } = Layout;
class KpiMainPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="scroll-set-body">
          <div style={{ minHeight: '85vh' }}>
            <Row className="v4">
              <Kpi />
            </Row>
            <Row className="v4">
              <KpiWidjet />
            </Row>

            <Row className="row-hide">
              {/* <ChatBot /> */}
              {this.props.chatbotonoff && <ChatBot />}
            </Row>
          </div>
          <div
            style={{
              height: '5vh',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <Footer style={{ textAlign: 'center', bottom: '0' }}>
              <span className="Footer-logo" />
            </Footer>
          </div>
        </div>
      </div>
    );
  }
}

function mapState(state) {
  return {
    chatbotonoff: state.ChatBotToggler.ChatBotToggler
  };
}

export default connect(mapState, {})(KpiMainPage);
