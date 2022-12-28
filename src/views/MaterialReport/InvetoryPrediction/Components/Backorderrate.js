import React from 'react';
import { Row, Button } from 'antd';
import { ResponsiveContainer, XAxis, Label, Tooltip, Line, YAxis, LineChart } from 'recharts';
import { useDispatch, useSelector } from 'react-redux';

import moment from 'moment';
import { getBackOrderRateMaterialMonthwise } from '../../../../actions';
import { useEffect } from 'react';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';

// import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const Backorderrate = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getBackOrderRateMaterialMonthwise(props.Material, props.LGORT));
  }, []);
  const getBackOrderRateMaterialMonthwiseData = useSelector(
    (state) => state.getBackOrderRateMaterialMonthwise
  );
  const getBackOrderRateMaterialMonthwiseReducerLoader = useSelector(
    (state) => state.getBackOrderRateMaterialMonthwiseReducerLoader
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
    let csvData = getBackOrderRateMaterialMonthwiseData;
    let fileName = `${props.Material} (${props.LGORT})-Back Order Rate`;
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
        disabled={!getBackOrderRateMaterialMonthwiseData.length > 0}
        onClick={exportToCSV}>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle vendor-date" /> - Backorder Rate{' '}
        </span>
      </div>
      <Row className="v4">
        {!getBackOrderRateMaterialMonthwiseReducerLoader &&
        getBackOrderRateMaterialMonthwiseData != '' ? (
          <ResponsiveContainer height={350} width="100%">
            <LineChart
              width={900}
              height={350}
              data={getBackOrderRateMaterialMonthwiseData}
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

              <Line
                type="monotone"
                dataKey="BACKORDERRATE"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer height={350} width="100%">
            {getBackOrderRateMaterialMonthwiseReducerLoader ? (
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
