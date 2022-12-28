import React from 'react';
import { connect } from 'react-redux';

// eslint-disable-next-line no-unused-vars
import { Row, Col, Card, Button, Popover } from 'antd';
import { ReportFilterToggle } from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import PropagateLoader from 'react-spinners/PropagateLoader';
import { UploadReport } from './UploadReport';
import { getBoCriticalityReportApproverReview } from '../../actions';
import ReactDragListView from 'react-drag-listview';
import moment from 'moment-timezone';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const { SearchBar } = Search;

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
class ReportTable extends React.Component {
  constructor(props) {
    super(props);
    this.dateformat = this.dateformat.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.state = {
      getBoCriticalityReportApproverReviewData: [],
      ReportTableColumn: [
        {
          dataField: 'PO',
          text: 'PO',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'POLINE',
          text: 'PoLine',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MPN',
          text: 'MPN',
          sort: true,
          headerStyle: { width: 130 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'QTY',
          text: 'Quantity ',
          sort: true,
          headerStyle: { width: 110 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'EstimatedDeliveryDate',
          text: 'Estimated Delivery Date',
          sort: true,
          headerStyle: { width: 190 },
          formatter: this.dateformat,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LastUpdatedDate',
          text: 'Last Updated Date',
          sort: true,
          formatter: this.dateformat,
          headerStyle: { width: 160 },
          align: 'left',
          headerAlign: 'left'
        },

        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By',
          sort: true,
          headerStyle: { width: 250 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          headerStyle: { width: 250 },
          align: 'left',
          headerAlign: 'left'
        }
        // {
        //   dataField: 'FILEPATH',
        //   text: 'File Path',
        //   sort: true,
        //   headerStyle: { width: 350 },
        //   align: 'left',
        //   headerAlign: 'left'
        // }
      ],
      isDataFetched: false,
      newResultLength: ''
    };
  }
  componentDidMount() {}
  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getBoCriticalityReportApproverReviewData !=
      nextProps.getBoCriticalityReportApproverReviewData
    ) {
      if (nextProps.getBoCriticalityReportApproverReviewData != 0) {
        this.setState({
          getBoCriticalityReportApproverReviewData:
            nextProps.getBoCriticalityReportApproverReviewData,
          isDataFetched: false,
          newResultLength: ''
        });
      } else {
        this.setState({
          getBoCriticalityReportApproverReviewData: [],
          isDataFetched: true
        });
      }
    }
  }
  dateformat(cell) {
    if (cell == '-') {
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
    let csvData = this.state.getBoCriticalityReportApproverReviewData;
    let fileName = 'backorder criticality report';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  onDragEndNewleadtime(fromIndex, toIndex) {
    const columnsCopy = this.state.ReportTableColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ ReportTableColumn: columnsCopy });
  }

  render() {
    return (
      <>
        <ToolkitProvider
          keyField="MATERIAl"
          data={this.state.getBoCriticalityReportApproverReviewData}
          columns={this.state.ReportTableColumn}
          search={{
            afterSearch: (newResult) => {
              if (!newResult.length) {
                if (this.state.getBoCriticalityReportApproverReviewData != '') {
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
                <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right float-right">
                  {/* <span className="mr-3 ">
                      <Popover
                        placement="left"
                        className="modal-tool-tip"
                        content={<span>Customise</span>}>
                        <i
                          className="fal fa-filter"
                          onClick={() =>
                            this.props.ReportFilterToggle(!this.props.ReportFilterToggleData)
                          }
                        />
                      </Popover>
                    </span> */}
                  <UploadReport />
                  {this.state.getBoCriticalityReportApproverReviewData != '' ? (
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
              <ReactDragListView.DragColumn
                onDragEnd={this.onDragEndNewleadtime.bind(this)}
                nodeSelector="th">
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory()}
                  noDataIndication={() => this.tblLoader()}
                  filter={filterFactory()}
                />
              </ReactDragListView.DragColumn>
            </div>
          )}
        </ToolkitProvider>
      </>
    );
  }
}
function mapState(state) {
  return {
    ReportFilterToggleData: state.ReportFilterToggles,
    getBoCriticalityReportApproverReviewData: state.getBoCriticalityReportApproverReview
  };
}
export default connect(mapState, { ReportFilterToggle, getBoCriticalityReportApproverReview })(
  ReportTable
);
