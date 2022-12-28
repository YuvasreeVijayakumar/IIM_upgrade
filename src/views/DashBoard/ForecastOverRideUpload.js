import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Row, Button, Modal, Col, Tabs, Menu, Badge, Switch, Form, message, Popover } from 'antd';
import {
  getForecastOverrideOverview,
  getUserImpersonationDetails,
  getForecastOverrideStatusCount,
  getForecastOverrideReviewData,
  getForecastOverrideApproverReview,
  HandleforecastModal
} from '../../actions';
import { UploadForecast } from './UploadForecast';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import PropagateLoader from 'react-spinners/PropagateLoader';
import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';
import TextareaAutosize from 'react-textarea-autosize';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import moment from 'moment-timezone';
import axios from 'axios';
import { ROOT_URL } from '../../actions';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const { SearchBar } = Search;
const { TabPane } = Tabs;
const pop_content = <span>Fields Are Editable</span>;
const items = [
  {
    label: 'All',
    key: 'All'
  },
  {
    label: 'Requested',
    key: 'Requested'
  },
  {
    label: 'Approved',
    key: 'Approved'
  },
  {
    label: 'Rejected',
    key: 'Rejected'
  }
];
// eslint-disable-next-line no-unused-vars
var MATERIALFilter;
// eslint-disable-next-line no-unused-vars
var LGORTFilter;
// eslint-disable-next-line no-unused-vars
var DATEFilter;
// eslint-disable-next-line no-unused-vars
var OVERWRITE_QTYFilter;
// eslint-disable-next-line no-unused-vars
var SUBMITTED_BYFilter;
// eslint-disable-next-line no-unused-vars
var COMMENTSFilter;
// eslint-disable-next-line no-unused-vars
var REASON_CODEFilter;
// eslint-disable-next-line no-unused-vars
var ReasonFilter;

class ForecastOverRideUpload extends Component {
  constructor(props) {
    super(props);
    this.bstable = React.createRef();
    this.getApproverCommentForecastOverride = this.getApproverCommentForecastOverride.bind(this);
    this.HandleModalUpload = this.HandleModalUpload.bind(this);
    this.UpdateValidation = this.UpdateValidation.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.MenuOnclick = this.MenuOnclick.bind(this);
    this.dateformat = this.dateformat.bind(this);
    this.getcheckValues = this.getcheckValues.bind(this);
    this.ResetSelectedState = this.ResetSelectedState.bind(this);
    this.tblLoaderreview = this.tblLoaderreview.bind(this);
    this.HandleClearTblFilter = this.HandleClearTblFilter.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);

