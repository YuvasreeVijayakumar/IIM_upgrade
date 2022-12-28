import React from 'react';
import { Row, Button } from 'antd';
import { ResponsiveContainer, XAxis, Label, Tooltip, Area, YAxis, AreaChart } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';

import { getBackOrderRateOrgMonthwise } from '../../../actions';
import { useEffect } from 'react';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

// import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const BackorderRateOrg = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBackOrderRateOrgMonthwise(props.OrgName, props.LGORT));
  }, []);
  const getBackOrderRateOrgMonthwiseData = useSelector(
    (state) => state.getBackOrderRateOrgMonthwise
  );
  const getBackOrderRateOrgMonthwiseReducerLoader = useSelector(
    (state) => state.getBackOrderRateOrgMonthwiseReducerLoader
  );
  const TooltipFormat = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>BackOrderRate: {e.payload[0].payload.BACKORDERRATE}</b> <br />
          </span>
        </div>
      );
    }
  };
  const exportToCSV = () => {
    let csvData = getBackOrderRateOrgMonthwiseData;
    let fileName = `${props.OrgName}(${props.LGORT}) - Back Order Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };

  return (
    <>
      <Button
        size="sm"
        className="export-Btn ml-2 mr-2 float-right"
        disabled={!getBackOrderRateOrgMonthwiseData.length > 0}
        onClick={exportToCSV}>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle vendor-date" /> - Backorder Rate{' '}
        </span>
      </div>
      <Row className="v4">
        {!getBackOrderRateOrgMonthwiseReducerLoader && getBackOrderRateOrgMonthwiseData != '' ? (
          <ResponsiveContainer height={320} width="100%">
            <AreaChart
              width={900}
              height={320}
              data={getBackOrderRateOrgMonthwiseData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              <XAxis
                dataKey="DS"
                angle={-40}
                tickFormatter={formatXAxis}
                textAnchor="end"
                height={150}
                interval={0}
                stroke="#fff">
                <Label
                  value=" Monthly"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  // position="insideLeft"
                  position="centerBottom"
                />
              </XAxis>
              <YAxis stroke="#fff">
                {' '}
                <Label
                  value=" BackOrder Rate"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={TooltipFormat} />

              <Area
                type="monotone"
                dataKey="BACKORDERRATE"
                stroke="#00FFAB"
                fill="#00FFAB"
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer height={320} width="100%">
            {getBackOrderRateOrgMonthwiseReducerLoader ? (
              <ReusableSysncLoader />
            ) : (
              <NoDataTextLoader />
            )}
          </ResponsiveContainer>
        )}
      </Row>
    </>
  );
};
