/* eslint-disable no-undef */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import 'moment-timezone';
import moment from 'moment';
import axios from 'axios';

import {
  ComposedChart,
  Line,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Bar,
  ReferenceLine,
  Tooltip
} from 'recharts';
// import { Row, Col, Badge, Menu, Dropdown, Modal } from 'antd';
import {
  Row,
  Col,
  Card,
  Badge,
  Menu,
  Dropdown,
  Modal,
  Button,
  Tabs,
  Switch,
  Popover,
  Select,
  Drawer,
  DatePicker,
  Form,
  Input,
  message,
  Avatar
} from 'antd';
import {
  ChatBotToggler,
  getNotificationDetails,
  getExhaustDetailNotification,
  getExhaustDetailsbyId,
  getWeeklyStockVisualization,
  getMonthlyStockVisualization,
  getUserRole,
  getUserDetailsBySearch,
  getUserImpersonationDetails,
  getMaterialManufFilterList,
  getTotalQuantityAndCapexLoader,
  getCapGovMaterialReportDD,
  saveImpersonationDetails,
  clearImpersonationDetails,
  getPredictedCapEx,
  getStockPercent,
  getFillRate,
  getSupplierEfficiency,
  getPredictedCapExDD,
  getDataforMapFullView,
  getMaterialDetailsForMapView,
  getCapExTrendPoPlaced,
  getHarvestingWidget,
  getEOQTbl,
  getExhaustDetailsV2,
  getTopSpendsByOrganization,
  getTopSpendsByOrganizationChart,
  getSupplyChainInventoryPos,
  getApprovalStatusCount,
  getOrderPushPullMaterialV2,
  getCapGovInfoForMaterial,
  getCapGovMaterialReport,
  getMaterialInsightsDropDown,
  getMaterialInsightsDefaultMatnr,
  getDefaultMaterialCapGov,
  getOrganizationList,
  getMaterialFilter,
  getPushPullNotificationMessages,
  getUserImpersonationDetailsRefresh,
  getPushPullDetailByUser,
  getForecastOverrideApproverList,
  getNBADefaultMaterialReport,
  getLeadtimeExpiryNotification,
  getLeadtimeExpiryNotificationDd,
  ReportNavHideShow,
  getBulkExport,
  InitialpageRender,
  UpdatePage,
  UpdateSizePerPage,
  UpdateSorting
} from '../../actions';

