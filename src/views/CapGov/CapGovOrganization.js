import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Button, Modal, Popover } from 'antd';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  Bar,
  BarChart,
  Tooltip,
  Label
} from 'recharts';

import {
  getTopSpendsByOrganization,
  getCapGovMaterialReport1,
  getCapGovInfoForMaterial1,
  getTopSpendsByOrganizationChart,
  getUserImpersonationDetails
} from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import { calculation } from '../Calculation';

import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';

import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactDragListView from 'react-drag-listview';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { SearchBar } = Search;
var parsedFilterSettingsLGORT;

let parsedBlockedDeleted;
class CapGovOrganization extends Component {
  constructor(props) {
    super(props);
    this.imploader = this.imploader.bind(this);
    this.componentRefOnHandView = React.createRef();
    this.componentRefForecastConsumption = React.createRef();
    this.componentRefQuantityToOrder = React.createRef();
    this.top10chart = React.createRef();
    this.closeModal = this.closeModal.bind(this);
    this.RowFormatter = this.RowFormatter.bind(this);
    this.costformat = this.costformat.bind(this);
    this.DrilldownDD = this.DrilldownDD.bind(this);
    this.exportToCSV1 = this.exportToCSV1.bind(this);

    this.state = {
      usercuid: 'ALL',
      ModalOrg: false,
      ModalOrg1: false,
      isclicked: true,
      chartData: true,
      getUserImpersonationDetails: [],

      getTopSpendsByOrganizationChartData: [],
      getCapGovMaterialReport1Data: [],

      monthsOnHandData: '',
      material_no: '1377179',
      ACTUAL_DELIVERIES: [],
      CURRENT_ON_ORDERS: [],
      RECOMMENDED_NEW_ORDER: [],
      ON_HAND_UNITS: [],
      MONTHS_ON_HAND: [],
      FORCAST_FLAG_ColorCode: [],
      DS: [],
      FORCAST_FLAG: [],
      CONSUMPTION: [],
      isDataFetched: false,
      dataupdated: false,
      getCapGovInfoForMaterial1Data: [],
      coloursData: [],
      install_base: '',
      harvesting: '',
      month_deploy_value: '',
      begin_value: '',
      less_value: '',
      add_current_value: '',
      gross_new_need: '',
      add_moh_adjust: '',
      net_new_need: '',
      cap_gov_req: '',
      harvestingView: '',
      showModal: false,

      getTopSpendsByOrganizationData: [],
      tableColumn: [
        {
          dataField: 'ORGANIZATION',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 50 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          headerStyle: { width: 40 },
          formatter: this.RowFormatter,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 30 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'LeadTime',
          text: 'LeadTime',
          sort: true,
          headerStyle: { width: 40 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'CAP_GOV_REQUEST',
          text: 'Cap Gov Request',
          sort: true,
          headerStyle: { width: 58 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        }
      ]
    };
  }
  componentDidMount() {
    // this.props.getTopSpendsByOrganization();
    // this.props.getTopSpendsByOrganizationChart();
    // this.props.getCapGovMaterialReport1(this.state.material_no);
    // this.props.getCapGovInfoForMaterial(this.state.material_no);
  }

  // dummy data

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.imploader();
        const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

        parsedBlockedDeleted = JSON.parse(filterSettingsOrg)[0].BlockedDeleted;
        parsedFilterSettingsLGORT = JSON.parse(filterSettingsOrg)[0].LGORT;
        this.setState({
          organization: nextProps.getUserImpersonationDetailsData[0].FilterSetting,
          usercuid:
            nextProps.getUserImpersonationDetailsData[0].loggedcuid == null
              ? 'all'
              : nextProps.getUserImpersonationDetailsData[0].loggedcuid
        });
      }
    }
    if (
      this.props.getTopSpendsByOrganizationChartData !=
      nextProps.getTopSpendsByOrganizationChartData
    ) {
      if (nextProps.getTopSpendsByOrganizationChartData != 0) {
        this.setState({
          getTopSpendsByOrganizationChartData: nextProps.getTopSpendsByOrganizationChartData
        });
      } else {
        this.setState({
          getTopSpendsByOrganizationChartData: []
        });
      }
    }
    if (this.props.getTopSpendsByOrganizationData != nextProps.getTopSpendsByOrganizationData) {
      if (nextProps.getTopSpendsByOrganizationData != 0) {
        this.setState({
          getTopSpendsByOrganizationData: nextProps.getTopSpendsByOrganizationData,
          isDataFetched: false,
          newResultLength: ''
          // series: {
          //   data: nextProps.getTopSpendsByOrganizationData,
          // },
        });
      } else {
        this.setState({
          getTopSpendsByOrganizationData: [],
          chartData: false,
          isDataFetched: true,
          newResultLength: ''
        });
      }
    }

