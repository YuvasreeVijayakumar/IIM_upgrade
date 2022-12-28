import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ColorPicker from 'rc-color-picker';

import {
  getBackOrderRateMaterial,
  getBackOrderRateManufacturer,
  getBackOrderRateOrganization,
  getBackOrderRate,
  getBackOrderRateMaterialMonthwise,
  getBackOrderRateManufMonthwise,
  getBackOrderRateOrgMonthwise,
  getBackOrderRateMonthwise,
  getAllBackOrderRate,
  getAllBackOrderRateMonthwise,
  getAllBackOrderRateManufacturer,
  getAllBackOrderRateManufMonthwise,
  getAllBackOrderRateOrganization,
  getAllBackOrderRateOrgMonthwise,
  getUserImpersonationDetails
} from '../../../actions';

import { Row, Col, Card, Button, Modal, Tabs, Popover, Select } from 'antd';
import ReactCardFlip from 'react-card-flip';
import Odometer from 'react-odometerjs';
// import { App } from "./../DashBoard/ClipSpinner";
import { DynamicChart } from '../../../components/CustomComponents/DynamicChart';

import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

//bootstrap table import methods
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { calculation } from '../../Calculation';
import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';
import ReactDragListView from 'react-drag-listview';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const { SearchBar } = Search;
const { TabPane } = Tabs;
const { Option } = Select;

