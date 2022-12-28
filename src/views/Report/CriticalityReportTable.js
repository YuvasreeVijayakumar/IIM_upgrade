import React, { Component } from 'react';
// eslint-disable-next-line no-unused-vars
import { Card, Row, Col, Button, DatePicker, Space } from 'antd';
import { connect } from 'react-redux';
import { getBoCriticalityFinalReport, getBoCriticalityReportMinMaxDate } from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { SearchBar } = Search;
const { RangePicker } = DatePicker;
class CriticalityReportTable extends Component {
  constructor(props) {
    super(props);
    this.dateformat = this.dateformat.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.datechange = this.datechange.bind(this);
    this.handleResetDate = this.handleResetDate.bind(this);
    this.state = {
      isDataFetched: false,
      newResultLength: '',
      getBoCriticalityFinalReportData: [],
      MinDate: [],
      maxDate: [],
      MinDate1: [],
      maxDate1: [],
      count: 0,
      ReportTableColumn: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Warehouse',
          text: 'Warehouse',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MPN',
          text: 'MPN',
          sort: true,
          headerStyle: { width: 150 },
          align: 'left',
          headerAlign: 'left'
        },

        {
          dataField: 'MANUF',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 180 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'ON_HAND',
          text: 'On Hand',
          sort: true,
          headerStyle: { width: 150 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'BO_QTY',
          text: 'BackOrder Qty',
          sort: true,
          headerStyle: { width: 140 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'OPEN_QTY',
          text: 'Open Qty',
          sort: true,
          headerStyle: { width: 120 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'Avg_Monthly_Demand_12',
          text: 'Avg Monthly Demand 12',
          sort: true,
          headerStyle: { width: 200 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'Avg_Monthly_Demand_3',
          text: 'Avg Monthly Demand 3',
          sort: true,
          headerStyle: { width: 180 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'Backorder_Recovery_Date',
          text: 'Backorder Recovery Date',
          sort: true,
          headerStyle: { width: 220 },
          align: 'left',
          headerAlign: 'left',
          formatter: this.dateformat
        },
        {
          dataField: 'Next_shipment_qty',
          text: 'Next Shipment Qty',
          sort: true,
          headerStyle: { width: 170 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Next_shipment_date',
          text: 'Next Shipment Date',
          sort: true,
          headerStyle: { width: 170 },
          align: 'left',
          headerAlign: 'left',
          formatter: this.dateformat
        },
        {
          dataField: 'Report_date',
          text: 'Report Date',
          sort: true,
          formatter: this.dateformat,
          headerStyle: { width: 160 },
          align: 'left',
          headerAlign: 'left'
        }
      ]
    };
  }
  componentDidMount() {
    // this.props.getBoCriticalityFinalReport('all', 'all');
    // this.props.getBoCriticalityReportMinMaxDate();
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
          maxDate: moment(a.MAX_DATE).format('MM-DD-YYYY'),
          MinDate1: moment(a.MIN_DATE).format('MM-DD-YYYY'),
          maxDate1: moment(a.MAX_DATE).format('MM-DD-YYYY')
        });
      }
    }
    if (this.props.getBoCriticalityFinalReportData != nextProps.getBoCriticalityFinalReportData) {
      if (nextProps.getBoCriticalityFinalReportData != 0) {
        this.setState({
          getBoCriticalityFinalReportData: nextProps.getBoCriticalityFinalReportData,
          count: 0,
          isDataFetched: false,
          newResultLength: ''
        });
      } else {
        this.setState({
          getBoCriticalityFinalReportData: [],
          isDataFetched: true,
          count: 0
        });
      }
    }
  }
  dateformat(cell) {
    if (cell == null) {
      return <span>-</span>;
    } else {
      let value = moment(cell).format('MM-DD-YYYY');
      return <span>{value}</span>;
    }
  }
  tblLoader() {
    if (this.state.isDataFetched || this.state.newResultLength === 0) {
      return (
        <div className="tbl-no-data-found">
          <div>
            <h5>No data available for this criteria</h5>
          </div>
        </div>
      );
    } else {
      return (
        <div className="tbl-loading">
          <h6>Loading</h6>
          <PropagateLoader color={'#fff'} />
        </div>
      );
    }
  }
  exportToCSV() {
    let csvData = this.state.getBoCriticalityFinalReportData;
    let fileName = 'backorder criticality final report';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  // onDragEndNewleadtime(fromIndex, toIndex) {
  //   const columnsCopy = this.state.ReportTableColumn.slice();
  //   const item = columnsCopy.splice(fromIndex, 1)[0];
  //   columnsCopy.splice(toIndex, 0, item);
  //   this.setState({ ReportTableColumn: columnsCopy });
  // }
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
    if (this.state.count != 0) {
      this.setState({
        maxDate1: dateStrings[1],
        getBoCriticalityFinalReportData: [],
        newResultLength: '',
        isDataFetched: false
      });
      this.props.getBoCriticalityFinalReport(dateStrings[0], dateStrings[1]);
    } else {
      this.setState({
        count: 1,
        MinDate1: dateStrings[0]
      });
    }
  }
  handleResetDate() {
    this.setState({
      MinDate: [],
      maxDate: [],
      MinDate1: [],
      maxDate1: [],
      getBoCriticalityFinalReportData: [],
      newResultLength: '',
      isDataFetched: false
    });
    this.props.getBoCriticalityReportMinMaxDate();
    this.props.getBoCriticalityFinalReport('all', 'all');
  }