    if (this.props.getCapGovInfoForMaterial1Data != nextProps.getCapGovInfoForMaterial1Data) {
      if (nextProps.getCapGovInfoForMaterial1Data != 0) {
        if (nextProps.getCapGovInfoForMaterial1Data[0].Harvesting) {
          var a = nextProps.getCapGovInfoForMaterial1Data[0].Harvesting;
          var split_Val = a.split('/');
          var res = [];
          // eslint-disable-next-line no-unused-vars
          var final_result;
          split_Val.forEach((data) => {
            res.push(data.split('.')[0]);
          });
          // eslint-disable-next-line react/no-direct-mutation-state
          this.state.harvestingView = res.toString().replace(/,/g, '/');
        }

        this.setState({
          infoMaterialView: (
            <Row className="v4">
              <Col>
                <Card>
                  <div>
                    <Row>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">Install Base:</div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {nextProps.getCapGovInfoForMaterial1Data[0].InstallBase}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">
                          <b>Harvesting</b>(Universe/InProgress/YTD)
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">{this.state.harvestingView}</div>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">12 Month Redeploy Value:</div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {calculation(nextProps.getCapGovInfoForMaterial1Data[0].Redeploy_Value)}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-5">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">
                          {' '}
                          <b>Begin:</b>Warehouse On-Hand
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {nextProps.getCapGovInfoForMaterial1Data[0].Begin}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">
                          {' '}
                          <b>Less:</b>Leadtime Demand
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {nextProps.getCapGovInfoForMaterial1Data[0].Less}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">
                          <b>Add:</b>Current Vendor On Order
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {nextProps.getCapGovInfoForMaterial1Data[0].Add}
                        </div>
                      </Col>
                      <hr className="adjust_horizontal_line" />
                    </Row>
                    <Row className="mt-1">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">Gross New Need</div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {nextProps.getCapGovInfoForMaterial1Data[0].Gross_New_Need}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-1">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">
                          <b>Add : </b>Safety Stock Adjust
                        </div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {nextProps.getCapGovInfoForMaterial1Data[0].Add_MOH_Adjust}
                        </div>
                      </Col>
                      <hr className="adjust_horizontal_line" />
                    </Row>
                    <Row className="mt-1">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17"> Net New Need</div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {nextProps.getCapGovInfoForMaterial1Data[0].Net_New_Need}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-5 margin-change">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">Cap Gov Request:</div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {calculation(nextProps.getCapGovInfoForMaterial1Data[0].CapGov_Request)}
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Card>
              </Col>
            </Row>
          )
        });
      }
    }

