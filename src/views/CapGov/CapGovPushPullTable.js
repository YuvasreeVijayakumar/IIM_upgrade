import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
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
  Select,
  TreeSelect,
  DatePicker,
  Tooltip,
  Badge,
  Menu,
  Radio,
  message,
  Popover
} from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

import TextareaAutosize from 'react-textarea-autosize';
import PropagateLoader from 'react-spinners/PropagateLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import {
  getPushPullMaterialDD,
  getMaterialforPushPull,
  getPONumberForMaterial,
  getPOLineForPO,
  getOrderPushPullMaterial,
  getOrderPushPullManufacturer,
  getApproverList,
  getApprovalStatusCount,
  getApprovalStatusForMaterial,
  getOrderPushPullMaterialV2,
  getOrderPushPullMaterialFlag,
  getUserImpersonationDetails,
  getOrderPushPullReviewData,
  getOrderPushPullApproverReviewData
} from '../../actions';
import 'react-notifications/lib/notifications.css';
import { NotificationContainer, NotificationManager } from 'react-notifications';

import { Barloaderjs } from '../../Barloader';
import { FilePptOutlined } from '@ant-design/icons';
import axios from 'axios';
import { ROOT_URL } from '../../actions/index';
import ReactDragListView from 'react-drag-listview';
import { UploadFile } from './Upload';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { Option } = Select;
const { SearchBar } = Search;
const { TreeNode } = TreeSelect;
const { TabPane } = Tabs;
var parsedFilterSettingsLGORT;

let parsedBlockedDeleted;
let filterMaterial;
let filterPO;
let filterPOLine;
let filterDate;
let filterReason;

class CapGovPushPullTable extends React.Component {
  constructor(props) {
    super(props);
    this.UpdateValidation = this.UpdateValidation.bind(this);
    this.FuncToCheckPushPull = this.FuncToCheckPushPull.bind(this);

    this.PostOrdersPushPullBulkUpdate = this.PostOrdersPushPullBulkUpdate.bind(this);
    this.ResetSelectedState = this.ResetSelectedState.bind(this);
    this.tblLoaderreview = this.tblLoaderreview.bind(this);
    this.tblLoaderApproverReview = this.tblLoaderApproverReview.bind(this);
    this.tblLoader = this.tblLoader.bind(this);
    this.HandleRadioButtonValue = this.HandleRadioButtonValue.bind(this);
    this.imploader = this.imploader.bind(this);

    this.handlesubmitforReject = this.handlesubmitforReject.bind(this);

    this.DrilldownDD = this.DrilldownDD.bind(this);

    this.dateformat = this.dateformat.bind(this);
    this.materialDescription = this.materialDescription.bind(this);

    this.costformat = this.costformat.bind(this);
    this.exportToCSVPushPullMaterial = this.exportToCSVPushPullMaterial.bind(this);
    this.exportToCSVPushPullExistingRequest = this.exportToCSVPushPullExistingRequest.bind(this);
    this.exportToCSVPushPullApproverReview = this.exportToCSVPushPullApproverReview.bind(this);
    this.exportToCSVPushPullManufacturer = this.exportToCSVPushPullManufacturer.bind(this);
    this.addpushpullinfo = this.addpushpullinfo.bind(this);
    this.handleMaterialChange = this.handleMaterialChange.bind(this);
    this.handlePoChange = this.handlePoChange.bind(this);
    this.handlePoLineChange = this.handlePoLineChange.bind(this);
    this.handlePushPullChange = this.handlePushPullChange.bind(this);
    this.handlePushPullDateChange = this.handlePushPullDateChange.bind(this);
    this.handleSupplierChange = this.handleSupplierChange.bind(this);
    this.handleManufacturerChange = this.handleManufacturerChange.bind(this);

    this.handleCommentChange = this.handleCommentChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    this.handleOverWrite = this.handleOverWrite.bind(this);
    this.getcheckValues = this.getcheckValues.bind(this);
    this.rowformatter = this.rowformatter.bind(this);
    this.reqRejFunc = this.reqRejFunc.bind(this);
    this.reqRejFuncPull = this.reqRejFuncPull.bind(this);

    this.state = {
      push_push_Flag: '',
      usercuid: 'ALL',
      InvalidDeleteRow: [],
      Title: 'Push Orders',
      TitlePull: 'Pull Orders',
      prop: true,
      OldTblVale: [],
      UpdatePopUp: false,

      InvalidToValidData: [],
      getApproverCommentForOrdersToReview: '',
      columnIndex: '',
      ApproverReviewArray: [],
      ApproverExistingArray: [],
      TempData_getOrderPushPullReviewDataData: [],

      RadioButtonValue: 'push',
      rejectSubmitLoader: false,
      Modalpushpull: false,

      loading: false,
      current: 'all',
      currentPull: 'all',
      approverCommentEdit: '',
      ApproverId: '',
      Loader: false,
      Approver_form_matr: '',
      Approver_form_po: '',
      Approver_form_poline: '',
      Approver_form_approver_status: '',
      Approver_form_comment: '',
      Approver_form_manufacter: '',
      Approver_form_organisation: '',
      email: '',
      fetched: false,
      getPushPullMaterialDDData: [],
      getOrderPushPullApproverReviewDataData: [],
      getOrderPushPullReviewDataData: [],
      getApprovalStatusForMaterialData: [],
      getOrderPushPullMaterialV2Data: [],
      getApproverListData: [],
      getApprovalStatusCountData: [],
      isDataFetched: false,
      OrderPushPullApproverReviewColumn: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 },

          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'PO',
          text: 'PO',
          sort: true,
          headerStyle: { width: 100 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'PO_LINE',
          text: 'PO Line',
          sort: true,
          headerStyle: { width: 90 },
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
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'Status',
          text: 'Status',
          sort: true,
          headerStyle: { width: 100 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'PUSH_PULL_DATE',
          text: 'Push/Pull Date ',
          sort: true,
          headerStyle: { width: 130 },
          formatter: this.dateformat,
          align: 'center',
          headerAlign: 'center'
        },

        {
          dataField: 'APPROVER',
          text: 'Approver',
          sort: true,
          headerStyle: { width: 250 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By',
          sort: true,
          headerStyle: { width: 280 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          headerStyle: { width: 150 },
          align: 'left',
          headerAlign: 'left'
        }
      ],

      OrdersToreviewColumn: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          filter: textFilter({
            getFilter: (filter) => {
              filterMaterial = filter;
            }
          }),
          headerStyle: { width: 100 },

          align: 'center',
          headerAlign: 'center',
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
          dataField: 'PO',
          text: 'PO',
          sort: true,
          headerStyle: { width: 90 },
          align: 'center',
          headerAlign: 'center',
          filter: textFilter({
            getFilter: (filter) => {
              filterPO = filter;
            }
          }),
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
          dataField: 'PO_LINE',
          text: 'PO Line',
          sort: true,
          headerStyle: { width: 90 },
          align: 'center',
          headerAlign: 'center',
          filter: textFilter({
            getFilter: (filter) => {
              filterPOLine = filter;
            }
          }),
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
          dataField: 'UPDATEDDELIVERYDATE',
          text: 'Updated Delivery Date ',
          sort: true,
          headerStyle: { width: 90 },
          // formatter: this.dateformat,
          align: 'center',
          headerAlign: 'center',
          filter: dateFilter({
            getFilter: (filter) => {
              filterDate = filter;
            }
          }),
          formatter: (cell) => {
            let dateObj = cell;
            if (typeof cell !== 'object') {
              dateObj = new Date(cell);
            }
            return `${('0' + dateObj.getUTCDate()).slice(-2)}/${(
              '0' +
              (dateObj.getUTCMonth() + 1)
            ).slice(-2)}/${dateObj.getUTCFullYear()}`;
          },
          editor: {
            type: Type.DATE
          }
        },
        {
          dataField: 'Reason',
          text: 'Reason ',
          sort: true,
          headerStyle: { width: 150 },
          filter: textFilter({
            getFilter: (filter) => {
              filterReason = filter;
            }
          }),
          align: 'left',
          headerAlign: 'left',
          editable: false
        }
      ],
      getPushMaterialColumn: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.materialDescription,
          headerClasses: 'id-custom-cell',
          classes: 'material-position-fixed',
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Status',
          text: 'Status',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.rowformatter,
          headerClasses: 'id-custom-cell1',
          classes: 'material-position-fixed1',
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'PO',
          text: 'PO',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'PO_LINE',
          text: 'PO Line',
          sort: true,
          headerStyle: { width: 90 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'SUPPLIER',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 125 },
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
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'PUSH_PULL_DATE',
          text: 'Push/Pull Date',
          headerStyle: { width: 120 },
          formatter: this.dateformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          headerStyle: { width: 105 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By(Email ID)',
          sort: true,
          headerStyle: { width: 180 },
          align: 'left',
          headerAlign: 'left'
        }
      ],
      getPullMaterialColumn: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Status',
          text: 'Status',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.rowformatter,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'PO',
          text: 'PO',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'PO_LINE',
          text: 'PO Line',
          sort: true,
          headerStyle: { width: 90 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'SUPPLIER',
          text: 'Organization',
          sort: true,
          headerStyle: { width: 125 },
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
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'PUSH_PULL_DATE',
          text: 'Push/Pull Date',
          headerStyle: { width: 120 },
          formatter: this.dateformat,
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          headerStyle: { width: 110 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By(Email ID)',
          sort: true,
          headerStyle: { width: 180 },
          align: 'left',
          headerAlign: 'left'
        }
      ],
      getPushManufacturerColumn: [
        {
          dataField: 'Manufacturer',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 100 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'OrdersCount',
          text: 'Orders Pushed',
          sort: true,
          headerStyle: { width: 90 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'Open_Value',
          text: 'Open Value',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        }
      ],
      getPullManufacturerColumn: [
        {
          dataField: 'Manufacturer',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 100 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'OrdersCount',
          text: 'Orders Pulled',
          sort: true,
          headerStyle: { width: 90 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Open_Value',
          text: 'Open Value',
          sort: true,
          headerStyle: { width: 100 },
          formatter: this.costformat,
          align: 'right',
          headerAlign: 'right'
        }
      ],
      addpushpullinfoModal: false,
      material_no: '',
      po_line: '',
      po_text: '',
      supplier_name: '',
      manufacturer: '',
      push_pull_select: 'Push',
      push_pull_date: '',
      comments: '',
      submittedbymail: '',
      Errors: {},
      getMaterialforPushPullData: [],
      getPONumberForMaterialData: [],
      getPOLineForPOData: [],
      overwriteModal: false,
      requestalertData: '',
      getOrderPushPullMaterialData: [],
      getOrderPushPullManufacturerData: [],
      pullView: false,
      defaultActivePushKey: '1',
      defaultActivePullKey: '1',
      defaultActiveReviewKey: '1',
      defaultActiveKeySwitch: '1',
      showModal: false,
      isDataFetchedreview: false,
      newResultLengthreview: ''
    };
  }

  componentDidMount() {
    this.setState({ email: window.sessionStorage.getItem('loggedEmailId') });

    this.props.getApproverList();
  }

