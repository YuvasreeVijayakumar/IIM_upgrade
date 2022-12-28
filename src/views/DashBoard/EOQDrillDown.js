import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Label,
  Cell,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
  Line,
  Bar,
  BarChart,
  Tooltip,
  LineChart,
  Brush,
  Legend
} from 'recharts';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import {
  Row,
  Col,
  Card,
  Modal,
  Button,
  Tabs,
  Input,
  DatePicker,
  TreeSelect,
  message,
  Popover,
  Switch,
  Space
} from 'antd';
import axios from 'axios';

import TextareaAutosize from 'react-textarea-autosize';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { calculation } from '../Calculation';

import {
  getEOQHeaderDD,
  getPredictedChart,
  getPOMaterialChart,
  getPredictedChartMonth,
  getWeeklyStockVisualization,
  getMonthlyStockVisualization,
  getHistoricalForecastWeekly,
  getHistoricalSnapshotForecastMinMaxDate,
  getHistoricalForecastMonthly,
  getUserImpersonationDetails,
  getLeadTimeTrending,
  getLeadTimeTrendingMaterialEOQ,
  getReplacedMaterialDetails,
  getForcastOverwriteDetails,
  getReasonCodeList,
  getCapGovMaterialReport,
  getForecastOverrideApproverList,
  getForecastOverrideApproverReview
} from '../../actions';
import { NotificationManager } from 'react-notifications';

import { ROOT_URL } from '../../actions/index';
import ReactDragListView from 'react-drag-listview';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
const { TabPane } = Tabs;

const { TreeNode } = TreeSelect;
const { SearchBar } = Search;
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const pop_content = <span>Fields Are Editable</span>;

