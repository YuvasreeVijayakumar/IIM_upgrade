import React from 'react';
import { Popover } from 'antd';
import { MaterialDDTable } from './MaterialDDTable';
// eslint-disable-next-line no-unused-vars
const materialTrend = (cell) => {
  if (cell == 'Up') {
    return (
      <span>
        <i className="fas fa-arrow-up tbl-trend"></i>
      </span>
    );
  } else if (cell == 'Down') {
    return (
      <span>
        <i className="fas fa-arrow-down tbl-trend "></i>
      </span>
    );
  } else if (cell == null) {
    return <span>-</span>;
  } else {
    return (
      <span>
        <i className="fas fa-arrows-alt-h  tbl-trend"></i>
      </span>
    );
  }
};
const materialDescription = (cell, row) => {
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
export const TopTrendingMatColumns = [
  {
    text: 'Action',
    dataField: '',
    headerStyle: { width: 25 },
    formatter: (cell, row) => (
      <>
        <MaterialDDTable cell={cell} row={row} />
      </>
    )
  },
  {
    dataField: 'MATNR',
    text: 'Material',
    sort: true,
    headerStyle: { width: 30 },
    formatter: materialDescription,
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
    dataField: 'MPN',
    text: 'MPN',
    sort: true,
    headerStyle: { width: 40 },
    align: 'left',
    headerAlign: 'left'
  },
  // {
  //   dataField: 'TREND',
  //   text: 'Trend',
  //   sort: true,
  //   headerStyle: { width: 20 },
  //   align: 'center',
  //   headerAlign: 'center',
  //   formatter: materialTrend
  // },
  {
    dataField: 'MANUF_NAME',
    text: 'Manufacturer',
    sort: true,
    headerStyle: { width: 60 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'ORGANIZATION',
    text: 'Organization',
    sort: true,
    headerStyle: { width: 60 },
    align: 'left',
    headerAlign: 'left'
  }
];