  UNSAFE_componentWillUpdate(nextProps) {
    if (
      this.props.getOrderPushPullApproverReviewDataData !=
      nextProps.getOrderPushPullApproverReviewDataData
    ) {
      if (nextProps.getOrderPushPullApproverReviewDataData != 0) {
        this.setState({
          getOrderPushPullApproverReviewDataData: nextProps.getOrderPushPullApproverReviewDataData,
          fetched: false
        });
      } else {
        this.setState({
          getOrderPushPullApproverReviewDataData: [],
          fetched: true
        });
      }
    }
    if (this.props.getOrderPushPullReviewDataData != nextProps.getOrderPushPullReviewDataData) {
      if (nextProps.getOrderPushPullReviewDataData != 0) {
        this.setState({
          getOrderPushPullReviewDataData: nextProps.getOrderPushPullReviewDataData,
          isDataFetchedreview: true
        });
      } else {
        this.setState({
          getOrderPushPullReviewDataData: [],
          isDataFetchedreview: true
        });
      }
    }

    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.imploader();
        const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

        parsedBlockedDeleted = JSON.parse(filterSettingsOrg)[0].BlockedDeleted;
        parsedFilterSettingsLGORT = JSON.parse(filterSettingsOrg)[0].LGORT;
        sessionStorage.setItem('Username', nextProps.getUserImpersonationDetailsData[0].UserName);
        sessionStorage.setItem(
          'IsApprover',
          nextProps.getUserImpersonationDetailsData[0].IsApprover
        );
        this.setState({
          organization: nextProps.getUserImpersonationDetailsData[0].FilterSetting,
          usercuid:
            nextProps.getUserImpersonationDetailsData[0].loggedcuid == null
              ? 'all'
              : nextProps.getUserImpersonationDetailsData[0].loggedcuid
        });
      }
    }
    if (this.props.getOrderPushPullMaterialV2Data != nextProps.getOrderPushPullMaterialV2Data) {
      if (nextProps.getOrderPushPullMaterialV2Data != 0) {
        this.setState({
          getOrderPushPullMaterialData: nextProps.getOrderPushPullMaterialV2Data,
          isDataFetched: false,
          Loader: false
        });
      } else {
        this.setState({
          getOrderPushPullMaterialData: [],
          isDataFetched: true,
          Loader: false
        });
      }
    }
    if (this.props.getApprovalStatusForMaterialData != nextProps.getApprovalStatusForMaterialData) {
      if (nextProps.getApprovalStatusForMaterialData) {
        this.setState({
          getApprovalStatusForMaterialData: nextProps.getApprovalStatusForMaterialData,
          Approver_form_matr: nextProps.getApprovalStatusForMaterialData.map((dd) => dd.MATERIAL),
          Approver_form_po: nextProps.getApprovalStatusForMaterialData.map((dd) => dd.PO),
          Approver_form_poline: nextProps.getApprovalStatusForMaterialData.map((dd) => dd.PO_LINE),
          Approver_form_approver_status: nextProps.getApprovalStatusForMaterialData.map(
            (dd) => dd.APPROVER_STATUS
          ),
          Approver_form_manufacter: nextProps.getApprovalStatusForMaterialData.map(
            (dd) => dd.MANUFACTURER
          ),
          Approver_form_organisation: nextProps.getApprovalStatusForMaterialData.map(
            (dd) => dd.SUPPLIER
          ),
          Approver_form_email: nextProps.getApprovalStatusForMaterialData.map(
            (dd) => dd.SUBMITTED_BY
          ),
          Approver_form_push_pull_status: nextProps.getApprovalStatusForMaterialData.map(
            (dd) => dd.PUSH_PULL
          ),
          Approver_form_approver_name: nextProps.getApprovalStatusForMaterialData.map(
            (dd) => dd.Approver
          ),
          Approver_form_date: nextProps.getApprovalStatusForMaterialData.map((dd) =>
            moment(dd.PUSH_PULL_DATE).format('MM-DD-YYYY')
          ),
          push_pull_date: nextProps.getApprovalStatusForMaterialData.map((dd) =>
            moment(dd.PUSH_PULL_DATE).format('MM-DD-YYYY')
          ),
          Approver_form_comment_from_push: nextProps.getApprovalStatusForMaterialData.map(
            (dd) => dd.COMMENTS
          ),
          APPROVER_FLAG: nextProps.getApprovalStatusForMaterialData.map((dd) => dd.APPROVER_FLAG),
          REJECTED_FLAG: nextProps.getApprovalStatusForMaterialData.map((dd) => dd.REJECTED_FLAG),
          ApproverId: nextProps.getApprovalStatusForMaterialData.map((dd) => dd.APPROVER_ID),
          STATUS: nextProps.getApprovalStatusForMaterialData.map((dad) => dad.STATUS),
          APPROVER_COMMENTS: nextProps.getApprovalStatusForMaterialData.map(
            (dd) => dd.APPROVER_COMMENTS
          )
        });
      } else {
        this.setState({
          getApprovalStatusForMaterialData: []
        });
      }
    }
    if (this.props.getOrderPushPullMaterialFlagData != nextProps.getOrderPushPullMaterialFlagData) {
      if (nextProps.getOrderPushPullMaterialFlagData != 0) {
        nextProps.getOrderPushPullMaterialFlagData.map((d) => {
          this.setState({
            push_push_Flag: d.pushpullflag
          });
        });
      }
    }
    if (this.props.getApprovalStatusCountData != nextProps.getApprovalStatusCountData) {
      if (nextProps.getApprovalStatusCountData != 0) {
        this.setState({
          getApprovalStatusCountData: nextProps.getApprovalStatusCountData
        });
      } else {
        this.setState({
          getApprovalStatusCountData: []
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
    if (this.props.getPushPullMaterialDDData != nextProps.getPushPullMaterialDDData) {
      if (nextProps.getPushPullMaterialDDData != 0) {
        this.setState({
          getPushPullMaterialDDData: nextProps.getPushPullMaterialDDData
        });
      } else {
        this.setState({
          getPushPullMaterialDDData: []
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
      } else {
        this.setState({
          getPONumberForMaterialData: []
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

    if (this.props.getOrderPushPullMaterialData != nextProps.getOrderPushPullMaterialData) {
      if (nextProps.getOrderPushPullMaterialData != 0) {
        this.setState({
          getOrderPushPullMaterialData: nextProps.getOrderPushPullMaterialData,
          isDataFetched: false,
          Loader: false
        });
      } else {
        this.setState({
          getOrderPushPullMaterialData: [],
          isDataFetched: true
          // Loader: true,
        });
      }
    }

    if (this.props.getOrderPushPullManufacturerData != nextProps.getOrderPushPullManufacturerData) {
      if (nextProps.getOrderPushPullManufacturerData != 0) {
        this.setState({
          getOrderPushPullManufacturerData: nextProps.getOrderPushPullManufacturerData,
          isDataFetched: false
        });
      } else {
        this.setState({
          getOrderPushPullManufacturerData: [],
          isDataFetched: true
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

  tblLoaderreview() {
    if (this.state.isDataFetchedreview) {
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
  dateformat(cell) {
    let value = moment(cell).format('MM-DD-YYYY');
    if (value == '01-01-2099' || cell == null || cell == '') {
      return <span>-</span>;
    } else {
      return <span>{value}</span>;
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

  exportToCSVPushPullMaterial() {
    let csvData = this.state.getOrderPushPullMaterialData;
    let fileName = this.state.pullView == false ? this.state.Title : this.state.TitlePull;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVPushPullExistingRequest() {
    let dum = [];
    dum = this.state.getOrderPushPullReviewDataData.map((d) => {
      return {
        KEY: d.KEY,
        MATERIAL: d.MATERIAL,
        PO: d.PO,
        PO_LINE: d.PO_LINE,
        UpdatedDeliveryDate: d.UPDATEDDELIVERYDATE,
        Reason: d.Reason
      };
    });
    let csvData = dum;
    let fileName = `${
      this.state.defaultActiveReviewKey == 1
        ? 'Push_Pull Existing Request'
        : 'Push_Pull Invalid Request'
    }`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVPushPullApproverReview() {
    let csvData = this.state.getOrderPushPullApproverReviewDataData;
    let fileName = 'Orders Push/Pull Approver Review';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  exportToCSVPushPullManufacturer() {
    let csvData = this.state.getOrderPushPullManufacturerData;
    let fileName = 'Orders Push/Pull';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  addpushpullinfo() {
    this.setState({
      loading: false
    });
    if (this.state.usercuid != null) {
      this.props.getPushPullMaterialDD(
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getPushPullMaterialDD(
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }

    if (this.state.addpushpullinfoModal == true) {
      this.setState({
        getPONumberForMaterialData: [],
        getPOLineForPOData: [],

        addpushpullinfoModal: false,
        isDataFetched: false,
        material_no: '',
        po_line: '',
        po_text: '',
        supplier_name: '',
        manufacturer: '',
        push_pull_select: 'Push',
        push_pull_date: '',
        comments: '',
        submittedbymail: '',
        Errors: {}
      });
    } else {
      this.setState({
        isDataFetched: false,
        addpushpullinfoModal: true,
        material_no: '',
        Approver: '',
        po_line: '',
        po_text: '',
        supplier_name: '',
        manufacturer: '',
        push_pull_select: 'Push',
        push_pull_date: '',
        comments: '',
        submittedbymail: '',
        Errors: {}
      });
    }
  }

  validateForm() {
    let Errors = {};
    let formIsValid = true;
    if (!this.state.material_no) {
      formIsValid = false;
      Errors['material_no'] = '*Material is required';
    }
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
    if (!this.state.email) {
      formIsValid = false;
      Errors['submittedbymail'] = '*Submit by Email is required';
    }
    this.setState({
      Errors: Errors
    });
    return formIsValid;
  }

  handleMaterialChange(e) {
    if (isNaN(Number(e))) {
      return;
    } else {
      if (this.state.material_no == 0) {
        if (this.state.material_no != e) {
          this.FuncToCheckPushPull(e, '', '', '', '');
          this.setState({
            material_no: e,
            getPONumberForMaterialData: [],
            po_text: '',
            po_line: '',
            push_pull_date: ''
          });
        } else {
          this.FuncToCheckPushPull(e, '', '', '', '');
          this.setState({ material_no: e, po_text: '', po_line: '', push_pull_date: '' });
        }
        this.FuncToCheckPushPull(e, '', '', '', '');
        this.setState({ material_no: e, po_text: '', po_line: '', push_pull_date: '' });
      } else {
        this.FuncToCheckPushPull(e, '', '', '', '');
        this.setState({ material_no: e, po_text: '', po_line: '', push_pull_date: '' });
      }
    }

    this.props.getMaterialforPushPull(e);
    this.props.getPONumberForMaterial(e);
  }
  handleApproverChange(e) {
    this.state.getApproverListData.map((dat) =>
      dat.ApproverName == e
        ? this.setState({
            ApproverId: dat.ID,
            Approver_form_approver_name: e
          })
        : ''
    );

    this.setState({
      Approver: e
    });
  }

  handlePoChange(e) {
    if (isNaN(Number(e))) {
      return;
    } else {
      if (this.state.po_text == 0) {
        this.setState({ po_text: e, push_pull_date: '' });
        this.FuncToCheckPushPull(this.state.material_no, e, '', '');
        this.props.getPOLineForPO(this.state.material_no, e);
      } else {
        this.setState({ po_text: e, po_line: '', push_pull_date: '' });
        this.FuncToCheckPushPull(this.state.material_no, e, '', '');
        this.props.getPOLineForPO(this.state.material_no, e);
      }
    }
  }

  handlePoLineChange(e) {
    if (isNaN(Number(e))) {
      return;
    } else {
      this.FuncToCheckPushPull(this.state.material_no, this.state.po_text, e, '');

      this.setState({ po_line: e, push_pull_date: '' });
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
    this.FuncToCheckPushPull(
      this.state.material_no,
      this.state.po_text,
      this.state.po_line,
      moment(data).format('MM-DD-YYYY')
    );

    this.setState({
      push_pull_date: data,
      Approver_form_date: moment(data).format('MM-DD-YYYY')
    });
  }

  handleCommentChange(e) {
    this.setState({ comment: e.target.value });
  }
  handlePushPullChange(e) {
    this.setState({
      push_pull_select: e,
      Approver_form_push_pull_status: e,
      submittedbymail: this.state.email
    });

    // this.setState({ submittedbymail: this.state.email });

    // if (re.test(email)) {
    //   //Email valid. Procees to test if it's from the right domain
    //   //   (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
    //   if (
    //     email.indexOf("@lumen.com", email.length - "@lumen.com".length) !==
    //       -1 ||
    //     email.indexOf(
    //       "@centurylink.com",
    //       email.length - "@centurylink.com".length
    //     ) !== -1
    //   ) {
    //     this.setState({ submittedbymail: this.state.email });
    //     NotificationManager.success("Valid Mail ID", "", 3000);
    //   } else {
    //     NotificationManager.info(
    //       "Invalid Mail ID please try with @lumen.com or @centurylink.com",
    //       "",
    //       4000
    //     );
    //     this.setState({ submittedbymail: " " });
    //   }
    // }
  }
  // handleSubmittedbyEmailChange(e) {
  // const email = this.state.email;
  // this.setState({ submittedbymail: this.state.email });
  // var re =
  //   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{3,}))$/;
  // if (re.test(email)) {
  //   //Email valid. Procees to test if it's from the right domain
  //   //   (Second argument is to check that the string ENDS with this domain, and that it doesn't just contain it)
  //   if (
  //     email.indexOf("@lumen.com", email.length - "@lumen.com".length) !==
  //       -1 ||
  //     email.indexOf(
  //       "@centurylink.com",
  //       email.length - "@centurylink.com".length
  //     ) !== -1
  //   ) {
  //     this.setState({ submittedbymail: e.target.value });
  //     NotificationManager.success("Valid Mail ID", "", 3000);
  //   } else {
  //     NotificationManager.info(
  //       "Invalid Mail ID please try with @lumen.com or @centurylink.com",
  //       "",
  //       4000
  //     );
  //     this.setState({ submittedbymail: " " });
  //   }
  // }
  // }
  handleYes() {
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
          overwriteModal: false,
          Errors: '',
          material_no: '',
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
          this.props.getOrderPushPullMaterialV2(
            'Push',
            'all',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getOrderPushPullMaterialV2(
            'Pull',
            'all',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else {
        NotificationManager.error('Data Not Updated', '', 2000);
        this.setState({
          overwriteModal: false,
          Errors: '',
          material_no: '',
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
          if (this.state.usercuid != null) {
            this.props.getOrderPushPullMaterialV2(
              'Push',
              'all',
              this.state.usercuid,

              parsedFilterSettingsLGORT,
              parsedBlockedDeleted
            );
          } else {
            this.props.getOrderPushPullMaterialV2(
              'Push',
              'all',
              'all',

              parsedFilterSettingsLGORT,
              parsedBlockedDeleted
            );
          }
        } else {
          if (this.state.usercuid != null) {
            this.props.getOrderPushPullMaterialV2(
              'pull',
              'all',
              this.state.usercuid,

              parsedFilterSettingsLGORT,
              parsedBlockedDeleted
            );
          } else {
            this.props.getOrderPushPullMaterialV2(
              'pull',
              'all',
              'all',

              parsedFilterSettingsLGORT,
              parsedBlockedDeleted
            );
          }
        }
      }
    });
  }
  handleNo() {
    this.setState({
      overwriteModal: false
    });
    NotificationManager.warning('No datas inserted', '', 2000);
    this.setState({
      overwriteModal: false,
      Errors: '',
      material_no: '',
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
      if (this.state.usercuid != null) {
        this.props.getOrderPushPullMaterialV2(
          'Push',
          'all',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getOrderPushPullMaterialV2(
          'Push',
          'all',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      if (this.state.usercuid != null) {
        this.props.getOrderPushPullMaterialV2(
          'pull',
          'all',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getOrderPushPullMaterialV2(
          'pull',
          'all',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }

  handleOverWrite() {
    if (!this.state.overwriteModal) {
      this.setState({
        overwriteModal: true
      });
    }
  }
  FuncToCheckPushPull(mat, po, poline, date) {
    if (mat && po && poline && date) {
      this.props.getOrderPushPullMaterialFlag(mat, po, poline, date);
    } else {
      this.setState({
        push_push_Flag: ''
      });
    }
  }

  handleSubmit() {
    const PO = this.state.po_text;
    const PO_Line = this.state.po_line;
    const MATERIAL = this.state.material_no;
    const PUSH_PULL_DATE = this.state.push_pull_date._i;
    const SUPPLIER = this.state.supplier_name;
    const MANUFACTURER = this.state.manufacturer;
    const PUSH_PULL = this.state.push_push_Flag;
    const COMMENT = this.state.comment;
    const SUBMITTED_BY = sessionStorage.getItem('loggedEmailId');

    const Approverid = this.state.ApproverId;

    if (this.validateForm()) {
      this.setState({
        loading: true
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
              Approverid,
            method: 'post'
          }).then((res) => {
            if (res.status == 200) {
              NotificationManager.success(res.data, '', 2000);
              this.setState({
                Errors: '',
                material_no: '',
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
                if (this.state.usercuid != null) {
                  this.props.getApprovalStatusCount(
                    'push',
                    this.state.usercuid,

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );

                  this.props.getOrderPushPullMaterialV2(
                    'Push',
                    'all',
                    this.state.usercuid,

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );
                } else {
                  this.props.getApprovalStatusCount(
                    'push',
                    'all',

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );

                  this.props.getOrderPushPullMaterialV2(
                    'Push',
                    'all',
                    'all',

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );
                }
              } else {
                if (this.state.usercuid != null) {
                  this.props.getApprovalStatusCount(
                    'pull',
                    this.state.usercuid,

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );

                  this.props.getOrderPushPullMaterialV2(
                    'pull',
                    'all',
                    this.state.usercuid,

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );
                } else {
                  this.props.getApprovalStatusCount(
                    'pull',
                    'all',

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );

                  this.props.getOrderPushPullMaterialV2(
                    'pull',
                    'all',
                    'all',

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );
                }
              }
            } else {
              NotificationManager.error('Data Not Updated', '', 2000);
              this.setState({
                Errors: '',
                material_no: '',
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
                if (this.state.usercuid != null) {
                  this.props.getApprovalStatusCount(
                    'push',
                    this.state.usercuid,

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );

                  this.props.getOrderPushPullMaterialV2(
                    'Push',
                    'all',
                    this.state.usercuid,

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );
                } else {
                  this.props.getApprovalStatusCount(
                    'push',
                    'all',

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );

                  this.props.getOrderPushPullMaterialV2(
                    'Push',
                    'all',
                    'all',

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );
                }
              } else {
                if (this.state.usercuid != null) {
                  this.props.getApprovalStatusCount(
                    'pull',
                    this.state.usercuid,

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );

                  this.props.getOrderPushPullMaterialV2(
                    'pull',
                    'all',
                    this.state.usercuid,

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );
                } else {
                  this.props.getApprovalStatusCount(
                    'pull',
                    'all',

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );

                  this.props.getOrderPushPullMaterialV2(
                    'pull',
                    'all',
                    'all',

                    parsedFilterSettingsLGORT,
                    parsedBlockedDeleted
                  );
                }
              }
            }
          });
        } else {
          this.handleOverWrite();
        }
      });
      // eslint-disable-next-line no-undef
      e.preventDefault();
    } else {
      // eslint-disable-next-line no-undef
      e.preventDefault();
    }
  }

  getcheckValues(key) {
    this.setState({
      defaultActivePushKey: '1',
      defaultActivePullKey: '1'
    });
    if (key == 2) {
      this.setState({
        isDataFetched: false,
        pullView: true,
        Loader: true,
        defaultActiveKeySwitch: '2',
        getOrderPushPullMaterialData: []
      });
      if (this.state.usercuid != null) {
        this.props.getApprovalStatusCount(
          'pull',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );

        this.props.getOrderPushPullMaterialV2(
          'Pull',
          'all',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getApprovalStatusCount(
          'pull',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
        // this.props.getOrderPushPullManufacturer("Pull", "all");
        this.props.getOrderPushPullMaterialV2(
          'Pull',
          'all',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        isDataFetched: false,
        pullView: false,
        Loader: true,
        defaultActiveKeySwitch: '1',
        getOrderPushPullMaterialData: []
      });
      if (this.state.usercuid != null) {
        this.props.getApprovalStatusCount(
          'push',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );

        this.props.getOrderPushPullMaterialV2(
          'Push',
          'all',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getApprovalStatusCount(
          'push',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
        // this.props.getOrderPushPullManufacturer("Push", "all");
        this.props.getOrderPushPullMaterialV2(
          'Push',
          'all',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }

  callReviewback(key) {
    this.setState({
      newResultLengthreview: '',
      defaultActivePushKey: '1',
      defaultActivePullKey: '1',
      defaultActiveReviewKey: '1'
    });
    if (key == 2) {
      this.setState({
        Loader: true,
        defaultActiveReviewKey: '2',
        getOrderPushPullReviewDataData: [],
        isDataFetchedreview: false,
        InvalidToValidData: [],
        InvalidDeleteRow: []
      });
      this.props.getOrderPushPullReviewData(
        'INVALID_REQUEST',
        sessionStorage.getItem('loggedEmailId')
      );
    } else {
      this.setState({
        Loader: true,
        defaultActiveReviewKey: '1',
        getOrderPushPullReviewDataData: [],
        isDataFetchedreview: false,
        ApproverExistingArray: []
      });
      this.props.getOrderPushPullReviewData(
        'EXSISTING_REQUEST',
        sessionStorage.getItem('loggedEmailId')
      );
    }
  }

  callPushback(key) {
    this.setState({
      defaultActivePushKey: '1',
      defaultActivePullKey: '1'
    });
    if (key == 2) {
      this.setState({
        isDataFetched: false,
        current: 'all',
        Loader: true,
        defaultActivePushKey: '2',
        getOrderPushPullManufacturerData: []
      });

      if (this.state.usercuid != null) {
        this.props.getOrderPushPullManufacturer(
          'Push',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getOrderPushPullManufacturer(
          'Push',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        isDataFetched: false,
        current: 'all',
        Loader: true,
        defaultActivePushKey: '1',
        getOrderPushPullMaterialData: []
      });
      if (this.state.usercuid != null) {
        this.props.getOrderPushPullMaterialV2(
          'Push',
          'all',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getOrderPushPullMaterialV2(
          'Push',
          'all',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }

  callPullback(key) {
    this.setState({
      defaultActivePushKey: '1',
      defaultActivePullKey: '1',
      defaultActiveReviewKey: '1',
      isDataFetched: false
    });
    if (key == '2') {
      this.setState({
        getOrderPushPullManufacturerData: [],
        isDataFetched: false,

        Loader: true,
        defaultActivePullKey: '2'
      });

      if (this.state.usercuid != null) {
        this.props.getOrderPushPullManufacturer(
          'Pull',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getOrderPushPullManufacturer(
          'Pull',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        getOrderPushPullMaterialData: [],
        isDataFetched: false,

        Loader: true,
        defaultActivePullKey: '1'
      });
      if (this.state.usercuid != null) {
        this.props.getOrderPushPullMaterialV2(
          'pull',
          'all',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getOrderPushPullMaterialV2(
          'pull',
          'all',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }
  // Satus_column(cell, row, rowIndex, formatExtraData) {
  //   if (cell == "Approved") {
  //     return { color: "#50c878" };
  //   }
  // }
  materialDescription(cell, row) {
    return (
      <div>
        <Tooltip
          placement="right"
          className="modal-tool-tip"
          title={
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
          <span className="row-data" onClick={() => this.DrilldownDD(row)}>
            {cell}
          </span>
        </Tooltip>
      </div>
    );
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

  DrilldownDD(e) {
    var mtnr = e.MATERIAL;
    var po = e.PO;
    var POLine = e.PO_LINE;
    // var email = e.SUBMITTED_BY;
    var email = sessionStorage.getItem('loggedEmailId');
    this.setState({
      showModal: true
    });
    this.props.getApprovalStatusForMaterial(mtnr, po, POLine, email);
  }
  closeModal() {
    this.setState({
      showModal: false,
      Approver_form_matr: '',
      Approver_form_po: '',
      Approver_form_poline: '',
      Approver_form_approver_name: '',
      Approver_form_manufacter: '',
      Approver_form_organisation: '',
      Approver_form_email: '',
      Approver_form_comment_from_push: '',
      Approver_form_push_pull_status: '',
      Approver_form_date: '',
      Approver_form_approver_status: '',
      Approver_form_comment: ''
    });
  }
  handleApproverstatusChange(e) {
    this.setState({
      Approver_form_approver_status: e
    });
  }
  handleApprovercommentChange(e) {
    this.setState({
      APPROVER_COMMENTS: e.target.value
    });
  }

  handleSubmit1() {
    this.setState({
      rejectSubmitLoader: true
    });
    const mt = this.state.Approver_form_matr;
    const po_mt = this.state.Approver_form_po;
    const Poline_mt = this.state.Approver_form_poline;
    const cmnt_mt = this.state.APPROVER_COMMENTS;
    const Status_mt = this.state.Approver_form_approver_status;
    const PushPullDate = this.state.Approver_form_date;
    if (this.state.Approver_form_approver_status != 1) {
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
        if (res.status == 200) {
          NotificationManager.success(res.data, '', 2000);
          this.setState({
            rejectSubmitLoader: false,
            Approver_form_approver_status: '',
            Approver_form_comment: '',
            showModal: false
          });

          if (this.state.pullView == false) {
            if (this.state.usercuid != null) {
              this.props.getApprovalStatusCount(
                'Push',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Push',
                'all',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            } else {
              this.props.getApprovalStatusCount(
                'Push',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Push',
                'all',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }
          } else {
            if (this.state.usercuid != null) {
              this.props.getApprovalStatusCount(
                'Pull',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Pull',
                'all',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            } else {
              this.props.getApprovalStatusCount(
                'Pull',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Pull',
                'all',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }
          }
        } else {
          NotificationManager.error('Data Not Updated', '', 2000);
          this.setState({
            rejectSubmitLoader: false,
            Approver_form_approver_status: '',
            Approver_form_comment: '',
            showModal: false
          });

          if (this.state.pullView == false) {
            if (this.state.usercuid != null) {
              this.props.getApprovalStatusCount(
                'Push',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Push',
                'all',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            } else {
              this.props.getApprovalStatusCount(
                'Push',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Push',
                'all',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }
          } else {
            if (this.state.usercuid != null) {
              this.props.getApprovalStatusCount(
                'Pull ',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Pull',
                'all',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            } else {
              this.props.getApprovalStatusCount(
                'Pull ',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Pull',
                'all',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }
          }
        }
      });
    } else {
      NotificationManager.error('Data Not Updated', '', 2000);
      this.setState({
        rejectSubmitLoader: false,
        Approver_form_approver_status: '',
        Approver_form_comment: '',
        showModal: false
      });

      if (this.state.pullView == false) {
        if (this.state.usercuid != null) {
          this.props.getApprovalStatusCount(
            'Push',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
          this.props.getOrderPushPullMaterialV2(
            'Push',
            'all',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getApprovalStatusCount(
            'Push',
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
          this.props.getOrderPushPullMaterialV2(
            'Push',
            'all',
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else {
        if (this.state.usercuid != null) {
          this.props.getApprovalStatusCount(
            'Pull ',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
          this.props.getOrderPushPullMaterialV2(
            'Pull',
            'all',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getApprovalStatusCount(
            'Pull ',
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
          this.props.getOrderPushPullMaterialV2(
            'Pull',
            'all',
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      }
    }
  }
  countFunc() {
    this.setState({
      Loader: true,
      Title: 'Push Rejected Orders'
    });
    if (this.state.usercuid != null) {
      this.props.getOrderPushPullMaterialV2(
        'push',
        'Rejected',
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getOrderPushPullMaterialV2(
        'push',
        'Rejected',
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }
  }
  countFunc1() {
    this.setState({
      Loader: true,
      Title: 'Push Requested Orders'
    });
    if (this.state.usercuid != null) {
      this.props.getOrderPushPullMaterialV2(
        'push',
        'Requested',
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getOrderPushPullMaterialV2(
        'push',
        'Requested',
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }
  }
  countFunc2() {
    this.setState({
      Loader: true,
      Title: 'Push Approved Orders'
    });
    if (this.state.usercuid != null) {
      this.props.getOrderPushPullMaterialV2(
        'push',
        'approved',
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getOrderPushPullMaterialV2(
        'push',
        'approved',
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }
  }
  countFuncpull() {
    this.setState({
      Loader: true,
      TitlePull: 'Pull Rejected Orders'
    });
    if (this.state.usercuid != null) {
      this.props.getOrderPushPullMaterialV2(
        'pull',
        'Rejected',
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getOrderPushPullMaterialV2(
        'pull',
        'Rejected',
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }
  }
  countFunc1pull() {
    this.setState({
      Loader: true,
      TitlePull: 'Pull Requested Orders'
    });

    if (this.state.usercuid != null) {
      this.props.getOrderPushPullMaterialV2(
        'pull',
        'Requested',
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getOrderPushPullMaterialV2(
        'pull',
        'Requested',
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }
  }
  countFunc2pull() {
    this.setState({
      Loader: true,
      TitlePull: 'Pull Approved Orders'
    });
    if (this.state.usercuid != null) {
      this.props.getOrderPushPullMaterialV2(
        'pull',
        'approved',
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getOrderPushPullMaterialV2(
        'pull',
        'approved',
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }
  }
  countAllpull() {
    this.setState({
      Loader: true,
      TitlePull: 'Pull Orders'
    });
    if (this.state.usercuid != null) {
      this.props.getOrderPushPullMaterialV2(
        'pull',
        'all',
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getOrderPushPullMaterialV2(
        'pull',
        'all',
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }
  }
  countAllpush() {
    this.setState({
      Loader: true,
      Title: 'Push Orders'
    });
    if (this.state.usercuid != null) {
      this.props.getOrderPushPullMaterialV2(
        'push',
        'all',
        this.state.usercuid,

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    } else {
      this.props.getOrderPushPullMaterialV2(
        'push',
        'all',
        'all',

        parsedFilterSettingsLGORT,
        parsedBlockedDeleted
      );
    }
  }
  handleCommentChangeReject(e) {
    this.setState({ Approver_form_comment_from_push: e.target.value });
  }
  handleCommentApprover(e) {
    this.setState({ approverCommentEdit: e.target.value });
  }
  handlesubmitforReject() {
    this.setState({
      rejectSubmitLoader: true
    });

    const PO = this.state.Approver_form_po;
    const PO_Line = this.state.Approver_form_poline;
    const MATERIAL = this.state.Approver_form_matr;

    const SUPPLIER = this.state.Approver_form_organisation;
    const MANUFACTURER = this.state.Approver_form_manufacter;
    const PUSH_PULL = this.state.Approver_form_push_pull_status;

    const Approverid = this.state.ApproverId;
    const PUSH_PULL_DATE = moment(this.state.Approver_form_date).format('MM-DD-YYYY');

    const COMMENT = this.state.Approver_form_comment_from_push;
    const SUBMITTED_BY = sessionStorage.getItem('loggedEmailId');

    if (this.state.REJECTED_FLAG == 'Y') {
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
          Approverid,
        method: 'post'
      }).then((res) => {
        if (res.status == 200) {
          NotificationManager.success(res.data, '', 2000);
          this.setState({
            rejectSubmitLoader: false,
            showModal: false,
            Errors: '',
            material_no: '',
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
            if (this.state.usercuid != null) {
              this.props.getApprovalStatusCount(
                'push',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );

              this.props.getOrderPushPullMaterialV2(
                'Push',
                'all',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            } else {
              this.props.getApprovalStatusCount(
                'push',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getApprovalStatusCount(
                'push',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Push',
                'all',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }
          } else {
            if (this.state.usercuid != null) {
              this.props.getApprovalStatusCount(
                'pull',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getApprovalStatusCount(
                'pull',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'pull',
                'all',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            } else {
              this.props.getApprovalStatusCount(
                'pull',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getApprovalStatusCount(
                'pull',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'pull',
                'all',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }
          }
        } else {
          NotificationManager.error('Data Not Updated', '', 2000);
          this.setState({
            rejectSubmitLoader: false,
            Errors: '',
            material_no: '',
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
            if (this.state.usercuid != null) {
              this.props.getApprovalStatusCount(
                'push',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getApprovalStatusCount(
                'push',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Push',
                'all',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            } else {
              this.props.getApprovalStatusCount(
                'push',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getApprovalStatusCount(
                'push',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'Push',
                'all',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }
          } else {
            if (this.state.usercuid != null) {
              this.props.getApprovalStatusCount(
                'pull',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getApprovalStatusCount(
                'pull',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'pull',
                'all',
                this.state.usercuid,

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            } else {
              this.props.getApprovalStatusCount(
                'pull',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getApprovalStatusCount(
                'pull',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
              this.props.getOrderPushPullMaterialV2(
                'pull',
                'all',
                'all',

                parsedFilterSettingsLGORT,
                parsedBlockedDeleted
              );
            }
          }
        }
      });
    } else {
      NotificationManager.error('Data Not Updated', '', 2000);
      this.setState({
        rejectSubmitLoader: false,
        Errors: '',
        material_no: '',
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
    }
  }
  reqRejFunc(e) {
    this.setState({
      current: e.key
    });
  }
  reqRejFuncPull(e) {
    this.setState({
      currentPull: e.key
    });
  }
  infoPP() {
    if (this.state.Modalpushpull == true) {
      this.setState({
        Modalpushpull: false
      });
    } else {
      this.setState({
        Modalpushpull: true
      });
    }
  }
  imploader() {
    this.setState({
      newResultLength: '',

      getApprovalStatusCountData: [],
      getOrderPushPullMaterialData: [],
      getOrderPushPullManufacturerData: [],
      defaultActiveKeySwitch: '1',
      pullView: false,
      defaultActivePushKey: '1',
      defaultActivePullKey: '1',
      defaultActiveReviewKey: '1',

      Loader: false
    });
    setTimeout(() => {
      this.setState({
        newResultLength: ''
      });
    }, 1000);
  }
  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.getPushMaterialColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ getPushMaterialColumn: columnsCopy });
  }

  onDragEndgetPushManufacturerColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.getPushManufacturerColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ getPushManufacturerColumn: columnsCopy });
  }

  onDragEndgetPullMaterialColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.getPullMaterialColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ getPullMaterialColumn: columnsCopy });
  }
  onDragEndgetPullManufacturerColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.getPullManufacturerColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ getPullManufacturerColumn: columnsCopy });
  }
  HandleRadioButtonValue(e) {
    this.setState({
      defaultActivePushKey: '1',
      defaultActivePullKey: '1',
      defaultActiveReviewKey: '1',
      newResultLength: '',
      RadioButtonValue: e.target.value
    });
    if (e.target.value === 'pull') {
      this.setState({
        currentPull: 'all',
        isDataFetched: false,
        getOrderPushPullMaterialData: [],
        pullView: true,
        Loader: true,
        defaultActiveKeySwitch: '2'
      });

      if (this.state.usercuid != null) {
        this.props.getApprovalStatusCount(
          'pull',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );

        this.props.getOrderPushPullMaterialV2(
          'Pull',
          'all',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getApprovalStatusCount(
          'pull',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
        // this.props.getOrderPushPullManufacturer("Pull", "all");
        this.props.getOrderPushPullMaterialV2(
          'Pull',
          'all',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else if (e.target.value === 'approver_review') {
      this.setState({
        fetched: false,
        ApproverReviewArray: [],
        newResultLengthApproverReview: '',
        getOrderPushPullApproverReviewDataData: []
      });
      this.props.getOrderPushPullApproverReviewData(sessionStorage.getItem('loggedEmailId'));
    } else if (e.target.value === 'push') {
      this.setState({
        isDataFetched: false,
        current: 'all',
        getOrderPushPullMaterialData: [],
        pullView: false,
        Loader: true,
        defaultActiveKeySwitch: '1'
      });
      if (this.state.usercuid != null) {
        this.props.getApprovalStatusCount(
          'push',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );

        this.props.getOrderPushPullMaterialV2(
          'push',
          'all',
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getApprovalStatusCount(
          'push',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
        // this.props.getOrderPushPullManufacturer("Push", "all");
        this.props.getOrderPushPullMaterialV2(
          'Push',
          'all',
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        getOrderPushPullReviewDataData: [],
        isDataFetchedreview: false,
        ApproverExistingArray: [],
        Loader: true,
        defaultActiveReviewKey: '1',

        newResultLengthreview: 0
      });
      this.props.getOrderPushPullReviewData(
        'EXSISTING_REQUEST',
        sessionStorage.getItem('loggedEmailId')
      );
    }
  }
  tblLoaderApproverReview() {
    if (this.state.fetched || this.state.newResultLengthApproverReview === 0) {
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

  handleOnSelectAllinvalidDelete(isSelect) {
    if (isSelect) {
      const { InvalidDeleteRow } = this.state;
      let data = this.state.getOrderPushPullReviewDataData.map((d) => d);

      this.setState(() => ({
        InvalidDeleteRow: [...InvalidDeleteRow, ...data]
      }));
      return this.state.getOrderPushPullReviewDataData.map((d) => d.KEY);
    } else {
      let data = this.state.getOrderPushPullReviewDataData.map((d) => d.KEY);

      let res = this.state.InvalidDeleteRow.filter((d) => !data.includes(d.KEY));

      this.setState({
        InvalidDeleteRow: res,
        InvalidToValidData: []
      });
      return [];
    }
  }

  handleOnSelectAll(isSelect) {
    if (isSelect) {
      const { ApproverReviewArray } = this.state;
      let data = this.state.getOrderPushPullApproverReviewDataData.map((d) => d.KEY);

      this.setState(() => ({
        ApproverReviewArray: [...ApproverReviewArray, ...data]
      }));
      return this.state.getOrderPushPullApproverReviewDataData.map((d) => d.KEY);
    } else {
      let data = this.state.getOrderPushPullApproverReviewDataData.map((d) => d.KEY);

      let res = this.state.ApproverReviewArray.filter((d) => !data.includes(d));

      this.setState({
        ApproverReviewArray: res
      });
      return [];
    }
  }

  handleOnSelectAllExisting(isSelect) {
    if (isSelect) {
      const { ApproverExistingArray } = this.state;

      let data = this.state.getOrderPushPullReviewDataData.map((d) => {
        const response = {
          key: d.KEY,
          date: moment(d.UPDATEDDELIVERYDATE).format('MM-DD-YYYY')
        };
        return response;
      });

      this.setState(() => ({
        ApproverExistingArray: [...ApproverExistingArray, ...data]
      }));
      return this.state.getOrderPushPullReviewDataData.map((d) => d.KEY);
    } else {
      let data = this.state.getOrderPushPullReviewDataData.map((d) => d.KEY);

      let res = this.state.ApproverExistingArray.filter((d) => !data.includes(d.key));

      this.setState({
        ApproverExistingArray: res
      });
      return [];
    }
  }

  onRowSelectApproverExisting(row, isSelected) {
    if (isSelected) {
      const { ApproverExistingArray } = this.state;
      let data = {
        key: row.KEY,
        date: moment(row.UPDATEDDELIVERYDATE).format('MM-DD-YYYY')
      };

      this.setState(() => ({
        ApproverExistingArray: [...ApproverExistingArray, data]
      }));
    } else {
      let data = row.KEY;

      let res = this.state.ApproverExistingArray.filter((d) => d.key !== data);

      this.setState({
        ApproverExistingArray: res
      });
    }
  }

  onRowSelectInvalid(row, isSelected) {
    if (isSelected) {
      this.state.OldTblVale.push(row);

      const { InvalidDeleteRow } = this.state;
      let data = row;

      this.setState(() => ({
        InvalidDeleteRow: [...InvalidDeleteRow, data]
      }));
    } else {
      let value = row.KEY;

      let res = this.state.InvalidDeleteRow.filter((d) => d.KEY !== value);

      let invalid_filter = this.state.InvalidToValidData.filter((d) => d.KEY !== value);

      this.setState((prevState) => ({
        InvalidDeleteRow: res,
        InvalidToValidData: invalid_filter,
        getOrderPushPullReviewDataData: prevState.getOrderPushPullReviewDataData.map((el) =>
          el.KEY === value
            ? {
                ...el,
                MATERIAL: el.MATERIALTemp,
                PO: el.POTemp,
                PO_LINE: el.PO_LINETemp,
                UPDATEDDELIVERYDATE: el.UPDATEDDELIVERYDATETemp
              }
            : el
        )
      }));
    }
  }
  onRowSelect(row, isSelected) {
    if (isSelected) {
      const { ApproverReviewArray } = this.state;
      let data = row.KEY;

      this.setState(() => ({
        ApproverReviewArray: [...ApproverReviewArray, data]
      }));
    } else {
      let data = row.KEY;

      let res = this.state.ApproverReviewArray.filter((d) => d !== data);

      this.setState({
        ApproverReviewArray: res
      });
    }
  }
  PostOrdersPushPullBulkUpdate(v1, v2, v3, v4) {
    axios
      .post(`${ROOT_URL}PostOrdersPushPullBulkUpdate?Approver=${v2}&status=${v3}&Comments=${v4}`, {
        Key: v1
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            ApproverReviewArray: [],
            getOrderPushPullApproverReviewDataData: [],
            getApproverCommentForOrdersToReview: '',
            UpdatePopUp: false
          });
          this.props.getOrderPushPullApproverReviewData(sessionStorage.getItem('loggedEmailId'));
        }
      })
      .catch(() => {
        message.error('Fail Not Uploaded');
      });
  }

  PostOrdersPushPullBulkOverride(v1, v2, v3) {
    axios
      .post(`${ROOT_URL}PostOrdersPushPullBulkOverride?SubmittedBy=${v2}&IsUpdate=${v3}`, {
        Key: v1
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            ApproverExistingArray: [],
            getOrderPushPullReviewDataData: [],

            isDataFetchedreview: false
          });
          this.props.getOrderPushPullReviewData(
            'EXSISTING_REQUEST',
            sessionStorage.getItem('loggedEmailId')
          );
        }
      })
      .catch(() => {
        message.error('Fail Not Uploaded');
      });
  }

  PostOrdersPushPullUpdateInvalid(v1, v2, v3) {
    axios
      .post(`${ROOT_URL}PostOrdersPushPullUpdateInvalid?SubmittedBy=${v2}&IsUpdate=${v3}`, {
        Key: v1
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            InvalidToValidData: [],
            getOrderPushPullReviewDataData: [],
            InvalidDeleteRow: [],

            isDataFetchedreview: false
          });
          this.props.getOrderPushPullReviewData(
            'INVALID_REQUEST',
            sessionStorage.getItem('loggedEmailId')
          );
        }
      })
      .catch(() => {
        message.error('Fail Not Uploaded');
      });
  }

  ResetSelectedState() {
    this.setState({
      ApproverReviewArray: [],
      ApproverExistingArray: [],
      InvalidToValidData: []
    });
  }
  beforeSaveCell(oldValue, newValue, row) {
    const { InvalidToValidData } = this.state;

    if (InvalidToValidData != '') {
      let vall = InvalidToValidData.filter((d) => d.KEY != row.KEY);
      vall.push(row);
      this.setState({
        InvalidToValidData: vall
      });
    } else {
      this.setState({
        InvalidToValidData: [row]
      });
    }
  }
  UpdateValidation() {
    if (this.state.UpdatePopUp) {
      this.setState({
        UpdatePopUp: false
      });
    } else {
      this.setState({
        UpdatePopUp: true
      });
    }
  }
  getApproverComment(e) {
    this.setState({
      getApproverCommentForOrdersToReview: e.target.value
    });
  }
  HandleClearTblFilter() {
    filterMaterial(''), filterPO(''), filterPOLine(''), filterDate(''), filterReason('');
  }
  render() {
    const selectRowInvalid = {
      mode: 'checkbox',

      clickToEdit: true,
      classes: 'selection-row',
      selected: this.state.InvalidDeleteRow.map((d) => d.KEY),
      onSelect: this.onRowSelectInvalid.bind(this),
      onSelectAll: this.handleOnSelectAllinvalidDelete.bind(this)
    };

    const selectRow = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.ApproverReviewArray,
      onSelect: this.onRowSelect.bind(this),
      onSelectAll: this.handleOnSelectAll.bind(this)
    };

    const selectRowExisting = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.ApproverExistingArray.map((d) => d.key),
      onSelect: this.onRowSelectApproverExisting.bind(this),
      onSelectAll: this.handleOnSelectAllExisting.bind(this)
    };

    const addingbuttonReview = (
      <span>
        <Button size="sm" className="fs " onClick={this.addpushpullinfo}>
          <i className="fa fa-plus mr-2" />
          <span className="text-white">Add Push/Pull</span>
        </Button>
        {this.state.exportToCSVPushPullExistingRequest != '' ? (
          <>
            {' '}
            <Button
              size="sm"
              className="export-Btn ml-2 mr-2 float-right"
              onClick={this.exportToCSVPushPullExistingRequest}>
              <i className="fas fa-file-excel" />
            </Button>
          </>
        ) : (
          <>
            {' '}
            <Button
              disabled
              size="sm"
              className="export-Btn ml-2 mr-2 float-right"
              onClick={this.exportToCSVPushPullExistingRequest}>
              <i className="fas fa-file-excel" />
            </Button>
          </>
        )}
      </span>
    );

    const addingbutton = (
      <span>
        <Button size="sm" className="fs " onClick={this.addpushpullinfo}>
          <i className="fa fa-plus mr-2" />
          <span className="text-white">Add Push/Pull</span>
        </Button>
        {this.state.defaultActivePullKey == 2 || this.state.defaultActivePushKey == 2 ? (
          ''
        ) : (
          <span>
            {this.state.pullView == false ? (
              <span>
                {this.state.getOrderPushPullMaterialData != 0 ? (
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={this.exportToCSVPushPullMaterial}>
                    <i className="fas fa-file-excel" />
                  </Button>
                ) : (
                  <Button
                    disabled
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={this.exportToCSVPushPullMaterial}>
                    <i className="fas fa-file-excel" />
                  </Button>
                )}
              </span>
            ) : (
              <span>
                {' '}
                {this.state.getOrderPushPullMaterialData != 0 ? (
                  <Button
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={this.exportToCSVPushPullMaterial}>
                    <i className="fas fa-file-excel" />
                  </Button>
                ) : (
                  <Button
                    disabled
                    size="sm"
                    className="export-Btn ml-2 mr-2 float-right"
                    onClick={this.exportToCSVPushPullMaterial}>
                    <i className="fas fa-file-excel" />
                  </Button>
                )}
              </span>
            )}
          </span>
        )}
      </span>
    );
    var a = this.state.getApprovalStatusCountData.map((dat) => dat.Statuscount);

    // //production;
    // var approved = a[1];
    // var Rejected = a[0];
    // var Requested = a[2];

    //dev
    var approved = a[0];
    var Rejected = a[1];
    var Requested = a[2];

    var All = 0;

    // eslint-disable-next-line no-redeclare
    var All = approved + Rejected + Requested;

    const dateFormat = 'MM-DD-YYYY';

    return (
      <div>
        <Modal
          style={{ top: 60 }}
          footer={null}
          className="Intervaltimeline"
          visible={this.state.showModal}
          onCancel={this.closeModal.bind(this)}
          width="80%"
          bodyStyle={{ padding: 0 }}>
          <Card
            title={
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                  Add Push/Pull Info{' '}
                </Col>
                <Col xs={24} sm={24} md={24} lg={12} xl={12}></Col>
              </Row>
            }>
            <Row className="v4 ModelStyle">
              <Form layout="vertical">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <Form.Item label="Material" name="Material" className="label-form-text1">
                      <Input
                        type="text"
                        prefix={<i className="fas fa-dice-d6 icons-form1" />}
                        id="Material"
                        value={this.state.Approver_form_matr}
                        readOnly
                        className="text-input-form ftsize"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <Form.Item label="Po" name="PO" className="label-form-text1">
                      <Input
                        readOnly
                        prefix={<i className="fab fa-wpforms icons-form1" />}
                        type="text"
                        id="PO"
                        value={this.state.Approver_form_po}
                        className="text-input-form ftsize"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <Form.Item label="Poline" name="Poline" className="label-form-text1">
                      <Input
                        readOnly
                        prefix={<i className="fas fa-tags icons-form1" />}
                        type="text"
                        id="POLINE"
                        value={this.state.Approver_form_poline}
                        className="text-input-form ftsize"
                      />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <Form.Item label="Organization" name="supplier" className="label-form-text1">
                      <Input
                        prefix={<i className="fa fa-sitemap icons-form1 supplier-icon" />}
                        type="text"
                        readOnly
                        placeholder="Enter the Supplier"
                        id="supplier"
                        value={this.state.Approver_form_organisation}
                        className="text-input-form ftsize"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <Form.Item
                      label="Manufacturer"
                      name="manufacturer"
                      className="label-form-text1">
                      <Input
                        readOnly
                        prefix={<i className="fas fa-industry icons-form1" />}
                        type="text"
                        placeholder="Enter the Manufacturer"
                        id="manufacturer"
                        value={'  ' + this.state.Approver_form_manufacter}
                        className="text-input-form ftsize"
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {this.state.REJECTED_FLAG == 'Y' ? (
                      <Form.Item label="Approver" name="Approver" className="label-form-text1">
                        <TreeSelect
                          showSearch
                          style={{ width: '100%' }}
                          value={this.state.Approver_form_approver_name}
                          placeholder="Please Choose Approver"
                          allowClear
                          treeDefaultExpandAll
                          onChange={this.handleApproverChange.bind(this)}
                          className="text-select-form fft">
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
                    ) : (
                      <Form.Item
                        label="Approver Name"
                        name="Approver Name"
                        className="label-form-text1">
                        <Input
                          readOnly
                          // prefix={
                          //   // <i className="fas fa-user-secret icons-form1" />
                          // }
                          prefix={<i className="fa fa-user icons-form1" />}
                          type="text"
                          id="Approver Name"
                          value={this.state.Approver_form_approver_name}
                          className="text-input-form ftsize"
                        />
                      </Form.Item>
                    )}
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    <Form.Item
                      label="Submitted By(Email ID)"
                      name="submittedbymail"
                      className="label-form-text1">
                      <Input
                        prefix={<i className="fa fa-envelope icons-form1" />}
                        type="email"
                        readOnly
                        placeholder="Enter your Email ID"
                        id="submittedbymail"
                        value={this.state.Approver_form_email}
                        className="text-input-form ftsize"
                      />
                      <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                        {this.state.Errors['submittedbymail'] || ''}
                      </span>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {this.state.REJECTED_FLAG == 'Y' ? (
                      <Form.Item
                        label="Push/Pull"
                        name="push_pull_select"
                        className="label-form-text1">
                        <Select
                          onChange={this.handlePushPullChange}
                          id="PushPull"
                          value={this.state.Approver_form_push_pull_status}
                          className="text-select-form">
                          <Option value="Push">Push</Option>
                          <Option value="Pull">Pull</Option>
                        </Select>
                        <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                          {this.state.Errors['push_pull_select'] || ''}
                        </span>
                      </Form.Item>
                    ) : (
                      <Form.Item label="Push/Pull" name="Push/Pull" className="label-form-text1">
                        <Input
                          readOnly
                          // prefix={<i className="fa fa-user icons-form1" />}
                          type="text"
                          id="PushPull"
                          value={this.state.Approver_form_push_pull_status}
                          className="text-input-form ftsize"
                        />
                      </Form.Item>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {this.state.REJECTED_FLAG == 'Y' ||
                    (this.state.STATUS == 'Requested' && this.state.APPROVER_FLAG == 'Y') ? (
                      <Form.Item
                        label="Push/Pull Date"
                        name="push_pull_date"
                        className="label-form-text1">
                        <DatePicker
                          className="push/pull-picker"
                          // value={moment(this.state.Approver_form_date).format(
                          //   "MM-DD-YYYY"
                          // )}

                          value={moment(this.state.Approver_form_date, 'MM-DD-YYYY')}
                          format={dateFormat}
                          allowClear={false}
                          onChange={this.handlePushPullDateChange}
                          disabledDate={(current) => {
                            return moment().add(-1, 'days') >= current;
                          }}
                        />
                        <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                          {this.state.Errors['push_pull_date'] || ''}
                        </span>
                      </Form.Item>
                    ) : (
                      <Form.Item label="Push/Pull Date" name="Date" className="label-form-text1">
                        <Input
                          readOnly
                          prefix={<i className="far fa-calendar-alt icons-form1" />}
                          type="text"
                          id="Date"
                          value={this.state.Approver_form_date}
                          className="text-input-form ftsize"
                        />
                      </Form.Item>
                    )}
                  </Col>
                </Row>

                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {this.state.REJECTED_FLAG == 'Y' ? (
                      <div>
                        {' '}
                        <Form.Item
                          label=" Comment"
                          name="Comment1"
                          className="label-form-text1 clss">
                          {/* <TextArea
                            
                            type="text"
                            placeholder="Enter the Comment"
                            id="comment1"
                         
                            className="text-input-form cmnt-top ftsize"
                            maxLength="140"
                            
                          /> */}
                          <TextareaAutosize
                            id="comment"
                            className="text-input-form cmnt-top ftsize"
                            readOnly
                            minRows={1}
                            maxRows={6}
                            prefix={<i className="far fa-comments"></i>}
                            value={this.state.Approver_form_comment_from_push}
                            onChange={this.handleCommentChangeReject.bind(this)}
                          />

                          {/* <span
                        className="errorMessage f-bold"
                        style={{ color: "#ca2927" }}
                      >
                        {this.state.Errors["comment"] || ""}
                      </span> */}
                        </Form.Item>
                      </div>
                    ) : (
                      <div>
                        <Form.Item
                          label=" Comment"
                          name="Comment1"
                          className="label-form-text1 clss">
                          {/* <TextArea
                            prefix={<i class="far fa-comments"></i>}
                            type="text"
                            readOnly
                            placeholder="Enter the Comment"
                            id="comment"
                            value={this.state.Approver_form_comment_from_push}
                            className="text-input-form cmnt-top ftsize"
                            maxLength="140"
                          /> */}
                          <TextareaAutosize
                            id="comment"
                            className="text-input-form cmnt-top ftsize"
                            readOnly
                            minRows={1}
                            maxRows={6}
                            prefix={<i className="far fa-comments"></i>}
                            value={this.state.Approver_form_comment_from_push}
                            onChange={this.handleCommentChangeReject.bind(this)}
                          />

                          {/* <span
                        className="errorMessage f-bold"
                        style={{ color: "#ca2927" }}
                      >
                        {this.state.Errors["comment"] || ""}
                      </span> */}
                        </Form.Item>
                      </div>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {this.state.APPROVER_FLAG == 'Y' && this.state.STATUS == 'Requested' ? (
                      <div>
                        {' '}
                        <Form.Item
                          label="Status"
                          name="Status"
                          required
                          className="label-form-text1">
                          <Select
                            onChange={this.handleApproverstatusChange.bind(this)}
                            value={this.state.Approver_form_approver_status}
                            className="text-select-form ftsize">
                            <Option value="1">Requested</Option>
                            {this.state.REJECTED_FLAG == 'Y' ? (
                              ''
                            ) : (
                              <Option value="2">Approved</Option>
                            )}

                            <Option value="3">Rejected</Option>
                          </Select>
                        </Form.Item>
                      </div>
                    ) : (
                      <div>
                        <Form.Item
                          label="Status"
                          name="Status"
                          required
                          className="label-form-text1">
                          {this.state.APPROVER_FLAG == 'N' &&
                          this.state.STATUS == 'Rejected' &&
                          this.state.REJECTED_FLAG == 'Y' ? (
                            <Select
                              onChange={this.handleApproverstatusChange.bind(this)}
                              value={this.state.Approver_form_approver_status}
                              className="text-select-form ftsize">
                              <Option value="1">Requested</Option>
                              {this.state.REJECTED_FLAG == 'Y' ? (
                                ''
                              ) : (
                                <Option value="2">Approved</Option>
                              )}

                              <Option value="3">Rejected</Option>
                            </Select>
                          ) : (
                            <div>
                              {' '}
                              {this.state.STATUS == 'Approved' ? (
                                <Input
                                  prefix={<i className="far fa-thumbs-up icons-form1" />}
                                  type="text"
                                  readOnly
                                  placeholder="Status"
                                  id="Status"
                                  value={'    ' + this.state.STATUS}
                                  className="text-input-form ftsize"
                                />
                              ) : (
                                ''
                              )}
                              {this.state.STATUS == 'Rejected' ? (
                                <Input
                                  prefix={<i className="far fa-thumbs-down icons-form1" />}
                                  type="text"
                                  readOnly
                                  placeholder="Status"
                                  id="Status"
                                  value={'    ' + this.state.STATUS}
                                  className="text-input-form ftsize"
                                />
                              ) : (
                                ''
                              )}
                              {this.state.STATUS == 'Requested' ? (
                                <Input
                                  prefix={<i className="far fa-clock icons-form1" />}
                                  type="text"
                                  readOnly
                                  placeholder="Status"
                                  id="Status"
                                  value={'     ' + this.state.STATUS}
                                  className="text-input-form ftsize"
                                />
                              ) : (
                                ''
                              )}
                            </div>
                          )}
                        </Form.Item>
                      </div>
                    )}
                  </Col>
                  <Col xs={24} sm={24} md={12} lg={8} xl={8}>
                    {this.state.APPROVER_FLAG == 'Y' ? (
                      <div>
                        {this.state.STATUS == 'Requested' ? (
                          <div>
                            {' '}
                            <Form.Item
                              label=" Approver Comment"
                              name="Approver Comment"
                              className="label-form-text1 clss"
                              required>
                              {/* <Input
                                prefix={<i class="far fa-comment"></i>}
                                type="text"
                                placeholder="Enter the  Comment"
                                id="Approver Comment"
                                // value={this.state.APPROVER_COMMENTS}
                                value={this.state.APPROVER_COMMENTS}
                                className="text-input-form ftsize"
                                onChange={this.handleApprovercommentChange.bind(
                                  this
                                )}
                                maxLength={140}
                              /> */}

                              <TextareaAutosize
                                minRows={1}
                                maxRows={6}
                                prefix={<i className="far fa-comment"></i>}
                                id="comment"
                                className="text-input-form cmnt-top ftsize"
                                // value={this.state.APPROVER_COMMENTS}
                                value={this.state.APPROVER_COMMENTS}
                                onChange={this.handleApprovercommentChange.bind(this)}
                              />
                            </Form.Item>
                          </div>
                        ) : (
                          <div>
                            <Form.Item
                              label=" Approver Comment"
                              name="Approver Comment"
                              className="label-form-text1 clss">
                              {/* <Input
                                prefix={<i class="far fa-comment"></i>}
                                type="text"
                                readOnly
                                placeholder="Enter the  Comment"
                                id="Approver Comment"
                                value={this.state.APPROVER_COMMENTS}
                                // onChange={this.handleApprovercommentChange.bind(
                                //   this
                                // )}
                                className="text-input-form ftsize"
                                maxLength={140}
                              /> */}
                              <TextareaAutosize
                                readOnly
                                minRows={1}
                                maxRows={6}
                                prefix={<i className="far fa-comment"></i>}
                                id="comment"
                                className="text-input-form cmnt-top ftsize"
                                // value={this.state.APPROVER_COMMENTS}
                                value={this.state.APPROVER_COMMENTS}
                                onChange={this.handleApprovercommentChange.bind(this)}
                              />
                            </Form.Item>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Form.Item
                          label=" Approver Comment"
                          name="Approver Comment"
                          className="label-form-text1 clss">
                          {/* <Input
                            prefix={<i class="far fa-comment"></i>}
                            type="text"
                            readOnly
                            placeholder="Enter the  Comment"
                            id="Approver Comment"
                            value={this.state.APPROVER_COMMENTS}
                            // onChange={this.handleApprovercommentChange.bind(
                            //   this
                            // )}
                            className="text-input-form ftsize"
                            maxLength={140}
                          /> */}
                          <TextareaAutosize
                            readOnly
                            minRows={1}
                            maxRows={6}
                            id="comment"
                            className="text-input-form cmnt-top ftsize"
                            // value={this.state.APPROVER_COMMENTS}
                            value={this.state.APPROVER_COMMENTS}
                            onChange={this.handleApprovercommentChange.bind(this)}
                          />
                        </Form.Item>
                      </div>
                    )}
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                    {this.state.REJECTED_FLAG == 'Y' ? (
                      <div>
                        {' '}
                        <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ color: '#ffffff' }}
                            className="submit-button"
                            loading={this.state.rejectSubmitLoader}
                            onClick={this.handlesubmitforReject}>
                            Submit
                          </Button>
                        </Form.Item>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {this.state.APPROVER_FLAG == 'Y' && this.state.STATUS == 'Requested' ? (
                      <div>
                        {' '}
                        <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
                          <Button
                            type="primary"
                            htmlType="submit"
                            style={{ color: '#ffffff' }}
                            className="submit-button"
                            loading={this.state.rejectSubmitLoader}
                            onClick={this.handleSubmit1}>
                            Submit
                          </Button>
                        </Form.Item>
                      </div>
                    ) : (
                      <div></div>
                    )}
                    {this.state.STATUS == 'Approved' ? (
                      <div> </div>
                    ) : (
                      <div>
                        {/* <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ color: "#ffffff" }}
                        className="submit-button"
                        onClick={this.handleSubmit1}
                      >
                        Submit
                      </Button>
                    </Form.Item> */}
                      </div>
                    )}
                  </Col>
                </Row>
              </Form>
            </Row>
          </Card>
        </Modal>
        <NotificationContainer />
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="pr-2  ">
            <div className="pushpullheader">
              <Card
                title={
                  <Row>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <div>
                        {' '}
                        <span className="mr-2">
                          <FilePptOutlined />
                        </span>{' '}
                        Order Push/Pull{' '}
                        <span className="ml-2">
                          <Popover placement="right" content={<span>Info</span>}>
                            <i
                              className="fas fa-info-circle info-logo-widget"
                              onClick={this.infoPP.bind(this)}
                            />{' '}
                          </Popover>
                        </span>
                      </div>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                      <div className="float-right mr-4">
                        <Radio.Group
                          value={this.state.RadioButtonValue}
                          onChange={this.HandleRadioButtonValue}>
                          <Radio.Button value="push">Push</Radio.Button>
                          <Radio.Button value="pull">Pull</Radio.Button>
                          <Radio.Button value="oders_to_review">Orders To Review</Radio.Button>
                          {sessionStorage.getItem('IsApprover') == 'Y' ? (
                            <Radio.Button value="approver_review">Approver Review</Radio.Button>
                          ) : (
                            ''
                          )}
                        </Radio.Group>
                      </div>
                    </Col>
                  </Row>
                }>
                {this.state.RadioButtonValue == 'push' ? (
                  <Tabs
                    tabBarExtraContent={addingbutton}
                    activeKey={this.state.defaultActivePushKey}
                    onChange={this.callPushback.bind(this)}>
                    <TabPane tab="Material" key="1">
                      <div>
                        <ToolkitProvider
                          keyField="id"
                          data={this.state.getOrderPushPullMaterialData}
                          columns={this.state.getPushMaterialColumn}
                          search={{
                            afterSearch: (newResult) => {
                              if (!newResult.length) {
                                if (this.state.getOrderPushPullMaterialData != '') {
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
                                {this.state.Loader ? <Barloaderjs /> : ''}

                                {/* 
                                <Col Col xs={6} sm={6} md={6} lg={6} xl={6}>
                                  <Button
                                    size="sm"
                                    className="fs mb-2"
                                    onClick={this.addpushpullinfo}
                                  >
                                    <i className="fa fa-plus mr-2" />
                                    <span className="text-white">
                                      Add Push/Pull
                                    </span>
                                  </Button>
                                  </Col> */}
                                {/* <span
                                    style={{ cursor: "pointer" }}
                                    onClick={this.countAllpush.bind(this)}
                                  >
                                    <Badge
                                      className="bdge-rejected1 bdge-All rt"
                                      count={All}
                                    >
                                      <span className="bdge-hover">
                                        <a>All</a>
                                      </span>{" "}
                                      &nbsp;
                                    </Badge>
                                  </span>
                                  <span
                                    style={{ cursor: "pointer" }}
                                    onClick={this.countFunc1.bind(this)}
                                  >
                                    <Badge
                                      className="bdge-requested"
                                      count={Requested}
                                    >
                                      <a>Requested</a>
                                      &nbsp;
                                    </Badge>
                                  </span>
                                  <span
                                    style={{ cursor: "pointer" }}
                                    onClick={this.countFunc2.bind(this)}
                                  >
                                    <Badge
                                      className="bdge-Approved"
                                      count={approved}
                                    >
                                      {" "}
                                      Approved &nbsp;
                                    </Badge>
                                  </span> */}

                                <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                                  <Menu
                                    className="pushpull"
                                    mode="horizontal"
                                    onClick={this.reqRejFunc}
                                    selectedKeys={[this.state.current]}
                                    style={{
                                      lineHeight: '36px'
                                    }}>
                                    <Menu.Item key="all">
                                      {' '}
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={this.countAllpush.bind(this)}>
                                        <Badge className="bdge-rejected1 bdge-All rt" count={All}>
                                          <span
                                          //  className="bdge-hover"
                                          >
                                            <a style={{ fontSize: '12px' }}>All</a>
                                          </span>
                                        </Badge>
                                      </span>
                                    </Menu.Item>
                                    <Menu.Item key="requested">
                                      {' '}
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={this.countFunc1.bind(this)}>
                                        <Badge className="bdge-requested" count={Requested}>
                                          <a>Requested</a>
                                          &nbsp;
                                        </Badge>
                                      </span>
                                    </Menu.Item>
                                    <Menu.Item key="Approved">
                                      {' '}
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={this.countFunc2.bind(this)}>
                                        <Badge className="bdge-Approved" count={approved}>
                                          {' '}
                                          <a>Approved &nbsp;</a>
                                        </Badge>
                                      </span>
                                    </Menu.Item>
                                    <Menu.Item key="rejected">
                                      {' '}
                                      <span
                                        style={{ cursor: 'pointer' }}
                                        onClick={this.countFunc.bind(this)}>
                                        <Badge className="bdge-rejected" count={Rejected}>
                                          <a> Rejected &nbsp;</a>
                                        </Badge>
                                      </span>
                                    </Menu.Item>
                                  </Menu>
                                </Col>
                                <Col
                                  xs={6}
                                  sm={6}
                                  md={6}
                                  lg={6}
                                  xl={6}
                                  className="float-right search-right mtop-6">
                                  {/* <Button size="sm" className="export-Btn1 mr-2 ml-3 float-right" onClick={this.exportToCSVPushPullMaterial}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                                  <SearchBar {...props.searchProps} />
                                  <UploadFile
                                    param="push"
                                    count={this.state.current}
                                    cuid={this.state.usercuid}
                                    lgort={parsedFilterSettingsLGORT}
                                    parsedBlockedDeleted={parsedBlockedDeleted}
                                  />
                                </Col>
                              </Row>
                              <ReactDragListView.DragColumn
                                onDragEnd={this.onDragEnd.bind(this)}
                                nodeSelector="th">
                                <div className="capgov-table push-pull-table table-pagination-top">
                                  <BootstrapTable
                                    {...props.baseProps}
                                    pagination={paginationFactory()}
                                    noDataIndication={this.tblLoader}
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
                      <div className="mt-2">
                        <ToolkitProvider
                          keyField="id"
                          data={this.state.getOrderPushPullManufacturerData}
                          columns={this.state.getPushManufacturerColumn}
                          search={{
                            afterSearch: (newResult) => {
                              if (!newResult.length) {
                                if (this.state.getOrderPushPullManufacturerData != '') {
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
                                <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                                <Col
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  xl={12}
                                  className="float-right search-right">
                                  {this.state.getOrderPushPullManufacturerData != 0 ? (
                                    <Button
                                      size="sm"
                                      className="export-Btn ml-2 mr-2 float-right"
                                      onClick={this.exportToCSVPushPullManufacturer}>
                                      <i className="fas fa-file-excel" />
                                    </Button>
                                  ) : (
                                    <Button
                                      disabled
                                      size="sm"
                                      className="export-Btn ml-2 mr-2 float-right"
                                      onClick={this.exportToCSVPushPullManufacturer}>
                                      <i className="fas fa-file-excel" />
                                    </Button>
                                  )}
                                  {/* <Button size="sm" className="export-Btn1 mr-2 ml-3 float-right" onClick={this.exportToCSVPushPullManufacturer}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                                  <SearchBar {...props.searchProps} />
                                </Col>
                              </Row>
                              <ReactDragListView.DragColumn
                                onDragEnd={this.onDragEndgetPushManufacturerColumn.bind(this)}
                                nodeSelector="th">
                                <div className="capgov-table table-pagination-top">
                                  <BootstrapTable
                                    {...props.baseProps}
                                    pagination={paginationFactory()}
                                    noDataIndication={this.tblLoader}
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
                ) : (
                  <>
                    {this.state.RadioButtonValue === 'pull' ? (
                      <Tabs
                        tabBarExtraContent={addingbutton}
                        activeKey={this.state.defaultActivePullKey}
                        onChange={this.callPullback.bind(this)}>
                        <TabPane tab="Material" key="1">
                          <div>
                            <ToolkitProvider
                              keyField="id"
                              data={this.state.getOrderPushPullMaterialData}
                              columns={this.state.getPullMaterialColumn}
                              search={{
                                afterSearch: (newResult) => {
                                  if (!newResult.length) {
                                    if (this.state.getOrderPushPullMaterialData != '') {
                                      this.setState({
                                        newResultLength: newResult.length
                                      });
                                    } else {
                                      this.setState({
                                        newResultLength: ''
                                      });
                                    }
                                  } else {
                                    this.setState({
                                      newResultLength: ''
                                    });
                                  }
                                }
                              }}>
                              {(props) => (
                                <div>
                                  <Row>
                                    <span>{this.state.Loader ? <Barloaderjs /> : ''}</span>

                                    <Col xs={18} sm={18} md={18} lg={18} xl={18}>
                                      <Menu
                                        mode="horizontal"
                                        className="pushpull"
                                        onClick={this.reqRejFuncPull}
                                        selectedKeys={[this.state.currentPull]}
                                        style={{
                                          lineHeight: '36px'
                                        }}>
                                        <Menu.Item key="all">
                                          {' '}
                                          <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.countAllpull.bind(this)}>
                                            <Badge
                                              className="bdge-rejected1 bdge-All rt"
                                              count={All}>
                                              <span
                                              //  className="bdge-hover"
                                              >
                                                <a style={{ fontSize: '12px' }}>All</a>
                                              </span>
                                            </Badge>
                                          </span>
                                        </Menu.Item>
                                        <Menu.Item key="requested">
                                          {' '}
                                          <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.countFunc1pull.bind(this)}>
                                            <Badge className="bdge-requested" count={Requested}>
                                              <a>Requested</a>
                                              &nbsp;
                                            </Badge>
                                          </span>
                                        </Menu.Item>
                                        <Menu.Item key="Approved">
                                          {' '}
                                          <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.countFunc2pull.bind(this)}>
                                            <Badge className="bdge-Approved" count={approved}>
                                              <a>Approved &nbsp;</a>
                                            </Badge>
                                          </span>
                                        </Menu.Item>
                                        <Menu.Item key="rejected">
                                          {' '}
                                          <span
                                            style={{ cursor: 'pointer' }}
                                            onClick={this.countFuncpull.bind(this)}>
                                            <Badge className="bdge-rejected" count={Rejected}>
                                              <a> Rejected &nbsp;</a>
                                            </Badge>
                                          </span>
                                        </Menu.Item>
                                      </Menu>
                                    </Col>
                                    <Col
                                      xs={6}
                                      sm={6}
                                      md={6}
                                      lg={6}
                                      xl={6}
                                      className="float-right search-right mtop-6">
                                      {/* <Button size="sm" className="export-Btn1 mr-2 ml-3 float-right" onClick={this.exportToCSVPushPullMaterial}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                                      <SearchBar {...props.searchProps} />
                                      <UploadFile
                                        param="pull"
                                        count={this.state.currentPull}
                                        cuid={this.state.usercuid}
                                        lgort={parsedFilterSettingsLGORT}
                                        parsedBlockedDeleted={parsedBlockedDeleted}
                                      />
                                    </Col>
                                  </Row>
                                  <ReactDragListView.DragColumn
                                    onDragEnd={this.onDragEndgetPullMaterialColumn.bind(this)}
                                    nodeSelector="th">
                                    <div className="capgov-table table-pagination-top">
                                      <BootstrapTable
                                        {...props.baseProps}
                                        pagination={paginationFactory()}
                                        noDataIndication={this.tblLoader}
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
                          <div className="mt-2">
                            <ToolkitProvider
                              keyField="id"
                              data={this.state.getOrderPushPullManufacturerData}
                              columns={this.state.getPullManufacturerColumn}
                              search={{
                                afterSearch: (newResult) => {
                                  if (!newResult.length) {
                                    if (this.state.getOrderPushPullManufacturerData != '') {
                                      this.setState({
                                        newResultLength: newResult.length
                                      });
                                    } else {
                                      this.setState({
                                        newResultLength: ''
                                      });
                                    }
                                  } else {
                                    this.setState({
                                      newResultLength: ''
                                    });
                                  }
                                }
                              }}>
                              {(props) => (
                                <div>
                                  <Row>
                                    <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                                    <Col
                                      xs={12}
                                      sm={12}
                                      md={12}
                                      lg={12}
                                      xl={12}
                                      className="float-right search-right">
                                      {this.state.getOrderPushPullManufacturerData != 0 ? (
                                        <Button
                                          size="sm"
                                          className="export-Btn ml-2 mr-2 float-right"
                                          onClick={this.exportToCSVPushPullManufacturer}>
                                          <i className="fas fa-file-excel" />
                                        </Button>
                                      ) : (
                                        <Button
                                          disabled
                                          size="sm"
                                          className="export-Btn ml-2 mr-2 float-right"
                                          onClick={this.exportToCSVPushPullManufacturer}>
                                          <i className="fas fa-file-excel" />
                                        </Button>
                                      )}
                                      {/* <Button size="sm" className="export-Btn1 mr-2 ml-3 float-right" onClick={this.exportToCSVPushPullManufacturer}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                                      <SearchBar {...props.searchProps} />
                                    </Col>
                                  </Row>
                                  <ReactDragListView.DragColumn
                                    onDragEnd={this.onDragEndgetPullManufacturerColumn.bind(this)}
                                    nodeSelector="th">
                                    <div className="capgov-table table-pagination-top">
                                      <BootstrapTable
                                        {...props.baseProps}
                                        pagination={paginationFactory()}
                                        noDataIndication={this.tblLoader}
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
                    ) : (
                      <>
                        {this.state.RadioButtonValue == 'oders_to_review' ? (
                          <Tabs
                            tabBarExtraContent={addingbuttonReview}
                            activeKey={this.state.defaultActiveReviewKey}
                            onChange={this.callReviewback.bind(this)}>
                            <TabPane tab="Existing Request" key="1">
                              <div className="">
                                <button
                                  onClick={this.HandleClearTblFilter.bind(this)}
                                  className="ClearBtn">
                                  Clear Filter
                                </button>
                                {/* start */}
                                <div className="table-color">
                                  <BootstrapTable
                                    keyField="KEY"
                                    data={this.state.getOrderPushPullReviewDataData}
                                    columns={this.state.OrdersToreviewColumn}
                                    filter={filterFactory()}
                                    selectRow={selectRowExisting}
                                    pagination={paginationFactory()}
                                    noDataIndication={this.tblLoaderreview}
                                    filterPosition="top"
                                  />
                                </div>
                                <Row>
                                  <Col span={24} className="mb-2 mt-2">
                                    {' '}
                                    <div className="float-right">
                                      {this.state.ApproverExistingArray != '' ? (
                                        <button
                                          id="submitt"
                                          key="submit"
                                          type="primary"
                                          className="DeleteBtn text-white-upload"
                                          onClick={() =>
                                            this.PostOrdersPushPullBulkOverride(
                                              this.state.ApproverExistingArray,
                                              sessionStorage.getItem('loggedEmailId'),
                                              'N'
                                            )
                                          }>
                                          Delete
                                        </button>
                                      ) : (
                                        <button
                                          id="submitt"
                                          key="submit"
                                          type="primary"
                                          className="ApprovedBtn mr-2"
                                          disabled>
                                          Delete
                                        </button>
                                      )}
                                      <button
                                        className="cancel_ovr"
                                        key="back"
                                        onClick={this.ResetSelectedState}>
                                        Cancel
                                      </button>
                                      {this.state.ApproverExistingArray != '' ? (
                                        <button
                                          id="submitt"
                                          key="submit"
                                          type="primary"
                                          className="ApprovedBtn text-white-upload"
                                          onClick={() =>
                                            this.PostOrdersPushPullBulkOverride(
                                              this.state.ApproverExistingArray,
                                              sessionStorage.getItem('loggedEmailId'),
                                              'Y'
                                            )
                                          }>
                                          Update
                                        </button>
                                      ) : (
                                        <button
                                          id="submitt"
                                          key="submit"
                                          type="primary"
                                          className="ApprovedBtn"
                                          disabled>
                                          Update
                                        </button>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                              </div>
                            </TabPane>
                            <TabPane tab="Invalid Request" key="2">
                              <div className=" InvalidRequestOverWriteTable">
                                <button
                                  onClick={this.HandleClearTblFilter.bind(this)}
                                  className="ClearBtn">
                                  Clear Filter
                                </button>
                                <div className="table-color">
                                  <BootstrapTable
                                    keyField="KEY"
                                    data={this.state.getOrderPushPullReviewDataData}
                                    columns={this.state.OrdersToreviewColumn}
                                    selectRow={selectRowInvalid}
                                    filterPosition="top"
                                    cellEdit={cellEditFactory({
                                      mode: 'click',
                                      blurToSave: true,
                                      autoSelectText: true,
                                      onStartEdit: (row, column, rowIndex, columnIndex) => {
                                        document.getElementsByTagName('tr').className +=
                                          'selection-row';
                                        this.setState({
                                          columnIndex: columnIndex
                                        });
                                      },
                                      beforeSaveCell: this.beforeSaveCell.bind(this)
                                    })}
                                    pagination={paginationFactory()}
                                    noDataIndication={this.tblLoaderreview}
                                    filter={filterFactory()}
                                  />
                                </div>
                              </div>
                              <Row>
                                <Col span={24} className="mb-2 mt-2">
                                  <div className="float-right">
                                    {this.state.InvalidDeleteRow != '' ? (
                                      <button
                                        id="submitt"
                                        key="submit"
                                        type="primary"
                                        className="DeleteBtn text-white-upload"
                                        onClick={() =>
                                          this.PostOrdersPushPullUpdateInvalid(
                                            this.state.InvalidDeleteRow,
                                            sessionStorage.getItem('loggedEmailId'),
                                            'N'
                                          )
                                        }>
                                        Delete
                                      </button>
                                    ) : (
                                      <button
                                        id="submitt"
                                        key="submit"
                                        type="primary"
                                        className="ApprovedBtn mr-1"
                                        disabled>
                                        Delete
                                      </button>
                                    )}{' '}
                                    <button
                                      className="cancel_ovr"
                                      key="back"
                                      onClick={this.ResetSelectedState}>
                                      Cancel
                                    </button>
                                    {this.state.InvalidToValidData != '' ? (
                                      <button
                                        id="submitt"
                                        key="submit"
                                        type="primary"
                                        className="ApprovedBtn text-white-upload"
                                        onClick={() =>
                                          this.PostOrdersPushPullUpdateInvalid(
                                            this.state.InvalidToValidData,
                                            sessionStorage.getItem('loggedEmailId'),
                                            'Y'
                                          )
                                        }>
                                        Update
                                      </button>
                                    ) : (
                                      <button
                                        id="submitt"
                                        key="submit"
                                        type="primary"
                                        className="ApprovedBtn"
                                        disabled>
                                        Update
                                      </button>
                                    )}
                                  </div>
                                </Col>
                              </Row>
                            </TabPane>
                          </Tabs>
                        ) : (
                          <>
                            {this.state.RadioButtonValue == 'approver_review' ? (
                              <div>
                                <ToolkitProvider
                                  keyField="KEY"
                                  data={this.state.getOrderPushPullApproverReviewDataData}
                                  columns={this.state.OrderPushPullApproverReviewColumn}
                                  search={{
                                    afterSearch: (newResult) => {
                                      if (!newResult.length) {
                                        ('no data available for this creteria');
                                        if (
                                          this.state.getOrderPushPullApproverReviewDataData != ''
                                        ) {
                                          this.setState({
                                            newResultLengthApproverReview: newResult.length
                                          });
                                        } else {
                                          this.setState({
                                            newResultLengthApproverReview: '',
                                            fetched: false
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
                                        selectRow={selectRow}
                                        pagination={paginationFactory()}
                                        noDataIndication={() => this.tblLoaderApproverReview()}
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
                                        onClick={this.ResetSelectedState}>
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
                            ) : (
                              ''
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                )}
                <Modal
                  width="90%"
                  style={{ top: 60 }}
                  footer={null}
                  title="Add Push/Pull Info"
                  className="Intervaltimeline"
                  visible={this.state.addpushpullinfoModal}
                  onCancel={this.addpushpullinfo}>
                  <Row className="v4">
                    <Form layout="vertical">
                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item
                            label="Material"
                            name="material_no"
                            className="label-form-text1">
                            <TreeSelect
                              showSearch
                              style={{ width: '100%' }}
                              value={this.state.material_no}
                              placeholder="Please Material Number"
                              allowClear
                              treeDefaultExpandAll
                              onChange={this.handleMaterialChange}
                              className="text-select-form fft">
                              {this.state.getPushPullMaterialDDData.map((val1, ind1) => (
                                <TreeNode value={val1.Material} title={val1.Material} key={ind1} />
                              ))}
                            </TreeSelect>
                            <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                              {this.state.Errors['material_no'] || ''}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item label="PO" name="po_text" className="label-form-text1">
                            <TreeSelect
                              showSearch
                              style={{ width: '100%' }}
                              value={this.state.po_text}
                              placeholder="Please select PO"
                              allowClear
                              treeDefaultExpandAll
                              onChange={this.handlePoChange}
                              className="text-select-form fft">
                              {this.state.getPONumberForMaterialData.map((val1, ind1) => (
                                <TreeNode value={val1.PO} title={val1.PO} key={ind1} />
                              ))}
                            </TreeSelect>
                            <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                              {this.state.Errors['po_text'] || ''}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item label="PO Line" name="po_line" className="label-form-text1">
                            <TreeSelect
                              showSearch
                              style={{ width: '100%' }}
                              value={this.state.po_line}
                              placeholder="Please select PO Line"
                              allowClear
                              treeDefaultExpandAll
                              onChange={this.handlePoLineChange}
                              className="text-select-form fft">
                              {this.state.getPOLineForPOData.map((val1, ind1) => (
                                <TreeNode value={val1.POLine} title={val1.POLine} key={ind1} />
                              ))}
                            </TreeSelect>
                            <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                              {this.state.Errors['po_line'] || ''}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
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
                      </Row>

                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item
                            label="Organization"
                            name="supplier"
                            className="label-form-text1">
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
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item
                            label="Push/Pull Date"
                            name="push_pull_date"
                            className="label-form-text1">
                            <DatePicker
                              allowClear={false}
                              className="push/pull-picker"
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
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item
                            label="Push/Pull"
                            name="push_pull_select"
                            className="label-form-text1">
                            <Input
                              prefix={<i className="fa fa-user icons-form" />}
                              type="text"
                              value={this.state.push_push_Flag}
                              className="text-input-form"
                              onChange={this.handlePushPullChange}
                            />
                            {/* <Select
                              onChange={this.handlePushPullChange}
                              value={this.state.push_pull_select}
                              className="text-select-form">
                              <Option value="Push">Push</Option>
                              <Option value="Pull">Pull</Option>
                            </Select> */}
                            <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                              {this.state.Errors['push_pull_select'] || ''}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item label="Approver" name="Approver" className="label-form-text1">
                            <TreeSelect
                              showSearch
                              style={{ width: '100%' }}
                              value={this.state.Approver}
                              placeholder="Please Choose Approver"
                              allowClear
                              treeDefaultExpandAll
                              onChange={this.handleApproverChange.bind(this)}
                              className="text-select-form fft">
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
                      </Row>

                      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item
                            label="Submitted By(Email ID)"
                            name="submittedbymail"
                            className="label-form-text1">
                            <Input
                              prefix={<i className="fa fa-envelope icons-form" />}
                              value={this.state.email}
                              readOnly
                              type="email"
                              id="submittedbymail"
                              className="text-input-form push-pull-email"
                            />
                            <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                              {this.state.Errors['submittedbymail'] || ''}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                          <Form.Item
                            label="Comment"
                            name="comment"
                            className="label-form-text1 clss">
                            <TextareaAutosize
                              minRows={1}
                              maxRows={6}
                              id="comment"
                              className="text-input-form cmnt-top fft ftsize"
                              // value={this.state.APPROVER_COMMENTS}
                              value={this.state.comment}
                              onChange={this.handleCommentChange}
                            />
                            {/* <TextArea
                              prefix={
                                <i className="fa fa-envelope icons-form" />
                              }
                              type="text"
                              placeholder="Enter the Comment"
                              id="comment"
                              value={this.state.comment}
                              className="text-input-form cmnt-top fft"
                              onChange={this.handleCommentChange}
                              maxLength="140"
                            /> */}
                            <span className="errorMessage f-bold" style={{ color: '#ca2927' }}>
                              {this.state.Errors['comment'] || ''}
                            </span>
                          </Form.Item>
                        </Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}></Col>
                        <Col xs={24} sm={24} md={12} lg={6} xl={6}></Col>
                      </Row>

                      <Form.Item wrapperCol={{ offset: 12, span: 16 }}>
                        <Button
                          type="primary"
                          htmlType="submit"
                          style={{ color: '#ffffff' }}
                          onClick={this.handleSubmit}
                          className="submit-button"
                          loading={this.state.loading}
                          disabled={this.state.loading}>
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                  </Row>
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
              </Card>
            </div>
          </Col>
        </Row>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Push Pull POs</div>}
          className="Intervaltimeline"
          visible={this.state.Modalpushpull}
          onCancel={this.infoPP.bind(this)}
          // width={150}
        >
          <div>
            <p>
              <ul>
                <li>
                  <strong>Push Pull</strong>
                  <br />
                  <ul>
                    <li>
                      Details for Pulled/Pushed POs and their status as they are approved or
                      Rejected.
                    </li>
                    <br />
                    <li>
                      Other reports gets updated according to Pull/Push date as a Pull/Push request
                      is approved.
                    </li>
                  </ul>
                </li>
              </ul>
            </p>
          </div>
        </Modal>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Approval Confirmation </div>}
          className="Intervaltimeline"
          visible={this.state.UpdatePopUp}
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
                      value={this.state.getApproverCommentForOrdersToReview}
                      onChange={this.getApproverComment.bind(this)}
                    />
                  </Form.Item>
                </Form>
              </Col>
              <Col span={4}></Col>
            </Row>
            <Row>
              <Col span={24}>
                {this.state.getApproverCommentForOrdersToReview != '' ? (
                  <button
                    id="submitt"
                    key="submit"
                    type="primary"
                    className="ApprovedBtn mr-2 float-right"
                    onClick={() =>
                      this.PostOrdersPushPullBulkUpdate(
                        this.state.ApproverReviewArray,
                        sessionStorage.getItem('loggedEmailId'),
                        '2',
                        this.state.getApproverCommentForOrdersToReview
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

                {this.state.getApproverCommentForOrdersToReview != '' ? (
                  <button
                    id="submitt"
                    key="submit"
                    className="cancel_ovr float-right"
                    type="primary"
                    onClick={() =>
                      this.PostOrdersPushPullBulkUpdate(
                        this.state.ApproverReviewArray,
                        sessionStorage.getItem('loggedEmailId'),
                        '3',
                        this.state.getApproverCommentForOrdersToReview
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
    getPushPullMaterialDDData: state.getPushPullMaterialDD,
    getMaterialforPushPullData: state.getMaterialforPushPull,
    getPONumberForMaterialData: state.getPONumberForMaterial,
    getPOLineForPOData: state.getPOLineForPO,
    getOrderPushPullMaterialData: state.getOrderPushPullMaterial,
    getOrderPushPullManufacturerData: state.getOrderPushPullManufacturer,
    getApproverListData: state.getApproverList,
    getApprovalStatusCountData: state.getApprovalStatusCount,
    getApprovalStatusForMaterialData: state.getApprovalStatusForMaterial,
    getOrderPushPullMaterialV2Data: state.getOrderPushPullMaterialV2,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    getOrderPushPullReviewDataData: state.getOrderPushPullReviewData,
    getOrderPushPullApproverReviewDataData: state.getOrderPushPullApproverReviewData,
    getOrderPushPullMaterialFlagData: state.getOrderPushPullMaterialFlag
  };
}

// eslint-disable-next-line no-class-assign
CapGovPushPullTable = Form.create({ name: 'register' })(CapGovPushPullTable);

export default connect(mapState, {
  getUserImpersonationDetails,
  getOrderPushPullMaterialV2,
  getOrderPushPullMaterialFlag,
  getApprovalStatusForMaterial,
  getApprovalStatusCount,
  getApproverList,
  getPushPullMaterialDD,
  getMaterialforPushPull,
  getPONumberForMaterial,
  getPOLineForPO,
  getOrderPushPullMaterial,
  getOrderPushPullManufacturer,
  getOrderPushPullReviewData,
  getOrderPushPullApproverReviewData
})(CapGovPushPullTable);