class EOQDrillDown extends Component {
  constructor(props) {
    super(props);
    this.PostForcastOverwriteUpdate = this.PostForcastOverwriteUpdate.bind(this);
    this.UpdateValidation = this.UpdateValidation.bind(this);
    this.tblLoader = this.tblLoader.bind(this);
    this.rowformatter = this.rowformatter.bind(this);
    this.handleApproverChange = this.handleApproverChange.bind(this);
    this.ForecastOverrideNonApprover = this.ForecastOverrideNonApprover.bind(this);
    this.UpdateForecastData = this.UpdateForecastData.bind(this);
    this.getcheckValues = this.getcheckValues.bind(this);
    this.HandleSplitmatnr = this.HandleSplitmatnr.bind(this);
    this.bstable = React.createRef();

    this.materialDescription = this.materialDescription.bind(this);
    this.dateformat = this.dateformat.bind(this);

    this.tillDatefunc = this.tillDatefunc.bind(this);
    this.handleLeadtimeDateChange = this.handleLeadtimeDateChange.bind(this);
    // this.handleOverWrite = this.handleOverWrite.bind(this);
    this.HandleSubmit = this.HandleSubmit.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.exportToCSVReplacedMtnr = this.exportToCSVReplacedMtnr.bind(this);
    this.exportToCSVPushPullApproverReview = this.exportToCSVPushPullApproverReview.bind(this);
    this.exportsnap = this.exportsnap.bind(this);
    this.exportToCSV1 = this.exportToCSV1.bind(this);
    this.exportToLeadtimeTrend = this.exportToLeadtimeTrend.bind(this);
    this.exportToCSV2 = this.exportToCSV2.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.monthlyChart = this.monthlyChart.bind(this);
    this.weeklyChart = this.weeklyChart.bind(this);
    this.monthlySnapshot = this.monthlySnapshot.bind(this);
    this.weeklySnapshot = this.weeklySnapshot.bind(this);
    this.monthlyStockChart = this.monthlyStockChart.bind(this);
    this.weeklyStockChart = this.weeklyStockChart.bind(this);
    this.getDate = this.getDate.bind(this);
    this.handleBrushChange = this.handleBrushChange.bind(this);
    this.startBrushIndexOf = this.startBrushIndexOf.bind(this);
    this.overridetbl = this.overridetbl.bind(this);
    this.handleYesforecastOverride = this.handleYesforecastOverride.bind(this);
    this.handleYesforecastOverrideApprover = this.handleYesforecastOverrideApprover.bind(this);

    this.state = {
      getApproverReviewForForecastOverride: [],
      getCapGovMaterialReportData: [],
      materialBarData: [],
      ApproverReviewArray: [],
      UpdatePopUpApproverReview: false,
      newResultLength: '',
      predictedY: 0,

      UpdatePopup: false,
      OverriteTable: true,
      getForecastOverrideApproverListData: [],
      getForecastOverrideApproverReviewData: [],

      MaterialNo: '',
      openModal: '',
      lgort: '',
      Loader: true,
      LeadtimeLoad: false,
      overridetblmodal1: false,
      prop: true,
      OldTblVale: [],
      ReasonCodeVal: '',
      NewOverWriteQty: '',
      OverWriteComment: '',
      TempgetForcastOverwriteDetailsData: [],
      getForcastOverwriteDetailsData: [],
      PostArray: [],

      overridetblmodal: false,
      isDataFetched: false,
      getLeadTimeTrendingData: [],
      startBrushIndex: 0,
      noOfWeeksWeeklyTrend: 68,
      fromBrushValueWeekly: 0,
      toBrushValueWeekly: 68,
      leadtimeTreeSelect: ['30', '60'],
      error: '',
      error1: '',
      error2: '',
      TillDateCount: '',
      leadtimeDate: moment().add(1, 'days').format('MM-DD-YYYY'),
      overwriteModal: false,
      load: false,
      load1: false,
      setModalVissible: false,

      Errors: {},
      leadtimecmnt: '',
      newleadtime: '',

      getUserImpersonationDetailsData: [],
      EOQDDHeaderData: [],
      predictedChartData: [],
      ChartData: [],
      MonthlyChartData: [],
      getWeeklyStockVisualizationData: [],
      getMonthlyStockVisualizationData: [],
      getHistoricalForecastWeeklyData: [],
      getHistoricalSnapshotForecastMinMaxDateData: [],
      getHistoricalForecastMonthlyData: [],
      monthlyView: true,
      weeklyView: false,
      monthlySnapshotView: true,
      weeklySnapshotView: false,
      monthlyStockView: true,
      weeklyStockView: false,
      TitleStock: '',
      TitleCon: '',
      Title: '',
      defaultActiveKey: '1',
      linechart: [],
      starting: '',
      minDate: '',
      maxDate: '',
      minDateMonthly: '',
      maxDateMonthly: '',
      minDateWeekly: '',
      maxDateWeekly: '',
      snapweeklyN: '',
      snapMonthlyN: '',
      ForecastApprover: '',
      ForecastId: '',
      tempcol1: [
        {
          dataField: 'ds',
          text: 'Date',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 113 },
          formatter: this.materialDescription
        },

        {
          dataField: 'value',
          text: '  Forecasted Quantity',

          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 115 },
          editable: false
        },
        {
          dataField: 'OVERWRITE_QTY',
          text: <span className="='cls">Overwrite Quantity</span>,

          // sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 113 },
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
          dataField: 'REASON_CODE',
          text: <span className="='cls">Reason Code</span>,

          // sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 113 },

          editor: {
            type: Type.SELECT,
            // options: this.props.ReasonCodeDropDownValue,
            getOptions: (setOptions) => {
              setTimeout(() => {
                setOptions(this.props.getReasonCodeListData);
              }, 1);
            }
          }
        },
        {
          dataField: 'COMMENTS',
          text: <span className="='cls">Comments</span>,

          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 113 }
        }
      ],
      ForecastOverrideApproverReviewCol: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'DATE',
          text: 'Date',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'FORECASTED_QTY',
          text: 'Forecasted Qty',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'OVERWRITE_QTY',
          text: 'Overwrite Qty',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'REASON_CODE',
          text: 'Reason Code',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'UPDATED_DATE',
          text: 'Updated Date',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'APPROVER',
          text: 'Approver',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 140 }
        },
        {
          dataField: 'STATUS',
          text: 'Status',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 140 }
        }
      ],
      tempcol: [
        {
          dataField: 'ds',
          text: 'Date',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 140 },
          formatter: this.materialDescription
        },

        {
          dataField: 'value',
          text: '  Forecasted Quantity',

          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 170 },
          editable: false
        },
        {
          dataField: 'OVERWRITE_QTY',
          sort: true,
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Overwrite Quantity <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 200 },
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
          dataField: 'REASON_CODE',
          sort: true,
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Reason Code <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 190 },

          editor: {
            type: Type.SELECT,
            // options: this.props.ReasonCodeDropDownValue,
            getOptions: (setOptions) => {
              setTimeout(() => {
                setOptions(this.props.getReasonCodeListData);
              }, 1);
            }
          }
        },
        {
          dataField: 'COMMENTS',
          sort: true,
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Comments <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 300 }
        },
        {
          dataField: 'STATUS',
          text: 'Status',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          formatter: this.rowformatter,
          headerStyle: { width: 100 },
          editable: false
        },
        {
          dataField: 'APPROVER',
          text: 'Approver',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 300 },
          editable: false
        }
      ],
      replacedMaterialcolumn: [
        {
          dataField: 'REPLACED_MATERIAL',
          text: 'Replaced Material',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 100 }
        },
        {
          dataField: 'CURRENT_INVENTORY',
          text: 'Current Inventory',
          sort: true,

          headerStyle: { width: 90 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'OPEN_PO',
          text: 'Open PO',
          sort: true,

          headerStyle: { width: 90 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'MEDIAN_LEADTIME',
          text: 'LeadTime Median',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 86 }
        },
        {
          dataField: 'OPEN_HARVEST_QTY',
          text: 'Open Harvest Quantity',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 107 }
        },
        {
          dataField: 'UNIT_PRICE',
          text: 'Unit Price',
          formatter: calculation,

          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 90 }
        },
        {
          dataField: 'AVG_MONTHLY_DEMAND',
          text: 'AVG Monthly Demand',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 100 }
        }
      ]
    };
  }

  componentDidMount() {
    this.props.getForecastOverrideApproverList();
    this.setState({
      MaterialNo: this.props.MaterialNo,
      lgort: this.props.lgort,
      openModal: this.props.openModal,
      TitleCon: `${this.props.MaterialNo}- Consumption Monthly`
    });

    this.props.getPredictedChartMonth(this.props.MaterialNo, this.props.lgort);
    this.props.getForcastOverwriteDetails(this.props.MaterialNo, this.props.lgort);
    this.props.getHistoricalSnapshotForecastMinMaxDate(this.props.MaterialNo);
    this.props.getReplacedMaterialDetails(this.props.MaterialNo);
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getForecastOverrideApproverReviewData !=
      nextProps.getForecastOverrideApproverReviewData
    ) {
      if (nextProps.getForecastOverrideApproverReviewData != 0) {
        this.setState({
          getForecastOverrideApproverReviewData: nextProps.getForecastOverrideApproverReviewData,
          isDataFetched: false
        });
      } else {
        this.setState({
          getForecastOverrideApproverReviewData: [],
          isDataFetched: true
        });
      }
    }
    if (
      this.props.getForecastOverrideApproverListData !=
      nextProps.getForecastOverrideApproverListData
    ) {
      if (nextProps.getForecastOverrideApproverListData != 0) {
        this.setState({
          getForecastOverrideApproverListData: nextProps.getForecastOverrideApproverListData
        });
      } else {
        this.setState({
          getForecastOverrideApproverListData: []
        });
      }
    }
    if (this.props.getCapGovMaterialReportData != nextProps.getCapGovMaterialReportData) {
      if (nextProps.getCapGovMaterialReportData != 0) {
        this.setState({
          getCapGovMaterialReportData: nextProps.getCapGovMaterialReportData
        });
      } else {
        this.setState({
          getCapGovMaterialReportData: []
        });
      }
    }
    if (this.props.getForcastOverwriteDetailsData != nextProps.getForcastOverwriteDetailsData) {
      if (nextProps.getForcastOverwriteDetailsData != 0) {
        this.setState({
          getForcastOverwriteDetailsData: nextProps.getForcastOverwriteDetailsData
        });
      } else {
        this.setState({
          getForcastOverwriteDetailsData: []
        });
      }
    }
    if (this.props.getReplacedMaterialDetailsData != nextProps.getReplacedMaterialDetailsData) {
      if (nextProps.getReplacedMaterialDetailsData != 0) {
        this.setState({
          getReplacedMaterialDetailsData: nextProps.getReplacedMaterialDetailsData,
          isDataFetched: true
        });
      } else {
        this.setState({
          getReplacedMaterialDetailsData: [],
          isDataFetched: false
        });
      }
    }
    if (
      this.props.getLeadTimeTrendingMaterialEOQData != nextProps.getLeadTimeTrendingMaterialEOQData
    ) {
      if (nextProps.getLeadTimeTrendingMaterialEOQData != 0) {
        this.setState({
          getLeadTimeTrendingData: nextProps.getLeadTimeTrendingMaterialEOQData,
          Loader: false
        });
      } else {
        this.setState({
          getLeadTimeTrendingData: [],
          Loader: true
        });
      }
    }
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.setState({
          getUserImpersonationDetailsData: nextProps.getUserImpersonationDetailsData
        });
      } else {
        this.setState({
          getUserImpersonationDetailsData: []
        });
      }
    }

    if (this.props.getHistoricalForecastMonthlyData != nextProps.getHistoricalForecastMonthlyData) {
      if (nextProps.getHistoricalForecastMonthlyData != 0) {
        for (var i = 0; i < nextProps.getHistoricalForecastMonthlyData.length; i++) {
          if (nextProps.getHistoricalForecastMonthlyData[i].Is_Predicted == 'Y') {
            this.setState({
              snapMonthlyN: i
            });
            break;
          }
        }

        this.setState({
          getHistoricalForecastMonthlyData: nextProps.getHistoricalForecastMonthlyData,
          load: false
        });
      } else {
        this.setState({
          getHistoricalForecastMonthlyData: [],
          load: true
        });
      }
    }
    if (
      this.props.getHistoricalSnapshotForecastMinMaxDateData !=
      nextProps.getHistoricalSnapshotForecastMinMaxDateData
    ) {
      if (this.props.getHistoricalSnapshotForecastMinMaxDateData) {
        this.setState({
          starting: moment(
            nextProps.getHistoricalSnapshotForecastMinMaxDateData[0].Min_Date_Monthly
          ).format('YYYY-MM-DD'),
          minDateMonthly: nextProps.getHistoricalSnapshotForecastMinMaxDateData[0].Min_Date_Monthly,

          maxDateMonthly: nextProps.getHistoricalSnapshotForecastMinMaxDateData[0].Max_Date_Monthly,

          minDateWeekly: nextProps.getHistoricalSnapshotForecastMinMaxDateData[0].Min_Date_Weekly,

          maxDateWeekly: nextProps.getHistoricalSnapshotForecastMinMaxDateData[0].Max_Date_Weekly
        });
      }
    }
    if (this.props.getHistoricalForecastWeeklyData != nextProps.getHistoricalForecastWeeklyData) {
      if (nextProps.getHistoricalForecastWeeklyData != 0) {
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < nextProps.getHistoricalForecastWeeklyData.length; i++) {
          if (nextProps.getHistoricalForecastWeeklyData[i].Is_Predicted == 'Y') {
            this.setState({
              snapweeklyN: i
            });
            break;
          }
        }

        this.setState({
          getHistoricalForecastWeeklyData: nextProps.getHistoricalForecastWeeklyData,
          load1: true
        });
      } else {
        this.setState({ getHistoricalForecastWeeklyData: [], Load1: true });
      }
    }
    if (this.props.EOQDDHeaderData != nextProps.EOQDDHeaderData) {
      if (nextProps.EOQDDHeaderData != 0) {
        if (nextProps.EOQDDHeaderData[0].HECI != undefined) {
          this.setState({
            HECI: nextProps.EOQDDHeaderData[0].HECI,
            STOCK_TYPE: nextProps.EOQDDHeaderData[0].STOCK_TYPE,
            CTL_STOCKOUT_FLAG: nextProps.EOQDDHeaderData[0].CTL_STOCKOUT_FLAG,
            LVLT_STOCKOUT_FLAG: nextProps.EOQDDHeaderData[0].LVLT_STOCKOUT_FLAG
          });
        }
        this.setState({
          EOQDDHeaderData: nextProps.EOQDDHeaderData
        });
      } else {
        this.setState({
          EOQDDHeaderData: []
        });
      }
    }
    if (this.props.predictedChartData != nextProps.predictedChartData) {
      if (nextProps.predictedChartData != 0) {
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < nextProps.predictedChartData.length; i++) {
          if (nextProps.predictedChartData[i].is_predicted === 'Y') {
            this.setState({
              predictedY: i
            });
            break;
          }
        }
        this.setState({
          ChartData: nextProps.predictedChartData,
          Loader: false
        });
      } else {
        this.setState({
          ChartData: [],
          Loader: true
        });
      }
    }
    if (this.props.poMaterialChartData != nextProps.poMaterialChartData) {
      if (nextProps.poMaterialChartData != 0) {
        this.setState({
          materialBarData: nextProps.poMaterialChartData,
          Loader: false
        });
      } else {
        this.setState({
          poMaterialChartData: [],
          Loader: true
        });
      }
    }
    if (this.props.getWeeklyStockVisualizationData != nextProps.getWeeklyStockVisualizationData) {
      if (nextProps.getWeeklyStockVisualizationData != 0) {
        this.setState({
          getWeeklyStockVisualizationData: nextProps.getWeeklyStockVisualizationData,
          Loader: false
        });
      } else {
        this.setState({
          getWeeklyStockVisualizationData: [],
          Loader: true
        });
      }
    }
    if (this.props.getMonthlyStockVisualizationData != nextProps.getMonthlyStockVisualizationData) {
      if (nextProps.getMonthlyStockVisualizationData != 0) {
        this.setState({
          getMonthlyStockVisualizationData: nextProps.getMonthlyStockVisualizationData,
          Loader: false
        });
      } else {
        this.setState({
          getMonthlyStockVisualizationData: [],
          Loader: true
        });
      }
    }
    if (this.props.predictedChartMonthData != nextProps.predictedChartMonthData) {
      if (nextProps.predictedChartMonthData != 0) {
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < nextProps.predictedChartMonthData.length; i++) {
          if (nextProps.predictedChartMonthData[i].Is_Predicted == 'Y') {
            this.setState({
              monthlyPredictedY: i
            });
            break;
          }
        }
        this.setState({
          MonthlyChartData: nextProps.predictedChartMonthData,
          Loader: false
        });
      } else {
        this.setState({
          MonthlyChartData: [],
          Loader: true
        });
      }
    }
  }
  callback(key) {
    this.setState({
      Loader: false
    });
    if (key == 2) {
      this.setState({
        Loader: true,
        OrderHistory: true,
        defaultActiveKey: '2'
      });
      this.props.getPOMaterialChart(this.state.MaterialNo, this.state.lgort);
    } else if (key == 4) {
      this.setState({
        Loader: true,
        OrderHistory: false,
        defaultActiveKey: '4',
        monthlySnapshotView: true,
        weeklySnapshotView: false,
        Title: `${this.state.MaterialNo}- Historical Forecast Monthly`
      });
      this.props.getHistoricalSnapshotForecastMinMaxDate(this.state.MaterialNo);
      this.props.getHistoricalForecastMonthly(
        this.state.MaterialNo,
        this.state.minDateMonthly,
        this.state.lgort
      );
    } else if (key == '6') {
      this.setState({
        defaultActiveKey: '6',
        Loader: true
      });
    } else if (key == 5) {
      this.setState({
        defaultActiveKey: '5',
        Loader: true
      });
      // this.props.getLeadTimeTrending(this.state.MaterialNo);
      this.props.getLeadTimeTrendingMaterialEOQ(this.state.MaterialNo);
    } else if (key == 3) {
      this.setState({
        Loader: true,
        OrderHistory: false,
        defaultActiveKey: '3',
        monthlyStockView: true,
        weeklyStockView: false,
        TitleStock: `${this.state.MaterialNo}- Stock Visualization Monthly`
      });
      this.props.getMonthlyStockVisualization(this.state.MaterialNo, this.state.lgort);
      this.props.getCapGovMaterialReport(
        this.state.MaterialNo,
        sessionStorage.getItem('loggedcuid'),
        'all',

        this.state.lgort,
        this.props.parsedBlockedDeleted,
        'MATERIAL'
      );
    } else {
      this.setState({
        OrderHistory: false,
        defaultActiveKey: '1',
        materialBarData: [],
        weeklyView: false,
        monthlyView: true,
        TitleCon: `${this.state.MaterialNo}- Consumption Monthly`
      });
      this.props.getPredictedChartMonth(this.state.MaterialNo, this.state.lgort);
    }
  }
  monthlyChart() {
    this.setState({
      weeklyView: false,
      monthlyView: true,
      TitleCon: `${this.state.MaterialNo}- Consumption Monthly`
    });
    this.props.getPredictedChartMonth(this.state.MaterialNo, this.state.lgort);
  }
  weeklyChart() {
    this.setState({
      Loader: true,
      weeklyView: true,
      monthlyView: false,
      TitleCon: `${this.state.MaterialNo}- Consumption Weekly`
    });
    this.props.getPredictedChart(
      this.state.MaterialNo,

      this.state.lgort
    );
  }

  weeklySnapshot() {
    this.props.getHistoricalSnapshotForecastMinMaxDate(this.state.MaterialNo);

    if (this.state.getHistoricalForecastWeeklyData == 0) {
      this.setState({
        load: false,
        load1: true
      });
    }
    this.setState({
      monthlySnapshotView: false,
      weeklySnapshotView: true,
      Title: `${this.state.MaterialNo}- Historical Forecast Weekly`,
      minDate: this.state.minDateWeekly,
      maxDate: this.state.maxDateWeekly,
      starting: this.state.minDateWeekly
    });
    this.props.getHistoricalForecastWeekly(
      this.state.MaterialNo,
      this.state.minDateWeekly,
      this.state.lgort
    );
  }
  monthlySnapshot() {
    this.props.getHistoricalSnapshotForecastMinMaxDate(this.state.MaterialNo);
    if (this.state.getHistoricalForecastMonthlyData == 0) {
      this.setState({
        load: true,
        load1: false
      });
    }
    this.setState({
      monthlySnapshotView: true,
      weeklySnapshotView: false,
      Title: `${this.state.MaterialNo}- Historical Forecast Monthly`,
      minDate: this.state.minDateMonthly,
      maxDate: this.state.maxDateMonthly,
      starting: this.state.minDateMonthly
    });
    this.props.getHistoricalForecastMonthly(
      this.state.MaterialNo,
      this.state.minDateMonthly,
      this.state.lgort
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

  monthlyStockChart() {
    this.setState({
      monthlyStockView: true,
      weeklyStockView: false,
      Loader: true,
      TitleStock: `${this.state.MaterialNo}- Stock Visualization Monthly`
    });
    this.props.getMonthlyStockVisualization(this.state.MaterialNo, this.state.lgort);
    this.props.getCapGovMaterialReport(
      this.state.MaterialNo,
      sessionStorage.getItem('loggedcuid'),
      'all',

      this.state.lgort,
      this.props.parsedBlockedDeleted,
      'MATERIAL'
    );
  }
  weeklyStockChart() {
    this.setState({
      monthlyStockView: false,
      weeklyStockView: true,
      TitleStock: `${this.state.MaterialNo}- Stock Visualization Weekly`
    });
    this.props.getWeeklyStockVisualization(this.state.MaterialNo, this.state.lgort);
  }

  TooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>{value}</b> <br />
          </span>
          {e.payload[0].payload.is_predicted == 'N' ? (
            <span className="text-white">
              <b>Total Consumption(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          ) : (
            <span className="text-white">
              <b> Predicted Demand(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          )}
        </div>
      );
    }
  }
  TooltipFormatterOne(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>{value}</b> <br />
          </span>
          {e.payload[0].payload.Is_Predicted == 'N' ? (
            <span className="text-white">
              <b> Total Consumption(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          ) : (
            <span className="text-white">
              <b> Predicted Demand(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          )}
        </div>
      );
    }
  }

  TooltipFormatterOne1(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let Value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>{Value}</b> <br />
          </span>

          {e.payload[0].payload.Original_value != null ? (
            <span className="text-white">
              <b> Actual Consumption(Qty): {e.payload[0].payload.Original_value}</b> <br />
            </span>
          ) : (
            ''
          )}

          {e.payload[0].payload.Is_Predicted == 'N' ? (
            <span className="text-white">
              <b>Predicted Demand(Trained): {e.payload[0].payload.Value}</b> <br />
            </span>
          ) : (
            ''
          )}

          {e.payload[0].payload.Is_Predicted == 'Y' ? (
            <span className="text-white">
              <b>Predicted Demand(Forecast) : {e.payload[0].payload.Value}</b>
              <br />
            </span>
          ) : (
            ''
          )}

          {e.payload[0].payload.Overwritted_Qty != null ? (
            <span className="text-white">
              <b>Overwritten Qty : {e.payload[0].payload.Overwritted_Qty}</b>
            </span>
          ) : (
            ''
          )}
        </div>
      );
    }
  }
  TooltipFormatterThree(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.PO_DATE).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>PO Date: {value}</b> <br />
          </span>
          <span className="text-white">
            <b>Delivered Quantity: {e.payload[0].payload.Delivered_Quantity}</b> <br />
          </span>
          {e.payload[0].payload.Open_Quantity > 0 ? (
            <>
              <span className="text-white">
                <b>Open Quantity: {e.payload[0].payload.Open_Quantity}</b> <br />
              </span>
            </>
          ) : (
            ''
          )}
        </div>
      );
    } else {
      return '';
    }
  }
  TooltipFormatterLeadTimeTrend(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>Monthly: {moment(e.payload[0].payload.PO_DATE).format('MMM-YYYY')}</b> <br />
          </span>
          <span className="text-white">
            <b>Median: {e.payload[0].payload.MEDIAN} Days</b> <br />
          </span>
        </div>
      );
    }
  }
  formatXAxis(tickItem) {
    return moment(tickItem).format('MM-DD-YYYY');
  }
  formatXAxisLeadTime(tickItem) {
    return moment(tickItem).format('MMM-YYYY');
  }

  TooltipFormatterWeeklystock(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-bolder golden-text font-14">
            <b>Date: {value}</b> <br />
          </span>
          <span className="text-white font-14">
            <b>
              Ending on hand:{' '}
              <span className="ending-on-hand-text font-14">
                {e.payload[0].payload.Ending_on_hand}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Predicted Consumption:{' '}
              <span className="predicted-consumption-text font-14">
                {e.payload[0].payload.Predicted_consumption}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Quantity To Order:{' '}
              <span className="projected-need-text font-14">
                {e.payload[0].payload.Quantity_To_Order}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  }
  exportToCSV() {
    var dum = [];

    if (this.state.weeklyView == true) {
      dum = this.state.ChartData.map((obj) => {
        return {
          Material: obj.matnr,
          Date: obj.ds,
          Quantity: obj.value
        };
      });
    } else {
      dum = this.state.MonthlyChartData.map((obj) => {
        return {
          Material: obj.MATNR,
          Date: obj.ds,
          Quantity: obj.value
        };
      });
    }
    let csvData = dum;
    let fileName = this.state.TitleCon;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSV2() {
    var dum = [];
    if (this.state.monthlyStockView == true) {
      dum = this.state.getMonthlyStockVisualizationData.map((obj) => {
        return {
          Material: obj.MATNR,
          Date: obj.ds,
          Endingonhand: obj.Ending_on_hand,
          Predictedconsumption: obj.Predicted_consumption,
          Quantitytoorder: obj.Quantity_To_Order,
          OpenQuantity: obj.Open_Quantity
        };
      });
    } else {
      dum = this.state.getWeeklyStockVisualizationData.map((obj) => {
        return {
          Material: obj.MATNR,
          Date: obj.ds,
          Endingonhand: obj.Ending_on_hand,
          Predictedconsumption: obj.Predicted_consumption,
          Quantitytoorder: obj.Quantity_To_Order,
          OpenQuantity: obj.Open_Quantity
        };
      });
    }
    let csvData = dum;

    let fileName = this.state.TitleStock;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportsnap() {
    if (this.state.monthlySnapshotView == true) {
      var dum = this.state.getHistoricalForecastMonthlyData;
    } else {
      dum = this.state.getHistoricalForecastWeeklyData;
    }
    let csvData = dum;

    let fileName = this.state.Title;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSV1() {
    var dum = [];
    if (this.state.monthlyStockView == true) {
      dum = this.state.materialBarData.map((obj) => {
        return {
          Material: obj.material,
          Date: obj.PO_DATE,
          Delivered_Quantity: obj.Delivered_Quantity,
          Open_Quantity: obj.Open_Quantity
        };
      });
    }
    let csvData = dum;

    let fileName = 'Order History';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVReplacedMtnr() {
    let csvData = this.state.getReplacedMaterialDetailsData;
    let fileName = 'ReplacedMaterialDetails';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVPushPullApproverReview() {
    let csvData = this.state.getForecastOverrideApproverReviewData;
    let fileName = 'getForecastOverrideApproverReview';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToLeadtimeTrend() {
    let csvData = this.state.getLeadTimeTrendingData;

    let fileName = 'LeadTime Trend';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  getDate(e) {
    this.setState({
      starting: moment(e).format('YYYY-MM-DD'),
      getHistoricalForecastWeeklyData: [],
      getHistoricalForecastMonthlyData: [],
      load: true,
      Load1: true
    });
    if (this.state.monthlySnapshotView == true) {
      this.props.getHistoricalForecastMonthly(
        this.state.MaterialNo,
        moment(e).format('YYYY-MM-DD'),
        this.state.lgort
      );
    } else {
      this.props.getHistoricalForecastWeekly(
        this.state.MaterialNo,
        moment(e).format('YYYY-MM-DD'),
        this.state.lgort
      );
    }
  }

  setModalClose() {
    this.setState({
      newleadtime: '',
      leadtimecmnt: '',
      TillDateCount: '',
      setModalVissible: false,
      error1: '',
      error2: '',
      error: ''
    });
  }
  showmodal() {
    this.setState({
      setModalVissible: true
    });
  }
  getcomment(e) {
    this.setState({ leadtimecmnt: e.target.value });
  }
  getnewleadtime(e) {
    if (isNaN(Number(e.target.value))) {
      return;
    } else {
      this.setState({
        newleadtime: e.target.value
      });
    }
  }
  validateForm() {
    let Errors = {};
    let formIsValid = true;
    if (!this.state.newleadtime) {
      formIsValid = false;
      Errors['Leadtime'] = '*LeadTime is required';
    }

    if (!this.state.leadtimecmnt) {
      formIsValid = false;
      Errors['comment'] = '*Comment is required';
    }

    this.setState({
      Errors: Errors
    });
    return formIsValid;
  }

  HandleSubmit() {
    this.setState({
      error: ''
    });
    if (
      this.state.newleadtime == '' ||
      this.state.newleadtime < 0 ||
      this.state.newleadtime > 365
    ) {
      this.setState({
        error: 'Newleadtime must be between 0 and 365'
      });
    } else if (this.state.TillDateCount == '') {
      this.setState({
        error1: 'Enter the TillDate'
      });
    } else if (this.state.leadtimecmnt == '') {
      this.setState({
        error2: 'Enter the Comment'
      });
    } else {
      this.setState({
        overwriteModal: true,
        LeadtimeLoad: true
      });
    }
  }
  handleNo() {
    this.setState({
      overwriteModal: false
    });
    NotificationManager.error('Data Not Updated', '', 2000);
    this.setState({
      LeadtimeLoad: false,
      error: '',
      error1: '',
      error2: '',
      overwriteModal: false,
      setModalVissible: false,
      leadtimecmnt: '',
      newleadtime: '',
      TillDateCount: ''
    });
  }
  handleYes() {
    this.setState({
      overwriteModal: false
    });
    axios({
      url:
        ROOT_URL +
        'PostLeadTimeOverwrite?MATERIAL=' +
        this.state.MaterialNo +
        '&NewLeadTime=' +
        this.state.newleadtime +
        '&COMMENTS=' +
        this.state.leadtimecmnt +
        '&SUBMITTED_BY=' +
        sessionStorage.getItem('loggedEmailId') +
        '&tilldate=' +
        this.state.TillDateCount,
      method: 'post'
    }).then((res) => {
      if (res.status == 200) {
        NotificationManager.success(res.data, '', 2000);
        this.setState({
          LeadtimeLoad: false,
          error: '',
          error1: '',
          error2: '',
          setModalVissible: false,
          leadtimecmnt: '',
          newleadtime: '',
          TillDateCount: ''
        });

        this.props.getEOQHeaderDD(this.state.MaterialNo, this.state.lgort);
      } else {
        NotificationManager.error('Data Not Updated', '', 2000);
        this.setState({
          LeadtimeLoad: false,
          error: '',
          error1: '',
          error2: '',
          overwriteModal: false,
          setModalVissible: false,
          leadtimecmnt: '',
          newleadtime: '',
          TillDateCount: ''
        });
      }
    });
  }

  handleLeadtimeDateChange(e) {
    this.setState({ leadtimeDate: moment(e).format('MM-DD-YYYY') });
  }
  tillDatefunc(value) {
    // this.setState({
    //   TillDateCount: value.key,
    // });
    this.setState({
      TillDateCount: value
    });
  }

  handleBrushChange({ startIndex, endIndex }) {
    let startIndexValue;
    startIndexValue = this.startBrushIndexOf(this.state.ChartData);

    let date1 = new Date(this.state.fromBrushValueWeekly);
    let date2 = new Date(this.state.toBrushValueWeekly);

    var days = Math.floor(Math.abs(date1 - date2) / 1000 / 86400);

    this.setState({
      fromBrushValueWeekly: this.state.ChartData[startIndex].ds,
      toBrushValueWeekly: this.state.ChartData[endIndex].ds,
      startBrushIndex: startIndexValue,
      noOfWeeksWeeklyTrend: days / 7
    });
  }

  startBrushIndexOf(array) {
    for (var i = this.state.fromBrushValueWeekly; i < this.state.toBrushValueWeekly; i++)
      return array.findIndex((x) => x.ds === i);
  }
  overridetbl() {
    if (this.state.overridetblmodal) {
      this.state.PostArray != '' ? (this.bstable.current.selectionContext.selected = []) : '';

      this.setState({
        overridetblmodal: false,
        PostArray: [],
        NewOverWriteQty: '',
        OverWriteComment: '',
        ReasonCodeVal: '',
        getForcastOverwriteDetailsData: []
      });
      this.props.getForcastOverwriteDetails(this.state.MaterialNo, this.state.lgort);
    } else {
      this.setState({
        overridetblmodal: true
      });
    }
  }

  beforeSaveCell(oldValue, newValue, row, column) {
    if (column.dataField === 'OVERWRITE_QTY') {
      if (newValue != null) {
        this.setState({
          NewOverWriteQty: newValue
        });
      } else {
        this.setState({
          NewOverWriteQty: oldValue
        });
      }
    } else if (column.dataField === 'REASON_CODE') {
      if (newValue != null) {
        this.setState({
          ReasonCodeVal: newValue
        });
      } else {
        this.setState({
          ReasonCodeVal: oldValue
        });
      }
    } else if (column.dataField === 'COMMENTS') {
      if (newValue != null) {
        this.setState({
          OverWriteComment: newValue
        });
      } else {
        this.setState({
          OverWriteComment: oldValue
        });
      }
    }
    setTimeout(() => {
      if (
        this.state.NewOverWriteQty != '' &&
        this.state.ReasonCodeVal != '' &&
        this.state.OverWriteComment != ''
      ) {
        let oldQty = row.value;

        let COMMENTS = this.state.OverWriteComment;
        let overrideBy = sessionStorage.getItem('loggedEmailId');
        let obj = {
          MATERIAL: this.state.MaterialNo,
          LGORT: this.state.lgort,
          DATE: row.ds,
          FORECASTED_QTY: oldQty,
          OVERWRITE_QTY: this.state.NewOverWriteQty,
          SUBMITTED_BY: overrideBy,
          COMMENTS: COMMENTS,
          REASON_CODE: this.state.ReasonCodeVal
        };
        if (this.state.PostArray != '') {
          if (!this.state.PostArray.some((o) => o.DATE === row.ds)) {
            this.state.PostArray.push(obj);
            this.setState({
              ReasonCodeVal: '',
              NewOverWriteQty: '',
              OverWriteComment: ''
            });
          } else {
            this.setState((prevState) => ({
              PostArray: prevState.PostArray.map((el) =>
                el.DATE === row.ds
                  ? {
                      ...el,
                      OVERWRITE_QTY: this.state.NewOverWriteQty,
                      REASON_CODE: this.state.ReasonCodeVal,
                      COMMENTS: COMMENTS
                    }
                  : el
              )
            }));
          }
        } else {
          this.state.PostArray.push(obj);
          this.setState({
            ReasonCodeVal: '',
            NewOverWriteQty: '',
            OverWriteComment: ''
          });
        }
      }
    }, 1);
  }

  SubmitApi() {
    axios
      .post(`${ROOT_URL}PostValidateForecastOverride`, {
        Overwritedetails: JSON.stringify(this.state.PostArray)
      })
      .then((res) => {
        if (res.data == 'True') {
          axios
            .post(
              `${ROOT_URL}PostForcastOverwriteDetails?Approver=${sessionStorage.getItem(
                'loggedEmailId'
              )}&IsApprover=${sessionStorage.getItem('ForecastOverrideApprover')}`,
              {
                Overwritedetails: JSON.stringify(this.state.PostArray)
              }
            )
            .then((res) => {
              if (res.status == 200) {
                this.bstable.current.selectionContext.selected = [];
                message.success('Data Updated Successfully');
                this.setState({
                  PostArray: [],
                  NewOverWriteQty: '',
                  OverWriteComment: '',
                  ReasonCodeVal: ''
                });

                this.props.getForcastOverwriteDetails(this.state.MaterialNo, this.state.lgort);
              } else if (res.status == 500) {
                message.error('Data was Not updated');
                this.setState({
                  PostArray: [],
                  NewOverWriteQty: '',
                  OverWriteComment: '',
                  ReasonCodeVal: ''
                });
              }
            })
            .catch(() => {
              message.error('Data Not Uploaded');
            });
        } else if (res.data == 'False') {
          this.state.PostArray.forEach(function (v) {
            if (
              Object.keys(v).some(function (k) {
                return v[k] == null;
              })
            ) {
              if (v.DATE != '') {
                let dd = v.DATE;
                var output = [];

                if (v.COMMENTS == null) {
                  output.push('Comments');
                }

                if (v.REASON_CODE == null) {
                  output.push('ReasonCode');
                }
                if (v.OVERWRITE_QTY == null) {
                  output.push('OVERWRITE_QTY');
                }

                message.error(
                  `Please enter The mentioned fields ${output.toString()} for the Date ${dd}`
                );
              }
              output = [];
            }
          });
          this.setState({
            NewOverWriteQty: '',
            OverWriteComment: '',
            ReasonCodeVal: ''
          });
        } else {
          this.setState({
            requestalertMsg: res.data,
            overwriteModalForecast: true
          });
        }
      })
      .catch(() => {
        message.error('Date Not Uploaded');
      });
  }
  materialDescription(cell, row) {
    var stillUtc = moment.utc(row.Updated_Date).toDate();
    var local = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');
    return (
      <div>
        <Popover
          placement="right"
          className="modal-tool-tip"
          content={
            <p>
              <p>Modified By : {row.SUBMITTED_BY}</p>

              <p>Modified Date : {local == 'Invalid date' ? '' : local}</p>
            </p>
          }>
          <span className="row-data">{row.ds}</span>
        </Popover>
      </div>
    );
  }
  dateformat(cell) {
    let value = moment(cell).format('MM-DD-YYYY');
    if (value == '01-01-2099' || cell == null || cell == '') {
      return <span>-</span>;
    } else {
      return <span>{value}</span>;
    }
  }

  onRowSelect(row, isSelected) {
    if (this.state.prop) {
      let dddd = this.state.getForcastOverwriteDetailsData;
      this.setState({
        prop: false,
        TempgetForcastOverwriteDetailsData: dddd
      });
    }

    if (isSelected) {
      this.state.OldTblVale.push(row);
    } else {
      const value = row.ds;
      if (this.state.OldTblVale.find((o) => o.ds === value)) {
        // eslint-disable-next-line no-unused-vars
        let val = this.state.OldTblVale.find((o) => o.ds);
      }
      this.setState((prevState) => ({
        getForcastOverwriteDetailsData: prevState.getForcastOverwriteDetailsData.map((el) =>
          el.ds === value
            ? {
                ...el,
                OVERWRITE_QTY: el.Dummy_OVERWRITE_QTY,
                REASON_CODE: el.Dummy_REASON_CODE,
                COMMENTS: el.Dummy_COMMENTS
              }
            : el
        )
      }));

      this.setState({
        ReasonCodeVal: '',
        NewOverWriteQty: '',
        OverWriteComment: ''
      });
    }

    var rowStr = '';
    for (const prop in row) {
      // eslint-disable-next-line no-unused-vars
      rowStr += prop + ': "' + row[prop] + '"';
    }
    // alert(rowStr);

    if (this.state.PostArray != '') {
      var index = this.state.PostArray.findIndex(function (o) {
        return o.DATE === row.ds;
      });
      if (index !== -1) this.state.PostArray.splice(index, 1);
    }

    // alert(`is selected: ${isSelected}, ${rowStr}`);
  }

  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.replacedMaterialcolumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ replacedMaterialcolumn: columnsCopy });
  }

  onDragEndOverWriteTable(fromIndex, toIndex) {
    const columnsCopy = this.state.tempcol.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ tempcol: columnsCopy });
  }

  onDragEndNONeditOverWriteTable(fromIndex, toIndex) {
    const columnsCopy = this.state.tempcol1.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ tempcol1: columnsCopy });
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
  HandleSplitmatnr(val) {
    var str = val;
    var res = str.replace(/\D/g, '');
    this.setState({
      MaterialNo: res,
      openModal: false,
      Loader: false,
      defaultActiveKey: '1'
    });

    setTimeout(() => {
      this.setState({
        openModal: true
      });
    }, 1000);
    this.props.getEOQHeaderDD(res, this.state.lgort);
    this.props.getPredictedChartMonth(res, this.state.lgort);
    this.props.getForcastOverwriteDetails(res, this.state.lgort);
    this.props.getHistoricalSnapshotForecastMinMaxDate(res);
    this.props.getReplacedMaterialDetails(res);
  }
  getcheckValues(checked) {
    if (checked) {
      this.setState({
        OverriteTable: checked
      });
      this.props.getForcastOverwriteDetails(this.state.MaterialNo, this.state.lgort);
    } else {
      this.setState({
        isDataFetched: false,
        newResultLength: '',
        OverriteTable: checked
      });

      this.props.getForecastOverrideApproverReview(
        sessionStorage.getItem('loggedEmailId'),
        this.state.MaterialNo,
        this.state.lgort
      );
    }
  }
  validate() {
    this.state.PostArray.forEach(function (v) {
      if (
        Object.keys(v).some(function (k) {
          return v[k] == null;
        })
      ) {
        if (v.DATE != '') {
          let dd = v.DATE;
          var output = [];

          if (v.COMMENTS == null) {
            output.push('Comments');
          }

          if (v.REASON_CODE == null) {
            output.push('ReasonCode');
          }
          if (v.OVERWRITE_QTY == null) {
            output.push('OVERWRITE_QTY');
          }

          message.error(
            `Please enter The mentioned fields ${output.toString()} for the Date ${dd}`
          );
          return false;
        } else {
          return true;
        }
      }
    });
  }

  UpdateForecastData() {
    if (this.state.UpdatePopup) {
      this.setState({
        UpdatePopup: false
      });
    } else {
      axios
        .post(`${ROOT_URL}PostValidateForecastOverride`, {
          Overwritedetails: JSON.stringify(this.state.PostArray)
        })
        .then((res) => {
          if (res.data == 'True') {
            this.setState({
              NewOverWriteQty: '',
              OverWriteComment: '',
              ReasonCodeVal: '',
              UpdatePopup: true
            });
          } else if (res.data == 'False') {
            this.state.PostArray.forEach(function (v) {
              if (
                Object.keys(v).some(function (k) {
                  return v[k] == null;
                })
              ) {
                if (v.DATE != '') {
                  let dd = v.DATE;
                  var output = [];

                  if (v.COMMENTS == null) {
                    output.push('Comments');
                  }

                  if (v.REASON_CODE == null) {
                    output.push('ReasonCode');
                  }
                  if (v.OVERWRITE_QTY == null) {
                    output.push('OVERWRITE_QTY');
                  }

                  message.error(
                    `Please enter The mentioned fields ${output.toString()} for the Date ${dd}`
                  );
                }
                output = [];
              }
            });
          } else {
            this.setState({
              requestalertMsg: res.data,
              overwriteModalForecast: true
            });
          }
        })
        .catch(() => {
          message.error('File To Upload');
        });
    }
  }
  handleApproverChange(e) {
    this.state.getForecastOverrideApproverListData.map((dat) => {
      if (dat.FULLNAME == e) {
        this.setState({
          ForecastApprover: e,
          ForecastId: dat.ID
        });
      }
    });
  }
  ForecastOverrideNonApprover() {
    if (this.state.PostArray != 0) {
      axios
        .post(
          `${ROOT_URL}PostForcastOverwriteDetails?Approver=${
            this.state.ForecastId
          }&IsApprover=${sessionStorage.getItem('ForecastOverrideApprover')}`,
          {
            Overwritedetails: JSON.stringify(this.state.PostArray)
          }
        )
        .then((res) => {
          if (res.status === 200) {
            this.bstable.current.selectionContext.selected = [];
            message.success('Data Updated Successfully');
            this.setState({
              PostArray: [],
              NewOverWriteQty: '',
              OverWriteComment: '',
              ReasonCodeVal: '',
              ForecastId: '',
              ForecastApprover: '',
              UpdatePopup: false
            });

            this.props.getForcastOverwriteDetails(this.state.MaterialNo, this.state.lgort);
          } else if (res.status == 500) {
            message.error('Data Was Not Updated ');
          }
        })
        .catch(() => {
          this.state.PostArray.forEach(function (v) {
            if (
              Object.keys(v).some(function (k) {
                return v[k] == null;
              })
            ) {
              if (v.DATE != '') {
                let dd = v.DATE;
                var output = [];

                if (v.COMMENTS == null) {
                  output.push('Comments');
                }

                if (v.REASON_CODE == null) {
                  output.push('ReasonCode');
                }
                if (v.OVERWRITE_QTY == null) {
                  output.push('OVERWRITE_QTY');
                }

                message.error(
                  `Please enter The mentioned fields ${output.toString()} for the Date ${dd}`
                );
              }
              output = [];
            }
          });
          this.setState({
            NewOverWriteQty: '',
            OverWriteComment: '',
            ReasonCodeVal: '',
            ForecastId: '',
            ForecastApprover: '',
            UpdatePopup: false
          });
        });
    } else {
      message.error('There was an error with your Submission');
    }
  }
  rowformatter(cell) {
    if (cell == 'Rejected') {
      return (
        <div>
          <span style={{ color: '#f5222d', fontSize: '14px' }}>{cell}</span>
        </div>
      );
    } else if (cell == 'Approved') {
      return (
        <div>
          <span style={{ color: '#50c878', fontSize: '14px' }}>{cell}</span>
        </div>
      );
    } else {
      return (
        <div>
          <span style={{ color: '#ffa500', fontSize: '14px' }}>{cell}</span>
        </div>
      );
    }

    // <div>
    //   <span className="row-data">{cell}</span>
    // </div>
  }
  handleYesforecastOverrideApprover(e) {
    if (e == 'Yes') {
      this.setState({
        overwriteModalForecast: false
      });
      axios
        .post(
          `${ROOT_URL}PostForcastOverwriteDetails?Approver=${sessionStorage.getItem(
            'loggedEmailId'
          )}&IsApprover=${sessionStorage.getItem('ForecastOverrideApprover')}`,
          {
            Overwritedetails: JSON.stringify(this.state.PostArray)
          }
        )
        .then((res) => {
          if (res.status == 200) {
            this.bstable.current.selectionContext.selected = [];
            message.success('Data Updated Successfully');
            this.setState({
              PostArray: [],
              NewOverWriteQty: '',
              OverWriteComment: '',
              ReasonCodeVal: ''
            });

            this.props.getForcastOverwriteDetails(this.state.MaterialNo, this.state.lgort);
          } else if (res.status == 500) {
            message.error('Data was Not updated');
            this.setState({
              PostArray: [],
              NewOverWriteQty: '',
              OverWriteComment: '',
              ReasonCodeVal: ''
            });
          }
        })
        .catch(() => {
          message.error('Data Not Uploaded');
        });
    } else {
      this.bstable.current.selectionContext.selected = [];
      this.setState({
        overwriteModalForecast: false,
        PostArray: [],
        NewOverWriteQty: '',
        OverWriteComment: '',
        ReasonCodeVal: '',
        ForecastId: '',
        ForecastApprover: ''
      });
      this.props.getForcastOverwriteDetails(this.state.MaterialNo, this.state.lgort);
    }
  }

  handleYesforecastOverride(e) {
    if (e == 'Yes') {
      this.setState({
        overwriteModalForecast: false,
        UpdatePopup: true
      });
    } else {
      this.bstable.current.selectionContext.selected = [];
      this.setState({
        overwriteModalForecast: false,
        PostArray: [],
        NewOverWriteQty: '',
        OverWriteComment: '',
        ReasonCodeVal: '',
        ForecastId: '',
        ForecastApprover: ''
      });
      this.props.getForcastOverwriteDetails(this.state.MaterialNo, this.state.lgort);
    }
  }
  onRowSelectForecastApproverReview(row, isSelected) {
    if (isSelected) {
      const { ApproverReviewArray } = this.state;
      let data = row.ID;

      this.setState(() => ({
        ApproverReviewArray: [...ApproverReviewArray, data]
      }));
    } else {
      let data = row.ID;

      let res = this.state.ApproverReviewArray.filter((d) => d !== data);

      this.setState({
        ApproverReviewArray: res
      });
    }
  }

  handleOnSelectAllForecastOverrideApproverReview(isSelect) {
    if (isSelect) {
      const { ApproverReviewArray } = this.state;
      let data = this.state.getForecastOverrideApproverReviewData.map((d) => d.ID);

      this.setState(() => ({
        ApproverReviewArray: [...ApproverReviewArray, ...data]
      }));
      return this.state.getForecastOverrideApproverReviewData.map((d) => d.ID);
    } else {
      let data = this.state.getForecastOverrideApproverReviewData.map((d) => d.ID);

      let res = this.state.ApproverReviewArray.filter((d) => !data.includes(d));

      this.setState({
        ApproverReviewArray: res
      });
      return [];
    }
  }
  ResetSelectedState() {
    this.setState({
      ApproverReviewArray: []
    });
  }
  UpdateValidation() {
    if (this.state.UpdatePopUpApproverReview) {
      this.setState({
        UpdatePopUpApproverReview: false
      });
    } else {
      this.setState({
        UpdatePopUpApproverReview: true
      });
    }
  }
  getApproverCommentForecastOverride(e) {
    this.setState({
      getApproverReviewForForecastOverride: e.target.value
    });
  }
  PostForcastOverwriteUpdate(v1, v2, v3) {
    axios
      .post(
        `${ROOT_URL}PostForcastOverwriteUpdate?Status=${v2}&Approver_Comments=${v3}&IsBulkUpload=N`,
        {
          ID: v1
        }
      )
      .then((res) => {
        if (res.data) {
          this.setState({
            ApproverReviewArray: [],
            getForecastOverrideApproverReviewData: [],
            getApproverReviewForForecastOverride: '',
            UpdatePopUpApproverReview: false,
            isDataFetched: false,
            newResultLength: ''
          });
        }
        this.props.getForecastOverrideApproverReview(
          sessionStorage.getItem('loggedEmailId'),
          this.state.MaterialNo,
          this.state.lgort
        );
      })
      .catch(() => {
        message.error('Data Not Uploaded');
      });
  }
  render() {
    const selectRowForecastApproverReview = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.ApproverReviewArray,
      onSelect: this.onRowSelectForecastApproverReview.bind(this),
      onSelectAll: this.handleOnSelectAllForecastOverrideApproverReview.bind(this)
    };
    const selectRow = {
      // mode: "radio",
      // clickToSelect: true,
      mode: 'checkbox',

      clickToEdit: true,
      classes: 'selection-row',
      onSelect: this.onRowSelect.bind(this)
    };
    let btn_class_Weekly = this.state.weeklyView ? '' : 'white-btn ';
    let btn_class_Monthly = this.state.monthlyView ? '' : 'white-btn';

    let btn_class_Weekly1 = this.state.weeklySnapshotView ? '' : 'white-btn ';
    let btn_class_Monthly1 = this.state.monthlySnapshotView ? '' : 'white-btn';
    let btn_class_Weekly_Stock = this.state.weeklyStockView ? '' : 'white-btn';
    let btn_class_Monthly_Stock = this.state.monthlyStockView ? '' : 'white-btn';

    const percentage =
      100 -
      ((this.state.ChartData.length - this.state.predictedY - 1) /
        (this.state.ChartData.length - 1)) *
        100;
    const percentageone =
      100 -
      ((this.state.MonthlyChartData.length - this.state.monthlyPredictedY - 1) /
        (this.state.MonthlyChartData.length - 1)) *
        100;
    // #######################################

    const snap_percentage =
      100 -
      ((this.state.getHistoricalForecastWeeklyData.length - this.state.snapweeklyN - 1) /
        (this.state.getHistoricalForecastWeeklyData.length - 1)) *
        100;

    const snap_percentageOne =
      100 -
      ((this.state.getHistoricalForecastMonthlyData.length - this.state.snapMonthlyN - 1) /
        (this.state.getHistoricalForecastMonthlyData.length - 1)) *
        100;

    return (
      <div>
        <Modal
          width="30%"
          style={{ top: 60 }}
          footer={null}
          className="Intervaltimeline inventoryAlertModal"
          visible={this.state.overwriteModal}>
          <div className="text-center font-17">
            <p className="font-17">
              <div>{this.state.requestalertData}</div>
              <div>Do you want to overwrite this?</div>
            </p>
          </div>
          <div className="text-center">
            <Button
              size="sm"
              className="export-Btn"
              value="Yes"
              onClick={this.handleYes.bind(this)}>
              <i className="fa fa-save mr-2" />
              <span className="text-white">Yes</span>
            </Button>
            <Button
              size="sm"
              className="export-Btn ml-2"
              value="No"
              onClick={this.handleNo.bind(this)}>
              <i className="fa fa-times mr-2" />
              <span className="text-white">No</span>
            </Button>
          </div>
        </Modal>

        <Modal
          width="30%"
          style={{ top: 60 }}
          footer={null}
          className="Intervaltimeline inventoryAlertModal"
          visible={this.state.overwriteModalForecast}>
          {sessionStorage.getItem('ForecastOverrideApprover') != 'N' ? (
            <>
              <div className="text-center font-17">
                <p className="font-17">
                  <div>{this.state.requestalertMsg}</div>
                  <div>Do you want to overwrite this?</div>
                </p>
              </div>
              <div className="text-center">
                <Button
                  size="sm"
                  className="export-Btn"
                  value="Yes"
                  onClick={() => this.handleYesforecastOverrideApprover('Yes')}>
                  <i className="fa fa-save mr-2" />
                  <span className="text-white">Yes</span>
                </Button>
                <Button
                  size="sm"
                  className="export-Btn ml-2"
                  value="No"
                  onClick={() => this.handleYesforecastOverrideApprover('No')}>
                  <i className="fa fa-times mr-2" />
                  <span className="text-white">No</span>
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="text-center font-17">
                <p className="font-17">
                  <div>{this.state.requestalertMsg}</div>
                  <div>Do you want to overwrite this?</div>
                </p>
              </div>
              <div className="text-center">
                <Button
                  size="sm"
                  className="export-Btn"
                  value="Yes"
                  onClick={() => this.handleYesforecastOverride('Yes')}>
                  <i className="fa fa-save mr-2" />
                  <span className="text-white">Yes</span>
                </Button>
                <Button
                  size="sm"
                  className="export-Btn ml-2"
                  value="No"
                  onClick={() => this.handleYesforecastOverride('No')}>
                  <i className="fa fa-times mr-2" />
                  <span className="text-white">No</span>
                </Button>
              </div>
            </>
          )}
        </Modal>
        <Modal
          width="65%"
          footer={null}
          title={
            <div>
              <i className="fas fa-edit" /> &nbsp; Edit-LeadTimeMedian
            </div>
          }
          className="leadtime-modal"
          visible={this.state.setModalVissible}
          onCancel={this.setModalClose.bind(this)}>
          <Row className="v4">
            <Form layout="vertical">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item label="Material" name="material_no" className="label-form-text1">
                    <Input value={this.state.MaterialNo} readOnly className="mp-popover-width" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    label="Add New LeadTime"
                    name="new leadtime"
                    className="label-form-text1"
                    required={true}>
                    <Input
                      type="number"
                      // min={0}
                      // max={365}
                      value={this.state.newleadtime}
                      onChange={this.getnewleadtime.bind(this)}
                      className="mp-popover-width"
                    />
                    {/* <InputNumber
                      min={1}
                      max={180}
                      bordered={false}
                      onChange={this.getnewleadtime.bind(this)}
                    /> */}
                    <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                      {this.state.error}
                    </span>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    label="Valid Till Date"
                    name="Valid Till Date"
                    className="label-form-text1 v4"
                    required>
                    <div>
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={this.state.TillDateCount}
                        placeholder="Please Material Number"
                        treeDefaultExpandAll
                        onChange={this.tillDatefunc}
                        className="text-select-form fft">
                        {this.state.leadtimeTreeSelect.map((val1, ind1) => (
                          <TreeNode value={val1} title={val1} key={ind1} />
                        ))}
                      </TreeSelect>
                    </div>

                    <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                      {this.state.error1}
                    </span>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item
                    label="Submitted By(Email ID)"
                    name="submittedbymail"
                    className="label-form-text1 v4">
                    <Input
                      prefix={<i className="fa fa-envelope icons-form" />}
                      value={sessionStorage.getItem('loggedEmailId')}
                      readOnly
                      type="email"
                      id="submittedbymail"
                      className="text-input-form push-pull-email"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                  <Form.Item label="Comment" name="comment" className="label-form-text1">
                    <Input.TextArea
                      // className="label-form-text"
                      prefix={<i className="fa fa-envelope icons-form" />}
                      type="text"
                      placeholder="Enter the Comment"
                      value={this.state.leadtimecmnt}
                      id="comment"
                      maxLength="140"
                      onChange={this.getcomment.bind(this)}
                      className="mp-popover-width  "
                    />
                    <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                      {this.state.error2 || ''}
                    </span>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} lg={8} xl={8}></Col>
              </Row>
              <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ color: '#ffffff' }}
                  className="submit-button left"
                  loading={this.state.LeadtimeLoad}
                  onClick={this.HandleSubmit.bind(this)}
                  // onSubmit={this.HandleSubmit.bind(this)}
                >
                  Submit
                </Button>
              </Form.Item>
            </Form>
          </Row>
        </Modal>
        {/* ################################# */}
        <Modal
          width="90%"
          style={{ top: 60 }}
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" /> Predicted Consumption -{' '}
              {this.state.MaterialNo} &nbsp;
              {this.state.STOCK_TYPE != undefined ? (
                <>{'(' + this.state.STOCK_TYPE + ')'} &nbsp;</>
              ) : (
                ''
              )}
              {this.state.HECI != undefined ? (
                this.state.HECI != '' ? (
                  <>{'(' + this.state.HECI + ')'} &nbsp;</>
                ) : (
                  ''
                )
              ) : (
                ''
              )}
              {this.state.CTL_STOCKOUT_FLAG != 'Y' ? '' : <>CLT Stockout : Yes&nbsp;</>}
              {this.state.LVLT_STOCKOUT_FLAG != 'Y' ? '' : 'LVLT Stockout : Yes'}
              &nbsp;
              <Popover placement="right" content={<span>Click to View replaced material</span>}>
                <span
                  className="replaced_matnr"
                  onClick={() =>
                    this.HandleSplitmatnr(this.state.EOQDDHeaderData[0].replaced_message)
                  }>
                  {this.state.EOQDDHeaderData != ''
                    ? this.state.EOQDDHeaderData[0].replaced_message != null
                      ? this.state.EOQDDHeaderData[0].replaced_message
                      : ''
                    : ''}
                </span>
              </Popover>
            </div>
          }
          className="Intervaltimeline eoq-table-head-content"
          visible={this.state.openModal}
          onCancel={this.props.onClose}>
          {this.state.EOQDDHeaderData.length != 0 ? (
            <div className="modal-header-details">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <span>Avg Consumption(Monthly): </span>
                  <div> {this.state.EOQDDHeaderData[0].AvgConsumptionMonthly}</div>
                </Col>
                <Col span={6}>
                  <span>Predicted Demand(Next month): </span>
                  <div> {this.state.EOQDDHeaderData[0].PredictedDemandMonthly}</div>
                </Col>
                <Col span={6}>
                  <span>Unit Price: </span>
                  <div>{calculation(this.state.EOQDDHeaderData[0].UnitPrice)} </div>
                </Col>
                <Col span={6}>
                  <span>Safety Stock: </span>
                  <div> {this.state.EOQDDHeaderData[0].Safety_Stock}</div>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <span>Quantity to Order: </span>
                  <div className="text-highlight">
                    {this.state.EOQDDHeaderData[0].QuantityToOrder}
                  </div>
                </Col>
                <Col span={6}>
                  <span>Predicted CapEx(WithOut Harvest): </span>
                  <div className="text-highlight">
                    {' '}
                    {calculation(this.state.EOQDDHeaderData[0].PredictedCapex)}
                  </div>
                </Col>
                <Col span={6}>
                  <span>Predicted Reorder Date: </span>
                  <div className="text-highlight">
                    {moment(this.state.EOQDDHeaderData[0].Reorderdate).format('MM-DD-YYYY')}
                  </div>
                </Col>
                <Col span={6}>
                  <span>Predicted CapEx(With Harvest): </span>
                  <div className="text-highlight">
                    {calculation(this.state.EOQDDHeaderData[0].Predicted_CapEx_With_Harvest)}
                  </div>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <span>Open Harvest(QTY): </span>
                  <div>{this.state.EOQDDHeaderData[0].open_harvest_qty}</div>
                </Col>
                <Col span={6}>
                  <span>Current Inventory(Qty): </span>
                  <div> {this.state.EOQDDHeaderData[0].CurrentInventory}</div>
                </Col>
                <Col span={6}>
                  <span>Inventory CapEx: </span>
                  <div> {calculation(this.state.EOQDDHeaderData[0].InventoryCapex)}</div>
                </Col>
                <Col span={6}>
                  <span>Orders in Pipeline: </span>
                  <div> {this.state.EOQDDHeaderData[0].OrdersInPipeline}</div>
                </Col>
              </Row>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={6}>
                  <span>Predicted Reorder Point: </span>
                  <div className="text-highlight">
                    {' '}
                    {this.state.EOQDDHeaderData[0].ReorderPoint}
                  </div>
                </Col>

                <Col span={6}>
                  <span>Lead Time(Median): </span>
                  {this.props.ForecastIsApprover != 'N' ? (
                    <div className="text-highlight">
                      {this.state.EOQDDHeaderData[0].LeadTimeMedian}{' '}
                      <Popover placement="right" content={<span>LeadTime Edit</span>}>
                        <i className="fas fa-edit nk" onClick={this.showmodal.bind(this)} />
                      </Popover>
                    </div>
                  ) : (
                    <div className="text-highlight">
                      {' '}
                      {this.state.EOQDDHeaderData[0].LeadTimeMedian}{' '}
                    </div>
                  )}
                </Col>

                {this.state.EOQDDHeaderData[0].NewLeadTime == null ? (
                  <Col span={6}>
                    <span>Description: </span>
                    <div className="text-highlight" style={{ paddingRight: '12px' }}>
                      {' '}
                      {this.state.EOQDDHeaderData[0].DESCRIPTION}
                    </div>
                  </Col>
                ) : (
                  <Col span={6}>
                    <span>New LeadTime(Median):</span>
                    <div className="text-highlight">
                      {this.state.EOQDDHeaderData[0].NewLeadTime} &nbsp;
                      <span>
                        (Till Date :{' '}
                        {moment(this.state.EOQDDHeaderData[0].TillDate).format('MM-DD-YYYY')})
                      </span>
                    </div>
                  </Col>
                )}

                {this.state.EOQDDHeaderData[0].NewLeadTime != null ? (
                  <Col span={6}>
                    <span>Description:</span>
                    <div className="text-highlight" style={{ paddingRight: '12px' }}>
                      {' '}
                      {this.state.EOQDDHeaderData[0].DESCRIPTION}
                    </div>
                  </Col>
                ) : (
                  <></>
                )}
              </Row>
            </div>
          ) : null}
          <Tabs activeKey={this.state.defaultActiveKey} onChange={this.callback.bind(this)}>
            <TabPane tab="Consumption" key="1">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2">
                <span>
                  <Popover placement="right" content={<span>Forecast Overwrite</span>}>
                    <div className="overridetbl" onClick={this.overridetbl}>
                      <i className="fas fa-th"></i>
                    </div>
                  </Popover>
                </span>

                <Button.Group size="small" className="float-right">
                  <Button size="sm" className="export-Btn ml-2 mr-2 " onClick={this.exportToCSV}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    className={btn_class_Weekly}
                    id="Weekly"
                    type="primary"
                    onClick={this.weeklyChart}>
                    Weekly Trend
                  </Button>
                  <Button
                    className={btn_class_Monthly}
                    id="Montly"
                    type="primary"
                    onClick={this.monthlyChart}>
                    Monthly Trend
                  </Button>
                </Button.Group>
              </Col>

              <Row className="v4">
                {this.state.monthlyView == true ? (
                  <>
                    {!this.props.getPredictedChartMonthLoaderReducer &&
                    this.state.MonthlyChartData.length > 0 &&
                    percentageone > 0 ? (
                      <>
                        <div className="text-center mt-2 chart-legend">
                          <span>
                            <i className="fas fa-circle total-trend" /> - Total Consumption(QTY){' '}
                          </span>
                          <span>
                            <i className="fas fa-circle predict-capex" /> - Predicted Demand(QTY){' '}
                          </span>
                        </div>
                        <ResponsiveContainer height={400} width="100%">
                          <AreaChart
                            width={900}
                            height={400}
                            data={this.state.MonthlyChartData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 20,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="ds"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              <Label
                                value=" Date"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                // position="insideLeft"
                                position="centerBottom"
                              />
                            </XAxis>
                            <YAxis stroke="#fff">
                              {' '}
                              <Label
                                value="Quantity"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                position="insideLeft"
                              />
                            </YAxis>
                            <Tooltip content={this.TooltipFormatterOne} />
                            <defs>
                              <linearGradient id="gradienttwo" x1="0" y1="0" x2="100%" y2="0">
                                <stop offset="0%" stopColor="#1870dc" />
                                <stop offset={`${percentageone}%`} stopColor="#1870dc" />
                                <stop offset={`${percentageone}%`} stopColor="#63ce46" />
                                <stop offset="100%" stopColor="#63ce46" />
                              </linearGradient>
                            </defs>
                            {this.state.MonthlyChartData.length > 26 && (
                              <Brush
                                dataKey="ds"
                                height={30}
                                y={300}
                                stroke="#8884d8"
                                startIndex={this.state.MonthlyChartData.length - 26}
                                endIndex={this.state.MonthlyChartData.length - 1}
                                padding={{ top: 10 }}
                                tick={true}>
                                <AreaChart data={this.state.MonthlyChartData}>
                                  <Area
                                    type="monotone"
                                    dataKey="YValue"
                                    stroke="#63ce46"
                                    fill="#63ce46"
                                    strokeWidth={3}
                                    dot={false}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="NValue"
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
                              dataKey="NValue"
                              stroke="#1870dc"
                              fill="#1870dc"
                              strokeWidth={3}
                              dot={false}
                            />
                            <Area
                              type="monotone"
                              dataKey="YValue"
                              stroke="#63ce46"
                              fill="#63ce46"
                              strokeWidth={3}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <>
                        {this.props.getPredictedChartMonthLoaderReducer ? (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              {' '}
                              <ReusableSysncLoader />{' '}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              <NoDataTextLoader />{' '}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  //Weekly chart
                  <>
                    {!this.props.getPredictedChartLoaderReducer &&
                    this.state.ChartData.length > 0 &&
                    percentage > 0 ? (
                      <>
                        <div className="text-center mt-2 chart-legend">
                          <span>
                            <i className="fas fa-circle total-trend" /> - Total Consumption(QTY){' '}
                          </span>
                          <span>
                            <i className="fas fa-circle predict-capex" /> - Predicted Demand(QTY){' '}
                          </span>
                        </div>
                        <ResponsiveContainer height={400} width="100%">
                          <AreaChart
                            width={900}
                            height={400}
                            data={this.state.ChartData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 20,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="ds"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              <Label
                                value=" Date"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                // position="insideLeft"
                                position="centerBottom"
                              />
                            </XAxis>
                            <YAxis stroke="#fff">
                              {' '}
                              <Label
                                value="Quantity"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                position="insideLeft"
                              />
                            </YAxis>
                            <Tooltip content={this.TooltipFormatter} />
                            <defs>
                              <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="0">
                                <stop offset="0%" stopColor="#1870dc" />
                                {/* <stop offset={50} stopColor="#1870dc" /> */}
                                <stop offset={`${percentage}%`} stopColor="#1870dc" />
                                <stop offset={`${percentage}%`} stopColor="#63ce46" />
                                <stop offset="100%" stopColor="#63ce46" />
                              </linearGradient>
                            </defs>
                            {this.state.ChartData.length > 72 && (
                              <Brush
                                dataKey="ds"
                                height={30}
                                y={300}
                                stroke="#8884d8"
                                startIndex={this.state.ChartData.length - 72}
                                endIndex={this.state.ChartData.length - 1}
                                padding={{ top: 10 }}
                                tick={true}>
                                <AreaChart data={this.state.ChartData}>
                                  <Area
                                    type="monotone"
                                    dataKey="YValue"
                                    stroke="#63ce46"
                                    fill="#63ce46"
                                    strokeWidth={3}
                                    dot={false}
                                  />
                                  <Area
                                    type="monotone"
                                    dataKey="NValue"
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
                              dataKey="YValue"
                              stroke="#63ce46"
                              fill="#63ce46"
                              strokeWidth={3}
                              dot={false}
                            />
                            <Area
                              type="monotone"
                              dataKey="NValue"
                              stroke="#1870dc"
                              fill="#1870dc"
                              strokeWidth={3}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <>
                        {this.props.getPredictedChartLoaderReducer ? (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              <ReusableSysncLoader />{' '}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              {' '}
                              <NoDataTextLoader />
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </Row>
            </TabPane>
            <TabPane tab="Order History" key="2">
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={this.exportToCSV1}>
                <i className="fas fa-file-excel" />
              </Button>

              <Row className="v4">
                {!this.props.getPOMaterialChartReducerLoader &&
                this.state.materialBarData.length > 0 ? (
                  <>
                    <div className="text-center mt-2 chart-legend">
                      <span>
                        <i className="fas fa-circle total-trend" /> - Delivered Quantity{' '}
                      </span>
                      <span>
                        {' '}
                        <i className="fas fa-circle" style={{ color: '#fa9105' }} /> - Open Quantity
                      </span>
                    </div>
                    <ResponsiveContainer height={400} width="100%">
                      <BarChart
                        width={900}
                        height={400}
                        data={this.state.materialBarData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 30,
                          bottom: 10
                        }}>
                        <XAxis
                          dataKey="PO_DATE"
                          angle={-40}
                          tickFormatter={this.formatXAxis}
                          textAnchor="end"
                          height={150}
                          interval={0}
                          stroke="#fff">
                          <Label
                            value="PO Date"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            // position="insideLeft"
                            position="centerBottom"
                          />
                        </XAxis>
                        <YAxis stroke="#fff">
                          {' '}
                          <Label
                            value="Quantity"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideLeft"
                          />
                        </YAxis>
                        <Tooltip content={this.TooltipFormatterThree} />

                        <Bar dataKey="Delivered_Quantity" stackId="a" fill="#1870dc" />
                        <Bar dataKey="Open_Quantity" stackId="a" fill="#fa9105" />
                      </BarChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <>
                    {this.props.getPOMaterialChartReducerLoader ? (
                      <div style={{ height: '400px' }} className="position-relative">
                        <ReusableSysncLoader />{' '}
                      </div>
                    ) : (
                      <div style={{ height: '400px' }} className="position-relative">
                        <NoDataTextLoader />{' '}
                      </div>
                    )}
                  </>
                )}
              </Row>
            </TabPane>
            <TabPane tab="Stock Visualization" key="3">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2">
                <Button.Group size="small" className="float-right">
                  <Button size="sm" className="export-Btn ml-2 mr-2 " onClick={this.exportToCSV2}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    className={btn_class_Weekly_Stock}
                    id="Weekly_Stock"
                    type="primary"
                    onClick={this.weeklyStockChart}>
                    Weekly Trend
                  </Button>
                  <Button
                    className={btn_class_Monthly_Stock}
                    id="Montly_Stock"
                    type="primary"
                    onClick={this.monthlyStockChart}>
                    Monthly Trend
                  </Button>
                </Button.Group>
              </Col>
              <div className="text-center mt-2 chart-legend">
                <span>
                  <i className="fas fa-circle ending-on-hand" /> - Ending on hand(QTY){' '}
                </span>
                <span>
                  <i className="fas fa-circle predicted-consumption" /> - Predicted Consumption(QTY){' '}
                </span>
                <span>
                  <i className="fas fa-circle projected-need" /> - Quantity To Order{' '}
                </span>
              </div>
              <Row className="v4">
                {this.state.monthlyStockView == true ? (
                  <span>
                    {!this.props.getMonthlyStockVisualizationLoaderReducer &&
                    this.state.getMonthlyStockVisualizationData.length > 0 ? (
                      <>
                        {' '}
                        <ResponsiveContainer height={400} width="100%">
                          <ComposedChart
                            width={1000}
                            height={400}
                            data={this.state.getMonthlyStockVisualizationData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="ds"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              {' '}
                              <Label
                                value=" Date"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                // position="insideLeft"
                                position="centerBottom"
                              />
                            </XAxis>
                            <YAxis stroke="#ffffff">
                              <Label
                                value="Quantity"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                position="insideLeft"
                              />
                            </YAxis>
                            <Tooltip content={this.TooltipFormatterWeeklystock} />
                            <ReferenceLine y={0} stroke="#000" />
                            <Bar dataKey="Ending_on_hand" barSize={20} fill="#1870dc">
                              {this.state.getMonthlyStockVisualizationData.map((entry) => {
                                if (entry.Flag == 1) {
                                  return (
                                    <Cell
                                      style={{
                                        'outline-color': 'red',
                                        'outline-style': 'solid'
                                      }}
                                    />
                                  );
                                } else if (entry.Flag == 2) {
                                  return (
                                    <Cell
                                      style={{
                                        'outline-color': 'orange',
                                        'outline-style': 'solid'
                                      }}
                                    />
                                  );
                                } else {
                                  return <Cell />;
                                }
                              })}
                            </Bar>
                            <Bar dataKey="Quantity_To_Order" barSize={20} fill="#63ce46" />
                            <Line
                              type="monotone"
                              dataKey="Predicted_consumption"
                              stroke="#fa9105"
                            />
                            {/* {this.state.getMonthlyStockVisualizationData.length > 20 && <Brush dataKey="ds" tickFormatter={this.formatXAxis} height={20} y={300} />} */}
                          </ComposedChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <>
                        {this.props.getMonthlyStockVisualizationLoaderReducer ? (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              <ReusableSysncLoader />{' '}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              <NoDataTextLoader />
                            </div>
                          </>
                        )}
                      </>
                    )}

                    <ResponsiveContainer height={400} width="100%">
                      <ResponsiveContainer height={400} width="100%">
                        {!this.props.getCapGovMaterialReportLoaderReducer &&
                        this.state.getCapGovMaterialReportData.length > 0 ? (
                          <BarChart
                            width={500}
                            height={300}
                            data={this.state.getCapGovMaterialReportData}
                            margin={{
                              top: 5,
                              right: 30,
                              left: 20,
                              bottom: 5
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
                                value="WareHouse Inbound(Units)"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                dx={-15}
                                position="insideLeft"
                              />
                            </YAxis>
                            <Tooltip content={this.TooltipFormatterStackedBar} />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="ACTUAL_DELIVERIES" stackId="a" fill="#1870dc" />
                            <Bar dataKey="CURRENT_ON_ORDERS" stackId="a" fill="#fa9105" />
                            <Bar dataKey="RECOMMENDED_NEW_ORDER" stackId="a" fill="#63ce46" />
                          </BarChart>
                        ) : (
                          <div>
                            {this.props.getCapGovMaterialReportLoaderReducer ? (
                              <div style={{ height: '400px' }} className="position-relative">
                                <ReusableSysncLoader />{' '}
                              </div>
                            ) : (
                              <div style={{ height: '400px' }} className="position-relative">
                                <NoDataTextLoader />{' '}
                              </div>
                            )}
                          </div>
                        )}
                      </ResponsiveContainer>
                    </ResponsiveContainer>
                  </span>
                ) : (
                  <>
                    {!this.props.getWeeklyStockVisualizationLoaderReducer &&
                    this.state.getWeeklyStockVisualizationData.length > 0 ? (
                      <>
                        {' '}
                        <ResponsiveContainer height={400} width="100%">
                          <ComposedChart
                            width={1000}
                            height={400}
                            data={this.state.getWeeklyStockVisualizationData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="ds"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              {' '}
                              <Label
                                value=" Date"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                // position="insideLeft"
                                position="centerBottom"
                              />
                            </XAxis>
                            <YAxis stroke="#ffffff">
                              <Label
                                value="Quantity"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                position="insideLeft"
                              />
                            </YAxis>
                            <Tooltip content={this.TooltipFormatterWeeklystock} />
                            <ReferenceLine y={0} stroke="#000" />
                            <Bar dataKey="Ending_on_hand" barSize={20} fill="#1870dc">
                              {this.state.getWeeklyStockVisualizationData.map((entry) => {
                                if (entry.Flag == 1) {
                                  return (
                                    <Cell
                                      style={{
                                        'outline-color': 'red',
                                        'outline-style': 'solid'
                                      }}
                                    />
                                  );
                                } else if (entry.Flag == 2) {
                                  return (
                                    <Cell
                                      style={{
                                        'outline-color': 'orange',
                                        'outline-style': 'solid'
                                      }}
                                    />
                                  );
                                } else {
                                  return <Cell />;
                                }
                              })}
                            </Bar>
                            <Bar dataKey="Quantity_To_Order" barSize={20} fill="#63ce46" />
                            <Line
                              type="monotone"
                              dataKey="Predicted_consumption"
                              stroke="#fa9105"
                            />
                            {/* {this.state.getWeeklyStockVisualizationData.length > 20 && <Brush dataKey="ds" tickFormatter={this.formatXAxis} height={20} y={300} />} */}
                          </ComposedChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <>
                        {this.props.getWeeklyStockVisualizationLoaderReducer ? (
                          <>
                            {' '}
                            <div style={{ height: '400px' }} className="position-relative">
                              <ReusableSysncLoader />{' '}
                            </div>
                          </>
                        ) : (
                          <>
                            {' '}
                            <div style={{ height: '400px' }} className="position-relative">
                              <NoDataTextLoader />{' '}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </Row>
            </TabPane>
            <TabPane tab="Historical Forecast" key="4">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2">
                <Button.Group size="small" className="float-right dev">
                  <Button size="sm" className="export-Btn ml-2 mr-2 " onClick={this.exportsnap}>
                    <i className="fas fa-file-excel" />
                  </Button>

                  <Button
                    className={btn_class_Weekly1}
                    id="Weekly"
                    type="primary"
                    onClick={this.weeklySnapshot}>
                    Weekly Trend
                  </Button>
                  <Button
                    className={btn_class_Monthly1}
                    id="Montly"
                    type="primary"
                    onClick={this.monthlySnapshot}>
                    Monthly Trend
                  </Button>
                </Button.Group>

                <DatePicker
                  disabledDate={(d) =>
                    !d ||
                    d.isAfter(
                      this.state.monthlySnapshotView == true
                        ? this.state.maxDateMonthly
                        : this.state.maxDateWeekly
                    ) ||
                    d.isSameOrBefore(
                      moment(
                        new Date(
                          new Date(
                            this.state.monthlySnapshotView == true
                              ? this.state.minDateMonthly
                              : this.state.minDateWeekly
                          ).setDate(
                            new Date(
                              this.state.monthlySnapshotView == true
                                ? this.state.minDateMonthly
                                : this.state.minDateWeekly
                            ).getDate() - 1
                          )
                        )
                      )
                    )
                  }
                  allowClear={false}
                  format="MM-DD-YYYY "
                  onChange={this.getDate}
                  className="calender"
                  value={moment(this.state.starting)}
                />
              </Col>
              <div className="text-center mt-2 chart-legend">
                <span>
                  <i className="fas fa-circle total-trend" /> - Actual Consumption(QTY){' '}
                </span>
                <span>
                  <i className="fas fa-circle" style={{ color: '#ff7300' }} /> - Predicted
                  Demand(Trained){' '}
                </span>
                <span>
                  <i className="fas fa-circle" style={{ color: '#00ff00' }} /> - Predicted
                  Demand(Forecast){' '}
                </span>
              </div>
              {this.state.monthlySnapshotView == true ? (
                <div className="text-center mt-2 chart-legend">
                  {' '}
                  <span>
                    <i className="fas fa-circle" style={{ color: '#CA4E79' }} /> - Overwritten
                    Quantity
                  </span>
                </div>
              ) : (
                ''
              )}

              <Row className="v4">
                {this.state.monthlySnapshotView == true ? (
                  <>
                    {!this.props.getHistoricalForecastMonthlyReducerLoader &&
                    this.state.getHistoricalForecastMonthlyData.length > 0 ? (
                      <>
                        {' '}
                        <ResponsiveContainer height={400} width="100%">
                          <ComposedChart
                            width={900}
                            height={400}
                            data={this.state.getHistoricalForecastMonthlyData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="ds"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              <Label
                                value=" Date"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                // position="insideLeft"
                                position="centerBottom"
                              />
                            </XAxis>
                            <YAxis stroke="#fff">
                              {' '}
                              <Label
                                value="Quantity"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                position="insideLeft"
                              />
                            </YAxis>
                            <Tooltip content={this.TooltipFormatterOne1} />

                            <defs>
                              <linearGradient id="gradien" x1="0" y1="0" x2="100%" y2="0">
                                <stop offset="0%" stopColor="#ff7300" />
                                <stop offset={`${snap_percentageOne}%`} stopColor="#ff7300" />
                                <stop offset={`${snap_percentageOne}%`} stopColor="#00ff00" />
                                <stop offset="100%" stopColor="#00ff00" />
                              </linearGradient>
                            </defs>

                            <Area
                              type="monotone"
                              dataKey="Original_value"
                              stroke="#1870dc"
                              fill="#1870dc"
                            />
                            <Line
                              type="monotone"
                              dataKey="NValue"
                              stroke="#ff7300"
                              // stroke="url(#gradie)"
                              // fill="url(#gradie)"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="Overwritted_Qty"
                              stroke="#CA4E79"
                              // stroke="url(#gradie)"
                              fill="#CA4E79"
                              strokeWidth={4}
                            />

                            <Line
                              type="monotone"
                              dataKey="YValue"
                              stroke="#00ff00"
                              // stroke="url(#gradie)"
                              // fill="url(#gradie)"
                              strokeWidth={2}
                            />

                            {/* <Line
                      type="monotone"
                      dataKey="Value"
                      stroke="url(#gradien)"
                      strokeWidth={2}
                      fill="url(#gradien)"
                      // dot={false}
                    /> */}
                          </ComposedChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <>
                        {this.props.getHistoricalForecastMonthlyReducerLoader ? (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              {' '}
                              <ReusableSysncLoader />{' '}
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              {' '}
                              <NoDataTextLoader />{' '}
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {!this.props.getHistoricalForecastWeeklyReducerLoader &&
                    this.state.getHistoricalForecastWeeklyData.length > 0 ? (
                      <>
                        {' '}
                        <ResponsiveContainer height={400} width="100%">
                          <ComposedChart
                            width={900}
                            height={400}
                            data={this.state.getHistoricalForecastWeeklyData}
                            margin={{
                              top: 10,
                              right: 30,
                              left: 0,
                              bottom: 0
                            }}>
                            <XAxis
                              dataKey="ds"
                              angle={-40}
                              tickFormatter={this.formatXAxis}
                              textAnchor="end"
                              height={150}
                              interval={0}
                              stroke="#fff">
                              <Label
                                value=" Date"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                // position="insideLeft"
                                position="centerBottom"
                              />
                            </XAxis>
                            <YAxis stroke="#fff">
                              <Label
                                value="Quantity"
                                angle="-90"
                                style={{ textAnchor: 'middle', fill: '#fff' }}
                                position="insideLeft"
                              />
                            </YAxis>
                            <Tooltip content={this.TooltipFormatterOne1} />

                            <defs>
                              <linearGradient id="gradie" x1="0" y1="0" x2="100%" y2="0">
                                <stop offset="0%" stopColor="#ff7300" />
                                <stop offset={`${snap_percentage}%`} stopColor="#ff7300" />
                                <stop offset={`${snap_percentage}%`} stopColor="#00ff00" />
                                <stop offset="100%" stopColor="#00ff00" />
                              </linearGradient>
                            </defs>

                            <Area
                              type="monotone"
                              dataKey="Original_value"
                              stroke="#1870dc"
                              fill="#1870dc"
                            />

                            <Line
                              type="monotone"
                              dataKey="NValue"
                              stroke="#ff7300"
                              // stroke="url(#gradie)"
                              // fill="url(#gradie)"
                              strokeWidth={2}
                            />
                            <Line
                              type="monotone"
                              dataKey="YValue"
                              stroke="#00ff00"
                              // stroke="url(#gradie)"
                              // fill="url(#gradie)"
                              strokeWidth={2}
                            />

                            {/* <Line
                          type="monotone"
                          dataKey="Value"
                          // stroke="#ff7300"
                          stroke="url(#gradie)"
                          fill="url(#gradie)"
                          strokeWidth={2}
                        /> */}
                          </ComposedChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <>
                        {this.props.getHistoricalForecastWeeklyReducerLoader ? (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              {' '}
                              <ReusableSysncLoader />
                            </div>
                          </>
                        ) : (
                          <>
                            <div style={{ height: '400px' }} className="position-relative">
                              <NoDataTextLoader />
                            </div>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
              </Row>
            </TabPane>
            <TabPane tab="LeadTime Median" key="5">
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={this.exportToLeadtimeTrend}>
                <i className="fas fa-file-excel" />
              </Button>
              <div className="text-center mt-2 chart-legend sn">
                <span>
                  <i className="fas fa-circle leadtime" /> - LeadTime Median{' '}
                </span>
              </div>
              <Row className="v4">
                {!this.props.getLeadTimeTrendingMaterialEOQLoaderReducer &&
                this.state.getLeadTimeTrendingData.length > 0 ? (
                  <>
                    {' '}
                    <ResponsiveContainer height={400} width="100%">
                      <LineChart
                        width="100%"
                        height={400}
                        data={this.state.getLeadTimeTrendingData}
                        margin={{
                          top: 10,
                          right: 30,
                          left: 10,
                          bottom: 0
                        }}>
                        <XAxis
                          dataKey="PO_DATE"
                          angle={-40}
                          tickFormatter={this.formatXAxisLeadTime}
                          textAnchor="end"
                          height={150}
                          interval={0}
                          stroke="#fff">
                          <Label
                            value="Receipt Date"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            // position="insideLeft"
                            position="centerBottom"
                          />
                        </XAxis>
                        <YAxis stroke="#fff">
                          {' '}
                          <Label
                            value="LeadTime"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideLeft"
                          />
                        </YAxis>
                        <Tooltip content={this.TooltipFormatterLeadTimeTrend} />

                        <Line
                          type="monotone"
                          dataKey="MEDIAN"
                          stroke="#ff7300"
                          strokeWidth={3}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <>
                    {this.props.getLeadTimeTrendingMaterialEOQLoaderReducer ? (
                      <div style={{ height: '400px' }} className="position-relative">
                        <ReusableSysncLoader />
                      </div>
                    ) : (
                      <div style={{ height: '400px' }} className="position-relative">
                        {' '}
                        <NoDataTextLoader />
                      </div>
                    )}
                  </>
                )}
              </Row>
            </TabPane>

            {this.state.EOQDDHeaderData != '' ? (
              this.state.EOQDDHeaderData[0].REPLACED_FLAG == 'Y' ? (
                <TabPane tab="Replaced Material" key="6">
                  {' '}
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="pr-2 pl-2">
                      <Card>
                        <div>
                          <ToolkitProvider
                            keyField="id"
                            data={this.state.getReplacedMaterialDetailsData}
                            columns={this.state.replacedMaterialcolumn}
                            search={{
                              afterSearch: (newResult) => {
                                if (!newResult.length) {
                                  if (this.state.getReplacedMaterialDetailsData != 0) {
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
                                <Row>
                                  <Col xs={12} sm={12} md={12} lg={12} xl={12} />
                                  <Col
                                    xs={12}
                                    sm={12}
                                    md={12}
                                    lg={12}
                                    xl={12}
                                    className="text-right">
                                    <SearchBar {...props.searchProps} />
                                    {this.state.getReplacedMaterialDetailsData != 0 ? (
                                      <Button
                                        size="sm"
                                        className="export-Btn ml-2 mr-2 float-right"
                                        onClick={this.exportToCSVReplacedMtnr}>
                                        <i className="fas fa-file-excel " />{' '}
                                        {/* <span className="text-white">Excel</span> */}
                                      </Button>
                                    ) : (
                                      <Button
                                        size="sm"
                                        disabled
                                        className="export-Btn ml-2 mr-2 float-right"
                                        onClick={this.exportToCSVReplacedMtnr}>
                                        <i className="fas fa-file-excel " />{' '}
                                        {/* <span className="text-white">Excel</span> */}
                                      </Button>
                                    )}
                                  </Col>
                                </Row>
                                <ReactDragListView.DragColumn
                                  onDragEnd={this.onDragEnd.bind(this)}
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
                        </div>
                      </Card>
                    </Col>
                  </Row>
                </TabPane>
              ) : (
                ''
              )
            ) : (
              ''
            )}
          </Tabs>
        </Modal>
        {/* //demo table for Overwrite */}
        <Modal
          width="85%"
          style={{ top: 60 }}
          okText={'Submit'}
          title={
            <Row>
              <Col span={12}>
                {' '}
                <div className="clear">
                  <i className="fas fa-pen"></i>
                  Forecast Overwrite -{this.state.MaterialNo}( LGORT - {this.state.lgort})
                  <p style={{ float: 'right', paddingRight: '30px' }}></p>
                </div>
              </Col>
              <Col span={12}>
                {' '}
                {sessionStorage.getItem('ForecastOverrideApprover') != 'N' ? (
                  <div className="float-right mr-5">
                    <Switch
                      className="supplyPosSwitch"
                      checkedChildren="Forecast Overwrite Table"
                      unCheckedChildren="Approver Review"
                      // defaultChecked
                      checked={this.state.OverriteTable}
                      onChange={this.getcheckValues}
                    />
                  </div>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          }
          footer={null}
          className="Intervaltimeline"
          visible={this.state.overridetblmodal}
          onCancel={this.overridetbl}
          onOk={this.SubmitApi.bind(this)}>
          {this.state.OverriteTable ? (
            <div className="OverWriteTable">
              <ReactDragListView.DragColumn
                onDragEnd={this.onDragEndOverWriteTable.bind(this)}
                nodeSelector="th">
                <BootstrapTable
                  ref={this.bstable}
                  keyField="ds"
                  data={this.state.getForcastOverwriteDetailsData}
                  columns={this.state.tempcol}
                  selectRow={selectRow}
                  cellEdit={cellEditFactory({
                    mode: 'click',
                    blurToSave: true,
                    autoSelectText: true,
                    onStartEdit: (row, column, rowIndex, columnIndex) => {
                      document.getElementsByTagName('tr').className += 'selection-row';

                      this.setState({
                        NewOverWriteQty: row.OVERWRITE_QTY != '' ? row.OVERWRITE_QTY : '',
                        OverWriteComment: row.COMMENTS != '' ? row.COMMENTS : '',
                        ReasonCodeVal: row.REASON_CODE != '' ? row.REASON_CODE : '',
                        colInd: columnIndex,
                        rowInd: rowIndex
                      });
                    },

                    beforeSaveCell: this.beforeSaveCell.bind(this)
                  })}
                />
                <Row>
                  <Col span={24} className="mb-2 mt-2">
                    <div className="float-right">
                      <button className="cancel_ovr" key="back" onClick={this.overridetbl}>
                        Cancel
                      </button>
                      {sessionStorage.getItem('ForecastOverrideApprover') != 'N' ? (
                        <>
                          {' '}
                          {this.state.PostArray != 0 ? (
                            <button
                              id="submitt"
                              className="submit_ovr"
                              key="submit"
                              type="primary"
                              onClick={this.SubmitApi.bind(this)}>
                              Submit
                            </button>
                          ) : (
                            <button
                              disabled
                              className="submit_ovr"
                              key="submit"
                              type="primary"
                              onClick={this.SubmitApi.bind(this)}>
                              Submit
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          {this.state.PostArray != 0 ? (
                            <button
                              id="submitt"
                              className="submit_ovr"
                              key="submit"
                              type="primary"
                              onClick={this.UpdateForecastData}>
                              Update
                            </button>
                          ) : (
                            <button
                              disabled
                              className="submit_ovrDisabled"
                              key="submit"
                              type="primary">
                              Update
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  </Col>
                </Row>
              </ReactDragListView.DragColumn>
            </div>
          ) : (
            <div>
              <ToolkitProvider
                ref={this.bstable}
                keyField="ID"
                data={this.state.getForecastOverrideApproverReviewData}
                columns={this.state.ForecastOverrideApproverReviewCol}
                search={{
                  afterSearch: (newResult) => {
                    if (!newResult.length) {
                      if (this.state.getForecastOverrideApproverReviewData != '') {
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
                      <Col xs={12} sm={12} md={12} lg={12} xl={12} />
                      <Col
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className="text-right float-right">
                        <Button
                          size="sm"
                          className="export-Btn ml-2 mr-2 float-right mb-2"
                          onClick={this.exportToCSVPushPullApproverReview}>
                          <i className="fas fa-file-excel" />
                        </Button>
                        <SearchBar {...props.searchProps} />
                      </Col>
                    </Row>

                    <BootstrapTable
                      {...props.baseProps}
                      selectRow={selectRowForecastApproverReview}
                      pagination={paginationFactory()}
                      noDataIndication={() => this.tblLoader()}
                    />
                  </div>
                )}
              </ToolkitProvider>
              <Row>
                <Col span={24} className="mb-2 mt-2">
                  {' '}
                  <div className="float-right">
                    <button
                      className="cancel_ovr"
                      key="back"
                      onClick={this.ResetSelectedState.bind(this)}>
                      Cancel
                    </button>
                    {this.state.ApproverReviewArray != '' ? (
                      <button
                        id="submitt"
                        key="submit"
                        type="primary"
                        className="ApprovedBtn text-white-upload"
                        onClick={this.UpdateValidation}>
                        Update
                      </button>
                    ) : (
                      <button
                        id="submitt"
                        key="submit"
                        type="primary"
                        disabled
                        className="ApprovedBtn text-white-upload">
                        Update
                      </button>
                    )}
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </Modal>
        <Modal
          width="60%"
          style={{ top: 50 }}
          footer={null}
          className=""
          title={
            <div>
              {' '}
              <i className="fas fa-pen"></i>
              Forecast Overwrite -{this.state.MaterialNo}( LGORT - {this.state.lgort})
            </div>
          }
          visible={this.state.UpdatePopup}
          onCancel={this.UpdateForecastData}>
          <div className="text-center font-17">
            <Form className="upload_form_css" layout="vertical">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col xs={24} sm={24} md={10} lg={10} xl={10}>
                  {sessionStorage.getItem('ForecastOverrideApprover') != 'N' ? (
                    <>
                      <Form.Item
                        label="Approver Name"
                        name="Approver Name"
                        className="label-form-text1">
                        <Input
                          prefix={<i className="fa fa-user icons-form " />}
                          type="text"
                          readOnly
                          id="supplier"
                          defaultValue={sessionStorage.getItem('Username')}
                          className="text-input-form"
                        />
                      </Form.Item>
                    </>
                  ) : (
                    <>
                      <Form.Item label="Approver" name="Approver" className="label-form-text1">
                        <TreeSelect
                          showSearch
                          style={{ width: '100%' }}
                          value={this.state.ForecastApprover}
                          placeholder="Please Choose Approver"
                          allowClear
                          treeDefaultExpandAll
                          onChange={this.handleApproverChange}
                          className="text-select-form fft ">
                          {this.state.getForecastOverrideApproverListData.map((val1, ind1) => (
                            <TreeNode value={val1.FULLNAME} title={val1.FULLNAME} key={ind1} />
                          ))}
                        </TreeSelect>
                      </Form.Item>
                      {/* <span className="upload_error">{error["ApproverName"]}</span> */}
                    </>
                  )}
                </Col>
                <Col xs={24} sm={24} md={14} lg={14} xl={14}>
                  <Form.Item label="Submitted By" name="Submitted By" className="label-form-text1">
                    <Input
                      readOnly
                      prefix={<i className="fa fa-envelope icons-form1"></i>}
                      type="text"
                      id="supplier"
                      defaultValue={sessionStorage.getItem('loggedEmailId')}
                      className="text-input-form"
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={24} className="text-center">
                  {' '}
                  {this.state.ForecastApprover != '' ? (
                    <Space>
                      <Button
                        type="primary"
                        htmlType="submit"
                        onClick={this.ForecastOverrideNonApprover}>
                        Submit
                      </Button>
                    </Space>
                  ) : (
                    <Space>
                      <button
                        className="submit_ovrDisabled"
                        key="submit"
                        type="primary"
                        disabled
                        // onClick={HandleFormSubmit}
                      >
                        Submit
                      </button>
                    </Space>
                  )}
                </Col>
              </Row>
              <Form.Item wrapperCol={{ offset: 10, span: 12 }}></Form.Item>
            </Form>
          </div>
        </Modal>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Approval Confirmation </div>}
          className="Intervaltimeline"
          visible={this.state.UpdatePopUpApproverReview}
          onCancel={this.UpdateValidation}
          // width={150}
        >
          <div>
            <Row>
              <Col span={4}></Col>
              <Col span={16}>
                {' '}
                <Form>
                  <Form.Item label=" Comment" name="Comment1" className="label-form-text1 clss">
                    <TextareaAutosize
                      id="comment"
                      className="text-input-form cmnt-top ftsize"
                      minRows={1}
                      maxRows={6}
                      prefix={<i className="far fa-comments"></i>}
                      value={this.state.getApproverReviewForForecastOverride}
                      onChange={this.getApproverCommentForecastOverride.bind(this)}
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={4}></Col>
            </Row>
            <Row>
              <Col span={24}>
                {this.state.getApproverReviewForForecastOverride != '' ? (
                  <button
                    id="submitt"
                    key="submit"
                    type="primary"
                    className="ApprovedBtn mr-2 float-right"
                    onClick={() =>
                      this.PostForcastOverwriteUpdate(
                        this.state.ApproverReviewArray,
                        '2',
                        this.state.getApproverReviewForForecastOverride
                      )
                    }>
                    Approve
                  </button>
                ) : (
                  <button
                    id="submitt"
                    key="submit"
                    type="primary"
                    className="ApprovedBtn  mr-2 float-right"
                    disabled>
                    Approve
                  </button>
                )}

                {this.state.getApproverReviewForForecastOverride != '' ? (
                  <button
                    id="submitt"
                    key="submit"
                    className="cancel_ovr float-right"
                    type="primary"
                    onClick={() =>
                      this.PostForcastOverwriteUpdate(
                        this.state.ApproverReviewArray,
                        '3',
                        this.state.getApproverReviewForForecastOverride
                      )
                    }>
                    Reject
                  </button>
                ) : (
                  <button
                    id="submitt"
                    key="submit"
                    className="cancel_ovr float-right"
                    type="primary"
                    disabled>
                    Reject
                  </button>
                )}
              </Col>
            </Row>
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  return {
    getHistoricalForecastMonthlyData: state.getHistoricalForecastMonthly,
    EOQDDHeaderData: state.getEOQHeaderDD,
    predictedChartData: state.getPredictedChart,
    poMaterialChartData: state.getPOMaterialChart,
    predictedChartMonthData: state.getPredictedChartMonth,
    getWeeklyStockVisualizationData: state.getWeeklyStockVisualization,
    getMonthlyStockVisualizationData: state.getMonthlyStockVisualization,
    getHistoricalForecastWeeklyData: state.getHistoricalForecastWeekly,
    getHistoricalSnapshotForecastMinMaxDateData: state.getHistoricalSnapshotForecastMinMaxDate,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    getLeadTimeTrendingData: state.getLeadTimeTrending,
    getLeadTimeTrendingMaterialEOQData: state.getLeadTimeTrendingMaterialEOQ,
    getReplacedMaterialDetailsData: state.getReplacedMaterialDetails,
    getForcastOverwriteDetailsData: state.getForcastOverwriteDetails,
    getReasonCodeListData: state.getReasonCodeList,
    getCapGovMaterialReportData: state.getCapGovMaterialReport,
    getForecastOverrideApproverListData: state.getForecastOverrideApproverList,
    getForecastOverrideApproverReviewData: state.getForecastOverrideApproverReview,
    getPredictedChartMonthLoaderReducer: state.getPredictedChartMonthLoaderReducer,
    getPredictedChartLoaderReducer: state.getPredictedChartLoaderReducer,
    getPOMaterialChartReducerLoader: state.getPOMaterialChartReducerLoader,
    getCapGovMaterialReportLoaderReducer: state.getCapGovMaterialReportLoaderReducer,
    getMonthlyStockVisualizationLoaderReducer: state.getMonthlyStockVisualizationLoaderReducer,
    getWeeklyStockVisualizationLoaderReducer: state.getWeeklyStockVisualizationLoaderReducer,
    getHistoricalForecastMonthlyReducerLoader: state.getHistoricalForecastMonthlyReducerLoader,
    getHistoricalForecastWeeklyReducerLoader: state.getHistoricalForecastWeeklyReducerLoader,
    getLeadTimeTrendingMaterialEOQLoaderReducer: state.getLeadTimeTrendingMaterialEOQLoaderReducer
  };
}

export default connect(mapState, {
  getReasonCodeList,
  getForcastOverwriteDetails,
  getReplacedMaterialDetails,
  getLeadTimeTrending,
  getLeadTimeTrendingMaterialEOQ,
  getUserImpersonationDetails,
  getHistoricalForecastMonthly,

  getHistoricalSnapshotForecastMinMaxDate,
  getHistoricalForecastWeekly,
  getEOQHeaderDD,
  getPredictedChart,
  getPOMaterialChart,
  getPredictedChartMonth,
  getWeeklyStockVisualization,
  getMonthlyStockVisualization,
  getCapGovMaterialReport,
  getForecastOverrideApproverList,
  getForecastOverrideApproverReview
})(EOQDrillDown);
