import moment from 'moment';
import React from 'react';

import { Popover } from 'antd';
export const MaterialDescription = (cell, row) => {
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
const costformat = (cell) => {
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
const dateformat = (cell) => {
  if (cell == '-') {
    // eslint-disable-next-line react/react-in-jsx-scope
    return <span>-</span>;
  } else {
    let value = moment(cell).format('MM-DD-YYYY');
    // eslint-disable-next-line react/react-in-jsx-scope
    return <span>{value}</span>;
  }
};

export const OutstandingOrdersDDCol = [
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
    headerStyle: { width: 80 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'vendorName',
    text: 'Vendor Name',
    sort: true,
    headerStyle: { width: 125 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'Type',
    text: 'Type',
    sort: true,
    headerStyle: { width: 70 },
    align: 'left',
    headerAlign: 'left'
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
    headerStyle: { width: 120 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'Plant',
    text: 'Plant',
    sort: true,
    headerStyle: { width: 80 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'POCreated',
    text: 'PO Created',
    sort: true,

    formatter: dateformat,
    headerStyle: { width: 115 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'POAcknowledged',
    text: 'PO Acknowledged',
    sort: true,

    formatter: dateformat,
    headerStyle: { width: 150 },
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
    headerStyle: { width: 95 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'RequestedShippingDate',
    text: 'Requested Shipping Date',
    sort: true,

    formatter: dateformat,
    headerStyle: { width: 200 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Line_Value',
    text: 'Line Value',
    sort: true,
    align: 'right',
    headerAlign: 'right',

    headerStyle: { width: 140 },
    formatter: costformat
  },
  {
    dataField: 'Open_value',
    text: 'Open Value',
    sort: true,
    align: 'right',
    headerAlign: 'right',

    headerStyle: { width: 135 },
    formatter: costformat
  }
];

//overdueDD table col
export const OverdueDDCol = [
  {
    dataField: 'PO',
    text: 'PO',
    sort: true,
    headerStyle: { width: 115 },
    align: 'center',
    headerAlign: 'center'
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
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'VENDOR_NAME',
    text: 'vendor Name',
    sort: true,
    headerStyle: { width: 220 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'Type',
    text: 'Type',
    sort: true,
    headerStyle: { width: 70 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'Manufacture',
    text: 'Manufacture',
    sort: true,
    headerStyle: { width: 115 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'MPN',
    text: 'MPN',
    sort: true,
    headerStyle: { width: 120 },
    align: 'left',
    headerAlign: 'center'
  },
  {
    dataField: 'Plant',
    text: 'Plant',
    sort: true,
    headerStyle: { width: 85 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'POCreated',
    text: 'POCreated',
    sort: true,
    headerStyle: { width: 150 },
    align: 'center',
    headerAlign: 'center',
    formatter: dateformat
  },
  // {
  //   dataField: 'POAcknowledged',
  //   text: 'POAcknowledged',
  //   sort: true,
  //   headerStyle: { width: 150 },
  //   align: 'center',
  //   formatter: dateformat,
  //   headerAlign: 'center'
  // },
  {
    dataField: 'VendorCommitDate',
    text: 'Vendor Commit Date',
    sort: true,
    headerStyle: { width: 180 },
    align: 'right',
    headerAlign: 'right'
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
    text: 'Open Qty',
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
    formatter: dateformat,
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'LineValue',
    text: 'Line Value',
    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right',
    formatter: costformat
  },
  {
    dataField: 'OPEN_VALUE',
    text: 'Open Value',
    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right',
    formatter: costformat
  }
];
//slamet and fillrate column
export const SlametAndFillrateCol = [
  {
    dataField: 'VendorNo',
    text: 'Vendor No',
    sort: true,
    headerStyle: { width: 115 },
    align: 'left',
    headerAlign: 'left'
  },

  {
    dataField: 'VendorName',
    text: 'vendor Name',
    sort: true,
    headerStyle: { width: 220 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'MedianLeadtime',
    text: 'Median Leadtime',
    sort: true,
    headerStyle: { width: 170 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'Efficiency',
    text: 'Efficiency',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'OpenPOs',
    text: 'Open PO',
    sort: true,
    headerStyle: { width: 200 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'OpenPOsQty',
    text: 'Open PO Qty',
    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'TotalPOs',
    text: 'Total PO',
    sort: true,
    headerStyle: { width: 85 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'TotalItems',
    text: 'TotalItems',
    sort: true,
    headerStyle: { width: 150 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'TotalCapexSpend',
    text: 'Total Capex Spend',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 150 },
    align: 'right',
    headerAlign: 'right'
  }
];
export const FillRateDDCol = [
  {
    dataField: 'Consumption',
    text: 'Consumption',
    sort: true,
    headerStyle: { width: 100 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'BackOrders',
    text: 'BackOrder',
    sort: true,
    headerStyle: { width: 170 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'FillRate',
    text: 'FillRate %',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  }
];
//inventory capex col
export const InventoryCapexDDTblCol = [
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 70 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'MPN',
    text: 'MPN',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  },

  {
    dataField: 'RED_INVENTORY',
    text: 'Red Inventory',
    sort: true,
    headerStyle: { width: 105 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'RED_INVENTORY_CAPEX',
    text: 'Red Inventroy Capex',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'GREEN_INVENTORY',
    text: 'Green Inventory',
    sort: true,
    headerStyle: { width: 125 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'GREEN_INVENTORY_CAPEX',
    text: 'Green Inventory Capex',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 130 },
    align: 'right',
    headerAlign: 'right'
  }
];
//inventory plant col
export const InventoryCapexDDTblPlantCol = [
  {
    dataField: 'PLANT',
    text: 'Plant',
    sort: true,
    headerStyle: { width: 55 },
    align: 'left',
    headerAlign: 'left'
  },

  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'INVENTORY',
    text: ' Inventroy ',

    sort: true,
    headerStyle: { width: 130 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'INVENTORY_CAPEX',
    text: 'Inventory Capex',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 110 },
    align: 'right',
    headerAlign: 'right'
  }
];

//No of backorder dd
export const NoOfBacordersDDCol = [
  {
    dataField: 'PR_NUMBER',
    text: 'PR Number',
    sort: true,
    headerStyle: { width: 115 },
    align: 'right',
    headerAlign: 'right'
  },

  {
    dataField: 'PR_LINE',
    text: 'PR Line',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'lerightft'
  },
  {
    dataField: 'PR_DATE',
    text: 'PR Date',
    sort: true,
    headerStyle: { width: 100 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'QUANTITY',
    text: 'Quantity',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'MFRPN',
    text: 'MFRPN',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'WERKS',
    text: 'Weeks',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'PART_DESCRIPTION',
    text: 'Part Description',
    sort: true,
    headerStyle: { width: 300 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'NETBUILD',
    text: 'Net Build',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'NAME',
    text: 'Name',
    sort: true,
    headerStyle: { width: 500 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'ZZ_PROCESSED',
    text: 'ZZ Processed',
    sort: true,
    headerStyle: { width: 135 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'ORDERNUMBER',
    text: 'Order Number',
    sort: true,
    headerStyle: { width: 240 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'NET_MRR',
    text: 'Net MRR',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  }
];

//dashboard columns
export const newLeadTimeColumn = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 32 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'LEADTIME',
    text: 'LeadTime',
    sort: true,
    headerStyle: { width: 50 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'NEW_LEAD_TIME',
    text: 'NewLeadTime',
    sort: true,
    headerStyle: { width: 60 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'TILLDATE',
    text: 'TillDate',
    sort: true,
    formatter: dateformat,
    headerStyle: { width: 70 },
    align: 'right',
    headerAlign: 'right'
  }
];
