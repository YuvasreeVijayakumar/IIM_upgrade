import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import { Row, Col, Card, Modal, Button, Tooltip, Popover } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
import DrillDown from './EOQDrillDown';

import {
  getEOQTbl,
  getEOQHeaderDD,
  getPredictedChart,
  getOrdersinPipelineDD,
  getUserImpersonationDetails,
  getReasonCodeList,
  EoqTblLoader,
  getPredictedOrderQuantityColumns
} from '../../actions';
import ReactDragListView from 'react-drag-listview';
import { TableColSettings } from '../Draggable';

// import arrayMove from "array-move";

const { SearchBar } = Search;

class EOQTable extends React.Component {
  constructor(props) {
    super(props);

    this.imploader = this.imploader.bind(this);
    this.costformat = this.costformat.bind(this);
    this.dateformat = this.dateformat.bind(this);
    this.materialDD = this.materialDD.bind(this);
    this.ordersPipelineDD = this.ordersPipelineDD.bind(this);
    this.onclickDD = this.onclickDD.bind(this);
    this.sortFunc = this.sortFunc.bind(this);
    this.infoDD = this.infoDD.bind(this);
    this.onclickOrdersDD = this.onclickOrdersDD.bind(this);

    this.exportToCSV = this.exportToCSV.bind(this);

    this.exportToCSVOrdersinpipeline = this.exportToCSVOrdersinpipeline.bind(this);

    this.state = {
      usercuid: 'ALL',
      ForecastIsApprover: 'N',
      tblDataDummy: [],
      EOQ_Columns: [],
      mockData: [],
      defaultList: [],
      targetKeys: [],
      isModalVisible: false,

      getUserImpersonationDetailsData: [],
      getPredictedOrderQuantityColumnsData: [],
      openModal: false,
      ordersDDModal: false,
      EOQDDHeaderData: [],
      parsedBlockedDeleted: 'ALL',
      parsedFilterSettingsLGORT: 'ALL',

      newResultLength: 0,
      tblData: [],
      ordersDDtblData: [],
      tableColumn1: [{ dataField: '', text: '' }],

      ordersDDColumn: [
        {
          dataField: 'po',
          text: 'PO',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },

        {
          dataField: 'poline',
          text: 'PO Line',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'vendor',
          text: 'Vendor',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'vendorname',
          text: 'Vendor Name',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'type',
          text: 'Type',
          sort: true,
          headerStyle: { width: 95 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'material',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'manuf',
          text: 'Manufacture',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'mpn',
          text: 'MPN',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'plant',
          text: 'Plant',
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left',
          sort: true
        },
        {
          dataField: 'pocreated',
          text: 'PO Created',
          sort: true,
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          headerStyle: { width: 125 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'poacknowledged',
          text: 'PO Acknowledged',
          sort: true,
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          headerStyle: { width: 150 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'poqty',
          text: 'PO Qty',
          sort: true,
          headerStyle: { width: 95 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'receiptqty',
          text: 'Receipt Qty',
          sort: true,
          headerStyle: { width: 125 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'openqty',
          text: 'Open Qty',
          sort: true,
          headerStyle: { width: 95 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'poras',
          text: 'Requested Shipping Date',
          sort: true,
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          headerStyle: { width: 200 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Line_Value',
          text: 'Line Value',

          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right',
          sort: true,
          headerStyle: { width: 120 }
        },
        {
          dataField: 'Open_value',
          text: 'Open value',

          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right',
          sort: true,
          headerStyle: { width: 120 }
        }
      ],

      series: [],
      options: {},
      predictedChartData: [],
      MonthlyChartData: [],
      ChartData: [],
      isDataFetched: false,
      isDataFetchedOne: false,
      InfoModal: false,
      Loader: true,
      monthlyView: false,
      weeklyView: true,
      defaultActiveKey: '1'
      // eslint-disable-next-line no-dupe-keys
    };
  }
  componentDidMount() {
    this.props.getReasonCodeList();
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getPredictedOrderQuantityColumnsData !=
      nextProps.getPredictedOrderQuantityColumnsData
    ) {
      if (nextProps.getPredictedOrderQuantityColumnsData != 0) {
        //default column seperation
        var column_id = sessionStorage.getItem('eoqcol');

        const final = nextProps.getPredictedOrderQuantityColumnsData;

        if (column_id.length > 0) {
          var arr = final.filter(function (item) {
            return column_id.indexOf(item.label) > -1;
          });
          this.setState({
            defaultList: arr
          });
        }

        //default column seperation end
        this.setState({
          getPredictedOrderQuantityColumnsData: nextProps.getPredictedOrderQuantityColumnsData,
          mockData: nextProps.getPredictedOrderQuantityColumnsData
        });
      }
    }
    if (this.props.getReasonCodeListData != nextProps.getReasonCodeListData) {
      if (nextProps.getReasonCodeListData != 0) {
        this.setState({
          getReasonCodeListData: nextProps.getReasonCodeListData,
          ReasonCodeDropDownValue: nextProps.getReasonCodeListData.map((dat) => dat.VALUE)
        });
      }
    }
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.props.getPredictedOrderQuantityColumns();
        this.imploader();
        const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

        this.setState({
          ForecastIsApprover:
            nextProps.getUserImpersonationDetailsData[0].IsForecastOverrideApprover,

          parsedBlockedDeleted: JSON.parse(filterSettingsOrg)[0].BlockedDeleted,
          parsedFilterSettingsLGORT: JSON.parse(filterSettingsOrg)[0].LGORT
        });
        sessionStorage.setItem('org', JSON.parse(filterSettingsOrg)[0].Organization);
        sessionStorage.setItem('lgort', JSON.parse(filterSettingsOrg)[0].LGORT);
        sessionStorage.setItem('colorcodedmatnr', JSON.parse(filterSettingsOrg)[0].BlockedDeleted);
        let EOQ_Columns = nextProps.getUserImpersonationDetailsData[0].EOQ_Columns;

        this.setState({
          EOQ_Columns: EOQ_Columns,
          usercuid:
            nextProps.getUserImpersonationDetailsData[0].loggedcuid == null
              ? 'all'
              : nextProps.getUserImpersonationDetailsData[0].loggedcuid
        });
      }
    }
    if (this.props.tblData != nextProps.tblData) {
      if (nextProps.tblData != 0) {
        let value = nextProps.tblData[0];

        var tblcolumn = Object.keys(value).map((data) => {
          if (data === 'Material') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              headerStyle: { width: 90 },
              formatter: this.materialDD,
              headerClasses: 'id-custom-cell',
              classes: 'material-position-fixed',
              align: 'center',
              headerAlign: 'center'
            };
            return dataField;
          } else if (data === 'LGORT') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              align: 'center',
              headerAlign: 'center',
              headerStyle: { width: 80 }
            };
            return dataField;
          } else if (data === 'Predicted CapEx (Without Harvest)') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 150 },
              sortFunc: this.sortFunc,
              formatter: this.costformat
            };
            return dataField;
          } else if (data === 'Inventory CapEx') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 100 },
              sortFunc: this.sortFunc,
              formatter: this.costformat
            };
            return dataField;
          } else if (data === 'Predicted CapEx (With Harvest)') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 140 },
              sortFunc: this.sortFunc,
              formatter: this.costformat
            };
            return dataField;
          } else if (data === 'HECI') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'STK_TYPE') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'LVLT_STOCKOUT_FLAG') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'CTL_STOCKOUT_FLAG') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'matdescription') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'REPLACED_FLAG') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'Orders in Pipeline(QTY)') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 130 },
              formatter: this.ordersPipelineDD
            };
            return dataField;
          } else if (data === 'Current Inventory Exhaust Date') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 130 },
              formatter: this.dateformat
            };
            return dataField;
          } else if (data === 'Predicted Reorder Date') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 130 },
              formatter: this.dateformat
            };
            return dataField;
          } else {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              headerStyle: { width: data.length * 6 },
              align: 'center',
              headerAlign: 'center'
            };
            return dataField;
          }
        });
        this.setState({
          tblData: nextProps.tblData,
          isDataFetched: false,
          tableColumn1: tblcolumn
        });
        this.props.EoqTblLoader(false);
      } else {
        this.setState({
          tblData: [],
          isDataFetched: true
        });
        this.props.EoqTblLoader(false);
      }
    }
    if (this.props.ordersDDtblData != nextProps.ordersDDtblData) {
      if (nextProps.ordersDDtblData != 0) {
        this.setState({
          ordersDDtblData: nextProps.ordersDDtblData,
          isDataFetchedOne: false
        });
      } else {
        this.setState({
          ordersDDtblData: [],
          isDataFetchedOne: true
        });
      }
    }
  }
  materialDD(cell, row) {
    return (
      <Tooltip
        placement="right"
        className="modal-tool-tip"
        title={
          <span>
            {row.matdescription}
            {row.STK_TYPE == '' || row.STK_TYPE == null ? (
              ''
            ) : (
              <>
                <br />
                <span className="Stk-style">
                  Stock Type : &nbsp;
                  {row.STK_TYPE}
                </span>
              </>
            )}

            {row.HECI == '' || row.HECI == null ? (
              ''
            ) : (
              <>
                <br />
                <span className="heci-style">
                  HECI : &nbsp;
                  {row.HECI}
                </span>
              </>
            )}

            {row.CTL_STOCKOUT_FLAG != 'Y' ? (
              ''
            ) : (
              <>
                <br />
                <span className="stockout-style">CTL Stockout : &nbsp; Yes</span>
              </>
            )}

            {row.LVLT_STOCKOUT_FLAG != 'Y' ? (
              ''
            ) : (
              <>
                <br />
                <span className="stockout-style">LVLT Stockout : &nbsp; Yes</span>
              </>
            )}
          </span>
        }>
        {row.REPLACED_FLAG == 'Y' ? (
          <span
            className="row-data Flay-y"
            // style={{
            //   color: "#f5ee08e3",

            //   borderBottom: "1px solid",
            // }}
            onClick={() => this.onclickDD(row)}>
            {cell}
          </span>
        ) : (
          <span
            className="row-data flag-n"
            // style={{
            //   color: "#58d8ed",

            //   borderBottom: "1px solid",
            // }}
            onClick={() => this.onclickDD(row)}>
            {cell}
          </span>
        )}
      </Tooltip>
    );
  }
  ordersPipelineDD(cell, row) {
    return (
      <span className="row-data" onClick={() => this.onclickOrdersDD(row)}>
        {cell}
      </span>
    );
  }
  onclickOrdersDD(e) {
    if (this.state.ordersDDModal == true) {
      this.setState({
        ordersDDtblData: [],
        ordersDDModal: false,

        isDataFetchedOne: false,
        newResultLength1: ''
      });
    } else {
      this.setState({
        ordersDDtblData: [],

        MaterialNo: e.Material,
        LGORT: e.LGORT,

        ordersDDModal: true,
        isDataFetchedOne: false,
        newResultLength1: ''
      });

      if (this.state.usercuid != null) {
        this.props.getOrdersinPipelineDD(e.Material, e.LGORT);
      } else {
        this.props.getOrdersinPipelineDD(e.Material, e.LGORT);
      }
    }
  }

  handleCloseModal() {
    this.setState({
      renderDD: []
    });
  }

  onclickDD(e) {
    this.setState({
      renderDD: (
        <DrillDown
          MaterialNo={e.Material}
          openModal={true}
          openHarvestQTY={e.openharvestqty}
          Description={e.matdescription}
          withHarvestCapEx={e.predictedcapexwithharvest}
          label={e.Material}
          onClose={this.handleCloseModal.bind(this)}
          lgort={e.LGORT}
          flag={e.REPLACED_FLAG}
          ReasonCodeDropDownValue={this.state.ReasonCodeDropDownValue}
          parsedBlockedDeleted={this.state.parsedBlockedDeleted}
          ForecastIsApprover={this.state.ForecastIsApprover}
        />
      )
    });
    if (this.state.usercuid != null) {
      this.props.getEOQHeaderDD(e.Material, e.LGORT);
    } else {
      this.props.getEOQHeaderDD(e.Material, e.LGORT);
    }
  }
  infoDD() {
    if (this.state.InfoModal == true) {
      this.setState({
        InfoModal: false
      });
    } else {
      this.setState({
        InfoModal: true
      });
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

  costformat(cell) {
    var values = [];
    if (cell < 1000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>${value}</span>);
    } else if (cell < 9999 || cell < 1000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>${value}</span>);
    } else if (cell < 10000000 || cell < 1000000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>${value}</span>);
    } else if (cell < 1000000000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>${value}</span>);
    }
    return values;
  }
  sortFunc(a, b, order) {
    if (order === 'asc') {
      return b - a;
    }
    return a - b;
  }
  sortFuncDate(a, b, order) {
    if (order === 'asc') {
      return moment(a) - moment(b);
    } else if (order === 'desc') {
      return moment(b) - moment(a);
    }
  }
  tblLoader() {
    if (
      !this.props.EoqTblLoaderData &&
      this.state.isDataFetched &&
      this.state.newResultLength === 0
    ) {
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
  tblLoaderOne() {
    if (this.state.isDataFetchedOne || this.state.newResultLength1 === 0) {
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
    let csvData = this.state.tblData;
    let fileName = 'Predicted Order Quantity(EOQ)';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVOrdersinpipeline() {
    let csvData = this.state.ordersDDtblData;
    let fileName = `${this.state.MaterialNo}- Open Pos`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  imploader() {
    this.props.EoqTblLoader(true);
    this.setState({
      tblData: [],
      newResultLength: 0,
      isDataFetched: false,
      newResultLength1: '',
      isDataFetchedOne: false
    });
  }
  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.tableColumn1.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ tableColumn1: columnsCopy });
  }

  onDragEndordersDDColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.ordersDDColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ ordersDDColumn: columnsCopy });
  }

  tableFilter() {
    if (this.state.isModalVisible) {
      this.setState({
        isModalVisible: false
      });
    } else {
      this.setState({
        isModalVisible: true
      });
    }
  }

  render() {
    return (
      <div>
        {this.state.isModalVisible ? (
          <TableColSettings
            parsedFilterSettingsLGORT={this.state.parsedFilterSettingsLGORT}
            parsedBlockedDeleted={this.state.parsedBlockedDeleted}
            fieldColumns={this.state.mockData}
            defaultColumns={
              this.state.defaultList.length != 0 ? this.state.defaultList : this.state.mockData
            }
            showColumns={
              this.state.defaultList.length != 0 ? this.state.defaultList : this.state.mockData
            }
            onClose={() => this.setState({ isModalVisible: false })}
            onSuccess={() =>
              this.setState({
                isModalVisible: false,
                tblData: [],
                tableColumn1: [{ dataField: '', text: '' }]
              })
            }
          />
        ) : (
          ''
        )}

        <Row className="v4">
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="pr-2 pl-2">
              <Card>
                <div>
                  <ToolkitProvider
                    keyField="id"
                    data={this.state.tblData}
                    columns={this.state.tableColumn1}
                    search={{
                      afterSearch: (newResult) => {
                        if (!newResult.length) {
                          if (this.state.tblData != 0) {
                            this.setState({
                              isDataFetched: true,
                              newResultLength: newResult.length
                            });
                          } else {
                            this.setState({
                              isDataFetched: true,
                              newResultLength: newResult.length
                            });
                          }
                        }
                      }
                    }}>
                    {(props) => (
                      <div>
                        <Row className="mt-15">
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            {' '}
                            <span className="tblHeader">
                              <i className="fas fa-table mr-2" /> Predicted Order
                              Quantity(EOQ)&nbsp;&nbsp;
                              <Popover placement="right" content={<span>Info </span>}>
                                <i
                                  className="fas fa-info-circle info-logo-widget mr-2"
                                  onClick={this.infoDD}
                                />
                              </Popover>
                            </span>
                            <span className="float-right mr-1">
                              <Popover placement="left" content={<span>Column Show </span>}>
                                <span onClick={this.tableFilter.bind(this)}>
                                  <i className="far fa-clipboard-list"></i>
                                </span>
                              </Popover>

                              <span className="mr-2">
                                <>
                                  <SearchBar {...props.searchProps} />
                                </>
                              </span>

                              <Button
                                size="sm"
                                className="export-Btn mr-2"
                                disabled={this.state.tblData.length == 0}
                                onClick={this.exportToCSV}>
                                <i className="fas fa-file-excel" />{' '}
                                <span className="text-white"></span>
                              </Button>
                            </span>
                          </Col>
                        </Row>

                        <ReactDragListView.DragColumn
                          onDragEnd={this.onDragEnd.bind(this)}
                          nodeSelector="th">
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory()}
                            noDataIndication={this.tblLoader.bind(this)}
                            filter={filterFactory()}
                          />
                        </ReactDragListView.DragColumn>
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              </Card>
            </Col>
          </Row>
        </Row>

        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Predicted Order Quantity(EOQ) - Description</div>}
          className="Intervaltimeline"
          visible={this.state.InfoModal}
          onCancel={this.infoDD}>
          <div>
            <p>
              <strong>Reorder Point:</strong>
            </p>
            <ul>
              <li> Demand in Next Lead time + Safety Stock</li>
              <div className="formula-img" />
            </ul>
            <p>
              <strong>Total Incoming :</strong>
            </p>
            <ul>
              <li>Inventory + Open POs + Incoming Harvest</li>
            </ul>
            <p>
              <strong>Quantity to Order :</strong>
            </p>
            <ul>
              <li>Reorder Point - Total Incoming + Next 30 day Demand (If understock) </li>
              <li>Next 30 day Demand (If not understock)</li>
              <li>
                Calculated using Predicted Future Demand (Using Prophet Model) and Leadtime. The
                Materials where we don&#39;t have enough data points, it is calculated using
                Statistical Model(Demand Variation, Z Score Etc.)
              </li>
            </ul>
            <p>
              <strong>Reorder Date :</strong>
            </p>
            <ul>
              <li>Today (If understock)</li>
              <li>Today + ((Total Incoming - Reorder Point)/demand per day) (If not understock)</li>
            </ul>
          </div>
        </Modal>

        <Modal
          width="80%"
          style={{ top: 60 }}
          footer={null}
          title={
            <div>
              Material - {this.state.MaterialNo}{' '}
              {this.state.ordersDDtblData != 0 ? (
                <Button
                  size="sm"
                  className="export-Btn ml-2 mr-3 float-right"
                  onClick={this.exportToCSVOrdersinpipeline}>
                  <i className="fas fa-file-excel mr-2" /> <span className="text-white">Excel</span>
                </Button>
              ) : (
                <Button
                  disabled
                  size="sm"
                  className="export-Btn ml-2 mr-3 float-right"
                  onClick={this.exportToCSVOrdersinpipeline}>
                  <i className="fas fa-file-excel mr-2" /> <span className="text-white">Excel</span>
                </Button>
              )}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.ordersDDModal}
          onCancel={this.onclickOrdersDD}>
          <ToolkitProvider
            keyField="id"
            data={this.state.ordersDDtblData}
            columns={this.state.ordersDDColumn}
            search={{
              afterSearch: (newResult) => {
                if (!newResult.length) {
                  ('no data available for this creteria');
                  if (this.state.ordersDDtblData != '') {
                    this.setState({
                      newResultLength1: newResult.length
                    });
                  } else {
                    this.setState({
                      newResultLength1: '',
                      isDataFetchedOne: false
                    });
                  }
                }
              }
            }}>
            {(props) => (
              <div>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} />
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right float-right">
                    <SearchBar {...props.searchProps} />
                  </Col>
                </Row>
                <ReactDragListView.DragColumn
                  onDragEnd={this.onDragEndordersDDColumn.bind(this)}
                  nodeSelector="th">
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory()}
                    noDataIndication={() => this.tblLoaderOne()}
                    filter={filterFactory()}
                  />
                </ReactDragListView.DragColumn>
              </div>
            )}
          </ToolkitProvider>
        </Modal>
        {this.state.renderDD}
      </div>
    );
  }
}
function mapState(state) {
  return {
    tblData: state.getEOQTbl,
    ordersDDtblData: state.getOrdersinPipelineDD,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,

    getReasonCodeListData: state.getReasonCodeList,
    EoqTblLoaderData: state.EoqTblLoaders.EoqTblLoader,
    getPredictedOrderQuantityColumnsData: state.getPredictedOrderQuantityColumns
  };
}

export default connect(mapState, {
  getPredictedOrderQuantityColumns,
  getReasonCodeList,

  getUserImpersonationDetails,
  getEOQTbl,
  getEOQHeaderDD,
  getPredictedChart,
  getOrdersinPipelineDD,
  EoqTblLoader
})(EOQTable);
