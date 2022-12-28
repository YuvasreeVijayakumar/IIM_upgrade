import React from 'react';
import { connect } from 'react-redux';

import { Row, Col, Card, Modal, Button, Tabs, Switch, Tooltip, Popover } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { getSupplyChainInventoryPos, getUserImpersonationDetails } from '../../actions';
import ReactDragListView from 'react-drag-listview';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const { SearchBar } = Search;
const { TabPane } = Tabs;
var parsedFilterSettingsLGORT;

let parsedBlockedDeleted;
class CapGovTable extends React.Component {
  constructor(props) {
    super(props);
    this.imploader = this.imploader.bind(this);
    this.costformat = this.costformat.bind(this);
    this.getcheckValues = this.getcheckValues.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.materialDescription = this.materialDescription.bind(this);

    this.state = {
      usercuid: 'ALL',
      ModalChain: false,
      controller: true,
      getSupplyChainInventoryPosData: [],
      getUserImpersonationDetailsData: [],

      isDataFetched: false,
      defaultAdvancePOActiveKey: '1',
      defaultCurrentPOActiveKey: '1',

      advancedpomatnrColumn: [
        {
          dataField: 'MATNR',
          text: 'Material',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },

        {
          dataField: 'MEDIAN_LEADTIME',
          text: 'Lead Time',
          sort: true,
          headerStyle: { width: 100 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '30_Day',
          text: '30 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '60_Day',
          text: '60 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '90_Day',
          text: '90 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '120_Day',
          text: '120 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '150_Day',
          text: '150 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '180_Day',
          text: '180 Days',
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          sort: true,
          headerAlign: 'right'
        }
      ],
      advancedpoorgColumn: [
        {
          dataField: 'ORGANIZATION',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 125 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: '30_Day',
          text: '30 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '60_Day',
          text: '60 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '90_Day',
          text: '90 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '120_Day',
          text: '120 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '150_Day',
          text: '150 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        }
      ],
      currentpomatnrColumn: [
        {
          dataField: 'MATNR',
          text: 'Material',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Overdue',
          text: 'Overdue',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '30_Day',
          text: '30 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '60_Day',
          text: '60 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '90_Day',
          text: '90 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '120_Day',
          text: '120 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '150_Day',
          text: '150 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '180_Day',
          text: '180 Days',
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          sort: true,
          headerAlign: 'right'
        }
      ],
      currentpoorgColumn: [
        {
          dataField: 'Organization',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 125 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Overdue',
          text: 'Overdue',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '30_Day',
          text: '30 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '60_Day',
          text: '60 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '90_Day',
          text: '90 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '120_Day',
          text: '120 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '150_Day',
          text: '150 Days',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '180_Day',
          text: '180 Days',
          headerStyle: { width: 120 },
          formatter: this.costformat,
          align: 'right',
          sort: true,
          headerAlign: 'right'
        }
      ],
      currentPoOrders: false
    };
  }

  componentDidMount() {
    // this.props.getSupplyChainInventoryPos('OnOrderMatnr');
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.imploader();
        const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

        parsedBlockedDeleted = JSON.parse(filterSettingsOrg)[0].BlockedDeleted;
        parsedFilterSettingsLGORT = JSON.parse(filterSettingsOrg)[0].LGORT;
        this.setState({
          organization: nextProps.getUserImpersonationDetailsData[0].FilterSetting,
          usercuid: nextProps.getUserImpersonationDetailsData[0].loggedcuid
        });
      }
    }
    if (this.props.getSupplyChainInventoryPosData != nextProps.getSupplyChainInventoryPosData) {
      if (nextProps.getSupplyChainInventoryPosData != 0) {
        // if (nextProps.getSupplyChainInventoryPosData == 0) {
        //   this.setState({
        //     newResultLength: 0,
        //   });
        // }
        this.setState({
          getSupplyChainInventoryPosData: nextProps.getSupplyChainInventoryPosData,
          isDataFetched: false
        });
      } else {
        this.setState({
          getSupplyChainInventoryPosData: [],
          isDataFetched: true
        });
      }
    }
  }
  materialDescription(cell, row) {
    return (
      <Tooltip
        placement="right"
        className="modal-tool-tip"
        title={
          <span>
            {row.DESCRIPTION}
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
        <span className="row-data" onClick={() => this.DrilldownDD(row)}>
          {cell}
        </span>
      </Tooltip>
    );
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

  getcheckValues(checked) {
    this.setState({
      defaultAdvancePOActiveKey: '1',
      defaultCurrentPOActiveKey: '1',
      controller: !this.state.controller
    });
    if (checked == false) {
      this.setState({
        getSupplyChainInventoryPosData: [],
        isDataFetched: false,
        newResultLength: '',
        currentPoOrders: true
      });
      if (this.state.usercuid != null) {
        this.props.getSupplyChainInventoryPos(
          'OnOrderMatnr',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getSupplyChainInventoryPos(
          'OnOrderMatnr',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        getSupplyChainInventoryPosData: [],
        isDataFetched: false,
        newResultLength: '',
        currentPoOrders: false
      });
      if (this.state.usercuid != null) {
        this.props.getSupplyChainInventoryPos(
          'AdvancePoMatnr',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getSupplyChainInventoryPos(
          'AdvancePoMatnr',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }

  callAdvancedPOback(key) {
    this.setState({
      defaultCurrentPOActiveKey: '1'
    });
    if (key == 2) {
      this.setState({
        getSupplyChainInventoryPosData: [],
        isDataFetched: false,
        newResultLength: '',
        defaultAdvancePOActiveKey: '2'
      });
      if (this.state.usercuid != null) {
        this.props.getSupplyChainInventoryPos(
          'AdvancePoOrganisation',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getSupplyChainInventoryPos(
          'AdvancePoOrganisation',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        getSupplyChainInventoryPosData: [],
        isDataFetched: false,
        newResultLength: '',
        defaultAdvancePOActiveKey: '1'
      });
      if (this.state.usercuid != null) {
        this.props.getSupplyChainInventoryPos(
          'AdvancePoMatnr',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getSupplyChainInventoryPos(
          'AdvancePoMatnr',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }

  callCurrentPOback(key) {
    this.setState({
      defaultAdvancePOActiveKey: '1'
    });
    if (key == 2) {
      this.setState({
        getSupplyChainInventoryPosData: [],
        isDataFetched: false,
        newResultLength: '',
        defaultCurrentPOActiveKey: '2'
      });
      if (this.state.usercuid != null) {
        this.props.getSupplyChainInventoryPos(
          'OnOrderOrganisation',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getSupplyChainInventoryPos(
          'OnOrderOrganisation',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        getSupplyChainInventoryPosData: [],
        isDataFetched: false,
        newResultLength: '',
        defaultCurrentPOActiveKey: '1'
      });
      if (this.state.usercuid != null) {
        this.props.getSupplyChainInventoryPos(
          'OnOrderMatnr',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getSupplyChainInventoryPos(
          'OnOrderMatnr',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }

  exportToCSV() {
    let csvData = this.state.getSupplyChainInventoryPosData;
    let fileDownload =
      `${
        this.state.defaultCurrentPOActiveKey == 1 && this.state.defaultAdvancePOActiveKey == 1
          ? 'Material'
          : 'Organization'
      }` +
      '-' +
      `${this.state.controller ? 'Advance PO Issuance' : 'Current PO Issuance'}`;
    let fileName = fileDownload;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  infochain() {
    if (this.state.ModalChain == true) {
      this.setState({
        ModalChain: false
      });
    } else {
      this.setState({
        ModalChain: true
      });
    }
  }

  imploader() {
    this.setState({
      currentPoOrders: false,
      controller: true,
      getSupplyChainInventoryPosData: [],
      isDataFetched: false,
      defaultAdvancePOActiveKey: '1'
    });
    setTimeout(() => {
      this.setState({
        newResultLength: ''
      });
    }, 1000);
  }
  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.advancedpomatnrColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ advancedpomatnrColumn: columnsCopy });
  }

  onDragEndadvancedpoorgColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.advancedpoorgColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ advancedpoorgColumn: columnsCopy });
  }
  onDragEndcurrentpomatnrColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.currentpomatnrColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ currentpomatnrColumn: columnsCopy });
  }

  onDragEndcurrentpoorgColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.currentpoorgColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ currentpoorgColumn: columnsCopy });
  }
  render() {
    return (
      <Row>
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className=" pl-2">
          <Card
            className="snkr"
            title={
              <Row style={{ top: '6px' }} className="card-head">
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <span>
                    Supply Chain - Inventory POs
                    <Popover placement="right" content={<span>Info</span>}>
                      <i
                        className="fas fa-info-circle info-logo-widget ml-2"
                        onClick={this.infochain.bind(this)}
                      />
                    </Popover>
                  </span>
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <div className="float-right mr-4">
                    <span className="view-text">
                      View :{' '}
                      <Switch
                        className="supplyPosSwitch"
                        checkedChildren="Advanced PO"
                        unCheckedChildren="Current PO"
                        // defaultChecked
                        checked={this.state.controller}
                        onChange={this.getcheckValues}
                      />
                    </span>
                  </div>
                </Col>
              </Row>
            }>
            {' '}
            {this.state.currentPoOrders == false ? (
              <Tabs
                activeKey={this.state.defaultAdvancePOActiveKey}
                onChange={this.callAdvancedPOback.bind(this)}>
                <TabPane tab="Material" key="1">
                  <div>
                    <ToolkitProvider
                      keyField="id"
                      data={this.state.getSupplyChainInventoryPosData}
                      columns={this.state.advancedpomatnrColumn}
                      search={{
                        afterSearch: (newResult) => {
                          if (!newResult.length) {
                            if (this.state.getSupplyChainInventoryPosData != '') {
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
                          <Row className="mb-1">
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <h6 className="ml-2">Advance PO Issuance</h6>
                            </Col>
                            <Col
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              className="float-right search-right">
                              {this.state.getSupplyChainInventoryPosData != 0 ? (
                                <Button
                                  size="sm"
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel" />
                                </Button>
                              ) : (
                                <Button
                                  disabled
                                  size="sm"
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel" />
                                </Button>
                              )}
                              {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                              <SearchBar {...props.searchProps} />
                            </Col>
                          </Row>
                          <ReactDragListView.DragColumn
                            onDragEnd={this.onDragEnd.bind(this)}
                            nodeSelector="th">
                            <div className="capgov-table table-pagination-top">
                              <BootstrapTable
                                {...props.baseProps}
                                pagination={paginationFactory()}
                                noDataIndication={() => this.tblLoader()}
                                filter={filterFactory()}
                              />
                            </div>
                          </ReactDragListView.DragColumn>
                        </div>
                      )}
                    </ToolkitProvider>
                  </div>
                </TabPane>
                <TabPane tab="Organization" key="2">
                  <div>
                    <ToolkitProvider
                      keyField="id"
                      data={this.state.getSupplyChainInventoryPosData}
                      columns={this.state.advancedpoorgColumn}
                      search={{
                        afterSearch: (newResult) => {
                          if (!newResult.length) {
                            if (this.state.getSupplyChainInventoryPosData != '') {
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
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <h6>Advanced PO Issuance(Based on Current leadtime)</h6>
                            </Col>
                            <Col
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              className="float-right search-right">
                              {this.state.getSupplyChainInventoryPosData != 0 ? (
                                <Button
                                  size="sm"
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel" />
                                </Button>
                              ) : (
                                <Button
                                  disabled
                                  size="sm"
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel" />
                                </Button>
                              )}
                              {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                              <SearchBar {...props.searchProps} />
                            </Col>
                          </Row>
                          <ReactDragListView.DragColumn
                            onDragEnd={this.onDragEndadvancedpoorgColumn.bind(this)}
                            nodeSelector="th">
                            <div className="capgov-table table-pagination-top">
                              <BootstrapTable
                                {...props.baseProps}
                                pagination={paginationFactory()}
                                noDataIndication={() => this.tblLoader()}
                                filter={filterFactory()}
                              />
                            </div>
                          </ReactDragListView.DragColumn>
                        </div>
                      )}
                    </ToolkitProvider>
                  </div>
                </TabPane>
              </Tabs>
            ) : (
              <Tabs
                activeKey={this.state.defaultCurrentPOActiveKey}
                onChange={this.callCurrentPOback.bind(this)}>
                <TabPane tab="Material" key="1">
                  <div>
                    <ToolkitProvider
                      keyField="id"
                      data={this.state.getSupplyChainInventoryPosData}
                      columns={this.state.currentpomatnrColumn}
                      search={{
                        afterSearch: (newResult) => {
                          if (!newResult.length) {
                            if (this.state.getSupplyChainInventoryPosData != '') {
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
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <h6 className="ml-2">Current PO Issuance</h6>
                            </Col>
                            <Col
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              className="float-right search-right">
                              {this.state.getSupplyChainInventoryPosData != 0 ? (
                                <Button
                                  size="sm"
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel" />
                                </Button>
                              ) : (
                                <Button
                                  disabled
                                  size="sm"
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel" />
                                </Button>
                              )}
                              {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                              <SearchBar {...props.searchProps} />
                            </Col>
                          </Row>
                          <ReactDragListView.DragColumn
                            onDragEnd={this.onDragEndcurrentpomatnrColumn.bind(this)}
                            nodeSelector="th">
                            <div className="capgov-table table-pagination-top">
                              <BootstrapTable
                                {...props.baseProps}
                                pagination={paginationFactory()}
                                noDataIndication={() => this.tblLoader()}
                                filter={filterFactory()}
                              />
                            </div>
                          </ReactDragListView.DragColumn>
                        </div>
                      )}
                    </ToolkitProvider>
                  </div>
                </TabPane>
                <TabPane tab="Organization" key="2">
                  <div>
                    <ToolkitProvider
                      keyField="id"
                      data={this.state.getSupplyChainInventoryPosData}
                      columns={this.state.currentpoorgColumn}
                      search={{
                        afterSearch: (newResult) => {
                          if (!newResult.length) {
                            if (this.state.getSupplyChainInventoryPosData != '') {
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
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              <h6 className="ml-2">Current PO Issuance</h6>
                            </Col>
                            <Col
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              className="float-right search-right">
                              {this.state.getSupplyChainInventoryPosData != 0 ? (
                                <Button
                                  size="sm"
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel" />
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel" />
                                </Button>
                              )}
                              {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                              <SearchBar {...props.searchProps} />
                            </Col>
                          </Row>
                          <ReactDragListView.DragColumn
                            onDragEnd={this.onDragEndcurrentpoorgColumn.bind(this)}
                            nodeSelector="th">
                            <div className="capgov-table table-pagination-top">
                              <BootstrapTable
                                {...props.baseProps}
                                pagination={paginationFactory()}
                                noDataIndication={() => this.tblLoader()}
                                filter={filterFactory()}
                              />
                            </div>
                          </ReactDragListView.DragColumn>
                        </div>
                      )}
                    </ToolkitProvider>
                  </div>
                </TabPane>
              </Tabs>
            )}
          </Card>
        </Col>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Cap Gov DetailSupply Chain - Inventory POs</div>}
          className="Intervaltimeline"
          visible={this.state.ModalChain}
          onCancel={this.infochain.bind(this)}>
          <div>
            <p>
              <ul>
                <li>
                  <strong>Material and Organization details for:</strong>
                  <br />
                  <ul>
                    <li>
                      Advance PO: Monthly qty for Advanced PO recommendation (Calculated using Cap
                      Gov Report)
                    </li>
                    <br />
                    <li>Current PO: Monthly qty for placed POs(Calculated using Open POs table)</li>
                  </ul>
                </li>
              </ul>
            </p>
          </div>
        </Modal>
      </Row>
    );
  }
}
function mapState(state) {
  return {
    getSupplyChainInventoryPosData: state.getSupplyChainInventoryPos,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails
  };
}

export default connect(mapState, {
  getSupplyChainInventoryPos,
  getUserImpersonationDetails
})(CapGovTable);
