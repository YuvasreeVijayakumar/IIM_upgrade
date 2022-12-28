import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { Row, Col, Card, Modal, Tabs, Button, Radio, Switch, Popover } from 'antd';
import Odometer from 'react-odometerjs';
import Chart from 'react-apexcharts';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Label,
  Brush
} from 'recharts';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropagateLoader from 'react-spinners/PropagateLoader';

import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';

import {
  getStockPercent,
  getPredictedCapEx,
  getFillRate,
  getWidgetDDData,
  getSupplierEfficiency,
  getSuppEfficiencyChart,
  getFillRateOverStockChart,
  getFillRateUnderStockChart,
  getPredictedChart,
  getPredictedCapExDD,
  getUserImpersonationDetails,
  getCurrentInventoryCapexManufDD
} from '../../actions';
import { calculation } from '../Calculation';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactDragListView from 'react-drag-listview';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const { SearchBar } = Search;
const { TabPane } = Tabs;
var parsedFilterSettingsLGORT;

let parsedBlockedDeleted;

class Widget extends Component {
  constructor(props) {
    super(props);
    this.materialDescription = this.materialDescription.bind(this);
    this.imploader = this.imploader.bind(this);
    this.onclickWidget = this.onclickWidget.bind(this);
    this.costformat = this.costformat.bind(this);
    this.stockFormatter = this.stockFormatter.bind(this);
    this.rankFormatter = this.rankFormatter.bind(this);
    this.boxplotDD = this.boxplotDD.bind(this);
    this.formatXAxis - this.formatXAxis.bind(this);
    this.TooltipFormatter = this.TooltipFormatter.bind(this);
    this.StockChartDD = this.StockChartDD.bind(this);
    this.onclickDD = this.onclickDD.bind(this);
    this.TooltipFormatterOne = this.TooltipFormatterOne.bind(this);
    this.sortFunc = this.sortFunc.bind(this);
    this.dateformat = this.dateformat.bind(this);
    this.infoDD = this.infoDD.bind(this);
    this.onClickChartDD = this.onClickChartDD.bind(this);
    this.chartView = this.chartView.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.avgpredictCapex = this.avgpredictCapex.bind(this);
    this.moneyFormat = this.moneyFormat.bind(this);
    this.switchChange = this.switchChange.bind(this);
    this.switchChangeManufacturer = this.switchChangeManufacturer.bind(this);
    this.state = {
      usercuid: 'ALL',
      MatMufTabShow: false,
      switchChecked: true,
      switchCheckedManufacturer: true,
      curInv: false,
      logrt: '',
      count: 0,
      GetUserImpersonationDetailsData: [],
      ChartDDModal: false,
      openChartModal: false,
      openModal: false,
      openAvgPredictedCapexModal: false,
      chartModal: false,
      stockChartModal: false,
      tableDDData: [],
      tblColumn: [{ text: '' }],
      OverStockData: [],
      UnderStockData: [],
      OverStockColumn: [{ text: '' }],
      UnderStockColumn: [{ text: '' }],
      budgetSpend: 0,
      predictedSpend: 0,
      overStock: 0,
      underStock: 0,
      outstandingOrders: 0,
      overdue: 0,
      cost: 0,
      predictedQty: 0,
      potentialsaving: 0,
      ystrdyinventory: 0,
      ystrdyinventorycapex: 0,
      currentinventorycapex: 0,
      currentinventory: 0,
      totalinventory: 0,
      totalinventorycost: 0,
      understockpercent: 0,
      overstockpercent: 0,
      overduevalue: 0,
      BackordersRevenueLoss: 0,
      outstandingvalue: 0,
      fillrate: 0,

      allView: true,
      actualView: false,
      vendorView: false,
      vendorLine: true,
      actualLine: true,
      ReqLine: true,
      requstedView: false,
      radioBtnvalue: 'All',
      stockPercentData: [],
      predictedCapEXData: [],
      WidChartData: [],
      fillRateData: [],
      SupplierEfficiencydata: [],
      suppEfficiencyChartData: [],
      understockchartData: [],
      overstockchartData: [],
      suppChartData: [],
      series: [],
      options: {},
      seriesone: [],
      optionsone: {},
      SuppWid: false,
      isDataFetched: false,

      Loader: true,
      overstockChart: false,
      InfoModal: false,
      note: false,
      fillratenote: false,
      suppColumn: [{ text: '' }],
      underStockDescription: '(Current Inventory + Open POs + Possible Harvest) <= Reorder Point',
      // eslint-disable-next-line no-dupe-keys
      newResultLength: '',
      getPredictedCapExDDData: [],
      defaultActiveKey: '1'
    };
  }
  componentDidMount() {
    setTimeout(
      () =>
        this.setState({
          //budgetSpend: 15.2,
          potentialsaving: 5.2,
          ystrdyinventory: 15742,
          ystrdyinventorycapex: 21.4,
          totalinventorycost: 1.2,
          totalinventory: 1326
        }),
      1000
    );
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getCurrentInventoryCapexManufDDData !=
      nextProps.getCurrentInventoryCapexManufDDData
    ) {
      if (nextProps.getCurrentInventoryCapexManufDDData != 0) {
        this.setState({
          tableDDData: nextProps.getCurrentInventoryCapexManufDDData,
          isDataFetched: false,
          newResultLength: ''
        });
      } else {
        this.setState({
          tableDDData: [],
          isDataFetched: true
        });
      }
    }
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      this.imploader();
      setTimeout(() => {
        const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

        parsedBlockedDeleted = JSON.parse(filterSettingsOrg)[0].BlockedDeleted;
        parsedFilterSettingsLGORT = JSON.parse(filterSettingsOrg)[0].LGORT;

        this.setState({
          usercuid:
            nextProps.getUserImpersonationDetailsData[0].loggedcuid == null
              ? 'all'
              : nextProps.getUserImpersonationDetailsData[0].loggedcuid,
          organization: nextProps.getUserImpersonationDetailsData[0].FilterSetting
        });
      }, 1000);
    }

    if (this.props.predictedCapEXData != nextProps.predictedCapEXData) {
      if (nextProps.predictedCapEXData != 0) {
        let budgetSpend = nextProps.predictedCapEXData.Table[0].AvgBudgentSpent;
        let predictedCapEx = nextProps.predictedCapEXData.Table1[0].PredictedCapEx30days;
        let PredictedCapExWithHarvest =
          nextProps.predictedCapEXData.Table2[0].PredictedCapExWithHarvest;
        //let understockpercent = (nextProps.predictedCapEXData.Table2[0].understockpercent).split('-', '');
        let cost = Math.abs(predictedCapEx - budgetSpend);
        setTimeout(() => {
          this.setState({
            // overstockpercent:
            //   nextProps.predictedCapEXData.Table2[0].overstockpercent,
            // understockpercent:
            //   nextProps.predictedCapEXData.Table2[0].understockpercent,

            // budgetSpend: nextProps.predictedCapEXData.Table[0].AvgBudgentSpent,
            // predictedCapEx:
            //   nextProps.predictedCapEXData.Table1[0].PredictedCapEx30days,
            cost: cost,
            series: [
              {
                Name: '',
                data: [budgetSpend, predictedCapEx, PredictedCapExWithHarvest]
              }
            ],
            options: {
              chart: {
                type: 'bar',
                //height: 150,
                zoom: {
                  enabled: false
                },
                toolbar: {
                  show: false
                }
                // events : {
                //     click : this.avgpredictCapex
                // }
                //events: {
                //    click: this.onClickChartDD
                //}
              },
              grid: {
                show: false
              },
              plotOptions: {
                bar: {
                  borderRadius: 7,
                  barHeight: '90%',
                  distributed: true,
                  horizontal: true,
                  dataLabels: {
                    position: 'center' // top, center, bottom
                  }
                }
              },
              colors: ['#1870dc', '#63ce46', '#e77528'],
              dataLabels: {
                enabled: true,
                formatter: function (val) {
                  // return "$" + val + 'M';
                  return Math.abs(Number(val)) > 1.0e9
                    ? '$' + Math.abs(Number(val / 1.0e9)).toFixed(2) + 'B'
                    : Math.abs(Number(val)) >= 1.0e6
                    ? '$' + Math.abs(Number(val / 1.0e6)).toFixed(2) + 'M'
                    : Math.abs(Number(val)) >= 1.0e3
                    ? '$' + Math.abs(Number(val / 1.0e3)).toFixed(2) + 'K'
                    : '$' + Math.abs(Number(val));
                },
                offsetX: +10
              },
              xaxis: {
                show: false,
                categories: [
                  'AVG CapEx Spent(PO Placed)',
                  'Predicted Without Harvesting',
                  'Predicted With Harvesting'
                ],
                axisBorder: {
                  show: false
                },
                axisTicks: {
                  show: false
                },
                tooltip: {
                  enabled: false
                },
                labels: {
                  show: false,
                  formatter: function (val) {
                    return val + ' ($)';
                  }
                }
              },
              yaxis: {
                labels: {
                  offsetX: 15
                },
                tooltip: {
                  enabled: false
                }
              },
              tooltip: {
                theme: 'dark',
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  return (
                    '<div class="arrow_box">' +
                    '<div class="custom-header-tooltip">' +
                    w.globals.labels[dataPointIndex] +
                    '</div>' +
                    '<span>' +
                    calculation(series[seriesIndex][dataPointIndex]) +
                    '</span>' +
                    '</div>'
                  );
                }
              }
            }
          });
        }, 1);
      } else {
        this.setState({
          predictedCapEXData: []
        });
      }
    }
    //Start of Fill rate - Overstock and Understock percentage values
    if (this.props.stockPercentData != nextProps.stockPercentData) {
      if (nextProps.stockPercentData != 0) {
        this.setState({
          overstockpercent: nextProps.stockPercentData[0].overstockpercent,
          understockpercent: nextProps.stockPercentData[0].understockpercent
        });
      }
    }
    //End of Fill rate - Overstock and Understock percentage values

    if (this.props.suppEfficiencyChartData != nextProps.suppEfficiencyChartData) {
      if (nextProps.suppEfficiencyChartData != 0) {
        this.setState({
          Loader: false,
          suppChartData: nextProps.suppEfficiencyChartData
        });
      } else {
        this.setState({
          Loader: false,
          suppChartData: []
        });
      }
    }
    if (this.props.overstockchartData != nextProps.overstockchartData) {
      if (nextProps.overstockchartData != 0) {
        this.setState({
          Loader: false,
          overstockchartData: nextProps.overstockchartData
        });
      } else {
        this.setState({
          Loader: false,
          overstockchartData: []
        });
      }
    }
    if (this.props.understockchartData != nextProps.understockchartData) {
      if (nextProps.understockchartData != 0) {
        this.setState({
          Loader: false,
          understockchartData: nextProps.understockchartData
        });
      } else {
        this.setState({
          Loader: false,
          understockchartData: []
        });
      }
    }
    if (this.props.fillRateData != nextProps.fillRateData) {
      if (nextProps.fillRateData != 0) {
        let overStockvalue = calculation(nextProps.fillRateData.Table[0].Over_Stock);
        let underStockvalue = calculation(nextProps.fillRateData.Table1[0].Under_Stock);
        let totalCapExvalue = calculation(nextProps.fillRateData.Table2[0].Total_Capex);
        //let optimization = nextProps.fillRateData.Table[0].Over_Stock - nextProps.fillRateData.Table1[0].Under_Stock;
        //let valueoptimization = calculation(optimization);
        let fillrate = nextProps.fillRateData.Table3[0].fillrate.toFixed(2);
        setTimeout(() => {
          this.setState({
            fillRateData: nextProps.fillRateData,

            fillrate: fillrate,
            overStock: overStockvalue,
            underStock: underStockvalue,
            currentinventory: nextProps.fillRateData.Table2[0].Current_Inventory,
            currentinventorycapex: totalCapExvalue
          });
        }, 1);
      } else {
        this.setState({
          fillRateData: []
        });
      }
    }

    if (this.props.SupplierEfficiencydata != nextProps.SupplierEfficiencydata) {
      if (nextProps.SupplierEfficiencydata != 0) {
        let overduevalue = calculation(nextProps.SupplierEfficiencydata.Table2[0].overduevalue);
        let outstandingvalue = calculation(
          nextProps.SupplierEfficiencydata.Table3[0].outstandingordersvalue
        );
        let BackordersRevenueLoss = calculation(
          nextProps.SupplierEfficiencydata.Table1[0].BackordersRevenueLoss
        );
        this.setState({
          SupplierEfficiencydata: nextProps.SupplierEfficiencydata,
          predictedSpend: nextProps.SupplierEfficiencydata.Table[0].Perfect_Order_Rate,
          predictedQty: nextProps.SupplierEfficiencydata.Table1[0].noofbackorders,
          outstandingOrders: nextProps.SupplierEfficiencydata.Table2[0].overduetoday,
          overduevalue: overduevalue,
          outstandingvalue: outstandingvalue,
          overdue: nextProps.SupplierEfficiencydata.Table3[0].outstandingorders,
          BackordersRevenueLoss: BackordersRevenueLoss
        });
      } else {
        this.setState({
          SupplierEfficiencydata: []
        });
      }
    }

    if (this.props.getPredictedCapExDDData != nextProps.getPredictedCapExDDData) {
      if (nextProps.getPredictedCapExDDData != 0) {
        this.setState({
          isDataFetched: false,
          newResultLength: '',

          suppColumn: [
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'AvgConsumption(Monthly)',
              text: 'AvgConsumption(Monthly)',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'CurrentInventory',
              text: 'Current Inventory',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'InventoryCapex',
              text: 'Inventory Capex',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'InventoryExhaustDate',
              text: 'Inventory ExhaustDate',
              sort: true,
              headerStyle: { width: 125 },
              formatter: this.dateformat
            },
            {
              dataField: 'LeadTime(Median)',
              text: 'LeadTime(Median)',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'OrdersInPipeline',
              text: 'Orders in Pipeline',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'PredictedCapex)',
              text: 'Predicted Capex',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'PredictedDemand(Monthly)',
              text: 'Predicted Demand(Monthly)',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'QuantityToOrder',
              text: 'Quantity To Order',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'ReorderPoint',
              text: 'Reorder Point',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'Reorderdate',
              text: 'Reorder Date',
              sort: true,
              headerStyle: { width: 125 },
              formatter: this.dateformat
            },
            {
              dataField: 'UnitPrice',
              text: 'Unit Price',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'matdescription',
              text: 'Mat Description',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'openharvestqty',
              text: 'Open Harvest Qty',
              sort: true,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'predictedcapexwithharvest',
              text: 'Predicted Capex with Harvest',
              sort: true,
              headerStyle: { width: 125 }
            }
            // { dataField: "openposqty", text: "Open POs Qty", sort: true, headerStyle: { width: 125 } },
          ],

          getPredictedCapExDDData: nextProps.getPredictedCapExDDData
        });
      } else {
        this.setState({
          getPredictedCapExDDData: [],
          isDataFetched: true
        });
      }
    }
    if (this.props.tableDDData != nextProps.tableDDData) {
      if (nextProps.tableDDData != 0) {
        this.setState({
          isDataFetched: false,
          newResultLength: '',
          suppColumn: [
            {
              text: 'Action',
              dataField: '',
              headerStyle: { width: 60 },
              formatter: (cell, row) => (
                <div className="text-center">
                  <Button
                    size="small"
                    type="primary"
                    className="mr-1 modal-action-icon"
                    id={row.vendornum}
                    onClick={() => this.boxplotDD(row)}>
                    <i className="fas fa-chart-line" />
                  </Button>
                </div>
              )
            },
            //newly added
            {
              dataField: 'VendorNo',
              text: 'Vendor No',
              sort: true,
              headerStyle: { width: 100 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'VendorName',
              text: 'Vendor Name',
              sort: true,
              headerStyle: { width: 250 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'MedianLeadtime',
              text: 'Lead Time (Median)',
              sort: true,
              headerStyle: { width: 160 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'Efficiency',
              text: 'Efficiency %',
              sort: true,
              sortFunc: this.sortFunc,
              formatter: this.Efficiencyformat,
              headerStyle: { width: 150 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'OpenPOs',
              text: 'Open POs',
              sort: true,
              headerStyle: { width: 125 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'OpenPOsQty',
              text: 'Open POs Qty',
              sort: true,
              headerStyle: { width: 125 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'TotalPOs',
              text: 'Total POs',
              sort: true,
              headerStyle: { width: 125 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'TotalItems',
              text: 'Total Items',
              sort: true,
              headerStyle: { width: 125 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'TotalCapexSpend',
              text: 'Total CapEx Spend',
              sort: true,
              align: 'right',
              headerAlign: 'right',
              sortFunc: this.sortFunc,
              formatter: this.costformat,
              headerStyle: { width: 155 }
            }
            //end
          ],
          tableDDData: nextProps.tableDDData
        });
      } else {
        this.setState({
          tableDDData: [],
          isDataFetched: true
        });
      }
    }
    if (this.props.predictedChartData != nextProps.predictedChartData) {
      if (nextProps.predictedChartData != 0) {
        for (var i = 0; i < nextProps.predictedChartData.length; i++) {
          if (nextProps.predictedChartData[i].is_predicted == 'Y') {
            this.setState({
              predictedY: i
            });
            break;
          }
        }
        this.setState({
          Loader: false,
          WidChartData: nextProps.predictedChartData
        });
      } else {
        this.setState({
          WidChartData: [],
          Loader: false
        });
      }
    }
  }

  Efficiencyformat(cell) {
    if (cell == null) {
      return <span>*</span>;
    } else {
      return <span>{cell}</span>;
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
  percentformat(cell) {
    let values = cell.toFixed(2);
    return values;
  }
  dateformat(cell) {
    if (cell == '-') {
      return <span>-</span>;
    } else {
      let value = moment(cell).format('MM-DD-YYYY');
      return <span>{value}</span>;
    }
  }
  stockFormatter(cell) {
    var values = [];
    if (cell < 25) {
      values.push(<span className="msg-alert">{cell} %</span>);
    } else if (cell < 50) {
      values.push(<span className="msg-alert">{cell} %</span>);
    } else {
      values.push(<span className="msg-alert">{cell} %</span>);
    }
    return values;
  }
  rankFormatter(cell) {
    var values = [];
    if (cell < 25) {
      values.push(<span className="msg-alert">{cell} %</span>);
    } else if (cell < 50) {
      values.push(<span className="msg-alert">{cell} %</span>);
    } else {
      values.push(<span className="msg-alert">{cell} %</span>);
    }
    return values;
  }
  infoDD(e) {
    if (this.state.InfoModal == true) {
      this.setState({
        InfoModal: false
      });
    } else {
      this.setState({
        InfoModal: true
      });
      if (e == 'PredictedCapEx') {
        this.setState({
          descriptionTitle: <div> Predicted CapEx (Monthly) - Description</div>,
          WidDescription: (
            <div>
              <p>
                <strong>Avg Budget Spend:</strong>
              </p>
              <ul>
                <li>Monthly Average Spend Based on the Historical data for past 12 months</li>
              </ul>
              <p>
                <strong>Predicted With Harvesting :</strong>
              </p>
              <ul>
                <li>Predicted Capital Expenditure for Next 30 Days (With Harvesting)</li>
              </ul>
              <p>
                <strong>Predicted Without Harvesting:</strong>
              </p>
              <ul>
                <li>Predicted Capital Expenditure for Next 30 Days (Without Harvesting)</li>
              </ul>
            </div>
          )
        });
      } else if (e == 'FillRate') {
        this.setState({
          descriptionTitle: <div> Fill Rate (Lead Time Based) - Description</div>,
          WidDescription: (
            <div>
              <p>
                <strong>Materials are flagged as Overstock when :-</strong>
              </p>
              <ul>
                <li>(Current Inventory + Open POs + Possible Harvest) &#62; 2 X (Reorder Point)</li>
              </ul>
              <p>
                <strong>Materials are flagged as Understock when :-</strong>
              </p>
              <ul>
                <li>{this.state.underStockDescription}</li>
              </ul>
              <p>
                <strong>Fill Rate %:</strong>
              </p>
              <ul>
                <li>Percent of Demand met (Calculated using Back Orders)</li>
              </ul>
            </div>
          )
        });
      } else if (e == 'Supplier') {
        this.setState({
          descriptionTitle: <div> Supplier Efficiency - Description</div>,
          WidDescription: (
            <div>
              <p>
                <strong>SLA Met(RDD):</strong>
              </p>
              <ul>
                <li>% of orders which has been shipped on or before the requested date.</li>
              </ul>
              <p>
                <strong>Overdue(RDD):</strong>
              </p>
              <ul>
                <li>Number of Open Orders for which requested shipping date has passed.</li>
              </ul>
              <p>
                <strong>No Of BackOrders:</strong>
              </p>
              <ul>
                <li>No of orders that cannot be fulfilled and the revenue loss associated</li>
              </ul>
              <p>
                <strong>Outstanding Orders:</strong>
              </p>
              <ul>
                <li>Number of Open POs</li>
              </ul>
              <p>
                <strong>RDD:</strong>
              </p>
              <ul>
                <li>Requested Delivery Date</li>
              </ul>
            </div>
          )
        });
      }
    }
  }
  onclickDD(e, chartName) {
    if (this.state.openChartModal == true) {
      this.setState({
        openChartModal: false,
        EOQDDHeaderData: [],
        WidChartData: [],
        predictedChartData: [],
        Loader: true,
        chartDDTitle: ''
      });
    } else {
      this.setState({
        openChartModal: true,
        MaterialNo: e.Material,
        chartDDTitle: chartName
      });
      if (chartName === 'Overstock') {
        this.props.getFillRateOverStockChart(
          this.state.usercuid,

          e.LGORT,
          parsedBlockedDeleted,
          e.Material
        );
      } else if (chartName === 'Understock') {
        this.props.getFillRateUnderStockChart(
          this.state.usercuid,

          e.LGORT,
          parsedBlockedDeleted,
          e.Material
        );
      }
    }
  }
  StockChartDD(e) {
    if (this.state.stockChartModal == true) {
      this.setState({
        stockChartModal: false,
        overstockChart: false,
        Loader: true,
        overstockchartData: [],
        understockchartData: []
      });
    } else {
      this.setState({
        stockChartModal: true
      });
      if (e == 'OverStock') {
        this.setState({
          overstockChart: true,
          StockChartTitle: (
            <div>
              <i className="fas fa-chart-line mr-2" /> Overstock Trend
            </div>
          )
        });
        if (this.state.usercuid != null) {
          this.props.getFillRateOverStockChart(
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            'all'
          );
        } else {
          this.props.getFillRateOverStockChart(
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            'all'
          );
        }
      } else if (e == 'UnderStock') {
        this.setState({
          StockChartTitle: (
            <div>
              <i className="fas fa-chart-line mr-2" /> Understock Trend
            </div>
          )
        });
        if (this.state.usercuid != null) {
          this.props.getFillRateUnderStockChart(
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            'all'
          );
        } else {
          this.props.getFillRateUnderStockChart(
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            'all'
          );
        }
      }
    }
  }

  avgpredictCapex(e) {
    if (this.state.openAvgPredictedCapexModal == true || e.target.attributes.j.value !== '0') {
      this.setState({
        openAvgPredictedCapexModal: false
      });

      if (this.state.usercuid != null) {
        this.props.getPredictedCapExDD(this.state.usercuid);
      } else {
        this.props.getPredictedCapExDD(this.state.usercuid);
      }
    } else {
      this.setState({
        openAvgPredictedCapexModal: true
      });
      if (this.state.usercuid != null) {
        this.props.getPredictedCapExDD(this.state.usercuid);
      } else {
        this.props.getPredictedCapExDD(this.state.usercuid);
      }
    }
  }

  onClickChartDD(event, chartContext, config) {
    if (this.state.ChartDDModal == true) {
      this.setState({
        ChartDDModal: false
      });
    } else {
      this.setState({
        ChartDDModal: true
      });
      let label = config.globals.labels[config.dataPointIndex];
      this.setState({
        tblColumn: [
          {
            dataField: 'Material',
            text: 'Material',
            sort: true,
            formatter: this.materialDescription,
            headerStyle: { width: 50 }
          },
          {
            dataField: 'UnitPrice',
            text: 'Unit Price',
            sortFunc: this.sortFunc,
            formatter: this.costformat,
            sort: true,
            align: 'right',
            headerStyle: { width: 50 }
          },
          {
            dataField: 'PredictedDemandNext30Days',
            text: 'Predicted Demand (Next 30 Days)',
            sort: true,
            headerStyle: { width: 88 }
          },
          {
            dataField: 'PredictedCostNext30Days',
            text: 'Predicted Cost (Next 30 Days)',
            sortFunc: this.sortFunc,
            align: 'right',
            headerStyle: { width: 85 },
            formatter: this.costformat,
            sort: true
          }
        ],
        chartDDTitle: (
          <div>
            <i className="fas fa-table mr-2" />
            {label}
          </div>
        )
      });
      if (this.state.usercuid != null) {
        this.props.getWidgetDDData(
          'PredictedCapEx',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getWidgetDDData(
          'PredictedCapEx',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }
  onclickWidget(e) {
    if (this.state.openModal == true) {
      this.setState({
        MatMufTabShow: false,
        switchChecked: true,
        curInv: false,
        isDataFetched: false,
        newResultLength: '',
        openModal: false,
        note: false,
        fillratenote: false,

        SuppWid: false,
        tableDDData: [],
        tblColumn: [{ text: '' }],
        Title: ''
      });
    } else {
      this.setState({
        openModal: true,
        isDataFetched: false,
        newResultLength: ''
      });
      if (e == 'PredictedCapEx') {
        this.setState({
          tableDDData: [],
          isDataFetched: false,
          newResultLength: '',

          Title: 'PredictedCapEx',
          widgetTitle: (
            <div>
              <i className="fas fa-table mr-2" /> Predicted CapEx
            </div>
          ),
          tblColumn: [
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 50 }
            },
            {
              dataField: 'UnitPrice',
              text: 'Unit Price',
              sortFunc: this.sortFunc,
              formatter: this.costformat,
              sort: true,
              align: 'right',
              headerStyle: { width: 50 }
            },
            {
              dataField: 'PredictedDemandNext30Days',
              text: 'Predicted Demand (Next 30 Days)',
              sort: true,
              headerStyle: { width: 88 }
            },
            {
              dataField: 'PredictedCostNext30Days',
              text: 'Predicted Cost (Next 30 Days)',
              sortFunc: this.sortFunc,
              align: 'right',
              headerStyle: { width: 85 },
              formatter: this.costformat,
              sort: true
            }
          ]
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else if (e == 'fillrate') {
        this.setState({
          tableDDData: [],
          isDataFetched: false,
          newResultLength: '',
          Title: 'Fill Rate',
          fillratenote: true,
          widgetTitle: (
            <div>
              <i className="fas fa-table mr-2" /> Fill Rate
            </div>
          ),
          tblColumn: [
            {
              dataField: 'MATNR',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 32 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'LGORT',
              text: 'LGORT',
              sort: true,
              headerStyle: { width: 30 },
              align: 'left',
              headerAlign: 'left'
            },

            {
              dataField: 'Consumption',
              text: 'Consumption',
              sortFunc: this.sortFunc,
              sort: true,
              headerStyle: { width: 35 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'BackOrders',
              text: 'Back Orders',
              sort: true,
              headerStyle: { width: 44 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'FillRate',
              text: 'Fill Rate %',
              sortFunc: this.sortFunc,
              headerStyle: { width: 40 },
              formatter: this.percentformat,
              sort: true,
              align: 'right',
              headerAlign: 'right'
            }
          ]
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else if (e == 'UnderStock') {
        this.setState({
          tableDDData: [],
          Title: 'UnderStock',
          isDataFetched: false,
          newResultLength: '',
          widgetTitle: (
            <div>
              <i className="fas fa-table mr-2" /> Understock
            </div>
          ),
          tblColumn: [
            {
              text: 'Action',
              dataField: '',
              headerStyle: { width: 60 },
              formatter: (cell, row) => (
                <div className="text-center">
                  <Button
                    size="small"
                    type="primary"
                    className="mr-1 modal-action-icon"
                    id={row.Material}
                    onClick={() => this.onclickDD(row, 'Understock')}>
                    <i className="fas fa-chart-line" />
                  </Button>
                </div>
              )
            },
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 90 },
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
              dataField: 'UnitPrice',
              text: 'Unit Price',
              sort: true,
              headerAlign: 'right',
              align: 'right',
              sortFunc: this.sortFunc,
              formatter: this.costformat,
              headerStyle: { width: 100 }
            },
            {
              dataField: 'Demand(PerDay)',
              text: 'Demand (Per Day)',
              sort: true,
              headerStyle: { width: 150 },
              headerAlign: 'right',
              align: 'right'
            },
            {
              dataField: 'LeadTime(Median)',
              text: 'Lead Time(Median)',
              sort: true,
              headerStyle: { width: 160 },
              headerAlign: 'right',
              align: 'right'
            },
            {
              dataField: 'CurrentInventory',
              text: 'Current Inventory(Qty)',
              sort: true,
              headerStyle: { width: 175 },
              headerAlign: 'right',
              align: 'right'
            },
            {
              dataField: 'OrdersInPipeline',
              text: 'Orders In Pipeline',
              sort: true,
              headerStyle: { width: 150 },
              headerAlign: 'right',
              align: 'right'
            },
            {
              dataField: 'ReorderPoint',
              text: 'Reorder Point(Qty)',
              sort: true,
              headerStyle: { width: 150 },
              headerAlign: 'right',
              align: 'right'
            },
            {
              dataField: 'Understock%',
              text: 'Understock %',
              sort: true,
              sortFunc: this.sortFunc,
              formatter: this.stockFormatter,
              headerStyle: { width: 125 },
              headerAlign: 'right',
              align: 'right'
            },
            {
              dataField: 'UnderstockQuantity',
              text: 'Understock Quantity',
              sort: true,
              headerStyle: { width: 165 },
              headerAlign: 'right',
              align: 'right'
            },

            {
              dataField: 'UnderstockCapEx',
              text: 'Understock CapEx',
              sort: true,

              sortFunc: this.sortFunc,
              formatter: this.costformat,
              headerStyle: { width: 150 },
              headerAlign: 'right',
              align: 'right'
            }
          ]
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else if (e == 'OverStock') {
        this.setState({
          tableDDData: [],
          isDataFetched: false,
          newResultLength: '',
          Title: 'OverStock',
          widgetTitle: (
            <div>
              <i className="fas fa-table mr-2" /> Overstock
            </div>
          ),
          tblColumn: [
            {
              text: 'Action',
              dataField: '',
              headerStyle: { width: 60 },
              formatter: (cell, row) => (
                <div className="text-center">
                  <Button
                    size="small"
                    type="primary"
                    className="mr-1 modal-action-icon"
                    id={row.Material}
                    onClick={() => this.onclickDD(row, 'Overstock')}>
                    <i className="fas fa-chart-line" />
                  </Button>
                </div>
              )
            },
            {
              dataField: 'Material',
              text: 'Material',
              formatter: this.materialDescription,
              sort: true,
              headerStyle: { width: 90 },
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
              dataField: 'UnitPrice',
              text: 'Unit Price',
              sort: true,
              align: 'right',
              headerAlign: 'right',
              sortFunc: this.sortFunc,
              formatter: this.costformat,
              headerStyle: { width: 100 }
            },
            {
              dataField: 'Demand(PerDay)',
              text: 'Demand (Per Day)',
              sort: true,
              headerStyle: { width: 150 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'LeadTime(Median)',
              text: 'Lead Time(Median)',
              sort: true,
              headerStyle: { width: 156 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'CurrentInventory',
              text: 'Current Inventory(Qty)',
              sort: true,
              headerStyle: { width: 175 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'OrdersInPipeline',
              text: 'Orders In Pipeline',
              sort: true,
              headerStyle: { width: 150 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'ReorderPoint',
              text: 'Reorder Point(Qty)',
              sort: true,
              headerStyle: { width: 150 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'OverStock%',
              text: 'Overstock %',
              sort: true,
              align: 'right',
              headerAlign: 'right',
              sortFunc: this.sortFunc,
              formatter: this.rankFormatter,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'ExcessQuantity',
              text: 'Excess Quantity',
              sort: true,
              headerStyle: { width: 150 },
              align: 'right',
              headerAlign: 'right'
            },

            {
              dataField: 'OverspentCapex)',
              text: 'Over Spent CapEx',
              sort: true,
              align: 'right',
              headerAlign: 'right',
              sortFunc: this.sortFunc,
              formatter: this.costformat,
              headerStyle: { width: 150 }
            }
          ]
        });

        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else if (e == 'SuppOrderRateDD') {
        this.setState({
          tableDDData: [],
          Title: 'SLAMet',
          isDataFetched: false,
          newResultLength: '',
          note: true,
          SuppWid: true,
          widgetTitle: (
            <div>
              <i className="far fa-thumbs-up" /> SLA Met(RDD)
            </div>
          )
        });

        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else if (e == 'CurrentInventory') {
        this.setState({
          MatMufTabShow: true,
          defaultActiveKey: '1',
          tableDDData: [],
          isDataFetched: false,
          newResultLength: '',
          Title: 'Material Current Inventory',
          curInv: true,
          widgetTitle: (
            <div>
              <i className="fas fa-table mr-2" /> Current Inventory
            </div>
          ),
          tblColumn: [
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 90 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'LGORT',
              text: 'LGORT',
              sort: true,
              headerStyle: { width: 85 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'RED_INVENTORY',
              text: 'Red Inventory (Qty)',
              sort: true,
              headerStyle: { width: 100 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'GREEN_INVENTORY',
              text: 'Green Inventory (Qty)',
              sort: true,
              headerStyle: { width: 111 },
              align: 'right',
              headerAlign: 'right'
            },
            // {
            //   dataField: 'UnitPrice',
            //   text: 'Unit Price',
            //   sort: true,
            //   sortFunc: this.sortFunc,
            //   align: 'right',
            //   headerAlign: 'right',
            //   formatter: this.costformat,
            //   headerStyle: { width: 95 }
            // },
            {
              dataField: 'InventoryCapex',
              text: 'Inventory CapEx',
              sort: true,
              sortFunc: this.sortFunc,
              align: 'right',
              headerAlign: 'right',
              formatter: this.costformat,
              headerStyle: { width: 105 }
            }
          ]
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,

            parsedBlockedDeleted,
            this.state.switchChecked ? 'STOCK' : 'SPARE'
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,

            parsedBlockedDeleted,
            this.state.switchChecked ? 'STOCK' : 'SPARE'
          );
        }
      } else if (e == 'SuppOverDueDD') {
        this.setState({
          tableDDData: [],
          Title: 'Overdue',
          isDataFetched: false,
          newResultLength: '',
          tabshow: false,
          widgetTitle: (
            <div>
              <i className="fas fa-exclamation-triangle" /> Overdue(RDD)
            </div>
          ),
          //newly added
          tblColumn: [
            {
              dataField: 'PO',
              text: 'PO',
              sort: true,
              headerStyle: { width: 100 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'POline',
              text: 'PO Line',
              sort: true,
              headerStyle: { width: 90 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'Vendor',
              text: 'Vendor',
              sort: true,
              headerStyle: { width: 80 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'VendorName',
              text: 'Vendor Name',
              sort: true,
              headerStyle: { width: 125 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'Type',
              text: 'Type',
              sort: true,
              headerStyle: { width: 70 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 100 },
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
              dataField: 'Manufacture',
              text: 'Manufacture',
              sort: true,
              headerStyle: { width: 120 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'MPN',
              text: 'MPN',
              sort: true,
              headerStyle: { width: 120 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'Plant',
              text: 'Plant',
              sort: true,
              headerStyle: { width: 80 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'POCreated',
              text: 'PO Created',
              sort: true,
              sortFunc: this.sortFuncDate,
              formatter: this.dateformat,
              headerStyle: { width: 115 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'VendorCommitDate',
              text: 'Vendor Commit Date',
              sort: true,
              sortFunc: this.sortFuncDate,
              formatter: this.dateformat,
              headerStyle: { width: 165 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'POQty',
              text: 'PO Qty',
              sort: true,
              headerStyle: { width: 90 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'ReceiptQty',
              text: 'Receipt Qty',
              sort: true,
              headerStyle: { width: 110 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'OpenQty',
              text: 'Open Qty',
              sort: true,
              headerStyle: { width: 100 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'RequestedDeliveryDate',
              text: 'Requested Delivery Date',
              sort: true,
              sortFunc: this.sortFuncDate,
              formatter: this.dateformat,
              headerStyle: { width: 140 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'LineValue',
              text: 'Line Value',
              sort: true,
              align: 'right',
              headerAlign: 'right',
              sortFunc: this.sortFunc,
              headerStyle: { width: 110 },
              formatter: this.costformat
            },
            {
              dataField: 'OpenValue',
              text: 'Open Value',
              sort: true,
              align: 'right',
              headerAlign: 'right',
              sortFunc: this.sortFunc,
              headerStyle: { width: 110 },
              formatter: this.costformat
            }
          ]
          //end
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else if (e == 'SuppBackOrdersDD') {
        this.setState({
          tableDDData: [],
          Title: 'BackOrders',
          isDataFetched: false,
          newResultLength: '',
          tabshow: false,
          widgetTitle: (
            <div>
              <i className="fas fa-box-open" /> Back Orders
            </div>
          ),
          //newly added
          tblColumn: [
            {
              dataField: 'PR_NUMBER',
              text: 'PR Number',
              sort: true,
              headerStyle: { width: 105 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'PR_LINE',
              text: 'PR Line',
              sort: true,
              headerStyle: { width: 85 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'PR_DATE',
              text: 'PR Date',
              sort: true,
              sortFunc: this.sortFuncDate,
              formatter: this.dateformat,
              headerStyle: { width: 120 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'MATERIAL',
              text: 'Material No',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 110 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'QUANTITY',
              text: 'Quantity',
              sort: true,
              headerStyle: { width: 90 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'MFRPN',
              text: 'MFRPN',
              sort: true,
              headerStyle: { width: 125 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'WERKS',
              text: 'WERKS',
              sort: true,
              headerStyle: { width: 80 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'PART_DESCRIPTION',
              text: 'Part Description',
              sort: true,
              headerStyle: { width: 340 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'MFRNR',
              text: 'MFRNR',
              sort: true,
              headerStyle: { width: 85 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'NETBUILD',
              text: 'Netbuild',
              sort: true,
              headerStyle: { width: 90 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'NAME',
              text: 'Name',
              sort: true,
              headerStyle: { width: 80 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'ZZ_PROCESSED',
              text: 'ZZ Processed',
              sort: true,
              headerStyle: { width: 125 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'ORDERNUMBER',
              text: 'Order Number',
              sort: true,
              headerStyle: { width: 125 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'NET_MRR',
              text: 'NET_MRR',
              sort: true,
              headerStyle: { width: 100 },
              align: 'right',
              headerAlign: 'right'
            }
          ]
          //end
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else if (e == 'SuppOutstandingDD') {
        this.setState({
          tableDDData: [],
          Title: 'OutstandingOrders',
          isDataFetched: false,
          newResultLength: '',
          tabshow: false,
          widgetTitle: (
            <div>
              <i className="fas fa-cubes" /> Outstanding Orders
            </div>
          ),
          //newly added
          tblColumn: [
            {
              dataField: 'PO',
              text: 'PO',
              sort: true,
              headerStyle: { width: 100 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'POLine',
              text: 'PO Line',
              sort: true,
              headerStyle: { width: 90 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'Vendor',
              text: 'Vendor',
              sort: true,
              headerStyle: { width: 80 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'vendorName',
              text: 'Vendor Name',
              sort: true,
              headerStyle: { width: 125 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'Type',
              text: 'Type',
              sort: true,
              headerStyle: { width: 70 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 100 },
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
              dataField: 'Manufacture',
              text: 'Manufacture',
              sort: true,
              headerStyle: { width: 120 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'MPN',
              text: 'MPN',
              sort: true,
              headerStyle: { width: 120 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'Plant',
              text: 'Plant',
              sort: true,
              headerStyle: { width: 80 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'POCreated',
              text: 'PO Created',
              sort: true,
              sortFunc: this.sortFuncDate,
              formatter: this.dateformat,
              headerStyle: { width: 115 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'POAcknowledged',
              text: 'PO Acknowledged',
              sort: true,
              sortFunc: this.sortFuncDate,
              formatter: this.dateformat,
              headerStyle: { width: 150 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'POQty',
              text: 'PO Qty',
              sort: true,
              headerStyle: { width: 90 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'ReceiptQty',
              text: 'Receipt Qty',
              sort: true,
              headerStyle: { width: 110 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'OpenQty',
              text: 'Open Qty',
              sort: true,
              headerStyle: { width: 95 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'RequestedShippingDate',
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
              sort: true,
              align: 'right',
              headerAlign: 'right',
              sortFunc: this.sortFunc,
              headerStyle: { width: 110 },
              formatter: this.costformat
            },
            {
              dataField: 'Open_value',
              text: 'Open Value',
              sort: true,
              align: 'right',
              headerAlign: 'right',
              sortFunc: this.sortFunc,
              headerStyle: { width: 110 },
              formatter: this.costformat
            }
          ]
          //end
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else {
        this.setState({
          tableDDData: [],
          isDataFetched: true
        });
      }
    }
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
  boxplotDD(e) {
    if (this.state.chartModal == true) {
      this.setState({
        chartModal: false,
        suppChartData: [],
        Loader: true,
        vendorName: '',
        vendornum: '',
        efficiency: '',
        totalCapExSpend: '',
        leadtimemedian: '',
        totalitems: '',
        totalpos: '',
        openpos: '',
        radioBtnvalue: '',
        actualLine: false,
        ReqLine: false,
        vendorLine: false
      });
    } else {
      this.setState({
        chartModal: true,
        vendorName: e.VendorName,
        vendornum: e.VendorNo,
        efficiency: e.Efficiency,
        totalCapExSpend: e.TotalCapexSpend,
        leadtimemedian: e.MedianLeadtime,
        totalitems: e.TotalItems,
        totalpos: e.TotalPOs,
        openpos: e.OpenPOs,
        radioBtnvalue: 'All',
        actualLine: true,
        ReqLine: true,
        vendorLine: true
      });
      this.props.getSuppEfficiencyChart(
        e.VendorNo,
        this.state.usercuid,

        parsedBlockedDeleted
      );
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
  formatXAxis(tickItem) {
    return moment(tickItem).format('MM-DD-YYYY');
  }
  formatYAxis(tickItem) {
    let value = calculation(tickItem);
    return value;
  }
  TooltipFormatterOne(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>{value}</b> <br />
          </span>
          {e.payload[0].payload.is_predicted == 'N' ? (
            <span>
              <b> Total Consumption(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          ) : (
            <span>
              <b> Predicted Demand(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          )}
        </div>
      );
    }
  }
  TooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.podate).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>{value}</b> <br />
          </span>
          <span>
            <b> Material: {e.payload[0].payload.material}</b> <br />
          </span>
          <span>
            <b> PO: {e.payload[0].payload.po}</b> <br />
          </span>
          <span>
            <b> Receipt Quantity: {e.payload[0].payload.receiptqty}</b> <br />
          </span>
          <span>
            <b> Requested Delivery Days: {e.payload[0].payload.RequestedDeliveryDays}</b> <br />
          </span>
          <span>
            <b> Vendor Committed Days: {e.payload[0].payload.vendorcommitdays}</b> <br />
          </span>
          <span>
            <b> Actual Delivery Days: {e.payload[0].payload.actualdays}</b> <br />
          </span>
        </div>
      );
    }
  }
  UnderStockTooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.Date).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>{value}</b> <br />
          </span>
          <span>
            <b> Under Stock CapEx: {calculation(e.payload[0].payload.UnderStock_CapEx)}</b> <br />
          </span>
        </div>
      );
    }
  }
  OverStockTooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.Date).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>{value}</b> <br />
          </span>
          <span>
            <b> Over Stock CapEx: {calculation(e.payload[0].payload.OverStock_CapEx)}</b> <br />
          </span>
        </div>
      );
    }
  }
  chartView(e) {
    if (e.target.value == 'VendorCommitted') {
      this.setState({
        allView: false,
        vendorView: true,
        actualView: false,
        vendorLine: true,
        actualLine: false,
        ReqLine: false,
        requstedView: false,
        radioBtnvalue: 'VendorCommitted'
      });
    } else if (e.target.value == 'ActualDelivery') {
      this.setState({
        allView: false,
        vendorView: false,
        actualView: true,
        vendorLine: false,
        actualLine: true,
        ReqLine: false,
        requstedView: false,
        radioBtnvalue: 'ActualDelivery'
      });
    } else if (e.target.value == 'RequestedDelivery') {
      this.setState({
        allView: false,
        vendorView: false,
        actualView: false,
        vendorLine: false,
        actualLine: false,
        ReqLine: true,
        requstedView: true,
        radioBtnvalue: 'RequestedDelivery'
      });
    } else {
      this.setState({
        allView: true,
        vendorView: false,
        actualView: false,
        vendorLine: true,
        actualLine: true,
        ReqLine: true,
        requstedView: false,
        radioBtnvalue: 'All'
      });
    }
  }
  //chartView(e) {
  //    if (e.currentTarget.id == "Vendor") {
  //        this.setState({
  //            allView: false,
  //            vendorView: true,
  //            actualView: false,
  //            vendorLine: true,
  //            actualLine: false,
  //            ReqLine: false,
  //            requstedView: false
  //        })
  //    }
  //    else if (e.currentTarget.id == "Actual") {
  //        this.setState({
  //            allView: false,
  //            vendorView: false,
  //            actualView: true,
  //            vendorLine: false,
  //            actualLine: true,
  //            ReqLine: false,
  //            requstedView: false
  //        })
  //    }
  //    else if (e.currentTarget.id == "Requested") {
  //        this.setState({
  //            allView: false,
  //            vendorView: false,
  //            actualView: false,
  //            vendorLine: false,
  //            actualLine: false,
  //            ReqLine: true,
  //            requstedView:true
  //        })
  //    }
  //    else {
  //        this.setState({
  //            allView: true,
  //            vendorView: false,
  //            actualView: false,
  //            vendorLine: true,
  //            actualLine: true,
  //            ReqLine: true,
  //            requstedView: false
  //        })
  //    }
  //}
  exportToCSV() {
    let csvData = this.state.tableDDData;
    let fileName = this.state.Title;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  imploader() {
    this.setState({
      predictedCapEXData: [],
      budgetSpend: 0,
      predictedSpend: 0,
      overStock: 0,
      underStock: 0,
      outstandingOrders: 0,
      overdue: 0,
      cost: 0,
      predictedQty: 0,
      potentialsaving: 0,
      ystrdyinventory: 0,
      ystrdyinventorycapex: 0,
      currentinventorycapex: 0,
      currentinventory: 0,
      totalinventory: 0,
      totalinventorycost: 0,
      understockpercent: 0,
      overstockpercent: 0,
      overduevalue: 0,
      BackordersRevenueLoss: 0,
      outstandingvalue: 0,
      fillrate: 0,

      fillRateData: [],
      SupplierEfficiencydata: [],
      getPredictedCapExDD: [],
      series: [],
      options: {}
    });
  }
  materialDescription(cell, row) {
    return (
      <Popover
        placement="right"
        className="modal-tool-tip"
        content={
          <span>
            {row.description}
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
              <span className="heci-style">
                <br />
                HECI : &nbsp;
                {row.HECI}
              </span>
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
    );
  }

  moneyFormat(val) {
    return Math.abs(Number(val)) > 1.0e9
      ? '$' + Math.abs(Number(val / 1.0e9)).toFixed(2) + 'B'
      : Math.abs(Number(val)) >= 1.0e6
      ? '$' + Math.abs(Number(val / 1.0e6)).toFixed(2) + 'M'
      : Math.abs(Number(val)) >= 1.0e3
      ? '$' + Math.abs(Number(val / 1.0e3)).toFixed(2) + 'K'
      : Math.abs(Number(val));
  }
  switchChange() {
    this.setState(
      {
        switchChecked: !this.state.switchChecked
      },
      () => {
        if (this.state.switchChecked) {
          this.setState({
            tableDDData: [],
            isDataFetched: false,
            newResultLength: '',
            Title: 'Material Current Inventory',
            curInv: true,
            widgetTitle: (
              <div>
                <i className="fas fa-table mr-2" /> Current Inventory
              </div>
            )
          });
          this.props.getWidgetDDData(
            'CurrentInventory',
            this.state.usercuid,

            parsedFilterSettingsLGORT,

            parsedBlockedDeleted,
            this.state.switchChecked ? 'STOCK' : 'SPARE'
          );
        } else {
          this.setState({
            tableDDData: [],
            isDataFetched: false,
            newResultLength: '',
            Title: 'Material Current Inventory',
            curInv: true,
            widgetTitle: (
              <div>
                <i className="fas fa-table mr-2" /> Current Inventory
              </div>
            )
          });
          this.props.getWidgetDDData(
            'CurrentInventory',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.switchChecked ? 'STOCK' : 'SPARE'
          );
        }
      }
    );
  }
  switchChangeManufacturer() {
    this.setState(
      {
        switchCheckedManufacturer: !this.state.switchCheckedManufacturer
      },
      () => {
        if (this.state.switchCheckedManufacturer) {
          this.setState({
            tableDDData: [],
            isDataFetched: false,
            newResultLength: '',
            Title: 'Manufacturer Current Inventory',
            curInv: true,
            widgetTitle: (
              <div>
                <i className="fas fa-table mr-2" /> Current Inventory
              </div>
            )
          });
          this.props.getCurrentInventoryCapexManufDD(
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.switchCheckedManufacturer ? 'STOCK' : 'SPARE'
          );
        } else {
          this.setState({
            tableDDData: [],
            isDataFetched: false,
            newResultLength: '',
            Title: 'Manufacturer Current Inventory',
            curInv: true,
            widgetTitle: (
              <div>
                <i className="fas fa-table mr-2" /> Current Inventory
              </div>
            )
          });
          this.props.getCurrentInventoryCapexManufDD(
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.switchCheckedManufacturer ? 'STOCK' : 'SPARE'
          );
        }
      }
    );
  }
  onDragEnd(fromIndex, toIndex) {
    if (this.state.SuppWid == true) {
      const columnsCopy = this.state.suppColumn.slice();
      const item = columnsCopy.splice(fromIndex, 1)[0];
      columnsCopy.splice(toIndex, 0, item);
      this.setState({ suppColumn: columnsCopy });
    } else {
      const columnsCopy = this.state.tblColumn.slice();
      const item = columnsCopy.splice(fromIndex, 1)[0];
      columnsCopy.splice(toIndex, 0, item);
      this.setState({ tblColumn: columnsCopy });
    }
  }
  callWidgetBack(key) {
    if (key == 2) {
      this.setState({
        switchCheckedManufacturer: true,
        switchChecked: true,
        defaultActiveKey: '2',
        tableDDData: [],
        isDataFetched: false,
        newResultLength: '',
        Title: 'Manufacturer Current Inventory',
        curInv: true,
        widgetTitle: (
          <div>
            <i className="fas fa-table mr-2" /> Current Inventory
          </div>
        ),
        tblColumn: [
          {
            dataField: 'Manufacturer',
            text: 'Manufacturer',
            sort: true,

            headerStyle: { width: 220 },
            align: 'left',
            headerAlign: 'left'
          },
          {
            dataField: 'LGORT',
            text: 'LGORT',
            sort: true,
            headerStyle: { width: 85 },
            align: 'left',
            headerAlign: 'left'
          },
          {
            dataField: 'RED_INVENTORY',
            text: 'Red Inventory (Qty)',
            sort: true,
            headerStyle: { width: 100 },
            align: 'right',
            headerAlign: 'right'
          },
          {
            dataField: 'GREEN_INVENTORY',
            text: 'Green Inventory (Qty)',
            sort: true,
            headerStyle: { width: 111 },
            align: 'right',
            headerAlign: 'right'
          },
          // {
          //   dataField: 'UnitPrice',
          //   text: 'Unit Price',
          //   sort: true,
          //   sortFunc: this.sortFunc,
          //   align: 'right',
          //   headerAlign: 'right',
          //   formatter: this.costformat,
          //   headerStyle: { width: 95 }
          // },
          {
            dataField: 'InventoryCapex',
            text: 'Inventory CapEx',
            sort: true,
            sortFunc: this.sortFunc,
            align: 'right',
            headerAlign: 'right',
            formatter: this.costformat,
            headerStyle: { width: 105 }
          }
        ]
      });
      if (this.state.usercuid != null) {
        this.props.getCurrentInventoryCapexManufDD(
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted,
          this.state.switchCheckedManufacturer ? 'STOCK' : 'SPARE'
        );
      } else {
        this.props.getCurrentInventoryCapexManufDD(
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted,
          this.state.switchCheckedManufacturer ? 'STOCK' : 'SPARE'
        );
      }
    } else {
      this.setState({
        switchChecked: true,
        switchCheckedManufacturer: true,
        defaultActiveKey: '1',
        tableDDData: [],
        isDataFetched: false,
        newResultLength: '',
        Title: 'Material Current Inventory',
        curInv: true,
        widgetTitle: (
          <div>
            <i className="fas fa-table mr-2" /> Current Inventory
          </div>
        ),
        tblColumn: [
          {
            dataField: 'Material',
            text: 'Material',
            sort: true,
            formatter: this.materialDescription,
            headerStyle: { width: 90 },
            align: 'left',
            headerAlign: 'left'
          },
          {
            dataField: 'LGORT',
            text: 'LGORT',
            sort: true,
            headerStyle: { width: 85 },
            align: 'left',
            headerAlign: 'left'
          },
          {
            dataField: 'RED_INVENTORY',
            text: 'Red Inventory (Qty)',
            sort: true,
            headerStyle: { width: 100 },
            align: 'right',
            headerAlign: 'right'
          },
          {
            dataField: 'GREEN_INVENTORY',
            text: 'Green Inventory (Qty)',
            sort: true,
            headerStyle: { width: 111 },
            align: 'right',
            headerAlign: 'right'
          },
          {
            dataField: 'UnitPrice',
            text: 'Unit Price',
            sort: true,
            sortFunc: this.sortFunc,
            align: 'right',
            headerAlign: 'right',
            formatter: this.costformat,
            headerStyle: { width: 95 }
          },
          {
            dataField: 'InventoryCapex',
            text: 'Inventory CapEx',
            sort: true,
            sortFunc: this.sortFunc,
            align: 'right',
            headerAlign: 'right',
            formatter: this.costformat,
            headerStyle: { width: 105 }
          }
        ]
      });
      if (this.state.usercuid != null) {
        this.props.getWidgetDDData(
          'CurrentInventory',
          this.state.usercuid,

          parsedFilterSettingsLGORT,

          parsedBlockedDeleted,
          this.state.switchChecked ? 'STOCK' : 'SPARE'
        );
      } else {
        this.props.getWidgetDDData(
          'CurrentInventory',
          'all',

          parsedFilterSettingsLGORT,

          parsedBlockedDeleted,
          this.state.switchChecked ? 'STOCK' : 'SPARE'
        );
      }
    }
  }
  render() {
    sessionStorage.getItem('clear') == 'clear'
      ? (this.imploader(), sessionStorage.setItem('clear', ''))
      : '';
    //let btn_class_all = this.state.allView ? "" : "white-btn";
    //let btn_class_Vendor = this.state.vendorView ? "" : "white-btn";
    //let btn_class_Actual = this.state.actualView ? "" : "white-btn";
    //let btn_class_Requested = this.state.requstedView ? "" : "white-btn";

    return (
      <div>
        <Row>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} className="pr-2 pl-2">
            <Card className="parts-wid wid-card-height" size="small">
              <p className="text-white mb-0 widget-text text-left">
                Predicted CapEx{' '}
                <span className="sub-text">
                  (Monthly){' '}
                  <Popover placement="right" content={<span>Info</span>}>
                    <i
                      className="fas fa-info-circle info-logo-widget mr-2"
                      onClick={() => this.infoDD('PredictedCapEx')}
                    />{' '}
                  </Popover>
                  <i className="fas fa-dollar-sign" />
                </span>
              </p>
              {this.state.series != 0 ? (
                <div>
                  <Row className="mt-1">
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      <div>
                        <div className="widget-chart">
                          <Chart
                            options={this.state.options}
                            series={this.state.series}
                            type="bar"
                            height="150"
                          />
                        </div>
                        <Row>
                          <div className="text-center text-white note-pad">
                            Note: Predicted values for Next 30 Days
                          </div>
                        </Row>
                      </div>

                      {/*{this.state.budgetSpend > this.state.predictedSpend ?
                                        <Row>
                                            <div className="pre-wid wid-value text-success"><i className="fas fa-caret-down mr-2 text-success" />$<Odometer value={this.state.cost} options={{ format: '' }} />M</div>
                                            <div className="text-center"><span className="cost-value">Decrease in CapEx</span></div>
                                        </Row> : <Row>
                                            <div className="pre-wid wid-value text-success"><i className="fas fa-caret-up mr-2 text-success" />$<Odometer value={this.state.cost} options={{ format: '' }} />M</div>
                                            <div className="text-center"><span className="cost-value">Increase in CapEx</span></div>
                                        </Row>}*/}
                    </Col>
                  </Row>
                </div>
              ) : (
                <div className="loader-css-widjects">
                  <ReusableSysncLoader />
                </div>
              )}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} className="pr-2 pl-2">
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="pr-2 pl-2">
              <Card className="returns-wid wid-card-height" size="small">
                <p className="text-white mb-0 widget-text text-left">
                  Fill Rate <span className="sub-text">(Lead Time Based) </span>
                  <Popover placement="right" content={<span>Info</span>}>
                    <i
                      className="fas fa-info-circle info-logo-widget mr-2"
                      onClick={() => this.infoDD('FillRate')}
                    />
                  </Popover>
                  <i className="fas fa-boxes" />
                </p>
                {this.state.fillRateData != 0 ? (
                  <div>
                    <Row className="mt-4">
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <div className="text-white wid-value">
                            <span onClick={() => this.onclickWidget('OverStock')}>
                              {this.state.overStock}
                            </span>
                            (
                            {this.state.overstockpercent < 0 ? (
                              <span
                                className="sub-wid-value text-success"
                                onClick={() => this.StockChartDD('OverStock')}>
                                <i className="fas fa-arrow-down mr-1" />
                                <Odometer
                                  value={Math.abs(this.state.overstockpercent)}
                                  options={{ format: '' }}
                                />
                                %
                              </span>
                            ) : (
                              <span
                                className="text-danger sub-wid-value"
                                onClick={() => this.StockChartDD('OverStock')}>
                                <i className="fas fa-arrow-up mr-1" />
                                <Odometer
                                  value={this.state.overstockpercent}
                                  options={{ format: '' }}
                                />
                                %
                              </span>
                            )}
                            )
                          </div>
                          <div className="widget-sub-text">Overstock</div>
                        </Col>
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-center">
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <div className="text-white wid-value">
                            <span onClick={() => this.onclickWidget('UnderStock')}>
                              {this.state.underStock}
                            </span>
                            (
                            {this.state.understockpercent < 0 ? (
                              <span
                                onClick={() => this.StockChartDD('UnderStock')}
                                className="sub-wid-value text-success">
                                <i className="fas fa-arrow-down mr-1" />{' '}
                                <Odometer
                                  value={Math.abs(this.state.understockpercent)}
                                  options={{ format: '' }}
                                />
                                %
                              </span>
                            ) : (
                              <span
                                onClick={() => this.StockChartDD('UnderStock')}
                                className="text-danger sub-wid-value">
                                <i className="fas fa-arrow-up mr-1" />{' '}
                                <Odometer
                                  value={this.state.understockpercent}
                                  options={{ format: '' }}
                                />
                                %
                              </span>
                            )}
                            )
                          </div>
                          <div className="widget-sub-text">Understock</div>
                        </Col>
                      </Col>
                    </Row>
                    <Row className="mt-2 fill-rate-wid top-clr">
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className="pr-2 pl-2 mt-4 text-center"
                        onClick={() => this.onclickWidget('fillrate')}>
                        <div className="fright">
                          <p className="text-white wid-value">{this.state.fillrate}%</p>
                          <p className="widget-sub-text">Fill Rate %</p>
                        </div>
                      </Col>
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className="pr-2 pl-2 mt-4 text-center"
                        onClick={() => this.onclickWidget('CurrentInventory')}>
                        <div className="fright">
                          <p className="text-white wid-value">{this.state.currentinventorycapex}</p>
                          <p className="widget-sub-text">Current Inventory CapEx</p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div className="loader-css-widjects">
                    <ReusableSysncLoader />
                  </div>
                )}
              </Card>
            </Col>
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8} className="pr-2 pl-2">
            <Card className="Wh-Inventory wid-card-height" size="small">
              <p className="text-white mb-0 widget-text text-left">
                Supplier Efficiency{' '}
                <Popover placement="right" content={<span>Info</span>}>
                  <i
                    className="fas fa-info-circle info-logo-widget mr-2"
                    onClick={() => this.infoDD('Supplier')}
                  />{' '}
                </Popover>
                <i className="fas fa-industry" />
              </p>
              {this.state.SupplierEfficiencydata != 0 ? (
                <div>
                  {/* <Row> */}
                  <Row className="m-t-1r">
                    <Col
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                      xl={10}
                      className="pr-2 pl-2 text-center flex-supply-efc"
                      onClick={() => this.onclickWidget('SuppOrderRateDD')}>
                      <Row>
                        {/* <Col span={4}>
                          {" "}
                          <i className="far fa-thumbs-up" />
                        </Col> */}
                        <Col span={24} className="flex-supply-efc">
                          <div className="float-left">
                            <i className="far fa-thumbs-up" />
                          </div>
                          <div className="fright supply-efcy-style">
                            <p className="text-white wid-value ">
                              <Odometer
                                value={this.state.predictedSpend}
                                options={{ format: '' }}
                              />
                              %
                            </p>
                            <p className="widget-sub-text">SLA Met(RDD)</p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      xs={14}
                      sm={14}
                      md={14}
                      lg={14}
                      xl={14}
                      className="pr-2 pl-2 text-center flex-supply-efc"
                      onClick={() => this.onclickWidget('SuppBackOrdersDD')}>
                      <Row className="float-right">
                        {/* <Col span={4}>
                          {" "}
                          <i className="fas fa-box-open" />
                        </Col> */}
                        <Col span={24} className="flex-supply-efc">
                          <div className="float-left">
                            <i className="fas fa-box-open" />
                          </div>
                          <div className="fright supply-efcy-style">
                            <p className="text-white wid-value">
                              {this.state.BackordersRevenueLoss}(
                              <span className="sub-wid-value text-blue">
                                <Odometer
                                  value={this.state.predictedQty}
                                  options={{ format: '' }}
                                />
                              </span>
                              )
                            </p>
                            <p className="widget-sub-text">No. of Back Orders</p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="m-t-1r">
                    <Col
                      xs={10}
                      sm={10}
                      md={10}
                      lg={10}
                      xl={10}
                      className="pr-2 pl-2 text-center"
                      onClick={() => this.onclickWidget('SuppOverDueDD')}>
                      <Row>
                        {/* <Col span={4}>
                          <i className="fas fa-exclamation-triangle" />
                        </Col> */}
                        <Col span={24} className="flex-supply-efc">
                          {' '}
                          <div className="float-left">
                            <i className="fas fa-exclamation-triangle" />
                          </div>
                          <div className="fright supply-efcy-style">
                            <p className="text-white wid-value">
                              {this.state.overduevalue}(
                              <span className="text-danger sub-wid-value">
                                <Odometer
                                  value={this.state.outstandingOrders}
                                  options={{ format: '' }}
                                />
                              </span>
                              )
                            </p>
                            <p className="widget-sub-text">Overdue(RDD)</p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                    <Col
                      xs={14}
                      sm={14}
                      md={14}
                      lg={14}
                      xl={14}
                      className="pr-2 pl-2 text-center flex-supply-efc"
                      onClick={() => this.onclickWidget('SuppOutstandingDD')}>
                      <Row className="float-right">
                        {/* <Col span={4}>
                          {" "}
                          <i className="fas fa-cubes" />
                        </Col> */}
                        <Col span={24} className="flex-supply-efc">
                          {' '}
                          <div className="float-left">
                            <i className="fas fa-cubes" />
                          </div>
                          <div className="fright supply-efcy-style">
                            <p className="text-white wid-value">
                              {this.state.outstandingvalue}(
                              <span className="sub-wid-value text-blue">
                                <Odometer value={this.state.overdue} options={{ format: '' }} />
                              </span>
                              )
                            </p>
                            <p className="widget-sub-text">Outstanding Orders</p>
                          </div>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </div>
              ) : (
                <div className="loader-css-widjects">
                  <ReusableSysncLoader />
                </div>
              )}
            </Card>
          </Col>
        </Row>
        <Modal
          width={
            this.state.Title == 'PredictedCapEx'
              ? '45%'
              : this.state.Title == 'Fill Rate'
              ? '50%'
              : '90%'
          }
          style={{ top: 60 }}
          footer={null}
          title={this.state.widgetTitle}
          className="Intervaltimeline"
          visible={this.state.openModal}
          onCancel={this.onclickWidget}>
          {this.state.MatMufTabShow ? (
            <>
              {' '}
              <Tabs
                activeKey={this.state.defaultActiveKey}
                onChange={this.callWidgetBack.bind(this)}>
                <TabPane tab="Material" key="1">
                  <ToolkitProvider
                    keyField="id"
                    data={this.state.tableDDData}
                    columns={
                      this.state.SuppWid == true ? this.state.suppColumn : this.state.tblColumn
                    }
                    search={{
                      afterSearch: (newResult) => {
                        if (!newResult.length) {
                          if (this.state.tableDDData != '') {
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
                            {this.state.curInv ? (
                              <Switch
                                unCheckedChildren="SPARE"
                                checkedChildren="STOCK"
                                checked={this.state.switchChecked}
                                onChange={this.switchChange}
                              />
                            ) : (
                              ''
                            )}
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                            <div>
                              <SearchBar {...props.searchProps} />
                              {this.state.tableDDData != 0 ? (
                                <Button
                                  size="sm"
                                  className="export-Btn ml-2"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel mr-2" />{' '}
                                  <span className="text-white">Excel</span>
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled
                                  className="export-Btn ml-2"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel mr-2" />{' '}
                                  <span className="text-white">Excel</span>
                                </Button>
                              )}
                            </div>
                            {this.state.note == true ? (
                              <div className="note">Note: (*) There is no ASN Date</div>
                            ) : null}
                            {this.state.fillratenote == true ? (
                              <div className="note">
                                Note : Fill rate is calculated using past 1 year data.{' '}
                              </div>
                            ) : null}
                          </Col>
                        </Row>
                        <ReactDragListView.DragColumn
                          onDragEnd={this.onDragEnd.bind(this)}
                          nodeSelector="th">
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory()}
                            noDataIndication={() => this.tblLoader()}
                          />
                        </ReactDragListView.DragColumn>
                      </div>
                    )}
                  </ToolkitProvider>
                </TabPane>
                <TabPane tab="Manufacturer" key="2">
                  <ToolkitProvider
                    keyField="id"
                    data={this.state.tableDDData}
                    columns={
                      this.state.SuppWid == true ? this.state.suppColumn : this.state.tblColumn
                    }
                    search={{
                      afterSearch: (newResult) => {
                        if (!newResult.length) {
                          if (this.state.tableDDData != '') {
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
                            {this.state.curInv ? (
                              <Switch
                                unCheckedChildren="SPARE"
                                checkedChildren="STOCK"
                                checked={this.state.switchCheckedManufacturer}
                                onChange={this.switchChangeManufacturer}
                              />
                            ) : (
                              ''
                            )}
                          </Col>
                          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                            <div>
                              <SearchBar {...props.searchProps} />
                              {this.state.tableDDData != 0 ? (
                                <Button
                                  size="sm"
                                  className="export-Btn ml-2"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel mr-2" />{' '}
                                  <span className="text-white">Excel</span>
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  disabled
                                  className="export-Btn ml-2"
                                  onClick={this.exportToCSV}>
                                  <i className="fas fa-file-excel mr-2" />{' '}
                                  <span className="text-white">Excel</span>
                                </Button>
                              )}
                            </div>
                            {this.state.note == true ? (
                              <div className="note">Note: (*) There is no ASN Date</div>
                            ) : null}
                            {this.state.fillratenote == true ? (
                              <div className="note">
                                Note : Fill rate is calculated using past 1 year data.{' '}
                              </div>
                            ) : null}
                          </Col>
                        </Row>
                        <ReactDragListView.DragColumn
                          onDragEnd={this.onDragEnd.bind(this)}
                          nodeSelector="th">
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory()}
                            noDataIndication={() => this.tblLoader()}
                          />
                        </ReactDragListView.DragColumn>
                      </div>
                    )}
                  </ToolkitProvider>
                </TabPane>
              </Tabs>
            </>
          ) : (
            <>
              {' '}
              <ToolkitProvider
                keyField="id"
                data={this.state.tableDDData}
                columns={this.state.SuppWid == true ? this.state.suppColumn : this.state.tblColumn}
                search={{
                  afterSearch: (newResult) => {
                    if (!newResult.length) {
                      if (this.state.tableDDData != '') {
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
                        {this.state.curInv ? (
                          <Switch
                            unCheckedChildren="SPARE"
                            checkedChildren="STOCK"
                            checked={this.state.switchChecked}
                            onChange={this.switchChange}
                          />
                        ) : (
                          ''
                        )}
                      </Col>
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                        <div>
                          <SearchBar {...props.searchProps} />
                          {this.state.tableDDData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2"
                              onClick={this.exportToCSV}>
                              <i className="fas fa-file-excel mr-2" />{' '}
                              <span className="text-white">Excel</span>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              disabled
                              className="export-Btn ml-2"
                              onClick={this.exportToCSV}>
                              <i className="fas fa-file-excel mr-2" />{' '}
                              <span className="text-white">Excel</span>
                            </Button>
                          )}
                        </div>
                        {this.state.note == true ? (
                          <div className="note">
                            Note: Values are showing for current filter selection.
                          </div>
                        ) : null}
                        {this.state.fillratenote == true ? (
                          <div className="note">
                            Note: Fill rate is calculated using past 1 year data.{' '}
                          </div>
                        ) : null}
                      </Col>
                    </Row>
                    <ReactDragListView.DragColumn
                      onDragEnd={this.onDragEnd.bind(this)}
                      nodeSelector="th">
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory()}
                        noDataIndication={() => this.tblLoader()}
                      />
                    </ReactDragListView.DragColumn>
                  </div>
                )}
              </ToolkitProvider>
            </>
          )}

          {/* <ToolkitProvider
            keyField="id"
            data={this.state.tableDDData}
            columns={
              this.state.SuppWid == true
                ? this.state.suppColumn
                : this.state.tblColumn
            }
            search={{
              afterSearch: (newResult) => {
                if (!newResult.length) {
                  if (this.state.tableDDData != "") {
                    this.setState({
                      newResultLength: newResult.length,
                    });
                  } else {
                    this.setState({
                      newResultLength: "",
                    });
                  }
                }
              },
            }}
          >
            {(props) => (
              <div>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                    {this.state.curInv ? (
                      <Switch
                        unCheckedChildren="SPARE"
                        checkedChildren="STOCK"
                        checked={this.state.switchChecked}
                        onChange={this.switchChange}
                      />
                    ) : (
                      ""
                    )}
                  </Col>
                  <Col
                    xs={12}
                    sm={12}
                    md={12}
                    lg={12}
                    xl={12}
                    className="text-right"
                  >
                    <div>
                      <SearchBar {...props.searchProps} />
                      {this.state.tableDDData != 0 ? (
                        <Button
                          size="sm"
                          className="export-Btn ml-2"
                          onClick={this.exportToCSV}
                        >
                          <i className="fas fa-file-excel mr-2" />{" "}
                          <span className="text-white">Excel</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled
                          className="export-Btn ml-2"
                          onClick={this.exportToCSV}
                        >
                          <i className="fas fa-file-excel mr-2" />{" "}
                          <span className="text-white">Excel</span>
                        </Button>
                      )}
                    </div>
                    {this.state.note == true ? (
                      <div className="note">Note: (*) There is no ASN Date</div>
                    ) : null}
                    {this.state.fillratenote == true ? (
                      <div className="note">Note : Fill rate is calculated using past 1 year data. </div>
                    ) : null}
                  </Col>
                </Row>
                <ReactDragListView.DragColumn
                  onDragEnd={this.onDragEnd.bind(this)}
                  nodeSelector="th"
                >
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory()}
                    noDataIndication={() => this.tblLoader()}
                  />
                </ReactDragListView.DragColumn>
              </div>
            )}
          </ToolkitProvider> */}
        </Modal>
        <Modal
          width="80%"
          style={{ top: 60 }}
          footer={null}
          title={this.state.chartDDTitle}
          className="Intervaltimeline"
          visible={this.state.ChartDDModal}
          onCancel={this.onClickChartDD}>
          {this.state.note == true ? (
            <div className="note">Note: (*) There is no ASN Date</div>
          ) : null}
          <ToolkitProvider
            keyField="id"
            data={this.state.tableDDData}
            columns={this.state.tblColumn}
            search={{
              afterSearch: (newResult) => {
                if (this.state.tableDDData != '') {
                  if (!newResult.length) {
                    this.setState({
                      newResultLength: newResult.length
                    });
                  }
                } else {
                  if (!newResult.length) {
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
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} />
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                    <SearchBar {...props.searchProps} />
                  </Col>
                </Row>
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory()}
                  noDataIndication={() => this.tblLoader()}
                />
              </div>
            )}
          </ToolkitProvider>
        </Modal>
        <Modal
          width="45%"
          style={{ top: 60 }}
          footer={null}
          title="Average Predicted CapEx"
          className="Intervaltimeline"
          visible={this.state.openAvgPredictedCapexModal}
          onCancel={this.avgpredictCapex}>
          <ToolkitProvider
            keyField="id"
            data={this.state.getPredictedCapExDDData}
            columns={this.state.suppColumn}
            search={{
              afterSearch: (newResult) => {
                if (this.state.getPredictedCapExDDData != '') {
                  if (!newResult.length) {
                    this.setState({
                      newResultLength: newResult.length
                    });
                  }
                } else {
                  if (!newResult.length) {
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
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} />
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                    <SearchBar {...props.searchProps} />
                  </Col>
                </Row>
                <BootstrapTable
                  {...props.baseProps}
                  pagination={paginationFactory()}
                  noDataIndication={() => this.tblLoader()}
                />
              </div>
            )}
          </ToolkitProvider>
        </Modal>

        <Modal
          width="80%"
          style={{ top: 60 }}
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              {this.state.vendorName}{' '}
            </div>
          }
          className="brush-chart-data"
          visible={this.state.chartModal}
          onCancel={this.boxplotDD}>
          <>
            {!this.props.getSuppEfficiencyChartReducerLoader &&
            this.state.suppChartData.length > 0 ? (
              <>
                {' '}
                <div className="modal-header-details mb-2">
                  <Row>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <span>Vendor Name: </span>
                      <div> {this.state.vendorName}</div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <span>Vendor No: </span>
                      <div> {this.state.vendornum}</div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <span>Total CapEx: </span>
                      <div>{calculation(this.state.totalCapExSpend)}</div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <span>Lead Time(Median): </span>
                      <div>{this.state.leadtimemedian}</div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <span>Total Items: </span>
                      <div> {this.state.totalitems}</div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <span>Total POs: </span>
                      <div>{this.state.totalpos}</div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <span>Open POs: </span>
                      <div>{this.state.openpos}</div>
                    </Col>
                    <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                      <span>Efficiency %: </span>
                      <div>{this.state.efficiency}</div>
                    </Col>
                  </Row>
                </div>
                <div>
                  <Col xs={24} sm={24} md={24} lg={6} xl={6}>
                    <span className="head-title">Delivery Days Trend per PO Line</span>
                  </Col>
                  <Col xs={24} sm={24} md={24} lg={18} xl={18} className="mt-2 text-right">
                    {/*<Button.Group size="small" className="float-right mr-2">
                                  <Button className={btn_class_all} id="all" type="primary" onClick={this.chartView}>All</Button>
                                  <Button className={btn_class_Requested} id="Requested" type="primary" onClick={this.chartView}>Requested Delivery</Button>
                                  <Button className={btn_class_Vendor} id="Vendor" type="primary" onClick={this.chartView}>Vendor Committed</Button>
                                  <Button className={btn_class_Actual} id="Actual" type="primary" onClick={this.chartView}>Actual Delivery</Button>
                              </Button.Group>*/}
                    <Radio.Group
                      onChange={this.chartView.bind(this)}
                      value={this.state.radioBtnvalue}>
                      <Radio value="All">All</Radio>
                      <Radio value="RequestedDelivery">Requested Delivery</Radio>
                      <Radio value="VendorCommitted">Vendor Committed</Radio>
                      <Radio value="ActualDelivery">Actual Delivery</Radio>
                    </Radio.Group>
                  </Col>
                </div>
                <div className="text-center mt-2">
                  <span>
                    <i className="fas fa-circle total-trend" /> -Requested Delivery Days{' '}
                  </span>
                  <span>
                    <i className="fas fa-circle vendor-date" /> -Vendor Committed Days{' '}
                  </span>
                  <span>
                    <i className="fas fa-circle text-danger" /> -Actual Delivery Days{' '}
                  </span>
                </div>
                <Row className="mt-2 v4">
                  <ResponsiveContainer height={400} width="100%">
                    <LineChart
                      width={900}
                      height={400}
                      data={this.state.suppChartData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0
                      }}>
                      <XAxis
                        dataKey="podate"
                        angle={-40}
                        tickFormatter={this.formatXAxis}
                        textAnchor="end"
                        height={150}
                        interval={0}
                        stroke="#fff">
                        <Label position="bottom" fill="#fff" />
                      </XAxis>
                      <YAxis stroke="#fff" />
                      <Tooltip content={this.TooltipFormatter} />
                      {this.state.suppChartData.length > 60 && (
                        <Brush
                          startIndex={this.state.suppChartData.length - 10}
                          endIndex={this.state.suppChartData.length - 1}
                          dataKey="podate"
                          tickFormatter={this.formatXAxis}
                          height={20}
                          y={300}
                        />
                      )}
                      {this.state.actualLine == true ? (
                        <Line
                          type="monotone"
                          dataKey="actualdays"
                          stroke="#f85778"
                          fill="#f85778"
                          strokeWidth={3}
                          dot={false}
                        />
                      ) : null}
                      {this.state.ReqLine == true ? (
                        <Line
                          type="monotone"
                          dataKey="RequestedDeliveryDays"
                          stroke="#5689f4"
                          fill="#5689f4"
                          strokeWidth={3}
                          dot={false}
                        />
                      ) : null}
                      {this.state.vendorLine == true ? (
                        <Line
                          type="monotone"
                          dataKey="vendorcommitdays"
                          stroke="#82ca9d"
                          fill="#82ca9d"
                          strokeWidth={3}
                          dot={false}
                        />
                      ) : null}
                    </LineChart>
                  </ResponsiveContainer>
                </Row>
              </>
            ) : (
              <>
                {this.props.getSuppEfficiencyChartReducerLoader ? (
                  <>
                    <div style={{ height: '400px' }}>
                      <ReusableSysncLoader />{' '}
                    </div>
                  </>
                ) : (
                  <>
                    <div style={{ height: '400px' }}>
                      <NoDataTextLoader />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        </Modal>
        <Modal
          width="80%"
          style={{ top: 60 }}
          footer={null}
          title={this.state.StockChartTitle}
          className="Intervaltimeline"
          visible={this.state.stockChartModal}
          onCancel={this.StockChartDD}>
          <div className="mt-2 v4">
            {this.state.overstockChart == true ? (
              <div>
                {this.state.Loader ? (
                  <>
                    <div style={{ height: '400px' }}>
                      <ReusableSysncLoader />
                    </div>
                  </>
                ) : (
                  <>
                    {!this.state.Loader && this.state.overstockchartData.length === 0 ? (
                      <>
                        <div style={{ height: '400px' }}>
                          <NoDataTextLoader />
                        </div>
                      </>
                    ) : (
                      <>
                        {' '}
                        <div className="text-center mt-2 chart-legend">
                          <span>
                            <i className="fas fa-circle total-trend" /> -Overstock CapEx{' '}
                          </span>
                        </div>
                        <ResponsiveContainer height={400} width="100%">
                          <AreaChart
                            width={900}
                            height={400}
                            data={this.state.overstockchartData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 30,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="Date"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              {/* <Label value="DATE" position="bottom" fill="#fff" /> */}
                            </XAxis>
                            <YAxis stroke="#fff" tickFormatter={this.formatYAxis} />
                            <Tooltip content={this.OverStockTooltipFormatter} />
                            {this.state.overstockchartData.length > 60 && (
                              <Brush
                                startIndex={this.state.overstockchartData.length - 60}
                                endIndex={this.state.overstockchartData.length - 1}
                                dataKey="Date"
                                tickFormatter={this.formatXAxis}
                                height={50}
                                y={300}>
                                <AreaChart data={this.state.overstockchartData}>
                                  <Area
                                    type="monotone"
                                    dataKey="OverStock_CapEx"
                                    stroke="#1870dc"
                                    fill="#1870dc"
                                    strokeWidth={3}
                                    dot={false}
                                  />
                                </AreaChart>
                              </Brush>
                            )}
                            <Area
                              type="monotone"
                              dataKey="OverStock_CapEx"
                              stroke="#1870dc"
                              fill="#1870dc"
                              strokeWidth={3}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div>
                {this.state.Loader ? (
                  <>
                    <div style={{ height: '400px' }}>
                      <ReusableSysncLoader />
                    </div>
                  </>
                ) : (
                  <>
                    {!this.state.Loader && this.state.understockchartData.length === 0 ? (
                      <>
                        <div style={{ height: '400px' }}>
                          <NoDataTextLoader />
                        </div>
                      </>
                    ) : (
                      <>
                        {' '}
                        <div className="text-center mt-2">
                          <span>
                            <i className="fas fa-circle total-trend" /> -Understock CapEx{' '}
                          </span>
                        </div>{' '}
                        <ResponsiveContainer height={400} width="100%">
                          <AreaChart
                            width={900}
                            height={400}
                            data={this.state.understockchartData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="Date"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              {/* <Label value="ds" position="bottom" fill="#fff" /> */}
                            </XAxis>
                            <YAxis tickFormatter={this.formatYAxis} stroke="#fff" />
                            <Tooltip content={this.UnderStockTooltipFormatter} />
                            {this.state.understockchartData.length > 60 && (
                              <Brush
                                startIndex={this.state.understockchartData.length - 60}
                                endIndex={this.state.understockchartData.length - 1}
                                dataKey="Date"
                                tickFormatter={this.formatXAxis}
                                height={50}
                                y={300}>
                                <AreaChart data={this.state.understockchartData}>
                                  <Area
                                    type="monotone"
                                    dataKey="UnderStock_CapEx"
                                    stroke="#1870dc"
                                    fill="#1870dc"
                                    strokeWidth={3}
                                    dot={false}
                                  />
                                </AreaChart>
                              </Brush>
                            )}
                            <Area
                              type="monotone"
                              dataKey="UnderStock_CapEx"
                              stroke="#1870dc"
                              fill="#1870dc"
                              strokeWidth={3}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </Modal>
        <Modal
          width="90%"
          style={{ top: 60 }}
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              {this.state.MaterialNo} - {this.state.chartDDTitle} Trend
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.openChartModal}
          onCancel={this.onclickDD}>
          {this.state.chartDDTitle === 'Overstock' ? (
            <>
              {' '}
              <div>
                {this.state.Loader ? (
                  <>
                    <div style={{ height: '400px' }}>
                      <ReusableSysncLoader />
                    </div>
                  </>
                ) : (
                  <>
                    {!this.state.Loader && this.state.overstockchartData.length === 0 ? (
                      <>
                        <div style={{ height: '400px' }}>
                          <NoDataTextLoader />
                        </div>
                      </>
                    ) : (
                      <>
                        {' '}
                        <div className="text-center mt-2 chart-legend">
                          <span>
                            <i className="fas fa-circle total-trend" /> -Overstock CapEx{' '}
                          </span>
                        </div>
                        <ResponsiveContainer height={400} width="100%">
                          <AreaChart
                            width={900}
                            height={400}
                            data={this.state.overstockchartData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="Date"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              {/* <Label value="DATE" position="bottom" fill="#fff" /> */}
                            </XAxis>
                            <YAxis stroke="#fff" tickFormatter={this.formatYAxis} />
                            <Tooltip content={this.OverStockTooltipFormatter} />
                            {this.state.overstockchartData.length > 60 && (
                              <Brush
                                startIndex={this.state.overstockchartData.length - 60}
                                endIndex={this.state.overstockchartData.length - 1}
                                dataKey="Date"
                                tickFormatter={this.formatXAxis}
                                height={50}
                                y={300}>
                                <AreaChart data={this.state.overstockchartData}>
                                  <Area
                                    type="monotone"
                                    dataKey="OverStock_CapEx"
                                    stroke="#1870dc"
                                    fill="#1870dc"
                                    strokeWidth={3}
                                    dot={false}
                                  />
                                </AreaChart>
                              </Brush>
                            )}
                            <Area
                              type="monotone"
                              dataKey="OverStock_CapEx"
                              stroke="#1870dc"
                              fill="#1870dc"
                              strokeWidth={3}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {' '}
              <div>
                {this.state.Loader ? (
                  <>
                    <div style={{ height: '400px' }}>
                      <ReusableSysncLoader />
                    </div>
                  </>
                ) : (
                  <>
                    {!this.state.Loader && this.state.understockchartData.length === 0 ? (
                      <>
                        <div style={{ height: '400px' }}>
                          <NoDataTextLoader />
                        </div>
                      </>
                    ) : (
                      <>
                        {' '}
                        <div className="text-center mt-2">
                          <span>
                            <i className="fas fa-circle total-trend" /> -Understock CapEx{' '}
                          </span>
                        </div>{' '}
                        <ResponsiveContainer height={400} width="100%">
                          <AreaChart
                            width={900}
                            height={400}
                            data={this.state.understockchartData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="Date"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              {/* <Label value="ds" position="bottom" fill="#fff" /> */}
                            </XAxis>
                            <YAxis tickFormatter={this.formatYAxis} stroke="#fff" />
                            <Tooltip content={this.UnderStockTooltipFormatter} />
                            {this.state.understockchartData.length > 60 && (
                              <Brush
                                startIndex={this.state.understockchartData.length - 60}
                                endIndex={this.state.understockchartData.length - 1}
                                dataKey="Date"
                                tickFormatter={this.formatXAxis}
                                height={50}
                                y={300}>
                                <AreaChart data={this.state.understockchartData}>
                                  <Area
                                    type="monotone"
                                    dataKey="UnderStock_CapEx"
                                    stroke="#1870dc"
                                    fill="#1870dc"
                                    strokeWidth={3}
                                    dot={false}
                                  />
                                </AreaChart>
                              </Brush>
                            )}
                            <Area
                              type="monotone"
                              dataKey="UnderStock_CapEx"
                              stroke="#1870dc"
                              fill="#1870dc"
                              strokeWidth={3}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </Modal>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={this.state.descriptionTitle}
          className="Intervaltimeline"
          visible={this.state.InfoModal}
          onCancel={this.infoDD}>
          {this.state.WidDescription}
        </Modal>
      </div>
    );
  }
}
function mapState(state) {
  return {
    stockPercentData: state.getStockPercent,
    predictedCapEXData: state.getPredictedCapEx,
    fillRateData: state.getFillRate,
    tableDDData: state.getWidgetDDData,
    SupplierEfficiencydata: state.getSupplierEfficiency,
    suppEfficiencyChartData: state.getSuppEfficiencyChart,
    overstockchartData: state.getFillRateOverStockChart,
    understockchartData: state.getFillRateUnderStockChart,
    predictedChartData: state.getPredictedChart,
    getPredictedCapExDDData: state.getPredictedCapExDD,

    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    getCurrentInventoryCapexManufDDData: state.getCurrentInventoryCapexManufDD,
    getSuppEfficiencyChartReducerLoader: state.getSuppEfficiencyChartReducerLoader,
    getPredictedChartReducerLoader: state.getPredictedChartReducerLoader
  };
}

export default connect(mapState, {
  getUserImpersonationDetails,
  getStockPercent,
  getPredictedCapEx,
  getPredictedCapExDD,
  getFillRate,
  getWidgetDDData,
  getSupplierEfficiency,
  getSuppEfficiencyChart,
  getFillRateOverStockChart,
  getFillRateUnderStockChart,
  getPredictedChart,
  getCurrentInventoryCapexManufDD
})(Widget);
