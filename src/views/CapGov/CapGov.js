import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Layout, Col } from 'antd';
import CapGovChart from './CapGovChart';
import CapGovTable from './CapGovTable';
import CapGovPushPullTable from './CapGovPushPullTable';
import CapGovOrganization from './CapGovOrganization';
import ChatBot from '../DashBoard/ChatBot';
import { getUserImpersonationDetails } from '../../actions';

const { Footer } = Layout;
class CapGov extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  // componentDidMount() {
  //   this.props.getUserImpersonationDetails(
  //     sessionStorage.getItem("loggedEmailId")
  //   );
  // }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="scroll-set-body">
          <Row className="">
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="pr-2">
                <CapGovTable />
              </Col>
            </Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className=" pl-2">
              <CapGovPushPullTable />
            </Col>
          </Row>

          <Row>
            <CapGovOrganization />
          </Row>

          <Row className="v4">
            <CapGovChart />
          </Row>
          <Row className="row-hide">
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

export default connect(mapState, { getUserImpersonationDetails })(CapGov);
