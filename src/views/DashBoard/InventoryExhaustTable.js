import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
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
  Legend,
  ReferenceLine,
  Tooltip,
  LineChart
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
  Switch,
  Popover,
  Input,
  Select,
  TreeSelect,
  DatePicker
} from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import TextareaAutosize from 'react-textarea-autosize';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';

import {
  getExhaustDetails,
  getExhaustDetailsbyId,
  getWeeklyStockVisualization,
  getMonthlyStockVisualization,
  getMaterialforPushPull,
  getPONumberForMaterial,
  getPOLineForPO,
  getExhaustDetailsV2,
  getApproverList,
  getUserImpersonationDetails,
  getLeadTimeTrendingMaterialEOQ,
  getCapGovMaterialReport
} from '../../actions';
import axios from 'axios';
import { ROOT_URL } from '../../actions/index';

import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import 'antd/dist/antd.css';
import ReactDragListView from 'react-drag-listview';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const { SearchBar } = Search;
const { TabPane } = Tabs;
const { TreeNode } = TreeSelect;
const { Option } = Select;
var parsedFilterSettingsLGORT;

let parsedBlockedDeleted;
class InventoryExhaustTable extends React.Component {
  constructor(props) {
    super(props);
    this.imploader = this.imploader.bind(this);
    this.handleMaterialChange = this.handleMaterialChange.bind(this);
    this.stockVisualization = React.createRef();
    this.costformat = this.costformat.bind(this);
    this.dateformat = this.dateformat.bind(this);
    this.sortFunc = this.sortFunc.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.exportToCSV1 = this.exportToCSV1.bind(this);
    this.materialDD = this.materialDD.bind(this);
    this.materialDD1 = this.materialDD1.bind(this);
    this.materialDescription = this.materialDescription.bind(this);
    this.exportToLeadtimeTrend = this.exportToLeadtimeTrend.bind(this);

    this.formatXAxis = this.formatXAxis.bind(this);
    this.numberDD = this.numberDD.bind(this);
    this.infoDD = this.infoDD.bind(this);
    this.DrilldownDD = this.DrilldownDD.bind(this);
    this.exportToCSVdrilldown = this.exportToCSVdrilldown.bind(this);
    this.getcheckValues = this.getcheckValues.bind(this);
    // this.tblLoaderOne = this.tblLoaderOne.bind(this);
    this.monthlyChart = this.monthlyChart.bind(this);
    this.weeklyChart = this.weeklyChart.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePoChange = this.handlePoChange.bind(this);
    this.handlePoLineChange = this.handlePoLineChange.bind(this);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);
    this.handlePushPullDateChange = this.handlePushPullDateChange.bind(this);
    this.handleSupplierChange = this.handleSupplierChange.bind(this);
    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handlePushPullChange = this.handlePushPullChange.bind(this);
    // this.handleSubmittedbyEmailChange =
    //   this.handleSubmittedbyEmailChange.bind(this);
    this.handleOverWrite = this.handleOverWrite.bind(this);

