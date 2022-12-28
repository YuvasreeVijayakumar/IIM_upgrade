import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Layout } from 'antd';
import {} from '../../actions';
import Map from './Map';
import EOQTable from './EOQTable';
import Widget from './Widget';
import ChatBot from './ChatBot';
import InventoryExhaustTable from './InventoryExhaustTable';

const { Footer } = Layout;
class DashBoard extends Component {
  constructor(props) {
    super(props);

    sessionStorage.setItem('sessionLoad', 'initialload');

    this.state = {};
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="scroll-set-body">
          <Row className="v4">
            <Widget />
          </Row>
          <Row className="v4">
            <Map />
          </Row>
          <Row className="v4">
            <EOQTable />
          </Row>
          <Row className="v4">
            <InventoryExhaustTable />
          </Row>
          {/*<Row>
                        <Wallet/>
                    </Row>*/}
          <Row className="row-hide v4">
            {/* <ChatBot /> */}

            {this.props.chatbotonoff && <ChatBot />}
          </Row>
          <Footer style={{ textAlign: 'center', bottom: '0' }}>
            <span className="Footer-logo" />
          </Footer>
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

export default connect(mapState, {})(DashBoard);
