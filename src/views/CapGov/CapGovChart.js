import React from 'react';
import { connect } from 'react-redux';

// import Chart from "react-apexcharts";
import {
  ComposedChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Bar,
  BarChart,
  Tooltip
} from 'recharts';
import { Row, Col, Card, Modal, Button, TreeSelect, Popover } from 'antd';
import {
  getCapGovMaterialReport,
  getCapGovInfoForMaterial,
  getCapGovMaterialReportDD,
  getUserImpersonationDetails,
  getDefaultMaterialCapGov
} from '../../actions';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';
import { calculation } from '../Calculation';

const { TreeNode } = TreeSelect;
import PropagateLoader from 'react-spinners/PropagateLoader';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
var parsedFilterSettingsLGORT;

let parsedBlockedDeleted;

class CapGovChart extends React.Component {
  constructor(props) {
    super(props);
    this.imploader = this.imploader.bind(this);
    this.handleMaterialChange = this.handleMaterialChange.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.componentRefOnHandView = React.createRef();
    this.componentRefForecastConsumption = React.createRef();
    this.componentRefQuantityToOrder = React.createRef();
    this.state = {
      EOHV_Chart: true,
      getUserImpersonationDetailsData: [],
      usercuid: 'ALL',

      getCapGovMaterialReportData: [],

      getCapGovMaterialReportDDData: [],
      monthsOnHandData: '',
      material_no: '',
      LGORT: '',
      ACTUAL_DELIVERIES: [],
      CURRENT_ON_ORDERS: [],
      RECOMMENDED_NEW_ORDER: [],
      ON_HAND_UNITS: [],
      MONTHS_ON_HAND: [],
      FORCAST_FLAG_ColorCode: [],
      DS: [],
      FORCAST_FLAG: [],
      CONSUMPTION: [],
      isDatafetched: false,
      dataupdated: false,
      getCapGovInfoForMaterialData: [],
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
      ModalEnd: false,
      ModalForecast: false,
      ModalQuantity: false,
      Quant1: 'When Current month Ending on Hand < Safety Stock :   ',
      Quant2: 'When Current month Ending on Hand > Safety Stock :',
      Quant3: '  Quantity to Order = 0',
      Quant4:
        'Quantity to Order = (Current Month Forecast + Safety Stock) - (Last Month Ending on Hand + Current Month Open PO + Current Inventory)'
    };
  }

