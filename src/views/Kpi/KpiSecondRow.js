import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Modal, Tabs, Card, Button, Popover } from 'antd';
import ColorPicker from 'rc-color-picker';

import { useDispatch, useSelector } from 'react-redux';
import {
  getTotalCapexforTopMats,
  getTotalCapexForMaterial,
  getTotalCapexForManufacturer,
  getTotalCapexForOrganization,
  getTotalQuantityAndCapex,
  getTotalQuantityAndCapexMaterialTrend,
  getOutStandingOrdersMaterial,
  getTotalQuantityAndCapexManufTrend,
  getOutStandingOrdersManuf,
  getTotalQuantityAndCapexOrgTrend,
  getOutStandingOrdersOrg,
  getOustandingOrdersMonthwise,
  getTotalQuantityAndCapexLoader
} from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory from 'react-bootstrap-table2-filter';

import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import ReactDragListView from 'react-drag-listview';
import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';
import moment from 'moment';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { calculation } from '../Calculation';

import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { DummyTable } from '../../components/CustomComponents/DummyTable';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const { TabPane } = Tabs;
const { SearchBar } = Search;

export const KpiSecondRow = () => {
  const dispatch = useDispatch();
  const OutStandingOrderView = useRef();
  const exportORGTrend = useRef();
  const exportManufTrend = useRef();
  const exportMatnrTrend = useRef();

  const getOustandingOrdersMonthwiseData = useSelector(
    (state) => state.getOustandingOrdersMonthwise
  );
  const state = useSelector((state) => state.getUserImpersonationDetails);
  const state1 = useSelector(
    (state) => state.getTotalQuantityAndCapexLoader.getTotalQuantityAndCapexLoader
  );

  useEffect(() => {
    if (state1) {
      // dispatch(getTotalQuantityAndCapexLoader(true));
      dispatch(getTotalCapexforTopMats());
      dispatch(getTotalCapexForMaterial());

      dispatch(getTotalQuantityAndCapex());
    }
  }, [state]);

  const getTotalQuantityAndCapexOrgTrendData = useSelector(
    (state) => state.getTotalQuantityAndCapexOrgTrend
  );

  const getOutStandingOrdersOrgData = useSelector((state) => state.getOutStandingOrdersOrg);
  const getTotalQuantityAndCapexManufTrendData = useSelector(
    (state) => state.getTotalQuantityAndCapexManufTrend
  );

  const getOutStandingOrdersManufData = useSelector((state) => state.getOutStandingOrdersManuf);

  const getTotalQuantityAndCapexMaterialTrendData = useSelector(
    (state) => state.getTotalQuantityAndCapexMaterialTrend
  );

  const getOutStandingOrdersMaterialData = useSelector(
    (state) => state.getOutStandingOrdersMaterial
  );
  const TotalCapexforTopMatsData = useSelector(
    (state) => state.getTotalCapexforTopMats[0]?.tot_capex
  );
  const TotalCapexForMaterialData = useSelector((state) => state.getTotalCapexForMaterial);

  const TotalCapexForManufacturerData = useSelector((state) => state.getTotalCapexForManufacturer);

  const TotalCapexForOrganizationData = useSelector((state) => state.getTotalCapexForOrganization);

  const TotalQuantityAndCapexData = useSelector((state) => state.getTotalQuantityAndCapex);
  const getOutStandingOrdersMaterialReducerLoader = useSelector(
    (state) => state.getOutStandingOrdersMaterialReducerLoader
  );
  const getTotalQuantityAndCapexMaterialTrendReducerLoader = useSelector(
    (state) => state.getTotalQuantityAndCapexMaterialTrendReducerLoader
  );
  const getOutStandingOrdersManufReducerLoader = useSelector(
    (state) => state.getOutStandingOrdersManufReducerLoader
  );
  const getTotalQuantityAndCapexManufTrendReducerLoader = useSelector(
    (state) => state.getTotalQuantityAndCapexManufTrendReducerLoader
  );
  const getOutStandingOrdersOrgReducerLoader = useSelector(
    (state) => state.getOutStandingOrdersOrgReducerLoader
  );
  const getTotalQuantityAndCapexOrgTrendReducerLoader = useSelector(
    (state) => state.getTotalQuantityAndCapexOrgTrendReducerLoader
  );

  useEffect(() => {
    if (TotalQuantityAndCapexData.length != 0) {
      dispatch(getTotalQuantityAndCapexLoader(false));
    }
  }, [TotalQuantityAndCapexData]);

  const [color1, setcolor1] = useState('#91e34a');
  const [color2, setcolor2] = useState('#ffffff');

  const [info, setinfo] = useState(false);

  const [ModalVisible, setModalVisible] = useState(false);
  const [activekey, setsetactivekey] = useState('1');

  const [Mainview, setMainview] = useState(false);
  const [MatAction, setMatAction] = useState(false);
  const [ManufAction, setManufAction] = useState(false);
  const [OrgAction, setOrgAction] = useState(false);

  // eslint-disable-next-line no-unused-vars
  const [newResultLength, setnewResultLength] = useState('');

  const [action_name, setaction_name] = useState('');
  const [VendorName, setVendorName] = useState('');
  const [action_lgort, setaction_lgort] = useState('');
  const [action_capex, setaction_capex] = useState('');
  const [action_qty, setaction_qty] = useState('');

  const [activelabel, setactivelabel] = useState('');

  const [ddTablemodal, setddTablemodal] = useState(false);

  const [matnr_action, setmatnr_action] = useState([
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
      text: 'POLine',
      sort: true,
      headerStyle: { width: 85 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'Plant',
      text: 'Plant',
      sort: true,
      headerStyle: { width: 85 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'POCreated',
      text: 'Po Created',
      sort: true,
      headerStyle: { width: 130 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'POAcknowledged',
      text: 'PO Acknowledged',
      sort: true,
      headerStyle: { width: 160 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'POQty',
      text: 'POQty',
      sort: true,
      headerStyle: { width: 95 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'ReceiptQty',
      text: 'ReceiptQty',
      sort: true,
      headerStyle: { width: 120 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'OpenQty',
      text: 'OpenQty',
      sort: true,
      headerStyle: { width: 105 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'RequestedShippingDate',
      text: 'Requested Shipping Date',
      sort: true,
      headerStyle: { width: 200 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      align: 'center',
      headerAlign: 'center'
    }
  ]);

  const [manuf_action, setmanuf_action] = useState([
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
      text: 'POLine',
      sort: true,
      headerStyle: { width: 85 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'Plant',
      text: 'Plant',
      sort: true,
      headerStyle: { width: 85 },

      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'POCreated',
      text: 'Po Created',
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      sort: true,
      headerStyle: { width: 130 },
      align: 'center',
      headerAlign: 'center'
    },
    {
      dataField: 'POAcknowledged',
      text: 'PO Acknowledged',
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      sort: true,
      headerStyle: { width: 160 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'POQty',
      text: 'POQty',
      sort: true,
      headerStyle: { width: 95 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'ReceiptQty',
      text: 'ReceiptQty',
      sort: true,
      headerStyle: { width: 120 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'OpenQty',
      text: 'OpenQty',
      sort: true,
      headerStyle: { width: 95 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'RequestedShippingDate',
      text: 'Requested Shipping Date',
      sort: true,
      headerStyle: { width: 200 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      align: 'center',
      headerAlign: 'center'
    }
  ]);

  const [org_action, setorg_action] = useState([
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
      text: 'POLine',
      sort: true,
      headerStyle: { width: 85 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'Plant',
      text: 'Plant',
      sort: true,
      headerStyle: { width: 85 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'POCreated',
      text: 'Po Created',
      sort: true,
      headerStyle: { width: 150 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      align: 'center',
      headerAlign: 'center'
    },
    {
      dataField: 'POAcknowledged',
      text: 'PO Acknowledged',
      sort: true,
      headerStyle: { width: 150 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      align: 'center',
      headerAlign: 'center'
    },
    {
      dataField: 'POQty',
      text: 'POQty',
      sort: true,
      headerStyle: { width: 95 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'ReceiptQty',
      text: 'ReceiptQty',
      sort: true,
      headerStyle: { width: 120 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'OpenQty',
      text: 'OpenQty',
      sort: true,
      headerStyle: { width: 95 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'RequestedShippingDate',
      text: 'Requested Shipping Date',
      sort: true,
      headerStyle: { width: 200 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      align: 'center',
      headerAlign: 'center'
    }
  ]);
  const MatCol = [
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
            onClick={() => onclickActionMatnr(row)}>
            <i className="fas fa-chart-line" />
          </Button>
        </div>
      )
    },
    {
      dataField: 'mat',
      text: 'Material',
      sort: true,

      headerStyle: { width: 40 },
      formatter: (a, b) => MaterialDescription(a, b),

      align: 'left',
      headerAlign: 'left'
    },
    {
      dataField: 'LGORT',
      text: 'LGORT',
      sort: true,
      headerStyle: { width: 40 },

      align: 'center',
      headerAlign: 'center'
    },

    {
      dataField: 'MANUF_NAME',
      text: 'Manufacturer',
      sort: true,
      headerStyle: { width: 115 },

      align: 'left',
      headerAlign: 'left'
    },
    {
      dataField: 'ORGANIZATION',
      text: 'Organization',
      sort: true,
      headerStyle: { width: 50 },

      align: 'left',
      headerAlign: 'left'
    },
    {
      dataField: 'mat_capex',
      text: 'Capex',
      sort: true,
      headerStyle: { width: 40 },
      formatter: calculation,
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'Quantity',
      text: 'Quantity',
      sort: true,
      headerStyle: { width: 50 },

      align: 'right',
      headerAlign: 'right'
    }
  ];

  const [mat_tbl_col, setmat_tbl_col] = useState(MatCol);
  const [manuf_tbl_col, setmanuf_tbl_col] = useState([
    {
      text: 'Action',
      dataField: '',
      headerStyle: { width: 20 },
      formatter: (cell, row) => (
        <div className="text-center">
          <Button
            size="small"
            type="primary"
            className="mr-1 modal-action-icon"
            id={row.MATNR}
            onClick={() => onclickActionManuf(row)}>
            <i className="fas fa-chart-line" />
          </Button>
        </div>
      )
    },
    {
      dataField: 'MANUF',
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
      headerStyle: { width: 30 },

      align: 'left',
      headerAlign: 'left'
    },
    {
      dataField: 'VENDOR',
      text: ' Vendor No',
      sort: true,
      headerStyle: { width: 45 },

      align: 'center',
      headerAlign: 'center'
    },
    {
      dataField: 'VENDOR_NAME',
      text: 'Vendor Name',
      sort: true,
      headerStyle: { width: 110 },

      align: 'left',
      headerAlign: 'left'
    },
    {
      dataField: 'manuf_capex',
      text: 'Capex',
      sort: true,
      headerStyle: { width: 40 },
      formatter: calculation,
      align: 'left',
      headerAlign: 'left'
    },
    {
      dataField: 'Quantity',
      text: 'Quantity',
      sort: true,
      headerStyle: { width: 40 },

      align: 'right',
      headerAlign: 'right'
    }
  ]);
  const [org_tbl_col, setorg_tbl_col] = useState([
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
            onClick={() => onclickActionorg(row)}>
            <i className="fas fa-chart-line" />
          </Button>
        </div>
      )
    },
    {
      dataField: 'ORGANIZATION',
      text: 'Organization ',
      sort: true,
      headerStyle: { width: 50 },

      align: 'left',
      headerAlign: 'left'
    },
    {
      dataField: 'LGORT',
      text: 'LGORT',
      sort: true,
      headerStyle: { width: 40 },

      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'org_capex',
      text: 'Capex',
      sort: true,
      headerStyle: { width: 60 },
      align: 'right',
      formatter: calculation,
      headerAlign: 'right'
    },
    {
      dataField: 'Quantity',
      text: 'Quantity',
      sort: true,
      headerStyle: { width: 50 },

      align: 'right',
      headerAlign: 'right'
    }
  ]);

  const [DateWiseTbLView, setDateWiseTbLView] = useState([
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
      text: 'POLine',
      sort: true,
      headerStyle: { width: 85 },

      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'Vendor',
      text: 'Vendor',
      sort: true,
      headerStyle: { width: 85 },

      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'vendorName',
      text: 'vendor Name',
      sort: true,
      headerStyle: { width: 240 },

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
      dataField: 'LGORT',
      text: 'LGORT',
      sort: true,
      headerStyle: { width: 80 },

      align: 'right',
      headerAlign: 'right'
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
      headerStyle: { width: 140 },

      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'Plant',
      text: 'Plant',
      sort: true,
      headerStyle: { width: 85 },

      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'POCreated',
      text: 'Po Created',
      sort: true,
      headerStyle: { width: 110 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),

      align: 'center',
      headerAlign: 'center'
    },
    {
      dataField: 'POAcknowledged',
      text: 'PO Acknowledged',
      sort: true,
      headerStyle: { width: 150 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),
      align: 'center',
      headerAlign: 'center'
    },
    {
      dataField: 'POQty',
      text: 'POQty',
      sort: true,
      headerStyle: { width: 85 },

      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'ReceiptQty',
      text: 'ReceiptQty',
      sort: true,
      headerStyle: { width: 110 },
      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'OpenQty',
      text: 'OpenQty',
      sort: true,
      headerStyle: { width: 90 },

      align: 'right',
      headerAlign: 'right'
    },
    {
      dataField: 'RequestedShippingDate',
      text: 'Requested Shipping Date',
      sort: true,
      headerStyle: { width: 195 },
      sortFunc: (a, b, c) => SortFuncDate(a, b, c),
      formatter: (a) => Dateformat(a),

      align: 'center',
      headerAlign: 'center'
    }
  ]);

  const MaterialDescription = (cell, row) => {
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
  };

  const onDragEnd = (fromIndex, toIndex) => {
    const columnsCopy = mat_tbl_col.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    setmat_tbl_col(columnsCopy);
  };

  const onDragEndorg_action = (fromIndex, toIndex) => {
    const columnsCopy = org_action.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    setorg_action(columnsCopy);
  };

  const onDragEndmanuf_action = (fromIndex, toIndex) => {
    const columnsCopy = manuf_action.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    setmanuf_action(columnsCopy);
  };

  const onDragEndDateViseTrend = (fromIndex, toIndex) => {
    const columnsCopy = DateWiseTbLView.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    setDateWiseTbLView(columnsCopy);
  };

  const onDragEndMatAction = (fromIndex, toIndex) => {
    const columnsCopy = matnr_action.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    setmatnr_action(columnsCopy);
  };

  const onDragEndManuf = (fromIndex, toIndex) => {
    const columnsCopy = manuf_tbl_col.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);

    setmanuf_tbl_col(columnsCopy);
  };

  const onDragEndorg = (fromIndex, toIndex) => {
    const columnsCopy = org_tbl_col.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);

    setorg_tbl_col(columnsCopy);
  };

  const Dateformat = (cell) => {
    if (cell == '-') {
      return <span>-</span>;
    } else {
      let value = moment(cell).format('MM-DD-YYYY');
      return <span>{value}</span>;
    }
  };
  const SortFuncDate = (a, b, order) => {
    if (order === 'asc') {
      return moment(a) - moment(b);
    } else if (order === 'desc') {
      return moment(b) - moment(a);
    }
  };

  const handleModal = () => {
    if (ModalVisible) {
      setModalVisible(false);
      setsetactivekey('1');
      setcolor1('#91e34a');
      setcolor2('#ffffff');
    } else {
      setModalVisible(true);
    }
  };

  const HandleSetActiveKey = (key) => {
    if (key == 3) {
      dispatch(getTotalCapexForOrganization());
      setVendorName('');
      setsetactivekey('3');
      setcolor1('#91e34a');
      setcolor2('#ffffff');
    } else if (key == 2) {
      dispatch(getTotalCapexForManufacturer());
      setsetactivekey('2');
      setVendorName('');
      setcolor1('#91e34a');
      setcolor2('#ffffff');
    } else {
      dispatch(getTotalCapexForMaterial());
      setsetactivekey('1');
      setVendorName('');
      setcolor1('#91e34a');
      setcolor2('#ffffff');
    }
  };

  const tblLoader = () => {
    return (
      <div className="tbl-no-data-found">
        <div>
          <h5>No data available for this criteria</h5>
        </div>
      </div>
    );
  };

  const exportToCSVMaterial = () => {
    let csvData = TotalCapexForMaterialData.map((obj) => {
      return {
        Material: obj.mat,
        LGORT: obj.LGORT,
        DESCRIPTION: obj.DESCRIPTION,
        HECI: obj.HECI,
        STK_TYPE: obj.STK_TYPE,
        CTL_STOCKOUT_FLAG: obj.CTL_STOCKOUT_FLAG,
        LVLT_STOCKOUT_FLAG: obj.LVLT_STOCKOUT_FLAG,
        ORGANIZATION: obj.ORGANIZATION,
        MANUF_NAME: obj.MANUF_NAME,
        Quantity: obj.Quantity,
        Materail_capex: obj.mat_capex
      };
    });
    let fileName = `Open Orders Material wise`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportToCSVMaterialMatActionDDView = () => {
    let csvData = getOutStandingOrdersMaterialData;
    let fileName = `${action_name} - Open Orders`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const getOustandingOrdersMonthwiseExport = () => {
    let csvData = getOustandingOrdersMonthwiseData;
    let fileName = `getOustandingOrdersMonthwise`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportToCSVMaterialManufActionDDView = () => {
    let csvData = getOutStandingOrdersManufData;
    let fileName = `${VendorName} - Open Orders`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportToCSVorgActionDDView = () => {
    let csvData = getOutStandingOrdersOrgData;
    let fileName = `${action_name} - Open Orders`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportToCSVManufacturer = () => {
    let csvData = TotalCapexForManufacturerData;
    let fileName = `Open Orders Manufacturer wise`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportToCSVOrganization = () => {
    let csvData = TotalCapexForOrganizationData;
    let fileName = `Open Orders Organization wise`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  const exportToCSVTrend = () => {
    let csvData = TotalQuantityAndCapexData;
    let fileName = `TotalQuantityAndCapex`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportToCSVOrgTrend = () => {
    let csvData = getTotalQuantityAndCapexOrgTrendData;
    let fileName = `${action_name} - Open Orders`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportToCSVManufTrend = () => {
    let csvData = getTotalQuantityAndCapexManufTrendData;
    let fileName = `${VendorName} - Open Orders`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const exportToCSVMatnrTrend = () => {
    let csvData = getTotalQuantityAndCapexMaterialTrendData;
    let fileName = `${action_name} - Open Orders`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
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

  const pageoptions = {
    sizePerPageRenderer
  };

  const TooltipFormatLeadtimeMaterial = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let values = moment(e.payload[0].payload.DS).format('MM-DD-YYYY');
      let dd = calculation(e.payload[0].payload.MON_CAPEX);
      return (
        <div className="custom-tooltip">
          <span>
            <b>{values}</b> <br />
          </span>
          <span>
            <b>Monthly Capex:{dd}</b> <br />
          </span>
          <span>
            <b>Monthly Quantity: {e.payload[0].payload.MON_QTY}</b> <br />
          </span>
        </div>
      );
    }
  };
  const HandleMainViewDD = () => {
    setMainview(!Mainview);
    setcolor1('#91e34a');
    setcolor2('#ffffff');
  };
  //mat action func
  const onclickActionMatnr = (a) => {
    setaction_name(a.mat);
    setaction_lgort(a.LGORT);
    setaction_capex(a.mat_capex);
    setaction_qty(a.Quantity);
    setMatAction(true);

    dispatch(getTotalQuantityAndCapexMaterialTrend(a.mat, a.LGORT));
    dispatch(getOutStandingOrdersMaterial(a.mat, a.LGORT));
  };

  const onclickCloseMatnrAction = () => {
    setaction_name('');
    setaction_lgort('');
    setaction_capex('');
    setaction_qty('');
    setMatAction(false);
  };
  //manuf action func

  const onclickActionManuf = (a) => {
    setVendorName(a.VENDOR_NAME);
    setaction_name(a.MANUF);
    setaction_lgort(a.LGORT);
    setaction_capex(a.manuf_capex);
    setaction_qty(a.Quantity);
    setManufAction(true);

    dispatch(
      getTotalQuantityAndCapexManufTrend(
        encodeURIComponent(a.MANUF),
        a.LGORT,
        encodeURIComponent(a.VENDOR)
      )
    );
    dispatch(
      getOutStandingOrdersManuf(encodeURIComponent(a.MANUF), a.LGORT, encodeURIComponent(a.VENDOR))
    );
  };

  const onclickCloseManufAction = () => {
    setVendorName('');
    setaction_name('');
    setaction_lgort('');
    setaction_capex('');
    setaction_qty('');
    setManufAction(false);
  };

  // org action func

  const onclickActionorg = (a) => {
    setaction_capex(a.org_capex);
    setaction_qty(a.Quantity);
    setaction_name(a.ORGANIZATION);
    setaction_lgort(a.LGORT);
    setOrgAction(true);

    dispatch(getTotalQuantityAndCapexOrgTrend(encodeURIComponent(a.ORGANIZATION), a.LGORT));
    dispatch(getOutStandingOrdersOrg(encodeURIComponent(a.ORGANIZATION), a.LGORT));
  };

  const onclickCloseOrgAction = () => {
    setaction_name('');
    setaction_lgort('');
    setaction_capex('');
    setaction_qty('');
    setOrgAction(false);
  };

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };

  const CloseDDtblView = () => {
    setddTablemodal(false);
    setactivelabel('');
    getOustandingOrdersMonthwiseData[0] = 'data';
    setnewResultLength('');
  };

  const HandleOpenOverAllViewDD = (val) => {
    setddTablemodal(true);

    if (val.DS != undefined) {
      setactivelabel(val.DS);
      dispatch(getOustandingOrdersMonthwise(val.DS));
    } else {
      dispatch(getOustandingOrdersMonthwise(val.activeLabel));
      setactivelabel(val.activeLabel);
    }
  };

  const HandleInfo = () => {
    setinfo(!info);
  };

  const changeHandler1 = (colors) => {
    setcolor1(colors.color);
  };
  const changeHandler2 = (colors) => {
    setcolor2(colors.color);
  };

  return (
    <div>
      <Card className="parts-wid  prl wid-card-height-kpi" size="small">
        {!state1 ? (
          <Row>
            <p className="kpi-w1">
              <i className="fas fa-cubes"></i> Outstanding Orders
              <Popover placement="right" content={<span>Info</span>}>
                <i className="fas fa-info-circle info-logo-widget ml-2" onClick={HandleInfo} />
              </Popover>
            </p>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              <p className="kpi-this-month">Overall Outstanding Orders </p>
              {/* <p className="kpi-series">
              $
              <Odometer value={TotalCapexforTopMats} options={{ format: "" }} />
              {"  "}
            </p> */}
              <p className="kpi-series">{calculation(TotalCapexforTopMatsData)}</p>
              <p className="kpi-this-month"></p>
              {/* <p className="kpi-this-month">Rolling 6 Months</p> */}

              <Button type="primary" onClick={() => handleModal()}>
                <span className="kpi-btn">
                  View more &nbsp;<i className="fas fa-arrow-right"></i>
                </span>
              </Button>
            </Col>
            <Col span={12}>
              <ResponsiveContainer height={80} width="100%">
                <ComposedChart
                  width={350}
                  height={120}
                  data={TotalQuantityAndCapexData}
                  onClick={HandleMainViewDD}
                  margin={{
                    top: 5,
                    right: 0,
                    left: 0,
                    bottom: 5
                  }}>
                  <Tooltip content={(e) => TooltipFormatLeadtimeMaterial(e)} />
                  <Bar yAxisId="left" dataKey="MON_CAPEX" fill={color1}></Bar>
                  <Line
                    yAxisId="right"
                    dataKey="MON_QTY"
                    // fill="#F1D00A"
                    dot={false}
                    strokeWidth={2}
                    stroke={localStorage.getItem('theme') === 'White' ? '#fa9105' : color2}
                    strokeDasharray="5 5"
                  />
                </ComposedChart>
              </ResponsiveContainer>
              <div
                className="turnover"
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.5px',

                  textAlign: 'center',
                  paddingTop: '40px',
                  paddingBottom: '21px'
                }}>
                <span>Outstanding Orders</span>
              </div>
            </Col>
          </Row>
        ) : (
          <span>
            {' '}
            <p className="kpi-w1">
              <i className="fas fa-hourglass-half"></i> Outstanding Orders
              <Popover placement="right" content={<span>Info</span>}>
                <i className="fas fa-info-circle info-logo-widget ml-2" onClick={HandleInfo} />
              </Popover>
            </p>
            <div className="kpi-loader">
              <ReusableSysncLoader />
            </div>
          </span>
        )}
      </Card>
      {/* info modal */}

      <Modal
        style={{ top: 60 }}
        footer={null}
        title={<div>Outstanding Orders - Description</div>}
        className="Intervaltimeline"
        visible={info}
        onCancel={HandleInfo}
        // width={150}
      >
        <div>
          <p>
            <strong>Outstanding Orders</strong>
          </p>
          <ul>
            <li>Number of Open POs</li>
          </ul>
        </div>
      </Modal>

      {/* chart DD view table */}

      <Modal
        style={{ top: 60 }}
        width="70%"
        footer={null}
        className="modal-turnover"
        visible={ddTablemodal}
        onCancel={CloseDDtblView}
        title={
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <i className="fas fa-table mr-2" />
              {moment(activelabel).format('MM-YYYY')} - Outstanding Orders{' '}
            </Col>
          </Row>
        }>
        <div>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="leadtime-tbl">
              <div>
                {' '}
                {getOustandingOrdersMonthwiseData[0] != 'data' ? (
                  <ToolkitProvider
                    keyField="id"
                    data={getOustandingOrdersMonthwiseData}
                    columns={DateWiseTbLView}
                    search={{
                      afterSearch: (newResult) => {
                        if (!newResult.length) {
                          setnewResultLength(newResult.length);
                        }
                      }
                    }}>
                    {(props) => (
                      <div>
                        <Row className="mb-1">
                          <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                          <Col
                            xs={12}
                            sm={12}
                            md={12}
                            lg={12}
                            xl={12}
                            className="float-right search-right">
                            {getOustandingOrdersMonthwiseData[0] != 'data' ? (
                              <Button
                                size="sm"
                                className="export-Btn ml-2 mr-2 float-right"
                                onClick={() => getOustandingOrdersMonthwiseExport()}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            ) : (
                              <Button
                                disabled
                                size="sm"
                                className="export-Btn ml-2 mr-2 float-right"
                                onClick={() => getOustandingOrdersMonthwiseExport()}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            )}

                            <SearchBar {...props.searchProps} />
                          </Col>
                        </Row>
                        <ReactDragListView.DragColumn
                          onDragEnd={(a, b) => onDragEndDateViseTrend(a, b)}
                          nodeSelector="th">
                          <div>
                            <BootstrapTable
                              {...props.baseProps}
                              pagination={paginationFactory()}
                              noDataIndication={() => tblLoader()}
                              // filter={filterFactory()
                              // }
                            />
                          </div>
                        </ReactDragListView.DragColumn>
                      </div>
                    )}
                  </ToolkitProvider>
                ) : (
                  <DummyTable column={DateWiseTbLView} />
                )}
              </div>
            </Col>
          </Row>
        </div>
      </Modal>

      {/* chart dd view table end */}

      {/* actionDDView */}
      <Modal
        style={{ top: 60 }}
        width="90%"
        footer={null}
        className="modal-turnover"
        visible={MatAction}
        onCancel={onclickCloseMatnrAction}
        title={
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <i className="fas fa-chart-line mr-2" />
              Material - {action_name}
            </Col>
          </Row>
        }>
        <div>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="leadtime-tbl">
              <div>
                {!getOutStandingOrdersMaterialReducerLoader &&
                getOutStandingOrdersMaterialData.length > 0 ? (
                  <ToolkitProvider
                    keyField="id"
                    data={getOutStandingOrdersMaterialData}
                    columns={matnr_action}
                    search={{
                      afterSearch: (newResult) => {
                        if (!newResult.length) {
                          setnewResultLength(newResult.length);
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
                            {getOutStandingOrdersMaterialData.length > 0 ? (
                              <Button
                                size="sm"
                                className="export-Btn ml-2 mr-2 float-right"
                                onClick={() => exportToCSVMaterialMatActionDDView()}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            ) : (
                              <Button
                                disabled
                                size="sm"
                                className="export-Btn ml-2 mr-2 float-right"
                                onClick={() => exportToCSVMaterialMatActionDDView()}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            )}

                            <SearchBar {...props.searchProps} />
                          </Col>
                        </Row>
                        <ReactDragListView.DragColumn
                          onDragEnd={(a, b) => onDragEndMatAction(a, b)}
                          nodeSelector="th">
                          <div>
                            <BootstrapTable
                              {...props.baseProps}
                              pagination={paginationFactory()}
                              noDataIndication={() => tblLoader()}
                              // filter={filterFactory()
                              // }
                            />
                          </div>
                        </ReactDragListView.DragColumn>
                      </div>
                    )}
                  </ToolkitProvider>
                ) : (
                  <>
                    {getOutStandingOrdersMaterialReducerLoader ? (
                      <div style={{ height: '520px' }}>
                        <ReusableSysncLoader />
                      </div>
                    ) : (
                      <div style={{ height: '520px' }}>
                        <NoDataTextLoader />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              {!getTotalQuantityAndCapexMaterialTrendReducerLoader &&
              getTotalQuantityAndCapexMaterialTrendData.length > 0 ? (
                <>
                  {' '}
                  <span className="HeadName">
                    {' '}
                    <i className="fas fa-chart-line mr-2" />
                    Material wise Outstanding Orders Trend
                  </span>
                  <div className="KpiDDCardLeadtime">
                    <Row>
                      <Col span={8} className="font-css">
                        {' '}
                        <span>LGORT : </span>
                        <span className="text-css">{action_lgort}</span>
                      </Col>
                      <Col span={8} className="font-css">
                        {' '}
                        <span>Capex : </span>
                        <span className="text-css">{calculation(action_capex)}</span>
                      </Col>{' '}
                      <Col span={8} className="font-css">
                        {' '}
                        <span>Quantity : </span>
                        <span className="text-css">{action_qty}</span>
                      </Col>
                    </Row>
                  </div>
                  <div className="head-title mb-20">
                    {' '}
                    <Button
                      size="sm"
                      className="export-Btn ml-2 mr-2 float-right "
                      onClick={exportToCSVMatnrTrend}>
                      <i className="fas fa-file-excel" />
                    </Button>
                    <Button
                      size="sm"
                      className="export-Btn ml-2 mr-2 float-right"
                      onClick={() =>
                        exportComponentAsPNG(exportMatnrTrend, `${action_name}-Open Orders Chart`)
                      }>
                      <i className="fas fa-image" />
                    </Button>
                  </div>
                  <div ref={exportMatnrTrend} className="OutstandingOrdersChart">
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart
                        data={getTotalQuantityAndCapexMaterialTrendData}
                        width="100%"
                        height={400}>
                        <XAxis
                          dataKey="DS"
                          angle={-40}
                          textAnchor="end"
                          height={150}
                          interval={0}
                          stroke="#B2B1B9"
                          tickFormatter={formatXAxis}>
                          {' '}
                          <Label
                            value="Date"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="centerBottom"
                          />
                        </XAxis>
                        <YAxis yAxisId="left" stroke="#B2B1B9" tickFormatter={calculation}>
                          <Label
                            value="Capex"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideLeft"
                          />
                        </YAxis>
                        <YAxis yAxisId="right" orientation="right" stroke="#B2B1B9">
                          <Label
                            value="Quantity"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideRight"
                          />
                        </YAxis>
                        <Tooltip content={(e) => TooltipFormatLeadtimeMaterial(e)} />
                        <Legend
                          content={
                            <div className="float-left pl-40">
                              <Popover
                                placement="bottom"
                                content={<span>Click to Change the color </span>}>
                                <span className="clr">
                                  {/* <ColorPicker
                                    animation="slide-up"
                                    color={color1}
                                    onChange={changeHandler1}
                                    className="some-class"
                                  /> */}
                                  <span className="legend-cls"> - CapEx </span>
                                </span>
                                <span className="clr">
                                  {/* <ColorPicker
                                    animation="slide-up"
                                    color={color2}
                                    onChange={changeHandler2}
                                    className="some-class"
                                  /> */}
                                  <span className="legend-cls"> - Quantity </span>
                                </span>
                              </Popover>
                            </div>
                          }
                        />{' '}
                        <Bar yAxisId="left" dataKey="MON_CAPEX" fill={color1}></Bar>
                        <Line
                          yAxisId="right"
                          dataKey="MON_QTY"
                          // fill="#F1D00A"
                          dot={false}
                          strokeWidth={2}
                          stroke={color2}
                          strokeDasharray="5 5"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <>
                  {getTotalQuantityAndCapexMaterialTrendReducerLoader ? (
                    <div style={{ height: '520px' }}>
                      <ReusableSysncLoader />
                    </div>
                  ) : (
                    <div style={{ height: '520px' }}>
                      <NoDataTextLoader />
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
      </Modal>

      {/* manuf actionDDView */}

      <Modal
        style={{ top: 60 }}
        width="90%"
        footer={null}
        className="modal-turnover"
        visible={ManufAction}
        onCancel={onclickCloseManufAction}
        title={
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <i className="fas fa-chart-line mr-2" />
              Manufacturer - {action_name} {VendorName != '' ? <>{`- ${VendorName}`}</> : ''}
            </Col>
          </Row>
        }>
        <div>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="leadtime-tbl">
              <div>
                {!getOutStandingOrdersManufReducerLoader &&
                getOutStandingOrdersManufData.length > 0 ? (
                  <ToolkitProvider
                    keyField="id"
                    data={getOutStandingOrdersManufData}
                    columns={manuf_action}
                    search={{
                      afterSearch: (newResult) => {
                        if (!newResult.length) {
                          setnewResultLength(newResult.length);
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
                            {getOutStandingOrdersManufData.length > 0 ? (
                              <Button
                                size="sm"
                                className="export-Btn ml-2 mr-2 float-right"
                                onClick={() => exportToCSVMaterialManufActionDDView()}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            ) : (
                              <Button
                                disabled
                                size="sm"
                                className="export-Btn ml-2 mr-2 float-right"
                                onClick={() => exportToCSVMaterialManufActionDDView()}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            )}

                            <SearchBar {...props.searchProps} />
                          </Col>
                        </Row>
                        <ReactDragListView.DragColumn
                          onDragEnd={(a, b) => onDragEndmanuf_action(a, b)}
                          nodeSelector="th">
                          <div>
                            <BootstrapTable
                              {...props.baseProps}
                              pagination={paginationFactory()}
                              noDataIndication={() => tblLoader()}
                              // filter={filterFactory()
                              // }
                            />
                          </div>
                        </ReactDragListView.DragColumn>
                      </div>
                    )}
                  </ToolkitProvider>
                ) : (
                  <>
                    {getOutStandingOrdersManufReducerLoader ? (
                      <div style={{ height: '520px' }}>
                        <ReusableSysncLoader />
                      </div>
                    ) : (
                      <div style={{ height: '520px' }}>
                        <NoDataTextLoader />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              {!getTotalQuantityAndCapexManufTrendReducerLoader &&
              getTotalQuantityAndCapexManufTrendData.length > 0 ? (
                <>
                  <span className="HeadName">
                    {' '}
                    <i className="fas fa-chart-line mr-2" />
                    Manufacturer wise Outstanding Orders Trend
                  </span>
                  <div className="KpiDDCardLeadtime">
                    <Row>
                      <Col span={8} className="font-css">
                        {' '}
                        <span>LGORT : </span>
                        <span className="text-css">{action_lgort}</span>
                      </Col>
                      <Col span={8} className="font-css">
                        {' '}
                        <span>Capex : </span>
                        <span className="text-css">{calculation(action_capex)}</span>
                      </Col>{' '}
                      <Col span={8} className="font-css">
                        {' '}
                        <span>Quantity : </span>
                        <span className="text-css">{action_qty}</span>
                      </Col>
                    </Row>
                  </div>

                  <div className="head-title mb-20">
                    {' '}
                    <Button
                      size="sm"
                      className="export-Btn ml-2 mr-2 float-right "
                      onClick={exportToCSVManufTrend}>
                      <i className="fas fa-file-excel" />
                    </Button>
                    <Button
                      size="sm"
                      className="export-Btn ml-2 mr-2 float-right"
                      onClick={() =>
                        exportComponentAsPNG(exportManufTrend, `${VendorName}- Open Orders Chart`)
                      }>
                      <i className="fas fa-image" />
                    </Button>
                  </div>

                  <div ref={exportManufTrend} className="OutstandingOrdersChart">
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart
                        data={getTotalQuantityAndCapexManufTrendData}
                        width="100%"
                        height={400}>
                        <XAxis
                          dataKey="DS"
                          angle={-40}
                          textAnchor="end"
                          height={150}
                          interval={0}
                          stroke="#B2B1B9"
                          tickFormatter={formatXAxis}>
                          {' '}
                          <Label
                            value="Date"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="centerBottom"
                          />
                        </XAxis>
                        <YAxis yAxisId="left" stroke="#B2B1B9" tickFormatter={calculation}>
                          {' '}
                          <Label
                            value="Capex"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideLeft"
                          />
                        </YAxis>
                        <YAxis yAxisId="right" orientation="right" stroke="#B2B1B9">
                          {' '}
                          <Label
                            value="Quantity"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideRight"
                          />
                        </YAxis>
                        <Tooltip content={(e) => TooltipFormatLeadtimeMaterial(e)} />
                        <Legend
                          content={
                            <div className="float-left pl-40">
                              <Popover
                                placement="bottom"
                                content={<span>Click to Change the color </span>}>
                                <span className="clr">
                                  {/* <ColorPicker
                                    animation="slide-up"
                                    color={color1}
                                    onChange={changeHandler1}
                                    className="some-class"
                                  /> */}
                                  <span className="legend-cls"> - CapEx </span>
                                </span>
                                <span className="clr">
                                  {/* <ColorPicker
                                    animation="slide-up"
                                    color={color2}
                                    onChange={changeHandler2}
                                    className="some-class"
                                  /> */}
                                  <span className="legend-cls"> - Quantity </span>
                                </span>
                              </Popover>
                            </div>
                          }
                        />{' '}
                        <Bar yAxisId="left" dataKey="MON_CAPEX" fill={color1}></Bar>
                        <Line
                          yAxisId="right"
                          dataKey="MON_QTY"
                          // fill="#F1D00A"
                          dot={false}
                          strokeWidth={2}
                          stroke={color2}
                          strokeDasharray="5 5"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <>
                  {getTotalQuantityAndCapexManufTrendReducerLoader ? (
                    <div style={{ height: '520px' }}>
                      <ReusableSysncLoader />
                    </div>
                  ) : (
                    <div style={{ height: '520px' }}>
                      <NoDataTextLoader />
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
      </Modal>

      {/* manuf actionDDViewend */}

      {/* org actionDDView */}

      <Modal
        style={{ top: 60 }}
        width="90%"
        footer={null}
        className="modal-turnover"
        visible={OrgAction}
        onCancel={onclickCloseOrgAction}
        title={
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <i className="fas fa-chart-line mr-2" />
              Organization - {action_name}
            </Col>
          </Row>
        }>
        <div>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="leadtime-tbl">
              <div>
                {' '}
                {!getOutStandingOrdersOrgReducerLoader && getOutStandingOrdersOrgData.length > 0 ? (
                  <ToolkitProvider
                    keyField="id"
                    data={getOutStandingOrdersOrgData}
                    columns={org_action}
                    search={{
                      afterSearch: (newResult) => {
                        if (!newResult.length) {
                          setnewResultLength(newResult.length);
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
                            {getOutStandingOrdersOrgData.length > 0 ? (
                              <Button
                                size="sm"
                                className="export-Btn ml-2 mr-2 float-right"
                                onClick={() => exportToCSVorgActionDDView()}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            ) : (
                              <Button
                                disabled
                                size="sm"
                                className="export-Btn ml-2 mr-2 float-right"
                                onClick={() => exportToCSVorgActionDDView()}>
                                <i className="fas fa-file-excel" />
                              </Button>
                            )}

                            <SearchBar {...props.searchProps} />
                          </Col>
                        </Row>
                        <ReactDragListView.DragColumn
                          onDragEnd={(a, b) => onDragEndorg_action(a, b)}
                          nodeSelector="th">
                          <div>
                            <BootstrapTable
                              {...props.baseProps}
                              pagination={paginationFactory()}
                              noDataIndication={() => tblLoader()}
                              // filter={filterFactory()
                              // }
                            />
                          </div>
                        </ReactDragListView.DragColumn>
                      </div>
                    )}
                  </ToolkitProvider>
                ) : (
                  <>
                    {getOutStandingOrdersOrgReducerLoader ? (
                      <div style={{ height: '520px' }}>
                        <ReusableSysncLoader />
                      </div>
                    ) : (
                      <div style={{ height: '520px' }}>
                        <NoDataTextLoader />
                      </div>
                    )}
                  </>
                )}
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              {!getTotalQuantityAndCapexOrgTrendReducerLoader &&
              getTotalQuantityAndCapexOrgTrendData.length > 0 ? (
                <>
                  <span className="HeadName">
                    {' '}
                    <i className="fas fa-chart-line mr-2" />
                    Organization wise Outstanding Orders Trend
                  </span>
                  <div className="KpiDDCardLeadtime">
                    <Row>
                      <Col span={8} className="font-css">
                        {' '}
                        <span>LGORT : </span>
                        <span className="text-css">{action_lgort}</span>
                      </Col>
                      <Col span={8} className="font-css">
                        {' '}
                        <span>Capex : </span>
                        <span className="text-css">{calculation(action_capex)}</span>
                      </Col>{' '}
                      <Col span={8} className="font-css">
                        {' '}
                        <span>Quantity : </span>
                        <span className="text-css">{action_qty}</span>
                      </Col>
                    </Row>
                  </div>

                  <div className="head-title mb-20">
                    {' '}
                    <Button
                      size="sm"
                      className="export-Btn ml-2 mr-2 float-right "
                      onClick={exportToCSVOrgTrend}>
                      <i className="fas fa-file-excel" />
                    </Button>
                    <Button
                      size="sm"
                      className="export-Btn ml-2 mr-2 float-right"
                      onClick={() =>
                        exportComponentAsPNG(exportORGTrend, `${action_name}-Open Orders Chart`)
                      }>
                      <i className="fas fa-image" />
                    </Button>
                  </div>

                  <div ref={exportORGTrend} className="OutstandingOrdersChart">
                    <ResponsiveContainer width="100%" height={400}>
                      <ComposedChart
                        data={getTotalQuantityAndCapexOrgTrendData}
                        width="100%"
                        height={400}>
                        <XAxis
                          dataKey="DS"
                          angle={-40}
                          textAnchor="end"
                          height={150}
                          interval={0}
                          stroke="#B2B1B9"
                          tickFormatter={formatXAxis}>
                          {' '}
                          <Label
                            value="Date"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="centerBottom"
                          />
                        </XAxis>
                        <YAxis yAxisId="left" stroke="#B2B1B9" tickFormatter={calculation}>
                          {' '}
                          <Label
                            value="Capex"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideLeft"
                          />
                        </YAxis>
                        <YAxis yAxisId="right" orientation="right" stroke="#B2B1B9">
                          {' '}
                          <Label
                            value="Quantity"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideRight"
                          />
                        </YAxis>
                        <Tooltip content={(e) => TooltipFormatLeadtimeMaterial(e)} />
                        <Legend
                          content={
                            <div className="float-left pl-40">
                              <Popover
                                placement="bottom"
                                content={<span>Click to Change the color </span>}>
                                <span className="clr">
                                  {/* <ColorPicker
                                    animation="slide-up"
                                    color={color1}
                                    onChange={changeHandler1}
                                    className="some-class"
                                  /> */}
                                  <span className="legend-cls"> - CapEx </span>
                                </span>
                                <span className="clr">
                                  {/* <ColorPicker
                                    animation="slide-up"
                                    color={color2}
                                    onChange={changeHandler2}
                                    className="some-class"
                                  /> */}
                                  <span className="legend-cls"> - Quantity </span>
                                </span>
                              </Popover>
                            </div>
                          }
                        />{' '}
                        <Bar yAxisId="left" dataKey="MON_CAPEX" fill={color1}></Bar>
                        <Line
                          yAxisId="right"
                          dataKey="MON_QTY"
                          // fill="#F1D00A"
                          dot={false}
                          strokeWidth={2}
                          stroke={color2}
                          strokeDasharray="5 5"
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </div>
                </>
              ) : (
                <>
                  {getTotalQuantityAndCapexOrgTrendReducerLoader ? (
                    <div style={{ height: '520px' }}>
                      <ReusableSysncLoader />
                    </div>
                  ) : (
                    <div style={{ height: '520px' }}>
                      <NoDataTextLoader />
                    </div>
                  )}
                </>
              )}
            </Col>
          </Row>
        </div>
      </Modal>

      {/* org actionDDViewend  */}

      {/* main view card */}
      <Modal
        style={{ top: 60 }}
        width="75%"
        footer={null}
        className="modal-turnover"
        visible={Mainview}
        onCancel={HandleMainViewDD}
        title={
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <i className="fas fa-chart-line mr-2" />
              Outstanding Orders Trend
            </Col>
          </Row>
        }>
        <Row className="mt-2 v4">
          <div className="head-title mb-20">
            {' '}
            <Button
              size="sm"
              className="export-Btn ml-2 mr-2 float-right "
              onClick={exportToCSVTrend}>
              <i className="fas fa-file-excel" />
            </Button>
            <Button
              size="sm"
              className="export-Btn ml-2 mr-2 float-right"
              onClick={() =>
                exportComponentAsPNG(OutStandingOrderView, 'Outstanding Orders Trend')
              }>
              <i className="fas fa-image" />
            </Button>
          </div>

          <div ref={OutStandingOrderView} className="OutstandingOrdersChart">
            <ResponsiveContainer height={400} width="100%">
              <ComposedChart
                data={TotalQuantityAndCapexData}
                width="100%"
                height={300}
                margin={{
                  top: 10,
                  right: 30,
                  left: 30,
                  bottom: 20
                }}
                onClick={(val) => {
                  if (val != null) {
                    HandleOpenOverAllViewDD(val);
                  }
                }}>
                <XAxis
                  dataKey="DS"
                  angle={-40}
                  textAnchor="end"
                  height={150}
                  interval={0}
                  stroke="#B2B1B9"
                  tickFormatter={formatXAxis}>
                  {' '}
                  <Label
                    value="Date"
                    dy={5}
                    style={{ textAnchor: 'middle', fill: '#fff' }}
                    position="centerBottom"
                  />
                </XAxis>
                <YAxis yAxisId="left" stroke="#B2B1B9" tickFormatter={calculation}>
                  <Label
                    dx={-15}
                    value="Capex"
                    angle="-90"
                    style={{ textAnchor: 'middle', fill: '#fff' }}
                    position="insideLeft"
                  />
                </YAxis>
                <YAxis yAxisId="right" orientation="right" stroke="#B2B1B9">
                  <Label
                    dx={5}
                    value="Quantity"
                    angle="-90"
                    style={{ textAnchor: 'middle', fill: '#fff' }}
                    position="insideRight"></Label>
                </YAxis>
                <Tooltip content={(e) => TooltipFormatLeadtimeMaterial(e)} />
                <Legend
                  content={
                    <div className="float-left pl-40">
                      <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                        <span className="clr">
                          {/* <ColorPicker
                            animation="slide-up"
                            color={color1}
                            onChange={changeHandler1}
                            className="some-class"
                          /> */}
                          <span className="legend-cls"> - CapEx </span>
                        </span>
                        <span className="clr">
                          {/* <ColorPicker
                            animation="slide-up"
                            color={localStorage.getItem('theme') === 'White' ? '#ee0c2d' : color2}
                            onChange={changeHandler2}
                            className="some-class"
                          /> */}
                          <span className="legend-cls"> - Quantity </span>
                        </span>
                      </Popover>
                    </div>
                  }
                />{' '}
                <Bar
                  yAxisId="left"
                  dataKey="MON_CAPEX"
                  fill={color1}
                  onClick={(val) => HandleOpenOverAllViewDD(val)}
                  radius={[5, 5, 0, 0]}></Bar>
                <Line
                  yAxisId="right"
                  dataKey="MON_QTY"
                  stroke={localStorage.getItem('theme') === 'White' ? '#ee0c2d' : color2}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Row>
      </Modal>

      {/* //tab modal */}
      <Modal
        width="80%"
        footer={null}
        className="modal-turnover"
        visible={ModalVisible}
        onCancel={handleModal}
        title={
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <span className="float-left mr-2 cls">
                <i className="fas fa-cubes"></i>
              </span>
              <span className="tab-head">Outstanding Orders</span>
            </Col>
          </Row>
        }>
        <Tabs defaultActiveKey={'1'} activeKey={activekey} onChange={HandleSetActiveKey}>
          <TabPane tab="Material" key="1">
            <div>
              {' '}
              {TotalCapexForMaterialData[0] != 'data' ? (
                <ToolkitProvider
                  keyField="id"
                  data={TotalCapexForMaterialData}
                  columns={mat_tbl_col}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        setnewResultLength(newResult.length);
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {TotalCapexForMaterialData[0] != 'data' ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => exportToCSVMaterial()}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => exportToCSVMaterial()}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}

                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={(a, b) => onDragEnd(a, b)}
                        nodeSelector="th">
                        <div>
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
                            noDataIndication={() => tblLoader()}
                            // filter={filterFactory()
                            // }
                          />
                        </div>
                      </ReactDragListView.DragColumn>
                    </div>
                  )}
                </ToolkitProvider>
              ) : (
                <DummyTable column={mat_tbl_col} />
              )}
            </div>
          </TabPane>
          <TabPane tab="Manufacturer" key="2">
            <div>
              {TotalCapexForManufacturerData[0] != 'data' ? (
                <ToolkitProvider
                  keyField="id"
                  data={TotalCapexForManufacturerData}
                  columns={manuf_tbl_col}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        setnewResultLength(newResult.length);
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {TotalCapexForManufacturerData[0] != 'data' ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => exportToCSVManufacturer()}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => exportToCSVManufacturer()}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}

                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={(a, b) => onDragEndManuf(a, b)}
                        nodeSelector="th">
                        <div>
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
                            noDataIndication={() => tblLoader()}
                            filter={filterFactory()}
                          />
                        </div>
                      </ReactDragListView.DragColumn>
                    </div>
                  )}
                </ToolkitProvider>
              ) : (
                <DummyTable column={manuf_tbl_col} />
              )}
            </div>
          </TabPane>
          <TabPane tab="Organization" key="3">
            <div>
              {TotalCapexForOrganizationData[0] != 'data' ? (
                <ToolkitProvider
                  keyField="id"
                  data={TotalCapexForOrganizationData}
                  columns={org_tbl_col}
                  search={{
                    afterSearch: (newResult) => {
                      if (!newResult.length) {
                        setnewResultLength(newResult.length);
                      }
                    }
                  }}>
                  {(props) => (
                    <div>
                      <Row className="mb-1">
                        <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                        <Col
                          xs={12}
                          sm={12}
                          md={12}
                          lg={12}
                          xl={12}
                          className="float-right search-right">
                          {TotalCapexForOrganizationData[0] != 'data' ? (
                            <Button
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => exportToCSVOrganization()}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          ) : (
                            <Button
                              disabled
                              size="sm"
                              className="export-Btn ml-2 mr-2 float-right"
                              onClick={() => exportToCSVOrganization()}>
                              <i className="fas fa-file-excel" />
                            </Button>
                          )}

                          <SearchBar {...props.searchProps} />
                        </Col>
                      </Row>
                      <ReactDragListView.DragColumn
                        onDragEnd={(a, b) => onDragEndorg(a, b)}
                        nodeSelector="th">
                        <div>
                          <BootstrapTable
                            {...props.baseProps}
                            pagination={paginationFactory(pageoptions)}
                            noDataIndication={() => tblLoader()}
                            filter={filterFactory()}
                          />
                        </div>
                      </ReactDragListView.DragColumn>
                    </div>
                  )}
                </ToolkitProvider>
              ) : (
                <DummyTable column={org_tbl_col} />
              )}
            </div>
          </TabPane>
        </Tabs>
        {/* </Card> */}
      </Modal>
    </div>
  );
};