    this.state = {
      UploadModal: false,
      defaultActivelkey: '1',
      current: 'All',
      isDataFetchedreview: false,
      ApproverReviewArray: [],
      InvalidToValidData: [],
      InvalidToValidDataSelected: [],
      ApproverExistingArray: [],
      isSelectedExisting: [],
      OldTblVale: [],

      getForecastOverrideApproverReviewData: [],
      getApproverReviewForForecastOverride: '',
      UpdatePopUpApproverReview: false,
      OverAllReviewCol: [
        {
          dataField: 'MATERIAL',
          text: ' Material',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 90 }
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,

          headerStyle: { width: 80 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'STATUS',
          text: 'Status',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 110 }
        },
        {
          dataField: 'DATE',
          text: 'Date',
          sort: true,
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,

          headerStyle: { width: 100 },
          align: 'center',
          headerAlign: 'center'
        },
        {
          dataField: 'FORECASTED_QTY',
          text: 'Forecasted Qty',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 130 }
        },
        {
          dataField: 'OVERWRITE_QTY',
          text: 'Overwrite Qty',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 130 }
        },

        {
          dataField: 'REASON_CODE',
          text: 'Reason Code',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 200 }
        },

        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 300 }
        },
        {
          dataField: 'APPROVER',
          text: 'Approver',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 300 }
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 250 }
        }
      ],
      ForecastOverrideApproverReviewCol: [
        {
          dataField: 'MATERIAL',
          text: 'Material',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 90 }
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 90 }
        },
        {
          dataField: 'DATE',
          text: 'Date',
          sort: true,
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 100 }
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
          headerStyle: { width: 220 }
        },

        {
          dataField: 'SUBMITTED_BY',
          text: 'Submitted By',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 300 }
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          headerStyle: { width: 250 }
        },
        {
          dataField: 'UPDATED_DATE',
          text: 'Updated Date',
          sortFunc: this.sortFuncDate,
          formatter: this.dateformat,
          sort: true,
          align: 'center',
          headerAlign: 'center',
          headerStyle: { width: 150 }
        }
        // {
        //   dataField: 'APPROVER',
        //   text: 'Approver',
        //   sort: true,
        //   align: 'left',
        //   headerAlign: 'left',
        //   headerStyle: { width: 300 }
        // },
        // {
        //   dataField: 'STATUS',
        //   text: 'STATUS',
        //   sort: true,
        //   align: 'center',
        //   headerAlign: 'center',
        //   headerStyle: { width: 140 }
        // }
      ],
      InvalidExistingCol: [
        {
          dataField: 'MATERIAL',
          text: ' Material',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          editable: false,
          filter: textFilter({
            getFilter: (filter) => {
              MATERIALFilter = filter;
            }
          }),
          headerStyle: { width: 105 },
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
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,

          headerStyle: { width: 90 },
          align: 'center',
          headerAlign: 'center',
          editable: false,
          filter: textFilter({
            getFilter: (filter) => {
              LGORTFilter = filter;
            }
          })
        },
        {
          dataField: 'DATE',
          text: 'Date',
          sort: true,
          sortFunc: this.sortFuncDate,

          headerStyle: { width: 190 },
          align: 'center',
          headerAlign: 'center',
          editable: false,
          filter: dateFilter({
            getFilter: (filter) => {
              DATEFilter = filter;
            }
          }),
          formatter: (cell) => {
            let dateObj = cell;
            if (typeof cell !== 'object') {
              dateObj = new Date(cell);
            }
            return moment(dateObj).format('MM-DD-YYYY');
          },
          editor: {
            type: Type.DATE
          }
        },

        {
          dataField: 'OVERWRITE_QTY',
          text: 'Overwrite Qty',
          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 130 },
          editable: false,
          filter: textFilter({
            getFilter: (filter) => {
              OVERWRITE_QTYFilter = filter;
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
          text: 'Submitted By',
          dataField: 'SUBMITTED_BY',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          editable: false,
          headerStyle: { width: 300 },
          filter: textFilter({
            getFilter: (filter) => {
              SUBMITTED_BYFilter = filter;
            }
          })
        },
        {
          dataField: 'COMMENTS',
          text: 'Commets',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          editable: false,
          headerStyle: { width: 120 },
          filter: textFilter({
            getFilter: (filter) => {
              COMMENTSFilter = filter;
            }
          })
        },
        {
          dataField: 'REASON_CODE',
          text: 'Reason Code',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          editable: false,
          headerStyle: { width: 200 },
          filter: textFilter({
            getFilter: (filter) => {
              REASON_CODEFilter = filter;
            }
          })
        },
        {
          dataField: 'Reason',
          text: 'Reason',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          editable: false,
          headerStyle: { width: 250 },
          filter: textFilter({
            getFilter: (filter) => {
              ReasonFilter = filter;
            }
          })
        }
      ],
      InvalidCol: [
        {
          dataField: 'MATERIAL',

          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Material <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,
          align: 'left',
          headerAlign: 'left',

          filter: textFilter({
            getFilter: (filter) => {
              MATERIALFilter = filter;
            },
            placeholder: 'Enter Material'
          }),
          headerStyle: { width: 125 },
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
          dataField: 'LGORT',
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                LGORT <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,

          headerStyle: { width: 130 },
          align: 'center',
          headerAlign: 'center',
          editor: {
            type: Type.SELECT,
            options: [
              {
                value: '1000',
                label: '1000'
              },
              {
                value: 'CPEQ',
                label: 'CPEQ'
              }
            ]
          },

          filter: textFilter({
            getFilter: (filter) => {
              LGORTFilter = filter;
            },
            placeholder: 'Enter LGORT'
          })
        },
        {
          dataField: 'DATE',
          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Date <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,

          headerStyle: { width: 190 },
          align: 'center',
          headerAlign: 'center',

          filter: dateFilter({
            getFilter: (filter) => {
              DATEFilter = filter;
            },
            placeholder: 'Enter Date'
          }),
          formatter: (cell) => {
            let dateObj = cell;
            if (typeof cell !== 'object') {
              dateObj = new Date(cell);
            }
            return moment(dateObj).format('MM-DD-YYYY');
          },
          editor: {
            type: Type.DATE
          }
        },

        {
          dataField: 'OVERWRITE_QTY',

          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Overwrite Qty <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,
          align: 'right',
          headerAlign: 'right',
          headerStyle: { width: 160 },

          filter: textFilter({
            getFilter: (filter) => {
              OVERWRITE_QTYFilter = filter;
            },
            placeholder: 'Enter Overwrite Qty'
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
          dataField: 'REASON_CODE',

          text: (
            <Popover content={pop_content} placement="bottom">
              <span className="='cls">
                Reason Code <i className="fas fa-pen clss"></i>
              </span>
            </Popover>
          ),

          sort: true,
          align: 'left',
          headerAlign: 'left',
          editor: {
            type: Type.SELECT,
            // options: this.props.ReasonCodeDropDownValue,
            getOptions: (setOptions) => {
              setTimeout(() => {
                setOptions(this.props.getReasonCodeListData);
              }, 1);
            }
          },

          headerStyle: { width: 200 },
          filter: textFilter({
            getFilter: (filter) => {
              REASON_CODEFilter = filter;
            },
            placeholder: 'Enter Reason Code'
          })
        },
        {
          text: 'Submitted By',
          dataField: 'SUBMITTED_BY',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          editable: false,

          headerStyle: { width: 300 },
          filter: textFilter({
            getFilter: (filter) => {
              SUBMITTED_BYFilter = filter;
            }
          })
        },
        {
          dataField: 'COMMENTS',
          text: 'Comments',
          sort: true,
          align: 'left',
          headerAlign: 'left',
          editable: false,

          headerStyle: { width: 250 },
          filter: textFilter({
            getFilter: (filter) => {
              COMMENTSFilter = filter;
            }
          })
        },

        {
          dataField: 'Reason',
          text: 'Reason',
          sort: true,
          align: 'center',
          headerAlign: 'center',
          editable: false,

          headerStyle: { width: 250 },
          filter: textFilter({
            getFilter: (filter) => {
              ReasonFilter = filter;
            }
          })
        }
      ],
      getUserImpersonationDetailsData: [],

      OverAllReviewData: [],
      ExistingAndInvalidData: [],

      InavlidExisitingSwitch: true
    };
  }
  componentDidMount() {
    if (this.props.parsedFilterSettingsLGORT && this.props.parsedBlockedDeleted) {
      this.props.getForecastOverrideOverview(
        sessionStorage.getItem('loggedcuid'),
        'all',

        this.props.parsedFilterSettingsLGORT,
        this.props.parsedBlockedDeleted
      );
      this.props.getForecastOverrideStatusCount(
        sessionStorage.getItem('loggedcuid'),
        this.props.parsedFilterSettingsLGORT,
        this.props.parsedBlockedDeleted
      );
    }
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.HandleforecastModalData != nextProps.HandleforecastModalData) {
      if (nextProps.HandleforecastModalData != 0) {
        this.HandleModalUpload();
      }
    }
    if (
      this.props.getForecastOverrideApproverReviewData !=
      nextProps.getForecastOverrideApproverReviewData
    ) {
      if (nextProps.getForecastOverrideApproverReviewData != 0) {
        this.setState({
          getForecastOverrideApproverReviewData: nextProps.getForecastOverrideApproverReviewData,
          isDataFetched: false,
          newResultLength: ''
        });
      } else {
        this.setState({
          getForecastOverrideApproverReviewData: [],
          isDataFetched: true
        });
      }
    }

    if (
      this.props.getForecastOverrideReviewDataData != nextProps.getForecastOverrideReviewDataData
    ) {
      if (nextProps.getForecastOverrideReviewDataData != 0) {
        this.setState({
          ExistingAndInvalidData: nextProps.getForecastOverrideReviewDataData,
          isDataFetchedreview: true
        });
      } else {
        this.setState({
          ExistingAndInvalidData: [],
          isDataFetchedreview: true
        });
      }
    }
    if (
      this.props.getForecastOverrideStatusCountData != nextProps.getForecastOverrideStatusCountData
    ) {
      if (nextProps.getForecastOverrideStatusCountData != 0) {
        var [a, b, c] = nextProps.getForecastOverrideStatusCountData;

        this.setState({
          StatusApproved: a.STATUS == 'Approved' ? a.Statuscount : '',
          StatusRejected: b.STATUS == 'Rejected' ? b.Statuscount : '',
          StatusRequested: c.STATUS == 'Requested' ? c.Statuscount : '',
          getForecastOverrideStatusCountData: nextProps.getForecastOverrideStatusCountData
        });
      } else {
        this.setState({
          getForecastOverrideStatusCountData: []
        });
      }
    }
    if (this.props.getForecastOverrideOverviewData != nextProps.getForecastOverrideOverviewData) {
      if (nextProps.getForecastOverrideOverviewData != 0) {
        this.setState({
          OverAllReviewData: nextProps.getForecastOverrideOverviewData,
          isDataFetched: false,
          newResultLength: ''
        });
      } else {
        this.setState({
          OverAllReviewData: [],
          isDataFetched: true
        });
      }
    }
  }
  dateformat(cell) {
    if (cell == '-') {
      return <span>-</span>;
    } else {
      let value = moment(cell).format('MM-DD-YYYY');
      return <span>{value}</span>;
    }
  }
  sortFuncDate(a, b, order) {
    if (order === 'asc') {
      return moment(a) - moment(b);
    } else if (order === 'desc') {
      return moment(b) - moment(a);
    }
  }
  HandleModalUpload() {
    this.ResetSelectedState();
    if (this.props.HandleforecastModalData) {
      this.setState({
        defaultActivelkey: '1',
        current: 'All'
      });
    } else {
      this.setState({
        defaultActivelkey: '1',
        current: 'All'
      });
      this.props.getForecastOverrideOverview(
        sessionStorage.getItem('loggedcuid'),
        'all',

        this.props.parsedFilterSettingsLGORT,
        this.props.parsedBlockedDeleted
      );
      this.props.getForecastOverrideStatusCount(
        sessionStorage.getItem('loggedcuid'),
        this.props.parsedFilterSettingsLGORT,
        this.props.parsedBlockedDeleted
      );
    }
  }
  tabChange(key) {
    if (key == '2') {
      this.setState({
        InavlidExisitingSwitch: true,
        defaultActivelkey: '2',
        ExistingAndInvalidData: [],
        InvalidToValidDataSelected: [],
        InvalidToValidData: [],
        ApproverExistingArray: [],

        isDataFetchedreview: false
      });
      this.props.getForecastOverrideReviewData(
        'INVALID_REQUEST',
        sessionStorage.getItem('loggedEmailId')
      );
    } else if (key == '3') {
      this.setState({
        defaultActivelkey: '3',
        ApproverReviewArray: [],
        getForecastOverrideApproverReviewData: [],
        getApproverReviewForForecastOverride: '',
        UpdatePopUpApproverReview: false,
        isDataFetched: false,
        newResultLength: ''
      });
      this.props.getForecastOverrideApproverReview(
        sessionStorage.getItem('loggedEmailId'),
        'all',
        'all'
      );
    } else {
      this.setState({
        defaultActivelkey: '1',
        OverAllReviewData: [],

        isDataFetched: false,
        newResultLength: '',
        current: 'All'
      });
      this.props.getForecastOverrideOverview(
        sessionStorage.getItem('loggedcuid'),
        'all',

        this.props.parsedFilterSettingsLGORT,
        this.props.parsedBlockedDeleted
      );
      this.props.getForecastOverrideStatusCount(
        sessionStorage.getItem('loggedcuid'),
        this.props.parsedFilterSettingsLGORT,
        this.props.parsedBlockedDeleted
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
  MenuOnclick(e) {
    this.setState({
      OverAllReviewData: [],
      isDataFetched: false,
      newResultLength: '',
      current: e.key
    });
    this.props.getForecastOverrideOverview(
      sessionStorage.getItem('loggedcuid'),
      e.key,

      this.props.parsedFilterSettingsLGORT,
      this.props.parsedBlockedDeleted
    );
    this.props.getForecastOverrideStatusCount(
      sessionStorage.getItem('loggedcuid'),
      this.props.parsedFilterSettingsLGORT,
      this.props.parsedBlockedDeleted
    );
  }
  getcheckValues(checked) {
    this.HandleClearTblFilter();
    if (checked) {
      this.setState({
        InvalidToValidData: [],

        InvalidToValidDataSelected: [],
        getForecastOverrideReviewDataData: [],
        isDataFetched: false,
        newResultLength: '',
        InavlidExisitingSwitch: checked
      });
      this.props.getForecastOverrideReviewData(
        'INVALID_REQUEST',
        sessionStorage.getItem('loggedEmailId')
      );
    } else {
      this.setState({
        isSelectedExisting: [],
        ApproverExistingArray: [],
        getForecastOverrideReviewDataData: [],
        isDataFetched: false,
        newResultLength: '',
        InavlidExisitingSwitch: checked
      });
      this.props.getForecastOverrideReviewData(
        'EXISTING_REQUEST',
        sessionStorage.getItem('loggedEmailId')
      );
    }
  }
  ResetSelectedState() {
    this.setState({
      ApproverReviewArray: [],
      ApproverExistingArray: [],
      isSelectedExisting: [],
      InvalidToValidData: [],
      InvalidToValidDataSelected: []
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
        `${ROOT_URL}PostForcastOverwriteUpdate?Status=${v2}&Approver_Comments=${v3}&IsBulkUpload=Y`,
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
          'all',
          'all'
        );
      })
      .catch(() => {
        message.error('Fail To Update');
      });
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
  //invaliud row select all
  onRowSelectAllInvalid(isSelect) {
    if (isSelect) {
      const { ExistingAndInvalidData } = this.state;
      let data = ExistingAndInvalidData;
      this.setState({
        InvalidToValidDataSelected: data
      });
    } else {
      this.setState({
        InvalidToValidDataSelected: [],
        InvalidToValidData: []
      });
    }
  }
  //end
  // Invalid row select
  onRowSelectInvalid(row, isSelected) {
    if (isSelected) {
      const { InvalidToValidDataSelected } = this.state;
      let data = row;

      this.setState(() => ({
        InvalidToValidDataSelected: [...InvalidToValidDataSelected, data]
      }));
    } else {
      let value = row.KEY;

      let res = this.state.InvalidToValidData.filter((d) => d.KEY !== value);
      let KEY_res = this.state.InvalidToValidDataSelected.filter((d) => d.KEY !== value);

      this.setState((prevState) => ({
        ExistingAndInvalidData: prevState.ExistingAndInvalidData.map((el) =>
          el.KEY === value
            ? {
                ...el,
                MATERIAL: el.MaterialTemp,
                LGORT: el.LGORTTemp,
                DATE: el.DATETemp,
                FORECASTED_QTY: el.ForecastedQtyTemp,
                OVERWRITE_QTY: el.OverwriteQtyTemp
              }
            : el
        ),
        InvalidToValidData: res,
        InvalidToValidDataSelected: KEY_res
      }));
    }
  }

  //end
  //exisiting row level select
  onRowSelectApproverExisting(row, isSelected) {
    if (isSelected) {
      const { ApproverExistingArray, isSelectedExisting } = this.state;
      let data = {
        key: row.KEY,
        Overwrite_qty: row.OVERWRITE_QTY
      };
      let ID = row.KEY;

      this.setState(() => ({
        ApproverExistingArray: [...ApproverExistingArray, data],
        isSelectedExisting: [...isSelectedExisting, ID]
      }));
    } else {
      let data = row.KEY;

      let res = this.state.ApproverExistingArray.filter((d) => d.key !== data);
      let ID_res = this.state.isSelectedExisting.filter((d) => d !== data);

      this.setState({
        ApproverExistingArray: res,
        isSelectedExisting: ID_res
      });
    }
  }

  //end
  //existing select all
  handleOnSelectAllExisting(isSelect) {
    if (isSelect) {
      const { ApproverExistingArray, isSelectedExisting } = this.state;

      let data = this.state.ExistingAndInvalidData.map((d) => {
        const response = {
          key: d.KEY,
          Overwrite_qty: d.OVERWRITE_QTY
        };
        return response;
      });
      let ID = this.state.ExistingAndInvalidData.map((d) => d.KEY);

      this.setState(() => ({
        ApproverExistingArray: [...ApproverExistingArray, ...data],
        isSelectedExisting: [...isSelectedExisting, ...ID]
      }));
      return this.state.ExistingAndInvalidData.map((d) => d.KEY);
    } else {
      let data = this.state.ExistingAndInvalidData.map((d) => d.KEY);

      let res = this.state.ApproverExistingArray.filter((d) => !data.includes(d.key));

      this.setState({
        ApproverExistingArray: res,
        isSelectedExisting: []
      });
      return [];
    }
  }
  //end
  //existing post api

  PostOrdersPushPullBulkOverride(v1, v2, v3) {
    if (v3 === 'Y') {
      this.setState({ UpdateLoading: true });
    } else {
      this.setState({
        DeleteLoading: true
      });
    }
    try {
      axios
        .post(`${ROOT_URL}PostForecastOverrideBulkExisting?SubmittedBy=${v2}&IsUpdate=${v3}`, {
          Key: v1
        })
        .then((res) => {
          if (res.status == 200) {
            message.success('Data Updated Successfully');
            this.setState({
              ApproverExistingArray: [],
              ExistingAndInvalidData: [],
              isDataFetchedreview: false,
              DeleteLoading: false,
              UpdateLoading: false
            });
            this.HandleClearTblFilter();
            this.props.getForecastOverrideReviewData(
              'EXISTING_REQUEST',
              sessionStorage.getItem('loggedEmailId')
            );
          }
        })
        .catch(() => {
          message.error('Fail To Update');
        });
    } catch (error) {
      message.error('Three was an error with your submition');
    }
  }
  //end
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
  //clear invaliud and exisiting filter
  HandleClearTblFilter() {
    MATERIALFilter(''),
      LGORTFilter(''),
      DATEFilter(''),
      OVERWRITE_QTYFilter(''),
      SUBMITTED_BYFilter(''),
      COMMENTSFilter(''),
      REASON_CODEFilter(''),
      ReasonFilter('');
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
  //export csv
  exportToCSV() {
    var dum = [];
    if (this.state.defaultActivelkey === '1') {
      let csvData = this.state.OverAllReviewData;
      let fileName = `Forecast Overwrite Over View`;
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    } else if (this.state.defaultActivelkey === '2') {
      dum = this.state.ExistingAndInvalidData.map((obj) => {
        return {
          MATERIAL: obj.MATERIAL,
          LGORT: obj.LGORT,
          DATE: obj.DATE,
          FORECASTED_QTY: obj.FORECASTED_QTY,
          OVERWRITE_QTY: obj.OVERWRITE_QTY,
          SUBMITTED_BY: obj.SUBMITTED_BY,
          COMMENTS: obj.COMMENTS,
          REASON_CODE: obj.REASON_CODE,
          Reason: obj.Reason
        };
      });
      let csvData = dum;
      let fileName = `${
        this.state.InavlidExisitingSwitch
          ? 'Forecast Overwrite Invalid'
          : 'Forecast OverwriteExisting'
      }`;
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    } else {
      let csvData = this.state.getForecastOverrideApproverReviewData;
      let fileName = `Forecast Overwrite Aprrover review`;
      const ws = XLSX.utils.json_to_sheet(csvData);
      const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: fileType });
      FileSaver.saveAs(data, fileName + fileExtension);
    }
  }

  PostForecastOverrideBulkUpdateInvalid(v1, v2, v3) {
    if (v3 === 'Y') {
      this.setState({
        UpdateLoading: true
      });
    } else {
      this.setState({
        DeleteLoading: true
      });
    }
    axios
      .post(`${ROOT_URL}PostForecastOverrideBulkUpdateInvalid?SubmittedBy=${v2}&IsUpdate=${v3}`, {
        Key: v1
      })
      .then((res) => {
        if (res.data) {
          this.setState({
            InvalidToValidDataSelected: [],
            ExistingAndInvalidData: [],
            InvalidToValidData: [],
            UpdateLoading: false,
            DeleteLoading: false,

            isDataFetchedreview: false
          });
          this.props.getForecastOverrideReviewData(
            'INVALID_REQUEST',
            sessionStorage.getItem('loggedEmailId')
          );
        }
      })
      .catch(() => {
        message.error('Fail To Update');
      });
  }

  render() {
    //existing row
    const selectRowExisting = {
      mode: 'checkbox',
      selected: this.state.isSelectedExisting,
      clickToSelect: true,
      onSelect: this.onRowSelectApproverExisting.bind(this),
      onSelectAll: this.handleOnSelectAllExisting.bind(this)
    };
    //end
    const selectRowInvalid = {
      mode: 'checkbox',

      clickToEdit: true,
      selected: this.state.InvalidToValidDataSelected.map((d) => d.KEY),
      classes: 'selection-row',
      onSelect: this.onRowSelectInvalid.bind(this),
      onSelectAll: this.onRowSelectAllInvalid.bind(this)
    };
    const selectRowForecastApproverReview = {
      mode: 'checkbox',
      clickToSelect: true,
      selected: this.state.ApproverReviewArray,
      onSelect: this.onRowSelectForecastApproverReview.bind(this),
      onSelectAll: this.handleOnSelectAllForecastOverrideApproverReview.bind(this)
    };
    return (
      <>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>Approval Confirmation </div>}
          className="Intervaltimeline"
          visible={this.state.UpdatePopUpApproverReview}
          destroyOnClose
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
                      onChange={this.getApproverCommentForecastOverride}
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
                    type="submit"
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
                    type="submit"
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

        <Modal
          width="80%"
          style={{ top: 40 }}
          footer={null}
          title={
            <Row>
              <Col span={12}>Forecast Overwrite</Col>
              <Col span={12}>
                {this.state.defaultActivelkey === '1' ? (
                  <div className="float-right ">
                    <UploadForecast />
                  </div>
                ) : (
                  ''
                )}
              </Col>
            </Row>
          }
          visible={this.props.HandleforecastModalData}
          onCancel={() => this.props.HandleforecastModal(false)}>
          <Tabs activeKey={this.state.defaultActivelkey} onChange={this.tabChange}>
            <TabPane tab="Overview" key="1">
              <div>
                <ToolkitProvider
                  keyField="id"
                  data={this.state.OverAllReviewData}
                  columns={this.state.OverAllReviewCol}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        if (this.state.OverAllReviewData != '') {
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
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                          <Menu
                            onClick={this.MenuOnclick}
                            selectedKeys={[this.state.current]}
                            className="pushpull"
                            mode="horizontal"
                            items={items}
                            style={{
                              lineHeight: '36px'
                            }}>
                            <Menu.Item key="All">
                              {' '}
                              <span style={{ cursor: 'pointer' }}>
                                <Badge
                                  className="bdge-rejected1 bdge-All rt"
                                  count={
                                    this.state.StatusApproved +
                                    this.state.StatusRejected +
                                    this.state.StatusRequested
                                  }>
                                  <span>
                                    <a style={{ fontSize: '12px' }}>All</a>
                                  </span>
                                </Badge>
                              </span>
                            </Menu.Item>
                            <Menu.Item key="requested">
                              {' '}
                              <span style={{ cursor: 'pointer' }}>
                                <Badge
                                  className="bdge-requested"
                                  count={this.state.StatusRequested}>
                                  <a>Requested</a>
                                  &nbsp;
                                </Badge>
                              </span>
                            </Menu.Item>
                            <Menu.Item key="Approved">
                              {' '}
                              <span style={{ cursor: 'pointer' }}>
                                <Badge className="bdge-Approved" count={this.state.StatusApproved}>
                                  {' '}
                                  <a>Approved &nbsp;</a>
                                </Badge>
                              </span>
                            </Menu.Item>
                            <Menu.Item key="Rejected">
                              {' '}
                              <span style={{ cursor: 'pointer' }}>
                                <Badge className="bdge-rejected" count={this.state.StatusRejected}>
                                  <a> Rejected &nbsp;</a>
                                </Badge>
                              </span>
                            </Menu.Item>
                          </Menu>
                        </Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {this.state.OverAllReviewData != '' ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={this.exportToCSV}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              // onClick={this.exportToCSV}
                            >
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}
                          {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      {/* <ReactDragListView.DragColumn
                        onDragEnd={this.onDragEnd.bind(this)}
                        nodeSelector="th"
                      > */}
                      <div className="capgov-table table-pagination-top">
                        <BootstrapTable
                          {...props.baseProps}
                          pagination={paginationFactory()}
                          noDataIndication={() => this.tblLoader()}
                          filter={filterFactory()}
                        />
                      </div>
                      {/* </ReactDragListView.DragColumn> */}
                    </div>
                  )}
                </ToolkitProvider>
              </div>
            </TabPane>
            <TabPane tab="Fall Out" key="2">
              <div>
                {this.state.InavlidExisitingSwitch ? (
                  <>
                    <Row>
                      <Col span={12}>
                        <Switch
                          className="supplyPosSwitch"
                          checkedChildren="Invalid Request"
                          unCheckedChildren="Existing Request"
                          // defaultChecked
                          checked={this.state.InavlidExisitingSwitch}
                          onChange={this.getcheckValues}
                        />
                      </Col>
                      <Col span={12}>
                        {this.state.ExistingAndInvalidData != '' ? (
                          <Button
                            size="sm"
                            className="export-Btn ml-2 mr-2 float-right"
                            onClick={this.exportToCSV}>
                            <i className="fas fa-file-excel" />
                          </Button>
                        ) : (
                          <Button size="sm" disabled className="export-Btn ml-2 mr-2 float-right">
                            <i className="fas fa-file-excel" />
                          </Button>
                        )}

                        <button
                          onClick={this.HandleClearTblFilter}
                          className="ClearBtn float-right mb-2 mr-3">
                          Clear Filter
                        </button>
                      </Col>
                    </Row>

                    <div className="table-color InvalidRequestOverWriteTable">
                      <BootstrapTable
                        ref={this.bstable}
                        keyField="KEY"
                        data={this.state.ExistingAndInvalidData}
                        columns={this.state.InvalidCol}
                        selectRow={selectRowInvalid}
                        filterPosition="top"
                        cellEdit={cellEditFactory({
                          mode: 'click',
                          blurToSave: true,
                          autoSelectText: true,
                          onStartEdit: (row, column, rowIndex, columnIndex) => {
                            document.getElementsByTagName('tr').className += 'selection-row';
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
                      <Row>
                        <Col span={24} className="mb-2 mt-2">
                          <div className="float-right">
                            {this.state.InvalidToValidDataSelected != '' ? (
                              <Button
                                loading={this.state.DeleteLoading}
                                id="submitt"
                                key="submit"
                                className="tbl-DeleteBtn btn-css mr-2"
                                onClick={() =>
                                  this.PostForecastOverrideBulkUpdateInvalid(
                                    this.state.InvalidToValidDataSelected,
                                    sessionStorage.getItem('loggedEmailId'),
                                    'N'
                                  )
                                }>
                                Delete
                              </Button>
                            ) : (
                              <Button id="submitt" key="submit" className="btn-css mr-2" disabled>
                                Delete
                              </Button>
                            )}{' '}
                            <Button
                              className="btn-css mr-2 tbl-cancel"
                              type="primary"
                              key="back"
                              onClick={this.ResetSelectedState}>
                              Cancel
                            </Button>
                            {this.state.InvalidToValidData != '' ? (
                              <Button
                                loading={this.state.UpdateLoading}
                                id="submitt"
                                key="submit"
                                className="tbl-Update btn-css mr-2"
                                onClick={() =>
                                  this.PostForecastOverrideBulkUpdateInvalid(
                                    this.state.InvalidToValidData,
                                    sessionStorage.getItem('loggedEmailId'),
                                    'Y'
                                  )
                                }>
                                Update
                              </Button>
                            ) : (
                              <Button id="submitt" key="submit" className="btn-css mr-2" disabled>
                                Update
                              </Button>
                            )}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  </>
                ) : (
                  <>
                    <Row>
                      <Col span={12}>
                        {' '}
                        <Switch
                          className="supplyPosSwitch mb-3 ml-2 mt-1"
                          checkedChildren="Invalid Request"
                          unCheckedChildren="Existing Request"
                          // defaultChecked
                          checked={this.state.InavlidExisitingSwitch}
                          onChange={this.getcheckValues}
                        />
                      </Col>
                      <Col span={12}>
                        {this.state.ExistingAndInvalidData != '' ? (
                          <Button
                            size="sm"
                            className="export-Btn ml-2 mr-2 float-right"
                            onClick={this.exportToCSV}>
                            <i className="fas fa-file-excel" />
                          </Button>
                        ) : (
                          <Button size="sm" className="export-Btn ml-2 mr-2 float-right">
                            <i className="fas fa-file-excel" />
                          </Button>
                        )}

                        <button
                          onClick={this.HandleClearTblFilter}
                          className="ClearBtn float-right mb-2 mr-3">
                          Clear Filter
                        </button>
                      </Col>
                    </Row>

                    <div className="table-color">
                      <BootstrapTable
                        ref={this.bstable}
                        keyField="KEY"
                        data={this.state.ExistingAndInvalidData}
                        columns={this.state.InvalidExistingCol}
                        selectRow={selectRowExisting}
                        filterPosition="top"
                        cellEdit={cellEditFactory({
                          mode: 'click',
                          blurToSave: true,
                          autoSelectText: true,
                          onStartEdit: (row, column, rowIndex, columnIndex) => {
                            document.getElementsByTagName('tr').className += 'selection-row';
                            this.setState({
                              columnIndex: columnIndex
                            });
                          }
                          // beforeSaveCell: this.beforeSaveCell.bind(this)
                        })}
                        pagination={paginationFactory()}
                        noDataIndication={this.tblLoaderreview}
                        filter={filterFactory()}
                      />
                    </div>
                    <Row>
                      <Col span={24} className="mb-2 mt-2">
                        {' '}
                        <div className="float-right">
                          {this.state.ApproverExistingArray != '' ? (
                            <Button
                              loading={this.state.DeleteLoading}
                              id="submitt"
                              key="submit"
                              className="tbl-DeleteBtn btn-css mr-2"
                              onClick={() =>
                                this.PostOrdersPushPullBulkOverride(
                                  this.state.ApproverExistingArray,
                                  sessionStorage.getItem('loggedEmailId'),
                                  'N'
                                )
                              }>
                              Delete
                            </Button>
                          ) : (
                            <Button id="submitt" key="submit" className="btn-css mr-2" disabled>
                              Delete
                            </Button>
                          )}
                          <Button
                            className="btn-css mr-2 tbl-cancel"
                            type="primary"
                            key="back"
                            onClick={this.ResetSelectedState}>
                            Cancel
                          </Button>
                          {this.state.ApproverExistingArray != '' ? (
                            <Button
                              loading={this.state.UpdateLoading}
                              id="submitt"
                              key="submit"
                              className="tbl-Update btn-css mr-2"
                              onClick={() =>
                                this.PostOrdersPushPullBulkOverride(
                                  this.state.ApproverExistingArray,
                                  sessionStorage.getItem('loggedEmailId'),
                                  'Y'
                                )
                              }>
                              Update
                            </Button>
                          ) : (
                            <Button id="submitt" key="submit" className="btn-css mr-2" disabled>
                              Update
                            </Button>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </>
                )}
              </div>
            </TabPane>
            {sessionStorage.getItem('ForecastOverrideApprover') != 'N' ? (
              <TabPane tab="Approver Review" key="3">
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
                              onClick={this.exportToCSV}>
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
                        <Button
                          className="btn-css mr-2 tbl-cancel"
                          type="primary"
                          key="back"
                          onClick={() => this.ResetSelectedState}>
                          Cancel
                        </Button>
                        {this.state.ApproverReviewArray != '' ? (
                          <Button
                            id="submitt"
                            key="submit"
                            type="primary"
                            className="tbl-Update btn-css mr-2"
                            onClick={this.UpdateValidation}>
                            Update
                          </Button>
                        ) : (
                          <Button id="submitt" key="submit" disabled className="btn-css mr-2">
                            Update
                          </Button>
                        )}
                      </div>
                    </Col>
                  </Row>
                </div>
              </TabPane>
            ) : (
              ''
            )}
          </Tabs>
        </Modal>
      </>
    );
  }
}

function mapState(state) {
  return {
    getForecastOverrideOverviewData: state.getForecastOverrideOverview,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    getForecastOverrideStatusCountData: state.getForecastOverrideStatusCount,
    getForecastOverrideReviewDataData: state.getForecastOverrideReviewData,
    getForecastOverrideApproverReviewData: state.getForecastOverrideApproverReview,
    HandleforecastModalData: state.HandleforecastModal.forecast
  };
}

export default connect(mapState, {
  getForecastOverrideOverview,
  getForecastOverrideReviewData,
  getForecastOverrideStatusCount,
  getUserImpersonationDetails,
  getForecastOverrideApproverReview,
  HandleforecastModal
})(ForecastOverRideUpload);
