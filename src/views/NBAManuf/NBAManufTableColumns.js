import { Popover } from 'antd';
import React from 'react';
import moment from 'moment';
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
    dataField: 'Inventory',
    text: 'Inventory',
    sort: true,
    headerStyle: { width: 100 },
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
    headerStyle: { width: 140 },
    align: 'right',
    headerAlign: 'right'
  },

  {
    dataField: 'Recommendation',
    text: 'Recommendation',
    sort: true,
    headerStyle: { width: 250 },
    align: 'left',
    headerAlign: 'left'
  }
];

export const SLAMETDDvendorColumns = [
  {
    dataField: 'VENDOR',
    text: 'Vendor Name',
    sort: true,
    headerStyle: { width: 80 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 70 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'Efficiency',
    text: 'Efficiency %',
    sort: true,
    headerStyle: { width: 70 },
    align: 'right',
    headerAlign: 'right'
  }
];
export const SLAMETDDColumns = [
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
    headerStyle: { width: 70 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'SLA_MET',
    text: 'SLA Met %',
    sort: true,
    headerStyle: { width: 70 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const materialDDColumns = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 100 },
    align: 'center',
    headerAlign: 'center'
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
    text: 'MPN',
    dataField: 'MPN',
    sort: true,
    headerStyle: { width: 140 },

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
    text: 'Unit Price',
    dataField: 'UNIT_PRICE',
    sort: true,
    headerStyle: { width: 95 },
    formatter: costformat,
    align: 'right',
    headerAlign: 'right'
  }
];

export const AwaitingrepairsColumns = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 80 },
    align: 'center',
    formatter: materialDD,
    headerAlign: 'center'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 70 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'REPAIR_PARTS',
    text: 'Repair Parts',
    sort: true,
    headerStyle: { width: 100 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'capex',
    text: 'Total Capex',
    sort: true,
    headerStyle: { width: 70 },
    align: 'right',
    formatter: costformat,
    headerAlign: 'right'
  }
];
export const AvgEarlyDaysColumns = [
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    headerStyle: { width: 70 },
    align: 'center',
    formatter: materialDD,
    headerAlign: 'center'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 70 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'AVG_EARLY_DAYS',
    text: 'Average Early Days',
    sort: true,
    headerStyle: { width: 70 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const AvgEarlyDaysPlantColumns = [
  {
    dataField: 'VENDOR',
    text: 'Vendor Name',
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
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'AVG_EARLY_DAYS',
    text: 'Average Early Days',
    sort: true,
    headerStyle: { width: 70 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const vendorColumns = [
  {
    dataField: 'VENDOR_NAME',
    text: 'Vendor Name',
    sort: true,
    headerStyle: { width: 75 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'MATERIAL_COUNT',
    text: 'Material Count',
    sort: true,
    headerStyle: { width: 35 },
    align: 'center',

    headerAlign: 'center'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 30 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'TOTAL_RECEIPT_QTY',
    text: 'Receipt Qty',
    sort: true,
    headerStyle: { width: 35 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'TOTAL_OPEN_QTY',
    text: 'Open Qty',
    sort: true,
    headerStyle: { width: 35 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'MEDIAN_LEADTIME',
    text: 'LeadTime',
    sort: true,
    headerStyle: { width: 35 },
    align: 'center',
    headerAlign: 'center'
  }
];

export const BackOrdersDDcol = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 10 },
    align: 'left',
    formatter: materialDD,
    headerAlign: 'left'
  },
  {
    dataField: 'NO_OF_BACK_ORDERS',
    text: 'No Of Back Orders',
    sort: true,
    headerStyle: { width: 30 },
    align: 'center',
    headerAlign: 'center'
  },

  {
    dataField: 'NET_MRR',
    text: 'NET MRR',
    sort: true,
    headerStyle: { width: 10 },
    align: 'right',
    headerAlign: 'right',
    formatter: costformat
  }
];

export const InventoryCapexDDTblCol = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 60 },
    align: 'center',
    formatter: materialDD,
    headerAlign: 'center'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 45 },
    align: 'left',
    headerAlign: 'left'
  },

  {
    dataField: 'RED_INVENTORY',
    text: 'Red Inventory',
    sort: true,
    headerStyle: { width: 60 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'RED_INVENTORY_CAPEX',
    text: 'Red Inventroy Capex',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 90 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'GREEN_INVENTORY',
    text: 'Green Inventory',
    sort: true,
    headerStyle: { width: 80 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'GREEN_INVENTORY_CAPEX',
    text: 'Green Inventory Capex',
    formatter: costformat,
    sort: true,
    headerStyle: { width: 95 },
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
    headerStyle: { width: 70 },
    align: 'right',
    headerAlign: 'right'
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

export const LeadTimeColumns = [
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    headerStyle: { width: 30 },
    align: 'center',
    formatter: materialDD,
    headerAlign: 'center'
  },
  {
    dataField: 'LGORT',
    text: 'LGORT',
    sort: true,
    headerStyle: { width: 30 },
    align: 'center',
    headerAlign: 'center'
  },
  {
    dataField: 'MEDIAN_LEADTIME',
    text: 'LeadTime',
    sort: true,
    headerStyle: { width: 25 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'MIN_DAYS',
    text: 'Min Days',
    sort: true,
    headerStyle: { width: 35 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'MAX_DAYS',
    text: 'Max Days',
    sort: true,
    headerStyle: { width: 35 },
    align: 'right',
    headerAlign: 'right'
  }
];

export const CapgovMaterialReportDdColumns = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    //headerStyle: { width: 80 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
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

export const ORDERS_RECOMMENDATION = [
  {
    dataField: 'Material',
    text: 'Material',
    sort: true,
    headerStyle: { width: 90 },
    align: 'center',
    headerAlign: 'center',
    formatter: materialDD
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
    dataField: 'Organization',
    text: 'Organization',
    sort: true,
    headerStyle: { width: 130 },
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
    dataField: 'OpenHarvestQty',
    text: 'Open Harvest(Qty)',
    sort: true,
    headerStyle: { width: 150 },
    align: 'right',

    headerAlign: 'right'
  },
  {
    dataField: 'PotentialHarvest',
    text: 'Potential Harvest(QTY)',
    sort: true,
    headerStyle: { width: 180 },
    align: 'right',

    headerAlign: 'right'
  },
  {
    dataField: 'BoQty',
    text: 'BackOrder(Qty)',
    sort: true,
    headerStyle: { width: 150 },
    align: 'right',

    headerAlign: 'right'
  },
  {
    dataField: 'OrdersInPipeline',
    text: 'Orders In Pipeline',
    sort: true,
    headerStyle: { width: 150 },
    align: 'right',

    headerAlign: 'right'
  },
  {
    dataField: 'Push_Qty',
    text: 'Push Qty',
    sort: true,
    headerStyle: { width: 100 },
    align: 'right',

    headerAlign: 'right'
  },

  {
    dataField: 'Pull_Qty',
    text: 'Pull Qty',
    sort: true,
    headerStyle: { width: 100 },
    align: 'right',

    headerAlign: 'right'
  },
  {
    dataField: 'Place_Qty',
    text: 'Place Qty',
    sort: true,
    headerStyle: { width: 100 },
    align: 'right',

    headerAlign: 'right'
  },
  {
    dataField: 'InventoryExhaustDate',
    text: 'Inventory Exhaust Date',
    sort: true,
    headerStyle: { width: 190 },
    align: 'center',
    sortFunc: sortFuncDate,
    formatter: dateformat,

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
    dataField: 'Recommendation',
    text: 'Recommendation',
    sort: true,
    headerStyle: { width: 300 },
    align: 'left',

    headerAlign: 'left'
  }
];
