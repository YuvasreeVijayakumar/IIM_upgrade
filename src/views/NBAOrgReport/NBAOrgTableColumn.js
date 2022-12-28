import React from 'react';
// eslint-disable-next-line no-unused-vars
import moment from 'moment';
import { Popover } from 'antd';
const materialDDBulb = (cell, row) => {
  if (cell == 'False' && row.UnderStock == 'False') {
    return (
      <span>
        <i className="fas fa-circle fa-2x milestone-risk-green"></i>
      </span>
    );
  } else if (cell == 'False' && row.UnderStock == 'True') {
    return (
      <Popover placement="right" content="Understock">
        <span>
          <i className="fas fa-circle fa-2x milestone-risk-red"></i>
          <i className="fa fa-arrow-down ml-2"></i>
        </span>
      </Popover>
    );
  } else if (cell == 'True' && row.UnderStock == 'False') {
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
function sortFunc(a, b, order) {
  if (order === 'asc') {
    return b - a;
  }
  return a - b;
}
function dateformat(cell) {
  if (cell == '-') {
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
const materialDD = (cell, row) => {
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

const materialDDLeadTime = (cell, row) => {
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
      <span>
        {row.FLAG === 'N' ? (
          <span className="Red-flag">{cell}</span>
        ) : (
          <span className="Orange-flag">{cell}</span>
        )}
      </span>
    </Popover>
  );
};

export const CurrentInventoryMaterial = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 80 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
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
    dataField: 'RED_INVENTORY',
    text: 'Red Inventory',
    sort: true,
    headerStyle: { width: 95 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'RED_INVENTORY_CAPEX',
    text: 'Red Inventory Capex',
    sort: true,
    headerStyle: { width: 130 },
    align: 'right',
    headerAlign: 'right',
    formatter: costformat
  },

  {
    dataField: 'GREEN_INVENTORY',
    text: 'Green Inventory',
    sort: true,
    headerStyle: { width: 100 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'GREEN_INVENTORY_CAPEX',
    text: 'Green Inventory Capex',
    sort: true,
    headerStyle: { width: 120 },
    formatter: costformat,
    align: 'right',
    headerAlign: 'right'
  }
];

export const NBAOrgOrganization = [
  {
    dataField: 'PLANT',
    text: 'Plant',
    sort: true,
    headerStyle: { width: 80 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'ORGANIZATION',
    text: 'Organization',
    sort: true,
    headerStyle: { width: 140 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 85 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'QUANTITY',
    text: 'Quantity',
    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  },

  {
    dataField: 'TOTAL_VALUATION',
    text: 'Total Capex',
    sort: true,
    headerStyle: { width: 85 },
    formatter: costformat,
    align: 'right',
    headerAlign: 'right'
  }
];

export const CurrentInventoryManufacturar = [
  {
    dataField: 'MANUF',
    text: 'Manufacturer',
    sort: true,
    headerStyle: { width: 130 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'RED_INVENTORY',
    text: 'Red Inventory',
    sort: true,
    headerStyle: { width: 130 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'RED_INVENTORY_CAPEX',
    text: 'Red Inventory Capex',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 150 },
    align: 'right',
    headerAlign: 'right'
  },

  {
    dataField: 'GREEN_INVENTORY',
    text: 'Green Inventory',
    sort: true,
    headerStyle: { width: 120 },
    align: 'center',
    headerAlign: 'left'
  },
  {
    dataField: 'GREEN_INVENTORY_CAPEX',
    text: 'Green Inventory Capex',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 160 },
    align: 'right',
    headerAlign: 'right'
  }
];
export const backOrderColumns = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 32 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
  },
  {
    dataField: 'NO_OF_BACK_ORDERS',
    text: 'Back Orders',
    sort: true,
    headerStyle: { width: 50 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'NET_MRR',
    text: 'NET MRR',
    sort: true,
    headerStyle: { width: 50 },
    align: 'center',
    headerAlign: 'center'
  }
];

export const totalPartsDDColumns = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'MPN',
    text: 'MPN',
    sort: true,
    headerStyle: { width: 175 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'DESCRIPTION',
    text: 'Description',
    sort: true,
    headerStyle: { width: 500 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'HECI',
    text: 'HECI',
    sort: true,
    headerStyle: { width: 100 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'MANUF_NAME',
    text: 'Manufacturer',
    sort: true,
    headerStyle: { width: 130 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'STK_TYPE',
    text: 'Stock Type',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    formatter: (cell) => {
      if (cell == null) {
        return '-';
      } else {
        return cell;
      }
    },
    headerAlign: 'center'
  },

  {
    dataField: 'LVLT_STOCKOUT_FLAG',
    text: 'Stockout Flag',
    sort: true,
    headerStyle: { width: 170 },
    align: 'center',
    formatter: (cell, row) => {
      if (row.LVLT_STOCKOUT_FLAG == 'N' && row.CTL_STOCKOUT_FLAG == 'N') {
        return '-';
      } else if (row.LVLT_STOCKOUT_FLAG == 'Y' && row.CTL_STOCKOUT_FLAG == 'N') {
        return 'LVLT';
      } else if (row.LVLT_STOCKOUT_FLAG == 'N' && row.CTL_STOCKOUT_FLAG == 'Y') {
        return 'CTL';
      } else if (row.LVLT_STOCKOUT_FLAG == 'Y' && row.CTL_STOCKOUT_FLAG == 'Y') {
        return 'LVLT , CTL';
      }
    },
    headerAlign: 'center'
  },
  {
    dataField: 'UNIT_PRICE',
    text: 'Unit Price',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 110 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const SLAMETDDColumns = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
  },
  {
    dataField: 'MANUF_NAME',
    text: 'Manufacturer',
    sort: true,
    headerStyle: { width: 130 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'SLA_MET',
    text: 'Efficiency %',
    sort: true,
    headerStyle: { width: 175 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const FillRATEDDColumns = [
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
  },
  {
    dataField: 'MANUF_NAME',
    text: 'Manufacturer',
    sort: true,
    headerStyle: { width: 130 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'CONS',
    text: 'Consumption',
    sort: true,
    headerStyle: { width: 110 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'BO_QTY',
    text: 'BackOrder Quantity',
    sort: true,
    headerStyle: { width: 175 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'FILLRATE',
    text: 'Fill Rate %',
    sort: true,
    headerStyle: { width: 175 },
    align: 'center',
    headerAlign: 'center'
  }
];

export const OutstandingOrderstblColumn = [
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
    dataField: 'Material',
    text: 'Material',
    sort: true,
    formatter: materialDD,
    headerStyle: { width: 100 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 90 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'Manufacture',
    text: 'Manufacturer',
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
    sortFunc: sortFuncDate,
    formatter: dateformat,
    headerStyle: { width: 115 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'POAcknowledged',
    text: 'PO Acknowledged',
    sort: true,
    sortFunc: sortFuncDate,
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
    sortFunc: sortFuncDate,
    formatter: dateformat,
    headerStyle: { width: 200 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'Line_Value',
    text: 'Line Value',
    sort: true,
    align: 'right',
    headerAlign: 'right',
    sortFunc: sortFunc,
    headerStyle: { width: 110 },
    formatter: costformat
  },
  {
    dataField: 'Open_value',
    text: 'Open Value',
    sort: true,
    align: 'right',
    headerAlign: 'right',
    sortFunc: sortFunc,
    headerStyle: { width: 125 },
    formatter: costformat
  }
];

export const OverdueTblCOl = [
  {
    dataField: 'PO',
    text: 'PO',
    sort: true,
    headerStyle: { width: 100 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'POline',
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
    dataField: 'VendorName',
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
    dataField: 'Material',
    text: 'Material',
    sort: true,
    formatter: materialDD,
    headerStyle: { width: 100 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 90 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'Manufacture',
    text: 'Manufacturer',
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
    sortFunc: sortFuncDate,
    formatter: dateformat,
    headerStyle: { width: 115 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'VendorCommitDate',
    text: 'Vendor Commit Date',
    sort: true,
    sortFunc: sortFuncDate,
    formatter: dateformat,
    headerStyle: { width: 165 },
    align: 'center',
    headerAlign: 'center'
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
    dataField: 'RequestedDeliveryDate',
    text: 'Requested Delivery Date',
    sort: true,
    sortFunc: sortFuncDate,
    formatter: dateformat,
    headerStyle: { width: 190 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'LineValue',
    text: 'Line Value',
    sort: true,
    align: 'right',
    headerAlign: 'right',
    sortFunc: sortFunc,
    headerStyle: { width: 110 },
    formatter: costformat
  },
  {
    dataField: 'OpenValue',
    text: 'Open Value',
    sort: true,
    align: 'right',
    headerAlign: 'right',
    sortFunc: sortFunc,
    headerStyle: { width: 130 },
    formatter: costformat
  }
];

export const TotalHarvestDD = [
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    headerStyle: { width: 80 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
  },
  {
    dataField: 'MANUF_NAME',
    text: 'Manufacturer',
    sort: true,
    headerStyle: { width: 130 },
    align: 'left',
    headerAlign: 'left'
  },

  {
    dataField: 'Total_Harvest',
    text: 'Total Harvest',
    sort: true,
    headerStyle: { width: 100 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'Total_Harvest_capex',
    text: 'Total Harvest  Capex',
    sort: true,
    headerStyle: { width: 85 },
    align: 'right',
    formatter: costformat,
    headerAlign: 'right'
  }
];

export const OpenHarvestDD = [
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    headerStyle: { width: 80 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
  },
  {
    dataField: 'MANUF_NAME',
    text: 'Manufacturer',
    sort: true,
    headerStyle: { width: 130 },
    align: 'left',
    headerAlign: 'left'
  },

  {
    dataField: 'Open_Harvest',
    text: 'Open Harvest',
    sort: true,
    headerStyle: { width: 100 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'Open_Harvest_capex',
    text: 'Open Harvest  Capex',
    sort: true,
    headerStyle: { width: 85 },
    align: 'right',
    formatter: costformat,
    headerAlign: 'right'
  }
];

export const BackOrderDDPredictedMetrics = [
  {
    dataField: 'PR_NUMBER',
    text: 'PR Number',
    sort: true,
    headerStyle: { width: 105 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'PR_LINE',
    text: 'PR Line',
    sort: true,
    headerStyle: { width: 85 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'PR_DATE',
    text: 'PR Date',
    sort: true,
    sortFunc: sortFuncDate,
    formatter: dateformat,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'MATERIAL',
    text: 'Material No',
    sort: true,
    formatter: materialDD,
    headerStyle: { width: 110 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'QUANTITY',
    text: 'Quantity',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'MFRPN',
    text: 'MFRPN',
    sort: true,
    headerStyle: { width: 160 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'WERKS',
    text: 'WERKS',
    sort: true,
    headerStyle: { width: 80 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'PART_DESCRIPTION',
    text: 'Part Description',
    sort: true,
    headerStyle: { width: 340 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'MFRNR',
    text: 'MFRNR',
    sort: true,
    headerStyle: { width: 85 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'NETBUILD',
    text: 'Netbuild',
    sort: true,
    headerStyle: { width: 90 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'NAME',
    text: 'Name',
    sort: true,
    headerStyle: { width: 80 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'ZZ_PROCESSED',
    text: 'ZZ Processed',
    sort: true,
    headerStyle: { width: 125 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'ORDERNUMBER',
    text: 'Order Number',
    sort: true,
    headerStyle: { width: 125 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'NET_MRR',
    text: 'NET_MRR',
    sort: true,
    headerStyle: { width: 100 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const UnderstockAnnouncementDDColumns = [
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    formatter: materialDD,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
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
    dataField: 'incoming',
    text: 'Incoming',
    sort: true,
    headerStyle: { width: 65 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Reorder_Point',
    text: 'Reorder Point',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'UnderStock_Quantity',
    text: 'UnderStock Quantity ',
    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'UnderstockCapEx',
    text: 'UnderStock Capex ',
    sort: true,
    headerStyle: { width: 109 },
    formatter: costformat,
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'UnderStock_percent',
    text: 'UnderStock %',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  }
];
export const OverStockAnnouncementDDColumns = [
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    formatter: materialDD,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
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
    dataField: 'incoming',
    text: 'Incoming',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Reorder_Point',
    text: 'Reorder Point',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'OverStock_Quantity',
    text: 'OverStock Quantity',
    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'OverStock_CapEx',
    text: 'OverStock CapEx',
    sort: true,
    headerStyle: { width: 110 },
    formatter: costformat,
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'OverStock_percent',
    text: 'OverStock %',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const LTSCoulmns = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    formatter: materialDDLeadTime,
    headerStyle: { width: 70 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'NEW_LEAD_TIME',
    text: 'New Lead Time',
    sort: true,
    headerStyle: { width: 50 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'TillDate',
    text: 'Till Date',
    sort: true,
    sortFunc: sortFuncDate,
    formatter: dateformat,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'DAYS',
    text: 'Days',
    sort: true,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
  }
];

export const MaterialNoColumns = [
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    formatter: materialDD,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
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
    dataField: 'MANUF_NAME',
    text: 'Manufacturer',
    sort: true,
    headerStyle: { width: 120 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'Inventory',
    text: 'Inventory',
    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Open_POs',
    text: 'Open POs',
    sort: true,
    headerStyle: { width: 120 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'Inventory_exhaust_date',
    text: 'Inventory exhaust date',
    sortFunc: sortFuncDate,
    formatter: dateformat,
    sort: true,
    headerStyle: { width: 130 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'OverStock',
    text: 'Stock Level',
    sort: true,
    headerStyle: { width: 120 },
    formatter: materialDDBulb,
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'MEDIAN_LEADTIME',
    text: 'Median Leadtime',
    sort: true,
    headerStyle: { width: 180 },
    align: 'right',
    headerAlign: 'right'
  },

  {
    dataField: 'Recommendation',
    text: 'Recommendation',
    sort: true,
    headerStyle: { width: 250 },
    align: 'center',
    headerAlign: 'center'
  }
];

export const PCTColumns = [
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'DS',
    text: 'Date',
    sortFunc: sortFuncDate,
    formatter: dateformat,
    sort: true,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'QTY',
    text: 'Quantity',
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'TOTAL_CAPEX',
    text: 'Total Capex',
    sort: true,
    formatter: costformat,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  }
];
export const CapgovMaterialDD = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    // headerStyle: { width: 80 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
  },
  {
    dataField: 'MANUF_NAME',
    text: 'Manufacturer',
    sort: true,
    //headerStyle: { width: 120 },
    align: 'left',
    headerAlign: 'left'
  },

  {
    dataField: 'Cap_gov_request',
    text: 'Capgov Request',
    sort: true,
    // headerStyle: { width: 50 },
    align: 'right',
    formatter: costformat,
    headerAlign: 'right'
  }
];
