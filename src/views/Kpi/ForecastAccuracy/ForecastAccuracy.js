import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ColorPicker from 'rc-color-picker';

import {
  getForcastAccuracyDemand,
  getForcastAccuracyMaterial,
  getForcastAccuracyManufacturer,
  getForcastAccuracyOrganization,
  getForcastAccuracyMaterialMonthwise,
  getForcastAccuracyManufMonthwise,
  getForcastAccuracyOrgMonthwise,
  getForcastAccuracyMonthwise,
  getForcastAccuracyMinMaxDate,
  getForcastAccuracyQuarterly,
  getForcastAccuracyQuarterlyTrend,
  getForcastAccuracyMaterialQuarterly,
  getForcastAccuracyManufacturerQuarterly,
  getForcastAccuracyOrganizationQuarterly,
  getForcastAccuracyMaterialQuarterlyTrend,
  getForcastAccuracyManufQuarterlyTrend,
  getForcastAccuracyOrgQuarterlyTrend,
  getUserImpersonationDetails,
  getKPIForecastAccuracyAnalysis,
  getKPIForecastAccuracyAnalysisPieChart
} from '../../../actions';

import {
  Row,
  Col,
  Card,
  Button,
  Modal,
  Tabs,
  Popover,
  DatePicker,
  Select,
  Radio,
  Space
} from 'antd';
import ReactCardFlip from 'react-card-flip';
import Odometer from 'react-odometerjs';
// import { App } from "./../DashBoard/ClipSpinner";

import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  Label,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell
} from 'recharts';

//bootstrap table import methods
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { DynamicChart } from '../../../components/CustomComponents/DynamicChart';
import { calculation } from '../../Calculation';
import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';
import ReactDragListView from 'react-drag-listview';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#DC143C', '#008000'];

const { SearchBar } = Search;
const { TabPane } = Tabs;
const { Option } = Select;
const { RangePicker } = DatePicker;