  componentDidMount() {
    // getCapGovInfoForMaterial,
    // getCapGovMaterialReport
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.imploader();
        const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

        parsedFilterSettingsLGORT = JSON.parse(filterSettingsOrg)[0].LGORT;
        parsedBlockedDeleted = JSON.parse(filterSettingsOrg)[0].BlockedDeleted;
        this.setState({
          organization: nextProps.getUserImpersonationDetailsData[0].FilterSetting,
          usercuid: nextProps.getUserImpersonationDetailsData[0].loggedcuid
        });
      }
    }

    if (this.props.getCapGovMaterialReportDDData != nextProps.getCapGovMaterialReportDDData) {
      if (nextProps.getCapGovMaterialReportDDData != 0) {
        this.setState({
          getCapGovMaterialReportDDData: nextProps.getCapGovMaterialReportDDData
        });
      } else {
        this.setState({
          getCapGovMaterialReportDDData: []
        });
      }
    }
    //new matnr dd
    if (this.props.getDefaultMaterialCapGovData != nextProps.getDefaultMaterialCapGovData) {
      if (nextProps.getDefaultMaterialCapGovData != 0) {
        this.setState({
          defaultValueDD: nextProps.getDefaultMaterialCapGovData[0].MATNR,
          material_no: nextProps.getDefaultMaterialCapGovData[0].MATNR,
          LGORT: nextProps.getDefaultMaterialCapGovData[0].LGORT
        });
      }
    }

    if (this.props.getCapGovInfoForMaterialData != nextProps.getCapGovInfoForMaterialData) {
      if (nextProps.getCapGovInfoForMaterialData != 0) {
        if (nextProps.getCapGovInfoForMaterialData[0].Harvesting) {
          var a = nextProps.getCapGovInfoForMaterialData[0].Harvesting;
          var split_Val = a.split('/');
          var res = [];

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
                          {nextProps.getCapGovInfoForMaterialData[0].InstallBase}
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
                          {calculation(nextProps.getCapGovInfoForMaterialData[0].Redeploy_Value)}
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
                          {nextProps.getCapGovInfoForMaterialData[0].Begin}
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
                          {nextProps.getCapGovInfoForMaterialData[0].Less}
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
                          {nextProps.getCapGovInfoForMaterialData[0].Add}
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
                          {nextProps.getCapGovInfoForMaterialData[0].Gross_New_Need}
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
                          {nextProps.getCapGovInfoForMaterialData[0].Add_MOH_Adjust}
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
                          {nextProps.getCapGovInfoForMaterialData[0].Net_New_Need}
                        </div>
                      </Col>
                    </Row>
                    <Row className="mt-5 margin-change">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17">Cap Gov Request:</div>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                        <div className="font-17 text-right">
                          {calculation(nextProps.getCapGovInfoForMaterialData[0].CapGov_Request)}
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

    if (this.props.getCapGovMaterialReportData != nextProps.getCapGovMaterialReportData) {
      if (nextProps.getCapGovMaterialReportData != 0) {
        this.setState({
          getCapGovMaterialReportData: nextProps.getCapGovMaterialReportData,

          DS: nextProps.getCapGovMaterialReportData.map((data) => data.DS),
          ON_HAND_UNITS: nextProps.getCapGovMaterialReportData.map((data) => data.ON_HAND_UNITS),
          MONTHS_ON_HAND: nextProps.getCapGovMaterialReportData.map((data) => data.MONTHS_ON_HAND),
          FORCAST_FLAG_ColorCode: nextProps.getCapGovMaterialReportData.map(
            (data) => data.FORCAST_FLAG_ColorCode
          ),

          CONSUMPTION: nextProps.getCapGovMaterialReportData.map((data) => data.CONSUMPTION),
          CURRENT_ON_ORDERS: nextProps.getCapGovMaterialReportData.map(
            (data) => data.CURRENT_ON_ORDERS
          ),
          RECOMMENDED_NEW_ORDER: nextProps.getCapGovMaterialReportData.map(
            (data) => data.RECOMMENDED_NEW_ORDER
          ),

          ACTUAL_DELIVERIES: nextProps.getCapGovMaterialReportData.map(
            (data) => data.ACTUAL_DELIVERIES
          )
        });
      } else {
        this.setState({
          getCapGovMaterialReportData: [],
          EOHV_Chart: false
        });
      }
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

  handleMaterialChange(e) {
    if (parsedFilterSettingsLGORT != 'ALL') {
      if (isNaN(Number(e))) {
        return;
      } else {
        this.setState({ material_no: e, LGORT: parsedFilterSettingsLGORT });
        if (this.state.usercuid != null) {
          this.props.getCapGovMaterialReport(
            e,
            this.state.usercuid,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            'MATERIAL'
          );
          this.props.getCapGovInfoForMaterial(
            e,
            this.state.usercuid,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            'MATERIAL'
          );
        } else {
          this.props.getCapGovMaterialReport(
            e,
            'all',
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            'MATERIAL'
          );
          this.props.getCapGovInfoForMaterial(
            e,
            'all',
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            'MATERIAL'
          );
        }
      }
    } else {
      // if (isNaN(Number(e))) {
      //   return;
      // } else {
      this.setState({ material_no: e.slice(0, -4), LGORT: e.slice(-4) });
      if (this.state.usercuid != null) {
        this.props.getCapGovMaterialReport(
          e.slice(0, -4),
          this.state.usercuid,
          'all',

          e.slice(-4),
          parsedBlockedDeleted,
          'MATERIAL'
        );
        this.props.getCapGovInfoForMaterial(
          e.slice(0, -4),
          this.state.usercuid,
          'all',

          e.slice(-4),
          parsedBlockedDeleted,
          'MATERIAL'
        );
      } else {
        this.props.getCapGovMaterialReport(
          e.slice(0, -4),
          'all',
          'all',

          e.slice(-4),
          parsedBlockedDeleted,
          'MATERIAL'
        );
        this.props.getCapGovInfoForMaterial(
          e.slice(0, -4),
          'all',
          'all',

          e.slice(-4),
          parsedBlockedDeleted,
          'MATERIAL'
        );
      }
    }
  }
  // }

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
                      Current Month Consumption:
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
    let csvData = this.state.getCapGovMaterialReportData;
    let fileName = `${this.state.material_no} (${this.state.LGORT}) - Cap gov report`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  infoEnd() {
    if (this.state.ModalEnd == true) {
      this.setState({
        ModalEnd: false
      });
    } else {
      this.setState({
        ModalEnd: true
      });
    }
  }
  infoForecast() {
    if (this.state.ModalForecast == true) {
      this.setState({
        ModalForecast: false
      });
    } else {
      this.setState({
        ModalForecast: true
      });
    }
  }
  infoQuan() {
    if (this.state.ModalQuantity == true) {
      this.setState({
        ModalQuantity: false
      });
    } else {
      this.setState({
        ModalQuantity: true
      });
    }
  }
  imploader() {
    this.setState({
      EOHV_Chart: true,
      getCapGovMaterialReportData: []
    });
  }
  render() {
    // const series = [
    //   {
    //     name: "On-Hand(unit)",
    //     type: "column",
    //     data: this.state.ON_HAND_UNITS,
    //   },
    //   {
    //     name: "Months-On-Hand",
    //     type: "line",
    //     data: this.state.MONTHS_ON_HAND,
    //   },
    // ];

    // const options = {
    //   chart: {
    //     height: 150,
    //     type: "line",
    //   },
    //   stroke: {
    //     width: [0, 4],
    //     curve: "straight",
    //     dashArray: [0, 8, 5],
    //     colors: ["#FF0000"],
    //   },

    //   fill: {
    //     colors: [
    //       // this.state.FORCAST_FLAG_ColorCode
    //       function ({ value, seriesIndex, w }) {
    //         if (value < 1) {
    //           return "#63ce46";
    //         } else {
    //           return "#1870dc";
    //         }
    //       },
    //     ],
    //   },

    //   labels: this.state.DS,

    //   yaxis: [
    //     {
    //       title: {
    //         text: "On-Hand(Units)",
    //       },
    //     },
    //     {
    //       opposite: true,
    //       title: {
    //         text: "Month-On-Hand",
    //       },
    //     },
    //   ],
    //   tooltip: {
    //     shared: true,
    //     intersect: false,
    //     y: {
    //       formatter: function (y) {
    //         if (typeof y !== "undefined") {
    //           return y.toFixed(0) + " points";
    //         }
    //         return y;
    //       },
    //     },
    //   },
    // };

    // const series1 = [
    //   {
    //     name: "Consumption",
    //     type: "column",
    //     data: this.state.CONSUMPTION,
    //   },
    // ];
    // const options1 = {
    //   chart: {
    //     height: 350,
    //   },

    //   colors: [this.state.FORCAST_FLAG_ColorCode],
    //   fill: {
    //     colors: [
    //       function ({ value, seriesIndex, w }) {
    //         if (value < 65) {
    //           return "#63ce46";
    //         } else {
    //           return "#1870dc";
    //         }
    //       },
    //     ],
    //   },
    //   labels: this.state.DS,
    //   yaxis: [
    //     {
    //       title: {
    //         text: "Consumption",
    //       },
    //     },
    //   ],
    //   tooltip: {
    //     shared: true,
    //     intersect: false,
    //     y: {
    //       formatter: function (y) {
    //         if (typeof y !== "undefined") {
    //           return y.toFixed(0) + " points";
    //         }
    //         return y;
    //       },
    //     },
    //   },
    // };

    // const series2 = [
    //   {
    //     name: "ACTUAL_DELIVERIES",
    //     data: this.state.ACTUAL_DELIVERIES,
    //   },
    //   {
    //     name: "CURRENT_ON_ORDERS",
    //     data: this.state.CURRENT_ON_ORDERS,
    //   },
    //   {
    //     name: "RECOMMENDED_NEW_ORDER",
    //     data: this.state.RECOMMENDED_NEW_ORDER,
    //   },
    // ];
    // const options2 = {
    //   chart: {
    //     type: "bar",
    //     height: 350,
    //     stacked: true,
    //     toolbar: {
    //       show: true,
    //     },
    //     zoom: {
    //       enabled: true,
    //     },
    //   },
    //   responsive: [
    //     {
    //       breakpoint: 480,
    //       options: {
    //         legend: {
    //           position: "bottom",
    //           offsetX: -10,
    //           offsetY: 0,
    //         },
    //       },
    //     },
    //   ],
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       borderRadius: 10,
    //     },
    //   },
    //   labels: this.state.DS,

    //   yaxis: [
    //     {
    //       title: {
    //         text: "Wareouse Inbound(Units)",
    //       },
    //     },
    //   ],
    //   fill: {
    //     opacity: 1,
    //   },
    // };

    return (
      <Row className="v4 pl-2 pr-2">
        <Col>
          <Card>
            <Row className="mt-1 ">
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <span className="tblHeader ml-3 mt-4">
                  <i className="fas fa-book-open"></i>
                  Material Report - {this.state.material_no} ({this.state.LGORT})
                </span>
                <Button
                  size="sm"
                  className="export-Btn ml-2 mr-2 float-right"
                  onClick={this.exportToCSV}>
                  <i className="fas fa-file-excel" />
                </Button>
                {parsedFilterSettingsLGORT != 'ALL' ? (
                  <TreeSelect
                    showSearch
                    style={{ width: '20%', fontSize: 16, color: 'white' }}
                    defaultValue={this.state.defaultValueDD}
                    value={this.state.material_no}
                    placeholder={this.state.defaultValueDD}
                    allowClear={false}
                    treeDefaultExpandAll
                    onChange={this.handleMaterialChange}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    className="text-select-form float-right mr-4 capgov-select">
                    {this.state.getCapGovMaterialReportDDData.map((val1, ind1) => (
                      <TreeNode value={val1.Material} title={val1.Material} key={ind1} />
                    ))}
                  </TreeSelect>
                ) : (
                  <TreeSelect
                    showSearch
                    style={{ width: '20%', fontSize: 16, color: 'white' }}
                    defaultValue={this.state.defaultValueDD}
                    value={this.state.material_no}
                    placeholder={this.state.defaultValueDD}
                    allowClear={false}
                    treeDefaultExpandAll
                    onChange={this.handleMaterialChange}
                    getPopupContainer={(trigger) => trigger.parentNode}
                    className="text-select-form float-right mr-4 capgov-select">
                    {this.state.getCapGovMaterialReportDDData.map((val1, ind1) => (
                      <TreeNode
                        value={`${val1.Material + val1.LGORT}`}
                        title={`${val1.Material} - ${val1.LGORT}`}
                        key={ind1}
                      />
                    ))}
                  </TreeSelect>
                )}
                <span className="tblHeader float-right mt-1">Search: </span>
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                <Row className="v4">
                  <Col>
                    <Card
                      title={
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="float-left pt-1">
                              Ending On Hand View
                              <Popover placement="right" content={<span>Info</span>}>
                                <i
                                  className="fas fa-info-circle info-logo-widget ml-2"
                                  onClick={this.infoEnd.bind(this)}
                                />
                              </Popover>
                            </div>

                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => {
                                document.getElementById('chart2').setAttribute('class', 'style1');
                                exportComponentAsPNG(
                                  this.componentRefOnHandView,
                                  `${this.state.material_no} (${this.state.LGORT})-Ending On Hand View`
                                );
                                document.getElementById('chart2').setAttribute('class', '');
                              }}>
                              <i className="fas fa-image" />
                            </Button>
                          </Col>
                        </Row>
                      }>
                      {/* <div id="chart">
                        <Chart options={options} series={series} />
                      </div> */}
                      {!this.props.getCapGovMaterialReportLoaderReducer &&
                      this.state.getCapGovMaterialReportData != '' ? (
                        <div
                          ref={this.componentRefOnHandView}
                          id="chart2"
                          className="Ending_On_Hand_View">
                          <ResponsiveContainer height={400} width="100%">
                            <ComposedChart
                              width={1000}
                              height={400}
                              data={this.state.getCapGovMaterialReportData}
                              margin={{
                                top: 10,
                                right: 10,
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
                              <YAxis
                                yAxisId={1}
                                orientation="left"
                                // label={{
                                //   value: "Ending On Hand (Units)",
                                //   angle: -90,
                                //   position:'outside',
                                //   color:'white'
                                // }}
                                stroke="#fff">
                                <Label
                                  value="Ending On Hand (Units)"
                                  angle="-90"
                                  style={{ textAnchor: 'middle', fill: '#fff' }}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <YAxis
                                yAxisId={2}
                                orientation="right"
                                // label={{
                                //   value: "Safety stock on hand",
                                //   angle: -90,
                                //   color:'black'
                                // }}
                                stroke="#fff">
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
                                {this.state.getCapGovMaterialReportData.map((entry) => {
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
                                stroke={
                                  localStorage.getItem('theme') === 'White' ? '#fa9105' : '#ffffff'
                                }
                              />
                            </ComposedChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div>
                          <ResponsiveContainer height={400} width="100%">
                            {this.props.getCapGovMaterialReportLoaderReducer === true ? (
                              <div>
                                <div className="capgov-matnr-loader">
                                  <ReusableSysncLoader />
                                </div>
                              </div>
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
                <Row className="v4">
                  <Col>
                    <Card
                      title={
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="float-left pt-1">
                              Forecast Consumption
                              <Popover placement="right" content={<span>Info</span>}>
                                <i
                                  className="fas fa-info-circle info-logo-widget ml-2"
                                  onClick={this.infoForecast.bind(this)}
                                />
                              </Popover>
                            </div>

                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => {
                                document.getElementById('chart3').setAttribute('class', 'style1');
                                exportComponentAsPNG(
                                  this.componentRefForecastConsumption,
                                  `${this.state.material_no} (${this.state.LGORT}) -Forecast Consumption`
                                );
                                document.getElementById('chart3').setAttribute('class', '');
                              }}>
                              <i className="fas fa-image" />
                            </Button>
                          </Col>
                        </Row>
                      }>
                      {/* <div id="chart">
                        <Chart options={options1} series={series1} type="bar" />
                      </div> */}
                      {/* <ResponsiveContainer height={400} width="100%">
                        <BarChart
                          width={500}
                          height={300}
                          data={this.state.getCapGovMaterialReportData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                          ref={this.componentRefForecastConsumption}
                        >
                          <XAxis
                            dataKey="DS"
                            angle={-40}
                            textAnchor="end"
                            height={150}
                            interval={0}
                            stroke="#B2B1B9"
                          />
                          <YAxis
                            label={{ value: "Consumption (Units)", angle: -90 }}
                            stroke="#B2B1B9"
                          />

                          <Tooltip content={this.TooltipFormatterConsumption} />

                          <Bar dataKey="CONSUMPTION" barSize={20}>
                            {this.state.getCapGovMaterialReportData.map(
                              (entry) => {
                                if (entry.FORCAST_FLAG == "TRUE") {
                                  return <Cell fill="#63ce46" />;
                                } else if (entry.FORCAST_FLAG == "FALSE") {
                                  return <Cell fill="#1870dc" />;
                                } else {
                                  return <Cell />;
                                }
                              }
                            )}
                          </Bar>
                          <Bar
                            barSize={20}
                            dataKey="CURRENT_MONTH_CONSUMPTION"
                            stackId="a"
                            fill="#fff"
                          />
                        </BarChart>
                      </ResponsiveContainer> */}
                      {!this.props.getCapGovMaterialReportLoaderReducer &&
                      this.state.getCapGovMaterialReportData != '' ? (
                        <div ref={this.componentRefForecastConsumption} id="chart3">
                          <ResponsiveContainer height={400} width="100%">
                            <BarChart
                              height={300}
                              width={300}
                              data={this.state.getCapGovMaterialReportData}
                              margin={{
                                top: 10,
                                right: 0,
                                left: 10,
                                bottom: 0
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
                              <YAxis
                                // label={{
                                //   value: "Consumption (Units)",
                                //   angle: -90,
                                // }}
                                stroke="#fff">
                                <Label
                                  value="Consumption (Units)"
                                  angle="-90"
                                  style={{ textAnchor: 'middle', fill: '#fff' }}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <Tooltip content={this.TooltipFormatterConsumption} />

                              <Bar dataKey="CONSUMPTION" stackId="a">
                                {this.state.getCapGovMaterialReportData.map((entry) => {
                                  if (entry.FORCAST_FLAG == 'TRUE') {
                                    return <Cell fill="#63ce46" />;
                                  } else if (entry.FORCAST_FLAG == 'FALSE') {
                                    return <Cell fill="#1870dc" />;
                                  } else {
                                    return <Cell />;
                                  }
                                })}
                              </Bar>
                              <Bar dataKey="CURRENT_MONTH_CONSUMPTION" stackId="a" fill="#1870dc" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div>
                          <ResponsiveContainer height={400} width="100%">
                            {this.props.getCapGovMaterialReportLoaderReducer === true ? (
                              <div>
                                <div className="capgov-matnr-loader">
                                  <ReusableSysncLoader />
                                </div>
                              </div>
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
                      title={
                        <Row>
                          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                            <div className="float-left pt-1">
                              Quantity To Order
                              <Popover placement="right" content={<span>Info</span>}>
                                <i
                                  className="fas fa-info-circle info-logo-widget ml-2"
                                  onClick={this.infoQuan.bind(this)}
                                />
                              </Popover>
                            </div>

                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => {
                                document.getElementById('chart4').setAttribute('class', 'style1');
                                exportComponentAsPNG(
                                  this.componentRefQuantityToOrder,
                                  `${this.state.material_no} (${this.state.LGORT}) -Quantity To Order`
                                );
                                document.getElementById('chart4').setAttribute('class', '');
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
                      <div ref={this.componentRefQuantityToOrder} id="chart4">
                        {this.state.getCapGovMaterialReportData != '' ? (
                          <div className="text-center pd-2 chart-legend">
                            <span>
                              <i className="fas fa-circle total-trend ml-2" /> - Actual Deliveries
                            </span>
                            <span>
                              <i className="fas fa-circle predicted-consumption ml-2" /> - Current
                              On Orders
                            </span>
                            <span>
                              <i className="fas fa-circle predict-capex ml-2" /> - Recommended New
                              Order
                            </span>
                          </div>
                        ) : (
                          ''
                        )}
                        {!this.props.getCapGovMaterialReportLoaderReducer &&
                        this.state.getCapGovMaterialReportData.length > 0 ? (
                          <ResponsiveContainer height={365} width="100%">
                            <BarChart
                              width={500}
                              height={365}
                              data={this.state.getCapGovMaterialReportData}
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
                              <YAxis
                                // label={{
                                //   value: "WareHouse Inbound(Units)",
                                //   angle: -90,
                                // }}
                                stroke="#fff">
                                <Label
                                  value="WareHouse Inbound"
                                  angle="-90"
                                  style={{ textAnchor: 'middle', fill: '#fff' }}
                                  position="insideLeft"
                                />
                              </YAxis>
                              <Tooltip content={this.TooltipFormatterStackedBar} />
                              {/* <Legend verticalAlign="bottom" /> */}
                              <Bar dataKey="ACTUAL_DELIVERIES" stackId="a" fill="#1870dc" />
                              <Bar dataKey="CURRENT_ON_ORDERS" stackId="a" fill="#fa9105" />
                              <Bar dataKey="RECOMMENDED_NEW_ORDER" stackId="a" fill="#63ce46" />
                            </BarChart>
                          </ResponsiveContainer>
                        ) : (
                          <div>
                            <ResponsiveContainer height={400} width="100%">
                              {this.props.getCapGovMaterialReportLoaderReducer === true ? (
                                <div>
                                  <div className="capgov-matnr-loader">
                                    <ReusableSysncLoader />
                                  </div>
                                </div>
                              ) : (
                                <div className="chart-nodata-loader">
                                  <NoDataTextLoader />
                                </div>
                              )}
                            </ResponsiveContainer>
                          </div>
                        )}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                {!this.props.getCapGovInfoForMaterialLoaderReducer &&
                this.state.getCapGovMaterialReportData != '' ? (
                  <div>{this.state.infoMaterialView}</div>
                ) : (
                  <div>
                    <Row className="v4">
                      <Col>
                        <Card
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
                              {this.props.getCapGovInfoForMaterialLoaderReducer === true ? (
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
          <Modal
            style={{ top: 60 }}
            footer={null}
            title={<div>Ending On Hand View</div>}
            className="Intervaltimeline"
            visible={this.state.ModalEnd}
            onCancel={this.infoEnd.bind(this)}>
            <div>
              <p>
                <ul>
                  <li>
                    <strong>Ending On Hand View</strong>
                    <ul>
                      <li>
                        Monthly ending on hand quantity for materials. We try to maintain Ending on
                        Hand as Safety Stock.
                      </li>
                      <li>
                        Ending on Hand = (Last Month Ending on Hand + Current Month Open PO +
                        Recommended PO + Current Inventory) - Current Month Forecast
                      </li>
                    </ul>
                  </li>
                </ul>
              </p>

              <div className="eoh"></div>
            </div>
          </Modal>
          <Modal
            style={{ top: 60 }}
            footer={null}
            title={<div>Forecast Consumption</div>}
            className="Intervaltimeline"
            visible={this.state.ModalForecast}
            onCancel={this.infoForecast.bind(this)}>
            <div>
              <p>
                <ul>
                  <li>
                    <strong>Forecast Consumption</strong>
                    <br />
                    <ul>
                      <li>
                        Bo distribution - open back orders quantity distributed on the forecast,
                        based on historical back orders delivery
                      </li>
                      <span></span>
                      <li>When an overwritten forecast is available:</li>
                      <span className="pl-3">Forecast = overwritten forecast</span>
                      <br />
                      <li>When an overwritten forecast is not available:</li>
                      <span className="pl-3">Forecast = iIM Forecast + Bo distribution</span>
                    </ul>
                  </li>
                </ul>
              </p>
            </div>
          </Modal>
          <Modal
            style={{ top: 60 }}
            footer={null}
            title={<div>Quantity To Order</div>}
            className="Intervaltimeline"
            visible={this.state.ModalQuantity}
            onCancel={this.infoQuan.bind(this)}>
            <div>
              <ul>
                <li>
                  <p>
                    <strong>
                      Monthly quantity to order recommendation based on demand forecast and
                      inventory and place POs
                    </strong>
                  </p>
                  <ul>
                    <li>{this.state.Quant2}</li>
                    <span className="ml-3">{this.state.Quant3}</span>
                    <br />
                    <br />
                    <li>{this.state.Quant1}</li>
                    <span className="ml-3">{this.state.Quant4}</span>
                  </ul>
                </li>
              </ul>

              <div className="qto" />
            </div>
          </Modal>
        </Col>
      </Row>
    );
  }
}
function mapState(state) {
  return {
    getCapGovMaterialReportData: state.getCapGovMaterialReport,
    getCapGovMaterialReportLoaderReducer: state.getCapGovMaterialReportLoaderReducer,
    getCapGovInfoForMaterialData: state.getCapGovInfoForMaterial,
    getCapGovInfoForMaterialLoaderReducer: state.getCapGovInfoForMaterialLoaderReducer,
    getCapGovMaterialReportDDData: state.getCapGovMaterialReportDD,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    getDefaultMaterialCapGovData: state.getDefaultMaterialCapGov
  };
}

export default connect(mapState, {
  getDefaultMaterialCapGov,
  getUserImpersonationDetails,
  getCapGovMaterialReportDD,
  getCapGovMaterialReport,
  getCapGovInfoForMaterial
})(CapGovChart);