class BackOrder extends Component {
  constructor(props) {
    super(props);
    this.Imploader = this.Imploader.bind(this);
    this.changeHandler = this.changeHandler.bind(this);

    this.formatXAxis = this.formatXAxis.bind(this);
    this.exportToCSVRadialBO = this.exportToCSVRadialBO.bind(this);
    this.exportToCSVRadialBOAll = this.exportToCSVRadialBOAll.bind(this);

    this.exportToCSVRadialBOMatnr = this.exportToCSVRadialBOMatnr.bind(this);
    this.exportToCSVRadialBOOrg = this.exportToCSVRadialBOOrg.bind(this);
    this.exportToCSVRadialBOManuf = this.exportToCSVRadialBOManuf.bind(this);

    this.exportToCSVRadialAOOrgAll1 = this.exportToCSVRadialAOOrgAll1.bind(this);
    this.onclickBoAll = this.onclickBoAll.bind(this);

    this.handleModalBackAllClose = this.handleModalBackAllClose.bind(this);
    this.handleModalKeyChangeBackorderAll = this.handleModalKeyChangeBackorderAll.bind(this);
    this.OverAllBOImgAll = React.createRef();

    this.OverAllBOImg = React.createRef();
    this.BOM = React.createRef();
    this.BOO = React.createRef();
    this.BOMF = React.createRef();

    this.OAOaLL1 = React.createRef();
    this.OAOALL = React.createRef();

    this.onclickBackorderMatnr = this.onclickBackorderMatnr.bind(this);

    this.materialDescription = this.materialDescription.bind(this);
    this.exportToCSVbackManuf = this.exportToCSVbackManuf.bind(this);
    this.exportToCSVbackManufAll = this.exportToCSVbackManufAll.bind(this);

    this.exportToCSVbackmtnr = this.exportToCSVbackmtnr.bind(this);
    this.exportToCSVbacorg = this.exportToCSVbacorg.bind(this);
    this.exportToCSVbacorgAll = this.exportToCSVbacorgAll.bind(this);

    this.costformat = this.costformat.bind(this);
    this.costformatwithDollar = this.costformatwithDollar.bind(this);
    this.costformatWithout_percentage = this.handleModalKeyChangeBackorder =
      this.handleModalKeyChangeBackorder.bind(this);
    this.tblLoader = this.tblLoader.bind(this);

    this.handleModalBackClose = this.handleModalBackClose.bind(this);
    this.handleModalBack = this.handleModalBack.bind(this);
    this.handleModalBackAll = this.handleModalBackAll.bind(this);

    this.infoBo = this.infoBo.bind(this);

    this.handleFlipped = this.handleFlipped.bind(this);

    this.state = {
      color: '#82ca9d',
      chartChangeDD: 'BAR',
      org: '',
      AllFAOFLIPPED: false,
      count: 0,

      getForcastAccuracyMinMaxDateData: [],
      getAllBackOrderRateManufMonthwiseData: [],
      FADDATE1: '',
      FADDATE2: '',
      togCal: true,
      getAllTurnOverRateOrganizationData: [],
      getForcastAccuracyManufacturerQuarterlyData: [],
      getForcastAccuracyOrganizationQuarterlyData: [],
      flipped: false,
      ModalTo: false,
      ModalBo: false,
      ModalFad: false,
      getAllTurnOverRateData: [],
      getAllBackOrderRateManufacturerData: [],
      getAllBackOrderRateOrgMonthwiseData: [],
      getAllBackOrderRateData: [],
      getForcastAccuracyMonthwiseData: [],
      getBackOrderRateMonthwiseData: [],
      getForcastAccuracyOrgMonthwiseData: [],
      getForcastAccuracyManufMonthwiseData: [],
      getForcastAccuracyMaterialMonthwiseData: [],
      getBackOrderRateOrgMonthwiseData: [],
      getBackOrderRateManufMonthwiseData: [],
      getBackOrderRateMaterialMonthwiseData: [],
      getTurnOverRateManufMonthwiseData: [],
      getTurnOverRateOrgMonthwiseData: [],
      getForcastAccuracyOrganizationData: [],
      getForcastAccuracyManufacturerData: [],
      getAllBackOrderRateOrganizationData: [],
      getForcastAccuracyMaterialData: [],
      TurnoverDrillDownModal: false,
      ToMatnrAll: false,
      BackOrderRateDrillDown: false,
      FADDrillDownModal: false,
      ALLFADDrillDownModal: false,
      ALLFADMATNRACTION: false,
      ALLFADMANUFACTION: false,
      chartModal: false,
      chartModal1: false,
      getTurnOverRateMaterialMonthwiseData: [],
      backorderModal: false,
      activeKey: '1',
      AllDefaultActiveKey: '1',
      openmodal: false,
      getTurnOverRateData: [],
      getForcastAccuracyDemandData: [],
      getTurnOverRateMonthwiseData: [],
      getBackOrderRateManufacturerData: [],
      getBackOrderRateOrganizationData: [],
      getBackOrderRateData: [],
      getTurnOverRateOrganizationData: [],

      getTurnOverRateMaterialData: [],
      getBackOrderRateMaterialData: [],
      getTurnOverRateManufacturerData: [],
      getAllBackOrderRateMonthwiseData: '',

      // FADAll

      backorderRatemtnrColumn: [
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
                onClick={() => this.onclickBackorderMatnr(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'MATNR',
          text: 'Material',
          sort: true,
          headerStyle: { width: 60 },
          formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'TREND',
          text: 'Trend',
          sort: true,
          formatter: this.materialTrend,
          headerStyle: { width: 85 },

          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'BACK_ORDER_RATE',
          text: 'BackOrder Rate',
          sort: true,
          headerStyle: { width: 90 },
          formatter: this.costformat,
          align: 'center',
          headerAlign: 'center'
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
          dataField: 'organization',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 100 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 100 },
          //align: "right",
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'TOTAL_CAPEX',
          text: 'Total CapEx',
          sort: true,
          headerStyle: { width: 100 },
          //align: "right",
          formatter: calculation,
          align: 'right',
          headerAlign: 'right'
        }
      ],
      backorderRatemanufColumn: [
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
                onClick={() => this.onclickBackorderManuf(row)}>
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
          dataField: 'BACK_ORDER_RATE',
          text: 'BackOrder Rate',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformat,
          //align: "right",
          align: 'right',
          headerAlign: 'right'
        },

        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 100 },
          align: 'right',
          headerAlign: 'right'
          //align: "right",
        },
        {
          dataField: 'TotalCapEx',
          text: 'TotalCapEx',
          sort: true,
          headerStyle: { width: 100 },
          formatter: calculation,
          align: 'right',
          headerAlign: 'right'

          //align: "right",
        }
      ],

      backorderRateOrgColumn: [
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
                onClick={() => this.onclickBackorderOrg(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'ORGANIZATION',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 60 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'BACK_ORDER_RATE',
          text: 'BackOrder Rate',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformat,
          //align: "right",
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 100 },

          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'TotalCapEx',
          text: 'TotalCapEx',
          sort: true,
          headerStyle: { width: 100 },
          formatter: calculation,
          //align: "right",
          align: 'right',
          headerAlign: 'right'
        }
      ],

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

      //backorderrate flip org
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

      series: [],
      series1: [],
      series2: [],
      overallBo: [],
      OverAllMtnrTo: [],
      getAllTurnOverRateMonthwiseData: [],
      getAllTurnOverRateManufacturerData: []
    };
  }
  componentDidMount() {}
  UNSAFE_componentWillUpdate(nextProps) {
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
      this.props.getAllBackOrderRateOrgMonthwiseData !=
      nextProps.getAllBackOrderRateOrgMonthwiseData
    ) {
      if (nextProps.getAllBackOrderRateOrgMonthwiseData != 0) {
        this.setState({
          getAllBackOrderRateOrgMonthwiseData: nextProps.getAllBackOrderRateOrgMonthwiseData,
          loader: false
        });
      }
    }
    if (
      this.props.getAllBackOrderRateOrganizationData !=
      nextProps.getAllBackOrderRateOrganizationData
    ) {
      if (nextProps.getAllBackOrderRateOrganizationData != 0) {
        this.setState({
          getAllBackOrderRateOrganizationData: nextProps.getAllBackOrderRateOrganizationData
        });
      }
    }
    if (
      this.props.getAllBackOrderRateManufMonthwiseData !=
      nextProps.getAllBackOrderRateManufMonthwiseData
    ) {
      if (nextProps.getAllBackOrderRateManufMonthwiseData != 0) {
        this.setState({
          getAllBackOrderRateManufMonthwiseData: nextProps.getAllBackOrderRateManufMonthwiseData,
          loader: false
        });
      }
    }
    if (
      this.props.getAllBackOrderRateManufacturerData !=
      nextProps.getAllBackOrderRateManufacturerData
    ) {
      if (nextProps.getAllBackOrderRateManufacturerData != 0) {
        this.setState({
          getAllBackOrderRateManufacturerData: nextProps.getAllBackOrderRateManufacturerData
        });
      }
    }
    if (this.props.getAllBackOrderRateMonthwiseData != nextProps.getAllBackOrderRateMonthwiseData) {
      if (nextProps.getAllBackOrderRateMonthwiseData != 0) {
        this.setState({
          getAllBackOrderRateMonthwiseData: nextProps.getAllBackOrderRateMonthwiseData
        });
      }
    }
    if (this.props.getAllBackOrderRateData != nextProps.getAllBackOrderRateData) {
      if (nextProps.getAllBackOrderRateData != 0) {
        this.setState({
          getAllBackOrderRateData: nextProps.getAllBackOrderRateData,
          overallBo: nextProps.getAllBackOrderRateData.map((d) => d.Overall_BackOrderRate)
        });
      }
    }

    if (this.props.getBackOrderRateMonthwiseData != nextProps.getBackOrderRateMonthwiseData) {
      if (nextProps.getBackOrderRateMonthwiseData != 0) {
        this.setState({
          getBackOrderRateMonthwiseData: nextProps.getBackOrderRateMonthwiseData
        });
      } else {
        this.setState({
          getBackOrderRateMonthwiseData: []
        });
      }
    }
    if (this.props.getBackOrderRateOrgMonthwiseData != nextProps.getBackOrderRateOrgMonthwiseData) {
      if (nextProps.getBackOrderRateOrgMonthwiseData != 0) {
        this.setState({
          getBackOrderRateOrgMonthwiseData: nextProps.getBackOrderRateOrgMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getBackOrderRateOrgMonthwiseData: [],
          loader: true
        });
      }
    }
    if (
      this.props.getBackOrderRateManufMonthwiseData != nextProps.getBackOrderRateManufMonthwiseData
    ) {
      if (nextProps.getBackOrderRateManufMonthwiseData != 0) {
        this.setState({
          getBackOrderRateManufMonthwiseData: nextProps.getBackOrderRateManufMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getBackOrderRateManufMonthwiseData: [],
          loader: true
        });
      }
    }
    if (
      this.props.getBackOrderRateMaterialMonthwiseData !=
      nextProps.getBackOrderRateMaterialMonthwiseData
    ) {
      if (nextProps.getBackOrderRateMaterialMonthwiseData != 0) {
        this.setState({
          getBackOrderRateMaterialMonthwiseData: nextProps.getBackOrderRateMaterialMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getBackOrderRateMaterialMonthwiseData: [],
          loader: true
        });
      }
    }

    if (this.props.getBackOrderRateData != nextProps.getBackOrderRateData) {
      if (nextProps.getBackOrderRateData != 0) {
        this.setState({
          getBackOrderRateData: nextProps.getBackOrderRateData,
          series1: [
            nextProps.getBackOrderRateData.map((data) => data.Overall_BackOrderRate.toFixed(1))
          ]
        });
      } else {
        this.setState({
          getBackOrderRateData: []
        });
      }
    }
    if (this.props.getBackOrderRateOrganizationData != nextProps.getBackOrderRateOrganizationData) {
      if (nextProps.getBackOrderRateOrganizationData != 0) {
        this.setState({
          getBackOrderRateOrganizationData: nextProps.getBackOrderRateOrganizationData
        });
      } else {
        this.setState({
          getBackOrderRateOrganizationData: []
        });
      }
    }
    if (this.props.getBackOrderRateManufacturerData != nextProps.getBackOrderRateManufacturerData) {
      if (nextProps.getBackOrderRateManufacturerData != 0) {
        this.setState({
          getBackOrderRateManufacturerData: nextProps.getBackOrderRateManufacturerData
        });
      } else {
        this.setState({
          getBackOrderRateManufacturerData: []
        });
      }
    }
    if (this.props.getBackOrderRateMaterialData != nextProps.getBackOrderRateMaterialData) {
      if (nextProps.getBackOrderRateMaterialData != 0) {
        this.setState({
          getBackOrderRateMaterialData: nextProps.getBackOrderRateMaterialData
        });
      } else {
        this.setState({
          getBackOrderRateMaterialData: ''
        });
      }
    }
  }

  handleModalBack() {
    this.setState({
      activeKey: '1',
      backorderModal: true,
      color: '#82ca9d',

      chartChangeDD: 'LINE'
    });
  }
  handleModalBackAll() {
    this.setState({
      activeKey: '1',
      backorderModalAll: true,
      color: '#82ca9d',

      chartChangeDD: 'LINE'
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

  handleModalBackAllClose() {
    this.setState({
      backorderModalAll: false
    });
  }
  handleModalBackClose() {
    this.setState({
      backorderModal: false
    });
  }

  //backorder cardflip
  handleModalKeyChangeBackorderAll(key) {
    if (key == 2) {
      this.setState({
        activeKey: '2',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getAllBackOrderRateOrganization();
    } else {
      this.setState({
        activeKey: '1',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getAllBackOrderRateManufacturer();
    }
  }

  // {backorderrate}
  handleModalKeyChangeBackorder(key) {
    if (key == 3) {
      this.setState({
        activeKey: '3',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getBackOrderRateOrganization();
    } else if (key == 2) {
      this.setState({
        activeKey: '2',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getBackOrderRateManufacturer();
    } else {
      this.setState({
        activeKey: '1',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getBackOrderRateMaterial();
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
  materialTrend(cell) {
    if (cell == 'Up') {
      return (
        <span>
          <i className="fas fa-arrow-up tbl-trend"></i>
        </span>
      );
    } else if (cell == 'Down') {
      return (
        <span>
          <i className="fas fa-arrow-down tbl-trend "></i>
        </span>
      );
    } else if (cell == null) {
      return <span>- </span>;
    } else {
      return (
        <span>
          <i className="fas fa-arrows-alt-h  tbl-trend"></i>
        </span>
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

  onclickBoOrgAll(val) {
    this.setState({
      BoallOrg: val.ORGANIZATION,
      BoAllOrgModal: true
    });
    this.props.getAllBackOrderRateOrgMonthwise(encodeURIComponent(val.ORGANIZATION), val.LGORT);
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

  onclickBackorderMatnr(value) {
    this.setState({
      materialNo: value.MATNR,
      BOchartModal1: true,
      loader: true
    });
    this.props.getBackOrderRateMaterialMonthwise(value.MATNR, value.LGORT);
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

  onclickBackorderMatntClose() {
    this.setState({
      getBackOrderRateMaterialMonthwiseData: [],
      BOchartModal1: false
    });
  }
  onclickBackorderManuf(value) {
    this.setState({
      manuf: value.MANUF_NAME,
      BOchartModal2: true,
      loader: true
    });

    this.props.getBackOrderRateManufMonthwise(encodeURIComponent(value.MANUF_NAME), value.LGORT);
  }
  onclickBackorderManufClose() {
    this.setState({
      getBackOrderRateManufMonthwiseData: [],
      BOchartModal2: false
    });
  }
  onclickBackorderOrg(value) {
    this.setState({
      org: value.ORGANIZATION,
      BOchartModal3: true,
      loader: true
    });
    this.props.getBackOrderRateOrgMonthwise(encodeURIComponent(value.ORGANIZATION), value.LGORT);
  }
  onclickBackorderOrgClose() {
    this.setState({
      getBackOrderRateOrgMonthwiseData: [],
      BOchartModal3: false
    });
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
  onclickChartBackOrderRate() {
    this.setState({
      BackOrderRateDrillDown: false
    });
  }
  onclickChartBackOrderRateFlip() {
    this.setState({
      BackOrderRateDrillDownFlip: false
    });
  }
  onclickChartFAD() {
    this.setState({
      FADDrillDownModal: false
    });
  }
  onclickBODrillDownView() {
    this.setState({
      BackOrderRateDrillDown: true,
      color: '#82ca9d',

      chartChangeDD: 'LINE'
    });
  }
  onclickBODrillDownViewFlip() {
    this.setState({
      BackOrderRateDrillDownFlip: true,
      color: '#82ca9d',

      chartChangeDD: 'LINE'
    });
  }

  onclickALLFADDrillDown() {
    this.setState({
      ALLFADDrillDownModal: !this.state.ALLFADDrillDownModal
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

  TooltipFormatBO(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>BackOrderRate: {e.payload[0].payload.BACKORDERRATE}</b> <br />
          </span>
        </div>
      );
    }
  }

  TooltipFormatBackOrderMonthlyWise(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>BackOrderRate: {e.payload[0].payload.BACKORDERRATE}</b> <br />
          </span>
        </div>
      );
    }
  }

  exportToCSVbackManuf() {
    let csvData = this.state.getBackOrderRateManufacturerData;
    let fileName = 'BackOrder Manufacturer';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVbackManufAll() {
    let csvData = this.state.getAllBackOrderRateManufacturerData;
    let fileName = 'All Manufacturer BackOrder Rate';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVbackmtnr() {
    let csvData = this.state.getBackOrderRateMaterialData;
    let fileName = 'BackOrder Material';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVbacorg() {
    let csvData = this.state.getBackOrderRateOrganizationData;
    let fileName = 'BackOrder Organization';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVbacorgAll() {
    let csvData = this.state.getAllBackOrderRateOrganizationData;
    let fileName = 'All Organization BackOrder Rate';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVAllFADORGACTION() {
    let csvData = this.state.getForcastAccuracyOrgQuarterlyTrendData;
    let fileName = 'ForcastAccuracy Org Quarterly Trend';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVRadialBO() {
    let csvData = this.state.getBackOrderRateMonthwiseData;
    let fileName = 'BackOrderRateMonthwise';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVRadialBOAll() {
    let csvData = this.state.getAllBackOrderRateMonthwiseData;
    let fileName = 'getAllBackOrderRateMonthwiseData';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVRadialBOMatnr() {
    let csvData = this.state.getBackOrderRateMaterialMonthwiseData;
    let fileName = `${this.state.materialNo} - BackOrder Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVRadialBOOrg() {
    let csvData = this.state.getBackOrderRateOrgMonthwiseData;
    let fileName = `${this.state.org}-BackOrder Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVRadialBOManuf() {
    let csvData = this.state.getBackOrderRateManufMonthwiseData;
    let fileName = `${this.state.manuf}- BackOrder Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVRadialAOOrgAll1() {
    let csvData = this.state.getAllBackOrderRateOrgMonthwiseData;
    let fileName = `${this.state.BoallOrg}-BackOrder Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVRadialAOOrgAll() {
    let csvData = this.state.getAllBackOrderRateManufMonthwiseData;
    let fileName = `${this.state.boallmanuf}-BackOrder Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  infoBo() {
    if (this.state.ModalBo == true) {
      this.setState({
        ModalBo: false
      });
    } else {
      this.setState({
        ModalBo: true
      });
    }
  }

  handleFlipped() {
    if (this.state.flipped == true) {
      this.setState({
        flipped: false
      });
      this.props.getBackOrderRate();
    } else {
      this.setState({
        series1: [],
        flipped: true
      });
      this.props.getAllBackOrderRate();
      this.props.getAllBackOrderRateMonthwise();
      this.props.getAllBackOrderRateManufacturer();
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

  formatXAxis(tickItem) {
    return moment(tickItem).format('MMM-YYYY');
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

  onclickBoAll(val) {
    this.setState({
      boallmanuf: val.MANUF_NAME,
      Boallmodal: true,
      loader: true
    });
    this.props.getAllBackOrderRateManufMonthwise(encodeURIComponent(val.MANUF_NAME));
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

  onDragEndbackorderRatemtnrColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.backorderRatemtnrColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ backorderRatemtnrColumn: columnsCopy });
  }

  onDragEndbackorderRatemanufColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.backorderRatemanufColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ backorderRatemanufColumn: columnsCopy });
  }
  onDragEndbackorderRateOrgColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.backorderRateOrgColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ backorderRateOrgColumn: columnsCopy });
  }
  onDragEndTurnOverRateColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.TurnOverRateColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ TurnOverRateColumn: columnsCopy });
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
  onDragEndTurnOverRateManufactureColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.TurnOverRateManufactureColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ TurnOverRateManufactureColumn: columnsCopy });
  }
  onDragEndTurnOverRateOrgColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.TurnOverRateOrgColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ TurnOverRateOrgColumn: columnsCopy });
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
      getBackOrderRateData: [],
      getBackOrderRateMonthwiseData: [],
      getBackOrderRateMaterialData: [],
      flipped: false,
      series1: []
    });
    this.props.getBackOrderRate(),
      this.props.getBackOrderRateMonthwise(),
      this.props.getBackOrderRateMaterial();
  }

  render() {
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

    const pageoptions = {
      sizePerPageRenderer
    };
    //backorderrate chart =>option field
    return (
      <div>
        <Row style={{ margin: '0px' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <ReactCardFlip isFlipped={this.state.flipped} flipDirection="horizontal">
              <Card className="parts-wid  prl wid-card-height-kpi" size="small">
                {this.state.getBackOrderRateMonthwiseData != 0 ? (
                  <Row>
                    <p className="kpi-w1">
                      <i className="fas fa-cube"></i> Backorder Rate
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoBo}
                        />
                      </Popover>
                      <i className="fas fa-sync flipicon" onClick={this.handleFlipped}></i>
                    </p>
                    <Col span={12} className="kpi-chart">
                      <p className="kpi-this-month">Overall Backorder Rate</p>
                      {this.state.series1 == 0 ? (
                        ''
                      ) : (
                        <p className="kpi-series">
                          <Odometer value={this.state.series1} options={{ format: '' }} />%
                        </p>
                      )}
                      <p className="kpi-this-month">Rolling 6 Months</p>

                      <Button type="primary" onClick={this.handleModalBack}>
                        <span className="kpi-btn">
                          View More &nbsp;<i className="fas fa-arrow-right"></i>
                        </span>
                      </Button>
                    </Col>
                    <Col span={12} className="kpi-chart">
                      {' '}
                      <ResponsiveContainer height={60} width="100%">
                        <BarChart
                          width={180}
                          height={60}
                          data={this.state.getBackOrderRateMonthwiseData}
                          margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5
                          }}
                          onClick={this.onclickBODrillDownView.bind(this)}
                          barSize={20}>
                          <Tooltip content={this.TooltipFormatBackOrderMonthlyWise} />

                          <defs>
                            <linearGradient id="gradationBack" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#DE6262" />
                              <stop offset="100%" stopColor="#FFB88C" />
                            </linearGradient>
                          </defs>

                          <Bar
                            type="monotone"
                            dataKey="BACKORDERRATE"
                            stroke="#1870dc"
                            fill="#1870dc"
                            strokeWidth={2}
                            // fill="url(#gradationBack)"
                            radius={[5, 5, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      <div
                        className="turnover"
                        style={{
                          fontSize: '14px',
                          letterSpacing: '0.5px',

                          textAlign: 'center',
                          paddingTop: '55px',
                          paddingBottom: '21px'
                        }}>
                        <span>BackOrder Rate</span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <span>
                    <p className="kpi-w1">
                      <i className="fas fa-cube"></i> Backorder Rate
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoBo}
                        />
                      </Popover>
                      <i className="fas fa-sync flipicon" onClick={this.handleFlipped}></i>
                    </p>
                    <div className="kpi-loader">
                      <ReusableSysncLoader />
                    </div>
                  </span>
                )}
              </Card>

              {/* card flip backside */}

              <Card className="parts-wid  prl wid-card-height-kpi" size="small">
                {this.state.getAllBackOrderRateMonthwiseData != '' && this.state.overallBo != '' ? (
                  <Row>
                    <p className="kpi-w1">
                      <i className="fas fa-cube"></i>
                      Backorder Rate For All Material
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoBo}
                        />
                      </Popover>
                      <i className="fas fa-sync flipicon" onClick={this.handleFlipped}></i>
                    </p>

                    <Col span={12}>
                      <p className="kpi-this-month">Overall Backorder Rate</p>
                      <p className="kpi-series">
                        <Odometer value={this.state.overallBo} options={{ format: '' }} />%
                      </p>
                      <p className="kpi-this-month">Rolling 6 Months</p>

                      <Button type="primary" onClick={this.handleModalBackAll}>
                        <span className="kpi-btn">
                          View More &nbsp;<i className="fas fa-arrow-right"></i>
                        </span>
                      </Button>
                    </Col>
                    <Col
                      span={12}
                      className="kpi-chart"

                      // style={{ marginTop: "-30px" }}
                    >
                      <ResponsiveContainer height={60} width="100%">
                        <BarChart
                          width={180}
                          height={60}
                          data={this.state.getAllBackOrderRateMonthwiseData}
                          margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5
                          }}
                          onClick={this.onclickBODrillDownViewFlip.bind(this)}
                          barSize={20}>
                          <Tooltip content={this.TooltipFormatBackOrderMonthlyWise} />
                          <defs>
                            <linearGradient id="gradationback" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#FC354C" />
                              <stop offset="100%" stopColor="#d53369" />
                            </linearGradient>
                          </defs>

                          <Bar
                            type="monotone"
                            dataKey="BACKORDERRATE"
                            stroke="#FF7777"
                            fill="#FF7777"
                            radius={[5, 5, 0, 0]}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                      <div
                        className="turnover"
                        style={{
                          fontSize: '14px',
                          letterSpacing: '0.5px',

                          textAlign: 'center',
                          paddingTop: '55px',
                          paddingBottom: '21px'
                        }}>
                        <span>BackOrder Rate</span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <span>
                    <p className="kpi-w1">
                      <i className="fas fa-cube"></i>
                      Backorder Rate For All Material
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoBo}
                        />
                      </Popover>
                      <i className="fas fa-sync flipicon" onClick={this.handleFlipped}></i>
                    </p>
                    <div className="kpi-loader">
                      <ReusableSysncLoader />
                    </div>
                  </span>
                )}
              </Card>
            </ReactCardFlip>
          </Col>
        </Row>
        {/* ################################################################################################ */}

        {/* //newcode */}

        {/* {backorderModal} */}

        {/* kpi info BO */}
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>BackOrderRate - Description</div>}
          className="Intervaltimeline"
          visible={this.state.ModalBo}
          onCancel={this.infoBo}>
          <div>
            <p>
              <strong>BackOrderRate:</strong>
            </p>
            <ul>
              <li>
                BackOrder rate is a measurement of the number of orders a company cannot fulfill
                when a customer places an order.
              </li>
              <div className="kpibo-img" />
            </ul>
          </div>
        </Modal>

        {/* BackOrderRateDrilldown Chart-start */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Monthly Wise BackOrderRate
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.BackOrderRateDrillDown}
          onCancel={this.onclickChartBackOrderRate.bind(this)}>
          <Row className="mt-2 v4">
            <div className="head-title">
              {' '}
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right "
                onClick={this.exportToCSVRadialBO}>
                <i className="fas fa-file-excel" />
              </Button>
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={() =>
                  exportComponentAsPNG(this.OverAllBOImg, 'Back Order Rate- Monthwise')
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

            <div ref={this.OverAllBOImg}>
              <DynamicChart
                stroke={this.state.color}
                fill={this.state.color}
                chart={this.state.chartChangeDD}
                formatXAxis={this.formatXAxis}
                data={this.state.getBackOrderRateMonthwiseData}
                Ydatakey="BACKORDERRATE"
                Xdatakey="DS"
                Xvalue=" Date"
                Yvalue="BackOrder Rate"
                Tooltip={this.TooltipFormatBackOrderMonthlyWise}
                Legend={
                  <div className="float-left pl-40">
                    <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                      {/* <ColorPicker
                        animation="slide-up"
                        color={this.state.color}
                        onChange={this.changeHandler}
                        className="some-class"
                      /> */}
                      <span className="legend-cls"> -BackOrderRate</span>
                    </Popover>
                  </div>
                }
              />
            </div>
          </Row>
        </Modal>
        {/* end */}

        {/* {backorderModal material} */}
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
          visible={this.state.BOchartModal1}
          onCancel={this.onclickBackorderMatntClose.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getBackOrderRateMaterialMonthwiseReducerLoader &&
            this.state.getBackOrderRateMaterialMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialBOMatnr}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.BOM,
                        `${this.state.materialNo}-BackOrder Rate Chart`
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

                <div ref={this.BOM}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getBackOrderRateMaterialMonthwiseData}
                    Ydatakey="BACKORDERRATE"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="BackOrder Rate"
                    Tooltip={this.TooltipFormatBO}
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
                          <span className="legend-cls"> -BackOrderRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getBackOrderRateMaterialMonthwiseReducerLoader ? (
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

        {/* {backorderModal Organiaation} */}
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
          visible={this.state.BOchartModal3}
          onCancel={this.onclickBackorderOrgClose.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getBackOrderRateOrgMonthwiseReducerLoader &&
            this.state.getBackOrderRateOrgMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialBOOrg}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(this.BOO, `${this.state.org}-BackOrder Rate Chart`)
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

                <div ref={this.BOO}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getBackOrderRateOrgMonthwiseData}
                    Ydatakey="BACKORDERRATE"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="BackOrder Rate"
                    Tooltip={this.TooltipFormatBO}
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
                          <span className="legend-cls"> -BackOrderRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getBackOrderRateOrgMonthwiseReducerLoader ? (
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

        {/* {backorderModal Manufacturer} */}
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
          visible={this.state.BOchartModal2}
          onCancel={this.onclickBackorderManufClose.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getBackOrderRateManufMonthwiseReducerLoader &&
            this.state.getBackOrderRateManufMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialBOManuf}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(this.BOMF, `${this.state.manuf}- BackOrder Rate Chart`)
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

                <div ref={this.BOMF}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getBackOrderRateManufMonthwiseData}
                    Ydatakey="BACKORDERRATE"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="BackOrder Rate"
                    Tooltip={this.TooltipFormatBO}
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
                          <span className="legend-cls"> -BackOrderRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getBackOrderRateManufMonthwiseReducerLoader ? (
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
        {/* backoreder All  */}
        <Modal
          width="70%"
          footer={null}
          className="modal-turnover"
          visible={this.state.backorderModalAll}
          onCancel={this.handleModalBackAllClose}
          title={
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <span className="float-left mr-2">
                  <i className="fas fa-cube"></i>
                </span>
                <span className="tab-head">All BackOrder Rate</span>
              </Col>
            </Row>
          }>
          <Tabs
            defaultActiveKey={'1'}
            activeKey={this.state.activeKey}
            onChange={this.handleModalKeyChangeBackorderAll}>
            <TabPane tab="Manufacturer" key="1">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getAllBackOrderRateManufacturerData}
                  columns={this.state.BOAllManuf}
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
                          {this.state.getAllBackOrderRateManufacturerData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbackManufAll}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbackManufAll}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* s */}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndBOAllManuf.bind(this)}
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
            <TabPane tab="Organization" key="2">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getAllBackOrderRateOrganizationData}
                  columns={this.state.BOAllOrg}
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
                          {this.state.getAllBackOrderRateOrganizationData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbacorgAll}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbacorgAll}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndBOAllOrg.bind(this)}
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
        </Modal>

        <Modal
          width="80%"
          footer={null}
          className="modal-turnover"
          visible={this.state.backorderModal}
          onCancel={this.handleModalBackClose}
          title={
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <span className="float-left mr-2">
                  <i className="fas fa-cube"></i>
                </span>
                <span className="tab-head">BackOrder Rate</span>
              </Col>
            </Row>
          }>
          <Tabs
            defaultActiveKey={'1'}
            activeKey={this.state.activeKey}
            onChange={this.handleModalKeyChangeBackorder}>
            <TabPane tab="Material" key="1">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getBackOrderRateMaterialData}
                  columns={this.state.backorderRatemtnrColumn}
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
                          {this.state.getBackOrderRateMaterialData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbackmtnr}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbackmtnr}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndbackorderRatemtnrColumn.bind(this)}
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
                  data={this.state.getBackOrderRateManufacturerData}
                  columns={this.state.backorderRatemanufColumn}
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
                          {this.state.getBackOrderRateManufacturerData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbackManuf}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbackManuf}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndbackorderRatemanufColumn.bind(this)}
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
                  data={this.state.getBackOrderRateOrganizationData}
                  columns={this.state.backorderRateOrgColumn}
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
                          {this.state.getBackOrderRateOrganizationData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbacorg}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbacorg}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndbackorderRateOrgColumn.bind(this)}
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
        </Modal>

        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Manufacturer- {this.state.boallmanuf}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.Boallmodal}
          onCancel={this.onclickBoAllclose.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getAllBackOrderRateManufMonthwiseReducerLoader &&
            this.state.getAllBackOrderRateManufMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialAOOrgAll.bind(this)}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.OAOALL,
                        `${this.state.boallmanuf}-BackOrder Rate Chart`
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

                <div ref={this.OAOALL}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getAllBackOrderRateManufMonthwiseData}
                    Ydatakey="BACKORDERRATE"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="BackOrder Rate"
                    Tooltip={this.TooltipFormatBackOrderMonthlyWise}
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
                          <span className="legend-cls"> -BackOrderRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getAllBackOrderRateManufMonthwiseReducerLoader ? (
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

        {/* //working */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Organization- {this.state.BoallOrg}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.BoAllOrgModal}
          onCancel={this.onclickBoAllOrgclose.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getAllBackOrderRateOrgMonthwiseReducerLoader &&
            this.state.getAllBackOrderRateOrgMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialAOOrgAll1}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.OAOaLL1,
                        `${this.state.BoallOrg}-BackOrder Rate Chart`
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

                <div ref={this.OAOaLL1}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getAllBackOrderRateOrgMonthwiseData}
                    Ydatakey="BACKORDERRATE"
                    Xdatakey="DS"
                    Xvalue=" Date"
                    Yvalue="BackOrder Rate"
                    Tooltip={this.TooltipFormatBackOrderMonthlyWise}
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
                          <span className="legend-cls"> -BackOrderRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getAllBackOrderRateOrgMonthwiseReducerLoader ? (
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

        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Material Wise BackOrderRate
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.BackOrderRateDrillDownFlip}
          onCancel={this.onclickChartBackOrderRateFlip.bind(this)}>
          <Row className="mt-2 v4">
            <div className="head-title">
              {' '}
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right "
                onClick={this.exportToCSVRadialBOAll}>
                <i className="fas fa-file-excel" />
              </Button>
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={() =>
                  exportComponentAsPNG(this.OverAllBOImgAll, 'Back Order Rate- Materialwise')
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

            <div ref={this.OverAllBOImgAll}>
              <DynamicChart
                stroke={this.state.color}
                fill={this.state.color}
                chart={this.state.chartChangeDD}
                formatXAxis={this.formatXAxis}
                data={this.state.getAllBackOrderRateMonthwiseData}
                Ydatakey="BACKORDERRATE"
                Xdatakey="DS"
                Xvalue=" Date"
                Yvalue="BackOrder Rate"
                Tooltip={this.TooltipFormatBackOrderMonthlyWise}
                Legend={
                  <div className="float-left pl-40">
                    <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                      {/* <ColorPicker
                        animation="slide-up"
                        color={this.state.color}
                        onChange={this.changeHandler}
                        className="some-class"
                      /> */}
                      <span className="legend-cls"> -BackOrderRate</span>
                    </Popover>
                  </div>
                }
              />
            </div>
          </Row>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  return {
    getBackOrderRateMaterialData: state.getBackOrderRateMaterial,
    getBackOrderRateManufacturerData: state.getBackOrderRateManufacturer,
    getBackOrderRateOrganizationData: state.getBackOrderRateOrganization,
    getBackOrderRateData: state.getBackOrderRate,
    getBackOrderRateMaterialMonthwiseData: state.getBackOrderRateMaterialMonthwise,
    getBackOrderRateMaterialMonthwiseReducerLoader:
      state.getBackOrderRateMaterialMonthwiseReducerLoader,
    getBackOrderRateManufMonthwiseData: state.getBackOrderRateManufMonthwise,
    getBackOrderRateManufMonthwiseReducerLoader: state.getBackOrderRateManufMonthwiseReducerLoader,
    getBackOrderRateOrgMonthwiseData: state.getBackOrderRateOrgMonthwise,
    getBackOrderRateOrgMonthwiseReducerLoader: state.getBackOrderRateOrgMonthwiseReducerLoader,
    getBackOrderRateMonthwiseData: state.getBackOrderRateMonthwise,

    getAllBackOrderRateData: state.getAllBackOrderRate,
    getAllBackOrderRateMonthwiseData: state.getAllBackOrderRateMonthwise,
    getAllBackOrderRateManufacturerData: state.getAllBackOrderRateManufacturer,
    getAllBackOrderRateManufMonthwiseData: state.getAllBackOrderRateManufMonthwise,
    getAllBackOrderRateManufMonthwiseReducerLoader:
      state.getAllBackOrderRateManufMonthwiseReducerLoader,
    getAllBackOrderRateOrganizationData: state.getAllBackOrderRateOrganization,
    getAllBackOrderRateOrgMonthwiseData: state.getAllBackOrderRateOrgMonthwise,
    getAllBackOrderRateOrgMonthwiseReducerLoader:
      state.getAllBackOrderRateOrgMonthwiseReducerLoader,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails
  };
}

export default connect(mapState, {
  getAllBackOrderRateOrgMonthwise,
  getUserImpersonationDetails,
  getAllBackOrderRateOrganization,
  getAllBackOrderRateManufMonthwise,
  getAllBackOrderRateManufacturer,
  getAllBackOrderRateMonthwise,
  getAllBackOrderRate,
  getBackOrderRateMonthwise,
  getBackOrderRateOrgMonthwise,
  getBackOrderRateManufMonthwise,
  getBackOrderRateMaterialMonthwise,
  getBackOrderRate,
  getBackOrderRateOrganization,
  getBackOrderRateManufacturer,
  getBackOrderRateMaterial
})(BackOrder);
