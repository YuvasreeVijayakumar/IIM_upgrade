import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Col, Card, DatePicker, Button, TreeSelect } from 'antd';
import {
  ReportFilterToggle,
  getBoCriticalityReportApproverList,
  getBoCriticalityReportMinMaxDate
} from '../../actions';
import moment from 'moment-timezone';

const { TreeNode } = TreeSelect;
const { RangePicker } = DatePicker;

class ReportFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      SubmittedBy: 'ALL',
      MinDate: [],
      maxDate: [],
      getBoCriticalityReportMinMaxDateData: []
    };
  }
  componentDidMount() {
    this.props.getBoCriticalityReportApproverList();
    this.props.getBoCriticalityReportMinMaxDate();
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getBoCriticalityReportMinMaxDateData !=
      nextProps.getBoCriticalityReportMinMaxDateData
    ) {
      if (nextProps.getBoCriticalityReportMinMaxDateData != 0) {
        let a = nextProps.getBoCriticalityReportMinMaxDateData[0];

        this.setState({
          MinDate: moment(a.MIN_DATE).format('MM-DD-YYYY'),
          maxDate: moment(a.MAX_DATE).format('MM-DD-YYYY')
        });
      }
    }
    if (
      this.props.getBoCriticalityReportApproverListData !=
      nextProps.getBoCriticalityReportApproverListData
    ) {
      if (nextProps.getBoCriticalityReportApproverListData != 0) {
        this.setState({
          getBoCriticalityReportApproverListData: nextProps.getBoCriticalityReportApproverListData
        });
      } else {
        this.setState({
          getBoCriticalityReportApproverListData: []
        });
      }
    }
  }
  handleSubmittedbyChange(e) {
    this.setState({
      SubmittedBy: e
    });
  }
  disabledDate(current) {
    let start = this.state.MinDate;
    let end = this.state.maxDate;
    if (current < moment(start)) {
      return true;
    } else if (current > moment(end)) {
      return true;
    } else {
      return false;
    }
  }
  datechange(dates, dateStrings) {
    this.setState({
      MinDate: dateStrings[0],
      maxDate: dateStrings[1]
    });
  }

  render() {
    return (
      <>
        {this.props.ReportFilterToggleData ? (
          <Card
            title={
              <span className="report-filter-text">
                {' '}
                <i className="fal fa-filter ml-2 mr-1 mt-2" /> Customise Report
              </span>
            }>
            <Row gutter={24} className="mt-3 mb-3">
              <Col span={2}></Col>
              <Col span={6}>
                <RangePicker
                  allowClear={false}
                  size="small"
                  className="range-style"
                  disabledDate={this.disabledDate.bind(this)}
                  onChange={this.datechange.bind(this)}
                  value={[moment(this.state.MinDate), moment(this.state.maxDate)]}
                  placeholder={null}
                  format="MM-DD-YYYY"
                />
              </Col>
              <Col span={2}></Col>

              <Col span={6}>
                <TreeSelect
                  showSearch
                  style={{ width: '100%' }}
                  value={this.state.SubmittedBy}
                  dropdownStyle={{ maxHeight: 200 }}
                  placeholder="Please Choose Approver"
                  allowClear={false}
                  treeDefaultExpandAll
                  getPopupContainer={(trigger) => trigger.parentNode}
                  onChange={this.handleSubmittedbyChange.bind(this)}
                  className="text-select-form">
                  {this.state.getBoCriticalityReportApproverListData.map((val1, ind1) => (
                    <TreeNode value={val1.APPROVER} title={val1.APPROVER} key={ind1} />
                  ))}
                </TreeSelect>{' '}
              </Col>
              <Col span={2} className="text-center">
                <Button>Apply Filter</Button>
              </Col>
            </Row>
          </Card>
        ) : (
          ''
        )}
      </>
    );
  }
}

function mapState(state) {
  return {
    ReportFilterToggleData: state.ReportFilterToggles,
    getBoCriticalityReportApproverListData: state.getBoCriticalityReportApproverList,
    getBoCriticalityReportMinMaxDateData: state.getBoCriticalityReportMinMaxDate
  };
}

export default connect(mapState, {
  ReportFilterToggle,
  getBoCriticalityReportApproverList,
  getBoCriticalityReportMinMaxDate
})(ReportFilter);