class ForecastAccuracy extends Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.Imploader = this.Imploader.bind(this);
    this.handleFlippedALLFAO = this.handleFlippedALLFAO.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.onclickFADDrillDown = this.onclickFADDrillDown.bind(this);
    this.TooltipFormatFADMonthlyWise = this.TooltipFormatFADMonthlyWise.bind(this);
    this.TooltipFormatAllFADMonthlyWise = this.TooltipFormatAllFADMonthlyWise.bind(this);
    this.exportToCSVRadialAO = this.exportToCSVRadialAO.bind(this);
    this.exportToCSVAllFAD = this.exportToCSVAllFAD.bind(this);
    this.exportToCSVAllFADMATNRACTION = this.exportToCSVAllFADMATNRACTION.bind(this);
    this.exportToCSVAllFADMANUFACTION = this.exportToCSVAllFADMANUFACTION.bind(this);

    this.exportToCSVRadialAOOrg = this.exportToCSVRadialAOOrg.bind(this);

    this.exportToCSVRadialAOManuf = this.exportToCSVRadialAOManuf.bind(this);
    this.exportToCSVRadialAOMatnr = this.exportToCSVRadialAOMatnr.bind(this);

    this.OverAllTOImg = React.createRef();
    this.OverAllFAD = React.createRef();
    this.OverAllFADMATNRACTION = React.createRef();
    this.OverAllFADORGACTION = React.createRef();
    this.OverAllFADMANUFACTION = React.createRef();
    this.OAO = React.createRef();

    this.OAMF = React.createRef();
    this.OAM = React.createRef();

    this.FADOnclickManufModal = this.FADOnclickManufModal.bind(this);
    this.FADOnclickMatnrModal = this.FADOnclickMatnrModal.bind(this);
    this.handleModalFADClose = this.handleModalFADClose.bind(this);
    this.handleModalFAD = this.handleModalFAD.bind(this);
    this.turnoverChartOnclick = this.turnoverChartOnclick.bind(this);
    this.onclickALLFADMatnr = this.onclickALLFADMatnr.bind(this);

    this.materialDescription = this.materialDescription.bind(this);

    this.costformat = this.costformat.bind(this);
    this.costformatwithDollar = this.costformatwithDollar.bind(this);
    this.costformatWithout_percentage = this.costformatWithout_percentage.bind(this);

    this.HandleAllFADModal = this.HandleAllFADModal.bind(this);

    this.handleModalAllFADKeyChange = this.handleModalAllFADKeyChange.bind(this);

    this.tblLoader = this.tblLoader.bind(this);

    this.exportToCSVALLFADORG = this.exportToCSVALLFADORG.bind(this);
    this.exportToCSVALLFADMANUF = this.exportToCSVALLFADMANUF.bind(this);
    this.exportToCSVALLFADMATNR = this.exportToCSVALLFADMATNR.bind(this);

    this.handleModalKeyChangeFAD = this.handleModalKeyChangeFAD.bind(this);

    this.infoFad = this.infoFad.bind(this);
    this.exportToExcelFAMU = this.exportToExcelFAMU.bind(this);
    this.exportToExcelFAO = this.exportToExcelFAO.bind(this);
    this.exportToExcelFAM = this.exportToExcelFAM.bind(this);

    this.toggle = this.toggle.bind(this);
    this.toggleHide = this.toggleHide.bind(this);

    this.state = {
      chartChangeDD: 'LINE',
      color: '#82ca9d',
      seriesAllFAD: '',
      getForcastAccuracyQuarterlyTrendData: '',
      org: '',
      AllFAOFLIPPED: false,
      count: 0,
      toggleHide: true,
      getForcastAccuracyMinMaxDateData: [],
      getKPIForecastAccuracyAnalysisData: [],
      RadioButtonValue: true,
      FADDATE1: '',
      FADDATE2: '',
      togCal: true,

      getForcastAccuracyManufacturerQuarterlyData: [],
      getForcastAccuracyOrganizationQuarterlyData: [],
      flipped: false,
      ModalTo: false,
      ModalBo: false,
      ModalFad: false,

      getForcastAccuracyMonthwiseData: [],
      getKPIForecastAccuracyAnalysisPieChartData: [],

      getForcastAccuracyOrgMonthwiseData: [],
      getForcastAccuracyManufMonthwiseData: [],
      getForcastAccuracyMaterialMonthwiseData: [],

      getForcastAccuracyOrganizationData: [],
      getForcastAccuracyManufacturerData: [],

      getForcastAccuracyMaterialData: [],
      TurnoverDrillDownModal: false,
      ToMatnrAll: false,

      FADDrillDownModal: false,
      ALLFADDrillDownModal: false,
      ALLFADMATNRACTION: false,
      ALLFADMANUFACTION: false,
      chartModal: false,
      chartModal1: false,

      backorderModal: false,
      activeKey: '1',
      AllDefaultActiveKey: '1',
      openmodal: false,

      getForcastAccuracyDemandData: [],

      // FADAll

      ALLFADMATNRCOL: [
        {
          text: 'Action',
          dataField: '',
          headerStyle: { width: 55 },
          formatter: (cell, row) => (
            <div className="text-center">
              <Button
                size="small"
                type="primary"
                className="mr-1 modal-action-icon"
                id={row.MATNR}
                onClick={() => this.onclickALLFADMatnr(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'MATNR',
          text: 'Material',
          sort: true,
          headerStyle: { width: 85 },
          formatter: this.materialDescription,
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 85 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'Actual',
          text: 'Actual ',
          sort: true,
          headerStyle: { width: 80 },

          align: 'right',
          headerAlign: 'right'
        },

        {
          dataField: 'Forcast',
          text: 'Forecast  ',
          sort: true,
          headerStyle: { width: 100 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Forcast_Accuracy',
          text: 'Forecast  Accuracy',
          sort: true,
          headerStyle: { width: 145 },
          //align: "right",
          align: 'right',
          headerAlign: 'right',
          formatter: this.costformat
        },

        {
          dataField: 'MANUF_NAME',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 120 },
          //align: "right",
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'organization',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 120 },

          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 145 },
          //align: "right",
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'TOTAL_CAPEX',
          text: 'Total Capex',
          sort: true,
          headerStyle: { width: 110 },
          //align: "right",
          align: 'right',
          headerAlign: 'right',
          formatter: calculation
        }
      ],

      ALLFADMANUFCOL: [
        {
          text: 'Action',
          dataField: '',
          headerStyle: { width: 55 },
          formatter: (cell, row) => (
            <div className="text-center">
              <Button
                size="small"
                type="primary"
                className="mr-1 modal-action-icon"
                id={row.MATNR}
                onClick={() => this.onclickALLFADManuf(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'MANUF_NAME',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 120 },

          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 100 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Actual',
          text: 'Actual ',
          sort: true,
          headerStyle: { width: 80 },

          align: 'right',
          headerAlign: 'right'
        },

        {
          dataField: 'Forcast',
          text: 'Forecast  ',
          sort: true,
          headerStyle: { width: 100 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Forcast_Accuracy',
          text: 'Forecast  Accuracy',
          sort: true,
          headerStyle: { width: 140 },
          //align: "right",
          align: 'right',
          headerAlign: 'right',
          formatter: this.costformat
        },

        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 140 },
          //align: "right",
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'TotalCapEx',
          text: 'Total Capex',
          sort: true,
          headerStyle: { width: 105 },
          //align: "right",
          align: 'right',
          headerAlign: 'right',
          formatter: calculation
        }
      ],

      ALLFADORGCOL: [
        {
          text: 'Action',
          dataField: '',
          headerStyle: { width: 40 },
          formatter: (cell, row) => (
            <div className="text-center">
              <Button
                size="small"
                type="primary"
                className="mr-1 modal-action-icon"
                id={row.MATNR}
                onClick={() => this.onclickALLFADORG(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'ORGANIZATION',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 100 },

          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 60 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Actual',
          text: 'Actual ',
          sort: true,
          headerStyle: { width: 60 },

          align: 'right',
          headerAlign: 'right'
        },

        {
          dataField: 'Forcast',
          text: 'Forecast  ',
          sort: true,
          headerStyle: { width: 80 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Forcast_Accuracy',
          text: 'Forecast  Accuracy',
          sort: true,
          headerStyle: { width: 105 },
          //align: "right",
          align: 'right',
          headerAlign: 'right',
          formatter: this.costformat
        },
        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 100 },
          //align: "right",
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'TotalCapEx',
          text: 'Total Capex',
          sort: true,
          headerStyle: { width: 90 },
          //align: "right",
          align: 'right',
          headerAlign: 'right',
          formatter: calculation
        }
      ],

      FADRateColumn: [
        //chart view datafield
        {
          text: 'Action',
          dataField: '',
          headerStyle: { width: 50 },
          formatter: (cell, row) => (
            <div className="text-center">
              <Button
                size="small"
                type="primary"
                className="mr-1 modal-action-icon"
                id={row.MATNR}
                onClick={() => this.FADOnclickMatnrModal(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },

        {
          dataField: 'MATNR',
          text: 'Material',
          sort: true,
          headerStyle: { width: 80 },
          formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 70 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Actual',
          text: 'Actual',
          sort: true,
          headerStyle: { width: 70 },
          align: 'right',
          headerAlign: 'right'

          // formatter: this.costformatWithout_percentage,
        },

        {
          dataField: 'Forcast',
          text: 'Forecast ',
          sort: true,
          headerStyle: { width: 85 },
          align: 'right',
          headerAlign: 'right'
          //align: "right",
        },
        {
          dataField: 'Forcast_Accuracy',
          text: 'Forecast Accuracy',
          sort: true,
          headerStyle: { width: 145 },
          align: 'right',
          headerAlign: 'right',
          //align: "right",
          formatter: this.costformat
        },

        {
          dataField: 'MANUF_NAME',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 115 },
          align: 'left',
          headerAlign: 'left'
          //align: "right",
        },
        {
          dataField: 'organization',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 110 },
          align: 'left',
          headerAlign: 'left'
          //align: "right",
        },
        //end
        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 135 }
          //align: "right",
        },
        {
          dataField: 'TOTAL_CAPEX',
          text: 'Total CapEx',
          sort: true,
          headerStyle: { width: 105 },
          align: 'right',
          headerAlign: 'right',
          //align: "right",
          formatter: calculation
        }
      ],

      FADManufactureColumn: [
        {
          text: 'Action',
          dataField: '',
          headerStyle: { width: 40 },
          formatter: (cell, row) => (
            <div className="text-center">
              <Button
                size="small"
                type="primary"
                className="mr-1 modal-action-icon"
                id={row.MATNR}
                onClick={() => this.FADOnclickManufModal(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'MANUF_NAME',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 100 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 60 },
          align: 'left',
          headerAlign: 'left'
          // formatter: this.materialDescription,
        },
        {
          dataField: 'Actual',
          text: 'Actual ',
          sort: true,
          headerStyle: { width: 45 },
          align: 'right',
          headerAlign: 'right'
          //align: "right",
        },

        {
          dataField: 'Forcast',
          text: 'Forecast ',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 51 }
          //align: "right",
        },
        {
          dataField: 'Forcast_Accuracy',
          text: 'Forecast Accuracy ',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 84 },
          //align: "right",
          formatter: this.costformat
        },

        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory ',
          sort: true,
          headerStyle: { width: 80 },
          align: 'right',
          headerAlign: 'right'
          //align: "right",
        },
        {
          dataField: 'TotalCapEx',
          text: 'TotalCapEx ',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 70 },
          //align: "right",
          formatter: calculation
        }
      ],

      //data

      //backorder flip all
      BOAllManuf: [
        {
          text: 'Action',
          dataField: '',
          headerStyle: { width: 40 },
          formatter: (cell, row) => (
            <div className="text-center">
              <Button
                size="small"
                type="primary"
                className="mr-1 modal-action-icon"
                id={row.Manuf_Name}
                onClick={() => this.onclickBoAll(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'MANUF_NAME',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'BACK_ORDER_RATE',
          text: 'BackOrder Rate',
          sort: true,
          headerStyle: { width: 55 },
          // formatter: this.costformatWithout_percentage,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Total_PurchaseOrders',
          text: 'Total Po',
          sort: true,
          headerStyle: { width: 80 },
          // formatter: this.costformatWithout_percentage,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Total_BackOrders',
          text: 'Total BackOrders',
          sort: true,
          headerStyle: { width: 80 },
          align: 'right',
          headerAlign: 'right'
          // formatter: calculation,
        }
      ],

      BOAllOrg: [
        {
          text: 'Action',
          dataField: '',
          headerStyle: { width: 40 },
          formatter: (cell, row) => (
            <div className="text-center">
              <Button
                size="small"
                type="primary"
                className="mr-1 modal-action-icon"
                id={row.Manuf_Name}
                onClick={() => this.onclickBoOrgAll(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'ORGANIZATION',
          text: 'Organization',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 80 }
        },
        {
          dataField: 'BACK_ORDER_RATE',
          text: 'BackOrder Rate',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 45 }
        },
        {
          dataField: 'Total_PurchaseOrders',
          text: 'Total Po',
          sort: true,
          headerStyle: { width: 77 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Total_BackOrders',
          text: 'Total BackOrders',
          sort: true,
          headerStyle: { width: 70 },
          align: 'right',
          headerAlign: 'right'
        }
      ],

      //end

      FADRateOrgColumn: [
        {
          text: 'Action',
          dataField: '',
          headerStyle: { width: 52 },
          formatter: (cell, row) => (
            <div className="text-center">
              <Button
                size="small"
                type="primary"
                className="mr-1 modal-action-icon"
                id={row.Manuf_Name}
                onClick={() => this.FADOnclickOrgfModal(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },

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
          headerStyle: { width: 60 },
          // formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Actual',
          text: 'Actual ',
          sort: true,
          headerStyle: { width: 60 },
          //align: "right",
          // formatter: this.costformatWithout_percentage,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Forcast',
          text: 'Forecast ',
          sort: true,
          headerStyle: { width: 70 },
          //align: "right",
          // formatter: this.costformatWithout_percentage,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Forcast_Accuracy',
          text: 'Forecast Accuracy ',
          sort: true,
          headerStyle: { width: 110 },
          //align: "right",
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },

        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory ',
          sort: true,
          headerStyle: { width: 111 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'TotalCapEx',
          text: 'TotalCapEx ',
          sort: true,
          headerStyle: { width: 100 },
          //align: "right",
          formatter: calculation,
          align: 'right',
          headerAlign: 'right'
        }
      ],

      series: [],
      series1: [],
      series2: [],
      overallBo: [],
      OverAllMtnrTo: []
    };
  }
  componentDidMount() {
    // //FAD
    // this.props.getForcastAccuracyDemand("all", "all");
    // this.props.getForcastAccuracyMonthwise("all", "all");
    // this.props.getForcastAccuracyMaterial("all", "all");

    this.setState({
      FADDATE1: moment().subtract(6, 'months').format('MM-DD-YYYY'),
      FADDATE2: moment().format('MM-DD-YYYY')
    });
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getKPIForecastAccuracyAnalysisPieChartData !=
      nextProps.getKPIForecastAccuracyAnalysisPieChartData
    ) {
      if (nextProps.getKPIForecastAccuracyAnalysisPieChartData != '') {
        this.setState({
          getKPIForecastAccuracyAnalysisPieChartData:
            nextProps.getKPIForecastAccuracyAnalysisPieChartData
        });
      } else {
        this.setState({
          getKPIForecastAccuracyAnalysisPieChartData: []
        });
      }
    }
    if (
      this.props.getKPIForecastAccuracyAnalysisData != nextProps.getKPIForecastAccuracyAnalysisData
    ) {
      if (nextProps.getKPIForecastAccuracyAnalysisData != '') {
        this.setState({
          getKPIForecastAccuracyAnalysisData: nextProps.getKPIForecastAccuracyAnalysisData
        });
      } else {
        this.setState({
          getKPIForecastAccuracyAnalysisData: []
        });
      }
    }
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.Imploader();
        this.setState({
          getUserImpersonationDetailsData: nextProps.getUserImpersonationDetailsData
        });
      } else {
        this.setState({
          getUserImpersonationDetailsData: []
        });
      }
    }
    if (
      this.props.getForcastAccuracyOrgQuarterlyTrendData !=
      nextProps.getForcastAccuracyOrgQuarterlyTrendData
    ) {
      if (nextProps.getForcastAccuracyOrgQuarterlyTrendData != 0) {
        this.setState({
          getForcastAccuracyOrgQuarterlyTrendData:
            nextProps.getForcastAccuracyOrgQuarterlyTrendData,
          loader: false
        });
      } else {
        this.setState({
          getForcastAccuracyOrgQuarterlyTrendData: [],
          loader: true
        });
      }
    }

    if (
      this.props.getForcastAccuracyManufQuarterlyTrendData !=
      nextProps.getForcastAccuracyManufQuarterlyTrendData
    ) {
      if (nextProps.getForcastAccuracyManufQuarterlyTrendData != 0) {
        this.setState({
          getForcastAccuracyManufQuarterlyTrendData:
            nextProps.getForcastAccuracyManufQuarterlyTrendData,
          loader: false
        });
      } else {
        this.setState({
          getForcastAccuracyManufQuarterlyTrendData: [],
          loader: true
        });
      }
    }
    if (
      this.props.getForcastAccuracyMaterialQuarterlyTrendData !=
      nextProps.getForcastAccuracyMaterialQuarterlyTrendData
    ) {
      if (nextProps.getForcastAccuracyMaterialQuarterlyTrendData != 0) {
        this.setState({
          getForcastAccuracyMaterialQuarterlyTrendData:
            nextProps.getForcastAccuracyMaterialQuarterlyTrendData,
          loader: false
        });
      } else {
        this.setState({
          getForcastAccuracyMaterialQuarterlyTrendData: [],
          loader: true
        });
      }
    }
    if (
      this.props.getForcastAccuracyOrganizationQuarterlyData !=
      nextProps.getForcastAccuracyOrganizationQuarterlyData
    ) {
      if (nextProps.getForcastAccuracyOrganizationQuarterlyData != 0) {
        this.setState({
          getForcastAccuracyOrganizationQuarterlyData:
            nextProps.getForcastAccuracyOrganizationQuarterlyData,
          isDataFetched: true
        });
      } else {
        this.setState({
          getForcastAccuracyOrganizationQuarterlyData: [],
          isDataFetched: false
        });
      }
    }

    if (
      this.props.getForcastAccuracyManufacturerQuarterlyData !=
      nextProps.getForcastAccuracyManufacturerQuarterlyData
    ) {
      if (nextProps.getForcastAccuracyManufacturerQuarterlyData != 0) {
        this.setState({
          getForcastAccuracyManufacturerQuarterlyData:
            nextProps.getForcastAccuracyManufacturerQuarterlyData,
          isDataFetched: true
        });
      } else {
        this.setState({
          getForcastAccuracyManufacturerQuarterlyData: [],
          isDataFetched: false
        });
      }
    }

    if (
      this.props.getForcastAccuracyMaterialQuarterlyData !=
      nextProps.getForcastAccuracyMaterialQuarterlyData
    ) {
      if (nextProps.getForcastAccuracyMaterialQuarterlyData) {
        this.setState({
          getForcastAccuracyMaterialQuarterlyData:
            nextProps.getForcastAccuracyMaterialQuarterlyData,
          isDataFetched: true
        });
      } else {
        this.setState({
          getForcastAccuracyMaterialQuarterlyData: [],
          isDataFetched: false
        });
      }
    }
    if (
      this.props.getForcastAccuracyQuarterlyTrendData !=
      nextProps.getForcastAccuracyQuarterlyTrendData
    ) {
      if (nextProps.getForcastAccuracyQuarterlyTrendData != 0) {
        this.setState({
          getForcastAccuracyQuarterlyTrendData: nextProps.getForcastAccuracyQuarterlyTrendData
        });
      } else {
        this.setState({
          getForcastAccuracyQuarterlyTrendData: []
        });
      }
    }

    if (this.props.getForcastAccuracyQuarterlyData != nextProps.getForcastAccuracyQuarterlyData) {
      if (nextProps.getForcastAccuracyQuarterlyData != 0) {
        this.setState({
          seriesAllFAD: nextProps.getForcastAccuracyQuarterlyData[0].Forcast_Accuracy_Demand
        });
      } else {
        this.setState({
          seriesAllFAD: []
        });
      }
    }

    if (this.props.getForcastAccuracyMinMaxDateData != nextProps.getForcastAccuracyMinMaxDateData) {
      if (nextProps.getForcastAccuracyMinMaxDateData != 0) {
        //FAD
        // this.props.getForcastAccuracyDemand(
        //   nextProps.getForcastAccuracyMinMaxDateData[0].Min_Date_DIALY,

        //   nextProps.getForcastAccuracyMinMaxDateData[0].Max_Date_DAILY
        // );
        // this.props.getForcastAccuracyMonthwise(
        //   nextProps.getForcastAccuracyMinMaxDateData[0].Min_Date_DIALY,
        //   nextProps.getForcastAccuracyMinMaxDateData[0].Max_Date_DAILY
        // );
        // this.props.getForcastAccuracyMaterial(
        //   nextProps.getForcastAccuracyMinMaxDateData[0].Min_Date_DIALY,
        //   nextProps.getForcastAccuracyMinMaxDateData[0].Max_Date_DAILY
        // );

        this.setState({
          getForcastAccuracyMinMaxDateData: nextProps.getForcastAccuracyMinMaxDateData,
          FAD_minDate: nextProps.getForcastAccuracyMinMaxDateData.map((d) => d.Min_Date_DIALY),
          FAD_maxDate: nextProps.getForcastAccuracyMinMaxDateData.map((d) => d.Max_Date_DAILY),

          min_max_date: [
            nextProps.getForcastAccuracyMinMaxDateData.map((d) => d.Min_Date_DIALY),

            nextProps.getForcastAccuracyMinMaxDateData.map((d) => d.Max_Date_DAILY)
          ]
        });
      } else {
        this.setState({
          getForcastAccuracyMinMaxDateData: []
        });
      }
    }

    if (this.props.getForcastAccuracyMonthwiseData != nextProps.getForcastAccuracyMonthwiseData) {
      if (nextProps.getForcastAccuracyMonthwiseData != 0) {
        this.setState({
          getForcastAccuracyMonthwiseData: nextProps.getForcastAccuracyMonthwiseData
        });
      } else {
        this.setState({
          getForcastAccuracyMonthwiseData: []
        });
      }
    }

    if (
      this.props.getForcastAccuracyOrgMonthwiseData != nextProps.getForcastAccuracyOrgMonthwiseData
    ) {
      if (nextProps.getForcastAccuracyOrgMonthwiseData != 0) {
        this.setState({
          getForcastAccuracyOrgMonthwiseData: nextProps.getForcastAccuracyOrgMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getForcastAccuracyOrgMonthwiseData: [],
          loader: true
        });
      }
    }
    if (
      this.props.getForcastAccuracyManufMonthwiseData !=
      nextProps.getForcastAccuracyManufMonthwiseData
    ) {
      if (nextProps.getForcastAccuracyManufMonthwiseData != 0) {
        this.setState({
          getForcastAccuracyManufMonthwiseData: nextProps.getForcastAccuracyManufMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getForcastAccuracyManufMonthwiseData: [],
          loader: true
        });
      }
    }
    if (
      this.props.getForcastAccuracyMaterialMonthwiseData !=
      nextProps.getForcastAccuracyMaterialMonthwiseData
    ) {
      if (nextProps.getForcastAccuracyMaterialMonthwiseData != 0) {
        this.setState({
          getForcastAccuracyMaterialMonthwiseData:
            nextProps.getForcastAccuracyMaterialMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getForcastAccuracyMaterialMonthwiseData: [],
          loader: true
        });
      }
    }

    if (
      this.props.getForcastAccuracyOrganizationData != nextProps.getForcastAccuracyOrganizationData
    ) {
      if (nextProps.getForcastAccuracyOrganizationData != 0) {
        this.setState({
          getForcastAccuracyOrganizationData: nextProps.getForcastAccuracyOrganizationData
        });
      } else {
        this.setState({
          getForcastAccuracyOrganizationData: []
        });
      }
    }
    if (
      this.props.getForcastAccuracyManufacturerData != nextProps.getForcastAccuracyManufacturerData
    ) {
      if (nextProps.getForcastAccuracyManufacturerData != 0) {
        this.setState({
          getForcastAccuracyManufacturerData: nextProps.getForcastAccuracyManufacturerData
        });
      } else {
        this.setState({
          getForcastAccuracyManufacturerData: []
        });
      }
    }
    if (this.props.getForcastAccuracyMaterialData != nextProps.getForcastAccuracyMaterialData) {
      if (nextProps.getForcastAccuracyMaterialData != 0) {
        this.setState({
          getForcastAccuracyMaterialData: nextProps.getForcastAccuracyMaterialData
        });
      } else {
        this.setState({
          getForcastAccuracyMaterialData: []
        });
      }
    }
    if (this.props.getForcastAccuracyDemandData != nextProps.getForcastAccuracyDemandData) {
      if (nextProps.getForcastAccuracyDemandData != 0) {
        this.setState({
          getForcastAccuracyDemandData: nextProps.getForcastAccuracyDemandData,
          series2: [
            nextProps.getForcastAccuracyDemandData.map((data) =>
              data.Forcast_Accuracy_Demand.toFixed(1)
            )
          ]
        });
      } else {
        this.setState({
          getForcastAccuracyDemandData: []
        });
      }
    }
  }

  HandleAllFADModal() {
    if (this.state.AllFADMODAL) {
      this.setState({
        AllFADMODAL: false
      });
    } else {
      this.setState({
        AllDefaultActiveKey: '1',
        AllFADMODAL: true,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
    }
  }
  handleModalFAD() {
    this.setState({
      activeKey: '1',
      FADModal: true,
      color: '#82ca9d',

      chartChangeDD: 'LINE'
    });
  }
  handleModalFADClose() {
    this.setState({
      FADModal: false
    });
  }

  handleModalBackToMatnrAll() {
    this.setState({
      ToallActiveKey: '1',
      ToAllViewMore: true
    });
  }
  handleModalBackToMatnrAllClose() {
    this.setState({
      ToallActiveKey: '1',
      ToAllViewMore: false
    });
  }

  handleModalAllFADKeyChange(key) {
    if (key == 3) {
      this.setState({
        AllDefaultActiveKey: '3',
        isDataFetched: false,
        newResultLength: '',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getForcastAccuracyOrganizationQuarterly();
    } else if (key == 2) {
      this.setState({
        AllDefaultActiveKey: '2',
        isDataFetched: false,
        newResultLength: '',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });

      this.props.getForcastAccuracyManufacturerQuarterly();
    } else {
      this.setState({
        AllDefaultActiveKey: '1',
        isDataFetched: false,
        newResultLength: '',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getForcastAccuracyMaterialQuarterly();
    }
  }

  // Forecast  Accuracy Demand
  handleModalKeyChangeFAD(key) {
    if (key == 3) {
      this.setState({
        activeKey: '3',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      if (this.state.toggleHide) {
        this.props.getForcastAccuracyOrganization('all', 'all');
      } else {
        this.props.getForcastAccuracyOrganization(this.state.FADDATE1, this.state.FADDATE2);
      }
    } else if (key == 4) {
      this.setState({
        activeKey: '4',
        RadioButtonValue: true
      });
      if (this.state.RadioButtonValue) {
        this.props.getKPIForecastAccuracyAnalysis();
      } else {
        this.props.getKPIForecastAccuracyAnalysisPieChart();
      }
    } else if (key == 2) {
      this.setState({
        activeKey: '2',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      if (this.state.toggleHide) {
        this.props.getForcastAccuracyManufacturer('all', 'all');
      } else {
        this.props.getForcastAccuracyManufacturer(this.state.FADDATE1, this.state.FADDATE2);
      }
    } else {
      this.setState({
        activeKey: '1',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      if (this.state.toggleHide) {
        this.props.getForcastAccuracyMaterial('all', 'all');
      } else {
        this.props.getForcastAccuracyMaterial(this.state.FADDATE1, this.state.FADDATE2);
      }
    }
  }

  costformat(cell) {
    var values = [];
    if (cell < 1000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>{value}%</span>);
    } else if (cell < 9999 || cell < 1000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>{value}%</span>);
    } else if (cell < 10000000 || cell < 1000000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>{value}%</span>);
    } else if (cell < 1000000000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>{value}%</span>);
    }
    return values;
  }
  costformatWithout_percentage(cell) {
    var values = [];
    if (cell < 1000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>{value}</span>);
    } else if (cell < 9999 || cell < 1000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>{value}</span>);
    } else if (cell < 10000000 || cell < 1000000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>{value}</span>);
    } else if (cell < 1000000000000) {
      let value = (cell / 1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>{value}</span>);
    }
    return values;
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

  materialDescription(cell, row) {
    return (
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
        <span className="row-data">{cell}</span>
      </Popover>
    );
  }

  FADOnclickMatnrModal(matnr) {
    this.setState({
      materialNo: matnr.MATNR,
      FADchartModal: true,
      loader: true
    });
    if (this.state.toggleHide) {
      this.props.getForcastAccuracyMaterialMonthwise(matnr.MATNR, matnr.LGORT, 'all', 'all');
    } else {
      this.props.getForcastAccuracyMaterialMonthwise(
        matnr.MATNR,
        matnr.LGORT,
        this.state.FADDATE1,
        this.state.FADDATE2
      );
    }
  }
  FADOnclickManufModal(matnr) {
    this.setState({
      manuf: matnr.MANUF_NAME,
      FADchartModal2: true,
      loader: true
    });

    if (this.state.toggleHide) {
      this.props.getForcastAccuracyManufMonthwise(
        encodeURIComponent(matnr.MANUF_NAME),
        matnr.LGORT,
        'all',
        'all'
      );
    } else {
      this.props.getForcastAccuracyManufMonthwise(
        encodeURIComponent(matnr.MANUF_NAME),
        matnr.LGORT,
        this.state.FADDATE1,
        this.state.FADDATE2
      );
    }
  }
  FADOnclickOrgfModal(matnr) {
    this.setState({
      org: matnr.ORGANIZATION,
      FADchartModal3: true,
      loader: true
    });
    if (this.state.toggleHide) {
      this.props.getForcastAccuracyOrgMonthwise(
        encodeURIComponent(matnr.ORGANIZATION),
        matnr.LGORT,
        'all',
        'all'
      );
    } else {
      this.props.getForcastAccuracyOrgMonthwise(
        encodeURIComponent(matnr.ORGANIZATION),
        matnr.LGORT,
        this.state.FADDATE1,
        this.state.FADDATE2
      );
    }
  }

  onclickBoAllclose() {
    this.setState({
      Boallmodal: false
    });
  }
  oncloseToAllAction() {
    this.setState({
      ToAllmtnrAction: false
    });
  }
  oncloseToAllOrgAction() {
    this.setState({ ToAllOrgAction: false });
  }
  onclickBoAllOrgclose() {
    this.setState({
      BoAllOrgModal: false
    });
  }

  onclickALLFADMatnr(value) {
    this.setState({
      materialNo: value.MATNR,
      ALLFADMATNRACTION: true,

      loader: true
    });
    this.props.getForcastAccuracyMaterialQuarterlyTrend(value.MATNR, value.LGORT);
  }

  onclickALLFADManuf(value) {
    this.setState({
      manuf: value.MANUF_NAME,
      ALLFADMANUFACTION: true,
      loader: true
    });
    this.props.getForcastAccuracyManufQuarterlyTrend(
      encodeURIComponent(value.MANUF_NAME),
      value.LGORT
    );
  }
  onclickALLFADORG(value) {
    this.setState({
      org: value.ORGANIZATION,
      ALLFADORGACTION: true,
      loader: true
    });
    this.props.getForcastAccuracyOrgQuarterlyTrend(
      encodeURIComponent(value.ORGANIZATION),
      value.LGORT
    );
  }

  onclickCloseFadMatnrModal() {
    this.setState({
      getForcastAccuracyMaterialMonthwiseData: [],
      FADchartModal: false
    });
  }
  onclickCloseFadManufModal() {
    this.setState({
      getForcastAccuracyManufMonthwiseData: [],
      FADchartModal2: false
    });
  }

  onclickCloseFadOrgfModal() {
    this.setState({
      getForcastAccuracyOrgMonthwiseData: [],
      FADchartModal3: false
    });
  }

  onclickToAllMatnr() {
    this.setState({
      ToMatnrAll: false
    });
  }

  onclickChartFAD() {
    this.setState({
      FADDrillDownModal: false
    });
  }

  onclickFADDrillDown() {
    this.setState({
      FADDrillDownModal: true,
      color: '#82ca9d',

      chartChangeDD: 'AREA'
    });
  }

  onclickALLFADDrillDown() {
    this.setState({
      ALLFADDrillDownModal: !this.state.ALLFADDrillDownModal,
      color: '#82ca9d',

      chartChangeDD: 'AREA'
    });
  }

  onclickALLFADDrillDownMATNRACTION() {
    this.setState({
      ALLFADMATNRACTION: false,
      loader: false
    });
  }

  onclickALLFADDrillDownMANUFACTION() {
    this.setState({
      ALLFADMANUFACTION: false,
      loader: false
    });
  }

  onclickALLFADDrillDownORGACTION() {
    this.setState({
      ALLFADORGACTION: false,
      loader: false
    });
  }

  onclickToDrillDownView() {
    this.setState({
      TurnoverDrillDownModal: true
    });
  }
  onclickDDAllTo() {
    this.setState({
      ToMatnrAll: true
    });
  }
  turnoverChartOnclick() {}

  TooltipFormatFAD(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>Forecast Accuracy: {e.payload[0].payload.Forcast_Accuracy}</b> <br />
          </span>
        </div>
      );
    }
  }

  TooltipFormatFADMonthlyWise(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>Overall Accuracy: {e.payload[0].payload.Forcast_Accuracy}</b> <br />
          </span>
        </div>
      );
    }
  }

  TooltipFormatAllFADMonthlyWise(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.Date).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>Overall Accuracy: {e.payload[0].payload.Forcast_Accuracy_Demand}</b> <br />
          </span>
        </div>
      );
    }
  }

  TooltipFormatAllFADMatnr(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>Overall Accuracy: {e.payload[0].payload.Forcast_Accuracy}</b> <br />
          </span>
        </div>
      );
    }
  }

  exportToCSVALLFADORG() {
    let csvData = this.state.getForcastAccuracyOrganizationQuarterlyData;
    let fileName = 'Forecast  Accuracy Organization Quarterly';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVALLFADMANUF() {
    let csvData = this.state.getForcastAccuracyManufacturerQuarterlyData;
    let fileName = 'Forecast  Accuracy Manufacturer Quarterly';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVALLFADMATNR() {
    let csvData = this.state.getForcastAccuracyMaterialQuarterlyData;
    let fileName = 'Forecast  Accuracy Material Quarterly';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVRadialAO() {
    let csvData = this.state.getForcastAccuracyMonthwiseData;
    let fileName = 'ForcastAccuracyMonthwise';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVAllFAD() {
    let csvData = this.state.getForcastAccuracyQuarterlyTrendData;
    let fileName = 'ForcastAccuracyMonthwise';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVAllFADMATNRACTION() {
    let csvData = this.state.getForcastAccuracyMaterialQuarterlyTrendData;
    let fileName = `${this.state.materialNo}-ForecastAccuracy Quarterly`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVAllFADMANUFACTION() {
    let csvData = this.state.getForcastAccuracyManufQuarterlyTrendData;
    let fileName = `${this.state.manuf}-Forecast Accuracy Quarterly`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVAllFADORGACTION() {
    let csvData = this.state.getForcastAccuracyOrgQuarterlyTrendData;
    let fileName = `${this.state.org}- ForcastAccuracy Quarterly`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVRadialAOOrg() {
    let csvData = this.state.getForcastAccuracyOrgMonthwiseData;
    let fileName = `${this.state.org}-Forecast Accuracy`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVRadialAOManuf() {
    let csvData = this.state.getForcastAccuracyManufMonthwiseData;
    let fileName = `${this.state.manuf}-Forecast Accuracy`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVRadialAOMatnr() {
    let csvData = this.state.getForcastAccuracyMaterialMonthwiseData;
    let fileName = `${this.state.materialNo}-Forecast Accuracy`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToExcelFAM() {
    let csvData = this.state.getForcastAccuracyMaterialData;
    let fileName = 'ForcastAccuracyMaterialData';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToExcelFAO() {
    let csvData = this.state.getForcastAccuracyOrganizationData;
    let fileName = 'ForcastAccuracyOrganizationData';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToExcelFAMU() {
    let csvData = this.state.getForcastAccuracyManufacturerData;
    let fileName = 'ForcastAccuracyManufacturerData';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  handleFlippedALLFAO() {
    if (this.state.AllFAOFLIPPED == true) {
      this.setState({
        AllFAOFLIPPED: false
      });
    } else {
      this.setState({
        AllFAOFLIPPED: true
      });
      //ALLFAD
      this.props.getForcastAccuracyQuarterly();
      this.props.getForcastAccuracyQuarterlyTrend();
      this.props.getForcastAccuracyMaterialQuarterly();
    }
  }

  costformatwithDollar(cell) {
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

  infoFad() {
    if (this.state.ModalFad == true) {
      this.setState({
        ModalFad: false
      });
    } else {
      this.setState({
        ModalFad: true
      });
    }
  }

  formatXAxis(tickItem) {
    return moment(tickItem).format('MMM-YYYY');
  }
  datechange(dates, dateStrings) {
    if (this.state.count === 2) {
      this.setState({
        FADDATE1: dateStrings[0],
        FADDATE2: dateStrings[1],
        series2: 0,
        getForcastAccuracyMonthwiseData: [],
        togCal: true,
        count: 0
      });
      this.props.getForcastAccuracyDemand(dateStrings[0], dateStrings[1]);
      this.props.getForcastAccuracyMonthwise(dateStrings[0], dateStrings[1]);
      this.props.getForcastAccuracyMaterial(dateStrings[0], dateStrings[1]);
    } else {
      this.setState({
        FADDATE1: dateStrings[0],
        FADDATE2: dateStrings[1],
        count: 2
      });
    }
  }
  toggleHide() {
    if (this.state.toggleHide) {
      this.setState({
        toggleHide: false,
        series2: 0,
        getForcastAccuracyMonthwiseData: [],
        FADDATE1: moment().subtract(6, 'months').format('MM-DD-YYYY'),
        FADDATE2: moment().format('MM-DD-YYYY')
      });
      this.props.getForcastAccuracyDemand(this.state.FADDATE1, this.state.FADDATE2);
      this.props.getForcastAccuracyMonthwise(this.state.FADDATE1, this.state.FADDATE2);
      this.props.getForcastAccuracyMaterial(this.state.FADDATE1, this.state.FADDATE2);
    } else {
      this.setState({
        toggleHide: true
      });
    }
  }
  toggle() {
    this.setState({
      togCal: this.state.togCal
    });
    if (this.state.togCal) {
      this.setState({
        toggleHide: true,

        series2: 0,
        getForcastAccuracyMonthwiseData: [],
        FADDATE1: moment().subtract(6, 'months').format('MM-DD-YYYY'),
        FADDATE2: moment().format('MM-DD-YYYY')
      });
      this.props.getForcastAccuracyDemand('all', 'all');
      this.props.getForcastAccuracyMonthwise('all', 'all');
      this.props.getForcastAccuracyMaterial('all', 'all');
    }
  }

  disabledDate(current) {
    let start = this.state.FAD_minDate[0];
    let end = this.state.FAD_maxDate[0];
    if (current < moment(start)) {
      return true;
    } else if (current > moment(end)) {
      return true;
    } else {
      return false;
    }
  }
  onDragEndFADRateColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.FADRateColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ FADRateColumn: columnsCopy });
  }
  onDragEndFADManufactureColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.FADManufactureColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ FADManufactureColumn: columnsCopy });
  }
  onDragEndFADRateOrgColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.FADRateOrgColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ FADRateOrgColumn: columnsCopy });
  }
  onDragEndBOAllManuf(fromIndex, toIndex) {
    const columnsCopy = this.state.BOAllManuf.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ BOAllManuf: columnsCopy });
  }
  onDragEndBOAllOrg(fromIndex, toIndex) {
    const columnsCopy = this.state.BOAllOrg.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ BOAllOrg: columnsCopy });
  }

  onDragEndALLFADColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.ALLFADMATNRCOL.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ ALLFADMATNRCOL: columnsCopy });
  }
  onDragEndALLFADMANUFColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.ALLFADMANUFCOL.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ ALLFADMANUFCOL: columnsCopy });
  }

  onDragEndALLFADORGColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.ALLFADORGCOL.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ ALLFADORGCOL: columnsCopy });
  }

  onDragEndTOALLmanuf(fromIndex, toIndex) {
    const columnsCopy = this.state.TOALLmanuf.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ TOALLmanuf: columnsCopy });
  }
  onDragEndTOALLmtnrOrg(fromIndex, toIndex) {
    const columnsCopy = this.state.TOALLmtnrOrg.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ TOALLmtnrOrg: columnsCopy });
  }
  handleChartChangeDD(value) {
    this.setState({
      chartChangeDD: value
    });
  }
  changeHandler(colors) {
    this.setState({
      color: colors.color
    });
  }

  Imploader() {
    this.setState({
      getForcastAccuracyDemandData: [],
      getForcastAccuracyMaterialData: [],
      getForcastAccuracyMonthwiseData: [],
      getForcastAccuracyMinMaxDateData: [],
      toggleHide: true,
      AllFAOFLIPPED: false,
      series2: []
    });
    this.props.getForcastAccuracyDemand('all', 'all'),
      this.props.getForcastAccuracyMaterial('all', 'all'),
      this.props.getForcastAccuracyMonthwise('all', 'all'),
      this.props.getForcastAccuracyMinMaxDate();
  }
  PieToolTip(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-bolder  font-14">
            <b>
              {e.payload[0].payload.DEMAND_BIN === '0-5' ? (
                <>
                  <i className="fas fa-circle total-trend mr-2" style={{ color: '#0088FE' }} />{' '}
                  {e.payload[0].payload.DEMAND_BIN}
                </>
              ) : (
                <>
                  {e.payload[0].payload.DEMAND_BIN === '5-10' ? (
                    <>
                      {' '}
                      <i
                        className="fas fa-circle total-trend mr-2"
                        style={{ color: '#DC143C' }}
                      />{' '}
                      {e.payload[0].payload.DEMAND_BIN}
                    </>
                  ) : (
                    <>
                      {e.payload[0].payload.DEMAND_BIN === '10-30' ? (
                        <>
                          {' '}
                          <i
                            className="fas fa-circle total-trend mr-2"
                            style={{ color: '#00C49F' }}
                          />{' '}
                          {e.payload[0].payload.DEMAND_BIN}
                        </>
                      ) : (
                        <>
                          {e.payload[0].payload.DEMAND_BIN === '30-50' ? (
                            <>
                              <i
                                className="fas fa-circle total-trend mr-2"
                                style={{ color: '#FF8042' }}
                              />{' '}
                              {e.payload[0].payload.DEMAND_BIN}
                            </>
                          ) : (
                            <>
                              {e.payload[0].payload.DEMAND_BIN === '50-100' ? (
                                <>
                                  {' '}
                                  <i
                                    className="fas fa-circle total-trend mr-2"
                                    style={{ color: '#008000' }}
                                  />{' '}
                                  {e.payload[0].payload.DEMAND_BIN}
                                </>
                              ) : (
                                <>
                                  {e.payload[0].payload.DEMAND_BIN === '100+' ? (
                                    <>
                                      <i
                                        className="fas fa-circle total-trend mr-2"
                                        style={{ color: '#FFBB28' }}
                                      />
                                      {e.payload[0].payload.DEMAND_BIN}
                                    </>
                                  ) : (
                                    <> {e.payload[0].payload.DEMAND_BIN}</>
                                  )}
                                </>
                              )}
                            </>
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}{' '}
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Percentage Of Parts:{' '}
              <span className=" font-14">{e.payload[0].payload.Percentage_of_parts}%</span>
            </b>{' '}
            <br />
          </span>
          {/* <span className="text-white font-14">
            <b>
              Percentage Of Capex:{' '}
              <span className="predicted-consumption-text font-14">
                {e.payload[0].payload.Percentage_of_CAPEX}
              </span>
            </b>{' '}
            <br />
          </span> */}
        </div>
      );
    }
  }
  TooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-bolder golden-text font-14">
            <b>Accuracy: {e.payload[0].payload.ACCURACY_BIN}</b> <br />
          </span>
          <span className="text-white font-14">
            <b>
              Percentage Of Parts:{' '}
              <span className="ending-on-hand-text font-14">
                {e.payload[0].payload.PERCENTAGE_OF_PARTS}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Percentage Of Capex:{' '}
              <span className="predicted-consumption-text font-14">
                {e.payload[0].payload.PERCENTAGE_OF_CAPEX}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  }
  HandleRadioButtonValue(e) {
    this.setState({
      RadioButtonValue: e.target.value
    });
    e.target.value
      ? this.props.getKPIForecastAccuracyAnalysis()
      : this.props.getKPIForecastAccuracyAnalysisPieChart();
  }
  render() {
    const pageoptions = {
      sizePerPageRenderer
    };
    const sizePerPageRenderer = ({ options, currSizePerPage, onSizePerPageChange }) => (
      <div className="btn-group" role="group">
        {options.map((option) => {
          const isSelect = currSizePerPage === `${option.page}`;
          return (
            <button
              key={option.text}
              type="button"
              onClick={() => onSizePerPageChange(option.page)}
              className={`btn ${isSelect ? 'btn-secondary' : 'btn-warning'}`}>
              {option.text}
            </button>
          );
        })}
      </div>
    );
    return (
      <div>
        <Row style={{ margin: '0px' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <ReactCardFlip isFlipped={this.state.AllFAOFLIPPED} flipDirection="horizontal">
              <Card className="parts-wid  prl wid-card-height-kpi" size="small">
                {this.state.getForcastAccuracyMonthwiseData != 0 ? (
                  <Row>
                    <p className="kpi-w1">
                      <i className="fas fa-box-open"> </i>
                      Accuracy of Forecast Demand
                      <Popover placement="bottom" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoFad}
                        />
                      </Popover>
                      <i className="fas fa-sync flipicon" onClick={this.handleFlippedALLFAO}></i>
                      {this.state.toggleHide ? (
                        <span className="custom-class ml-1">
                          {' '}
                          <i className="far fa-calendar-alt" onClick={this.toggleHide}></i>
                        </span>
                      ) : (
                        ''
                      )}
                    </p>
                    {this.state.toggleHide ? (
                      <Row className="KPI-FAD-ROW">
                        {' '}
                        <Col span={12}>
                          {' '}
                          <p className="kpi-this-month" id="togggle">
                            Overall Accuracy
                          </p>
                        </Col>
                      </Row>
                    ) : (
                      <>
                        {' '}
                        <Col span={7}>
                          {' '}
                          <p className="kpi-this-month" id="togggle">
                            Accuracy Range
                          </p>
                        </Col>
                        <Col span={17} className="float-right">
                          <span className="parent-cal1">
                            <RangePicker
                              allowClear={false}
                              size="small"
                              className="range-style"
                              disabledDate={this.disabledDate.bind(this)}
                              onChange={this.datechange.bind(this)}
                              value={[moment(this.state.FADDATE1), moment(this.state.FADDATE2)]}
                              placeholder={null}
                              format="MM-DD-YYYY"
                            />

                            <i className="far fa-times-circle" onClick={this.toggle}></i>
                          </span>
                        </Col>
                      </>
                    )}
                    <Col span={12}>
                      {' '}
                      <p className="kpi-series">
                        <Odometer value={this.state.series2} options={{ format: '' }} />%
                        {/* {this.state.series} */}
                      </p>
                      <p className="kpi-this-month">Rolling 6 Months</p>
                      <Button type="primary" onClick={this.handleModalFAD}>
                        <span className="kpi-btn">
                          View More &nbsp;<i className="fas fa-arrow-right"></i>
                        </span>
                      </Button>
                    </Col>
                    <Col span={12}>
                      <ResponsiveContainer height={60} width="100%">
                        <AreaChart
                          className="FAD"
                          width={100}
                          height={60}
                          data={this.state.getForcastAccuracyMonthwiseData}
                          margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5
                          }}
                          onClick={this.onclickFADDrillDown.bind(this)}>
                          <Tooltip content={this.TooltipFormatFADMonthlyWise} />
                          <defs>
                            <linearGradient id="gradationFAD" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="30%" stopColor="#3D7EAA" />
                              <stop offset="70%" stopColor="#FFE47A" />
                            </linearGradient>
                          </defs>

                          <Area
                            type="monotone"
                            dataKey="Forcast_Accuracy"
                            stroke="#FF5959"
                            fill="#FF5959"
                            strokeWidth={2}
                            // fill="url(#gradationFAD)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div
                        className="Overall"
                        style={{
                          fontSize: '14px',
                          letterSpacing: '0.5px',

                          textAlign: 'center',
                          paddingTop: '30px',
                          paddingBottom: '21px'
                        }}>
                        <span>Overall Accuracy</span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <p className="kpi-w1">
                      <i className="fas fa-box-open"> </i>
                      Accuracy of Forecast Demand
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoFad}
                        />
                      </Popover>
                      <div className="kpi-loader">
                        <ReusableSysncLoader />
                      </div>
                    </p>
                  </Row>
                )}
              </Card>
              {/* ALLFAO */}
              <Card className="parts-wid  prl wid-card-height-kpi" size="small">
                {this.state.seriesAllFAD != '' &&
                this.state.getForcastAccuracyQuarterlyTrendData != '' ? (
                  <Row>
                    <p className="kpi-w1">
                      <i className="fas fa-box-open"> </i>
                      Quarterly Forecast Accuracy
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoFad}
                        />
                      </Popover>
                      <i className="fas fa-sync flipicon" onClick={this.handleFlippedALLFAO}></i>
                    </p>

                    <Row className="KPI-FAD-ROW">
                      {' '}
                      <Col span={12}>
                        {' '}
                        <p className="kpi-this-month" id="togggle">
                          Overall Accuracy
                        </p>
                      </Col>
                    </Row>

                    <Col span={12}>
                      {' '}
                      <p className="kpi-series">
                        <Odometer value={this.state.seriesAllFAD} options={{ format: '' }} />%
                        {/* {this.state.series} */}
                      </p>
                      <p className="kpi-this-month">Rolling 4 Months</p>
                      <Button type="primary" onClick={this.HandleAllFADModal}>
                        <span className="kpi-btn">
                          View More &nbsp;<i className="fas fa-arrow-right"></i>
                        </span>
                      </Button>
                    </Col>
                    <Col span={12}>
                      <ResponsiveContainer height={60} width="100%">
                        <AreaChart
                          className="FAD"
                          width={100}
                          height={60}
                          data={this.state.getForcastAccuracyQuarterlyTrendData}
                          margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5
                          }}
                          onClick={this.onclickALLFADDrillDown.bind(this)}>
                          <Tooltip content={this.TooltipFormatAllFADMonthlyWise} />
                          <defs>
                            <linearGradient id="gradationFAD" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="30%" stopColor="#3D7EAA" />
                              <stop offset="70%" stopColor="#FFE47A" />
                            </linearGradient>
                          </defs>

                          <Area
                            type="monotone"
                            dataKey="Forcast_Accuracy_Demand"
                            stroke="#A3E4DB"
                            fill="#A3E4DB"
                            strokeWidth={2}
                            // fill="url(#gradationFAD)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                      <div
                        className="Overall"
                        style={{
                          fontSize: '14px',
                          letterSpacing: '0.5px',

                          textAlign: 'center',
                          paddingTop: '30px',
                          paddingBottom: '21px'
                        }}>
                        <span>Overall Accuracy</span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <Row>
                    <p className="kpi-w1">
                      <i className="fas fa-box-open"> </i>
                      Quarterly Forecast Accuracy
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoFad}
                        />
                      </Popover>
                      <div className="kpi-loader">
                        <ReusableSysncLoader />
                      </div>
                    </p>
                  </Row>
                )}
              </Card>
            </ReactCardFlip>
          </Col>
        </Row>
        {/* ################################################################################################ */}

        <Modal
          width="80%"
          footer={null}
          className="modal-turnover"
          visible={this.state.AllFADMODAL}
          onCancel={this.HandleAllFADModal}
          title={
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <span className="float-left mr-2 cls">
                  <i className="fas fa-box-open"> </i>
                </span>
                <span className="tab-head">Quarterly Forecast Accuracy</span>
              </Col>
            </Row>
          }>
          <Tabs
            defaultActiveKey={'1'}
            activeKey={this.state.AllDefaultActiveKey}
            onChange={this.handleModalAllFADKeyChange}>
            <TabPane tab="Material" key="1">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getForcastAccuracyMaterialQuarterlyData}
                  columns={this.state.ALLFADMATNRCOL}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        this.setState({
                          newResultLength: newResult.length
                        });
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          {/* <h6 className="ml-2">Advance PO Issuance</h6> */}
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {this.state.getForcastAccuracyMaterialQuarterlyData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVALLFADMATNR}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVALLFADMATNR}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndALLFADColumn.bind(this)}
                        nodeSelector="th">
                        <div className="capgov-table">
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
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
            <TabPane tab="Manufacturer" key="2">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getForcastAccuracyManufacturerQuarterlyData}
                  columns={this.state.ALLFADMANUFCOL}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        this.setState({
                          newResultLength: newResult.length
                        });
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          {/* <h6 className="ml-2">Advance PO Issuance</h6> */}
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {this.state.getForcastAccuracyManufacturerQuarterlyData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVALLFADMANUF}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVALLFADMANUF}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndALLFADMANUFColumn.bind(this)}
                        nodeSelector="th">
                        <div className="capgov-table">
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
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
            <TabPane tab="Organization" key="3">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getForcastAccuracyOrganizationQuarterlyData}
                  columns={this.state.ALLFADORGCOL}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        this.setState({
                          newResultLength: newResult.length
                        });
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          {/* <h6 className="ml-2">Advance PO Issuance</h6> */}
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {this.state.getForcastAccuracyOrganizationQuarterlyData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVALLFADORG}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVALLFADORG}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}

                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndALLFADORGColumn.bind(this)}
                        nodeSelector="th">
                        <div className="capgov-table">
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
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
          {/* </Card> */}
        </Modal>

        {/* ALLFAD Org Action */}

        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Organization - {this.state.org}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.ALLFADORGACTION}
          onCancel={this.onclickALLFADDrillDownORGACTION.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getForcastAccuracyOrgQuarterlyTrendReducerLoader &&
            this.state.getForcastAccuracyOrgQuarterlyTrendData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVAllFADORGACTION.bind(this)}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.OverAllFADORGACTION,
                        `${this.state.org}- ForcastAccuracy Quarterly Chart`
                      )
                    }>
                    <i className="fas fa-image" />
                  </Button>
                  <span className="float-right">
                    {' '}
                    <Select
                      className="chart-select"
                      value={this.state.chartChangeDD}
                      style={{ width: 120 }}
                      onChange={this.handleChartChangeDD.bind(this)}>
                      <Option value="LINE">Line</Option>
                      <Option value="AREA">Area</Option>

                      <Option value="BAR">Bar</Option>
                    </Select>
                  </span>
                </div>

                <div ref={this.OverAllFADORGACTION}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getForcastAccuracyOrgQuarterlyTrendData}
                    Ydatakey="Forcast_Accuracy"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="Forecast Accuracy"
                    Tooltip={this.TooltipFormatAllFADMatnr}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-class"
                          /> */}
                          <span className="legend-cls"> - Overall Accuracy</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getForcastAccuracyOrgQuarterlyTrendReducerLoader ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </Row>
        </Modal>

        {/* ALLFAD_MANUF_ACTION */}

        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Manufacturer - {this.state.manuf}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.ALLFADMANUFACTION}
          onCancel={this.onclickALLFADDrillDownMANUFACTION.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getForcastAccuracyManufQuarterlyTrendReducerLoader &&
            this.state.getForcastAccuracyManufQuarterlyTrendData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVAllFADMANUFACTION}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.OverAllFADMATNRACTION,
                        `${this.state.manuf}-Forecast Accuracy Quarterly Chart`
                      )
                    }>
                    <i className="fas fa-image" />
                  </Button>
                  <span className="float-right">
                    {' '}
                    <Select
                      className="chart-select"
                      value={this.state.chartChangeDD}
                      style={{ width: 120 }}
                      onChange={this.handleChartChangeDD.bind(this)}>
                      <Option value="LINE">Line</Option>
                      <Option value="AREA">Area</Option>

                      <Option value="BAR">Bar</Option>
                    </Select>
                  </span>
                </div>

                <div ref={this.OverAllFADMATNRACTION}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getForcastAccuracyManufQuarterlyTrendData}
                    Ydatakey="Forcast_Accuracy"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="Forecast Accuracy"
                    Tooltip={this.TooltipFormatAllFADMatnr}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-class"
                          /> */}
                          <span className="legend-cls"> - Overall Accuracy</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getForcastAccuracyManufQuarterlyTrendReducerLoader ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </Row>
        </Modal>

        {/* ALLFADMATNRACTION */}

        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Material - {this.state.materialNo}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.ALLFADMATNRACTION}
          onCancel={this.onclickALLFADDrillDownMATNRACTION.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getForcastAccuracyMaterialQuarterlyTrendReducerLoader &&
            this.state.getForcastAccuracyMaterialQuarterlyTrendData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVAllFADMATNRACTION}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.OverAllFADMANUFACTION,
                        `${this.state.materialNo}-ForecastAccuracy Quarterly Chart`
                      )
                    }>
                    <i className="fas fa-image" />
                  </Button>
                  <span className="float-right">
                    {' '}
                    <Select
                      className="chart-select"
                      value={this.state.chartChangeDD}
                      style={{ width: 120 }}
                      onChange={this.handleChartChangeDD.bind(this)}>
                      <Option value="LINE">Line</Option>
                      <Option value="AREA">Area</Option>

                      <Option value="BAR">Bar</Option>
                    </Select>
                  </span>
                </div>

                <div ref={this.OverAllFADMANUFACTION}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getForcastAccuracyMaterialQuarterlyTrendData}
                    Ydatakey="Forcast_Accuracy"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="Forecast Accuracy"
                    Tooltip={this.TooltipFormatAllFADMatnr}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-class"
                          /> */}
                          <span className="legend-cls"> - Overall Accuracy</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getForcastAccuracyMaterialQuarterlyTrendReducerLoader ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </Row>
        </Modal>

        {/* ####################################################################################################### */}

        {/* AllForcast_Accuracy_Demand_chart--start */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Monthly Wise Overall Accuracy
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.ALLFADDrillDownModal}
          onCancel={this.onclickALLFADDrillDown.bind(this)}>
          <Row className="mt-2 v4">
            <div className="head-title">
              {' '}
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right "
                onClick={this.exportToCSVAllFAD}>
                <i className="fas fa-file-excel" />
              </Button>
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={() =>
                  exportComponentAsPNG(this.OverAllFAD, 'Overall Accuracy- Monthly wise')
                }>
                <i className="fas fa-image" />
              </Button>
              <span className="float-right">
                {' '}
                <Select
                  className="chart-select"
                  value={this.state.chartChangeDD}
                  style={{ width: 120 }}
                  onChange={this.handleChartChangeDD.bind(this)}>
                  <Option value="LINE">Line</Option>
                  <Option value="AREA">Area</Option>

                  <Option value="BAR">Bar</Option>
                </Select>
              </span>
            </div>

            <div ref={this.OverAllFAD}>
              <DynamicChart
                stroke={this.state.color}
                fill={this.state.color}
                chart={this.state.chartChangeDD}
                formatXAxis={this.formatXAxis}
                data={this.state.getForcastAccuracyQuarterlyTrendData}
                Ydatakey="Forcast_Accuracy_Demand"
                Xdatakey="Date"
                Xvalue=" Date"
                Yvalue="Forecast Accuracy"
                Tooltip={this.TooltipFormatAllFADMonthlyWise}
                Legend={
                  <div className="float-left pl-40">
                    <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                      <ColorPicker
                        // animation="slide-up"
                        color={this.state.color}
                        onChange={this.changeHandler}
                        className="some-class"
                      />
                      <span className="legend-cls"> - Overall Accuracy</span>
                    </Popover>
                  </div>
                }
              />
            </div>
          </Row>
        </Modal>
        {/* end */}

        {/* ###################################################################################################### */}

        {/* //newcode */}

        {/* {backorderModal} */}

        {/* kpi info fad */}

        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Accuracy of Forecast Demand - Description</div>}
          className="Intervaltimeline"
          visible={this.state.ModalFad}
          onCancel={this.infoFad}>
          <div>
            <p>
              <strong>Accuracy of Forecast Demand:</strong>
            </p>
            <ul>
              <li>
                Accuracy of forecast demand, also known as the demand forecast accuracy, is a
                percent of how close the consumption quantity is to the forecast
              </li>
              <div className="kpifad-img" />
            </ul>
          </div>
        </Modal>

        {/* Forcast_Accuracy_Demand_chart--start */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Monthly Wise Overall Accuracy
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.FADDrillDownModal}
          onCancel={this.onclickChartFAD.bind(this)}>
          <Row className="mt-2 v4">
            <div className="head-title">
              {' '}
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right "
                onClick={this.exportToCSVRadialAO}>
                <i className="fas fa-file-excel" />
              </Button>
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={() =>
                  exportComponentAsPNG(this.OverAllTOImg, 'Overall Accuracy- Monthlywise')
                }>
                <i className="fas fa-image" />
              </Button>
              <span className="float-right">
                {' '}
                <Select
                  className="chart-select"
                  value={this.state.chartChangeDD}
                  style={{ width: 120 }}
                  onChange={this.handleChartChangeDD.bind(this)}>
                  <Option value="LINE">Line</Option>
                  <Option value="AREA">Area</Option>

                  <Option value="BAR">Bar</Option>
                </Select>
              </span>
            </div>

            <div ref={this.OverAllTOImg}>
              <DynamicChart
                stroke={this.state.color}
                fill={this.state.color}
                chart={this.state.chartChangeDD}
                formatXAxis={this.formatXAxis}
                data={this.state.getForcastAccuracyMonthwiseData}
                Ydatakey="Forcast_Accuracy"
                Xdatakey="DS"
                Xvalue=" Date"
                Yvalue="Forecast Accuracy"
                Tooltip={this.TooltipFormatFADMonthlyWise}
                Legend={
                  <div className="float-left pl-40">
                    <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                      {/* <ColorPicker
                        animation="slide-up"
                        color={this.state.color}
                        onChange={this.changeHandler}
                        className="some-class"
                      /> */}
                      <span className="legend-cls"> - Overall Accuracy</span>
                    </Popover>
                  </div>
                }
              />
            </div>
          </Row>
        </Modal>
        {/* end */}

        {/* forecastAccuracyOrganization */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Organization- {this.state.org}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.FADchartModal3}
          onCancel={this.onclickCloseFadOrgfModal.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getForcastAccuracyOrgMonthwiseLoaderReducer &&
            this.state.getForcastAccuracyOrgMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialAOOrg}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(this.OAO, `${this.state.org}-Forecast Accuracy Chart`)
                    }>
                    <i className="fas fa-image" />
                  </Button>
                  <span className="float-right">
                    {' '}
                    <Select
                      className="chart-select"
                      value={this.state.chartChangeDD}
                      style={{ width: 120 }}
                      onChange={this.handleChartChangeDD.bind(this)}>
                      <Option value="LINE">Line</Option>
                      <Option value="AREA">Area</Option>

                      <Option value="BAR">Bar</Option>
                    </Select>
                  </span>
                </div>

                <div ref={this.OAO}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getForcastAccuracyOrgMonthwiseData}
                    Ydatakey="Forcast_Accuracy"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="Forecast Accuracy"
                    Tooltip={this.TooltipFormatFAD}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-class"
                          /> */}
                          <span className="legend-cls"> - Overall Accuracy</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getForcastAccuracyOrgMonthwiseLoaderReducer ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </Row>
        </Modal>

        {/* forecastAccuracyManufacture */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Manufacturer- {this.state.manuf}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.FADchartModal2}
          onCancel={this.onclickCloseFadManufModal.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getForcastAccuracyManufMonthwiseReducerLoader &&
            this.state.getForcastAccuracyManufMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialAOManuf}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(this.OAMF, `${this.state.manuf}-Forecast Accuracy Chart`)
                    }>
                    <i className="fas fa-image" />
                  </Button>
                  <span className="float-right">
                    {' '}
                    <Select
                      className="chart-select"
                      value={this.state.chartChangeDD}
                      style={{ width: 120 }}
                      onChange={this.handleChartChangeDD.bind(this)}>
                      <Option value="LINE">Line</Option>
                      <Option value="AREA">Area</Option>

                      <Option value="BAR">Bar</Option>
                    </Select>
                  </span>
                </div>

                <div ref={this.OAMF}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getForcastAccuracyManufMonthwiseData}
                    Ydatakey="Forcast_Accuracy"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="Forecast Accuracy"
                    Tooltip={this.TooltipFormatFAD}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-class"
                          /> */}
                          <span className="legend-cls"> - Overall Accuracy</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getForcastAccuracyManufMonthwiseReducerLoader ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </Row>
        </Modal>

        {/* forecastAccuracyMaterial */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Material- {this.state.materialNo}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.FADchartModal}
          onCancel={this.onclickCloseFadMatnrModal.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getForcastAccuracyMaterialMonthwiseLoaderReducer &&
            this.state.getForcastAccuracyMaterialMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialAOMatnr}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.OAM,
                        `${this.state.materialNo}-Forecast Accuracy Chart`
                      )
                    }>
                    <i className="fas fa-image" />
                  </Button>
                  <span className="float-right">
                    {' '}
                    <Select
                      className="chart-select"
                      value={this.state.chartChangeDD}
                      style={{ width: 120 }}
                      onChange={this.handleChartChangeDD.bind(this)}>
                      <Option value="LINE">Line</Option>
                      <Option value="AREA">Area</Option>

                      <Option value="BAR">Bar</Option>
                    </Select>
                  </span>
                </div>

                <div ref={this.OAM}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getForcastAccuracyMaterialMonthwiseData}
                    Ydatakey="Forcast_Accuracy"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="Forecast Accuracy"
                    Tooltip={this.TooltipFormatFAD}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-class"
                          /> */}
                          <span className="legend-cls"> - Overall Accuracy</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getForcastAccuracyMaterialMonthwiseLoaderReducer ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </Row>
        </Modal>

        {/* Forcast_Accuracy_Demand Modal--start */}
        <Modal
          width="90%"
          footer={null}
          className="modal-turnover"
          visible={this.state.FADModal}
          onCancel={this.handleModalFADClose}
          title={
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <span className="float-left mr-2 cls">
                  <i className="fas fa-box-open"> </i>
                </span>
                <span className="tab-head">Forecast Accuracy Demand</span>
              </Col>
            </Row>
          }>
          <Tabs
            defaultActiveKey={'1'}
            activeKey={this.state.activeKey}
            onChange={this.handleModalKeyChangeFAD}>
            <TabPane tab="Material" key="1">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getForcastAccuracyMaterialData}
                  columns={this.state.FADRateColumn}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        this.setState({
                          newResultLength: newResult.length
                        });
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          {/* <h6 className="ml-2">Advance PO Issuance</h6> */}
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {this.state.getForcastAccuracyMaterialData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToExcelFAM}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToExcelFAM}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndFADRateColumn.bind(this)}
                        nodeSelector="th">
                        <div>
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
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
            <TabPane tab="Manufacturer" key="2">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getForcastAccuracyManufacturerData}
                  columns={this.state.FADManufactureColumn}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        this.setState({
                          newResultLength: newResult.length
                        });
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          {/* <h6 className="ml-2">Advance PO Issuance</h6> */}
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {this.state.getForcastAccuracyManufacturerData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToExcelFAMU}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToExcelFAMU}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndFADManufactureColumn.bind(this)}
                        nodeSelector="th">
                        <div className="capgov-table">
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
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
            <TabPane tab="Organization" key="3">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getForcastAccuracyOrganizationData}
                  columns={this.state.FADRateOrgColumn}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        this.setState({
                          newResultLength: newResult.length
                        });
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          {/* <h6 className="ml-2">Advance PO Issuance</h6> */}
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {this.state.getForcastAccuracyOrganizationData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToExcelFAO}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToExcelFAO}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndFADRateOrgColumn.bind(this)}
                        nodeSelector="th">
                        <div className="capgov-table">
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
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
            <TabPane tab="Analysis" key="4">
              <Row>
                <Col span={24}>
                  {this.state.RadioButtonValue ? (
                    <>
                      {' '}
                      <span
                        className="text-center mt-2 chart-legend"
                        style={{ position: 'relative', left: '30%', right: '50%' }}>
                        <span>
                          <i className="fas fa-circle total-trend" /> - Percentage Of Parts
                        </span>
                        {'   '}
                        <span className="ml-2">
                          {' '}
                          <i className="fas fa-circle projected-need" /> - Percentage Of Capex
                        </span>
                      </span>
                    </>
                  ) : (
                    <span
                      className=" golden-text font-17  pl-3"
                      style={{ position: 'relative', left: '30%', right: '50%' }}>
                      Accuracy By Average Monthly Demand
                    </span>
                  )}{' '}
                  <span className="float-right mr-4">
                    {' '}
                    <Radio.Group
                      className="NBA-Inventory-Prediction "
                      value={this.state.RadioButtonValue}
                      onChange={this.HandleRadioButtonValue.bind(this)}>
                      <Radio.Button value={true}>Accuracy by Capex</Radio.Button>
                      <Radio.Button value={false}>Accuracy by Demand</Radio.Button>
                    </Radio.Group>
                  </span>
                </Col>
              </Row>
              {this.state.RadioButtonValue ? (
                <>
                  {' '}
                  {!this.props.getKPIForecastAccuracyAnalysisReducerLoader &&
                  this.state.getKPIForecastAccuracyAnalysisData.length > 0 ? (
                    <>
                      {' '}
                      <ResponsiveContainer height={350} width="100%">
                        <BarChart
                          width={1000}
                          height={350}
                          data={this.state.getKPIForecastAccuracyAnalysisData}
                          margin={{
                            top: 15,
                            right: 30,
                            left: 20,
                            bottom: 0
                          }}
                          barSize={40}>
                          <XAxis
                            dataKey="ACCURACY_BIN"
                            angle={-40}
                            textAnchor="end"
                            height={120}
                            interval={0}
                            stroke="#fff">
                            {' '}
                            <Label
                              value="Accuracy"
                              style={{ textAnchor: 'middle', fill: '#fff' }}
                              // position="insideLeft"
                              position="centerBottom"
                            />
                          </XAxis>
                          <YAxis stroke="#fff">
                            <Label
                              value=" Percentage of Parts/Capex"
                              angle="-90"
                              style={{ textAnchor: 'middle', fill: '#fff' }}
                              position="insideLeft"
                            />
                          </YAxis>
                          <Tooltip content={this.TooltipFormatter} />

                          <Bar dataKey="PERCENTAGE_OF_PARTS" fill="#1870dc" />
                          <Bar dataKey="PERCENTAGE_OF_CAPEX" fill="#63ce46" />
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <>
                      {this.props.getKPIForecastAccuracyAnalysisReducerLoader ? (
                        <>
                          <div style={{ height: '400px' }}>
                            {' '}
                            <ReusableSysncLoader />
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
              ) : (
                <>
                  {!this.props.getKPIForecastAccuracyAnalysisPieChartReducerLoader &&
                  this.state.getKPIForecastAccuracyAnalysisPieChartData != '' ? (
                    <>
                      <Row gutter={16} className="mt-6">
                        <Col span={8}>
                          <ResponsiveContainer
                            width="100%"
                            height={220}
                            className="org-cap-chart-top">
                            <PieChart width={350} h cx="50%" eight={220}>
                              <Pie
                                data={this.state.getKPIForecastAccuracyAnalysisPieChartData.Table}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                // label={renderCustomizedLabel}
                                outerRadius={110}
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  innerRadius,
                                  outerRadius,

                                  value
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="white"
                                      fontSize="10"
                                      fontWeight="700"
                                      textAnchor="middle"
                                      dominantBaseline="middle">
                                      {value}%
                                    </text>
                                  );
                                }}
                                stroke="none"
                                dataKey="Percentage_of_parts">
                                {this.state.getKPIForecastAccuracyAnalysisPieChartData.Table.map(
                                  (entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                  )
                                )}
                              </Pie>
                              <Tooltip content={this.PieToolTip} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="text-center text-white mt-3 mb-3">
                            {
                              this.state.getKPIForecastAccuracyAnalysisPieChartData.Table[0]
                                .ACCURACY_BIN
                            }
                          </div>
                        </Col>
                        <Col span={8}>
                          {' '}
                          <ResponsiveContainer
                            width="100%"
                            height={220}
                            className="org-cap-chart-top">
                            <PieChart width={350} height={220}>
                              <Pie
                                data={this.state.getKPIForecastAccuracyAnalysisPieChartData.Table1}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  innerRadius,
                                  outerRadius,

                                  value
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="white"
                                      fontSize="10"
                                      fontWeight="700"
                                      textAnchor="middle"
                                      dominantBaseline="middle">
                                      {value}%
                                    </text>
                                  );
                                }}
                                // label={renderCustomizedLabel}
                                outerRadius={110}
                                fill="#8884d8"
                                stroke="none"
                                dataKey="Percentage_of_parts">
                                {this.state.getKPIForecastAccuracyAnalysisPieChartData.Table1.map(
                                  (entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                  )
                                )}
                              </Pie>
                              <Tooltip content={this.PieToolTip} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="text-center text-white mt-3 mb-3">
                            {
                              this.state.getKPIForecastAccuracyAnalysisPieChartData.Table1[0]
                                .ACCURACY_BIN
                            }
                          </div>
                        </Col>
                        <Col span={8}>
                          {' '}
                          <ResponsiveContainer
                            width="100%"
                            height={220}
                            className="org-cap-chart-top">
                            <PieChart width={350} height={220}>
                              <Pie
                                data={this.state.getKPIForecastAccuracyAnalysisPieChartData.Table2}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  innerRadius,
                                  outerRadius,

                                  value
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="white"
                                      fontSize="10"
                                      fontWeight="700"
                                      textAnchor="middle"
                                      dominantBaseline="middle">
                                      {value}%
                                    </text>
                                  );
                                }}
                                outerRadius={110}
                                fill="#8884d8"
                                stroke="none"
                                dataKey="Percentage_of_parts">
                                {this.state.getKPIForecastAccuracyAnalysisPieChartData.Table2.map(
                                  (entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                  )
                                )}
                              </Pie>
                              <Tooltip content={this.PieToolTip} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="text-center text-white mt-3 mb-3">
                            {
                              this.state.getKPIForecastAccuracyAnalysisPieChartData.Table2[0]
                                .ACCURACY_BIN
                            }
                          </div>
                        </Col>
                        <Col span={8}>
                          {' '}
                          <ResponsiveContainer
                            width="100%"
                            height={220}
                            className="org-cap-chart-top">
                            <PieChart width={350} height={220}>
                              <Pie
                                data={this.state.getKPIForecastAccuracyAnalysisPieChartData.Table3}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  innerRadius,
                                  outerRadius,

                                  value
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="white"
                                      fontSize="10"
                                      fontWeight="700"
                                      textAnchor="middle"
                                      dominantBaseline="middle">
                                      {value}%
                                    </text>
                                  );
                                }}
                                outerRadius={110}
                                fill="#8884d8"
                                stroke="none"
                                dataKey="Percentage_of_parts">
                                {this.state.getKPIForecastAccuracyAnalysisPieChartData.Table3.map(
                                  (entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                  )
                                )}
                              </Pie>
                              <Tooltip content={this.PieToolTip} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="text-center text-white mt-3 mb-3">
                            {
                              this.state.getKPIForecastAccuracyAnalysisPieChartData.Table3[0]
                                .ACCURACY_BIN
                            }
                          </div>
                        </Col>
                        <Col span={8}>
                          {' '}
                          <ResponsiveContainer
                            width="100%"
                            height={220}
                            className="org-cap-chart-top">
                            <PieChart width={350} height={220}>
                              <Pie
                                data={this.state.getKPIForecastAccuracyAnalysisPieChartData.Table4}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({
                                  cx,
                                  cy,
                                  midAngle,
                                  innerRadius,
                                  outerRadius,

                                  value
                                }) => {
                                  const RADIAN = Math.PI / 180;
                                  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                                  const x = cx + radius * Math.cos(-midAngle * RADIAN);
                                  const y = cy + radius * Math.sin(-midAngle * RADIAN);
                                  return (
                                    <text
                                      x={x}
                                      y={y}
                                      fill="white"
                                      fontSize="10"
                                      fontWeight="700"
                                      textAnchor="middle"
                                      dominantBaseline="middle">
                                      {value}%
                                    </text>
                                  );
                                }}
                                outerRadius={110}
                                fill="#8884d8"
                                stroke="none"
                                dataKey="Percentage_of_parts">
                                {this.state.getKPIForecastAccuracyAnalysisPieChartData.Table4.map(
                                  (entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                  )
                                )}
                              </Pie>
                              <Tooltip content={this.PieToolTip} />
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="text-center text-white mt-3 mb-3">
                            {
                              this.state.getKPIForecastAccuracyAnalysisPieChartData.Table4[0]
                                .ACCURACY_BIN
                            }
                          </div>
                        </Col>
                        <Col span={8} className="pl-5 mt-3">
                          <div className="analysis-tab-head">Average Monthly Demand</div>
                          <Space
                            direction="vertical"
                            className="analysis-tab"
                            size="small"
                            style={{
                              display: 'flex'
                            }}>
                            <span>
                              {' '}
                              <i
                                className="fas fa-circle total-trend mr-2"
                                style={{ color: '#0088FE' }}
                              />{' '}
                              <span className="text-white">0-5</span>
                            </span>

                            <span>
                              {' '}
                              <i
                                className="fas fa-circle total-trend mr-2"
                                style={{ color: '#DC143C' }}
                              />{' '}
                              <span className="text-white">5-10</span>
                            </span>

                            <span>
                              {' '}
                              <i
                                className="fas fa-circle total-trend mr-2"
                                style={{ color: '#00C49F' }}
                              />{' '}
                              <span className="text-white">10-30</span>
                            </span>

                            <span>
                              <i
                                className="fas fa-circle total-trend mr-2"
                                style={{ color: '#FF8042' }}
                              />{' '}
                              <span className="text-white">30-50</span>
                            </span>

                            <span>
                              <i
                                className="fas fa-circle total-trend mr-2"
                                style={{ color: '#008000' }}
                              />{' '}
                              <span className="text-white">50-100</span>
                            </span>

                            <span>
                              <i
                                className="fas fa-circle total-trend mr-2"
                                style={{ color: '#FFBB28' }}
                              />{' '}
                              <span className="text-white">100+</span>
                            </span>
                          </Space>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    <>
                      {this.props.getKPIForecastAccuracyAnalysisPieChartReducerLoader ? (
                        <>
                          <div style={{ height: '400px' }}>
                            {' '}
                            <ReusableSysncLoader />{' '}
                          </div>
                        </>
                      ) : (
                        <>
                          {' '}
                          <div style={{ height: '400px' }}>
                            <NoDataTextLoader />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </TabPane>
          </Tabs>
        </Modal>

        {/* Forcast_Accuracy_Demand Modal--end  */}
      </div>
    );
  }
}

