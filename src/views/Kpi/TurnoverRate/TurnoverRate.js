import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import ColorPicker from 'rc-color-picker';

import {
  getTurnOverRate,
  getTurnOverRateMaterial,
  getTurnOverRateManufacturer,
  getTurnOverRateOrganization,
  getTurnOverRateMaterialMonthwise,
  getTurnOverRateMonthwise,
  getTurnOverRateOrgMonthwise,
  getTurnOverRateManufMonthwise,
  getAllTurnOverRate,
  getAllTurnOverRateMonthwise,
  getAllTurnOverRateManufacturer,
  getAllTurnOverRateOrganization,
  getAllTurnOverRateManufMonthwise,
  getAllTurnOverRateOrgMonthwise,
  getUserImpersonationDetails
} from '../../../actions';
import { calculation } from '../../Calculation';

import { Row, Col, Card, Button, Modal, Tabs, Popover, Select } from 'antd';
import ReactCardFlip from 'react-card-flip';
import Odometer from 'react-odometerjs';
// import { App } from "./../DashBoard/ClipSpinner";

import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';

//bootstrap table import methods
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';
import ReactDragListView from 'react-drag-listview';
import { DynamicChart } from '../../../components/CustomComponents/DynamicChart';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { Option } = Select;
const { SearchBar } = Search;
const { TabPane } = Tabs;