    if (this.props.getCapGovMaterialReport1Data != nextProps.getCapGovMaterialReport1Data) {
      if (nextProps.getCapGovMaterialReport1Data != 0) {
        this.setState({
          getCapGovMaterialReport1Data: nextProps.getCapGovMaterialReport1Data,

          DS: nextProps.getCapGovMaterialReport1Data.map((data) => data.DS),
          ON_HAND_UNITS: nextProps.getCapGovMaterialReport1Data.map((data) => data.ON_HAND_UNITS),
          MONTHS_ON_HAND: nextProps.getCapGovMaterialReport1Data.map((data) => data.MONTHS_ON_HAND),
          FORCAST_FLAG_ColorCode: nextProps.getCapGovMaterialReport1Data.map(
            (data) => data.FORCAST_FLAG_ColorCode
          ),

          CONSUMPTION: nextProps.getCapGovMaterialReport1Data.map((data) => data.CONSUMPTION),
          CURRENT_ON_ORDERS: nextProps.getCapGovMaterialReport1Data.map(
            (data) => data.CURRENT_ON_ORDERS
          ),
          RECOMMENDED_NEW_ORDER: nextProps.getCapGovMaterialReport1Data.map(
            (data) => data.RECOMMENDED_NEW_ORDER
          ),

          ACTUAL_DELIVERIES: nextProps.getCapGovMaterialReport1Data.map(
            (data) => data.ACTUAL_DELIVERIES
          )
        });
      } else {
        this.setState({
          getCapGovMaterialReport1Data: []
        });
      }
    }
  }

  handleMaterialChange(e) {
    if (isNaN(Number(e))) {
      return;
    } else {
      this.setState({ material_no: e });
      this.props.getCapGovMaterialReport1(
        e,
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted,
        'MATERIAL'
      );
      this.props.getCapGovInfoForMaterial1(
        e,
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted,
        'MATERIAL'
      );
    }
  }

  TooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-bolder font-14">
            <b>
              Date: <span className="font-14 golden-text">{e.payload[0].payload.DS}</span>
            </b>{' '}
            <br />
          </span>
          {e.payload[0].payload.FORCAST_FLAG == 'TRUE' ? (
            <span className="text-white font-14">
              <b>
                Ending On Hand (Units):
                <span className="font-14" style={{ color: '#63ce46' }}>
                  {e.payload[0].payload.ON_HAND_UNITS}
                </span>
              </b>{' '}
              <br />
            </span>
          ) : (
            <span className="text-white font-14">
              <b>
                Ending On Hand (Units):
                <span className="font-14" style={{ color: '#1870dc' }}>
                  {e.payload[0].payload.ON_HAND_UNITS}
                </span>
              </b>{' '}
              <br />
            </span>
          )}
          <span className="text-white font-14">
            <b>
              Safety stock on hand:{' '}
              <span className="font-14" style={{ color: '#fa9105' }}>
                {e.payload[0].payload.MONTHS_ON_HAND}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  }

  TooltipFormatterConsumption(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-bolder font-14">
            <b>
              Date: <span className="font-14 golden-text">{e.payload[0].payload.DS}</span>
            </b>{' '}
            <br />
          </span>

          {e.payload[0].payload.FORCAST_FLAG == 'TRUE' ? (
            <span className="text-white font-14">
              <b>
                Consumption (Units):{' '}
                <span className="font-14" style={{ color: '#63ce46' }}>
                  {e.payload[0].payload.CONSUMPTION}
                </span>
              </b>{' '}
              <br />
            </span>
          ) : (
            <span className="text-white font-14">
              <b>
                Consumption (Units):{' '}
                <span className="font-14" style={{ color: '#1870dc' }}>
                  {e.payload[0].payload.CONSUMPTION}
                </span>
              </b>{' '}
              <br />
            </span>
          )}
          <span className="text-white font-14">
            <b>
              <span className="text-white font-14">
                {e.payload[0].payload.CURRENT_MONTH_CONSUMPTION > 0 ? (
                  <span className="text-white font-14">
                    <b>
                      Current Month Consumption:{' '}
                      <span className="font-14" style={{ color: '#1870dc' }}>
                        {e.payload[0].payload.CURRENT_MONTH_CONSUMPTION}
                      </span>
                    </b>
                  </span>
                ) : (
                  ''
                )}
              </span>
            </b>
          </span>
        </div>
      );
    }
  }
  //////////////////////////////////////////////

  TooltipTop10Org(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-bolder font-14">
            <b>
              Organization:{' '}
              <span className="font-14 golden-text">{e.payload[0].payload.ORGANIZATION}</span>
            </b>{' '}
            <br />
          </span>

          <span className="text-white font-14">
            <b>
              Material:{' '}
              <span className="font-14" style={{ color: '#63ce46' }}>
                {e.payload[0].payload.MATERIAL}
              </span>
            </b>{' '}
            <br />
          </span>

          <span className="text-white font-14">
            <b>
              Cap Gov Request :{' '}
              <span className="font-14" style={{ color: '#1870dc' }}>
                <span style={{ color: '#1870dc' }}>$</span>
                {e.payload[0].payload.CAP_GOV_REQUEST.toFixed(2).replace(
                  /(\d)(?=(\d{3})+\.)/g,
                  '$1,'
                )}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              LeadTime:{' '}
              <span className="font-14" style={{ color: '#FFA500' }}>
                {e.payload[0].payload.LeadTime}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  }

  //////////////////////////////////////////////

  TooltipFormatterStackedBar(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-bolder font-14">
            <b>
              Date: <span className="font-14 golden-text">{e.payload[0].payload.DS}</span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Actual Deliveries:{' '}
              <span className="font-14" style={{ color: '#1870dc' }}>
                {e.payload[0].payload.ACTUAL_DELIVERIES}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Current On Orders:{' '}
              <span className="font-14" style={{ color: '#fa9105' }}>
                {e.payload[0].payload.CURRENT_ON_ORDERS}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Recommended New Order:{' '}
              <span className="font-14" style={{ color: '#63ce46' }}>
                {e.payload[0].payload.RECOMMENDED_NEW_ORDER}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  }

  exportToCSV() {
    let csvData = this.state.getCapGovMaterialReport1Data;
    let fileName = `Material Report - ${this.state.material_no}`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  //dummy data end

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
  RowFormatter(cell, row) {
    return (
      <div>
        <Popover
          placement="right"
          className="modal-tool-tip"
          content={
            <span>
              {row.Description}
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
        </Popover>
      </div>
    );
  }
  DrilldownDD(e) {
    this.setState({
      material_no: e.MATERIAL,
      showModal: true
    });
    if (this.state.usercuid != null) {
      this.props.getCapGovMaterialReport1(
        e.MATERIAL,
        this.state.usercuid,
        'all',

        e.LGORT,
        parsedBlockedDeleted,
        'MATERIAL'
      );
      this.props.getCapGovInfoForMaterial1(
        e.MATERIAL,
        this.state.usercuid,
        'all',

        e.LGORT,
        parsedBlockedDeleted,
        'MATERIAL'
      );
    } else {
      this.props.getCapGovMaterialReport1(
        e.MATERIAL,
        'all',

        e.LGORT,
        parsedBlockedDeleted,
        'MATERIAL'
      );
      this.props.getCapGovInfoForMaterial1(
        e.MATERIAL,
        'all',

        e.LGORT,
        parsedBlockedDeleted,
        'MATERIAL'
      );
    }
  }
  closeModal() {
    this.setState({
      showModal: false
    });
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

  exportToCSV1() {
    let csvData = this.state.getTopSpendsByOrganizationData;
    let fileName = 'Top 10 Organization';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  infoorg() {
    if (this.state.ModalOrg == true) {
      this.setState({
        ModalOrg: false
      });
    } else {
      this.setState({
        ModalOrg: true
      });
    }
  }
  infoorg1() {
    if (this.state.ModalOrg1 == true) {
      this.setState({
        ModalOrg1: false
      });
    } else {
      this.setState({
        ModalOrg1: true
      });
    }
  }

  imploader() {
    this.setState({
      isDataFetched: false,
      newResultLength: '',
      chartData: true,
      getTopSpendsByOrganizationData: [],

      getTopSpendsByOrganizationChartData: []
    });
  }
  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.tableColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ tableColumn: columnsCopy });
  }

  render() {
    return (
      <div>
        <Row>
          <Col>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                <Card
                  title={
                    <div>
                      <Col xs={14} sm={14} md={14} lg={14} xl={14} className="pr-2 pl-2 snkrr">
                        <i className="fas fa-table mr-2" />
                        Top Organizations (By Materials)
                        <Popover placement="right" content={<span>Info</span>}>
                          <i
                            className="fas fa-info-circle info-logo-widget ml-2"
                            onClick={this.infoorg.bind(this)}
                          />{' '}
                        </Popover>
                      </Col>
                    </div>
                  }>
                  <ToolkitProvider
                    keyField="id"
                    data={this.state.getTopSpendsByOrganizationData}
                    columns={this.state.tableColumn}
                    search={{
                      afterSearch: (newResult) => {
                        if (this.state.getTopSpendsByOrganizationData != 0) {
                          if (!newResult.length) {
                            this.setState({
                              newResultLength: newResult.length
                            });
                          }
                        }
                      }
                    }}>
                    {(props) => (
                      <div>
                        <Row>
                          <Col
                            xs={24}
                            sm={24}
                            md={24}
                            lg={24}
                            xl={24}
                            className="float-right search-right">
                            {this.state.getTopSpendsByOrganizationData != 0 ? (
                              <Button
                                size="sm"
                                className="export-Btn ml-2 mr-2 mb-2 float-right"
                                onClick={this.exportToCSV1}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            ) : (
                              <Button
                                disabled
                                size="sm"
                                className="export-Btn ml-2 mr-2 mb-2 float-right"
                                onClick={this.exportToCSV1}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            )}
                            <SearchBar {...props.searchProps} />
                          </Col>
                        </Row>
                        <ReactDragListView.DragColumn
                          onDragEnd={this.onDragEnd.bind(this)}
                          nodeSelector="th">
                          <div className="capgov-table1">
                            <BootstrapTable
                              rowStyle={{ fontSize: '14px' }}
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
                </Card>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                <Row className="v4">
                  <Col>
                    <Card
                      title={
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="float-left pt-1 ">
                              <i className=" fas fa-chart-line mr-2" />
                              Top Organizations (By Materials)
                              <Popover placement="right" content={<span>Info</span>}>
                                <i
                                  className="fas fa-info-circle info-logo-widget ml-2"
                                  onClick={this.infoorg1.bind(this)}
                                />{' '}
                              </Popover>
                            </div>
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => {
                                window.document
                                  .getElementById('chart1')
                                  .setAttribute('class', 'style1');
                                exportComponentAsPNG(
                                  this.top10chart,
                                  'Top Organizations By Materials Bar Chart'
                                );
                                window.document.getElementById('chart1').setAttribute('class', '');
                              }}>
                              <i className="fas fa-image" />
                            </Button>
                          </Col>
                        </Row>
                      }>
                      {this.state.getTopSpendsByOrganizationData != '' ? (
                        <div className="" ref={this.top10chart} id="chart1">
                          <ResponsiveContainer height={464} width="100%">
                            <BarChart
                              barSize={20}
                              width={150}
                              height={60}
                              data={this.state.getTopSpendsByOrganizationData}
                              margin={{
                                top: 5,
                                right: 30,
                                left: 20,
                                bottom: 5
                              }}
                              onClick={(val) => {
                                var temp_lgort = this.state.getTopSpendsByOrganizationData.filter(
                                  (d) => d.MATERIAL === val.activeLabel
                                );

                                this.setState({
                                  showModal: true,
                                  material_no: val.activeLabel
                                });
                                this.props.getCapGovMaterialReport1(
                                  val.activeLabel,
                                  this.state.usercuid,
                                  'all',

                                  temp_lgort[0].LGORT,
                                  parsedBlockedDeleted,
                                  'MATERIAL'
                                );
                                this.props.getCapGovInfoForMaterial1(
                                  val.activeLabel,
                                  this.state.usercuid,
                                  'all',

                                  temp_lgort[0].LGORT,
                                  parsedBlockedDeleted,
                                  'MATERIAL'
                                );
                              }}
                              // ref={this.top10chart}
                              // id='chart'
                            >
                              <Bar
                                dataKey="CAP_GOV_REQUEST"
                                fill="#63ce46"
                                onClick={(val) => {
                                  var temp_lgort = this.state.getTopSpendsByOrganizationData.filter(
                                    (d) => d.MATERIAL === val.activeLabel
                                  );

                                  this.setState({
                                    showModal: true,
                                    material_no: val.MATERIAL
                                  });
                                  this.props.getCapGovMaterialReport1(
                                    val.MATERIAL,
                                    this.state.usercuid,
                                    'all',

                                    temp_lgort[0].LGORT,
                                    parsedBlockedDeleted,
                                    'MATERIAL'
                                  );
                                  this.props.getCapGovInfoForMaterial1(
                                    val.MATERIAL,
                                    this.state.usercuid,
                                    'all',

                                    temp_lgort[0].LGORT,
                                    parsedBlockedDeleted,
                                    'MATERIAL'
                                  );
                                }}>
                                {/* <LabelList
                            dataKey="ORGANIZATION"
                            style={{ fill: "red" }}
                          /> */}
                              </Bar>
                              <XAxis
                                dataKey="MATERIAL"
                                angle={-50}
                                textAnchor="end"
                                height={150}
                                interval={0}
                                stroke="#fff"
                                // stroke="#B2B1B9"
                                // onClick={(val) => {
                                //   this.setState({
                                //     showModal: true,
                                //     material_no: val.MATERIAL,
                                //   });
                                //   this.props.getCapGovMaterialReport1(val.MATERIAL);
                                //   this.props.getCapGovInfoForMaterial1(
                                //     val.MATERIAL
                                //   );
                                // }}
                              >
                                <Label
                                  value="Material"
                                  //angle="-90"
                                  style={{ textAnchor: 'middle', fill: '#fff' }}
                                  //position="bottom"
                                />
                              </XAxis>
                              <YAxis stroke="#fff">
                                <Label
                                  value="CapEx"
                                  angle="-90"
                                  style={{ textAnchor: 'middle', fill: '#fff' }}
                                  position="insideLeft"
                                  dx={-20}
                                  //dy={40}
                                />
                              </YAxis>

                              <Tooltip content={this.TooltipTop10Org} />

                              <Bar dataKey="CURRENT_MONTH_CONSUMPTION" stackId="a" fill="#1870dc" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div>
                          {this.state.chartData != true ? (
                            <div style={{ height: '465px' }}>
                              <div>
                                <div className="chart-nodata-loader">
                                  <h5>No data available for this criteria</h5>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div style={{ height: '465px' }}>
                              <div className="capgov-loader">
                                <h6>Loading</h6>
                                <div>
                                  <PropagateLoader color={'#fff'} />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </Card>
                  </Col>
                </Row>
              </Col>

              {/* <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="pr-2 pl-2"
                >
                  <Card>
                    <ResponsiveContainer height={445} width="90%">
                      <BarChart
                        width={150}
                        height={60}
                        data={this.state.getTopSpendsByOrganizationData}
                      >
                        <Bar
                          dataKey="CAP_GOV_REQUEST"
                          fill="#63ce46"
                          onClick={(val) => {
                            this.setState({
                              showModal: true,
                              material_no: val.MATERIAL,
                            });
                            this.props.getCapGovMaterialReport1(val.MATERIAL);
                            this.props.getCapGovInfoForMaterial1(val.MATERIAL);
                          }}
                        >
                          {/* <LabelList
                            dataKey="ORGANIZATION"
                            style={{ fill: "red" }}
                          /> */}
              {/* </Bar>
                        <XAxis
                          dataKey="MATERIAL"
                          angle={-50}
                          textAnchor="end"
                          height={150}
                          interval={0}
                          // onClick={this.HandleClick(data)}
                          stroke="#B2B1B9"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>
                </Col> */}
            </Row>
          </Col>
        </Row>

        <Modal
          style={{ top: 60 }}
          footer={null}
          // title={"material No" + this.state.material_no}
          className="Intervaltimeline"
          visible={this.state.showModal}
          onCancel={this.closeModal}
          width="90%"
          bodyStyle={{ padding: 0 }}>
          <Card
            title={
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  Material Report - {this.state.material_no}
                  {/* <Button
                        size="sm"
                        className="export-Btn ml-2 mr-2 float-right"
                        onClick={this.exportToCSV}
                      >
                        <i className="fas fa-file-excel" />
                      </Button>
                      <span className="view-text float-right mt-1">
                        Search:{" "}
                      </span> */}
                </Col>
              </Row>
            }>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                <Card
                  title={
                    <Row>
                      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                        <div className="float-left pt-1">Ending On Hand View</div>
                        <Button
                          size="sm"
                          className="export-Btn ml-2 mr-2 float-right"
                          onClick={() => {
                            document.getElementById('chartDD1').setAttribute('class', 'style1');
                            exportComponentAsPNG(
                              this.componentRefOnHandView,
                              `${this.state.material_no}-Ending On Hand View`
                            );
                            document.getElementById('chartDD1').setAttribute('class', '');
                          }}>
                          <i className="fas fa-image" />
                        </Button>
                      </Col>
                    </Row>
                  }>
                  {!this.props.getCapGovMaterialReport1ReducerLoader &&
                  this.props.getCapGovMaterialReport1Data.length > 0 ? (
                    <>
                      <div
                        ref={this.componentRefOnHandView}
                        id="chartDD1"
                        className="Ending_On_Hand_View tetx">
                        <ResponsiveContainer height={400} width="100%">
                          <ComposedChart
                            width={1000}
                            height={400}
                            data={this.state.getCapGovMaterialReport1Data}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0
                            }}
                            // ref={this.componentRefOnHandView}
                          >
                            <XAxis
                              dataKey="DS"
                              angle={-40}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff"
                            />
                            <YAxis yAxisId={1} orientation="left" stroke="#fff">
                              <Label
                                value="Ending On Hand (Units)"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                position="insideLeft"
                              />
                            </YAxis>
                            <YAxis yAxisId={2} orientation="right" stroke="#fff">
                              <Label
                                value="Safety stock on hand"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                position="insideRight"
                              />
                            </YAxis>
                            {/* <YAxis stroke="#fff" /> */}
                            <Tooltip content={this.TooltipFormatter} />
                            {/* <ReferenceLine y={0} stroke="#000" /> */}
                            <Bar yAxisId={1} dataKey="ON_HAND_UNITS" barSize={20}>
                              {this.state.getCapGovMaterialReport1Data.map((entry) => {
                                if (entry.FORCAST_FLAG == 'TRUE') {
                                  return <Cell fill="#63ce46" />;
                                } else if (entry.FORCAST_FLAG == 'FALSE') {
                                  return <Cell fill="#1870dc" />;
                                } else {
                                  return <Cell />;
                                }
                              })}
                            </Bar>
                            <Line
                              yAxisId={2}
                              type="monotone"
                              dataKey="MONTHS_ON_HAND"
                              stroke="#fa9105"
                            />
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>
                    </>
                  ) : (
                    <div>
                      <ResponsiveContainer height={400} width="100%">
                        {this.props.getCapGovMaterialReport1ReducerLoader ? (
                          <>
                            <div className="capgov-matnr-loader">
                              <ReusableSysncLoader />
                            </div>
                          </>
                        ) : (
                          <div className="chart-nodata-loader">
                            <NoDataTextLoader />
                          </div>
                        )}
                      </ResponsiveContainer>
                    </div>
                  )}
                </Card>
              </Col>

              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                <Row className="v4">
                  <Col>
                    <Card
                      title={
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="float-left pt-1">Forecast Consumption</div>
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => {
                                document.getElementById('chartDD3').setAttribute('class', 'style1');
                                exportComponentAsPNG(
                                  this.componentRefForecastConsumption,
                                  `${this.state.material_no}-Forecast Consumption`
                                );
                                document.getElementById('chartDD3').setAttribute('class', '');
                              }}>
                              <i className="fas fa-image" />
                            </Button>
                          </Col>
                        </Row>
                      }>
                      {/* <div id="chart">
                        <Chart options={options1} series={series1} type="bar" />
                      </div> */}
                      {!this.props.getCapGovMaterialReport1ReducerLoader &&
                      this.props.getCapGovMaterialReport1Data.length > 0 ? (
                        <>
                          <div
                            className=""
                            id="chartDD3"
                            ref={this.componentRefForecastConsumption}>
                            <ResponsiveContainer height={400} width="100%">
                              <BarChart
                                width={500}
                                height={300}
                                data={this.state.getCapGovMaterialReport1Data}
                                margin={{
                                  top: 5,
                                  right: 10,
                                  left: 0,
                                  bottom: 5
                                }}
                                // ref={this.componentRefForecastConsumption}
                              >
                                <XAxis
                                  dataKey="DS"
                                  angle={-40}
                                  textAnchor="end"
                                  height={150}
                                  interval={0}
                                  stroke="#fff"
                                />
                                <YAxis stroke="#fff">
                                  <Label
                                    value="Consumption (Units)"
                                    angle="-90"
                                    style={{ textAnchor: 'middle', fill: '#fff' }}
                                    position="insideLeft"
                                  />
                                </YAxis>
                                <Tooltip content={this.TooltipFormatterConsumption} />
                                <Bar dataKey="CONSUMPTION" stackId="a">
                                  {this.state.getCapGovMaterialReport1Data.map((entry) => {
                                    if (entry.FORCAST_FLAG == 'TRUE') {
                                      return <Cell fill="#63ce46" />;
                                    } else if (entry.FORCAST_FLAG == 'FALSE') {
                                      return <Cell fill="#1870dc" />;
                                    } else {
                                      return <Cell />;
                                    }
                                  })}
                                </Bar>
                                <Bar
                                  dataKey="CURRENT_MONTH_CONSUMPTION"
                                  stackId="a"
                                  fill="#1870dc"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </>
                      ) : (
                        <div>
                          <ResponsiveContainer height={400} width="100%">
                            {this.props.getCapGovMaterialReport1ReducerLoader ? (
                              <>
                                <div className="capgov-matnr-loader">
                                  <ReusableSysncLoader />
                                </div>
                              </>
                            ) : (
                              <div className="chart-nodata-loader">
                                <NoDataTextLoader />
                              </div>
                            )}
                          </ResponsiveContainer>
                        </div>
                      )}
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                <Row className="v4">
                  <Col>
                    <Card
                      className="card-height"
                      title={
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="float-left pt-1">Quantity To Order</div>
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => {
                                document.getElementById('chartDD4').setAttribute('class', 'style1');
                                exportComponentAsPNG(
                                  this.componentRefQuantityToOrder,
                                  `${this.state.material_no}-Quantity To Order`
                                );
                                document.getElementById('chartDD4').setAttribute('class', '');
                              }}>
                              <i className="fas fa-image" />
                            </Button>
                          </Col>
                        </Row>
                      }>
                      {/* <div id="chart">
                        <Chart
                          options={options2}
                          series={series2}
                          type="bar"
                          height="350"
                          width="100%"
                        />
                      </div> */}
                      {!this.props.getCapGovMaterialReport1ReducerLoader &&
                      this.props.getCapGovMaterialReport1Data.length > 0 ? (
                        <div className="" ref={this.componentRefQuantityToOrder} id="chartDD4">
                          <div className="text-center pd-2 chart-legend">
                            <span>
                              <i className="fas fa-circle total-trend ml-2" /> - ACTUAL_DELIVERIES
                            </span>
                            <span>
                              <i className="fas fa-circle predicted-consumption ml-2" />{' '}
                              CURRENT_ON_ORDERS
                            </span>
                            <span>
                              <i className="fas fa-circle predict-capex ml-2" />{' '}
                              RECOMMENDED_NEW_ORDER
                            </span>
                          </div>
                          <ResponsiveContainer height={360} width="100%">
                            <BarChart
                              width={500}
                              height={360}
                              data={this.state.getCapGovMaterialReport1Data}
                              margin={{
                                top: 10,
                                right: 0,
                                left: 0,
                                bottom: 0
                              }}
                              // ref={this.componentRefQuantityToOrder}
                            >
                              <XAxis
                                dataKey="DS"
                                angle={-40}
                                textAnchor="end"
                                height={150}
                                interval={0}
                                stroke="#fff"
                              />
                              <YAxis stroke="#fff">
                                {' '}
                                <Label
                                  value="WareHouse Inbound"
                                  angle="-90"
                                  style={{
                                    textAnchor: 'middle',
                                    fill: '#fff'
                                  }}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <Tooltip content={this.TooltipFormatterStackedBar} />

                              <Bar dataKey="ACTUAL_DELIVERIES" stackId="a" fill="#1870dc" />
                              <Bar dataKey="CURRENT_ON_ORDERS" stackId="a" fill="#fa9105" />
                              <Bar dataKey="RECOMMENDED_NEW_ORDER" stackId="a" fill="#63ce46" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div>
                          <ResponsiveContainer height={400} width="100%">
                            {this.props.getCapGovMaterialReport1ReducerLoader ? (
                              <>
                                <div className="capgov-matnr-loader">
                                  <ReusableSysncLoader />
                                </div>
                              </>
                            ) : (
                              <div className="chart-nodata-loader">
                                <NoDataTextLoader />
                              </div>
                            )}
                          </ResponsiveContainer>
                        </div>
                      )}
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                {!this.props.getCapGovInfoForMaterial1ReducerLoader &&
                this.props.getCapGovMaterialReport1Data != '' ? (
                  <div>{this.state.infoMaterialView}</div>
                ) : (
                  <div>
                    <Row className="v4">
                      <Col>
                        <Card
                          bodyStyle={{ height: '500px' }}
                          title={
                            <Row>
                              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                                <div className="float-left">infoMaterialView</div>
                                <Button
                                  size="sm"
                                  className="export-Btn ml-2 mr-2 float-right"
                                  onClick={() =>
                                    exportComponentAsPNG(this.componentRefQuantityToOrder)
                                  }>
                                  <i className="fas fa-image" />
                                </Button>
                              </Col>
                            </Row>
                          }>
                          <ResponsiveContainer height={400} width="100%">
                            <div>
                              {this.props.getCapGovInfoForMaterial1ReducerLoader === true ? (
                                <div className="capgov-matnr-loader">
                                  <ReusableSysncLoader />
                                </div>
                              ) : (
                                <div>
                                  <NoDataTextLoader />
                                </div>
                              )}
                            </div>
                          </ResponsiveContainer>
                        </Card>
                      </Col>
                    </Row>
                  </div>
                )}
              </Col>
            </Row>
          </Card>
        </Modal>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Top 10 Organizations (By Materials)</div>}
          className="Intervaltimeline"
          visible={this.state.ModalOrg}
          onCancel={this.infoorg.bind(this)}>
          <div>
            <p>
              <ul>
                <li>
                  <strong>Top 10 Organizations (By Materials)</strong>
                  <br />
                  <ul>
                    <li>
                      Top material from each organization in terms of Cap Gov request for material.
                    </li>
                    <br />
                    <li> Report is generated from Cap Gov report</li>
                  </ul>
                </li>
              </ul>
            </p>
          </div>
        </Modal>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Top 10 Organizations (By Materials)</div>}
          className="Intervaltimeline"
          visible={this.state.ModalOrg1}
          onCancel={this.infoorg1.bind(this)}>
          <div>
            <p>
              <ul>
                <li>
                  <strong>Top 10 Organizations (By Materials)</strong>
                  <br />
                  <ul>
                    <li>
                      Top material from each organization in terms of Cap Gov request for material.
                    </li>
                    <br />
                    <li> Report is generated from Cap Gov report</li>
                  </ul>
                </li>
              </ul>
            </p>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  return {
    getTopSpendsByOrganizationData: state.getTopSpendsByOrganization,
    getCapGovMaterialReport1Data: state.getCapGovMaterialReport1,
    getCapGovMaterialReport1ReducerLoader: state.getCapGovMaterialReport1ReducerLoader,
    getCapGovInfoForMaterial1Data: state.getCapGovInfoForMaterial1,
    getCapGovInfoForMaterial1ReducerLoader: state.getCapGovInfoForMaterial1ReducerLoader,
    getTopSpendsByOrganizationChartData: state.getTopSpendsByOrganizationChart,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails
  };
}

export default connect(mapState, {
  getUserImpersonationDetails,
  getTopSpendsByOrganizationChart,
  getTopSpendsByOrganization,
  getCapGovMaterialReport1,

  getCapGovInfoForMaterial1
})(CapGovOrganization);