  render() {
    return (
      <>
        <ToolkitProvider
          keyField="MATERIAl"
          data={this.state.getBoCriticalityFinalReportData}
          columns={this.state.ReportTableColumn}
          search={{
            afterSearch: (newResult) => {
              if (!newResult.length) {
                if (this.state.getBoCriticalityFinalReportData != '') {
                  this.setState({
                    newResultLength: newResult.length
                  });
                } else {
                  this.setState({
                    newResultLength: ''
                  });
                }
              }
            }
          }}>
          {(props) => (
            <div>
              <Row>
                <Col xs={8} sm={8} md={8} lg={8} xl={8}></Col>
                <Col xs={16} sm={16} md={16} lg={16} xl={16} className="text-right float-right">
                  <span>
                    <span className="golden-text mt-1 mr-2 tblHeader">Date Range : </span>

                    <Space direction="vertical" size={12} className="mr-3">
                      <RangePicker
                        bordered={false}
                        allowClear={false}
                        size="small"
                        className="range-style"
                        disabledDate={this.disabledDate.bind(this)}
                        onCalendarChange={this.datechange}
                        value={[moment(this.state.MinDate1), moment(this.state.maxDate1)]}
                        placeholder={null}
                        format="MM-DD-YYYY"
                        renderExtraFooter={() => (
                          <Button
                            className="float-right reset-btn mb-2 mt-2"
                            onClick={this.handleResetDate}>
                            Reset
                          </Button>
                        )}
                      />
                    </Space>
                  </span>
                  {this.state.getBoCriticalityFinalReportData != '' ? (
                    <Button size="sm" className="export-Btn mr-2" onClick={this.exportToCSV}>
                      <i className="fas fa-file-excel mr-2" />{' '}
                      <span className="text-white">Excel</span>
                    </Button>
                  ) : (
                    <Button size="sm" className="export-Btn mr-2" disabled>
                      <i className="fas fa-file-excel mr-2" />{' '}
                      <span className="text-white">Excel</span>
                    </Button>
                  )}

                  <SearchBar {...props.searchProps} />
                </Col>
              </Row>
              {/* <ReactDragListView.DragColumn
                  onDragEnd={this.onDragEndNewleadtime.bind(this)}
                  nodeSelector="th"> */}
              <BootstrapTable
                {...props.baseProps}
                pagination={paginationFactory()}
                noDataIndication={() => this.tblLoader()}
                filter={filterFactory()}
              />
              {/* </ReactDragListView.DragColumn> */}
            </div>
          )}
        </ToolkitProvider>
      </>
    );
  }
}

function mapState(state) {
  return {
    getBoCriticalityFinalReportData: state.getBoCriticalityFinalReport,
    getBoCriticalityReportMinMaxDateData: state.getBoCriticalityReportMinMaxDate
  };
}

export default connect(mapState, { getBoCriticalityFinalReport, getBoCriticalityReportMinMaxDate })(
  CriticalityReportTable
);