class Kpi extends Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.Imploader = this.Imploader.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);

    this.exportToCsvToAll = this.exportToCsvToAll.bind(this);
    this.exportToCSVRadialTO = this.exportToCSVRadialTO.bind(this);

    this.exportToCSVTOAllORG = this.exportToCSVTOAllORG.bind(this);

    this.exportToCSVRadialTOManuf = this.exportToCSVRadialTOManuf.bind(this);
    this.exportToCSVRadialTOOrg = this.exportToCSVRadialTOOrg.bind(this);
    this.exportToCSVRadialTOMatnr = this.exportToCSVRadialTOMatnr.bind(this);

    this.OverAllAOImg = React.createRef();
    this.OverAllTo = React.createRef();
    this.TOALLORG = React.createRef();
    this.TOAllManufPng = React.createRef();
    this.TOMF = React.createRef();
    this.TOO = React.createRef();
    this.TOM = React.createRef();
    this.turnoverChartOnclick = this.turnoverChartOnclick.bind(this);
    this.onclickChartClose = this.onclickChartClose.bind(this);
    this.onclickChartCloseForTurnOverOrg = this.onclickChartCloseForTurnOverOrg.bind(this);
    this.onclickChartTurnOverrate = this.onclickChartTurnOverrate.bind(this);
    this.onclickHarvestDD = this.onclickHarvestDD.bind(this);
    this.onclickTurnOverOrg = this.onclickTurnOverOrg.bind(this);
    this.onclickTurnOverManuf = this.onclickTurnOverManuf.bind(this);

    this.onclickChartCloseForTurnOverManuf = this.onclickChartCloseForTurnOverManuf.bind(this);
    this.materialDescription = this.materialDescription.bind(this);

    this.exportToCSVTOManufAll = this.exportToCSVTOManufAll.bind(this);
    this.exportToCSVTOAllManuf = this.exportToCSVTOAllManuf.bind(this);

    this.exportToCSVbaTOrgAll = this.exportToCSVbaTOrgAll.bind(this);
    this.costformat = this.costformat.bind(this);
    this.costformatwithDollar = this.costformatwithDollar.bind(this);
    this.costformatWithout_percentage = this.costformatWithout_percentage.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleclose = this.handleclose.bind(this);

    this.handleModalKeyChange = this.handleModalKeyChange.bind(this);

    this.tblLoader = this.tblLoader.bind(this);
    this.exportToCSVTurnoverManuf = this.exportToCSVTurnoverManuf.bind(this);
    this.exportToCSVTurnoverOrg = this.exportToCSVTurnoverOrg.bind(this);

    this.exportToCSVTurnoverMatr = this.exportToCSVTurnoverMatr.bind(this);

    this.infoTO = this.infoTO.bind(this);

    this.state = {
      color: '#82ca9d',

      chartChangeDD: 'LINE',
      org: '',
      AllFAOFLIPPED: false,
      count: 0,

      getForcastAccuracyMinMaxDateData: [],
      FADDATE1: '',
      FADDATE2: '',
      togCal: true,
      getAllTurnOverRateOrganizationData: [],

      flipped: false,
      ModalTo: false,
      ModalBo: false,
      ModalFad: false,
      getAllTurnOverRateData: [],

      getTurnOverRateManufMonthwiseData: [],
      getTurnOverRateOrgMonthwiseData: [],

      TurnoverDrillDownModal: false,
      ToMatnrAll: false,
      BackOrderRateDrillDown: false,

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

      getTurnOverRateMonthwiseData: [],

      getTurnOverRateOrganizationData: [],

      getTurnOverRateMaterialData: [],

      getTurnOverRateManufacturerData: [],

      TurnOverRateColumn: [
        //chart view datafield
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
                onClick={() => this.onclickHarvestDD(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        //
        {
          dataField: 'matnr',
          text: 'Material',
          sort: true,
          headerStyle: { width: 40 },
          formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 35 },
          // formatter: this.materialDescription,
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'tor',
          text: 'TurnOver Rate',
          sort: true,
          headerStyle: { width: 60 },
          formatter: this.costformatWithout_percentage,
          //align: "right",
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'MANUF_NAME',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 65 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'organization',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 55 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 65 },
          //align: "right",align:'right',
          headerAlign: 'center',
          align: 'center'
        },
        {
          dataField: 'TOTAL_CAPEX',
          text: 'Total CapEx',
          sort: true,
          headerStyle: { width: 55 },
          //align: "right",
          formatter: calculation,
          align: 'right',
          headerAlign: 'right'
        }
      ],

      TurnOverRateManufactureColumn: [
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
                onClick={() => this.onclickTurnOverManuf(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'Manuf_Name',
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
          headerStyle: { width: 40 },
          // formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'TOR',
          text: 'TurnOver Rate',
          sort: true,
          headerStyle: { width: 70 },
          formatter: this.costformatWithout_percentage,
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
          align: 'right',
          headerAlign: 'right'
        }
      ],
      //data
      TurnOverRateOrgColumn: [
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
                onClick={() => this.onclickTurnOverOrg(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
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
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 60 },
          align: 'left',
          headerAlign: 'left'

          // formatter: this.materialDescription,
        },
        {
          dataField: 'TOR',
          text: 'TurnOver Rate',
          sort: true,
          headerStyle: { width: 60 },
          formatter: this.costformatWithout_percentage,
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
          align: 'right',
          headerAlign: 'right'
        }
      ],

      TOALLmanuf: [
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
                onClick={() => this.onclickToAllMtnr(row)}>
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
          align: 'left',
          headerAlign: 'left',

          headerStyle: { width: 50 }
          // formatter: this.costformatWithout_percentage,
        },
        {
          dataField: 'MEAN_INVENTORY_COST',
          text: 'Mean Inventory Cost',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformatwithDollar,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'CONSUMPTION_COST',
          text: 'Consumption Cost',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformatwithDollar,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'TOR',
          text: 'TurnOverRate',
          sort: true,
          headerStyle: { width: 100 },
          // formatter: this.costformatWithout_percentage,align:'right',
          headerAlign: 'right',
          align: 'right'
        }
      ],
      TOALLmtnrOrg: [
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
                onClick={() => this.onclickToAllorg(row)}>
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
          headerStyle: { width: 50 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MEAN_INVENTORY_COST',
          text: 'Mean Inventory Cost',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformatwithDollar,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'CONSUMPTION_COST',
          text: 'Consumption Cost',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformatwithDollar,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'TOR',
          text: 'TurnOverRate',
          sort: true,
          headerStyle: { width: 100 },
          // formatter: this.costformatWithout_percentage,align:'right',
          headerAlign: 'right'
        }
      ],

      series: [],
      series1: [],
      series2: [],

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
    if (this.props.getTurnOverRateMonthwiseData != nextProps.getTurnOverRateMonthwiseData) {
      if (nextProps.getTurnOverRateMonthwiseData != 0) {
        this.setState({
          getTurnOverRateMonthwiseData: nextProps.getTurnOverRateMonthwiseData
        });
      } else {
        this.setState({
          getTurnOverRateMonthwiseData: []
        });
      }
    }

    if (
      this.props.getAllTurnOverRateOrgMonthwiseData != nextProps.getAllTurnOverRateOrgMonthwiseData
    ) {
      if (nextProps.getAllTurnOverRateOrgMonthwiseData != 0) {
        this.setState({
          getAllTurnOverRateOrgMonthwiseData: nextProps.getAllTurnOverRateOrgMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getAllTurnOverRateOrgMonthwiseData: [],
          loader: true
        });
      }
    }
    if (
      this.props.getAllTurnOverRateManufMonthwiseData !=
      nextProps.getAllTurnOverRateManufMonthwiseData
    ) {
      if (nextProps.getAllTurnOverRateManufMonthwiseData != 0) {
        this.setState({
          getAllTurnOverRateManufMonthwiseData: nextProps.getAllTurnOverRateManufMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getAllTurnOverRateManufMonthwiseData: [],
          loader: true
        });
      }
    }
    if (
      this.props.getAllTurnOverRateOrganizationData != nextProps.getAllTurnOverRateOrganizationData
    ) {
      if (nextProps.getAllTurnOverRateOrganizationData != 0) {
        this.setState({
          getAllTurnOverRateOrganizationData: nextProps.getAllTurnOverRateOrganizationData
        });
      }
    }
    if (
      this.props.getAllTurnOverRateManufacturerData != nextProps.getAllTurnOverRateManufacturerData
    ) {
      if (nextProps.getAllTurnOverRateManufacturerData != 0) {
        this.setState({
          getAllTurnOverRateManufacturerData: nextProps.getAllTurnOverRateManufacturerData
        });
      }
    }
    if (this.props.getAllTurnOverRateMonthwiseData != nextProps.getAllTurnOverRateMonthwiseData) {
      if (nextProps.getAllTurnOverRateMonthwiseData != 0) {
        this.setState({
          getAllTurnOverRateMonthwiseData: nextProps.getAllTurnOverRateMonthwiseData
        });
      } else {
        this.setState({
          getAllTurnOverRateMonthwiseData: []
        });
      }
    }
    if (this.props.getAllTurnOverRateData != nextProps.getAllTurnOverRateData) {
      this.setState({
        OverAllMtnrTo: nextProps.getAllTurnOverRateData.map((d) => d.TOR.toFixed(1))
      });
    }

    if (
      this.props.getTurnOverRateManufMonthwiseData != nextProps.getTurnOverRateManufMonthwiseData
    ) {
      if (nextProps.getTurnOverRateManufMonthwiseData != 0) {
        this.setState({
          getTurnOverRateManufMonthwiseData: nextProps.getTurnOverRateManufMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getTurnOverRateManufMonthwiseData: [],
          loader: true
        });
      }
    }
    if (this.props.getTurnOverRateOrgMonthwiseData != nextProps.getTurnOverRateOrgMonthwiseData) {
      if (nextProps.getTurnOverRateOrgMonthwiseData != 0) {
        this.setState({
          getTurnOverRateOrgMonthwiseData: nextProps.getTurnOverRateOrgMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getTurnOverRateOrgMonthwiseData: [],
          loader: true
        });
      }
    }

    if (this.props.getTurnOverRateMonthwiseData != nextProps.getTurnOverRateMonthwiseData) {
      if (nextProps.getTurnOverRateMonthwiseData != 0) {
        this.setState({
          getTurnOverRateMonthwiseData: nextProps.getTurnOverRateMonthwiseData
        });
      } else {
        this.setState({
          getTurnOverRateMonthwiseData: []
        });
      }
    }
    if (
      this.props.getTurnOverRateMaterialMonthwiseData !=
      nextProps.getTurnOverRateMaterialMonthwiseData
    ) {
      if (nextProps.getTurnOverRateMaterialMonthwiseData != 0) {
        this.setState({
          getTurnOverRateMaterialMonthwiseData: nextProps.getTurnOverRateMaterialMonthwiseData,
          loader: false
        });
      } else {
        this.setState({
          getTurnOverRateMaterialMonthwiseData: [],
          loader: true
        });
      }
    }
    if (this.props.getTurnOverRateOrganizationData != nextProps.getTurnOverRateOrganizationData) {
      if (nextProps.getTurnOverRateOrganizationData != 0) {
        this.setState({
          getTurnOverRateOrganizationData: nextProps.getTurnOverRateOrganizationData,
          isDataFetched: true
        });
      } else {
        this.setState({
          getTurnOverRateOrganizationData: [],
          isDataFetched: false
        });
      }
    }

    if (this.props.getTurnOverRateManufacturerData != nextProps.getTurnOverRateManufacturerData) {
      if (nextProps.getTurnOverRateManufacturerData != 0) {
        this.setState({
          getTurnOverRateManufacturerData: nextProps.getTurnOverRateManufacturerData,
          isDataFetched: true
        });
      } else {
        this.setState({
          getTurnOverRateManufacturerData: [],
          isDataFetched: false
        });
      }
    }
    if (this.props.getTurnOverRateMaterialData != nextProps.getTurnOverRateMaterialData) {
      if (nextProps.getTurnOverRateMaterialData != 0) {
        this.setState({
          getTurnOverRateMaterialData: nextProps.getTurnOverRateMaterialData,
          isDataFetched: true
        });
      } else {
        this.setState({
          getTurnOverRateMaterialData: [],
          isDataFetched: false
        });
      }
    }
    if (this.props.getTurnOverRateData != nextProps.getTurnOverRateData) {
      if (nextProps.getTurnOverRateData != 0) {
        this.setState({
          getTurnOverRateData: nextProps.getTurnOverRateData,
          series: [nextProps.getTurnOverRateData.map((data) => data.TurnOverRate.toFixed(1))]
        });
      } else {
        this.setState({
          getTurnOverRateData: [],
          series: []
        });
      }
    }
  }
  handleModal() {
    this.setState({
      activeKey: '1',
      openmodal: true,
      color: '#82ca9d',

      chartChangeDD: 'LINE'
    });
  }
  handleclose() {
    this.setState({
      openmodal: false
    });
  }

  handleModalBack() {
    this.setState({
      activeKey: '1',
      backorderModal: true
    });
  }
  handleModalBackAll() {
    this.setState({
      activeKey: '1',
      backorderModalAll: true
    });
  }
  handleModalBackToMatnrAll() {
    this.setState({
      ToallActiveKey: '1',
      ToAllViewMore: true,
      color: '#82ca9d',

      chartChangeDD: 'LINE'
    });
  }
  handleModalBackToMatnrAllClose() {
    this.setState({
      ToallActiveKey: '1',
      ToAllViewMore: false
    });
  }

  handleModalKeyChange(key) {
    if (key == 3) {
      this.setState({
        activeKey: '3',
        isDataFetched: false,
        newResultLength: '',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getTurnOverRateOrganization();
    } else if (key == 2) {
      this.setState({
        activeKey: '2',
        isDataFetched: false,
        newResultLength: '',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });

      this.props.getTurnOverRateManufacturer();
    } else {
      this.setState({
        activeKey: '1',
        isDataFetched: false,
        newResultLength: '',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getTurnOverRateMaterial();
    }
  }

  //turnoverrate matnr all
  handleModalKeyChangeTOMatnrAll(key) {
    if (key == 2) {
      this.setState({
        ToallActiveKey: '2',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getAllTurnOverRateOrganization();
    } else {
      this.setState({
        ToallActiveKey: '1',
        newResultLength: '',
        isDataFetched: false,
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getAllTurnOverRateManufacturer();
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
  onclickHarvestDD(matnr) {
    this.setState({
      materialNo: matnr.matnr,
      chartModal: true,
      loader: true
    });
    this.props.getTurnOverRateMaterialMonthwise(matnr.matnr, matnr.LGORT);
  }

  onclickToAllMtnr(val) {
    this.setState({
      Tomanufname: val.MANUF_NAME,
      ToAllmtnrAction: true,
      loader: true
    });
    this.props.getAllTurnOverRateManufMonthwise(encodeURIComponent(val.MANUF_NAME), val.LGORT);
  }
  onclickToAllorg(val) {
    this.setState({
      ToOrgName: val.ORGANIZATION,
      ToAllOrgAction: true,
      loader: true
    });
    this.props.getAllTurnOverRateOrgMonthwise(encodeURIComponent(val.ORGANIZATION), val.LGORT);
  }

  oncloseToAllAction() {
    this.setState({
      ToAllmtnrAction: false
    });
  }
  oncloseToAllOrgAction() {
    this.setState({ ToAllOrgAction: false });
  }

  onclickTurnOverOrg(matnr) {
    this.setState({
      org: matnr.organization,
      chartModal1: true,
      loader: true
    });
    this.props.getTurnOverRateOrgMonthwise(encodeURIComponent(matnr.organization), matnr.LGORT);
  }

  onclickTurnOverManuf(matnr) {
    this.setState({
      manuf: matnr.Manuf_Name,
      chartModal2: true,
      loader: true
    });
    this.props.getTurnOverRateManufMonthwise(encodeURIComponent(matnr.Manuf_Name), matnr.LGORT);
  }

  onclickChartClose() {
    this.setState({
      getTurnOverRateMaterialMonthwiseData: [],
      chartModal: false
    });
  }

  onclickChartCloseForTurnOverOrg() {
    this.setState({
      getTurnOverRateOrgMonthwiseData: [],
      chartModal1: false
    });
  }

  onclickChartCloseForTurnOverManuf() {
    this.setState({
      getTurnOverRateManufMonthwiseData: [],
      chartModal2: false
    });
  }
  onclickChartTurnOverrate() {
    this.setState({
      TurnoverDrillDownModal: false
    });
  }
  onclickToAllMatnr() {
    this.setState({
      ToMatnrAll: false
    });
  }

  onclickToDrillDownView() {
    this.setState({
      TurnoverDrillDownModal: true,
      color: '#82ca9d',
      chartChangeDD: 'AREA'
    });
  }
  onclickDDAllTo() {
    this.setState({
      ToMatnrAll: true,
      color: '#82ca9d',
      chartChangeDD: 'AREA'
    });
  }
  turnoverChartOnclick() {}
  TooltipFormat(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.MONTHLY).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>TurnOverRate : {e.payload[0].payload.TOR}</b> <br />
          </span>
        </div>
      );
    }
  }

  TooltipFormatTurnoverrateMonthlyWise(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.MONTHLY).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>TurnOverRate : {e.payload[0].payload.TOR}</b> <br />
          </span>
        </div>
      );
    }
  }
  TooltipFormatTOALL(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.MONTHLY).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>TurnOverRate : {e.payload[0].payload.TOR}</b> <br />
          </span>
        </div>
      );
    }
  }

  TooltipFormatTOALLAction(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.MONTHLY).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>TurnOverRate : {e.payload[0].payload.TOR}</b> <br />
          </span>
        </div>
      );
    }
  }

  exportToCSVTurnoverMatr() {
    let csvData = this.state.getTurnOverRateMaterialData;
    let fileName = 'TurnOverRate Material';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVTurnoverManuf() {
    let csvData = this.state.getTurnOverRateManufacturerData;
    let fileName = 'TurnOver Manufacturer';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVTurnoverOrg() {
    let csvData = this.state.getTurnOverRateOrganizationData;
    let fileName = 'TurnOver Organization';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVTOManufAll() {
    let csvData = this.state.getAllTurnOverRateManufacturerData;
    let fileName = 'All Manufacturer TurnOverRate';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVTOAllManuf() {
    let csvData = this.state.getAllTurnOverRateManufMonthwiseData;
    let fileName = `${this.state.Tomanufname}-TurnOverRate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVbaTOrgAll() {
    let csvData = this.state.getAllTurnOverRateOrganizationData;
    let fileName = 'All Organization TurnOverRate';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCsvToAll() {
    let csvData = this.state.getAllTurnOverRateMonthwiseData;
    let fileName = 'getAllTurnOverRateMonthwiseData';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVRadialTO() {
    let csvData = this.state.getTurnOverRateMonthwiseData;
    let fileName = 'TurnOverRateMonthwise';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVTOAllORG() {
    let csvData = this.state.getAllTurnOverRateOrgMonthwiseData;
    let fileName = `${this.state.ToOrgName}- TurnOverRate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVRadialTOManuf() {
    let csvData = this.state.getTurnOverRateManufMonthwiseData;
    let fileName = `${this.state.manuf}-  TurnOver Rate Wise`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVRadialTOOrg() {
    let csvData = this.state.getTurnOverRateOrgMonthwiseData;
    let fileName = `${this.state.org}-TurnOver Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVRadialTOMatnr() {
    let csvData = this.state.getTurnOverRateMaterialMonthwiseData;
    let fileName = `${this.state.materialNo}-TurnOver Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  infoTO() {
    if (this.state.ModalTo == true) {
      this.setState({
        ModalTo: false
      });
    } else {
      this.setState({
        ModalTo: true
      });
    }
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
  handleFlippedTOALL() {
    if (this.state.TOAllFlipped == true) {
      this.setState({
        TOAllFlipped: false
      });
      this.props.getTurnOverRate();
    } else {
      this.setState({
        series: [],
        TOAllFlipped: true
      });
      this.props.getAllTurnOverRate(),
        this.props.getAllTurnOverRateMonthwise(),
        this.props.getAllTurnOverRateManufacturer();
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

  onDragEndTurnOverRateColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.TurnOverRateColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ TurnOverRateColumn: columnsCopy });
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
      getTurnOverRateData: [],
      getTurnOverRateMaterialData: [],
      getTurnOverRateMonthwiseData: [],
      series: [],
      TOAllFlipped: false
    });
    this.props.getTurnOverRate(),
      this.props.getTurnOverRateMaterial(),
      this.props.getTurnOverRateMonthwise();
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

    return (
      <div>
        <Row style={{ margin: '0px' }}>
          <Col xs={24} sm={24} md={24} lg={24} xl={24}>
            <ReactCardFlip isFlipped={this.state.TOAllFlipped} flipDirection="horizontal">
              <Card className="parts-wid  prl wid-card-height-kpi" size="small">
                {' '}
                {this.state.getTurnOverRateMonthwiseData != 0 ? (
                  <Row>
                    <Row className="kpi-to">
                      {' '}
                      <p className="kpi-w1">
                        <i className="fas fa-chart-pie"></i> TurnOver Rate
                        <Popover placement="right" content={<span>Info</span>}>
                          <i
                            className="fas fa-info-circle info-logo-widget ml-2"
                            onClick={this.infoTO}
                          />
                        </Popover>
                        <i
                          className="fas fa-sync flipicon"
                          onClick={this.handleFlippedTOALL.bind(this)}></i>
                      </p>
                    </Row>
                    <Col span={12}>
                      {' '}
                      <p className="kpi-this-month">Overall TurnOver Rate</p>
                      <p className="kpi-series">
                        {this.state.series == '' ? (
                          ''
                        ) : (
                          <Odometer value={this.state.series} options={{ format: '' }} />
                        )}
                        {/* {this.state.series} */}
                      </p>
                      <p className="kpi-this-month">Rolling 6 Months</p>
                      <Button type="primary" onClick={this.handleModal}>
                        <span className="kpi-btn">
                          View More &nbsp;<i className="fas fa-arrow-right"></i>
                        </span>
                      </Button>
                    </Col>
                    <Col span={12}>
                      <ResponsiveContainer height={60} width="100%">
                        <AreaChart
                          width={180}
                          height={60}
                          data={this.state.getTurnOverRateMonthwiseData}
                          margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5
                          }}
                          onClick={this.onclickToDrillDownView.bind(this)}>
                          <Tooltip content={this.TooltipFormatTurnoverrateMonthlyWise} />
                          <defs>
                            <linearGradient id="gradationColor" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#ff0000" />
                              <stop offset="100%" stopColor="#ffa500" />
                            </linearGradient>
                          </defs>

                          <Area
                            type="monotone"
                            dataKey="TOR"
                            stroke="#FABB51"
                            fill="#FABB51"
                            strokeWidth={2}
                          />
                        </AreaChart>
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
                        <span>TurnOver Rate</span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <span className="pt">
                    <p className="kpi-w1">
                      <i className="fas fa-chart-pie"></i> TurnOver Rate
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoTO}
                        />
                      </Popover>
                      <i
                        className="fas fa-sync flipicon"
                        onClick={this.handleFlippedTOALL.bind(this)}></i>
                    </p>{' '}
                    <div className="kpi-loader">
                      <ReusableSysncLoader />
                    </div>
                  </span>
                )}
              </Card>

              <Card className="parts-wid  prl wid-card-height-kpi" size="small">
                <Row className="v4">
                  <p className="kpi-w1">
                    <i className="fas fa-chart-pie"></i>
                    TurnOver Rate All Material
                    <Popover placement="right" content={<span>Info</span>}>
                      <i
                        className="fas fa-info-circle info-logo-widget ml-2"
                        onClick={this.infoTO}
                      />
                    </Popover>
                    <i
                      className="fas fa-sync flipicon"
                      onClick={this.handleFlippedTOALL.bind(this)}></i>
                  </p>
                </Row>
                {this.state.getAllTurnOverRateMonthwiseData != 0 &&
                this.state.OverAllMtnrTo != 0 ? (
                  <Row>
                    <Col span={12}>
                      <p className="kpi-this-month">Overall TurnOver Rate</p>
                      <p className="kpi-series">
                        <Odometer value={this.state.OverAllMtnrTo} options={{ format: '' }} />
                      </p>
                      <p className="kpi-this-month">Rolling 6 Months</p>

                      <Button type="primary" onClick={this.handleModalBackToMatnrAll.bind(this)}>
                        <span className="kpi-btn">
                          View More &nbsp;<i className="fas fa-arrow-right"></i>
                        </span>
                      </Button>
                    </Col>
                    <Col span={12}>
                      {' '}
                      <ResponsiveContainer height={60} width="100%">
                        <AreaChart
                          width={180}
                          height={60}
                          data={this.state.getAllTurnOverRateMonthwiseData}
                          margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5
                          }}
                          onClick={this.onclickDDAllTo.bind(this)}>
                          <Tooltip content={this.TooltipFormatTOALL} />
                          <defs>
                            <linearGradient id="gradation" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#DE6262" />
                              <stop offset="100%" stopColor="#FFB88C" />
                            </linearGradient>
                          </defs>

                          <Area
                            // fill="url(#gradation)"
                            type="monotone"
                            dataKey="TOR"
                            stroke="#FF5959"
                            fill="#FF5959"
                            strokeWidth={2}
                          />
                        </AreaChart>
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
                        <span>TurnOver Rate</span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <span>
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

        {/* kpi info To */}
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>TurnOver Rate - Description</div>}
          className="Intervaltimeline"
          visible={this.state.ModalTo}
          onCancel={this.infoTO}>
          <div>
            <p>
              <strong>TurnOverRate:</strong>
            </p>
            <ul>
              <li>
                Inventory TurnOver rate is the number of times a company sells and replaces its
                stock in a period, usually one year.
              </li>
              <div className="kpito-img" />
            </ul>
          </div>
        </Modal>

        {/* TurnOverRateDrillDownChart-start */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Month Wise TurnOverRate
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.TurnoverDrillDownModal}
          onCancel={this.onclickChartTurnOverrate}>
          <Row className="mt-2 v4">
            <Col span={24}>
              {' '}
              <div className="head-title">
                {' '}
                <Button
                  size="sm"
                  className="export-Btn ml-2 mr-2 float-right "
                  onClick={this.exportToCSVRadialTO}>
                  <i className="fas fa-file-excel" />
                </Button>
                <Button
                  size="sm"
                  className="export-Btn ml-2 mr-2 float-right"
                  onClick={() =>
                    exportComponentAsPNG(this.OverAllAOImg, 'Turnover Rate-Month wise')
                  }>
                  <i className="fas fa-image" />
                </Button>
                <span className="float-right">
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
            </Col>

            <div ref={this.OverAllAOImg}>
              <DynamicChart
                stroke={this.state.color}
                fill={this.state.color}
                chart={this.state.chartChangeDD}
                formatXAxis={this.formatXAxis}
                data={this.state.getTurnOverRateMonthwiseData}
                Ydatakey="TOR"
                Xdatakey="MONTHLY"
                Xvalue=" Date"
                Yvalue="TurnOverRate"
                Tooltip={this.TooltipFormatTurnoverrateMonthlyWise}
                Legend={
                  <div className="float-left pl-40">
                    <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                      {/* <ColorPicker
                        animation="slide-up"
                        color={this.state.color}
                        onChange={this.changeHandler}
                        className="some-class"
                      /> */}
                      <span className="legend-cls"> - TurnOverRate</span>
                    </Popover>
                  </div>
                }
              />
            </div>
          </Row>
        </Modal>
        {/* TurnOverRateDrillDownChart--end */}

        {/* TurnOverRateManufactureColumn --start */}
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
          visible={this.state.chartModal2}
          onCancel={this.onclickChartCloseForTurnOverManuf}>
          <Row className="mt-2 v4">
            {!this.props.getTurnOverRateManufMonthwiseReducerLoader &&
            this.state.getTurnOverRateManufMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialTOManuf}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(this.TOMF, `${this.state.manuf}-  TurnOverRate Chart`)
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

                <div ref={this.TOMF}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getTurnOverRateManufMonthwiseData}
                    Ydatakey="TOR"
                    Xdatakey="MONTHLY"
                    Xvalue=" Date"
                    Yvalue="TurnOverRate"
                    Tooltip={this.TooltipFormat}
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
                          <span className="legend-cls"> - TurnOverRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getTurnOverRateManufMonthwiseReducerLoader ? (
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

        {/* TurnOverRateManufactureOrg --start */}
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
          visible={this.state.chartModal1}
          onCancel={this.onclickChartCloseForTurnOverOrg}>
          <Row className="mt-2 v4">
            {!this.props.getTurnOverRateOrgMonthwiseLoaderReducer &&
            this.state.getTurnOverRateOrgMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialTOOrg}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(this.TOO, `${this.state.org}-TurnOver Rate Chart`)
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

                <div ref={this.TOO}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getTurnOverRateOrgMonthwiseData}
                    Ydatakey="TOR"
                    Xdatakey="MONTHLY"
                    Xvalue=" Date"
                    Yvalue="TurnOverRate"
                    Tooltip={this.TooltipFormat}
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
                          <span className="legend-cls"> - TurnOverRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getTurnOverRateOrgMonthwiseLoaderReducer ? (
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
        {/* TurnOverRateManufactureColumn--end */}

        {/* previous code start */}
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
          visible={this.state.chartModal}
          onCancel={this.onclickChartClose}>
          <Row className="mt-2 v4">
            {!this.props.getTurnOverRateMaterialMonthwiseLoaderReducer &&
            this.state.getTurnOverRateMaterialMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVRadialTOMatnr}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(this.TOM, `${this.state.materialNo}-TurnOver Rate Chart`)
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

                <div ref={this.TOM}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getTurnOverRateMaterialMonthwiseData}
                    Ydatakey="TOR"
                    Xdatakey="MONTHLY"
                    Xvalue=" Date"
                    Yvalue="TurnOverRate"
                    Tooltip={this.TooltipFormat}
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
                          <span className="legend-cls"> - TurnOverRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getTurnOverRateMaterialMonthwiseLoaderReducer ? (
                  <>
                    <div style={{ height: '400px' }}>
                      <ReusableSysncLoader />
                    </div>
                  </>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </Row>
        </Modal>
        {/* previous code start end */}

        {/* {turn over modal} */}
        <Modal
          width="80%"
          footer={null}
          className="modal-turnover"
          visible={this.state.openmodal}
          onCancel={this.handleclose}
          title={
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <span className="float-left mr-2">
                  <i className="fas fa-chart-pie"></i>
                </span>
                <span className="tab-head">TurnOver Rate</span>
              </Col>
            </Row>
          }>
          <Tabs
            defaultActiveKey={'1'}
            activeKey={this.state.activeKey}
            onChange={this.handleModalKeyChange}>
            <TabPane tab="Material" key="1">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getTurnOverRateMaterialData}
                  columns={this.state.TurnOverRateColumn}
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
                          {this.state.getTurnOverRateMaterialData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVTurnoverMatr}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVTurnoverMatr}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndTurnOverRateColumn.bind(this)}
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
                  data={this.state.getTurnOverRateManufacturerData}
                  columns={this.state.TurnOverRateManufactureColumn}
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
                          {this.state.getTurnOverRateManufacturerData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVTurnoverManuf}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVTurnoverManuf}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndTurnOverRateManufactureColumn.bind(this)}
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
                  data={this.state.getTurnOverRateOrganizationData}
                  columns={this.state.TurnOverRateOrgColumn}
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
                          {this.state.getTurnOverRateOrganizationData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVTurnoverOrg}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVTurnoverOrg}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}

                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndTurnOverRateOrgColumn.bind(this)}
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

        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              TurnOver All Material
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.ToMatnrAll}
          onCancel={this.onclickToAllMatnr.bind(this)}>
          <Row className="mt-2 v4">
            <div className="head-title">
              {' '}
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right "
                onClick={this.exportToCsvToAll}>
                <i className="fas fa-file-excel" />
              </Button>
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={() => exportComponentAsPNG(this.OverAllTo, 'Turnover All Material')}>
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

            <div ref={this.OverAllTo}>
              <DynamicChart
                stroke={this.state.color}
                fill={this.state.color}
                chart={this.state.chartChangeDD}
                formatXAxis={this.formatXAxis}
                data={this.state.getAllTurnOverRateMonthwiseData}
                Ydatakey="TOR"
                Xdatakey="MONTHLY"
                Xvalue=" Date"
                Yvalue="TurnOverRate"
                Tooltip={this.TooltipFormatTOALL}
                Legend={
                  <div className="float-left pl-40">
                    <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                      {/* <ColorPicker
                        animation="slide-up"
                        color={this.state.color}
                        onChange={this.changeHandler}
                        className="some-class"
                      /> */}
                      <span className="legend-cls"> - TurnOverRate</span>
                    </Popover>
                  </div>
                }
              />
            </div>
          </Row>
        </Modal>
        {/* //toallmatr */}
        <Modal
          width="80%"
          footer={null}
          className="modal-turnover"
          visible={this.state.ToAllViewMore}
          onCancel={this.handleModalBackToMatnrAllClose.bind(this)}
          title={
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <span className="float-left mr-2">
                  <i className="fas fa-chart-pie"></i>
                </span>
                <span className="tab-head">TurnOverRate All Material</span>
              </Col>
            </Row>
          }>
          <Tabs
            defaultActiveKey={'1'}
            activeKey={this.state.ToallActiveKey}
            onChange={this.handleModalKeyChangeTOMatnrAll.bind(this)}>
            <TabPane tab="Manufacturer" key="1">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getAllTurnOverRateManufacturerData}
                  columns={this.state.TOALLmanuf}
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
                          {this.state.getAllTurnOverRateManufacturerData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVTOManufAll}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVTOManufAll}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* s */}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndTOALLmanuf.bind(this)}
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
                  data={this.state.getAllTurnOverRateOrganizationData}
                  columns={this.state.TOALLmtnrOrg}
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
                          {this.state.getAllTurnOverRateOrganizationData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbaTOrgAll}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVbaTOrgAll}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndTOALLmtnrOrg.bind(this)}
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
              Manufacturer- {this.state.Tomanufname}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.ToAllmtnrAction}
          onCancel={this.oncloseToAllAction.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getAllTurnOverRateManufMonthwiseReducerLoader &&
            this.state.getAllTurnOverRateManufMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVTOAllManuf}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.TOAllManufPng,
                        `${this.state.Tomanufname}-TurnOverRate Chart`
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

                <div ref={this.TOAllManufPng}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getAllTurnOverRateManufMonthwiseData}
                    Ydatakey="TOR"
                    Xdatakey="MONTHLY"
                    Xvalue=" Date"
                    Yvalue="TurnOverRate"
                    Tooltip={this.TooltipFormatTOALLAction}
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
                          <span className="legend-cls"> - TurnOverRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getAllTurnOverRateManufMonthwiseReducerLoader ? (
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
              Organization- {this.state.ToOrgName}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.ToAllOrgAction}
          onCancel={this.oncloseToAllOrgAction.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getAllTurnOverRateOrgMonthwiseReducerLoader &&
            this.state.getAllTurnOverRateOrgMonthwiseData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVTOAllORG}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.TOALLORG,
                        `${this.state.ToOrgName}- TurnOverRate Chart`
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

                <div ref={this.TOALLORG}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getAllTurnOverRateOrgMonthwiseData}
                    Ydatakey="TOR"
                    Xdatakey="MONTHLY"
                    Xvalue=" Date"
                    Yvalue="TurnOverRate"
                    Tooltip={this.TooltipFormatTOALLAction}
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
                          <span className="legend-cls"> - TurnOverRate</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getAllTurnOverRateOrgMonthwiseReducerLoader ? (
                  <>
                    <div style={{ height: '400px' }}>
                      <ReusableSysncLoader />
                    </div>
                  </>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </Row>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  return {
    getTurnOverRateData: state.getTurnOverRate,
    getTurnOverRateMaterialData: state.getTurnOverRateMaterial,
    getTurnOverRateOrganizationData: state.getTurnOverRateOrganization,
    getTurnOverRateMaterialMonthwiseData: state.getTurnOverRateMaterialMonthwise,
    getTurnOverRateMaterialMonthwiseLoaderReducer:
      state.getTurnOverRateMaterialMonthwiseLoaderReducer,
    getTurnOverRateMonthwiseData: state.getTurnOverRateMonthwise,
    getTurnOverRateManufacturerData: state.getTurnOverRateManufacturer,
    getTurnOverRateOrgMonthwiseData: state.getTurnOverRateOrgMonthwise,
    getTurnOverRateOrgMonthwiseLoaderReducer: state.getTurnOverRateOrgMonthwiseLoaderReducer,
    getTurnOverRateManufMonthwiseData: state.getTurnOverRateManufMonthwise,
    getTurnOverRateManufMonthwiseReducerLoader: state.getTurnOverRateManufMonthwiseReducerLoader,
    getAllTurnOverRateData: state.getAllTurnOverRate,
    getAllTurnOverRateMonthwiseData: state.getAllTurnOverRateMonthwise,
    getAllTurnOverRateManufacturerData: state.getAllTurnOverRateManufacturer,
    getAllTurnOverRateOrganizationData: state.getAllTurnOverRateOrganization,
    getAllTurnOverRateManufMonthwiseData: state.getAllTurnOverRateManufMonthwise,
    getAllTurnOverRateManufMonthwiseReducerLoader:
      state.getAllTurnOverRateManufMonthwiseReducerLoader,
    getAllTurnOverRateOrgMonthwiseData: state.getAllTurnOverRateOrgMonthwise,
    getAllTurnOverRateOrgMonthwiseReducerLoader: state.getAllTurnOverRateOrgMonthwiseReducerLoader,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails
  };
}

export default connect(mapState, {
  getTurnOverRateMonthwise,
  getTurnOverRateOrganization,
  getTurnOverRateMaterialMonthwise,

  getAllTurnOverRateOrgMonthwise,
  getAllTurnOverRateManufMonthwise,
  getAllTurnOverRateOrganization,
  getAllTurnOverRateManufacturer,
  getAllTurnOverRateMonthwise,
  getAllTurnOverRate,
  getTurnOverRateManufMonthwise,
  getTurnOverRateOrgMonthwise,
  getTurnOverRateMaterial,
  getTurnOverRateManufacturer,
  getTurnOverRate,
  getUserImpersonationDetails
})(Kpi);
