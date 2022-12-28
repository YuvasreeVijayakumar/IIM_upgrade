import { Popover } from 'antd';
import React from 'react';
export const materialDD = (cell, row) => {
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
