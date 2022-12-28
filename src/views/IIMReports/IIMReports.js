import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Layout, TreeSelect } from 'antd';
import {
  getBulkExport,
  UpdatePage,
  getBulkExportColNames,
  UpdateSizePerPage,
  UpdateSearchValue,
  UpdateSorting,
  InitialpageRender,
  getBulkExcelExportBlob,
  ClearUpdateSearchValue
} from '../../actions';
import ChatBot from '../DashBoard/ChatBot';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { customFilter } from 'react-bootstrap-table2-filter';
import { materialDD } from './DynamicColFormatter';

import { CAPGOV_REPORT_COL, Capgov_request_Col, FORECAST_OVERWRITE_COL } from './IIMReportsCol';
import ReusableInfoModal from '../ReusableComponent/ReusableInfoModal ';
import CutomTable from '../ReusableComponent/CutomTable';

import { costformat } from './IIMReportsCol';
// eslint-disable-next-line no-unused-vars
import CustomFilterField from './CustomFilterField';

const { Footer } = Layout;
const { TreeNode } = TreeSelect;
const CapGov_Request_Info = (
  <div>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Install Base
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Total items installed in the field
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Harvest Universe
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Universe of Opportunities that has potential to be Harvested
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Open Harvest Quantity
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Total quantity of items open harvest state
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Harvested Quantity
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Total quantity harvested through harvest process in past 12 months
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        ERT Quantity
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Total quantity harvested through ERT process in past 12 months
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Redeployed value
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Value of Used parts consumption in past 12 months
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Warehouse on hand
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Current inventory quantity
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Current Vendor On Order
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Open order Quantity
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Leadtime Demand
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Forecast quantity for next leadtime
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Gross New Need
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Leadtime Demand - (Warehouse on hand + Current Vendor On Order)
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Safety stock Adjust
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Safety stock Quantity
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Net New Need
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Gross New Need + Safety stock Adjust
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Cap gov request
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Net New Need * Unit price
      </Col>
    </Row>
  </div>
);

const Stock_Visualization_Info = (
  <div>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={24} className="float-left pl-3">
        <span className="font-16">Ending On Hand:</span>
        <p>
          <ul className="ml-3">
            <li>
              Monthly ending on hand quantity for materials. We try to maintain Ending on Hand as
              Safety Stock.
            </li>
            <span className="desc-formula">
              {' '}
              Ending on Hand = (Last Month Ending on Hand + Current Month Open PO + Recommended PO +
              Current Inventory) - Current Month Forecast
            </span>
          </ul>
        </p>
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={24} className="float-left pl-3">
        <span className="font-16">Safety Stock On Hand:</span>
        <p>
          <ul className="ml-3">
            <li>
              {' '}
              <span className="desc-formula">
                {' '}
                Safety stock on hand = Ending On Hand/Safety Stock
              </span>
            </li>
          </ul>
        </p>
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={24} className="float-left pl-3">
        <span className="font-16">Forecast:</span>
        <p>
          <ul className="ml-3">
            <li>
              BO distribution : open back orders quantity distributed on the forecast, based on
              historical back orders delivery
            </li>
            <br />

            <li>
              <span>When an overwritten forecast is available:</span> <br />
              <span className="desc-formula ml-2">Forecast = overwritten forecast</span>
            </li>
            <br />

            <li>
              <span>When an overwritten forecast is not available:</span> <br />
              <span className="desc-formula ml-2"> Forecast = iIM Forecast + BO distribution</span>
            </li>
          </ul>
        </p>
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={24} className="float-left pl-3">
        <span className="font-16">Current on orders:</span>
        <p>
          {' '}
          <ul className="ml-3">
            <li>Open orders Quantity</li>
          </ul>
        </p>
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={24} className="float-left pl-3">
        <span className="font-16">Recommended New Order:</span>
        <p>
          <ul className="ml-3">
            <li>
              {' '}
              Monthly quantity to order recommendation based on demand forecast, inventory and place
              POs
            </li>
            <br />
            <li>
              {' '}
              <span>When Current month Ending on Hand &#62; Safety Stock:</span>
              <br />
              <span className="desc-formula">Quantity to Order = 0</span>
            </li>
            <br />
            <li>
              {' '}
              <span>When Current month Ending on Hand &#60; Safety Stock:</span>
              <br />
              <span className="desc-formula">
                Quantity to Order = (Current Month Forecast + Safety Stock) - (Last Month Ending on
                Hand + Current Month Open PO + Current Inventory)
              </span>
            </li>
          </ul>
        </p>
      </Col>
    </Row>
  </div>
);

