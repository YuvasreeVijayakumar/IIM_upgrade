import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Layout, Col, Card, Tabs, Modal, Popover } from 'antd';
import {
  getBoCriticalityReportApproverReview,
  getBoCriticalityReportMinMaxDate,
  getBoCriticalityFinalReport,
  getBoCriticalityReportInvalid,
  getUserImpersonationDetails
} from '../../actions';
import ReportTable from './ReportTable';
import ReportFilter from './ReportFilter';
import CriticalityReportTable from './CriticalityReportTable';
// eslint-disable-next-line no-unused-vars
import InvalidReportData from './InvalidReportData';
const { TabPane } = Tabs;

const { Footer } = Layout;
class Report extends Component {
  constructor(props) {
    super(props);
    this.infoDD = this.infoDD.bind(this);
    this.TabChange = this.TabChange.bind(this);
    this.Imploader = this.Imploader.bind(this);

    this.state = {
      activeKey: '1',
      InfoModal: false,
      getUserImpersonationDetailsData: []
    };
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.Imploader();
        this.setState({
          getUserImpersonationDetailsData: nextProps.getUserImpersonationDetailsData
        });
      } else {
        this.setState({
          getUserImpersonationDetailsData: []
        });
      }
    }
  }
  TabChange(key) {
    if (key == '1') {
      this.setState({
        activeKey: key
      });
      this.props.getBoCriticalityReportApproverReview();
    } else if (key == '2') {
      this.setState({
        activeKey: key
      });
      this.props.getBoCriticalityReportMinMaxDate(),
        this.props.getBoCriticalityFinalReport('all', 'all');
    } else {
      this.setState({
        activeKey: key
      });
      this.props.getBoCriticalityReportInvalid();
    }
  }
  infoDD() {
    if (this.state.InfoModal) {
      this.setState({
        InfoModal: false
      });
    } else {
      this.setState({
        InfoModal: true
      });
    }
  }
  Imploader() {
    this.setState({
      activeKey: '1'
    });
    this.props.getBoCriticalityReportApproverReview();
  }

  render() {
    return (
      <div className="animated fadeIn">
        <div className="scroll-set-body">
          <div style={{ minHeight: '85vh' }}>
            {' '}
            <Row className="pl-2 pr-2">
              <Col span={24}>
                <Card className="report-card">
                  <div className="Head-title">Inventory Management Report</div>
                </Card>
              </Col>
            </Row>
            <Row className="v4 mt-3">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <ReportFilter />
              </Col>
            </Row>
            <Row className="pl-2 pr-2">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                {' '}
                <Card
                  title={
                    <Row className="mt-2 mb-2">
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <span>
                          <i className="far fa-address-card"></i> &nbsp;&nbsp;BackOrder Criticality
                          Report
                          <Popover placement="right" content={<span>Info</span>}>
                            <i
                              className="fas fa-info-circle info-logo-widget ml-2"
                              onClick={this.infoDD}
                            />
                          </Popover>
                          &nbsp;&nbsp;
                        </span>
                      </Col>
                    </Row>
                  }>
                  {' '}
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <Tabs onChange={this.TabChange} activeKey={this.state.activeKey}>
                      <TabPane tab="Vendor Report" key="1">
                        <ReportTable />
                      </TabPane>

                      <TabPane tab="Criticality Report" key="2">
                        <CriticalityReportTable />
                      </TabPane>
                      <TabPane tab="Invalid Data" key="3">
                        <InvalidReportData />
                      </TabPane>
                    </Tabs>
                  </Col>
                </Card>
              </Col>
            </Row>
          </div>
          <Modal
            style={{ top: 60 }}
            footer={null}
            title={<div>BackOrder Criticality Report - Description</div>}
            className="Intervaltimeline"
            visible={this.state.InfoModal}
            onCancel={this.infoDD}>
            <div>
              <p>
                <strong>
                  Expected shipments and expected healthy date of back order materials according to
                  vendor updates.
                </strong>
              </p>
            </div>
          </Modal>

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
    getUserImpersonationDetailsData: state.getUserImpersonationDetails
  };
}

export default connect(mapState, {
  getBoCriticalityReportApproverReview,
  getBoCriticalityReportMinMaxDate,
  getBoCriticalityFinalReport,
  getBoCriticalityReportInvalid,
  getUserImpersonationDetails
})(Report);