    this.state = {
      Material: '',
      usercuid: 'ALl',
      DurationCall: false,
      pushPullLoad: false,
      getLeadTimeTrendingMaterialEOQData: [],

      ApproverId: '',
      getUserImpersonationDetailsData: [],
      treeValueData: ['All Months', '14 Days', '1 Month', '3 Months', '6 Months', '9 Months'],
      Title: 'Material No- Stock Visualization Monthly',
      MaterialNo: '',
      tblData2: [],
      pass: 'All Months',
      dummy: [],
      tblData: [],
      getApproverListData: [],
      Approver: '',

      getExhaustDetailsbyIdData: [],
      getCapGovMaterialReportData: [],
      getWeeklyStockVisualizationData: [],
      getMonthlyStockVisualizationData: [],
      getExhaustDetailsV2Data: [],
      understockColumn: Boolean,
      Understockdata: Boolean,
      MaterialNodata: '',
      Descriptiondata: '',
      Inventorydata: '',
      Inventoryexhaustdatedata: '',
      Manufacturenamedata: '',
      Organizationdata: '',
      Openpodata: '',
      Overstockdata: Boolean,
      Polinenumberdata: '',
      Ponumberdata: '',
      Podatedate: '',
      Predictdemanddata: '',
      Requestshippingdatedata: '',
      Vendorcommitdatedata: '',
      DrilldownModal: false,
      InfoModal: false,
      timelineView: false,
      monthlyView: true,
      weeklyView: false,
      barDiagramView: '',
      startIndex: 0,
      chartTitle: (
        <span>
          <i className="fas fa-table mr-2" />
          Inventory Exhaust Detail
          <Popover placement="right" content={<span>Info</span>}>
            <i className="fas fa-info-circle info-logo-widget mr-2 ml-2" onClick={this.infoDD} />
          </Popover>
        </span>
      ),
      exhaustChartView: false,
      tableColumn: [
        {
          dataField: 'Material',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 },
          headerClasses: 'id-custom-cell',
          classes: 'material-position-fixed',
          formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 80 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Manufacturer',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Organization',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 115 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LeadTime',
          text: 'LeadTime',
          sort: true,
          headerStyle: { width: 100 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'CurrentInventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 150 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'PredictedDemandMonthly',
          text: 'Predicted Demand (Next month)',
          sort: true,
          headerStyle: { width: 128 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'OrdersInPipeline',
          text: 'Orders in Pipeline(QTY)',
          sort: true,
          headerStyle: { width: 120 },
          align: 'right',
          headerAlign: 'right'
        },

        {
          dataField: 'BoQty',
          text: 'Back Orders (Qty)',
          sort: true,
          headerStyle: { width: 146 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'PotentialHarvest',
          text: 'Potential Harvest (Qty)',
          sort: true,
          headerStyle: { width: 120 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'InventoryExhaustDate',
          text: 'Inventory Exhaust Date',
          sort: true,
          headerStyle: { width: 120 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'UnderStock',
          formatter: this.materialDD1,
          headerStyle: { width: 0 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'OverStock',
          text: 'Stock Level',
          sort: true,
          headerStyle: { width: 120 },
          formatter: this.materialDD
        },
        {
          dataField: 'Recommendation',
          text: 'Recommendation',
          sort: true,
          headerStyle: { width: 250 },
          align: 'left',
          headerAlign: 'left'
        }
      ],
      exhaustColumn: [
        {
          dataField: 'PO',
          text: 'PO',
          sort: true,
          headerStyle: { width: 90 },
          align: 'right',
          headerAlign: 'right'
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
          headerStyle: { width: 90 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'VendorName',
          text: 'Vendor Name',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Type',
          text: 'Type',
          sort: true,
          headerStyle: { width: 80 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Material',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Manufacturer',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 124 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MPN',
          text: 'MPN',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Plant',
          text: 'Plant',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'POCreated',
          text: 'PO Created',
          sort: true,
          headerStyle: { width: 107 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'VendorCommitDate',
          text: 'Vendor Commit Date',
          sort: true,
          headerStyle: { width: 114 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
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
          dataField: 'Push/Pull_Qty',
          text: 'Push/Pull Qty',
          sort: true,
          headerStyle: { width: 125 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'RequestedDeliveryDate',
          text: 'Requested Delivery Date',
          sort: true,
          headerStyle: { width: 120 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'LineValue',
          text: 'Line Value',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'OpenValue',
          text: 'Open Value',
          sort: true,
          headerStyle: { width: 110 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'POFlag',
          text: 'PO Flag',
          sort: true,
          headerStyle: { width: 110 },
          align: 'right',
          headerAlign: 'right'
        }
      ],
      isDataFetched: false,
      isDataFetched1: false,
      Loader: true,
      // newResultLength: "",
      setFlag: '',
      fullName: null,
      email: null,
      password: null,
      confirmDirty: false,
      autoCompleteResult: [],
      po_text: '',
      po_line: '',
      manufacturer: '',
      push_pull_date: '',
      supplier_name: '',
      push_pull_select: 'Push',
      comment: '',
      submittedbymail: sessionStorage.getItem('loggedEmailId'),
      Errors: {},
      getMaterialforPushPullData: [],
      material_no: '',
      LGORT: '',
      getPONumberForMaterialData: [],
      getPOLineForPOData: [],
      overwriteModal: false,
      requestalertData: '',
      defaultActiveKey: '1'
    };
  }

  componentDidMount() {
    this.props.getApproverList();
  }

  UNSAFE_componentWillUpdate(nextProps) {
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
    if (
      this.props.getLeadTimeTrendingMaterialEOQData != nextProps.getLeadTimeTrendingMaterialEOQData
    ) {
      if (nextProps.getLeadTimeTrendingMaterialEOQData != 0) {
        this.setState({
          getLeadTimeTrendingMaterialEOQData: nextProps.getLeadTimeTrendingMaterialEOQData,
          Loader: false
        });
      } else {
        this.setState({
          getLeadTimeTrendingMaterialEOQ: [],
          Loader: true
        });
      }
    }
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.imploader();
        const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

        parsedFilterSettingsLGORT = JSON.parse(filterSettingsOrg)[0].LGORT;
        parsedBlockedDeleted = JSON.parse(filterSettingsOrg)[0].BlockedDeleted;

        this.setState({
          organization: nextProps.getUserImpersonationDetailsData[0].FilterSetting,
          usercuid:
            nextProps.getUserImpersonationDetailsData[0].loggedcuid == null
              ? 'all'
              : nextProps.getUserImpersonationDetailsData[0].loggedcuid
        });
      }
    }
    if (this.props.getApproverListData != nextProps.getApproverListData) {
      if (nextProps.getApproverListData != 0) {
        this.setState({
          getApproverListData: nextProps.getApproverListData
        });
      } else {
        this.setState({
          getApproverListData: []
        });
      }
    }
    if (this.props.getExhaustDetailsV2Data != nextProps.getExhaustDetailsV2Data) {
      if (nextProps.getExhaustDetailsV2Data != 0) {
        this.setState({
          getExhaustDetailsV2Data: nextProps.getExhaustDetailsV2Data,
          isDataFetched: false
        });
      } else {
        this.setState({
          getExhaustDetailsV2Data: [],
          isDataFetched: true,
          newResultLength: 0
        });
      }
    }
    if (this.props.tblData != nextProps.tblData) {
      if (nextProps.tblData.Table != 0) {
        this.setState({
          tblData: nextProps.tblData.Table,
          understockColumn: nextProps.tblData.Table.UnderStock
        });
      } else {
        this.setState({
          tblData: []
        });
      }
    }
    if (this.props.getExhaustDetailsbyIdData != nextProps.getExhaustDetailsbyIdData) {
      if (nextProps.getExhaustDetailsbyIdData.Table != 0) {
        this.setState({
          getExhaustDetailsbyIdData: nextProps.getExhaustDetailsbyIdData.Table,
          isDataFetched1: false
        });
      } else {
        this.setState({
          getExhaustDetailsbyIdData: [],
          isDataFetched1: true
        });
      }
    }
    if (this.props.getWeeklyStockVisualizationData != nextProps.getWeeklyStockVisualizationData) {
      if (nextProps.getWeeklyStockVisualizationData != 0) {
        this.setState({
          Loader: false,
          getWeeklyStockVisualizationData: nextProps.getWeeklyStockVisualizationData
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
          Loader: false,
          getMonthlyStockVisualizationData: nextProps.getMonthlyStockVisualizationData
        });
      } else {
        this.setState({
          getMonthlyStockVisualizationData: [],
          Loader: true
        });
      }
    }

    if (this.props.getMaterialforPushPullData != nextProps.getMaterialforPushPullData) {
      if (nextProps.getMaterialforPushPullData != 0) {
        this.setState({
          Loader: false,
          getMaterialforPushPullData: nextProps.getMaterialforPushPullData
        });

        nextProps.getMaterialforPushPullData.map((val) => {
          this.setState({
            manufacturer: val.MANUFACTURER,
            supplier_name: val.ORGANIZATION
          });
        });
      }
    }
    if (this.props.getPONumberForMaterialData != nextProps.getPONumberForMaterialData) {
      if (nextProps.getPONumberForMaterialData != 0) {
        this.setState({
          Loader: false,
          getPONumberForMaterialData: nextProps.getPONumberForMaterialData
        });
      }
    }
    if (this.props.getPOLineForPOData != nextProps.getPOLineForPOData) {
      if (nextProps.getPOLineForPOData != 0) {
        this.setState({
          Loader: false,
          getPOLineForPOData: nextProps.getPOLineForPOData
        });
      }
    }
  }

  materialDD1(cell) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.understockColumn = cell;
  }

  materialDD(cell, row) {
    if (cell == false && row.UnderStock == false) {
      return (
        <Popover placement="right" content="Optimal">
          <span>
            <i className="fas fa-circle fa-2x milestone-risk-green"></i>
            {/* <i className="fas fa-arrows-alt-h ml-2"></i> */}
          </span>
        </Popover>
      );
    } else if (cell == false && row.UnderStock == true) {
      return (
        <Popover placement="right" content="Understock">
          <span>
            <i className="fas fa-circle fa-2x milestone-risk-red"></i>
            <i className="fa fa-arrow-down ml-2"></i>
          </span>
        </Popover>
      );
    } else if (cell == true && row.UnderStock == false) {
      return (
        <Popover placement="right" content="Overstock">
          <span>
            <i className="fas fa-circle fa-2x milestone-risk-yellow"></i>
            <i className="fa fa-arrow-up ml-2"></i>
          </span>
        </Popover>
      );
    } else {
      return <span>-</span>;
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
        <span className="row-data" onClick={() => this.DrilldownDD(row)}>
          {cell}
        </span>
      </Popover>
    );
  }

  infoDD() {
    if (this.state.InfoModal == true) {
      this.setState({
        InfoModal: false,
        defaultActiveKey: '1'
      });
    } else {
      this.setState({
        InfoModal: true,
        descriptionTitle: <div> Inventory Exhaust Detail - Recommendation</div>,
        WidDescription: (
          <div>
            <p>
              <strong>Place PO:</strong>
            </p>
            <ul>
              <li>When there are no Open Pos</li>
            </ul>
            <p>
              <strong>Deliver outstanding POs ASAP:</strong>
            </p>
            <ul>
              <li>When Open PO will last for next lead-time if delivered on requested ship date</li>
            </ul>
            <p>
              <strong>Deliver overdue POs ASAP &amp; Place PO</strong>
            </p>
            <ul>
              <li>
                When Open PO will not last for next lead-time if delivered on requested ship date
              </li>
            </ul>
            <p>
              <strong>Pull POs to exhaust date:</strong>
            </p>
            <ul>
              <li>
                When there is a gap between inventory exhaust date and requested ship date. And Open
                PO will last for next lead-time if delivered on requested ship date
              </li>
            </ul>
            <p>
              <strong>Pull POs to exhaust date &amp; Place PO:</strong>
            </p>
            <ul>
              <li>
                When there is a gap between inventory exhaust date and requested ship date. And Open
                PO will not last for next lead-time if delivered on requested ship date
              </li>
            </ul>
            <p>
              <strong>Overstock:</strong>
            </p>
            <ul>
              <li>
                Inventory + Open Pos (within lead-time) + harvest incoming (within lead-time) &gt;
                (2*Reorder Point)
              </li>
            </ul>
            <p>
              <strong>Push POs to lead-time date:</strong>
            </p>
            <ul>
              <li>When material is overstock, push extra quantity</li>
            </ul>
          </div>
        )
      });
    }
  }
  DrilldownDD(e) {
    this.setState({
      defaultActiveKey: '1',
      material_no: e.Material,
      LGORT: e.LGORT,
      Title: e.Material + '-' + 'Stock Visualization Monthly'
    });

    if (this.state.DrilldownModal == true) {
      this.setState({
        getPOLineForPOData: [],
        defaultActiveKey: '1',
        DrilldownModal: false,
        isDataFetched1: false,
        getExhaustDetailsbyIdData: [],
        Errors: '',
        po_line: '',
        po_text: '',
        push_pull_date: '',
        manufacturer: '',
        supplier_name: '',
        comment: '',
        submittedbymail: '',
        // eslint-disable-next-line no-dupe-keys
        defaultActiveKey: '1'
      });
    } else {
      this.props.getExhaustDetailsbyId(e.Material, e.LGORT);
      this.props.getPONumberForMaterial(e.Material);

      this.setState({
        defaultActiveKey: '1',
        DrilldownModal: true,
        isDataFetched1: false,
        drilldowncsvtitle: e.Material,
        inventoryexhaustDate: e.InventoryExhaustDate,
        MaterialNo: e.Material,
        timelineView: false,

        drilldowntitle: (
          <div className="modal-title-css">
            <i className="fas fa-chart-line mr-2" /> {e.Material}{' '}
            {e.HECI != '' ? '(' + e.HECI + ')' : ''} - Inventory Exhaust Details
          </div>
        ),
        Drilldowndescriptionview: (
          <div className="exhaust-table">
            <Row>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Material: </span>
                <div className="text-highlight"> {e.Material}</div>
              </Col>

              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Predicted Demand(Next month): </span>
                <div className="text-highlight">{e.PredictedDemandMonthly}</div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Current Inventory: </span>
                <div className="text-highlight">{e.CurrentInventory}</div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Orders in Pipeline: </span>
                <div className="text-highlight">{e.OrdersInPipeline}</div>
              </Col>
            </Row>
            <Row>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Manufacturer Name: </span>
                <div>{e.Manufacturer}</div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Organization: </span>
                <div>{e.Organization}</div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Stock Level: </span>
                <div>
                  {e.OverStock == true && e.UnderStock == false ? (
                    <span>
                      <i className="fas fa-circle fa-2x milestone-risk-yellow mr-2"></i>
                      <span>Overstock</span>
                    </span>
                  ) : (
                    <div></div>
                  )}
                  {e.OverStock == false && e.UnderStock == true ? (
                    <span>
                      <i className="fas fa-circle fa-2x milestone-risk-red mr-2"></i>
                      <span>Understock</span>
                    </span>
                  ) : (
                    <div></div>
                  )}
                  {e.OverStock == false && e.UnderStock == false ? (
                    <span>
                      <i className="fas fa-circle fa-2x milestone-risk-green mr-2"></i>
                    </span>
                  ) : (
                    <div></div>
                  )}
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Lead Time: </span>
                <div>{e.LeadTime}</div>
              </Col>
            </Row>
            <Row>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Inventory Exhaust Date: </span>
                <div className="text-highlight">
                  {moment(e.InventoryExhaustDate).format('MM-DD-YYYY')}
                </div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Safety Stock: </span>
                <div className="text-highlight">{e.Safety_Stock}</div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Recommendation: </span>
                <div className="text-highlight">{e.Recommendation}</div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Push Quantity: </span>
                <div className="text-highlight"> {e.Push_Qty}</div>
              </Col>
            </Row>
            <Row>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Pull Quantity: </span>
                <div> {e.Pull_Qty}</div>
              </Col>

              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Place Quantity: </span>
                <div> {e.Place_Qty}</div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Description: </span>
                <div> {e.Description}</div>
              </Col>
            </Row>
          </div>
        )
      });
    }
  }

  costformat(cell) {
    var values = [];
    if (cell < 1000) {
      let value = (cell / 1).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>${value}</span>);
    } else if (cell < 9999 || cell < 1000000) {
      let value = (cell / 1).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>${value}</span>);
    } else if (cell < 10000000 || cell < 1000000000) {
      let value = (cell / 1).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>${value}</span>);
    } else if (cell < 1000000000000) {
      let value = (cell / 1).toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
      values.push(<span>${value}</span>);
    }
    return values;
  }

  dateformat(cell) {
    let value = moment(cell).format('MM-DD-YYYY');
    if (value == '01-01-2099' || cell == null || cell == '') {
      return <span>-</span>;
    } else {
      return <span>{value}</span>;
    }
  }

  numberDD(cell) {
    let value = cell;
    if (cell == null) {
      return <span>-</span>;
    } else {
      return <span>{value}</span>;
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

  tblLoader() {
    if (this.state.isDataFetched && this.state.newResultLength === 0) {
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

  tblLoaderdd() {
    if (this.state.isDataFetched1 || this.state.newResultLength1 === 0) {
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
  TooltipFormatterLeadTimeTrend(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>Monthly: {moment(e.payload[0].payload.PO_DATE).format('MMM-YYYY')}</b> <br />
          </span>
          <span className="text-white">
            <b>Median: {e.payload[0].payload.MEDIAN}</b> Days <br />
          </span>
        </div>
      );
    }
  }
  exportToLeadtimeTrend() {
    let csvData = this.state.getLeadTimeTrendingMaterialEOQData;

    let fileName = `${this.state.MaterialNo}- LeadTime Trend`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSV() {
    // let csvData = this.state.tblData;
    var dum = [];
    dum = this.state.getExhaustDetailsV2Data.map((obj) => {
      return {
        Material: obj.Material,
        LGORT: obj.LGORT,
        HECI: obj.HECI,
        STK_TYPE: obj.STK_TYPE,
        CTL_STOCKOUT_FLAG: obj.CTL_STOCKOUT_FLAG,
        Manufacture: obj.Manufacturer,
        Organization: obj.Organization,
        LeadTime: obj.LeadTime,
        CurrentInventory: obj.CurrentInventory,
        PredictedDemand_NextMonth: obj.PredictedDemandMonthly,
        OrdersInPipeline_QTY: obj.OrdersInPipeline,
        BoQty: obj.BoQty,
        PotentialHarvest: obj.PotentialHarvest,
        InventoryExhaustDate: obj.InventoryExhaustDate,
        StockLevel: obj.StockLevel,
        Recommendation: obj.Recommendation
      };
    });
    let csvData = dum;
    let fileName = 'Inventory Exhaust Detail';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSV1() {
    var dum = [];
    if (this.state.weeklyView == true) {
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
    } else {
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
    }
    let csvData = dum;
    let fileName = this.state.Title;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVdrilldown() {
    let csvData = this.state.getExhaustDetailsbyIdData;
    let fileName = `${this.state.drilldowncsvtitle} - Inventory Exhaust Detail`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exhaustView(e) {
    if (e.target.value == 'exhaustTable') {
      this.setState({
        chartTitle: (
          <span>
            <i className="fas fa-table mr-2" />
            Inventory Exhaust Detail
            <Popover placement="right" content={<span>Info</span>}>
              <i className="fas fa-info-circle info-logo-widget mr-2 ml-2" onClick={this.infoDD} />
            </Popover>
          </span>
        ),
        exhaustChartView: false
      });
    } else {
      this.setState({
        chartTitle: (
          <span>
            <i className="fas fa-chart-line mr-2" />
            Inventory Exhaust Chart
          </span>
        ),
        exhaustChartView: true
      });
    }
  }

  getcheckValues(checked) {
    if (checked == false) {
      this.setState({
        timelineView: true
      });
    } else {
      this.setState({
        timelineView: false
      });
    }
  }

  formatXAxis(tickItem) {
    return moment(tickItem).format('MMM-YYYY');
  }
  formatXAxisLeadTime(tickItem) {
    return moment(tickItem).format('MMM-YYYY');
  }

  handlePoChange(e) {
    if (this.state.po_text != e) {
      this.setState({ po_line: '', po_text: e });
      this.props.getPOLineForPO(this.state.material_no, e);
    } else {
      if (isNaN(Number(e))) {
        return;
      } else {
        this.setState({ po_text: e });
        this.props.getPOLineForPO(this.state.material_no, e);
      }
    }
  }

  handlePoLineChange(e) {
    if (isNaN(Number(e))) {
      return;
    } else {
      this.setState({ po_line: e });
    }
  }
  handleManufacturerChange(e) {
    this.setState({ manufacturer: e.target.value });
  }
  handleSupplierChange(e) {
    this.setState({
      supplier_name: e.target.value
    });
  }
  handlePushPullDateChange(name, dateStrings) {
    let data = moment(dateStrings, 'MM-DD-YYYY');
    this.setState({ push_pull_date: data });
  }

  handleCommentChange(e) {
    this.setState({ comment: e.target.value });
  }
  handlePushPullChange(e) {
    this.setState({ push_pull_select: e });
  }
  monthlyChart() {
    this.setState({
      weeklyView: false,
      monthlyView: true,
      Title: `${this.state.MaterialNo}- Stock Visualization Monthly`
    });
    this.props.getMonthlyStockVisualization(this.state.material_no, this.state.LGORT);
    this.props.getCapGovMaterialReport(
      this.state.material_no,
      this.state.usercuid,
      'all',

      this.state.LGORT,
      parsedBlockedDeleted,
      'MATERIAL'
    );
  }
  weeklyChart() {
    this.setState({
      weeklyView: true,
      monthlyView: false,
      Title: `${this.state.MaterialNo}- Stock Visualization Weekly`
    });
    this.props.getWeeklyStockVisualization(this.state.material_no, this.state.LGORT);
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
              Ending on hand(QTY):{' '}
              <span className="ending-on-hand-text font-14">
                {e.payload[0].payload.Ending_on_hand}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Predicted Consumption(QTY):{' '}
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
  validateForm() {
    let Errors = {};
    let formIsValid = true;
    if (!this.state.po_text) {
      formIsValid = false;
      Errors['po_text'] = '*PO is required';
    }
    if (!this.state.po_line) {
      formIsValid = false;
      Errors['po_line'] = '*PO Line is required';
    }
    if (!this.state.manufacturer) {
      formIsValid = false;
      Errors['manufacturer'] = '*Manufacturer is required';
    }
    if (!this.state.push_pull_select) {
      formIsValid = false;
      Errors['push_pull_select'] = '*Push/Pull is required';
    }
    if (!this.state.push_pull_date) {
      formIsValid = false;
      Errors['push_pull_date'] = '*Push/Pull Date is required';
    }
    if (!this.state.supplier_name) {
      formIsValid = false;
      Errors['supplier_name'] = '*Supplier is required';
    }
    if (!this.state.comment) {
      formIsValid = false;
      Errors['comment'] = '*Comment is required';
    }
    if (!this.state.Approver) {
      formIsValid = false;
      Errors['Approver'] = '*Approver is required';
    }
    // if (!this.state.submittedbymail) {
    //   formIsValid = false;
    //   Errors["submittedbymail"] = "*Submit by Email is required";
    // }
    this.setState({
      Errors: Errors
    });
    return formIsValid;
  }

  // {old push pull form handleSubmit}

  // handleSubmit(e) {
  //   const PO = this.state.po_text;
  //   const PO_Line = this.state.po_line;
  //   const MATERIAL = this.state.material_no;
  //   const PUSH_PULL_DATE = this.state.push_pull_date._i;
  //   const SUPPLIER = this.state.supplier_name;
  //   const MANUFACTURER = this.state.manufacturer;
  //   const PUSH_PULL = this.state.push_pull_select;
  //   const COMMENT = this.state.comment;
  //   const SUBMITTED_BY = this.state.submittedbymail;
  //   if (this.validateForm()) {
  //     axios({
  //       url:
  //         ROOT_URL +
  //         "ValidateOrdersPushPull?Material=" +
  //         MATERIAL +
  //         "&PO=" +
  //         PO +
  //         "&POLine=" +
  //         PO_Line,
  //       method: "get",
  //     }).then((res) => {
  //       const parseData = JSON.parse(res.data);
  //       this.setState({
  //         requestalertData: parseData[0].Message,
  //       });
  //       if (parseData[0].Flag == "N") {
  //         axios({
  //           url:
  //             ROOT_URL +
  //             "PostPushPullDetails?PO=" +
  //             PO +
  //             "&PO_Line=" +
  //             PO_Line +
  //             "&MATERIAL=" +
  //             MATERIAL +
  //             "&SUPPLIER=" +
  //             SUPPLIER +
  //             "&MANUFACTURER=" +
  //             MANUFACTURER +
  //             "&PUSH_PULL=" +
  //             PUSH_PULL +
  //             "&PUSH_PULL_DATE=" +
  //             PUSH_PULL_DATE +
  //             "&COMMENT=" +
  //             COMMENT +
  //             "&SUBMITTED_BY=" +
  //             SUBMITTED_BY,
  //           method: "post",
  //         }).then((res) => {
  //           if (res.status == 200) {
  //             NotificationManager.success(res.data, "", 2000);
  //             this.setState({
  //               Errors: "",
  //               material_no: "",
  //               po_text: "",
  //               po_line: "",
  //               manufacturer: "",
  //               push_pull_date: "",
  //               supplier_name: "",
  //               comment: "",
  //               submittedbymail: "",
  //               push_pull_select: "Push",
  //               DrilldownModal: false,
  //             });
  //           } else {
  //             NotificationManager.error("Data Not Updated", "", 2000);
  //             this.setState({
  //               Errors: "",
  //               material_no: "",
  //               po_text: "",
  //               po_line: "",
  //               manufacturer: "",
  //               push_pull_date: "",
  //               supplier_name: "",
  //               comment: "",
  //               submittedbymail: "",
  //               push_pull_select: "Push",
  //               DrilldownModal: false,
  //             });
  //           }
  //         });
  //       } else {
  //         this.handleOverWrite(e);
  //       }
  //     });
  //     e.preventDefault();
  //   } else {
  //     e.preventDefault();
  //     this.setState({
  //       DrilldownModal: false,
  //     });
  //   }
  //   this.props.getExhaustDetails();
  // }
  // {old push pull form handleoverride}
  // handleOverWrite(e) {
  //   this.setState({
  //     overwriteModal: true,
  //   });
  //   if (e.target.value == "Yes") {
  //     this.setState({
  //       overwriteModal: false,
  //     });
  //     const PO = this.state.po_text;
  //     const PO_Line = this.state.po_line;
  //     const MATERIAL = this.state.material_no;
  //     const PUSH_PULL_DATE = this.state.push_pull_date._i;
  //     const SUPPLIER = this.state.supplier_name;
  //     const MANUFACTURER = this.state.manufacturer;
  //     const PUSH_PULL = this.state.push_pull_select;
  //     const COMMENT = this.state.comment;
  //     const SUBMITTED_BY = this.state.submittedbymail;

  //     axios({
  //       url:
  //         ROOT_URL +
  //         "PostPushPullDetails?PO=" +
  //         PO +
  //         "&PO_Line=" +
  //         PO_Line +
  //         "&MATERIAL=" +
  //         MATERIAL +
  //         "&SUPPLIER=" +
  //         SUPPLIER +
  //         "&MANUFACTURER=" +
  //         MANUFACTURER +
  //         "&PUSH_PULL=" +
  //         PUSH_PULL +
  //         "&PUSH_PULL_DATE=" +
  //         PUSH_PULL_DATE +
  //         "&COMMENT=" +
  //         COMMENT +
  //         "&SUBMITTED_BY=" +
  //         SUBMITTED_BY,
  //       method: "post",
  //     }).then((res) => {
  //       if (res.status == 200) {
  //         NotificationManager.success(res.data, "", 2000);
  //         this.setState({
  //           Errors: "",
  //           material_no: "",
  //           po_text: "",
  //           po_line: "",
  //           manufacturer: "",
  //           push_pull_date: "",
  //           supplier_name: "",
  //           comment: "",
  //           submittedbymail: "",
  //           push_pull_select: "Push",
  //           DrilldownModal: false,
  //         });
  //       } else {
  //         NotificationManager.error("Data Not Updated", "", 2000);
  //         this.setState({
  //           Errors: "",
  //           material_no: "",
  //           po_text: "",
  //           po_line: "",
  //           manufacturer: "",
  //           push_pull_date: "",
  //           supplier_name: "",
  //           comment: "",
  //           submittedbymail: "",
  //           push_pull_select: "Push",
  //           DrilldownModal: false,
  //         });
  //       }
  //     });
  //   } else {
  //     NotificationManager.warning("No datas inserted", "", 2000);
  //     this.setState({
  //       overwriteModal: false,
  //       Errors: "",
  //       material_no: "",
  //       po_text: "",
  //       po_line: "",
  //       manufacturer: "",
  //       push_pull_date: "",
  //       supplier_name: "",
  //       comment: "",
  //       submittedbymail: "",
  //       push_pull_select: "Push",
  //       DrilldownModal: false,
  //     });
  //   }
  //   this.props.getExhaustDetails();
  // }
  handleSubmit(e) {
    const PO = this.state.po_text;
    const PO_Line = this.state.po_line;
    const MATERIAL = this.state.material_no;
    const PUSH_PULL_DATE = this.state.push_pull_date._i;
    const SUPPLIER = this.state.supplier_name;
    const MANUFACTURER = this.state.manufacturer;
    const PUSH_PULL = this.state.push_pull_select;
    const COMMENT = this.state.comment;
    const SUBMITTED_BY = sessionStorage.getItem('loggedEmailId');
    const Approver = this.state.ApproverId;
    if (this.validateForm()) {
      this.setState({
        pushPullLoad: true
      });
      axios({
        url:
          ROOT_URL +
          'ValidateOrdersPushPull?Material=' +
          MATERIAL +
          '&PO=' +
          PO +
          '&POLine=' +
          PO_Line,
        method: 'get'
      }).then((res) => {
        const parseData = JSON.parse(res.data);
        this.setState({
          requestalertData: parseData[0].Message
        });
        if (parseData[0].Flag == 'N') {
          axios({
            url:
              ROOT_URL +
              'PostPushPullDetailsV2?PO=' +
              PO +
              '&PO_Line=' +
              PO_Line +
              '&MATERIAL=' +
              MATERIAL +
              '&SUPPLIER=' +
              SUPPLIER +
              '&MANUFACTURER=' +
              MANUFACTURER +
              '&PUSH_PULL=' +
              PUSH_PULL +
              '&PUSH_PULL_DATE=' +
              PUSH_PULL_DATE +
              '&COMMENT=' +
              COMMENT +
              '&SUBMITTED_BY=' +
              SUBMITTED_BY +
              '&Approver=' +
              Approver,
            method: 'post'
          }).then((res) => {
            if (res.status == 200) {
              NotificationManager.success(res.data, '', 2000);
              this.setState({
                pushPullLoad: false,
                Errors: '',
                // material_no: "",
                po_text: '',
                po_line: '',
                manufacturer: '',
                push_pull_date: '',
                supplier_name: '',
                comment: '',
                submittedbymail: '',
                Approver: '',
                push_pull_select: 'Push',
                addpushpullinfoModal: false
              });
              if (this.state.pullView == false) {
                this.props.getOrderPushPullMaterial('Push');
              } else {
                this.props.getOrderPushPullMaterial('Pull');
              }
            } else {
              NotificationManager.error('Data Not Updated', '', 2000);
              this.setState({
                Errors: '',
                pushPullLoad: false,
                // material_no: "",
                po_text: '',
                po_line: '',
                manufacturer: '',
                push_pull_date: '',
                supplier_name: '',
                comment: '',
                Approver: '',
                submittedbymail: '',
                push_pull_select: 'Push',
                addpushpullinfoModal: false
              });
              if (this.state.pullView == false) {
                this.props.getOrderPushPullMaterial('Push');
              } else {
                this.props.getOrderPushPullMaterial('Pull');
              }
            }
          });
        } else {
          this.handleOverWrite(e);
        }
      });
      e.preventDefault();
    } else {
      e.preventDefault();
    }
  }

  handleYes() {
    this.setState({
      overwriteModal: false
    });
    const PO = this.state.po_text;
    const PO_Line = this.state.po_line;
    const MATERIAL = this.state.material_no;
    const PUSH_PULL_DATE = this.state.push_pull_date._i;
    const SUPPLIER = this.state.supplier_name;
    const MANUFACTURER = this.state.manufacturer;
    const PUSH_PULL = this.state.push_pull_select;
    const COMMENT = this.state.comment;
    const SUBMITTED_BY = this.state.email;
    const Approver = this.state.ApproverId;

    axios({
      url:
        ROOT_URL +
        'PostPushPullDetailsV2?PO=' +
        PO +
        '&PO_Line=' +
        PO_Line +
        '&MATERIAL=' +
        MATERIAL +
        '&SUPPLIER=' +
        SUPPLIER +
        '&MANUFACTURER=' +
        MANUFACTURER +
        '&PUSH_PULL=' +
        PUSH_PULL +
        '&PUSH_PULL_DATE=' +
        PUSH_PULL_DATE +
        '&COMMENT=' +
        COMMENT +
        '&SUBMITTED_BY=' +
        SUBMITTED_BY +
        '&Approver=' +
        Approver,
      method: 'post'
    }).then((res) => {
      if (res.status == 200) {
        NotificationManager.success(res.data, '', 2000);
        this.setState({
          pushPullLoad: false,
          Errors: '',
          // material_no: "",
          po_text: '',
          po_line: '',
          manufacturer: '',
          push_pull_date: '',
          supplier_name: '',
          comment: '',
          submittedbymail: '',
          Approver: '',
          push_pull_select: 'Push',
          addpushpullinfoModal: false
        });
        if (this.state.pullView == false) {
          this.props.getOrderPushPullMaterial('Push');
        } else {
          this.props.getOrderPushPullMaterial('Pull');
        }
      } else {
        NotificationManager.error('Data Not Updated', '', 2000);
        this.setState({
          pushPullLoad: false,
          Errors: '',
          // material_no: "",
          po_text: '',
          po_line: '',
          manufacturer: '',
          push_pull_date: '',
          supplier_name: '',
          comment: '',
          submittedbymail: '',
          Approver: '',
          push_pull_select: 'Push',
          addpushpullinfoModal: false
        });
        if (this.state.pullView == false) {
          this.props.getOrderPushPullMaterial('Push');
        } else {
          this.props.getOrderPushPullMaterial('Pull');
        }
      }
    });
  }
  handleNo() {
    NotificationManager.warning('No datas inserted', '', 2000);
    this.setState({
      pushPullLoad: false,
      overwriteModal: false,
      Errors: '',
      // material_no: "",
      po_text: '',
      po_line: '',
      manufacturer: '',
      push_pull_date: '',
      supplier_name: '',
      comment: '',
      submittedbymail: '',
      Approver: '',
      push_pull_select: 'Push',
      addpushpullinfoModal: false
    });
    if (this.state.pullView == false) {
      this.props.getOrderPushPullMaterial('Push');
    } else {
      this.props.getOrderPushPullMaterial('Pull');
    }
  }
  handleOverWrite() {
    this.setState({
      overwriteModal: true
    });
  }

  // handleSubmittedbyEmailChange(e) {
  //   const email = e.target.value;
  //   this.setState({ submittedbymail: e.target.value });
  //   var re =
  //     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;
  //   if (re.test(email)) {
  //     //Email valid. Procees to test if it's from the right domain
  //     //   (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
  //     if (
  //       email.indexOf("@lumen.com", email.length - "@lumen.com".length) !==
  //         -1 ||
  //       email.indexOf(
  //         "@centurylink.com",
  //         email.length - "@centurylink.com".length
  //       ) !== -1
  //     ) {
  //       this.setState({ submittedbymail: e.target.value });
  //       NotificationManager.success("Valid Mail ID", "", 3000);
  //     } else {
  //       NotificationManager.info(
  //         "Invalid Mail ID please try with @lumen.com or @centurylink.com",
  //         "",
  //         4000
  //       );
  //       this.setState({ submittedbymail: " " });
  //     }
  //   }
  // }

  callback(key) {
    if (key == 2) {
      this.setState({
        Loader: true,
        defaultActiveKey: '2',
        weeklyView: false,
        monthlyView: true,
        Title: this.state.material_no + '-' + 'Stock Visualization Monthly'
      });
      this.props.getMonthlyStockVisualization(this.state.material_no, this.state.LGORT);
      this.props.getCapGovMaterialReport(
        this.state.material_no,
        this.state.usercuid,
        'all',

        this.state.LGORT,
        parsedBlockedDeleted,
        'MATERIAL'
      );
    } else if (key == 4) {
      this.setState({
        Loader: true,
        defaultActiveKey: '4'
      });
      this.props.getLeadTimeTrendingMaterialEOQ(this.state.material_no);
    } else if (key == 3) {
      this.setState({
        Loader: true,
        defaultActiveKey: '3'
      });
      this.props.getMaterialforPushPull(this.state.material_no);
    } else {
      this.setState({
        defaultActiveKey: '1'
      });
      this.props.getExhaustDetailsbyId(this.state.material_no, this.state.LGORT);
      this.props.getPONumberForMaterial(this.state.material_no);
    }
  }
  handleMaterialChange(e) {
    this.setState({
      isDataFetched: false
    });
    setTimeout(() => {
      if (this.state.usercuid != null) {
        this.props.getExhaustDetailsV2(
          e,
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getExhaustDetailsV2(
          e,
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
      this.setState({
        getExhaustDetailsV2Data: [],
        pass: e
      });
    }, 1000);
  }
  handleApproverChange(e) {
    this.state.getApproverListData.map((dat) =>
      dat.ApproverName == e ? this.setState({ ApproverId: dat.ID }) : ''
    );
    this.setState({
      Approver: e
    });
  }
  imploader() {
    this.setState({
      getExhaustDetailsV2Data: [],
      isDataFetched: false,
      newResultLength: '',
      isDataFetched1: false,
      newResultLength1: '',
      pass: 'All Months'
    });
  }
  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.tableColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ tableColumn: columnsCopy });
  }
  onDragEndDDTable(fromIndex, toIndex) {
    const columnsCopy = this.state.exhaustColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ exhaustColumn: columnsCopy });
  }
  DurationCall() {
    this.setState({
      DurationCall: !this.state.DurationCall
    });
  }
  render() {
    let btn_class_Weekly = this.state.weeklyView ? '' : 'white-btn';
    let btn_class_Monthly = this.state.monthlyView ? '' : 'white-btn';
    const dateFormat = 'MM-DD-YYYY';
    // const colors = ['#1870dc', 'red', 'orange'];

    return (
      <div>
        <NotificationContainer />
        <Row className="v4">
          <Row>
            <Col span={24} className="pr-2 pl-2">
              <Card>
                {this.state.exhaustChartView == false ? (
                  <div id="getPopupContainerDiv">
                    <ToolkitProvider
                      keyField="id"
                      data={this.state.getExhaustDetailsV2Data}
                      columns={this.state.tableColumn}
                      search={{
                        afterSearch: (newResult) => {
                          if (!newResult.length) {
                            if (this.state.getExhaustDetailsV2Data != 0) {
                              this.setState({
                                isDataFetched: true,
                                newResultLength: newResult.length
                              });
                            } else {
                              this.setState({
                                isDataFetched: false,
                                newResultLength: newResult.length
                              });
                            }
                          }
                        }
                      }}>
                      {(props) => (
                        <div>
                          <Row className="mt-15">
                            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                              {' '}
                              <span className="tblHeader">{this.state.chartTitle}</span>
                            </Col>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                              <span className="golden-text mt-1 mr-2 tblHeader">Duration : </span>
                              <span>
                                <TreeSelect
                                  showSearch
                                  style={{ width: '120px', fontSize: 14 }}
                                  value={this.state.pass}
                                  allowClear={false}
                                  treeDefaultExpandAll
                                  getPopupContainer={() =>
                                    document.getElementById('getPopupContainerDiv')
                                  }
                                  onChange={this.handleMaterialChange}
                                  className="exhaust_detail_select  mr-4">
                                  {this.state.treeValueData.map((val1, ind1) => (
                                    <TreeNode value={val1} title={val1} key={ind1} />
                                  ))}
                                </TreeSelect>
                              </span>
                              <span>
                                <SearchBar {...props.searchProps} />
                              </span>
                              <span>
                                {this.state.getExhaustDetailsV2Data != 0 ? (
                                  <Button
                                    size="sm"
                                    className="export-Btn mr-2 ml-3 float-right"
                                    onClick={this.exportToCSV}>
                                    <i className="fas fa-file-excel " />{' '}
                                  </Button>
                                ) : (
                                  <Button
                                    disabled
                                    size="sm"
                                    className="export-Btn mr-2 ml-3 float-right"
                                    onClick={this.exportToCSV}>
                                    <i className="fas fa-file-excel" />{' '}
                                  </Button>
                                )}
                              </span>
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
                ) : (
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                    <p>Chart View</p>
                    {/* <BarChart
                                            width={500}
                                            height={300}
                                            data={this.state.tblData}
                                            margin={{
                                                top: 20,
                                                right: 30,
                                                left: 20,
                                                bottom: 5
                                            }}
                                            >
                                            <XAxis dataKey="MATNR" />
                                            <YAxis />
                                            <Tooltip />
                                            <Bar dataKey="Inventory_exhaust_date" tickFormatter={this.formatYAxis} stackId="a" fill="#fbbc05" />
                                            <Bar dataKey="PO_date" stackId="a" tickFormatter={this.formatYAxis} fill="#4285f4" />
                                            <Bar dataKey="Req_shipping_date" tickFormatter={this.formatYAxis} stackId="a" fill="#ea4335" />
                                        </BarChart> */}
                  </Row>
                )}
              </Card>
            </Col>
          </Row>
        </Row>

        <Modal
          style={{ top: 60 }}
          footer={null}
          title={this.state.descriptionTitle}
          className="Intervaltimeline"
          visible={this.state.InfoModal}
          onCancel={this.infoDD}>
          {this.state.WidDescription}
        </Modal>
        <Modal
          width="90%"
          style={{ top: 60 }}
          footer={null}
          title={this.state.drilldowntitle}
          className="Intervaltimeline"
          visible={this.state.DrilldownModal}
          onCancel={this.DrilldownDD}
          destroyOnClose={true}>
          {this.state.Drilldowndescriptionview}
          <div className="border-line-between"></div>
          <Tabs activeKey={this.state.defaultActiveKey} onChange={this.callback.bind(this)}>
            <TabPane tab="PO Details" key="1">
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col span={12}>
                  <span className="view-text">
                    View :{' '}
                    <Switch
                      checkedChildren="Table View"
                      unCheckedChildren="Timeline View"
                      defaultChecked
                      onChange={this.getcheckValues}
                    />
                  </span>
                </Col>
              </Row>
              {this.state.timelineView == false ? (
                <div>
                  {!this.props.getExhaustDetailsbyIdReducerLoader &&
                  this.state.getExhaustDetailsbyIdData.length > 0 ? (
                    <>
                      {' '}
                      <ToolkitProvider
                        keyField="id1"
                        data={this.state.getExhaustDetailsbyIdData}
                        columns={this.state.exhaustColumn}
                        search={{
                          afterSearch: (newResult) => {
                            if (!newResult.length) {
                              if (this.state.getExhaustDetailsbyIdData != 0) {
                                this.setState({
                                  isDataFetched1: true,
                                  newResultLength1: newResult.length
                                });
                              } else {
                                this.setState({
                                  isDataFetched1: false,
                                  newResultLength1: ''
                                });
                              }
                            }
                          }
                        }}>
                        {(props) => (
                          <div>
                            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                              <Col span={24} className="float-right search-right">
                                <SearchBar {...props.searchProps} />
                                {this.state.getExhaustDetailsbyIdData != 0 ? (
                                  <Button
                                    size="sm"
                                    className="export-Btn ml-2 mr-2 float-right"
                                    onClick={this.exportToCSVdrilldown}>
                                    <i className="fas fa-file-excel " />{' '}
                                    {/* <span className="text-white">Excel</span> */}
                                  </Button>
                                ) : (
                                  <Button
                                    disabled
                                    size="sm"
                                    className="export-Btn ml-2 mr-2 float-right"
                                    onClick={this.exportToCSVdrilldown}>
                                    <i className="fas fa-file-excel " />{' '}
                                    {/* <span className="text-white">Excel</span> */}
                                  </Button>
                                )}
                              </Col>
                            </Row>
                            <ReactDragListView.DragColumn
                              onDragEnd={this.onDragEndDDTable.bind(this)}
                              nodeSelector="th">
                              <BootstrapTable
                                {...props.baseProps}
                                pagination={paginationFactory()}
                                noDataIndication={() => this.tblLoaderdd()}
                                filter={filterFactory()}
                              />
                            </ReactDragListView.DragColumn>
                          </div>
                        )}
                      </ToolkitProvider>
                    </>
                  ) : (
                    <>
                      <div style={{ height: '400px' }} className="position-relative">
                        {this.props.getExhaustDetailsbyIdReducerLoader ? (
                          <>
                            <ReusableSysncLoader />{' '}
                          </>
                        ) : (
                          <>
                            {' '}
                            <NoDataTextLoader />
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div>
                  {!this.props.getExhaustDetailsbyIdReducerLoader &&
                  this.state.getExhaustDetailsbyIdData.length > 0 ? (
                    <>
                      <VerticalTimeline>
                        {this.state.getExhaustDetailsbyIdData.map((val, i) => (
                          <VerticalTimelineElement
                            key={i}
                            className="vertical-timeline-element--work"
                            contentStyle={{
                              background: 'rgb(33, 150, 243)',
                              color: '#fff'
                            }}
                            contentArrowStyle={{
                              borderRight: '7px solid  rgb(33, 150, 243)'
                            }}
                            date={moment(val.TimelineDate).format('MM-DD-YYYY')}
                            icon={
                              <i className="fa fa-circle milestone-risk-red position-left-40percent" />
                            }>
                            <div>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col
                                  xs={24}
                                  sm={24}
                                  md={24}
                                  lg={24}
                                  xl={24}
                                  className="text-center">
                                  {' '}
                                  <span className="font-14">
                                    PO: <span className="pohighlight">{val.PO}</span>
                                  </span>
                                </Col>
                              </Row>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                  {' '}
                                  <span className="font-12 line-height-1.3">PO Line : </span>
                                  <div className="font-12 line-height-1.3">{val.POLine}</div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                  {' '}
                                  <span className="font-12 line-height-1.3">Manufacturer : </span>
                                  <div className="font-12 line-height-1.3">{val.VendorName}</div>
                                </Col>
                                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                  {' '}
                                  <span className="font-12 line-height-1.3">PO Date : </span>
                                  <div className="font-12 line-height-1.3">
                                    {moment(val.POCreated).format('MM-DD-YYYY')}
                                  </div>
                                </Col>
                              </Row>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col xs={24} sm={24} md={24} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">PO Qty : </span>
                                  <div className="font-12 line-height-1.3">{val.POQty}</div>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">Open Qty : </span>
                                  <div className="font-12 line-height-1.3">{val.OpenQty}</div>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">
                                    Requested Delivery Date :{' '}
                                  </span>
                                  <div className="font-12 line-height-1.3">
                                    {moment(val.RequestedDeliveryDate).format('MM-DD-YYYY')}
                                  </div>
                                </Col>
                              </Row>
                              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                  {' '}
                                  <span className="font-12 line-height-1.3">
                                    Inventory Exhaust Date :{' '}
                                  </span>
                                  <div className="pohighlight font-12 line-height-1.3">
                                    {moment(this.state.inventoryexhaustDate).format('MM-DD-YYYY')}
                                  </div>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">
                                    Vendor Commit Date :{' '}
                                  </span>
                                  <div className="font-12 line-height-1.3">
                                    {moment(val.VendorCommitDate).format('MM-DD-YYYY')}
                                  </div>
                                </Col>
                                <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                                  {' '}
                                  <span className="font-12 line-height-1.3">PO Flag : </span>
                                  <div className="pohighlight font-12 line-height-1.3">
                                    {val.POFlag}
                                  </div>
                                </Col>
                              </Row>
                            </div>
                          </VerticalTimelineElement>
                        ))}
                      </VerticalTimeline>
                    </>
                  ) : (
                    <>
                      <div style={{ height: '400px' }} className="position-relative">
                        {this.props.getExhaustDetailsbyIdReducerLoader ? (
                          <ReusableSysncLoader />
                        ) : (
                          <NoDataTextLoader />
                        )}
                      </div>
                    </>
                  )}
                </div>
              )}
            </TabPane>
            <TabPane tab="Stock Visualization" key="2">
              <Row>
                {' '}
                <Col span={24} className="mt-2">
                  {/* <Button
                  size="sm"
                  className="export-Btn ml-2 mr-2"
                  onClick={() => exportComponentAsPNG(this.stockVisualization)}
                >
                  <i className="fas fa-image" />
                </Button> */}
                  <Button.Group size="small" className="float-right">
                    <Button size="sm" className="export-Btn ml-2 mr-2 " onClick={this.exportToCSV1}>
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
              </Row>

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

              {this.state.monthlyView == true ? (
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
                          }}
                          ref={this.stockVisualization}>
                          <XAxis
                            dataKey="ds"
                            angle={-40}
                            tickFormatter={this.formatXAxis}
                            textAnchor="end"
                            height={150}
                            interval={0}
                            stroke="#fff"
                          />
                          <YAxis stroke="#fff" />
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
                          <Line type="monotone" dataKey="Predicted_consumption" stroke="#fa9105" />
                          {/* {this.state.getMonthlyStockVisualizationData.length > 20 && <Brush dataKey="ds" tickFormatter={this.formatXAxis} height={20} y={300} />} */}
                        </ComposedChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <>
                      {' '}
                      <div style={{ height: '400px' }} className="position-relative">
                        {this.props.getMonthlyStockVisualizationLoaderReducer ? (
                          <ReusableSysncLoader />
                        ) : (
                          <NoDataTextLoader />
                        )}
                      </div>
                    </>
                  )}

                  <ResponsiveContainer height={400} width="100%">
                    {!this.props.getCapGovMaterialReportLoaderReducer &&
                    this.state.getCapGovMaterialReportData.length > 0 ? (
                      <>
                        <ResponsiveContainer height={400} width="100%">
                          <BarChart
                            width="100%"
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
                                position="insideLeft"
                              />
                            </YAxis>
                            <Tooltip content={this.TooltipFormatterStackedBar} />
                            <Legend verticalAlign="top" height={36} />
                            <Bar dataKey="ACTUAL_DELIVERIES" stackId="a" fill="#1870dc" />
                            <Bar dataKey="CURRENT_ON_ORDERS" stackId="a" fill="#fa9105" />
                            <Bar dataKey="RECOMMENDED_NEW_ORDER" stackId="a" fill="#63ce46" />
                          </BarChart>
                        </ResponsiveContainer>
                      </>
                    ) : (
                      <>
                        <div style={{ height: '400px' }} className="position-relative">
                          {this.props.getCapGovMaterialReportLoaderReducer ? (
                            <ReusableSysncLoader />
                          ) : (
                            <NoDataTextLoader />
                          )}
                        </div>
                      </>
                    )}
                  </ResponsiveContainer>
                </span>
              ) : (
                <>
                  {' '}
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
                          }}
                          ref={this.stockVisualization}>
                          <XAxis
                            dataKey="ds"
                            angle={-40}
                            tickFormatter={this.formatXAxis}
                            textAnchor="end"
                            height={150}
                            interval={0}
                            stroke="#fff"
                          />
                          <YAxis stroke="#fff" />
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
                          <Line type="monotone" dataKey="Predicted_consumption" stroke="#fa9105" />
                          {/* {this.state.getWeeklyStockVisualizationData.length > 20 && <Brush dataKey="ds" data={this.state.getWeeklyStockVisualizationData} onChange={indices => this.setState({ startIndex: indices.startIndex })} tickFormatter={this.formatXAxis} height={20} y={300} />} */}
                        </ComposedChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <>
                      {' '}
                      <div style={{ height: '400px' }} className="position-relative">
                        {this.props.getWeeklyStockVisualizationLoaderReducer ? (
                          <ReusableSysncLoader />
                        ) : (
                          <NoDataTextLoader />
                        )}
                      </div>{' '}
                    </>
                  )}
                </>
              )}
            </TabPane>
            <TabPane tab="Push/Pull PO" key="3">
              <Form onSubmit={this.handleSubmit} layout="vertical">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6} className="reduce-width-form">
                    <Form.Item label="PO" name="po_text" className="label-form-text">
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={this.state.po_text}
                        placeholder="Please select PO"
                        allowClear
                        treeDefaultExpandAll
                        onChange={this.handlePoChange}
                        className="text-select-form">
                        {this.state.getPONumberForMaterialData.map((val1, ind1) => (
                          <TreeNode value={val1.PO} title={val1.PO} key={ind1} />
                        ))}
                      </TreeSelect>
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['po_text'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6} className="reduce-width-form">
                    <Form.Item label="PO Line" name="po_line" className="label-form-text1">
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={this.state.po_line}
                        placeholder="Please select PO Line"
                        allowClear
                        treeDefaultExpandAll
                        onChange={this.handlePoLineChange}
                        className="text-select-form">
                        {this.state.getPOLineForPOData.map((val1, ind1) => (
                          <TreeNode value={val1.POLine} title={val1.POLine} key={ind1} />
                        ))}
                      </TreeSelect>
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['po_line'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6} className="reduce-width-form ">
                    <Form.Item
                      label="Manufacturer"
                      name="manufacturer"
                      className="label-form-text1">
                      <Input
                        prefix={<i className="fa fa-user icons-form" />}
                        type="text"
                        placeholder="Enter the Manufacturer"
                        id="manufacturer"
                        value={this.state.manufacturer}
                        className="text-input-form"
                        onChange={this.handleManufacturerChange}
                      />
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['manufacturer'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6} className="reduce-width-form ">
                    <Form.Item label="Organization" name="supplier" className="label-form-text1">
                      <Input
                        prefix={<i className="fa fa-sitemap icons-form supplier-icon" />}
                        type="text"
                        placeholder="Enter the Supplier"
                        id="supplier"
                        value={this.state.supplier_name}
                        className="text-input-form"
                        onChange={this.handleSupplierChange}
                      />
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['supplier_name'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6} className="reduce-width-form ">
                    <Form.Item
                      label="Push/Pull Date"
                      name="push_pull_date"
                      className="label-form-text1">
                      <DatePicker
                        allowClear={false}
                        className="InventoryExhaustPicker"
                        defaultValue={moment()}
                        value={this.state.push_pull_date}
                        format={dateFormat}
                        onChange={this.handlePushPullDateChange}
                        disabledDate={(current) => {
                          return moment().add(-1, 'days') >= current;
                        }}
                      />
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['push_pull_date'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6} className="reduce-width-form ">
                    <Form.Item
                      label="Push/Pull"
                      name="push_pull_select"
                      className="label-form-text1">
                      <Select
                        onChange={this.handlePushPullChange}
                        value={this.state.push_pull_select}
                        className="text-select-form">
                        <Option value="Push">Push</Option>
                        <Option value="Pull">Pull</Option>
                      </Select>
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['push_pull_select'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6} className="reduce-width-form ">
                    <Form.Item label="Approver" name="Approver" className="label-form-text1">
                      <TreeSelect
                        showSearch
                        style={{ width: '100%' }}
                        value={this.state.Approver}
                        placeholder="Please Choose Approver"
                        allowClear={false}
                        treeDefaultExpandAll
                        onChange={this.handleApproverChange.bind(this)}
                        className="text-select-form">
                        {this.state.getApproverListData.map((val1, ind1) => (
                          <TreeNode
                            value={val1.ApproverName}
                            title={val1.ApproverName}
                            key={ind1}
                          />
                        ))}
                      </TreeSelect>
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['Approver'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6} className="reduce-width-form">
                    <Form.Item
                      label="Submitted By(Email ID)"
                      name="submittedbymail"
                      className="label-form-text1">
                      <Input
                        prefix={<i className="fa fa-envelope icons-form" />}
                        type="email"
                        readOnly
                        placeholder="Enter your Email ID"
                        id="submittedbymail"
                        value={sessionStorage.getItem('loggedEmailId')}
                        className="text-input-form"
                      />
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['submittedbymail'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row className="offset-md-4" gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                    <Form.Item label="Comment" name="comment" className="label-form-text1 clss">
                      {/* <TextArea
                        type="text"
                        placeholder="Enter the Comment"
                        id="comment"
                        value={this.state.comment}
                        className="text-input-form"
                        onChange={this.handleCommentChange}
                        maxLength="140"
                      /> */}

                      <TextareaAutosize
                        minRows={1}
                        maxRows={6}
                        id="comment"
                        className="text-input-form cmnt-top ftsize fft"
                        // value={this.state.APPROVER_COMMENTS}
                        value={this.state.comment}
                        onChange={this.handleCommentChange}
                      />
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['comment'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ color: '#ffffff' }}
                    className="submit-button"
                    loading={this.state.pushPullLoad}>
                    Submit
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="LeadTime Trend" key="4">
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

              {!this.props.getLeadTimeTrendingMaterialEOQLoaderReducer &&
              this.state.getLeadTimeTrendingMaterialEOQData.length > 0 ? (
                <>
                  {' '}
                  <ResponsiveContainer height={400} width="100%">
                    <LineChart
                      width={900}
                      height={400}
                      data={this.state.getLeadTimeTrendingMaterialEOQData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 20,
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
                  {' '}
                  <div style={{ height: '400px' }} className="position-relative">
                    {this.props.getLeadTimeTrendingMaterialEOQLoaderReducer ? (
                      <ReusableSysncLoader />
                    ) : (
                      <NoDataTextLoader />
                    )}
                  </div>{' '}
                </>
              )}
            </TabPane>
          </Tabs>
        </Modal>

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
      </div>
    );
  }
}

// const WrappedRegistrationForm = Form.create({ name: 'register' })(RegistrationForm);
function mapState(state) {
  return {
    tblData: state.getExhaustDetails,
    getExhaustDetailsbyIdData: state.getExhaustDetailsbyId,
    getWeeklyStockVisualizationData: state.getWeeklyStockVisualization,
    getMonthlyStockVisualizationData: state.getMonthlyStockVisualization,
    getMaterialforPushPullData: state.getMaterialforPushPull,
    getPONumberForMaterialData: state.getPONumberForMaterial,
    getPOLineForPOData: state.getPOLineForPO,
    getExhaustDetailsV2Data: state.getExhaustDetailsV2,
    getApproverListData: state.getApproverList,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    getLeadTimeTrendingMaterialEOQData: state.getLeadTimeTrendingMaterialEOQ,
    getCapGovMaterialReportData: state.getCapGovMaterialReport,
    getCapGovMaterialReportLoaderReducer: state.getCapGovMaterialReportLoaderReducer,
    getMonthlyStockVisualizationLoaderReducer: state.getMonthlyStockVisualizationLoaderReducer,
    getWeeklyStockVisualizationLoaderReducer: state.getWeeklyStockVisualizationLoaderReducer,
    getExhaustDetailsbyIdReducerLoader: state.getExhaustDetailsbyIdReducerLoader,
    getLeadTimeTrendingMaterialEOQLoaderReducer: state.getLeadTimeTrendingMaterialEOQLoaderReducer
  };
}

// eslint-disable-next-line no-class-assign
InventoryExhaustTable = Form.create({ name: 'register' })(InventoryExhaustTable);

export default connect(mapState, {
  getLeadTimeTrendingMaterialEOQ,
  getUserImpersonationDetails,
  getApproverList,
  getExhaustDetailsV2,
  getExhaustDetails,
  getExhaustDetailsbyId,
  getWeeklyStockVisualization,
  getMonthlyStockVisualization,
  getMaterialforPushPull,
  getPONumberForMaterial,
  getPOLineForPO,
  getCapGovMaterialReport
})(InventoryExhaustTable);
