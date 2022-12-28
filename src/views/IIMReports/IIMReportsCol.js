import React from 'react';
import moment from 'moment';
import { Popover } from 'antd';
export const costformat = (cell) => {
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
};
export const materialDD = (cell, row) => {
  return (
    <Popover
      placement="right"
      className="modal-tool-tip"
      content={
        <span>
          {row.description}
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
            <span className="heci-style">
              <br />
              HECI : &nbsp;
              {row.HECI}
            </span>
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
function nullFormatter(cell) {
  if (cell == null) {
    return <span>-</span>;
  } else {
    return <span>{cell}</span>;
  }
}
function dateformat(cell) {
  if (cell == null) {
    return <span>-</span>;
  } else {
    let value = moment(cell).format('MM-DD-YYYY');
    return <span>{value}</span>;
  }
}
function sortFuncDate(a, b, order) {
  if (order === 'asc') {
    return moment(a) - moment(b);
  } else if (order === 'desc') {
    return moment(b) - moment(a);
  }
}
function MM_YYYYdateformat(cell) {
  if (cell == null) {
    return <span>-</span>;
  } else {
    let value = moment(cell).format('MM-YYYY');
    return <span>{value}</span>;
  }
}
export const Capgov_request_Col = [
  {
    dataField: 'Material',
    text: 'Material',
    formatter: materialDD,
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
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'InstallBase',
    text: ' InstallBase ',
    sort: true,
    headerStyle: { width: 110 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Harvest_Universe',
    text: 'Harvest Universe',

    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Open_harverst_quantity',
    text: 'Open Harverst Quantity',

    sort: true,
    headerStyle: { width: 110 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Harvested_quantity',
    text: 'Harvested Quantity',

    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'ERT_QTY',
    text: 'ERT QTY',

    sort: true,
    headerStyle: { width: 110 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Redeployed_value',
    text: 'Redeployed Value',
    formatter: costformat,

    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Warehouse_On_Hand',
    text: 'Warehouse On Hand',

    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Current_Vendor_On_Order',
    text: 'Current Vendor On Order',

    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Leadtime_Demand',
    text: 'Leadtime Demand',

    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Gross_New_Need',
    text: 'Gross New Need',

    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Safety_stock_adjust',
    text: 'Safety Stock Adjust',

    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Net_New_Need',
    text: 'Net New Need',

    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Unit_Price',
    text: 'Unit Price',
    formatter: costformat,

    sort: true,
    headerStyle: { width: 110 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Cap_Gov_Request',
    text: 'CapGov Request',
    formatter: costformat,

    sort: true,
    headerStyle: { width: 150 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const CAPGOV_REPORT_COL = [
  {
    dataField: 'Material',
    formatter: materialDD,
    text: 'Material',
    sort: true,
    headerStyle: { width: 65 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 55 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'Date',
    text: ' Date ',
    sort: true,
    // sortFunc: sortFuncDate,
    formatter: MM_YYYYdateformat,

    headerStyle: { width: 60 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'Forecast(Units)',
    text: 'Forecast(Units)',

    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Current_On_Orders',
    text: 'Current On Orders',

    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Recommended_New_Order',
    text: 'Recommended New Order',

    sort: true,
    headerStyle: { width: 125 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Ending_on_hand(Units)',
    text: 'Ending On Hand (Units)',

    sort: true,
    headerStyle: { width: 115 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Safety_Stock_on_hand',
    text: 'Safety Stock On Hand',

    sort: true,
    headerStyle: { width: 115 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const FORECAST_OVERWRITE_COL = [
  {
    dataField: 'Material',
    formatter: materialDD,
    text: 'Material',
    sort: true,
    headerStyle: { width: 100 },
    align: 'left',
    headerAlign: 'left'
  },

  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 100 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'Date',
    text: ' Date ',
    sort: true,
    sortFunc: sortFuncDate,
    formatter: dateformat,
    headerStyle: { width: 120 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'Forecasted_Qty',
    text: 'Forecasted Qty',
    formatter: nullFormatter,

    sort: true,
    headerStyle: { width: 130 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'OverWrite_Qty',
    text: 'OverWrite Qty',

    sort: true,
    formatter: nullFormatter,
    headerStyle: { width: 130 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Overwrite_Date',
    text: 'Overwrite Date',
    sortFunc: sortFuncDate,
    formatter: dateformat,

    sort: true,
    headerStyle: { width: 160 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'Reason_Code',
    text: 'Reason Code',

    sort: true,
    headerStyle: { width: 200 },
    align: 'left',
    formatter: nullFormatter,
    headerAlign: 'left'
  },
  {
    dataField: 'Comments',
    text: 'Comments',

    sort: true,
    headerStyle: { width: 200 },
    formatter: nullFormatter,
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'Submitted_By',
    text: 'Submitted By',
    formatter: nullFormatter,

    sort: true,
    headerStyle: { width: 250 },
    align: 'left',
    headerAlign: 'left'
  }
];