const Inventory_Info = (
  <div>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        NEW
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        New Inventory Quantity
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        USED
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Used Inventory Quantity
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        TTL_AVAIL_QTY
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        NEW Inventory + USED Inventory
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        New_%
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        NEW / TTL_AVAIL_QTY × 100
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        TTL_PO_QTY
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Total Open Orders Quantity
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        BO_QTY
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Total Back Orders Quantity
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Deliveries
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Quantity of open orders to be delivered within a specific month
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        Forecast
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Forecast quantity in a given month
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        EOH(Ending on Hand)
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        (Last Month EOH + Current Month Deliveries + TTL_AVAIL_QTY) - (Current Month Forecast +
        BO_QTY)
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        EOH_$
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        EOH × New_% × CURRENT_PRICE
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        USED_INV_EOH
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        Last Month Used Inventory EOH - (Current Month Forecast + BO_QTY)
      </Col>
    </Row>
    <Row gutter={16} className="mt-2 mb-2 font-14">
      <Col span={8} className="float-left pl-3">
        NEW_INV_EOH
      </Col>
      <Col span={2} className="text-center">
        -
      </Col>
      <Col span={14} className="float-right">
        After the used inventory has been completely consumed, the new inventory will begin to be
        consumed. The NEW_INV_EOH will be calculated accordingly.
      </Col>
    </Row>
  </div>
);