import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import BarLoader from 'react-spinners/BarLoader';
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import 'react-vertical-timeline-component/style.min.css';
import { SettingFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import ReusableTable from '../../views/ReusableComponent/ReusableTable';
import { ReusableSysncLoader } from '../../views/ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../views/ReusableComponent/NoDataTextLoader';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { SearchBar } = Search;
const { TabPane } = Tabs;
const { Option } = Select;
import { ROOT_URL } from '../../actions';
import { OverAllFormula } from './OverAllFormula';

import TextareaAutosize from 'react-textarea-autosize';
import { FileDownload } from '../../views/DashBoard/FileDownload/FileDownload';
import GlobalFilter from '../../views/GlobalFilter/GlobalFilter';

// const ROOT_URL_main = 'https://app-iim.azurewebsites.net';
const ROOT_URL_main =
  process.env.active === 'development'
    ? 'https://npinv.azurewebsites.net'
    : 'https://app-iim.azurewebsites.net';

let parsedFilterSettingsLGORT;
let parsedBlockedDeleted;

let Api_response_themes;
const Fcompo = ['kpi', 'materialR', '360view', '360org', '360manuf'];
const { confirm } = Modal;

class Header extends Component {
  constructor(props) {
    super(props);
    this.showConfirm = this.showConfirm.bind(this);
    this.PostApiSaveNotificationDetails = this.PostApiSaveNotificationDetails.bind(this);
    this.HandleRefreshPopUp = this.HandleRefreshPopUp.bind(this);
    this.rowformatter = this.rowformatter.bind(this);
    this.showSettingDrawer = this.showSettingDrawer.bind(this);
    this.popoverClose = this.popoverClose.bind(this);
    this.featureClick = this.featureClick.bind(this);
    this.getUserImpersonation = this.getUserImpersonation.bind(this);
    this.sidebarToggle = this.sidebarToggle.bind(this);

    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.toggleicon = this.toggleicon.bind(this);
    this.showData = this.showData.bind(this);
    this.lessData = this.lessData.bind(this);
    this.countPopup = this.countPopup.bind(this);
    this.materialDescription = this.materialDescription.bind(this);
    this.notificationClick = this.notificationClick.bind(this);
    this.dateformat = this.dateformat.bind(this);
    this.materialDD = this.materialDD.bind(this);
    this.materialDD1 = this.materialDD1.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.exportToCSVNotification = this.exportToCSVNotification.bind(this);
    this.DrilldownDD = this.DrilldownDD.bind(this);
    this.getcheckValues = this.getcheckValues.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.exportToCSVdrilldown = this.exportToCSVdrilldown.bind(this);
    this.tblLoaderOne = this.tblLoaderOne.bind(this);
    this.monthlyChart = this.monthlyChart.bind(this);
    this.weeklyChart = this.weeklyChart.bind(this);
    this.LeadTimeExpireHandler = this.LeadTimeExpireHandler.bind(this);

    // this.onManagedServices = this.onManagedServices.bind(this);
    this.ChatBot = this.ChatBot.bind(this);

    // this.blockedDeletedCheckAll = this.blockedDeletedCheckAll.bind(this);
    this.HandlePushPullNotification = this.HandlePushPullNotification.bind(this);
    this.HandleStatusChange = this.HandleStatusChange.bind(this);
    this.PushPullDateChange = this.PushPullDateChange.bind(this);
    this.pushPullnotificationSubmit = this.pushPullnotificationSubmit.bind(this);

    this.state = {
      InitialpageRenderData: '',
      UpdateSortingOrder: '',
      UpdateSortingField: '',
      impcuid: 'ALL',
      usercuid: 'ALL',
      showConfirmState: false,
      DashBoardRefreshFlag: '',
      NotificationPopup: false,
      NewFeatures: '',
      getPushPullNotificationMessageFlag: '',
      P_matnr: '',
      pushPullError: '',
      Approver_comment: '',
      PushPullDate: '',
      handleGetStatus: '',
      pushPullNotificationModal: false,
      pushPullNotificationData: [],
      SettingDrawer: false,
      FeatureModal: false,
      NotificationView: false,
      disableFilterIcon: true,
      closableDrawer: true,
      //noted
      newLgort: '',
      tempCheckList: '',
      infoModal: false,
      default_mtnr: '',
      default_lgort: '',

      saveMode: true,

      getPushPullDetailByUserData: [],

      impOnchangeName: sessionStorage.getItem('Impersonation-UserName'),
      Impersonating: '',
      name_1st_last: '',
      role: '',
      count: 3,
      getUserRoleData: [],
      getUserDetailsBySearchData: [],
      saveImpersonationDetailsData: [],
      getUserImpersonationDetailsData: [],
      getPushPullNotificationMessagesData: [],
      clearImpersonationDetailsData: [],

      Impersonatcuid: '',
      userrole: [],
      showicon: true,
      name: '',
      showMore: true,
      showLess: false,
      getNotificationDetailsData: [],
      getLeadtimeExpiryNotificationData: [],
      getLeadtimeExpiryNotificationDdData: [],
      countModal: false,
      Leadtime_Expiry_Alert: false,
      getExhaustDetailNotificationData: [],
      getExhaustDetailsbyIdData: [],
      getWeeklyStockVisualizationData: [],
      getMonthlyStockVisualizationData: [],
      material_no: '',
      LGORT: '',
      tableColumn_Order_push_pull: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 },
          formatter: this.materialDescription1.bind(this),
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'Status',
          text: 'Status',
          sort: true,
          headerStyle: { width: 104 },
          formatter: this.rowformatter,
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'PUSH_PULL',
          text: 'Push/Pull',
          sort: true,
          headerStyle: { width: 102 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'PO',
          text: 'PO',
          sort: true,
          headerStyle: { width: 120 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'PO_LINE',
          text: 'PO Line',
          sort: true,
          headerStyle: { width: 126 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'SUPPLIER',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MANUFACTURER',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 120 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'OPEN_VALUE',
          text: 'Open Value',
          sort: true,
          headerStyle: { width: 110 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'PUSH_PULL_DATE',
          text: 'Push/Pull date',
          sort: true,
          headerStyle: { width: 130 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          headerStyle: { width: 150 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By ',
          sort: true,
          headerStyle: { width: 250 },
          align: 'left',
          headerAlign: 'left'
        }
      ],
      LeadTimeExpiryCol: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 },
          formatter: this.materialDescription2.bind(this),
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MPN',
          text: 'MPN',
          sort: true,
          headerStyle: { width: 200 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'MANUF_NAME',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 250 },
          align: 'left',
          headerAlign: 'left'
        },

        {
          dataField: 'ORGANIZATION',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 180 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'OLD_LEADTIME',
          text: 'Old Leadtime',
          sort: true,
          headerStyle: { width: 150 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'NEW_LEADTIME',
          text: 'New Leadtime',
          sort: true,
          headerStyle: { width: 140 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'VALID_TILLDATE',
          text: 'Valid Tilldate',
          sort: true,
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          headerStyle: { width: 140 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          headerStyle: { width: 300 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By',
          sort: true,
          headerStyle: { width: 300 },
          align: 'left',
          headerAlign: 'left'
        }
      ],
      tableColumn: [
        {
          dataField: 'Material',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 },
          formatter: this.materialDescription
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 85 },
          align: 'left',
          headerAlign: 'center'
        },
        {
          dataField: 'Manufacturer',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 104 }
        },
        {
          dataField: 'Organization',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 102 }
        },
        {
          dataField: 'CurrentInventory',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 81 }
        },
        {
          dataField: 'PredictedDemandMonthly',
          text: 'Predicted Demand (Next month)',
          sort: true,
          headerStyle: { width: 126 }
        },
        {
          dataField: 'OrdersInPipeline',
          text: 'Orders in Pipeline(QTY)',
          sort: true,
          headerStyle: { width: 107 }
        },
        {
          dataField: 'InventoryExhaustDate',
          text: 'Inventory Exhaust Date',
          sort: true,
          headerStyle: { width: 103 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat
        },
        {
          dataField: 'UnderStock',
          formatter: this.materialDD1,
          headerStyle: { width: 0 }
        },
        {
          dataField: 'OverStock',
          text: 'Stock Level',
          sort: true,
          headerStyle: { width: 94 },
          formatter: this.materialDD
        },
        {
          dataField: 'Recommendation',
          text: 'Recommendation',
          sort: true,
          headerStyle: { width: 250 },
          align: 'left'
        }
      ],
      exhaustColumn: [
        { dataField: 'PO', text: 'PO', sort: true, headerStyle: { width: 90 } },
        {
          dataField: 'POLine',
          text: 'PO Line',
          sort: true,
          headerStyle: { width: 90 }
        },
        {
          dataField: 'Vendor',
          text: 'Vendor',
          sort: true,
          headerStyle: { width: 90 }
        },
        {
          dataField: 'VendorName',
          text: 'Vendor Name',
          sort: true,
          headerStyle: { width: 100 }
        },
        {
          dataField: 'Type',
          text: 'Type',
          sort: true,
          headerStyle: { width: 125 }
        },
        {
          dataField: 'Material',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 }
        },
        {
          dataField: 'Manufacturer',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 95 }
        },
        {
          dataField: 'MPN',
          text: 'MPN',
          sort: true,
          headerStyle: { width: 90 }
        },
        {
          dataField: 'Plant',
          text: 'Plant',
          sort: true,
          headerStyle: { width: 90 }
        },
        {
          dataField: 'POCreated',
          text: 'PO Created',
          sort: true,
          headerStyle: { width: 90 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat
        },
        {
          dataField: 'VendorCommitDate',
          text: 'Vendor Commit Date',
          sort: true,
          headerStyle: { width: 90 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat
        },
        {
          dataField: 'POQty',
          text: 'PO Qty',
          sort: true,
          headerStyle: { width: 90 }
        },
        {
          dataField: 'ReceiptQty',
          text: 'Receipt Qty',
          sort: true,
          headerStyle: { width: 90 }
        },
        {
          dataField: 'OpenQty',
          text: 'Open Qty',
          sort: true,
          headerStyle: { width: 90 }
        },
        {
          dataField: 'RequestedDeliveryDate',
          text: 'Requested Delivery Date',
          sort: true,
          headerStyle: { width: 90 },
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat
        },
        {
          dataField: 'LineValue',
          text: 'Line Value',
          sort: true,
          headerStyle: { width: 90 },
          formatter: this.costformat
        },
        {
          dataField: 'OpenValue',
          text: 'Open Value',
          sort: true,
          headerStyle: { width: 90 },
          formatter: this.costformat
        },
        {
          dataField: 'POFlag',
          text: 'PO Flag',
          sort: true,
          headerStyle: { width: 110 }
        }
      ],
      isDataFetched: false,
      isDataFetched1: false,
      newResultLength: '',
      DrilldownModal: false,
      timelineView: false,
      monthlyView: true,
      weeklyView: false
    };
  }

  componentDidMount() {
    this.props.getOrganizationList();
    this.props.getMaterialFilter();
    this.props.getNotificationDetails();
    this.props.getLeadtimeExpiryNotification();

    setInterval(() => {
      // if (!this.state.showConfirmState) {
      this.props.getUserImpersonationDetailsRefresh(sessionStorage.getItem('loggedEmailId'));
      // } else {
      //   console.log("interval cleared");
      //   clearInterval(countDownInterval);
      // }
    }, 60000);

    //theme Call
    if (localStorage.getItem('theme') == 'White') {
      document.body.classList.remove('darkblue');
      document.body.classList.add('White');
    } else if (localStorage.getItem('theme') == 'Dark') {
      document.body.classList.remove('White');
      document.body.classList.remove('darkblue');
    } else if (localStorage.getItem('theme') == 'darkblue') {
      document.body.classList.remove('White');
      document.body.classList.add('darkblue');
    }
    let headers = new Headers();
    headers.append('Origin', 'http://localhost:8080');
    fetch(ROOT_URL_main + '/.auth/me', {
      mode: 'cors',
      credentials: 'include',
      method: 'GET',
      headers: headers
    })
      .then((response) => response.json())
      .then((response) => {
        if (response != undefined) {
          this.props.getUserImpersonationDetails(response[0].user_id);
          // this.props.getUserImpersonationDetailsRefresh(response[0].user_id);

          sessionStorage.setItem('loggedEmailId', response[0].user_id);
          let i = 0;
          var temp;
          var fullname;

          while (i < response[0].user_claims.length) {
            if (response[0].user_claims[i].typ == 'name') {
              temp = response[0].user_claims[i].val.match(/\b(\w)/g);

              fullname = response[0].user_claims[i].val;

              break;
            }
            i++;
          }

          var res = temp.join('');

          sessionStorage.setItem('userInitial', res.substring(0, 2));

          this.setState({
            role: response[0].user_id,

            name: fullname
          });

          this.props.getUserRole(response[0].user_id);
        }
      });
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getUserImpersonationDetailsRefreshData !=
      nextProps.getUserImpersonationDetailsRefreshData
    ) {
      if (nextProps.getUserImpersonationDetailsRefreshData != '') {
        let validation = nextProps.getUserImpersonationDetailsRefreshData[0].IsLiveUpdated;
        validation != 'N' ? (!this.state.showConfirmState ? this.showConfirm() : '') : '';

        this.setState({
          getUserImpersonationDetailsRefreshData: nextProps.getUserImpersonationDetailsRefreshData,
          DashBoardRefreshFlag: nextProps.getUserImpersonationDetailsRefreshData[0].IsLiveUpdated
        });
      } else {
        this.setState({
          getUserImpersonationDetailsRefreshData: ''
        });
      }
    }
    if (this.props.getPushPullDetailByUserData != nextProps.getPushPullDetailByUserData) {
      if (nextProps.getPushPullDetailByUserData != '') {
        this.setState({
          getPushPullDetailByUserData: nextProps.getPushPullDetailByUserData,
          isDataFetched: false
        });
      } else {
        this.setState({
          getPushPullDetailByUserData: [],
          isDataFetched: true
        });
      }
    }
    if (
      this.props.getPushPullNotificationMessagesData !=
      nextProps.getPushPullNotificationMessagesData
    ) {
      if (nextProps.getPushPullNotificationMessagesData != 0) {
        this.setState({
          getPushPullNotificationMessagesData: nextProps.getPushPullNotificationMessagesData.map(
            (d) => d.MESSAGE
          ),
          getPushPullNotificationMessageFlag: nextProps.getPushPullNotificationMessagesData.map(
            (d) => d.NOTIFICATION_FLAG
          )
        });
      } else {
        this.setState({
          getPushPullNotificationMessagesData: []
        });
      }
    }
    if (this.props.getDefaultMaterialCapGovData != nextProps.getDefaultMaterialCapGovData) {
      if (nextProps.getDefaultMaterialCapGovData != 0) {
        this.setState({
          default_mtnr: nextProps.getDefaultMaterialCapGovData[0].MATNR,
          default_lgort: nextProps.getDefaultMaterialCapGovData[0].LGORT
        });

        this.props.getCapGovMaterialReport(
          nextProps.getDefaultMaterialCapGovData[0].MATNR,
          this.state.usercuid,
          'all',

          nextProps.getDefaultMaterialCapGovData[0].LGORT,
          parsedBlockedDeleted,
          'MATERIAL'
        );
        this.props.getCapGovInfoForMaterial(
          nextProps.getDefaultMaterialCapGovData[0].MATNR,
          this.state.usercuid,
          'ALL',

          nextProps.getDefaultMaterialCapGovData[0].LGORT,
          parsedBlockedDeleted,
          'MATERIAl'
        );
      } else {
        this.setState({
          default_mtnr: '',
          default_lgort: ''
        });
      }
    }

    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        nextProps.getUserImpersonationDetailsData[0].IsForecastOverrideApprover != 'N'
          ? this.props.ReportNavHideShow(true)
          : '';
        if (sessionStorage.getItem('currentPage') != 'IIMReport') {
          this.props.InitialpageRender('Capgov_request');
          this.props.UpdateSorting('Cap_Gov_Request', 'DESC');
          this.props.UpdatePage(1);
          this.props.UpdateSizePerPage(10);
        } else {
          this.props.UpdatePage(1);
          this.props.UpdateSizePerPage(10);
        }

        sessionStorage.setItem(
          'ForecastOverrideApprover',
          nextProps.getUserImpersonationDetailsData[0].IsForecastOverrideApprover
        );
        sessionStorage.setItem(
          'IsApprover',
          nextProps.getUserImpersonationDetailsData[0].IsApprover
        );
        sessionStorage.setItem('eoqcol', nextProps.getUserImpersonationDetailsData[0].EOQ_Columns);
        sessionStorage.setItem(
          'loggedcuid',
          nextProps.getUserImpersonationDetailsData.map((data) => data.loggedcuid)
        );
        this.props.getPushPullNotificationMessages(
          nextProps.getUserImpersonationDetailsData.map((data) => data.loggedcuid)
        );
        this.props.getMaterialManufFilterList(
          nextProps.getUserImpersonationDetailsData.map((data) => data.loggedcuid)
        );
        sessionStorage.setItem(
          'FilterSetting',
          nextProps.getUserImpersonationDetailsData[0].FilterSetting
        );

        sessionStorage.setItem('Username', nextProps.getUserImpersonationDetailsData[0].UserName);

        sessionStorage.setItem('AppRole', nextProps.getUserImpersonationDetailsData[0].AppRole);

        let alertv = nextProps.getUserImpersonationDetailsData[0].ALERT;
        let Newfeaturesv = nextProps.getUserImpersonationDetailsData[0].NEW_FEATURES;

        let pushpullshow = nextProps.getUserImpersonationDetailsData[0].Push_Pull;

        let Last_Updated = nextProps.getUserImpersonationDetailsData[0].Last_Updated;

        var stillUtc = moment.utc(Last_Updated).toDate();
        var local = moment(stillUtc).local().format('MMMM Do YYYY, h:mm:ss a');
        let cuid = nextProps.getUserImpersonationDetailsData.map((data) => data.loggedcuid);
        this.PostApiSaveNotificationDetails(cuid, alertv, Newfeaturesv, pushpullshow, 'N');
        const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

        parsedBlockedDeleted = JSON.parse(filterSettingsOrg)[0].BlockedDeleted;

        parsedFilterSettingsLGORT = JSON.parse(filterSettingsOrg)[0].LGORT;
        sessionStorage.setItem('colorcodedmatnr', JSON.parse(filterSettingsOrg)[0].BlockedDeleted);

        sessionStorage.setItem('lgort', JSON.parse(filterSettingsOrg)[0].LGORT);

        this.setState({
          Last_UpdatedUtc_Local: local,
          AlertValue: alertv,
          NewFeatures: Newfeaturesv,
          push_pull: pushpullshow,

          saveMode: nextProps.getUserImpersonationDetailsData[0].SaveMode,

          getUserImpersonationDetailsData: nextProps.getUserImpersonationDetailsData,
          impOnchangeName: nextProps.getUserImpersonationDetailsData.map(
            (data) => data.ImpNameWithCuid
          ),
          usercuid:
            nextProps.getUserImpersonationDetailsData[0].loggedcuid == null
              ? 'all'
              : nextProps.getUserImpersonationDetailsData[0].loggedcuid
        });

        Api_response_themes = nextProps.getUserImpersonationDetailsData[0].Theme;
        localStorage.setItem('theme', Api_response_themes);
        let bot = nextProps.getUserImpersonationDetailsData[0].ChatBot === 'N' ? false : true;

        this.props.ChatBotToggler(bot);
        sessionStorage.setItem('chatbot', nextProps.getUserImpersonationDetailsData[0].ChatBot);

        if (Api_response_themes === 'White') {
          document.body.classList.remove('darkblue');
          document.body.classList.add('White');
          localStorage.setItem('theme', 'White');
        } else if (Api_response_themes === 'darkblue') {
          document.body.classList.remove('White');
          document.body.classList.add('darkblue');
          localStorage.setItem('theme', 'darkblue');
        } else {
          localStorage.setItem('theme', 'Dark');
          document.body.classList.remove('White');
          document.body.classList.remove('darkblue');
        }

        if (nextProps.getUserImpersonationDetailsData[0].loggedcuid != null) {
          if (parsedFilterSettingsLGORT != undefined && parsedBlockedDeleted != undefined) {
            if (sessionStorage.getItem('currentPage') == 'capgov') {
              this.props.getDefaultMaterialCapGov(
                nextProps.getUserImpersonationDetailsData[0].loggedcuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }

            this.globalApiCall(
              nextProps.getUserImpersonationDetailsData[0].loggedcuid,

              parsedFilterSettingsLGORT,
              parsedBlockedDeleted
            );
          }
        } else {
          if (parsedFilterSettingsLGORT != undefined && parsedBlockedDeleted != undefined) {
            this.globalApiCall(
              null,

              parsedFilterSettingsLGORT,
              parsedBlockedDeleted
            );
          }
        }
      } else {
        this.setState({
          getUserImpersonationDetailsData: []
        });
      }
    }

    if (this.props.getUserDetailsBySearchData != nextProps.getUserDetailsBySearchData) {
      if (nextProps.getUserDetailsBySearchData != 0) {
        this.setState({
          getUserDetailsBySearchData: nextProps.getUserDetailsBySearchData
        });
      }
    }
    if (this.props.getUserRoleData != nextProps.getUserRoleData) {
      if (nextProps.getUserRoleData != 0) {
        this.setState({
          getUserRoleData: nextProps.getUserRoleData
        });
      }
    }
    if (
      this.props.getLeadtimeExpiryNotificationDdData !=
      nextProps.getLeadtimeExpiryNotificationDdData
    ) {
      if (nextProps.getLeadtimeExpiryNotificationDdData != 0) {
        this.setState({
          getLeadtimeExpiryNotificationDdData: nextProps.getLeadtimeExpiryNotificationDdData.Table
        });
      } else {
        this.setState({
          getLeadtimeExpiryNotificationDdData: []
        });
      }
    }
    if (
      this.props.getLeadtimeExpiryNotificationData != nextProps.getLeadtimeExpiryNotificationData
    ) {
      if (nextProps.getLeadtimeExpiryNotificationData.Table != 0) {
        this.setState({
          getLeadtimeExpiryNotificationData: nextProps.getLeadtimeExpiryNotificationData.Table
        });
      } else {
        this.setState({
          getLeadtimeExpiryNotificationData: []
        });
      }
    }
    if (this.props.getNotificationDetailsData != nextProps.getNotificationDetailsData) {
      if (nextProps.getNotificationDetailsData.Table != 0) {
        this.setState({
          getNotificationDetailsData: nextProps.getNotificationDetailsData.Table
        });
      } else {
        this.setState({
          notificationData: []
        });
      }
    }
    if (this.props.getExhaustDetailNotificationData != nextProps.getExhaustDetailNotificationData) {
      if (nextProps.getExhaustDetailNotificationData.Table != 0) {
        this.setState({
          getExhaustDetailNotificationData: nextProps.getExhaustDetailNotificationData.Table
        });
      } else {
        this.setState({
          getExhaustDetailNotificationData: [],
          isDataFetched: true
        });
      }
    }
    if (this.props.getExhaustDetailsbyIdData != nextProps.getExhaustDetailsbyIdData) {
      if (nextProps.getExhaustDetailsbyIdData.Table != 0) {
        this.setState({
          getExhaustDetailsbyIdData: nextProps.getExhaustDetailsbyIdData.Table
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
          Loader: false
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
          Loader: false
        });
      }
    }
  }
  globalApiCall(loggedcuid, lgort, Indicator) {
    if (loggedcuid != null) {
      if (sessionStorage.getItem('currentPage') == 'dashboard') {
        this.props.getForecastOverrideApproverList();
        //widject
        this.props.getPredictedCapEx(loggedcuid, lgort, Indicator);
        this.props.getStockPercent(loggedcuid, lgort, Indicator);
        this.props.getFillRate(loggedcuid, lgort, Indicator);
        this.props.getSupplierEfficiency(loggedcuid, lgort, Indicator);
        this.props.getCapExTrendPoPlaced(loggedcuid, lgort, Indicator);
        //maps
        this.props.getDataforMapFullView(loggedcuid, lgort, Indicator);
        this.props.getMaterialDetailsForMapView(loggedcuid, lgort, Indicator);
        this.props.getHarvestingWidget(loggedcuid, lgort, Indicator);
        this.props.getMaterialInsightsDropDown(loggedcuid, lgort, Indicator);
        this.props.getMaterialInsightsDefaultMatnr(loggedcuid, lgort, Indicator);
        //eoqTable
        this.props.getEOQTbl(
          loggedcuid,

          lgort,
          sessionStorage.getItem('loggedcuid'),
          Indicator
        );

        //exhaust details
        this.props.getExhaustDetailsV2('all', loggedcuid, lgort, Indicator);
      } else if (sessionStorage.getItem('currentPage') == 'capgov') {
        this.props.getForecastOverrideApproverList();
        //top 10 org
        this.props.getTopSpendsByOrganization(loggedcuid, lgort, Indicator);
        this.props.getTopSpendsByOrganizationChart(loggedcuid, lgort, Indicator);
        this.props.getCapGovMaterialReportDD(loggedcuid, lgort, Indicator);
        //capgov Table
        this.props.getSupplyChainInventoryPos('AdvancePoMatnr', loggedcuid, lgort, Indicator);
        //push/pull table
        this.props.getApprovalStatusCount('push', loggedcuid, lgort, Indicator);
        this.props.getOrderPushPullMaterialV2('Push', 'all', loggedcuid, lgort, Indicator);
        //capgov chart
      } else if (sessionStorage.getItem('currentPage') == 'IIMReport') {
        this.props.getBulkExport(
          loggedcuid,
          lgort,
          Indicator,
          this.props.InitialpageRenderData,
          this.props.UpdateSortingField + ' ' + this.props.UpdateSortingOrder,
          '1',
          '10',
          ''
        );

        this.props.InitialpageRender(this.props.InitialpageRenderData);
        this.props.UpdateSorting(this.props.UpdateSortingField, this.props.UpdateSortingOrder);
        this.props.UpdatePage(1);
        this.props.UpdateSizePerPage(10);
        //this.props.getBulkExportColNames('Capgov_request');
      }
    } else {
      //widject
      this.props.getForecastOverrideApproverList();
      this.props.getPredictedCapEx('all', lgort, Indicator);
      this.props.getStockPercent('all', lgort, Indicator);
      this.props.getFillRate('all', lgort, Indicator);
      this.props.getSupplierEfficiency('all', lgort, Indicator);
      this.props.getCapExTrendPoPlaced('all', lgort, Indicator);

      //maps
      this.props.getDataforMapFullView('all', lgort, Indicator);
      this.props.getMaterialDetailsForMapView('all', lgort, Indicator);
      this.props.getHarvestingWidget('all', lgort, Indicator);
      this.props.getMaterialInsightsDropDown('all', Indicator);
      this.props.getMaterialInsightsDefaultMatnr('all', lgort, Indicator);
      //eoqTable
      this.props.getEOQTbl('all', lgort, sessionStorage.getItem('loggedcuid'), Indicator);

      //exhaust details
      this.props.getExhaustDetailsV2('all', 'all', lgort, Indicator);
      //capgov

      //push/pull table
      this.props.getApprovalStatusCount('push', 'all', lgort, Indicator);

      //capgov Table
      this.props.getSupplyChainInventoryPos('AdvancePoMatnr', 'all', lgort, Indicator);

      //top 10 org
      this.props.getTopSpendsByOrganization('all', lgort, Indicator);
      this.props.getTopSpendsByOrganizationChart('all', lgort, Indicator);
      this.props.getCapGovMaterialReportDD('all', lgort, Indicator);
    }
  }

  sidebarToggle(e) {
    e.preventDefault();
    document.body.classList.toggle('sidebar-hidden');
    // document.body.classList.remove('sidebar-minimized');
  }

  toggleicon() {
    if (this.state.showicon == true) {
      this.setState({
        showicon: false
      });
      document.body.classList.add('White');
      localStorage.setItem('theme', 'White');
    } else {
      this.setState({
        showicon: true
      });
      document.body.classList.remove('White');
      localStorage.setItem('theme', 'Dark');
    }
  }

  toggleFullscreen() {
    if (
      !document.fullscreenElement &&
      /* alternative standard method */ !document.mozFullScreenElement &&
      !document.webkitFullscreenElement
    ) {
      // current working methods
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  showData() {
    $('#showDropdown').removeClass('dropdown-notifications');
    $('#showDropdown').addClass('dropdown-notify-height');
    // $("#showDropdown").removeClass("padding-top-6rem");
    this.setState({
      showMore: false,
      showLess: true
    });
  }
  lessData() {
    $('#showDropdown').removeClass('dropdown-notify-height');
    $('#showDropdown').addClass('dropdown-notifications');
    // $("#showDropdown").addClass("padding-top-6rem");
    this.setState({
      showMore: true,
      showLess: false
    });
  }
  LeadTimeExpireHandler() {
    if (this.state.Leadtime_Expiry_Alert) {
      this.setState({
        Leadtime_Expiry_Alert: false
      });
    } else {
      this.props.getLeadtimeExpiryNotificationDd();
      this.setState({
        Leadtime_Expiry_Alert: true
      });
    }
  }
  countPopup() {
    this.props.getExhaustDetailNotification();

    if (this.state.countModal == true) {
      this.setState({
        countModal: false,
        isDataFetched: false
      });
    } else {
      var usrcuid_one = this.state.getUserImpersonationDetailsData.map((data) => data.loggedcuid);
      if (this.state.AlertValue != 0) {
        axios({
          url:
            ROOT_URL +
            'SaveNotificationDetails?Usercuid=' +
            usrcuid_one +
            '&Alert=' +
            '0' +
            '&NewFeatures=' +
            this.state.NewFeatures +
            '&PushPull=' +
            this.state.push_pull +
            '&IsLiveUpdated=' +
            this.state.DashBoardRefreshFlag,

          method: 'post'
        }).then((res) => {
          if (res.status === 200) {
            console.log(res);
          } else {
            message.error('Status was not Updated ');
          }
        });
      }

      this.setState({
        AlertValue: 0,

        countModal: true,
        isDataFetched: false
      });
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
        {row.Flag == 'New' ? (
          <span
            className="exhaust-new"
            // onClick={() => this.DrilldownDD(row)}
          >
            {cell}
          </span>
        ) : (
          <span
            className="row-data"
            //  onClick={() => this.DrilldownDD(row)}
          >
            {cell}
          </span>
        )}
      </Popover>
    );
  }

  materialDescription1(cell, row) {
    return (
      <div>
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
          <span className="row-data" onClick={() => this.HandlePushPullNotification(row)}>
            {cell}
          </span>
        </Popover>
      </div>
    );
  }
  materialDescription2(cell, row) {
    return (
      <div>
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
          <span>
            {row.FLAG === 'N' ? (
              <span className="Red-flag">{cell}</span>
            ) : (
              <span className="Orange-flag">{cell}</span>
            )}
          </span>
        </Popover>
      </div>
    );
  }
  HandlePushPullNotification(row) {
    if (this.state.pushPullNotificationModal === true) {
      this.setState({
        pushPullNotificationModal: false,
        pushPullNotificationData: [],
        P_matnr: '',
        handleGetStatus: ''
      });
    } else {
      this.setState({
        pushPullNotificationModal: true,
        pushPullNotificationData: row,
        P_matnr: row.MATERIAL,
        handleGetStatus: row.Status,
        PushPullDate: moment(row.PUSH_PULL_DATE).format('MM-DD-YYYY')
      });
    }
  }
  PushPullDateChange(name, dateStrings) {
    let data = moment(dateStrings, 'MM-DD-YYYY');
    this.setState({
      PushPullDate: moment(data).format('MM-DD-YYYY')
    });
  }
  dateformat(cell) {
    let value = moment(cell).format('MM-DD-YYYY');
    if (value == '01-01-2099' || cell == null || cell == '') {
      return <span>-</span>;
    } else {
      return <span>{value}</span>;
    }
  }

  materialDD1(cell) {
    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.understockColumn = cell;
  }

  materialDD(cell) {
    if (cell == false && this.state.understockColumn == false) {
      return (
        <span>
          <i className="fas fa-circle fa-2x milestone-risk-green"></i>
        </span>
      );
    } else if (cell == false && this.state.understockColumn == true) {
      return (
        <Popover placement="right" content="Understock">
          <span>
            <i className="fas fa-circle fa-2x milestone-risk-red"></i>
            <i className="fa fa-arrow-down ml-2"></i>
          </span>
        </Popover>
      );
    } else if (cell == true && this.state.understockColumn == false) {
      return (
        <Popover placement="right" content="Overstock">
          <span>
            <i className="fas fa-circle fa-2x milestone-risk-red"></i>
            <i className="fa fa-arrow-up ml-2"></i>
          </span>
        </Popover>
      );
    } else {
      return <span>-</span>;
    }
  }

  exportToCSV() {
    let csvData = this.state.getExhaustDetailNotificationData;
    let fileName = 'Inventory Materials about to Exhaust within 14 Days';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVNotification() {
    let csvData = this.state.getPushPullDetailByUserData;
    let fileName = 'getPushPullDetailByUser';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  callback(key) {
    if (key == 2) {
      this.setState({
        Loader: true,
        defaultActiveKey: '2'
      });
    } else {
      this.setState({
        defaultActiveKey: '1'
      });
    }
  }

  DrilldownDD(e) {
    this.setState({
      material_no: e.Material,
      LGORT: e.LGORT
    });

    if (this.state.DrilldownModal == true) {
      this.setState({
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
        defaultActiveKey: '1'
      });
    } else {
      this.props.getExhaustDetailsbyId(e.Material, e.LGORT);
      this.props.getWeeklyStockVisualization(e.Material);
      this.props.getMonthlyStockVisualization(e.Material);
      this.setState({
        DrilldownModal: true,
        isDataFetched1: false,
        drilldowncsvtitle: e.Material,
        inventoryexhaustDate: e.InventoryExhaustDate,
        drilldowntitle: (
          <div>
            <i className="fas fa-chart-line mr-2" /> {e.Material} - Inventory Exhaust Details
          </div>
        ),
        Drilldowndescriptionview: (
          <div>
            <Row>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Material: </span>
                <div> {e.Material}</div>
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
                      <i className="fas fa-circle fa-2x milestone-risk-red mr-2"></i>
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
                <span>Recommendation: </span>
                <div className="text-highlight">{e.Recommendation}</div>
              </Col>
              <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                <span>Description </span>
                <div> {e.Description}</div>
              </Col>
            </Row>
          </div>
        )
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
    return moment(tickItem).format('MM-DD-YYYY');
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

  tblLoaderOne() {
    if (this.state.isDataFetched1) {
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

  monthlyChart() {
    this.setState({
      weeklyView: false,
      monthlyView: true
    });
  }
  weeklyChart() {
    this.setState({
      weeklyView: true,
      monthlyView: false
    });
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
              Projected Need(QTY):{' '}
              <span className="projected-need-text font-14">
                {e.payload[0].payload.Projected_Need}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  }
  getUserImpersonation(e) {
    sessionStorage.setItem('clear', 'clear');
    sessionStorage.setItem('clear1', 'clear1');
    sessionStorage.setItem('clear2', 'clear2');
    sessionStorage.setItem('clear3', 'clear3');
    sessionStorage.setItem('FirstCall', 'yes');

    this.setState({
      impOnchangeName: e
    });
    sessionStorage.setItem('Impersonation-UserName', e);

    var name1 = e.substring(0, e.lastIndexOf('('));
    var name2 = name1.substring(0, name1.lastIndexOf('-'));

    // ///border-radius: 4px;
    // border: 0;
    // outline: 0;
    // background: rgb(92, 146, 254);
    var impcuid = e.match(/\(([^)]+)\)/)[1];
    var usrcuid = this.state.getUserImpersonationDetailsData.map((data) => data.loggedcuid);

    this.setState({
      Impersonatcuid: impcuid,
      Impersonating: name2,
      usercuid: usrcuid
    });
    this.props.getUserImpersonationDetails(sessionStorage.getItem('loggedEmailId'));

    // this.props.saveImpersonationDetails(usrcuid, impcuid);
    this.props.getUserDetailsBySearch(e);
  }
  onSearch(e) {
    this.props.getUserDetailsBySearch(e);
  }
  popoverClose() {
    // this.globalApiCall(null);
    this.props.clearImpersonationDetails(
      this.state.getUserImpersonationDetailsData.map((data) => data.loggedcuid)
    );
    this.props.getUserImpersonationDetails(sessionStorage.getItem('loggedEmailId'));
  }

  infoEye() {
    if (!this.state.infoModal) {
      this.setState({
        infoModal: true
      });
    } else {
      this.setState({
        infoModal: false
      });
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

  ChatBot() {
    this.props.ChatBotToggler(!this.props.chatbotonoff);

    var usrcuid = this.state.getUserImpersonationDetailsData.map((data) => data.loggedcuid);

    if (!this.props.chatbotonoff) {
      let theme = localStorage.getItem('theme');
      let data_ = sessionStorage.getItem('FilterSetting');
      sessionStorage.setItem('chatbot', 'Y');
      let bot = 'Y';
      let col = sessionStorage.getItem('eoqcol');
      let matList = sessionStorage.getItem('MaterialList');
      let manufList = sessionStorage.getItem('ManufacturerList');
      let orglist = sessionStorage.getItem('OrganizationList');
      axios({
        url:
          ROOT_URL +
          'SaveImpersonationDetails?Usercuid=' +
          usrcuid +
          '&Impcuid=' +
          this.state.impcuid +
          '&FilterSetting=' +
          data_ +
          '&SaveMode=' +
          this.state.saveMode +
          '&Theme=' +
          theme +
          '&Chatbot=' +
          bot +
          '&EOQColumns=' +
          col,
        method: 'post',
        data: {
          MaterialList: matList === 'ALL' ? 'ALL' : matList.split(','),
          ManufacturerList: manufList === 'ALL' ? 'ALL' : manufList.split(','),
          OrganizationList: orglist === 'ALL' ? 'ALL' : orglist.split(',')
        }
      }).then((res) => {
        if (res.status == 200) {
          console.log(res);
        }
      });
    } else {
      let theme = localStorage.getItem('theme');
      let data_ = sessionStorage.getItem('FilterSetting');
      let bot = 'N';
      sessionStorage.setItem('chatbot', 'N');
      let col = sessionStorage.getItem('eoqcol');
      let matList = sessionStorage.getItem('MaterialList');
      let manufList = sessionStorage.getItem('ManufacturerList');
      let orglist = sessionStorage.getItem('OrganizationList');
      axios({
        url:
          ROOT_URL +
          'SaveImpersonationDetails?Usercuid=' +
          usrcuid +
          '&Impcuid=' +
          this.state.impcuid +
          '&FilterSetting=' +
          data_ +
          '&SaveMode=' +
          this.state.saveMode +
          '&Theme=' +
          theme +
          '&Chatbot=' +
          bot +
          '&EOQColumns=' +
          col,
        method: 'post',
        data: {
          MaterialList: matList === 'ALL' ? 'ALL' : matList.split(','),
          ManufacturerList: manufList === 'ALL' ? 'ALL' : manufList.split(','),
          OrganizationList: orglist === 'ALL' ? 'ALL' : orglist.split(',')
        }
      }).then((res) => {
        if (res.status == 200) {
          console.log(res);
        }
      });
    }
  }

  featureClick() {
    if (this.state.FeatureModal) {
      this.setState({
        FeatureModal: false
      });
    } else {
      var usrcuid_one = this.state.getUserImpersonationDetailsData.map((data) => data.loggedcuid);
      if (this.state.NewFeatures != 0) {
        axios({
          url:
            ROOT_URL +
            'SaveNotificationDetails?Usercuid=' +
            usrcuid_one +
            '&Alert=' +
            this.state.AlertValue +
            '&NewFeatures=' +
            '0' +
            '&PushPull=' +
            this.state.push_pull +
            '&IsLiveUpdated=' +
            this.state.DashBoardRefreshFlag,
          method: 'post'
        }).then((res) => {
          console.log(res.status);
        });
      }

      this.setState({
        NewFeatures: 0,
        FeatureModal: true
      });
    }
  }

  notificationClick() {
    if (this.state.NotificationView) {
      this.setState({
        NotificationView: false
      });
    } else {
      var usrcuid_one = this.state.getUserImpersonationDetailsData.map((data) => data.loggedcuid);
      this.props.getPushPullDetailByUser(usrcuid_one);

      if (this.state.push_pull != 0) {
        axios({
          url:
            ROOT_URL +
            'SaveNotificationDetails?Usercuid=' +
            usrcuid_one +
            '&Alert=' +
            this.state.AlertValue +
            '&NewFeatures=' +
            this.state.NewFeatures +
            '&PushPull=' +
            '0' +
            '&IsLiveUpdated=' +
            this.state.DashBoardRefreshFlag,
          method: 'post'
        }).then((res) => {
          console.log(res.status);
        });
      }

      this.setState({
        push_pull: 0,
        NotificationView: true
      });
    }
  }
  showSettingDrawer() {
    this.state.SettingDrawer === true
      ? this.setState({ SettingDrawer: false })
      : this.setState({ SettingDrawer: true });
  }
  HandleStatusChange(e) {
    this.setState({
      handleGetStatus: e
    });
  }
  pushPullnotificationSubmit() {
    let mt = this.state.pushPullNotificationData.MATERIAL;
    let po_mt = this.state.pushPullNotificationData.PO;
    let Poline_mt = this.state.pushPullNotificationData.PO_LINE;

    let PushPullDate = this.state.PushPullDate;
    let Status_mt =
      this.state.handleGetStatus === 'Approved'
        ? '2'
        : this.state.handleGetStatus === 'Rejected'
        ? '3'
        : '';
    let cmnt_mt = this.state.Approver_comment;

    if (this.state.Approver_comment != '') {
      axios({
        url:
          ROOT_URL +
          'PostApprovalStatus?Material=' +
          mt +
          '&PO=' +
          po_mt +
          '&PO_LINE=' +
          Poline_mt +
          '&PUSH_PULL_DATE=' +
          PushPullDate +
          '&Status=' +
          Status_mt +
          '&ApproverComments=' +
          cmnt_mt,
        method: 'post'
      }).then((res) => {
        if (res.status === 200) {
          message.success('Status Updated Successfully');
          var usrcuid_one = this.state.getUserImpersonationDetailsData.map(
            (data) => data.loggedcuid
          );
          this.props.getPushPullDetailByUser(usrcuid_one);
          this.props.getPushPullNotificationMessages(usrcuid_one);
          this.setState({
            pushPullNotificationModal: false,
            Approver_comment: '',
            handleGetStatus: 'Requested'
          });
        } else {
          message.error('Status was not Updated');
        }
      });
    } else {
      this.setState({
        pushPullError: 'Comment is required '
      });
    }
  }
  handleCommentChange(e) {
    this.setState({
      Approver_comment: e.target.value
    });
  }
  HandleRefreshPopUp() {
    if (this.state.NotificationPopup) {
      this.setState({
        NotificationPopup: false
      });
    } else {
      this.setState({
        NotificationPopup: true
      });
    }
  }
  PostApiSaveNotificationDetails(v1, v2, v3, v4, v5) {
    axios({
      url:
        ROOT_URL +
        'SaveNotificationDetails?Usercuid=' +
        v1 +
        '&Alert=' +
        v2 +
        '&NewFeatures=' +
        v3 +
        '&PushPull=' +
        v4 +
        '&IsLiveUpdated=' +
        v5,

      method: 'post'
    }).then((res) => {
      if (res.status === 200) {
        console.log(res);
      } else {
        message.error('Status was Updated ');
      }
    });
  }
  showConfirm() {
    this.setState({
      showConfirmState: true
    });
    confirm({
      title: 'Do you want to refresh the dashboard?',
      icon: <ExclamationCircleOutlined />,
      content: 'Real time data Update!',

      onOk: () => {
        this.setState({
          showConfirmState: false
        });
        this.props.getTotalQuantityAndCapexLoader(true);
        this.props.getUserImpersonationDetails(sessionStorage.getItem('loggedEmailId'));
        this.props.getNBADefaultMaterialReport();
      },
      onCancel: () => {
        this.setState({
          showConfirmState: false
        });
        this.PostApiSaveNotificationDetails(
          sessionStorage.getItem('loggedcuid'),
          this.state.AlertValue,
          this.state.NewFeatures,
          this.state.push_pull,
          'N'
        );
      }
    });
  }

  render() {
    let btn_class_Weekly = this.state.weeklyView ? '' : 'white-btn';
    let btn_class_Monthly = this.state.monthlyView ? '' : 'white-btn';
    const menu = (
      <Menu className="dropdown-notifications" id="showDropdown">
        <div className="notification-heading pb-2">
          <span className=" float-left">Notifications</span>
          {this.state.showMore == true ? (
            <div className="view-more float-right" onClick={this.showData}>
              View More
            </div>
          ) : (
            <div></div>
          )}
        </div>
        {this.state.getNotificationDetailsData.map((val, ind) => (
          <Menu.Item key={ind}>
            {
              val.Type == 'Alert' ? '' : ''
              // <div className="notify-float-left">
              //   <i class="fas fa-exclamation-triangle notification-icon"></i>
              // </div>
            }
            {
              val.Type == 'Feature' ? '' : ''
              // <div className="notify-float-left">
              //   <i class="fa fa-cubes notification-icon"></i> ""
              // </div>
            }
            {val.Type == 'Bugs' ? (
              <div className="notify-float-left">
                <i className="fa fa-bug notification-icon"></i>
              </div>
            ) : (
              <div></div>
            )}
            <div className=" m-0 p-0 pb-2" onClick={this.countPopup}>
              <div className="font-17">
                {/* <i class="fas fa-exclamation-triangle float-right " /> */}
                <span className="plt-5"> Inventory Exhaust Materials</span>&nbsp;
                <span>{this.state.AlertValue != 0 ? <Badge count={'New'}></Badge> : ''}</span>
              </div>
              <div className="font-12">
                &nbsp; &nbsp;
                {val.Count.length != 0 ? (
                  <span className="count-css">{val.Count}</span>
                ) : (
                  <span></span>
                )}{' '}
                {val.NotificationMessage}
              </div>
            </div>
          </Menu.Item>
        ))}

        {this.state.getLeadtimeExpiryNotificationData.map((val, ind) => (
          <Menu.Item key={ind}>
            <div className=" m-0 p-0 pb-2" onClick={this.LeadTimeExpireHandler}>
              <div className="font-17">
                <span className="plt-5">Leadtime overwrite expiry </span>&nbsp;
                {/* <i className="fas fa-exclamation-triangle float-right " /> */}
                {/* <span>{this.state.AlertValue != 0 ? <Badge count={'New'}></Badge> : ''}</span> */}
              </div>
              <div className="font-12">
                <span>
                  {' '}
                  &nbsp; &nbsp;
                  <span className="count-css">{val.VALUE}</span>&nbsp;
                  {val.MATERIAL}
                </span>
              </div>
            </div>
          </Menu.Item>
        ))}
        <Menu.Item onClick={this.featureClick}>
          {/* <div className="notify-float-left">
            <i class="fa fa-cubes notification-icon"></i>
          </div> */}

          <div className=" m-0 p-0 pb-2">
            <div className="font-17">
              {/* <i class="fa fa-cubes float-right color"></i> */}
              <span className="plt-5"> New Feature </span>

              <span>{this.state.NewFeatures != 0 ? <Badge count={'New'}></Badge> : ''}</span>
            </div>

            <ul className="notify-width">
              <li>
                <div className="font-12">Add all remaining parts in Inventory Balances report</div>
              </li>
              <li>
                <div className="font-12">Implement global filter on bulk export page</div>
              </li>
              <li>
                <div className="font-12">
                  {' '}
                  Notification/Mail alert for leadtime overwrite expiry{' '}
                </div>
              </li>
            </ul>
          </div>
        </Menu.Item>
        {this.state.getPushPullNotificationMessageFlag != 'N' ? (
          <Menu.Item onClick={this.notificationClick}>
            <div className=" m-0 p-0 pb-2">
              <div className="font-17">
                {/* <i class="fa fa-cubes float-right color"></i> */}
                <span className="plt-5"> Push/Pull Notification</span> &nbsp;
                <span>{this.state.push_pull != 0 ? <Badge count={'New'}></Badge> : ''}</span>
              </div>

              <ul>
                <li>
                  <div className="font-12 clclc">
                    {' '}
                    {this.state.getPushPullNotificationMessagesData.length != 0
                      ? this.state.getPushPullNotificationMessagesData
                      : ''}
                  </div>
                </li>
              </ul>
            </div>
          </Menu.Item>
        ) : (
          ''
        )}

        {this.state.showLess == true ? (
          <div className="view-less" onClick={this.lessData}>
            <span>
              <i className="fas fa-arrow-alt-circle-right"></i>
            </span>
            <span>View Less</span>
          </div>
        ) : (
          <div></div>
        )}
      </Menu>
    );

    return (
      <header className="app-header navbar">
        <div className="normal-view">
          <Col>
            <Row>
              <Col xs={10} sm={10} md={10} lg={10} xl={10} className="header-title">
                <div className="header-logo-hide" onClick={this.sidebarToggle}></div>
                <span className="cdn-logo-text">
                  {' '}
                  Intelligent Inventory Management
                  {process.env.active === 'development' ? (
                    <span className="siteinfo">(Test / UAT)</span>
                  ) : (
                    ''
                  )}
                  <div className="last_updated">
                    {this.state.getUserImpersonationDetailsData != '' ? (
                      <>
                        {' '}
                        Last Updated - &nbsp;
                        {this.state.Last_UpdatedUtc_Local}
                      </>
                    ) : (
                      ''
                    )}
                  </div>
                </span>
              </Col>
              <Col xs={13} sm={13} md={13} lg={13} xl={13}>
                <span
                  className=" float-right user-role"
                  style={{
                    paddingTop: '8px',
                    paddingRight: '20px'
                  }}>
                  <span>
                    <span className="usr">{this.state.name}</span>
                    {this.state.getUserImpersonationDetailsData.map((data) =>
                      data.imp_full_name == null ? (
                        ''
                      ) : (
                        <span className="imp">
                          &nbsp; (<span>Impersonating </span>
                          <span>{data.imp_full_name}</span>)
                        </span>
                      )
                    )}
                  </span>
                  <br></br>
                  <span className="header-user-role">
                    {this.state.getUserImpersonationDetailsData.map((dat) => dat.Role)}
                  </span>
                </span>

                {/* need for future use */}

                {/* <Popover placement="bottom" content={content}> */}
                <span className="float-right mr-2 mt-2">
                  <Avatar
                    style={{
                      verticalAlign: 'middle',
                      background: '#0b3781'
                    }}
                    size="large"
                    gap={4}>
                    {sessionStorage.getItem('userInitial')}
                  </Avatar>

                  {/* <i className="fas fa-chevron-down"></i> */}
                </span>
                {/* </Popover> */}
                <span className="notifiy float-right">
                  <Popover content={'Formula Description'} placement="top">
                    <i className="fas fa-info-circle nav" onClick={this.infoEye.bind(this)}></i>
                  </Popover>
                </span>

                <span className="notifiy float-right">
                  <Badge>
                    <Dropdown overlay={menu} placement="bottomRight" arrow>
                      <Popover content={'Notification'} placement="top">
                        <Badge
                          count={
                            parseInt(this.state.AlertValue) +
                            parseInt(this.state.NewFeatures) +
                            parseInt(this.state.push_pull)
                          }>
                          <i className="bell far fa-bell" />
                        </Badge>
                      </Popover>
                    </Dropdown>
                  </Badge>
                </span>

                <span className="notifiy float-right">
                  <Popover content={'Full Screen'} placement="top">
                    <i className="fas fa-expand" onClick={this.toggleFullscreen} />
                  </Popover>
                </span>
                {/* white and Dark theme toggle */}

                {/* <span
                  className="notifiy float-right"
                  onClick={this.toggleicon}
                  style={{ marginRight: "28px" }}
                >
                  {this.state.showicon == true ? (
                    <Popover content={"Theme Toggle"} placement="top">
                      <i className="far fa-lightbulb" />
                    </Popover>
                  ) : (
                    <Popover content={"Theme Toggle"} placement="top">
                      <i className="far fa-moon" />
                    </Popover>
                  )}
                </span> */}
                <span className="notifiy float-right">
                  <FileDownload />
                </span>

                {!Fcompo.includes(sessionStorage.getItem('currentPage')) ? (
                  <span className="notifiy float-right">
                    <GlobalFilter />
                  </span>
                ) : null}

                <span className=" notifiy float-right"></span>
              </Col>
              <Col xs={1} sm={1} md={1} lg={1} xl={1}>
                <span className="spin-setting-icon " onClick={this.showSettingDrawer}>
                  {' '}
                  <Popover content={'Setting'} placement="bottom">
                    <SettingFilled spin />
                  </Popover>
                </span>
              </Col>
            </Row>
          </Col>
        </div>

        <Modal
          width="90%"
          style={{ top: 60 }}
          footer={null}
          className="Intervaltimeline"
          visible={this.state.NotificationView}
          onCancel={this.notificationClick}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card
                className="no-box-shadow"
                title={
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      Order Push/Pull
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
                  </Row>
                }>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getPushPullDetailByUserData}
                  columns={this.state.tableColumn_Order_push_pull}
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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="float-right">
                          <div className="float-right ">
                            <Button
                              size="sm"
                              className="export-Btn mr-2 ml-3 float-right"
                              onClick={this.exportToCSVNotification}>
                              <i className="fas fa-file-excel mr-2" />{' '}
                              <span className="text-white">Excel</span>
                            </Button>
                          </div>
                          <span className="float-right">
                            {' '}
                            <SearchBar {...props.searchProps} />
                          </span>
                        </Col>
                      </Row>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory()}
                        noDataIndication={() => this.tblLoader()}
                        filter={filterFactory()}
                      />
                    </div>
                  )}
                </ToolkitProvider>
              </Card>
            </Col>
          </Row>
        </Modal>
        <Modal
          width="90%"
          title={
            <span>
              Material leadtime overwrite has expired or is about to expire in next 14 days{' '}
              <div className="float-right mr-5 exhaust mt-2 chart-legend sn">
                <span className="pr-2">
                  <i className="fas fa-circle" style={{ color: '#ff4d4f' }} /> - Expired{' '}
                </span>
                <span>
                  <i className="fas fa-circle" style={{ color: 'orange' }} /> - About to Expire{' '}
                </span>
              </div>
            </span>
          }
          style={{ top: 60 }}
          footer={null}
          className="Intervaltimeline"
          visible={this.state.Leadtime_Expiry_Alert}
          onCancel={this.LeadTimeExpireHandler}>
          {!this.props.getLeadtimeExpiryNotificationDdReducerLoader &&
          this.state.getLeadtimeExpiryNotificationDdData.length > 0 ? (
            <>
              <ReusableTable
                TableData={this.state.getLeadtimeExpiryNotificationDdData}
                TableColumn={this.state.LeadTimeExpiryCol}
                fileName={'LeadtimeExpiryNotification'}
              />
            </>
          ) : (
            <>
              <div style={{ height: '400px' }}>
                {this.props.getLeadtimeExpiryNotificationDdReducerLoader ? (
                  <>
                    <ReusableSysncLoader />
                  </>
                ) : (
                  <>
                    <NoDataTextLoader />
                  </>
                )}
              </div>
            </>
          )}
        </Modal>

        <Modal
          width="90%"
          style={{ top: 60 }}
          footer={null}
          className="Intervaltimeline"
          visible={this.state.countModal}
          onCancel={this.countPopup}>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card
                className="no-box-shadow"
                title={
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                      Inventory Materials about to Exhaust within 14 Days
                      <div className="float-right mr-5 exhaust mt-2 chart-legend sn">
                        <span>
                          <i className="fas fa-circle newlyadded" /> - Newly Added{' '}
                        </span>
                        <span>
                          <i className="fas fa-circle existing" /> - Existing{' '}
                        </span>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={24} xl={24}></Col>
                  </Row>
                }>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.getExhaustDetailNotificationData}
                  columns={this.state.tableColumn}
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
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                        <Col xs={12} sm={12} md={12} lg={12} xl={12} className="float-right">
                          <div className="float-right ">
                            <Button
                              size="sm"
                              className="export-Btn mr-2 ml-3 float-right"
                              onClick={this.exportToCSV}>
                              <i className="fas fa-file-excel mr-2" />{' '}
                              <span className="text-white">Excel</span>
                            </Button>
                          </div>
                          <span className="float-right">
                            {' '}
                            <SearchBar {...props.searchProps} />
                          </span>
                        </Col>
                      </Row>
                      <BootstrapTable
                        {...props.baseProps}
                        pagination={paginationFactory()}
                        noDataIndication={() => this.tblLoader()}
                        filter={filterFactory()}
                      />
                    </div>
                  )}
                </ToolkitProvider>
              </Card>
            </Col>
          </Row>
        </Modal>
        <Modal
          width="90%"
          style={{ top: 60 }}
          footer={null}
          title={this.state.drilldowntitle}
          className="Intervaltimeline"
          visible={this.state.DrilldownModal}
          onCancel={this.DrilldownDD}>
          {this.state.Drilldowndescriptionview}
          <div className="border-line-between"></div>
          <Tabs>
            <TabPane
              tab="PO Details"
              key="1"
              activeKey={this.state.defaultActiveKey}
              onChange={this.callback.bind(this)}>
              <Row>
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
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
                  <ToolkitProvider
                    keyField="id1"
                    data={this.state.getExhaustDetailsbyIdData}
                    columns={this.state.exhaustColumn}
                    search>
                    {(props) => (
                      <div>
                        <Row>
                          <Col
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className="float-right search-right">
                            <SearchBar {...props.searchProps} />
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSVdrilldown}>
                              <i className="fas fa-file-excel mr-2" />{' '}
                              <span className="text-white">Excel</span>
                            </Button>
                          </Col>
                        </Row>
                        <BootstrapTable
                          {...props.baseProps}
                          pagination={paginationFactory()}
                          noDataIndication={() => this.tblLoaderOne()}
                          filter={filterFactory()}
                        />
                      </div>
                    )}
                  </ToolkitProvider>
                </div>
              ) : (
                <div>
                  <Row>
                    <Col xs={12} sm={12} md={12} lg={12} xl={12} className="margin-0-width">
                      {this.state.getExhaustDetailsbyIdData.length == [] ||
                      this.state.getExhaustDetailsbyIdData.length == null ||
                      this.state.getExhaustDetailsbyIdData.length == 0 ? (
                        <div className="text-white text-center mb-2 font-20">
                          No data available for this criteria
                        </div>
                      ) : (
                        <VerticalTimeline>
                          {this.state.getExhaustDetailsbyIdData.map((val, ind) => (
                            <VerticalTimelineElement
                              key={ind}
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
                              <Row className="mb-2">
                                <Col className="text-center">
                                  <span className="font-14">
                                    PO: <span className="pohighlight">{val.PO}</span>
                                  </span>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">PO Line : </span>
                                  <div className="font-12 line-height-1.3">{val.POLine}</div>
                                </Col>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">Manufacturer : </span>
                                  <div className="font-12 line-height-1.3">{val.VendorName}</div>
                                </Col>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">PO Date : </span>
                                  <div className="font-12 line-height-1.3">
                                    {moment(val.POCreated).format('MM-DD-YYYY')}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">PO Qty : </span>
                                  <div className="font-12 line-height-1.3">{val.POQty}</div>
                                </Col>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">Open Qty : </span>
                                  <div className="font-12 line-height-1.3">{val.OpenQty}</div>
                                </Col>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">
                                    Requested Delivery Date :{' '}
                                  </span>
                                  <div className="font-12 line-height-1.3">
                                    {moment(val.RequestedDeliveryDate).format('MM-DD-YYYY')}
                                  </div>
                                </Col>
                              </Row>
                              <Row>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">
                                    Inventory Exhaust Date :{' '}
                                  </span>
                                  <div className="pohighlight font-12 line-height-1.3">
                                    {moment(this.state.inventoryexhaustDate).format('MM-DD-YYYY')}
                                  </div>
                                </Col>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">
                                    Vendor Commit Date :{' '}
                                  </span>
                                  <div className="font-12 line-height-1.3">
                                    {moment(val.VendorCommitDate).format('MM-DD-YYYY')}
                                  </div>
                                </Col>
                                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                                  <span className="font-12 line-height-1.3">PO Flag : </span>
                                  <div className="pohighlight font-12 line-height-1.3">
                                    {val.POFlag}
                                  </div>
                                </Col>
                              </Row>
                            </VerticalTimelineElement>
                          ))}
                        </VerticalTimeline>
                      )}
                    </Col>
                  </Row>
                </div>
              )}
            </TabPane>
            <TabPane tab="Stock Visualization" key="2">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2">
                <Button.Group size="small" className="float-right">
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
              <div className="text-center mt-2 chart-legend">
                <span>
                  <i className="fas fa-circle ending-on-hand" /> - Ending on hand(QTY){' '}
                </span>
                <span>
                  <i className="fas fa-circle predicted-consumption" /> - Predicted Consumption(QTY){' '}
                </span>
                <span>
                  <i className="fas fa-circle projected-need" /> - Projected Need(QTY){' '}
                </span>
              </div>
              <Row>
                <BarLoader color={'#fff'} loading={this.state.Loader} width="80%" />
                {this.state.monthlyView == true ? (
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
                      <Bar dataKey="Projected_Need" barSize={20} fill="#63ce46" />
                      <Line type="monotone" dataKey="Predicted_consumption" stroke="#fa9105" />
                    </ComposedChart>
                  </ResponsiveContainer>
                ) : (
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
                      <Bar dataKey="Projected_Need" barSize={20} fill="#63ce46" />
                      <Line type="monotone" dataKey="Predicted_consumption" stroke="#fa9105" />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </Row>
            </TabPane>
          </Tabs>
        </Modal>

        <Drawer
          title="User Settings"
          placement="right"
          onClose={this.showSettingDrawer}
          visible={this.state.SettingDrawer}
          width={300}>
          <div>
            <p className="user-setting-heading">Themes</p>
            <p>
              <span
                className="theme-blue"
                onClick={() => {
                  document.body.classList.remove('White');
                  document.body.classList.remove('darkblue');
                  localStorage.setItem('theme', 'Dark');
                  var usrcuid = this.state.getUserImpersonationDetailsData.map(
                    (data) => data.loggedcuid
                  );

                  let theme = localStorage.getItem('theme');
                  let data_ = sessionStorage.getItem('FilterSetting');
                  let bot = sessionStorage.getItem('chatbot');
                  let col = sessionStorage.getItem('eoqcol');
                  let matList = sessionStorage.getItem('MaterialList');
                  let manufList = sessionStorage.getItem('ManufacturerList');
                  let orglist = sessionStorage.getItem('OrganizationList');
                  console.log('matList', typeof matList);
                  axios({
                    url:
                      ROOT_URL +
                      'SaveImpersonationDetails?Usercuid=' +
                      usrcuid +
                      '&Impcuid=' +
                      this.state.impcuid +
                      '&FilterSetting=' +
                      data_ +
                      '&SaveMode=' +
                      this.state.saveMode +
                      '&Theme=' +
                      theme +
                      '&Chatbot=' +
                      bot +
                      '&EOQColumns=' +
                      col,
                    method: 'post',
                    data: {
                      MaterialList: matList === 'ALL' ? 'ALL' : matList.split(','),
                      ManufacturerList: manufList === 'ALL' ? 'ALL' : manufList.split(','),
                      OrganizationList: orglist === 'ALL' ? 'ALL' : orglist.split(',')
                    }
                  }).then((res) => {
                    if (res.status == 200) {
                      console.log(res);
                    }
                  });
                }}></span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span
                className="theme-white"
                onClick={() => {
                  document.body.classList.remove('darkblue');
                  document.body.classList.add('White');
                  localStorage.setItem('theme', 'White');
                  var usrcuid = this.state.getUserImpersonationDetailsData.map(
                    (data) => data.loggedcuid
                  );
                  let theme = localStorage.getItem('theme');
                  let data_ = sessionStorage.getItem('FilterSetting');
                  let bot = sessionStorage.getItem('chatbot');
                  let col = sessionStorage.getItem('eoqcol');
                  let matList = sessionStorage.getItem('MaterialList');
                  let manufList = sessionStorage.getItem('ManufacturerList');
                  let orglist = sessionStorage.getItem('OrganizationList');
                  axios({
                    url:
                      ROOT_URL +
                      'SaveImpersonationDetails?Usercuid=' +
                      usrcuid +
                      '&Impcuid=' +
                      this.state.impcuid +
                      '&FilterSetting=' +
                      data_ +
                      '&SaveMode=' +
                      this.state.saveMode +
                      '&Theme=' +
                      theme +
                      '&Chatbot=' +
                      bot +
                      '&EOQColumns=' +
                      col,
                    method: 'post',
                    data: {
                      MaterialList: matList === 'ALL' ? 'ALL' : matList.split(','),
                      ManufacturerList: manufList === 'ALL' ? 'ALL' : manufList.split(','),
                      OrganizationList: orglist === 'ALL' ? 'ALL' : orglist.split(',')
                    }
                  }).then((res) => {
                    if (res.status == 200) {
                      console.log(res);
                    }
                  });
                }}></span>
              &nbsp;&nbsp;&nbsp;&nbsp;
              <span
                className="theme-Darkblue"
                onClick={() => {
                  document.body.classList.remove('White');
                  document.body.classList.add('darkblue');
                  localStorage.setItem('theme', 'darkblue');
                  var usrcuid = this.state.getUserImpersonationDetailsData.map(
                    (data) => data.loggedcuid
                  );
                  let theme = localStorage.getItem('theme');
                  let data_ = sessionStorage.getItem('FilterSetting');
                  let bot = sessionStorage.getItem('chatbot');
                  let col = sessionStorage.getItem('eoqcol');
                  let matList = sessionStorage.getItem('MaterialList');
                  let manufList = sessionStorage.getItem('ManufacturerList');
                  let orglist = sessionStorage.getItem('OrganizationList');
                  axios({
                    url:
                      ROOT_URL +
                      'SaveImpersonationDetails?Usercuid=' +
                      usrcuid +
                      '&Impcuid=' +
                      this.state.impcuid +
                      '&FilterSetting=' +
                      data_ +
                      '&SaveMode=' +
                      this.state.saveMode +
                      '&Theme=' +
                      theme +
                      '&Chatbot=' +
                      bot +
                      '&EOQColumns=' +
                      col,
                    method: 'post',
                    data: {
                      MaterialList: matList === 'ALL' ? 'ALL' : matList.split(','),
                      ManufacturerList: manufList === 'ALL' ? 'ALL' : manufList.split(','),
                      OrganizationList: orglist === 'ALL' ? 'ALL' : orglist.split(',')
                    }
                  }).then((res) => {
                    if (res.status == 200) {
                      console.log(res);
                    }
                  });
                }}></span>
            </p>

            <Row>
              <Col span={24}>
                <p className="user-setting-heading">
                  ChatBot
                  <span
                    // className={this.props.chatbotonoff ? "viewtxt" : "v1"}
                    className="bot-switch mr-5">
                    <Switch
                      checkedChildren={' Disable'}
                      unCheckedChildren={'Enable'}
                      onClick={this.ChatBot}
                      checked={!this.props.chatbotonoff}></Switch>
                  </span>
                </p>
                <div></div>
              </Col>
            </Row>
          </div>
        </Drawer>

        <Modal
          width="90%"
          style={{ top: 80 }}
          footer={null}
          title={
            <div>
              <span>{/* <i class="fas fa-info"></i> */}</span> Formula Description
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.infoModal}
          onCancel={this.infoEye.bind(this)}>
          <OverAllFormula />
        </Modal>

        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>New Features</div>}
          className="Intervaltimeline"
          visible={this.state.FeatureModal}
          onCancel={this.featureClick}
          width={600}>
          <div>
            <ul>
              <li className="FeatureStyle">Add all remaining parts in Inventory Balances report</li>

              <li className="FeatureStyle">Implement global filter on bulk export page </li>

              <li className="FeatureStyle">
                {' '}
                Notification/Mail alert for leadtime overwrite expiry{' '}
              </li>
            </ul>
          </div>
        </Modal>

        {/* ; //end */}

        {/* push_Pull notification modal */}
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Push Pull notification</div>}
          className="Intervaltimeline"
          visible={this.state.pushPullNotificationModal}
          onCancel={this.HandlePushPullNotification}
          width={1200}>
          <div>
            <Row className="v4 ModelStylePushPull">
              <Form layout="vertical">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="row_margin">
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div>
                      <p className="PushPullNotification">Material</p>

                      {/* <Form.Item
                      label="Material"
                      name="Material"
                      className="label-form-text1"
                    > */}
                      <Input
                        type="text"
                        prefix={<i className="fas fa-dice-d6 icons-form1" />}
                        id="Material"
                        value={this.state.pushPullNotificationData.MATERIAL}
                        className="text-input-form ftsize"
                      />
                      {/* </Form.Item> */}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div>
                      <p className="PushPullNotification">PO</p>
                      <Input
                        readOnly
                        prefix={<i className="fab fa-wpforms icons-form1" />}
                        type="text"
                        id="PO"
                        value={this.state.pushPullNotificationData.PO}
                        className="text-input-form ftsize"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div>
                      <p className="PushPullNotification">Poline</p>
                      <Input
                        readOnly
                        prefix={<i className="fas fa-tags icons-form1" />}
                        type="text"
                        id="POLINE"
                        value={this.state.pushPullNotificationData.PO_LINE}
                        className="text-input-form ftsize"
                      />
                    </div>
                  </Col>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="row_margin">
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {/* <Form.Item
                      label="Organization"
                      name="supplier"
                      className="label-form-text1"
                    > */}
                    <div>
                      <p className="PushPullNotification">Organization</p>
                      <Input
                        prefix={<i className="fa fa-sitemap icons-form1 supplier-icon" />}
                        type="text"
                        readOnly
                        placeholder="Enter the Supplier"
                        id="supplier"
                        value={this.state.pushPullNotificationData.SUPPLIER}
                        className="text-input-form ftsize"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {/* <Form.Item
                      label="Manufacturer"
                      name="manufacturer"
                      className="label-form-text1"
                    > */}
                    <div>
                      <p className="PushPullNotification">Manufacturer</p>

                      <Input
                        readOnly
                        prefix={<i className="fas fa-industry icons-form1" />}
                        type="text"
                        placeholder="Enter the Manufacturer"
                        id="manufacturer"
                        value={'  ' + this.state.pushPullNotificationData.MANUFACTURER}
                        className="text-input-form ftsize"
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {/* <Form.Item
                      label="Submitted By"
                      name="Submitted By"
                      className="label-form-text1"
                    > */}
                    <div>
                      <p className="PushPullNotification">Submitted By</p>
                      <Input
                        readOnly
                        prefix={<i className="fa fa-envelope  icons-form1" />}
                        type="text"
                        id="Submitted By"
                        value={this.state.pushPullNotificationData.SUBMITTED_BY}
                        className="text-input-form ftsize"
                      />
                      {/* */}
                    </div>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="row_margin">
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div>
                      <p className="PushPullNotification">Comment</p>
                      <TextareaAutosize
                        id="comment"
                        className="text-input-form cmnt-top ftsize"
                        readOnly
                        minRows={1}
                        maxRows={6}
                        prefix={<i className="far fa-comments"></i>}
                        value={this.state.pushPullNotificationData.COMMENTS}
                      />
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div>
                      <p className="PushPullNotification">Push/Pull Date</p>
                      {this.state.pushPullNotificationData.Status === 'Requested' ? (
                        <>
                          {' '}
                          <DatePicker
                            allowClear={false}
                            format="MM-DD-YYYY "
                            className="push/pull-picker"
                            value={moment(this.state.PushPullDate)}
                            onChange={this.PushPullDateChange}
                            disabledDate={(current) => {
                              return moment().add(-1, 'days') >= current;
                            }}
                          />
                        </>
                      ) : (
                        <>
                          <Input
                            readOnly
                            prefix={<i className="far fa-calendar-alt icons-form1" />}
                            type="text"
                            id="Date"
                            value={this.state.PushPullDate}
                            className="text-input-form ftsize"
                          />
                        </>
                      )}
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div>
                      <p className="PushPullNotification">Push/Pull</p>
                      <Input
                        readOnly
                        prefix={<i className=" icons-form1" />}
                        type="text"
                        id="Date"
                        value={this.state.pushPullNotificationData.PUSH_PULL}
                        className="text-input-form ftsize"
                      />
                    </div>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="row_margin">
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <div>
                      <p className="PushPullNotification">Status</p>
                      <>
                        {this.state.pushPullNotificationData.Status === 'Requested' ? (
                          <>
                            {' '}
                            <Select
                              value={this.state.handleGetStatus}
                              onChange={this.HandleStatusChange}>
                              <Option value="Requested" label="Requested">
                                Requested
                              </Option>
                              <Option value="Approved" label="Approved">
                                Approved
                              </Option>
                              <Option value="Rejected" label="Rejected">
                                Rejected
                              </Option>
                            </Select>
                          </>
                        ) : (
                          <>
                            <Input
                              prefix={
                                this.state.pushPullNotificationData.Status === 'Requested' ? (
                                  <i className="far fa-clock icons-form1" />
                                ) : this.state.pushPullNotificationData.Status === 'Rejected' ? (
                                  <i className="far fa-thumbs-down icons-form1" />
                                ) : (
                                  <i className="far fa-thumbs-up icons-form1" />
                                )
                              }
                              type="text"
                              readOnly
                              placeholder="Status"
                              id="Status"
                              value={
                                this.state.pushPullNotificationData.Status === 'Requested'
                                  ? 'Requested'
                                  : this.state.pushPullNotificationData.Status === 'Rejected'
                                  ? 'Rejected'
                                  : this.state.pushPullNotificationData.Status === 'Approved'
                                  ? 'Approved'
                                  : ''
                              }
                              className="text-input-form ftsize"
                            />
                          </>
                        )}
                      </>
                    </div>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {this.state.pushPullNotificationData.Status === 'Requested' ? (
                      <div>
                        <p className="PushPullNotification">Approver Comment </p>
                        {this.state.pushPullNotificationData.Status === 'Requested' ? (
                          <>
                            {' '}
                            <TextareaAutosize
                              id="comment"
                              className="text-input-form cmnt-top ftsize"
                              minRows={1}
                              maxRows={6}
                              prefix={<i className="far fa-comments"></i>}
                              value={this.state.Approver_comment}
                              onChange={this.handleCommentChange.bind(this)}
                            />
                            <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                              {this.state.pushPullError || ''}
                            </span>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    ) : (
                      ''
                    )}
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="row_margin">
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    <div>
                      {this.state.pushPullNotificationData.Status === 'Requested' ? (
                        <>
                          {this.state.handleGetStatus != 'Requested' ? (
                            <Form.Item wrapperCol={{ offset: 10, span: 16 }}>
                              <Button
                                type="primary"
                                htmlType="submit"
                                style={{ color: '#ffffff' }}
                                className="submit-button"
                                onClick={this.pushPullnotificationSubmit}>
                                Submit
                              </Button>
                            </Form.Item>
                          ) : (
                            ''
                          )}
                        </>
                      ) : (
                        ''
                      )}
                    </div>
                  </Col>
                </Row>
              </Form>
            </Row>
          </div>
        </Modal>
        {/* dashboard refresh popup */}
        <Modal
          width="90%"
          style={{ top: 60 }}
          footer={null}
          className="Intervaltimeline"
          visible={this.state.NotificationPopup}
          onCancel={this.HandleRefreshPopUp}>
          <h1>time up</h1>
        </Modal>
      </header>
    );
  }
}

function mapState(state) {
  return {
    chatbotonoff: state.ChatBotToggler.ChatBotToggler,
    getNotificationDetailsData: state.getNotificationDetails,
    getLeadtimeExpiryNotificationData: state.getLeadtimeExpiryNotification,
    getLeadtimeExpiryNotificationDdData: state.getLeadtimeExpiryNotificationDd,
    getUserRoleData: state.getUserRole,
    getExhaustDetailNotificationData: state.getExhaustDetailNotification,
    getExhaustDetailsbyIdData: state.getExhaustDetailsbyId,
    getWeeklyStockVisualizationData: state.getWeeklyStockVisualization,
    getMonthlyStockVisualizationData: state.getMonthlyStockVisualization,
    getUserDetailsBySearchData: state.getUserDetailsBySearch,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    saveImpersonationDetailsData: state.saveImpersonationDetails,
    clearImpersonationDetailsData: state.clearImpersonationDetails,

    getDefaultMaterialCapGovData: state.getDefaultMaterialCapGov,
    getPushPullNotificationMessagesData: state.getPushPullNotificationMessages,
    getPushPullDetailByUserData: state.getPushPullDetailByUser,
    InitialpageRenderData: state.InitialpageRender.initialpage,
    UpdateSortingOrder: state.UpdateSorting.sortOrder,
    UpdateSortingField: state.UpdateSorting.sortField,

    getUserImpersonationDetailsRefreshData: state.getUserImpersonationDetailsRefresh,
    getLeadtimeExpiryNotificationDdReducerLoader: state.getLeadtimeExpiryNotificationDdReducerLoader
  };
}

export default connect(mapState, {
  ChatBotToggler,
  getOrganizationList,
  getMaterialFilter,

  getDefaultMaterialCapGov,
  getMaterialInsightsDefaultMatnr,
  getApprovalStatusCount,
  getOrderPushPullMaterialV2,
  getCapGovMaterialReportDD,
  getSupplyChainInventoryPos,
  getTopSpendsByOrganizationChart,
  getTopSpendsByOrganization,
  getDataforMapFullView,
  getMaterialDetailsForMapView,
  getCapExTrendPoPlaced,
  getHarvestingWidget,
  getEOQTbl,
  getExhaustDetailsV2,
  getPredictedCapEx,
  getStockPercent,
  getFillRate,
  getSupplierEfficiency,
  getPredictedCapExDD,
  clearImpersonationDetails,
  saveImpersonationDetails,
  getUserImpersonationDetails,
  getTotalQuantityAndCapexLoader,
  getUserImpersonationDetailsRefresh,
  getUserDetailsBySearch,
  getUserRole,
  getNotificationDetails,
  getExhaustDetailNotification,
  getExhaustDetailsbyId,
  getWeeklyStockVisualization,
  getMonthlyStockVisualization,
  getCapGovInfoForMaterial,
  getCapGovMaterialReport,
  getMaterialInsightsDropDown,
  getPushPullNotificationMessages,
  getPushPullDetailByUser,
  getForecastOverrideApproverList,
  getMaterialManufFilterList,
  ReportNavHideShow,
  getLeadtimeExpiryNotification,
  getLeadtimeExpiryNotificationDd,
  getNBADefaultMaterialReport,
  getBulkExport,
  InitialpageRender,
  UpdatePage,
  UpdateSizePerPage,
  UpdateSorting
})(Header);
