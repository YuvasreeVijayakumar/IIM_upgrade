import React, { Component } from 'react';
import { connect } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { Card, Row, Col, Popover, Button, message } from 'antd';
import axios from 'axios';
import { ROOT_URL } from '../../actions';
import { getBoCriticalityReportInvalid } from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import PropagateLoader from 'react-spinners/PropagateLoader';
// import ReactDragListView from 'react-drag-listview';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment-timezone';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const pop_content = <span>Fields Are Editable</span>;

//Filter variables
var POFilter;
var filterPOLine;
var filterMPN;
var FilterQTY;
var FilterESTDate;
var FilterLastDate;
var FilterSubmit;
var FilterComments;

class InvalidReportData extends Component {
  constructor(props) {
    super(props);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.bstable = React.createRef();

    this.state = {
      DeleteLoading: false,
      UpdateLoading: false,
      isDataFetched: false,
      newResultLength: '',
      InvalidToValidData: [],
      InvalidToValidDataSelected: [],
      InvalidDataReportSelect: [],
      ReportTableColumn: [
        {
          dataField: 'PO',
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                PO <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left',

          filter: textFilter({
            getFilter: (filter) => {
              POFilter = filter;
            },
            placeholder: 'Enter Po'
          }),
          validator: (newValue) => {
            if (isNaN(newValue)) {
              return {
                valid: false,
                message: 'Enter a valid unit'
              };
            }
          }
        },
        {
          dataField: 'POLINE',
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Po Line <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left',
          filter: textFilter({
            getFilter: (filter) => {
              filterPOLine = filter;
            },
            placeholder: 'Enter PO Line'
          }),
          validator: (newValue) => {
            if (isNaN(newValue)) {
              return {
                valid: false,
                message: 'Enter a valid unit'
              };
            }
          }
        },
        {
          dataField: 'MPN',
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                MPN <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,
          headerStyle: { width: 300 },
          align: 'centter',
          headerAlign: 'center',
          filter: textFilter({
            getFilter: (filter) => {
              filterMPN = filter;
            },
            placeholder: 'Enter the MPN'
          })
        },
        {
          dataField: 'QTY',
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Quantity <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,
          headerStyle: { width: 125 },
          align: 'right',
          headerAlign: 'right',
          filter: textFilter({
            getFilter: (filter) => {
              FilterQTY = filter;
            },
            placeholder: 'Enter the Quantity'
          }),
          validator: (newValue) => {
            if (isNaN(newValue)) {
              return {
                valid: false,
                message: 'Enter a valid unit'
              };
            }
          }
        },
        {
          dataField: 'EST_DELIVERY_DATE',
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Estimated Delivery Date <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,
          headerStyle: { width: 220 },
          //formatter: this.dateformat,
          align: 'right',
          headerAlign: 'right',
          sortFunc: this.sortFuncDate,
          filter: dateFilter({
            getFilter: (filter) => {
              FilterESTDate = filter;
            },
            placeholder: 'Enter the Estimated Delivery Date'
          }),
          formatter: (cell) => {
            let dateObj = cell;

            if (dateObj == null) return;
            if (typeof cell !== 'object') {
              dateObj = new Date(cell);
            }
            return `${('0' + dateObj?.getUTCDate()).slice(-2)}/${(
              '0' +
              (dateObj?.getUTCMonth() + 1)
            ).slice(-2)}/${dateObj?.getUTCFullYear()}`;
          },
          editor: {
            type: Type.DATE
          }
        },
        {
          dataField: 'LAST_UPDATED_DATE',
          text: 'Last Updated Date',
          sort: true,
          editable: false,
          //formatter: this.dateformat,
          headerStyle: { width: 190 },
          align: 'right',
          headerAlign: 'right',
          sortFunc: this.sortFuncDate,
          filter: dateFilter({
            getFilter: (filter) => {
              FilterLastDate = filter;
            }
          }),
          formatter: (cell) => {
            let lastDateObj = cell;
            if (typeof cell !== 'object') {
              lastDateObj = new Date(cell);
            }
            return `${('0' + lastDateObj.getUTCDate()).slice(-2)}/${(
              '0' +
              (lastDateObj.getUTCMonth() + 1)
            ).slice(-2)}/${lastDateObj.getUTCFullYear()}`;
          },
          editor: {
            type: Type.DATE
          }
        },

        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By',
          sort: true,
          headerStyle: { width: 300 },
          editable: false,
          align: 'right',
          headerAlign: 'right',
          filter: textFilter({
            getFilter: (filter) => {
              FilterSubmit = filter;
            }
          })
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          headerStyle: { width: 250 },
          editable: false,
          align: 'right',
          headerAlign: 'right',
          filter: textFilter({
            getFilter: (filter) => {
              FilterComments = filter;
            }
          })
        }
      ],
      getBoCriticalityReportInvalidData: []
    };
  }
  componentDidMount() {
    // this.props.getBoCriticalityReportInvalid();
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getBoCriticalityReportInvalidData != nextProps.getBoCriticalityReportInvalidData
    ) {
      if (nextProps.getBoCriticalityReportInvalidData != 0) {
        this.setState({
          getBoCriticalityReportInvalidData: nextProps.getBoCriticalityReportInvalidData,
          isDataFetched: true
        });
      } else {
        this.setState({
          getBoCriticalityReportInvalidData: [],
          isDataFetched: true
        });
      }
    }
  }
  PostBoCriticalityReportUpdateInvalid(v1, v2, v3) {
    if (v3 === 'N') {
      this.setState({
        DeleteLoading: true
      });
    } else {
      this.setState({
        UpdateLoading: true
      });
    }
    axios
      .post(`${ROOT_URL}PostBoCriticalityReportUpdateInvalid?SubmittedBy=${v2}&IsUpdate=${v3}`, {
        ID: v1
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            InvalidToValidDataSelected: [],
            getBoCriticalityReportInvalidData: [],
            InvalidToValidData: [],
            isDataFetched: false,
            newResultLength: '',
            DeleteLoading: false,
            UpdateLoading: false
          });
          this.props.getBoCriticalityReportInvalid();
        }
      })
      .catch(() => {
        message.error('Fail To Upload');
      });
  }
  dateformat(cell) {
    if (cell == '-') {
      return <span>-</span>;
    } else {
      let value = moment(cell).format('MM-DD-YYYY');
      return <span>{value}</span>;
    }
  }
  sortFuncDate(a, b, order) {
    if (order === 'asc') {
      return moment(a) - moment(b);
    } else if (order === 'desc') {
      return moment(b) - moment(a);
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
    var dum = this.state.getBoCriticalityReportInvalidData.map((obj) => {
      return {
        PO: obj.PO,
        POLINE: obj.POLINE,
        MPN: obj.MPN,
        QTY: obj.QTY,
        EST_DELIVERY_DATE: obj.EST_DELIVERY_DATE,
        LAST_UPDATED_DATE: obj.LAST_UPDATED_DATE,
        FAULTY_FLAG_LAST_UPDATE: obj.FAULTY_FLAG_LAST_UPDATE,
        SUBMITTED_BY: obj.SUBMITTED_BY,
        COMMENTS: obj.COMMENTS
      };
    });
    let csvData = dum;
    let fileName = 'backorder criticality report Invalid Data';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  onRowSelectInvalid(row, isSelected) {
    if (isSelected) {
      const { InvalidToValidDataSelected } = this.state;
      let data = row;

      this.setState(() => ({
        InvalidToValidDataSelected: [...InvalidToValidDataSelected, data]
      }));
    } else {
      let value = row.ID;

      let res = this.state.InvalidToValidData.filter((d) => d.ID !== value);
      let ID_res = this.state.InvalidToValidDataSelected.filter((d) => d.ID !== value);

      this.setState((prevState) => ({
        getBoCriticalityReportInvalidData: prevState.getBoCriticalityReportInvalidData.map((el) =>
          el.ID === value
            ? {
                ...el,
                PO: el.PoTemp,
                PO_LINE: el.PoLineTemp,
                MPN: el.MPNTemp,
                QTY: el.QtyTemp,
                EST_DELIVERY_DATE: el.Est_Delivery_Date_Temp
              }
            : el
        ),
        InvalidToValidData: res,
        InvalidToValidDataSelected: ID_res
      }));
    }
  }
  onRowSelectAllInvalid(isSelect) {
    if (isSelect) {
      const { getBoCriticalityReportInvalidData } = this.state;
      let data = getBoCriticalityReportInvalidData;
      this.setState({
        InvalidToValidDataSelected: data
      });
    } else {
      this.setState({
        InvalidToValidDataSelected: [],
        InvalidToValidData: []
      });
    }
  }
  HandleClearTblFilter() {
    POFilter(''),
      filterPOLine(''),
      filterMPN(''),
      FilterQTY(''),
      FilterESTDate(''),
      FilterLastDate(''),
      FilterSubmit(''),
      FilterComments('');
  }
  beforeSaveCell(oldValue, newValue, row) {
    const { InvalidToValidData } = this.state;

    if (InvalidToValidData != '') {
      let vall = InvalidToValidData.filter((d) => d.ID != row.ID);
      vall.push(row);
      this.setState({
        InvalidToValidData: vall
      });
    } else {
      this.setState({
        InvalidToValidData: [row]
      });
    }
  }
  ResetSelectedState() {
    this.setState({
      InvalidToValidData: [],
      InvalidToValidDataSelected: []
    });
  }
  render() {
    const selectRowInvalidReport = {
      mode: 'checkbox',
      clickToEdit: true,
      selected: this.state.InvalidToValidDataSelected.map((d) => d.ID),
      classes: 'selection-row',
      onSelect: this.onRowSelectInvalid.bind(this),
      onSelectAll: this.onRowSelectAllInvalid.bind(this)
    };
    return (
      <>
        {' '}
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            {/* <span className="tblHeader"> */}
            {/* <i className="far fa-address-card"></i>Invalid Data{' '}
              <i className="fas fa-info-circle info-logo-widget mr-2" />
              &nbsp;&nbsp;
            </span> */}
          </Col>
          <Col span={12}>
            {this.state.getBoCriticalityReportInvalidData != '' ? (
              <Button className="export-Btn ml-2 mr-2 float-right" onClick={this.exportToCSV}>
                <i className="fas fa-file-excel " />{' '}
              </Button>
            ) : (
              <Button disabled className="export-Btn ml-2 mr-2 float-right">
                <i className="fas fa-file-excel " />{' '}
              </Button>
            )}

            <Button onClick={this.HandleClearTblFilter} className="ClearBtn float-right mb-2 mr-3">
              Clear Filter
            </Button>
          </Col>
        </Row>
        <div className="table-color InvalidRequestOverWriteTable">
          <BootstrapTable
            ref={this.bstable}
            keyField="ID"
            data={this.state.getBoCriticalityReportInvalidData}
            columns={this.state.ReportTableColumn}
            selectRow={selectRowInvalidReport}
            filterPosition="top"
            cellEdit={cellEditFactory({
              mode: 'click',
              blurToSave: true,
              autoSelectText: true,
              onStartEdit: (row, column, rowIndex, columnIndex) => {
                document.getElementsByTagName('tr').className += 'selection-row';
                this.setState({
                  columnIndex: columnIndex
                });
              },
              beforeSaveCell: this.beforeSaveCell.bind(this)
            })}
            pagination={paginationFactory()}
            noDataIndication={() => this.tblLoader()}
            filter={filterFactory()}
          />
          <Row>
            <Col span={24} className="mb-2 mt-2">
              <div className="float-right">
                {this.state.InvalidToValidDataSelected != '' ? (
                  <Button
                    loading={this.state.DeleteLoading}
                    id="submitt"
                    key="submit"
                    className="tbl-DeleteBtn btn-css mr-2"
                    onClick={() =>
                      this.PostBoCriticalityReportUpdateInvalid(
                        this.state.InvalidToValidDataSelected,
                        sessionStorage.getItem('loggedEmailId'),
                        'N'
                      )
                    }>
                    Delete
                  </Button>
                ) : (
                  <Button id="submitt" key="submit" className="btn-css mr-2" disabled>
                    Delete
                  </Button>
                )}{' '}
                <Button
                  className="btn-css mr-2 tbl-cancel"
                  type="primary"
                  key="back"
                  onClick={this.ResetSelectedState}>
                  Cancel
                </Button>
                {this.state.InvalidToValidData != '' ? (
                  <Button
                    loading={this.state.UpdateLoading}
                    id="submitt"
                    key="submit"
                    className="tbl-Update btn-css mr-2"
                    onClick={() =>
                      this.PostBoCriticalityReportUpdateInvalid(
                        this.state.InvalidToValidData,
                        sessionStorage.getItem('loggedEmailId'),
                        'Y'
                      )
                    }>
                    Update
                  </Button>
                ) : (
                  <Button id="submitt" key="submit" className="btn-css mr-2" disabled>
                    Update
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

function mapState(state) {
  return { getBoCriticalityReportInvalidData: state.getBoCriticalityReportInvalid };
}

export default connect(mapState, { getBoCriticalityReportInvalid })(InvalidReportData);