const IIMReports = () => {
  const dispatch = useDispatch();
  const [selectValue, setselectValue] = useState('CapGov Request');
  const [Usercuid, setUsercuid] = useState(false);
  const [Org, setOrg] = useState('All');
  const [LGORT, setLGORT] = useState(false);
  const [Indicator, setIndicator] = useState(false);
  const [sortField, setsortField] = useState('');
  const [sortOrder, setsortOrder] = useState('');
  const [Columns, setColumns] = useState([{ text: '' }]);
  const ChatBotTogglerData = useSelector((state) => state.ChatBotToggler.ChatBotToggler);
  const { PageCount, TableData } = useSelector((state) => state.getBulkExport);
  const getBulkExportReducerLoader = useSelector((state) => state.getBulkExportReducerLoader);
  const getUserImpersonationDetailsData = useSelector((state) => state.getUserImpersonationDetails);
  const UpdatePageData = useSelector((state) => state.UpdatePage.Page);
  const UpdateSizePerPageData = useSelector((state) => state.UpdateSizePerPage.SizePerPage);
  const UpdateSortingData = useSelector((state) => state.UpdateSorting);
  const UpdateSearchValueData = useSelector((state) => state.UpdateSearchValue.SearchValue);

  useEffect(() => {
    setsortField(UpdateSortingData.sortField);
    setsortOrder(UpdateSortingData.sortOrder);
  }, [UpdateSortingData]);
  // useEffect(() => {
  //   if (UpdateSearchValueData.length > 0) {
  //     dispatch(
  //       getBulkExport(
  //         selectValue == 'CapGov Request'
  //           ? 'Capgov_request'
  //           : selectValue == 'Stock Visualization'
  //           ? 'CAPGOV_REPORT'
  //           : selectValue == 'Forecast'
  //           ? 'FORECAST_OVERWRITE'
  //           : selectValue == 'Inventory Balances'
  //           ? 'INVENTORY_BALANCES'
  //           : '',
  //         Org,
  //         LGORT,
  //         Indicator,
  //         sortField + ' ' + sortOrder,
  //         UpdatePageData,
  //         UpdateSizePerPageData,
  //         UpdateSearchValueData,
  //         'N',
  //         getBulkExportDataLoader
  //       )
  //     );
  //   }
  // }, [UpdateSearchValueData]);
  // useEffect(() => {}, []);
  //action to empty the State
  const getBulkExportDataLoader = () => {
    dispatch({
      type: 'getBulkExport',
      payload: { data: JSON.stringify({ Table: [{ TOTAL_COUNT: 0 }], Table1: [] }) }
    });
  };
  const handleReportChange = (value) => {
    setselectValue(value);
    setColumns([{ text: '' }]);
    if (value === 'CapGov Request') {
      dispatch(UpdateSearchValue([]));
      dispatch(getBulkExportColNames('Cap_Gov_Request'));
      dispatch(UpdatePage(1));
      dispatch(InitialpageRender('Capgov_request'));
      dispatch(UpdateSizePerPage(10));
      dispatch(UpdateSorting('Cap_Gov_Request', 'DESC'));
      dispatch(ClearUpdateSearchValue());
      dispatch(
        getBulkExport(
          Usercuid,
          LGORT,
          Indicator,
          'Capgov_request',
          'Cap_Gov_Request DESC',
          '1',
          '10',
          [],

          getBulkExportDataLoader
        )
      );
    } else if (value === 'Stock Visualization') {
      dispatch(UpdatePage(1));
      dispatch(InitialpageRender('CAPGOV_REPORT'));
      dispatch(UpdateSearchValue([]));
      dispatch(UpdateSizePerPage(10));
      dispatch(UpdateSorting('MATERIAL,LGORT,DATE', 'ASC'));
      dispatch(ClearUpdateSearchValue());
      dispatch(getBulkExportColNames('CAPGOV_REPORT'));
      dispatch(
        getBulkExport(
          Usercuid,
          LGORT,
          Indicator,
          'CAPGOV_REPORT',

          'MATERIAL,LGORT,DATE ASC',
          '1',
          '10',
          [],

          getBulkExportDataLoader
        )
      );
    } else if (value === 'Forecast') {
      dispatch(UpdatePage(1));
      dispatch(InitialpageRender('FORECAST_OVERWRITE'));
      dispatch(UpdateSearchValue([]));
      dispatch(UpdateSizePerPage(10));
      dispatch(UpdateSorting('MATERIAL,LGORT,DATE', 'ASC'));
      dispatch(ClearUpdateSearchValue());
      dispatch(getBulkExportColNames('FORECAST_OVERWRITE'));
      dispatch(
        getBulkExport(
          Usercuid,
          LGORT,
          Indicator,
          'FORECAST_OVERWRITE',

          'MATERIAL,LGORT,DATE ASC',
          '1',
          '10',
          [],

          getBulkExportDataLoader
        )
      );
    } else if (value === 'Inventory Balances') {
      dispatch(UpdatePage(1));
      dispatch(InitialpageRender('INVENTORY_BALANCES'));
      dispatch(UpdateSearchValue([]));
      dispatch(UpdateSizePerPage(10));
      dispatch(UpdateSorting('MATERIAL', 'ASC'));
      dispatch(ClearUpdateSearchValue());
      dispatch(getBulkExportColNames('INVENTORY_BALANCES'));
      dispatch(getBulkExcelExportBlob());
      dispatch(
        getBulkExport(
          Usercuid,
          LGORT,
          Indicator,
          'INVENTORY_BALANCES',

          'MATERIAL ASC',
          '1',
          '10',
          [],

          getBulkExportDataLoader
        )
      );
    }
  };
  useEffect(() => {
    // setselectValue('CapGov Request');
    if (getUserImpersonationDetailsData.length > 0) {
      let data = JSON.parse(getUserImpersonationDetailsData[0].FilterSetting);

      setLGORT(data[0].LGORT);
      setOrg(data[0].Organization);
      setIndicator(data[0].BlockedDeleted);
      setUsercuid(getUserImpersonationDetailsData.map((data) => data.loggedcuid));
    }
  }, [getUserImpersonationDetailsData]);
  //sort func
  const HandleSort = (sortField, sortOrder) => {
    dispatch(UpdateSorting(sortField, sortOrder));
    if (!Usercuid || !LGORT || !Indicator) return;

    dispatch(
      getBulkExport(
        Usercuid,
        LGORT,
        Indicator,
        selectValue == 'CapGov Request'
          ? 'Capgov_request'
          : selectValue == 'Stock Visualization'
          ? 'CAPGOV_REPORT'
          : selectValue == 'Forecast'
          ? 'FORECAST_OVERWRITE'
          : selectValue == 'Inventory Balances'
          ? 'INVENTORY_BALANCES'
          : '',

        sortField + ' ' + sortOrder,
        UpdatePageData,
        UpdateSizePerPageData,
        UpdateSearchValueData,

        getBulkExportDataLoader
      )
    );
  };

  useEffect(() => {
    if (selectValue === 'Inventory Balances') {
      if (TableData[0] != undefined) {
        let value = TableData[0];
        var tblColumns = Object.keys(value).map((data) => {
          if (data === 'MATERIAL') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              headerStyle: { width: 120 },
              formatter: materialDD,
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              onSort: (field, order) => {
                HandleSort(field, order);
              },

              align: 'center',
              headerAlign: 'center'
            };
            return dataField;
          } else if (data === 'ORGANIZATION') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'left',
              headerAlign: 'left',
              headerStyle: { width: 200 }
            };
            return dataField;
          } else if (data === 'MANUFACTURER') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'left',
              headerAlign: 'left',
              headerStyle: { width: 200 }
            };
            return dataField;
          } else if (data === 'CURRENT PRICE') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'right',
              headerAlign: 'right',
              formatter: costformat,
              headerStyle: { width: 145 }
            };
            return dataField;
          } else if (data === 'MPN') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'left',
              headerAlign: 'left',
              headerStyle: { width: 140 }
            };
            return dataField;
          } else if (data === 'TTL AVAIL QTY ') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 120 }
            };
            return dataField;
          } else if (data === 'NEW') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 100 }
            };
            return dataField;
          } else if (data === 'NEW %') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 100 }
            };
            return dataField;
          } else if (data === 'USED') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 100 }
            };
            return dataField;
          } else if (data === 'TTL PO QTY') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 120 }
            };
            return dataField;
          } else if (data === 'BO QTY') {
            let dataField = {
              dataField: data,
              text: data,
              sort: true,
              onSort: (field, order) => {
                HandleSort(field, order);
              },
              // filter: customFilter(),
              // filterRenderer: (onFilter, column) => (
              //   <CustomFilterField onFilter={onFilter} column={column} />
              // ),
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 100 }
            };
            return dataField;
          } else if (data === 'DESCRIPTION') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'STK_TYPE') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'HECI') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'LVLT_STOCKOUT_FLAG') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else if (data === 'CTL_STOCKOUT_FLAG') {
            let dataField = {
              align: 'left'
            };
            return dataField;
          } else {
            if (data.includes('EOH $')) {
              let dataField = {
                dataField: data,
                text: data,
                sort: true,
                formatter: costformat,
                onSort: (field, order) => {
                  HandleSort(field, order);
                },
                // filter: customFilter(),
                // filterRenderer: (onFilter, column) => (
                //   <CustomFilterField onFilter={onFilter} column={column} />
                // ),
                headerStyle: {
                  width:
                    data.length < 13
                      ? data.length * 10
                      : data.length < 14
                      ? data.length * 15
                      : data.length * 10
                },
                align: 'right',
                headerAlign: 'right'
              };
              return dataField;
            } else {
              let dataField = {
                dataField: data,
                text: data,
                sort: true,
                onSort: (field, order) => {
                  HandleSort(field, order);
                },
                // filter: customFilter(),
                // filterRenderer: (onFilter, column) => (
                //   <CustomFilterField onFilter={onFilter} column={column} />
                // ),
                headerStyle: {
                  width:
                    data.length < 13
                      ? data.length * 8
                      : data.length < 14
                      ? data.length * 11
                      : data.length * 7
                },
                align: 'right',
                headerAlign: 'right'
              };
              return dataField;
            }
          }
        });
        setColumns(tblColumns);
      }
    } else if (selectValue === 'Stock Visualization') {
      setColumns(
        CAPGOV_REPORT_COL.map((d) => {
          const resp = {
            ...d,
            onSort: (field, order) => {
              HandleSort(field, order);
            }
            // filter: customFilter(),
            // filterRenderer: (onFilter, column) => (
            //   <CustomFilterField onFilter={onFilter} column={column} />
            // )
          };
          return resp;
        })
      );
    } else if (selectValue === 'Forecast') {
      setColumns(
        FORECAST_OVERWRITE_COL.map((d) => {
          const resp = {
            ...d,
            onSort: (field, order) => {
              HandleSort(field, order);
            }
            // filter: customFilter(),
            // filterRenderer: (onFilter, column) => (
            //   <CustomFilterField onFilter={onFilter} column={column} />
            // )
          };
          return resp;
        })
      );
    } else if (selectValue === 'CapGov Request') {
      setColumns(
        Capgov_request_Col.map((d) => {
          const resp = {
            ...d,
            onSort: (field, order) => {
              HandleSort(field, order);
            }
            // filter: customFilter(),
            // filterRenderer: (onFilter, column) => (
            //   <CustomFilterField onFilter={onFilter} column={column} />
            // )
          };
          return resp;
        })
      );
    }
  }, [TableData]);

  return (
    <>
      <div className="animated fadeIn">
        <div className="scroll-set-body">
          <div className="pr-2 pl-1 materialReport">
            <div className="stick-top">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card className="Material-Report-header">
                    <Row>
                      <Col span={24}>
                        <span className="tblHeader">
                          {' '}
                          <i className="fad fa-sitemap mr-2" /> Bulk Export
                        </span>
                        <span className="float-right mr-4">
                          <span className="font-18"> Search : &nbsp;&nbsp;</span>

                          <TreeSelect
                            showSearch
                            style={{ width: '250px', fontSize: 15, color: 'white' }}
                            className="float-right chart-select mr-1"
                            allowClear={false}
                            treeDefaultExpandAll
                            getPopupContainer={(trigger) => trigger.parentNode}
                            value={selectValue}
                            loading={getBulkExportReducerLoader}
                            onChange={handleReportChange}>
                            <>
                              {/* *********Disiabled select DropDown loaders***************** */}
                              {/* {!getBulkExportReducerLoader ? ( */}
                              <>
                                {' '}
                                <TreeNode title="CapGov Request" value="CapGov Request">
                                  CapGov Request
                                </TreeNode>
                                <TreeNode title="Stock Visualization" value="Stock Visualization">
                                  Stock Visualization
                                </TreeNode>
                                <TreeNode title="Forecast" value="Forecast">
                                  Forecast
                                </TreeNode>
                                <TreeNode title="Inventory Balances" value="Inventory Balances">
                                  Inventory Balances
                                </TreeNode>
                              </>
                              {/* ) : (
                                <></>
                              )} */}
                            </>
                          </TreeSelect>
                        </span>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  <>
                    {selectValue === 'CapGov Request' ? (
                      <>
                        <CutomTable
                          EmptyAction={getBulkExportDataLoader}
                          Loader={getBulkExportReducerLoader}
                          SearchValue={UpdateSearchValueData}
                          sortField={sortField}
                          sortOrder={sortOrder}
                          view={selectValue}
                          TableData={TableData}
                          Org={Org}
                          Page={UpdatePageData}
                          SizePerPage={UpdateSizePerPageData}
                          Ind={Indicator}
                          LGORT={LGORT}
                          cuid={Usercuid}
                          PageCount={PageCount}
                          TableColumn={Columns}
                          fileName={`CapGov Request`}
                          HeaderTitle={
                            <span className="tblHeader">
                              {' '}
                              <i className="fad fa-table ml-2 mr-2 "></i>CapGov Request{' '}
                              <span className="ml-2">
                                <ReusableInfoModal
                                  title={'CapGov Request'}
                                  width="50%"
                                  content={CapGov_Request_Info}
                                />
                              </span>
                            </span>
                          }
                        />
                      </>
                    ) : (
                      <>
                        {selectValue === 'Stock Visualization' ? (
                          <>
                            {' '}
                            <CutomTable
                              EmptyAction={getBulkExportDataLoader}
                              SearchValue={UpdateSearchValueData}
                              Loader={getBulkExportReducerLoader}
                              sortField={sortField}
                              sortOrder={sortOrder}
                              TableData={TableData}
                              TableColumn={Columns}
                              Page={UpdatePageData}
                              SizePerPage={UpdateSizePerPageData}
                              view={selectValue}
                              Org={Org}
                              Ind={Indicator}
                              LGORT={LGORT}
                              cuid={Usercuid}
                              PageCount={PageCount}
                              fileName={`Stock Visualization`}
                              HeaderTitle={
                                <span className="tblHeader">
                                  {' '}
                                  <i className="fad fa-table ml-2 mr-2"></i>Stock Visualization{' '}
                                  <span className="ml-2">
                                    <ReusableInfoModal
                                      title={'Stock Visualization'}
                                      width="50%"
                                      content={Stock_Visualization_Info}
                                    />
                                  </span>
                                </span>
                              }
                            />
                          </>
                        ) : (
                          <>
                            {selectValue === 'Forecast' ? (
                              <>
                                <CutomTable
                                  EmptyAction={getBulkExportDataLoader}
                                  SearchValue={UpdateSearchValueData}
                                  Loader={getBulkExportReducerLoader}
                                  sortField={sortField}
                                  sortOrder={sortOrder}
                                  TableData={TableData}
                                  view={selectValue}
                                  Page={UpdatePageData}
                                  SizePerPage={UpdateSizePerPageData}
                                  Org={Org}
                                  Ind={Indicator}
                                  LGORT={LGORT}
                                  cuid={Usercuid}
                                  PageCount={PageCount}
                                  TableColumn={Columns}
                                  fileName={`Forecast`}
                                  HeaderTitle={
                                    <span className="tblHeader">
                                      {' '}
                                      <i className="fad fa-table ml-2 mr-2"></i>Forecast{' '}
                                      {/* <span className="ml-2">
                                          <ReusableInfoModal
                                            title={'Forecast'}
                                            width="50%"
                                            content={Forecast_Info}
                                          />
                                        </span> */}
                                    </span>
                                  }
                                />
                              </>
                            ) : (
                              <>
                                {selectValue === 'Inventory Balances' ? (
                                  <>
                                    {Columns.length > 0 ? (
                                      <>
                                        <CutomTable
                                          EmptyAction={getBulkExportDataLoader}
                                          SearchValue={UpdateSearchValueData}
                                          Loader={getBulkExportReducerLoader}
                                          sortField={sortField}
                                          sortOrder={sortOrder}
                                          TableData={TableData}
                                          view={selectValue}
                                          Page={UpdatePageData}
                                          SizePerPage={UpdateSizePerPageData}
                                          Org={Org}
                                          Ind={Indicator}
                                          LGORT={LGORT}
                                          cuid={Usercuid}
                                          PageCount={PageCount}
                                          TableColumn={Columns}
                                          fileName={`Inventory Balances`}
                                          HeaderTitle={
                                            <span className="tblHeader">
                                              {' '}
                                              <i className="fad fa-table ml-2 mr-2"></i>Inventory
                                              Balances{' '}
                                              <span className="ml-2">
                                                <ReusableInfoModal
                                                  title={'Inventory Balances'}
                                                  width="50%"
                                                  content={Inventory_Info}
                                                />
                                              </span>
                                            </span>
                                          }
                                        />
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </>
                                ) : (
                                  <></>
                                )}
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </>
                </Card>
              </Col>
            </Row>
          </div>
          <Row>{ChatBotTogglerData ? <ChatBot /> : ''}</Row>
          <div>
            <Footer style={{ textAlign: 'center', bottom: '0' }}>
              <span className="Footer-logo" />
            </Footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default IIMReports;
