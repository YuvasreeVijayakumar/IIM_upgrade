import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';

import {
  getLeadTimeMaterial,
  getLeadTimeTrendingMaterial,
  getLeadTimeManuf,
  getLeadTimeTrendingManuf,
  getLeadTimeOrg,
  getLeadTimeTrendingOrg,
  getLeadTimeOverall,
  getLeadTimeTrending1,
  getLeadTimeMaterialTrendwise,
  getLeadTimeMaterialTrendwiseUp,
  getLeadTimeMaterialTrendwiseDown,
  getLeadTimeMaterialTrendwiseNeutral,
  getUserImpersonationDetails
} from '../../actions';
import { Row, Col, Card, Button, Modal, Tabs, Popover, Select } from 'antd';

import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import ReactCardFlip from 'react-card-flip';
import Odometer from 'react-odometerjs';
import { ResponsiveContainer, Tooltip, BarChart, Bar } from 'recharts';

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
import { KpiSecondRow } from './KpiSecondRow';
import Marquee from 'react-easy-marquee';
import { DynamicChart } from '../../components/CustomComponents/DynamicChart';
import ColorPicker from 'rc-color-picker';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
import { TopmovingMaterial } from './TopMovingMaterial/TopmovingMaterial';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { Option } = Select;
const { SearchBar } = Search;
const { TabPane } = Tabs;

