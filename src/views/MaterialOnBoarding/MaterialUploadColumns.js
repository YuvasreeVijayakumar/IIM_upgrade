import React from 'react';
import { Popover } from 'antd';
export const overviewMaterialColumns = [
  {
    dataField: 'MATERIAL',
    text: 'Material',
    sort: true,
    headerStyle: { width: 20 },
    align: 'center',
    headerAlign: 'center'
    //formatter: materialDD
  },

  {
    dataField: 'LEADTIME',
    text: 'LeadTime',
    sort: true,
    headerStyle: { width: 18 },
    align: 'right',
    headerAlign: 'right'
  },
  {
    dataField: 'SUBMITTED_BY',
    text: 'Submitted By',
    sort: true,
    headerStyle: { width: 40 },
    align: 'left',
    headerAlign: 'left'
  },
  {
    dataField: 'FLAG',
    text: 'Status',
    sort: true,
    headerStyle: { width: 20 },
    align: 'center',
    headerAlign: 'center',
    formatter: (cell) => {
      if (cell === 'N') {
        return (
          <Popover content={<span>Waiting</span>} placement="right">
            {' '}
            <i className="far fa-clock mat-upload cursor-pointer"></i>
          </Popover>
        );
      } else {
        return (
          <Popover content={<span>OnBoarded</span>} placement="right">
            <i className="far fa-check-circle mat-upload cursor-pointer"></i>
          </Popover>
        );
      }
    }
  }
];