function mapState(state) {
  return {
    getKPIForecastAccuracyAnalysisReducerLoader: state.getKPIForecastAccuracyAnalysisReducerLoader,
    getForcastAccuracyDemandData: state.getForcastAccuracyDemand,
    getForcastAccuracyMaterialData: state.getForcastAccuracyMaterial,
    getForcastAccuracyManufacturerData: state.getForcastAccuracyManufacturer,
    getForcastAccuracyOrganizationData: state.getForcastAccuracyOrganization,
    getForcastAccuracyMaterialMonthwiseData: state.getForcastAccuracyMaterialMonthwise,
    getForcastAccuracyMaterialMonthwiseLoaderReducer:
      state.getForcastAccuracyMaterialMonthwiseLoaderReducer,
    getForcastAccuracyManufMonthwiseData: state.getForcastAccuracyManufMonthwise,
    getForcastAccuracyManufMonthwiseReducerLoader:
      state.getForcastAccuracyManufMonthwiseReducerLoader,
    getForcastAccuracyOrgMonthwiseData: state.getForcastAccuracyOrgMonthwise,
    getForcastAccuracyOrgMonthwiseLoaderReducer: state.getForcastAccuracyOrgMonthwiseLoaderReducer,

    getForcastAccuracyMonthwiseData: state.getForcastAccuracyMonthwise,

    getForcastAccuracyMinMaxDateData: state.getForcastAccuracyMinMaxDate,
    getForcastAccuracyQuarterlyData: state.getForcastAccuracyQuarterly,
    getForcastAccuracyQuarterlyTrendData: state.getForcastAccuracyQuarterlyTrend,
    getForcastAccuracyMaterialQuarterlyData: state.getForcastAccuracyMaterialQuarterly,
    getForcastAccuracyManufacturerQuarterlyData: state.getForcastAccuracyManufacturerQuarterly,
    getForcastAccuracyOrganizationQuarterlyData: state.getForcastAccuracyOrganizationQuarterly,
    getForcastAccuracyMaterialQuarterlyTrendData: state.getForcastAccuracyMaterialQuarterlyTrend,
    getForcastAccuracyMaterialQuarterlyTrendReducerLoader:
      state.getForcastAccuracyMaterialQuarterlyTrendReducerLoader,
    getForcastAccuracyManufQuarterlyTrendData: state.getForcastAccuracyManufQuarterlyTrend,
    getForcastAccuracyManufQuarterlyTrendReducerLoader:
      state.getForcastAccuracyManufQuarterlyTrendReducerLoader,
    getForcastAccuracyOrgQuarterlyTrendData: state.getForcastAccuracyOrgQuarterlyTrend,
    getForcastAccuracyOrgQuarterlyTrendReducerLoader:
      state.getForcastAccuracyOrgQuarterlyTrendReducerLoader,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    getKPIForecastAccuracyAnalysisData: state.getKPIForecastAccuracyAnalysis,
    getKPIForecastAccuracyAnalysisPieChartData: state.getKPIForecastAccuracyAnalysisPieChart,
    getKPIForecastAccuracyAnalysisPieChartReducerLoader:
      state.getKPIForecastAccuracyAnalysisPieChartReducerLoader
  };
}

export default connect(mapState, {
  getForcastAccuracyOrgQuarterlyTrend,
  getUserImpersonationDetails,
  getForcastAccuracyMaterialQuarterlyTrend,
  getForcastAccuracyManufQuarterlyTrend,
  getForcastAccuracyOrganizationQuarterly,
  getForcastAccuracyManufacturerQuarterly,
  getForcastAccuracyMaterialQuarterly,
  getForcastAccuracyQuarterlyTrend,
  getForcastAccuracyQuarterly,
  getForcastAccuracyMinMaxDate,
  getForcastAccuracyMonthwise,
  getForcastAccuracyOrgMonthwise,
  getForcastAccuracyManufMonthwise,
  getForcastAccuracyMaterialMonthwise,
  getForcastAccuracyOrganization,
  getForcastAccuracyManufacturer,
  getForcastAccuracyMaterial,
  getForcastAccuracyDemand,
  getKPIForecastAccuracyAnalysisPieChart,
  getKPIForecastAccuracyAnalysis
})(ForecastAccuracy);