class KpiWidjet extends Component {
  constructor(props) {
    super(props);
    this.changeHandler = this.changeHandler.bind(this);
    this.handleMarquee = this.handleMarquee.bind(this);
    this.onClickMarqueeClose = this.onClickMarqueeClose.bind(this);
    this.Imploader = this.Imploader.bind(this);

    this.handleModal = this.handleModal.bind(this);
    this.handleModalKeyChange = this.handleModalKeyChange.bind(this);
    this.exportToCSVLeadtimeMtnr = this.exportToCSVLeadtimeMtnr.bind(this);
    this.exportToCSVLeadtimeTrend = this.exportToCSVLeadtimeTrend.bind(this);
    this.exportToCSVLeadTimeTrendView = this.exportToCSVLeadTimeTrendView.bind(this);
    this.LeadMatnrtrend = React.createRef();
    this.LeadManuftrend = React.createRef();
    this.LeadOrgtrend = React.createRef();
    this.LeadTimeTrendImg = React.createRef();
    this.infoTO = this.infoTO.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.onRowSelect = this.onRowSelect.bind(this);

    this.state = {
      loader: true,
      color: '#82ca9d',
      chartChange: 'LINE',
      chartChangeDD: 'LINE',
      marqueeHead: '',
      getLeadTimeMaterialTrendwiseData: [],
      isDataFetched: false,
      marqueeUp: [],
      marqueeDown: [],
      marqueeNutreal: [1248682, 1267853, 1267853, 1328091],
      title: '',
      flipped: false,
      ModalTo: false,
      series: [],
      getLeadTimeMaterialData: [],
      getLeadTimeManufData: [],
      getLeadTimeOrgData: [],
      getLeadTimeTrendingMaterialData: [],
      getLeadTimeTrendingManufData: [],
      getLeadTimeTrendingOrgData: [],
      LeadTimeTrendingColumn: [
        {
          dataField: 'MATNR',
          text: 'Material',
          sort: true,
          headerStyle: { width: 40 },
          formatter: this.materialDescription,
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'MEDIAN_LEADTIME',
          text: 'LeadTime(Median)',
          sort: true,
          headerStyle: { width: 60 },
          align: 'center',
          headerAlign: 'center'
          // formatter: this.costformat,
          // align: "right",
        },
        {
          dataField: 'MIN_DAYS',
          text: 'Min Days',
          sort: true,
          headerStyle: { width: 40 },
          align: 'center',
          headerAlign: 'center'
          // align: "right",
        },
        {
          dataField: 'MAX_DAYS',
          text: 'Max Days',
          sort: true,
          headerStyle: { width: 40 },
          align: 'center',
          headerAlign: 'center'
        }
      ],
      LeadTimeMaterialColumn: [
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
                onClick={() => this.onclickActionMatnr(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'MATNR',
          text: 'Material',
          sort: true,
          headerStyle: { width: 40 },
          formatter: this.materialDescription,
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'TREND',
          text: 'Trend',
          sort: true,
          headerStyle: { width: 50 },
          align: 'center',
          headerAlign: 'center',
          formatter: this.materialTrend
        },
        {
          dataField: 'MEDIAN_LEADTIME',
          text: 'LeadTime(Median)',
          sort: true,
          headerStyle: { width: 60 },
          align: 'center',
          headerAlign: 'center'
          // formatter: this.costformat,
          // align: "right",
        },
        {
          dataField: 'MIN_DAYS',
          text: 'Min Days',
          sort: true,
          headerStyle: { width: 40 },
          align: 'center',
          headerAlign: 'center'
          // align: "right",
        },
        {
          dataField: 'MAX_DAYS',
          text: 'Max Days',
          sort: true,
          headerStyle: { width: 40 },
          align: 'center',
          headerAlign: 'center'
        }
      ],
      LeadTimeManufColumn: [
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
                onClick={() => this.onclickActionManuf(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'MANUF_NAME',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 57 },

          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MEDIAN_LEADTIME',
          text: 'LeadTime(Median)',
          sort: true,
          headerStyle: { width: 60 },
          align: 'center',
          headerAlign: 'center'
          // formatter: this.costformat,
          // align: "right",
        },
        {
          dataField: 'MIN_DAYS',
          text: 'Min Days',
          sort: true,
          headerStyle: { width: 40 },
          align: 'center',
          headerAlign: 'center'
          // align: "right",
        },
        {
          dataField: 'MAX_DAYS',
          text: 'Max Days',
          sort: true,
          headerStyle: { width: 40 },
          align: 'center',
          headerAlign: 'center'
        }
      ],
      LeadTimeOrtgColumn: [
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
                onClick={() => this.onclickActionOrg(row)}>
                <i className="fas fa-chart-line" />
              </Button>
            </div>
          )
        },
        {
          dataField: 'ORGANIZATION',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 40 },

          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MEDIAN_LEADTIME',
          text: 'LeadTime(Median)',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 50 }
          // formatter: this.costformat,
          // align: "right",
        },
        {
          dataField: 'MIN_DAYS',
          text: 'Min Days',
          sort: true,
          headerStyle: { width: 40 },
          align: 'center',
          headerAlign: 'center'
          // align: "right",
        },
        {
          dataField: 'MAX_DAYS',
          text: 'Max Days',
          sort: true,
          headerStyle: { width: 40 },
          align: 'center',
          headerAlign: 'center'
        }
      ]
    };
  }
  componentDidMount() {}
  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData) {
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
      this.props.getLeadTimeMaterialTrendwiseNeutralData !=
      nextProps.getLeadTimeMaterialTrendwiseNeutralData
    ) {
      if (nextProps.getLeadTimeMaterialTrendwiseNeutralData != 0) {
        this.setState({
          marqueeNutreal: nextProps.getLeadTimeMaterialTrendwiseNeutralData.map((d) => d.MATNR)
        });
      } else {
        this.setState({
          marqueeNutreal: []
        });
      }
    }
    if (
      this.props.getLeadTimeMaterialTrendwiseDownData !=
      nextProps.getLeadTimeMaterialTrendwiseDownData
    ) {
      if (nextProps.getLeadTimeMaterialTrendwiseDownData != 0) {
        this.setState({
          marqueeDown: nextProps.getLeadTimeMaterialTrendwiseDownData.map((d) => d.MATNR)
        });
      }
    }
    if (
      this.props.getLeadTimeMaterialTrendwiseUpData != nextProps.getLeadTimeMaterialTrendwiseUpData
    ) {
      if (nextProps.getLeadTimeMaterialTrendwiseUpData != 0) {
        this.setState({
          marqueeUp: nextProps.getLeadTimeMaterialTrendwiseUpData.map((dat) => dat.MATNR)
        });
      } else {
        this.setState({
          marqueeUp: []
        });
      }
    }
    if (this.props.getLeadTimeMaterialTrendwiseData != nextProps.getLeadTimeMaterialTrendwiseData) {
      if (nextProps.getLeadTimeMaterialTrendwiseData != 0) {
        this.props.getLeadTimeTrendingMaterial(nextProps.getLeadTimeMaterialTrendwiseData[0].MATNR);
        this.setState({
          getLeadTimeMaterialTrendwiseData: nextProps.getLeadTimeMaterialTrendwiseData,
          isDataFetched: true,
          TrendMatnr: nextProps.getLeadTimeMaterialTrendwiseData[0].MATNR,
          TrendDesc: nextProps.getLeadTimeMaterialTrendwiseData[0].DESCRIPTION,
          TrendHesc: nextProps.getLeadTimeMaterialTrendwiseData[0].HECI,
          TrendStk: nextProps.getLeadTimeMaterialTrendwiseData[0].STK_TYPE,
          TrendCtl: nextProps.getLeadTimeMaterialTrendwiseData[0].CTL_STOCKOUT_FLAG,
          TrendLvlt: nextProps.getLeadTimeMaterialTrendwiseData[0].LVLT_STOCKOUT_FLAG,
          TrendLeadTime: nextProps.getLeadTimeMaterialTrendwiseData[0].MEDIAN_LEADTIME
        });
      } else {
        this.setState({
          getLeadTimeMaterialTrendwiseData: [],
          isDataFetched: false
        });
      }
    }

    if (this.props.getLeadTimeTrending1Data != nextProps.getLeadTimeTrending1Data) {
      if (nextProps.getLeadTimeTrending1Data != 0) {
        this.setState({
          getLeadTimeTrending1Data: nextProps.getLeadTimeTrending1Data
        });
      } else {
        this.setState({
          getLeadTimeTrending1Data: []
        });
      }
    }
    if (this.props.getLeadTimeOverallData != nextProps.getLeadTimeOverallData) {
      if (nextProps.getLeadTimeOverallData != 0) {
        this.setState({
          series: [nextProps.getLeadTimeOverallData.map((data) => data.Median_LeadTime.toFixed(1))]
        });
      }
    }
    if (this.props.getLeadTimeTrendingOrgData != nextProps.getLeadTimeTrendingOrgData) {
      if (nextProps.getLeadTimeTrendingOrgData != 0) {
        this.setState({
          getLeadTimeTrendingOrgData: nextProps.getLeadTimeTrendingOrgData,
          loader: false
        });
      } else {
        this.setState({
          getLeadTimeTrendingOrgData: [],
          loader: true
        });
      }
    }
    if (this.props.getLeadTimeOrgData != nextProps.getLeadTimeOrgData) {
      if (nextProps.getLeadTimeOrgData != 0) {
        this.setState({
          getLeadTimeOrgData: nextProps.getLeadTimeOrgData
        });
      } else {
        this.setState({
          getLeadTimeOrgData: []
        });
      }
    }
    if (this.props.getLeadTimeTrendingManufData != nextProps.getLeadTimeTrendingManufData) {
      if (nextProps.getLeadTimeTrendingManufData != 0) {
        this.setState({
          getLeadTimeTrendingManufData: nextProps.getLeadTimeTrendingManufData,
          loader: false
        });
      } else {
        this.setState({
          getLeadTimeTrendingManufData: [],
          loader: true
        });
      }
    }
    if (this.props.getLeadTimeManufData != nextProps.getLeadTimeManufData) {
      if (nextProps.getLeadTimeManufData != 0) {
        this.setState({
          getLeadTimeManufData: nextProps.getLeadTimeManufData
        });
      } else {
        this.setState({
          getLeadTimeManufData: []
        });
      }
    }
    if (this.props.getLeadTimeTrendingMaterialData != nextProps.getLeadTimeTrendingMaterialData) {
      if (nextProps.getLeadTimeTrendingMaterialData != 0) {
        this.setState({
          getLeadTimeTrendingMaterialData: nextProps.getLeadTimeTrendingMaterialData,
          loader: false
        });
      } else {
        this.setState({
          getLeadTimeTrendingMaterialData: [],
          loader: true
        });
      }
    }

    if (this.props.getLeadTimeMaterialData != nextProps.getLeadTimeMaterialData) {
      if (nextProps.getLeadTimeMaterialData != 0) {
        this.setState({
          getLeadTimeMaterialData: nextProps.getLeadTimeMaterialData
        });
      } else {
        this.setState({
          getLeadTimeMaterialData: []
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
  handleModal() {
    if (this.state.openViewMoreModal == true) {
      this.setState({
        openViewMoreModal: false
      });
    } else {
      this.setState({
        openViewMoreModal: true,
        activeKey: '1',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
    }
  }
  handleModalKeyChange(key) {
    if (key == 3) {
      this.setState({
        activeKey: '3',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getLeadTimeOrg();
    } else if (key == 2) {
      this.setState({
        activeKey: '2',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
      this.props.getLeadTimeManuf();
    } else {
      this.setState({
        activeKey: '1',
        color: '#82ca9d',

        chartChangeDD: 'LINE'
      });
    }
  }
  onclickActionMatnr(row) {
    if (this.state.ActionModalmatnr == true) {
      this.setState({
        ActionModalmatnr: false,
        getLeadTimeTrendingMaterialData: [],
        loader: true
      });
    } else {
      this.setState({
        ActionModalmatnr: true,
        materialNo: row.MATNR,
        getLeadTimeTrendingMaterialData: [],
        loader: true
      });
      this.props.getLeadTimeTrendingMaterial(row.MATNR);
    }
  }
  onclickActionManuf(row) {
    if (this.state.ActionModalmanuf == true) {
      this.setState({
        ActionModalmanuf: false
      });
    } else {
      this.setState({
        ActionModalmanuf: true,
        manuf: row.MANUF_NAME,
        getLeadTimeTrendingManufData: [],

        loader: true
      });
      this.props.getLeadTimeTrendingManuf(encodeURIComponent(row.MANUF_NAME));
    }
  }
  onclickActionOrg(row) {
    if (this.state.ActionModalorg == true) {
      this.setState({
        ActionModalorg: false
      });
    } else {
      this.setState({
        ActionModalorg: true,
        org: row.ORGANIZATION,
        getLeadTimeTrendingOrgData: [],

        loader: true
      });
      this.props.getLeadTimeTrendingOrg(encodeURIComponent(row.ORGANIZATION));
    }
  }
  TooltipFormatLeadTimeTrending(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let values = moment(e.payload[0].payload.PO_DATE).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{values}</b> <br />
          </span>
          <span>
            <b>Median: {e.payload[0].payload.MEDIAN}</b> Days
            <br />
          </span>
        </div>
      );
    }
  }
  onclickToDDLeadtimeTrend() {
    this.setState({
      leadtimeTrendModal: true,
      color: '#fa5e99',
      chartChange: 'AREA'
    });
  }
  onclickToDDLeadtimeTrendClose() {
    this.setState({
      leadtimeTrendModal: false
    });
  }
  exportToCSVLeadTimeTrendView() {
    let csvData = this.state.getLeadTimeTrending1Data;
    let fileName = 'getLeadTimeTrending';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVLeadtimeMtnr() {
    let csvData = this.state.getLeadTimeMaterialData;
    let fileName = 'Material LeadTime';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVLeadtimeTrend() {
    let csvData = this.state.getLeadTimeMaterialTrendwiseData.map((obj) => {
      return {
        Material: obj.MATNR,
        DESCRIPTION: obj.DESCRIPTION,
        HECI: obj.HECI,
        STK_TYPE: obj.STK_TYPE,
        CTL_STOCKOUT_FLAG: obj.CTL_STOCKOUT_FLAG,
        LVLT_STOCKOUT_FLAG: obj.LVLT_STOCKOUT_FLAG,
        TREND: obj.TREND,
        MEDIAN_LEADTIME: obj.MEDIAN_LEADTIME,
        MIN_DAYS: obj.MIN_DAYS,
        MAX_DAYS: obj.MAX_DAYS,
        IS_ACTIVE: obj.IS_ACTIVE
      };
    });
    let fileName = this.state.title;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVLeadtimeManuf() {
    let csvData = this.state.getLeadTimeManufData;
    let fileName = 'Manufacturer LeadTime';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVLeadtimeOrg() {
    let csvData = this.state.getLeadTimeOrgData;
    let fileName = 'Organization LeadTime';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVLeadtimetrend() {
    let csvData = this.state.getLeadTimeTrendingMaterialData;
    let fileDownload = this.state.TrendMatnr
      ? `${this.state.TrendMatnr}-Lead Time Trend`
      : `${this.state.materialNo}-Lead Time Trend`;
    let fileName = fileDownload;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVLeadtimemanuftrend() {
    let csvData = this.state.getLeadTimeTrendingManufData;
    let fileName = `${this.state.manuf}- LeadTime Trend`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVLeadtimeOrgftrend() {
    let csvData = this.state.getLeadTimeTrendingOrgData;
    let fileName = `${this.state.org}-LeadTime Trend`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  TooltipFormatLeadtimeMaterial(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let values = moment(e.payload[0].payload.PO_DATE).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{values}</b> <br />
          </span>
          <span>
            <b>Median: {e.payload[0].payload.MEDIAN}</b> Days <br />
          </span>
        </div>
      );
    }
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

  formatXAxis(tickItem) {
    return moment(tickItem).format('MMM-YYYY');
  }
  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.LeadTimeMaterialColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);

    this.setState({ LeadTimeMaterialColumn: columnsCopy });
  }

  onDragEndNewleadtime(fromIndex, toIndex) {
    const columnsCopy = this.state.LeadTimeTrendingColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);

    this.setState({ LeadTimeTrendingColumn: columnsCopy });
  }
  onDragEndLeadTimeManufColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.LeadTimeManufColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ LeadTimeManufColumn: columnsCopy });
  }
  onDragEndLeadTimeOrtgColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.LeadTimeOrtgColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ LeadTimeOrtgColumn: columnsCopy });
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
        <span className="row-data">{cell}</span>
      </Popover>
    );
  }

  handleFlipped() {
    if (this.state.flipped == true) {
      this.setState({
        flipped: false
      });
    } else {
      this.setState({
        series1: [],
        flipped: true
      });
      this.props.getLeadTimeMaterialTrendwiseNeutral();
      this.props.getLeadTimeMaterialTrendwiseUp();
      this.props.getLeadTimeMaterialTrendwiseDown();
    }
  }

  handleMarquee(e) {
    this.props.getLeadTimeMaterialTrendwise(e.target.className);

    if (e.target.className == 'Up') {
      this.setState({
        title: 'Upward Trend Lead Time Materials'
      });
    } else {
      this.setState({
        title: 'Downward Trend Lead Time Materials'
      });
    }
    this.setState({
      marqueeHead: e.target.className,
      marqueeModal: true
    });
  }
  onClickMarqueeClose() {
    this.setState({
      marqueeModal: false,
      TrendMatnr: '',
      TrendHesc: '',
      TrendDesc: '',
      TrendLeadTime: '',
      TrendStk: '',
      TrendCtl: '',
      TrendLvlt: ''
    });
  }

  onRowSelect(row) {
    this.setState({
      TrendMatnr: row.MATNR,
      TrendHesc: row.HECI,
      TrendDesc: row.DESCRIPTION,
      TrendStk: row.STK_TYPE,
      TrendLeadTime: row.MEDIAN_LEADTIME,
      TrendCtl: row.CTL_STOCKOUT_FLAG,
      TrendLvlt: row.LVLT_STOCKOUT_FLAG,
      loader: true
    });
    this.props.getLeadTimeTrendingMaterial(row.MATNR);
  }

  handleChartChangeDD(value) {
    this.setState({
      chartChangeDD: value
    });
  }

  handleChartChange(value) {
    this.setState({
      chartChange: value
    });
  }

  changeHandler(colors) {
    this.setState({
      color: colors.color
    });
  }
  Imploader() {
    this.setState({
      flipped: false,
      getLeadTimeTrending1Data: [],
      getLeadTimeMaterialData: [],
      getLeadTimeOverallData: [],
      series: []
    });
    this.props.getLeadTimeTrending1();
    this.props.getLeadTimeMaterial();
    this.props.getLeadTimeOverall();
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

    const selectRowProp = {
      mode: 'radio',
      bgColor: '#5581c3',
      onSelect: this.onRowSelect,
      classes: 'selection',

      hideSelectColumn: true,
      clickToSelect: true,
      selected: [this.state.TrendMatnr]
    };
    return (
      <div>
        <Row gutter={16} style={{ margin: '0px' }}>
          <Col xs={8} sm={8} md={8} lg={8} xl={8} span={8}>
            <ReactCardFlip isFlipped={this.state.flipped} flipDirection="horizontal">
              <Card className="parts-wid  prl wid-card-height-kpi" size="small">
                {this.state.series != 0 ? (
                  <Row>
                    <p className="kpi-w1">
                      <i className="fas fa-hourglass-half"></i> LeadTime
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoTO}
                        />
                      </Popover>
                      <i
                        className="fas fa-sync flipicon"
                        onClick={this.handleFlipped.bind(this)}></i>
                    </p>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                      <p className="kpi-this-month">Overall LeadTime </p>
                      <p className="kpi-series">
                        <Odometer value={this.state.series} options={{ format: '' }} />
                        {'  '}
                        Days
                      </p>
                      <p className="kpi-this-month"></p>

                      <Button type="primary" onClick={this.handleModal}>
                        <span className="kpi-btn">
                          View more &nbsp;<i className="fas fa-arrow-right"></i>
                        </span>
                      </Button>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="kpi-chart">
                      {' '}
                      <ResponsiveContainer height={60} width="100%">
                        <BarChart
                          width={180}
                          height={60}
                          data={this.state.getLeadTimeTrending1Data}
                          margin={{
                            top: 5,
                            right: 0,
                            left: 0,
                            bottom: 5
                          }}
                          onClick={this.onclickToDDLeadtimeTrend.bind(this)}>
                          <Tooltip content={this.TooltipFormatLeadTimeTrending} />

                          <Bar
                            type="monotone"
                            dataKey="MEDIAN"
                            stroke="#FF884B"
                            fill="#FF884B"
                            radius={[3, 3, 0, 0]}
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
                        <span>LeadTime </span>
                      </div>
                    </Col>
                  </Row>
                ) : (
                  <span>
                    {' '}
                    <p className="kpi-w1">
                      <i className="fas fa-hourglass-half"></i> LeadTime
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo-widget ml-2"
                          onClick={this.infoTO}
                        />
                      </Popover>
                    </p>
                    <div className="kpi-loader">
                      <ReusableSysncLoader />
                    </div>
                  </span>
                )}
              </Card>
              <Card className="parts-wid  prl wid-card-height-kpi" size="small">
                <Row>
                  <p className="kpi-w1">
                    <i className="fas fa-hourglass-half"></i> Overall LeadTime Trend
                    <Popover placement="right" content={<span>Info</span>}>
                      <i
                        className="fas fa-info-circle info-logo-widget ml-2"
                        onClick={this.infoTO}
                      />
                    </Popover>
                    <i className="fas fa-sync flipicon" onClick={this.handleFlipped.bind(this)}></i>
                  </p>

                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="marquee-col">
                    <div className="marquee-layout">
                      <p className="marquee-text">
                        Upward <i className="fas fa-arrow-up trend-icon blink_me"></i>{' '}
                      </p>
                      <Marquee
                        duration={this.state.marqueeUp.length * 1000}
                        height="100px"
                        axis="y"
                        align="center"
                        pauseOnHover={true}
                        reverse={true}>
                        <div>
                          {this.state.marqueeUp.map((d, i) => {
                            return (
                              <div className="Up" onClick={(e) => this.handleMarquee(e)} key={i}>
                                {d}
                              </div>
                            );
                          })}
                        </div>
                      </Marquee>
                    </div>
                  </Col>
                  {/* <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                    <div className="marquee-layout">
                      <p className="marquee-text">
                        Neutral{" "}
                        <i className="fas fa-arrows-alt-h trend-icon blink_me"></i>
                      </p>
                      <Marquee
                        duration={this.state.marqueeNutreal.length * 1000}
                        height="100px"
                        axis="y"
                        align="center"
                        pauseOnHover={true}
                        reverse={true}
                      >
                        <div>
                          {this.state.marqueeNutreal.map((d) => {
                            return (
                              <div
                                className="Neutral"
                                onClick={(e) => this.handleMarquee(e)}
                              >
                                {d}
                              </div>
                            );
                          })}
                        </div>
                      </Marquee>
                    </div>
                  </Col> */}
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="marquee-col">
                    <div className="marquee-layout">
                      <p className="marquee-text">
                        Downward <i className="fas fa-arrow-down trend-icon blink_me"></i>
                      </p>
                      <Marquee
                        duration={this.state.marqueeDown.length * 1000}
                        height="100px"
                        axis="y"
                        align="center"
                        pauseOnHover={true}
                        reverse={true}>
                        <div>
                          {this.state.marqueeDown.map((d, i) => {
                            return (
                              <div className="Down" onClick={(e) => this.handleMarquee(e)} key={i}>
                                {d}
                              </div>
                            );
                          })}
                        </div>
                      </Marquee>
                    </div>
                  </Col>
                </Row>
              </Card>
            </ReactCardFlip>
          </Col>

          <Col xs={8} sm={8} md={8} lg={8} xl={8} span={8}>
            <KpiSecondRow />
          </Col>
          <Col xs={8} sm={8} md={8} lg={8} xl={8} span={8}>
            <TopmovingMaterial />
          </Col>
        </Row>

        {/* marquee table */}

        <Modal
          width="80%"
          style={{ top: 60 }}
          footer={null}
          title={
            <div>
              <i className="fas fa-hourglass-half mr-2 float-left"></i>
              LeadTime - {this.state.marqueeHead} Trend
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.marqueeModal}
          onCancel={this.onClickMarqueeClose}>
          <div>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} className="leadtime-tbl">
                {!this.props.getLeadTimeMaterialTrendwiseLoaderReducerLoader &&
                this.state.getLeadTimeMaterialTrendwiseData.length > 0 ? (
                  <>
                    <div>
                      <ToolkitProvider
                        keyField="MATNR"
                        data={this.state.getLeadTimeMaterialTrendwiseData}
                        columns={this.state.LeadTimeTrendingColumn}
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
                            <Row>
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
                                {this.state.getLeadTimeMaterialTrendwiseData != 0 ? (
                                  <Button
                                    size="sm"
                                    className="export-Btn ml-2 mr-2 float-right"
                                    onClick={this.exportToCSVLeadtimeTrend}>
                                    <i className="fas fa-file-excel" />
                                  </Button>
                                ) : (
                                  <Button
                                    disabled
                                    size="sm"
                                    className="export-Btn ml-2 mr-2 float-right"
                                    onClick={this.exportToCSVLeadtimeTrend}>
                                    <i className="fas fa-file-excel" />
                                  </Button>
                                )}

                                {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                                <SearchBar {...props.searchProps} />
                              </Col>
                            </Row>
                            <ReactDragListView.DragColumn
                              onDragEnd={this.onDragEndNewleadtime.bind(this)}
                              nodeSelector="th">
                              <div>
                                <BootstrapTable
                                  selectRow={selectRowProp}
                                  {...props.baseProps}
                                  //pagination={paginationFactory()}
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
                  </>
                ) : (
                  <>
                    {this.props.getLeadTimeMaterialTrendwiseLoaderReducerLoader ? (
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
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                {!this.props.getLeadTimeMaterialTrendwiseLoaderReducerLoader &&
                this.state.getLeadTimeMaterialTrendwiseData.length > 0 ? (
                  <>
                    <span className="HeadName">
                      {' '}
                      <i className="fas fa-chart-line mr-2" />
                      Material wise Leadtime trend
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
                    </span>
                    <div className="KpiDDCardLeadtime">
                      <Row>
                        <Col span={8} className="font-css">
                          <span>Material : </span>
                          <span className="text-css">
                            {' '}
                            <Popover
                              placement="bottom"
                              className="modal-tool-tip"
                              content={
                                <span>
                                  {this.state.TrendDesc}{' '}
                                  {this.state.TrendStk != '' || this.state.TrendStk != null ? (
                                    <>
                                      {this.state.TrendStk == null ? (
                                        ''
                                      ) : (
                                        <>
                                          <br />
                                          <span className="Stk-style">
                                            Stock Type : &nbsp;
                                            {this.state.TrendStk}
                                          </span>
                                        </>
                                      )}
                                    </>
                                  ) : (
                                    ''
                                  )}
                                  {this.state.TrendHesc != '' ? (
                                    <span className="heci-style">
                                      <br />
                                      HECI : {this.state.TrendHesc}{' '}
                                    </span>
                                  ) : (
                                    ''
                                  )}{' '}
                                  {this.state.TrendCtl != 'Y' ? (
                                    ''
                                  ) : (
                                    <>
                                      <br />
                                      <span className="stockout-style">
                                        CTL Stockout : &nbsp; Yes
                                      </span>
                                    </>
                                  )}
                                  {this.state.TrendLvlt != 'Y' ? (
                                    ''
                                  ) : (
                                    <>
                                      <br />
                                      <span className="stockout-style">
                                        LVLT Stockout : &nbsp; Yes
                                      </span>
                                    </>
                                  )}
                                </span>
                              }>
                              {this.state.TrendMatnr}
                            </Popover>
                          </span>
                        </Col>
                        <Col span={8} className="font-css">
                          <span>Trend : </span>
                          <span className="text-css">
                            {this.state.marqueeHead === 'Up' ? (
                              <i className="fas fa-arrow-up  blink_me"></i>
                            ) : this.state.marqueeHead === 'Down' ? (
                              <i className="fas fa-arrow-down  blink_me"></i>
                            ) : (
                              <i className="fas fa-arrows-alt-h  blink_me"></i>
                            )}
                          </span>
                        </Col>
                        <Col span={8} className="font-css">
                          <span>LeadTime : </span>

                          <span className="text-css"> {this.state.TrendLeadTime}</span>
                        </Col>
                      </Row>
                    </div>
                    {/* <Card> */}
                    <Row className="mt-2 v4 ml-2">
                      {!this.props.getLeadTimeTrendingMaterialReducerLoader &&
                      this.state.getLeadTimeTrendingMaterialData.length > 0 ? (
                        <>
                          <div className="head-title">
                            {' '}
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right "
                              onClick={this.exportToCSVLeadtimetrend.bind(this)}>
                              <i className="fas fa-file-excel" />
                            </Button>
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() =>
                                exportComponentAsPNG(
                                  this.LeadMatnrtrend,
                                  `${this.state.TrendMatnr}-Lead Time Trend chart`
                                )
                              }>
                              <i className="fas fa-image" />
                            </Button>
                          </div>

                          <div ref={this.LeadMatnrtrend}>
                            <DynamicChart
                              stroke={this.state.color}
                              fill={this.state.color}
                              chart={this.state.chartChangeDD}
                              formatXAxis={this.formatXAxis}
                              data={this.state.getLeadTimeTrendingMaterialData}
                              Ydatakey="MEDIAN"
                              Xdatakey="PO_DATE"
                              Xvalue="Receipt Date"
                              Yvalue="LeadTime"
                              Tooltip={this.TooltipFormatLeadtimeMaterial.bind(this)}
                              Legend={
                                <div className="float-left pl-40">
                                  <Popover
                                    placement="bottom"
                                    content={<span>Click to Change the color </span>}>
                                    {/* <ColorPicker
                                      animation="slide-up"
                                      color={this.state.color}
                                      onChange={this.changeHandler}
                                      className="some-className"
                                    /> */}
                                    <span className="legend-cls">- LeadTime </span>
                                  </Popover>
                                </div>
                              }
                            />
                          </div>
                        </>
                      ) : (
                        <>
                          {this.props.getLeadTimeTrendingMaterialReducerLoader ? (
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
                  </>
                ) : (
                  <>
                    {this.props.getLeadTimeMaterialTrendwiseLoaderReducerLoader ? (
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
              </Col>
            </Row>
          </div>
        </Modal>

        {/* //leadtime trend Modal */}
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              LeadTime(Median) Trend
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.leadtimeTrendModal}
          onCancel={this.onclickToDDLeadtimeTrendClose.bind(this)}>
          <Row className="mt-2 v4">
            <div className="head-title">
              {' '}
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right "
                onClick={this.exportToCSVLeadTimeTrendView}>
                <i className="fas fa-file-excel" />
              </Button>
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={() => exportComponentAsPNG(this.LeadTimeTrendImg, 'Lead Time Trend')}>
                <i className="fas fa-image" />
              </Button>
              <span className="float-right">
                <Select
                  className="chart-select"
                  value={this.state.chartChange}
                  style={{ width: 120 }}
                  onChange={this.handleChartChange.bind(this)}>
                  <Option value="LINE">Line</Option>
                  <Option value="AREA">Area</Option>

                  <Option value="BAR">Bar</Option>
                </Select>
              </span>
            </div>

            <div ref={this.LeadTimeTrendImg}>
              <DynamicChart
                stroke={this.state.color}
                fill={this.state.color}
                chart={this.state.chartChange}
                formatXAxis={this.formatXAxis}
                data={this.state.getLeadTimeTrending1Data}
                Ydatakey="MEDIAN"
                Xdatakey="PO_DATE"
                Xvalue="Receipt Date"
                Yvalue="LeadTime"
                Tooltip={this.TooltipFormatLeadTimeTrending}
                Legend={
                  <div className="float-left pl-40">
                    <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                      {/* <ColorPicker
                        animation="slide-up"
                        color={this.state.color}
                        onChange={this.changeHandler}
                        className="some-className"
                      /> */}

                      <span className="legend-cls">- LeadTime(Median)</span>
                    </Popover>
                  </div>
                }
              />
            </div>
          </Row>
        </Modal>

        {/* end */}

        {/* //modal for leadtime matnr manuf org */}

        <Modal
          width="70%"
          footer={null}
          className="modal-turnover"
          visible={this.state.openViewMoreModal}
          onCancel={this.handleModal}
          title={
            <Row>
              <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                <span className="float-left mr-2">
                  <i className="fas fa-hourglass-half"></i>
                </span>
                <span className="tab-head">Lead Time</span>
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
                  data={this.state.getLeadTimeMaterialData}
                  columns={this.state.LeadTimeMaterialColumn}
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
                          {this.state.getLeadTimeMaterialData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVLeadtimeMtnr}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVLeadtimeMtnr}>
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
                        <div>
                          <BootstrapTable
                            {...props.baseProps}
                            //pagination={paginationFactory()}
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
                  data={this.state.getLeadTimeManufData}
                  columns={this.state.LeadTimeManufColumn}
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
                          {this.state.getLeadTimeManufData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVLeadtimeManuf.bind(this)}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVLeadtimeManuf.bind(this)}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndLeadTimeManufColumn.bind(this)}
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
            <TabPane tab="Organization" key="3">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getLeadTimeOrgData}
                  columns={this.state.LeadTimeOrtgColumn}
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
                          {this.state.getLeadTimeOrgData != 0 ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVLeadtimeOrg.bind(this)}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVLeadtimeOrg.bind(this)}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEndLeadTimeOrtgColumn.bind(this)}
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
          </Tabs>
        </Modal>

        {/* ##################################################  action modal ############################################# */}
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
          visible={this.state.ActionModalmatnr}
          onCancel={this.onclickActionMatnr.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getLeadTimeTrendingMaterialReducerLoader &&
            this.state.getLeadTimeTrendingMaterialData.length > 0 ? (
              <>
                <div className="head-title">
                  {' '}
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVLeadtimetrend.bind(this)}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.LeadMatnrtrend,
                        `${this.state.materialNo}-Lead Time Trend Chart`
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

                <div ref={this.LeadMatnrtrend}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getLeadTimeTrendingMaterialData}
                    Ydatakey="MEDIAN"
                    Xdatakey="PO_DATE"
                    Xvalue="Receipt Date"
                    Yvalue="LeadTime"
                    Tooltip={this.TooltipFormatLeadtimeMaterial.bind(this)}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-className"
                          /> */}

                          <span className="legend-cls">- LeadTime(Median)</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getLeadTimeTrendingMaterialReducerLoader ? (
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

        {/* //modal for leadtime manuf */}
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
          visible={this.state.ActionModalmanuf}
          onCancel={this.onclickActionManuf.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getLeadTimeTrendingManufReducerLoader &&
            this.state.getLeadTimeTrendingManufData.length > 0 ? (
              <>
                <div className="head-title">
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVLeadtimemanuftrend.bind(this)}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.LeadManuftrend,
                        `${this.state.manuf}- LeadTime Trend Chart`
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

                <div ref={this.LeadManuftrend}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getLeadTimeTrendingManufData}
                    Ydatakey="MEDIAN"
                    Xdatakey="PO_DATE"
                    Xvalue="Receipt Date"
                    Yvalue="LeadTime"
                    Tooltip={this.TooltipFormatLeadtimeMaterial.bind(this)}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-className"
                          /> */}

                          <span className="legend-cls">- LeadTime(Median)</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getLeadTimeTrendingManufReducerLoader ? (
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
        {/* //modal for leadtime org */}
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
          visible={this.state.ActionModalorg}
          onCancel={this.onclickActionOrg.bind(this)}>
          <Row className="mt-2 v4">
            {!this.props.getLeadTimeTrendingOrgLoaderReducer &&
            this.state.getLeadTimeTrendingOrgData.length > 0 ? (
              <>
                <div className="head-title">
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right "
                    onClick={this.exportToCSVLeadtimeOrgftrend.bind(this)}>
                    <i className="fas fa-file-excel" />
                  </Button>
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={() =>
                      exportComponentAsPNG(
                        this.LeadOrgtrend,
                        `${this.state.org}-LeadTime Trend Chart`
                      )
                    }>
                    <i className="fas fa-image" />
                  </Button>
                  <span className="float-right ">
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

                <div ref={this.LeadOrgtrend}>
                  <DynamicChart
                    stroke={this.state.color}
                    fill={this.state.color}
                    chart={this.state.chartChangeDD}
                    formatXAxis={this.formatXAxis}
                    data={this.state.getLeadTimeTrendingOrgData}
                    Ydatakey="MEDIAN"
                    Xdatakey="PO_DATE"
                    Xvalue="Receipt Date"
                    Yvalue="LeadTime"
                    Tooltip={this.TooltipFormatLeadtimeMaterial.bind(this)}
                    Legend={
                      <div className="float-left pl-40">
                        <Popover
                          placement="bottom"
                          content={<span>Click to Change the color </span>}>
                          {/* <ColorPicker
                            animation="slide-up"
                            color={this.state.color}
                            onChange={this.changeHandler}
                            className="some-className"
                          /> */}

                          <span className="legend-cls">- LeadTime(Median)</span>
                        </Popover>
                      </div>
                    }
                  />
                </div>
              </>
            ) : (
              <>
                {this.props.getLeadTimeTrendingOrgLoaderReducer ? (
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

        {/* {model for Leadtime infocircle} */}
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>LeadTime - Description</div>}
          className="Intervaltimeline"
          visible={this.state.ModalTo}
          onCancel={this.infoTO}
          // width={150}
        >
          <div>
            <p>
              <strong>LeadTime</strong>
            </p>
            <ul>
              <li>
                Description : The amount of time between when a purchase order is placed to
                replenish products and when the order is received in the warehouse.
              </li>
            </ul>
            <div className="KpiLt-img" />
          </div>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  return {
    getLeadTimeMaterialData: state.getLeadTimeMaterial,
    getLeadTimeTrendingMaterialData: state.getLeadTimeTrendingMaterial,
    getLeadTimeTrendingMaterialReducerLoader: state.getLeadTimeTrendingMaterialReducerLoader,
    getLeadTimeManufData: state.getLeadTimeManuf,
    getLeadTimeTrendingManufData: state.getLeadTimeTrendingManuf,
    getLeadTimeTrendingManufReducerLoader: state.getLeadTimeTrendingManufReducerLoader,
    getLeadTimeOrgData: state.getLeadTimeOrg,
    getLeadTimeTrendingOrgData: state.getLeadTimeTrendingOrg,
    getLeadTimeTrendingOrgLoaderReducer: state.getLeadTimeTrendingOrgLoaderReducer,
    getLeadTimeOverallData: state.getLeadTimeOverall,
    getLeadTimeTrending1Data: state.getLeadTimeTrending1,
    getLeadTimeMaterialTrendwiseData: state.getLeadTimeMaterialTrendwise,
    getLeadTimeMaterialTrendwiseLoaderReducerLoader:
      state.getLeadTimeMaterialTrendwiseLoaderReducerLoader,
    getLeadTimeMaterialTrendwiseUpData: state.getLeadTimeMaterialTrendwiseUp,
    getLeadTimeMaterialTrendwiseDownData: state.getLeadTimeMaterialTrendwiseDown,
    getLeadTimeMaterialTrendwiseNeutralData: state.getLeadTimeMaterialTrendwiseNeutral,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails
  };
}

export default connect(mapState, {
  getLeadTimeMaterialTrendwiseNeutral,
  getLeadTimeMaterialTrendwiseDown,
  getLeadTimeMaterialTrendwiseUp,
  getLeadTimeMaterialTrendwise,
  getLeadTimeTrending1,
  getLeadTimeTrendingOrg,
  getLeadTimeOrg,
  getLeadTimeTrendingManuf,
  getLeadTimeManuf,

  getLeadTimeMaterial,
  getLeadTimeTrendingMaterial,
  getLeadTimeOverall,
  getUserImpersonationDetails
})(KpiWidjet);
