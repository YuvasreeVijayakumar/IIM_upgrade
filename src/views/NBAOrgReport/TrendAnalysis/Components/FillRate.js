import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, Label } from 'recharts';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from 'antd';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const FillRate = (props) => {
  const getNBATrendAnalysisLoaderReducer = useSelector(
    (state) => state.getNBATrendAnalysisLoaderReducer
  );
  const getNBATrendAnalysisData = useSelector((state) => state.getNBATrendAnalysis);
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const exportToCSV = () => {
    let csvData = getNBATrendAnalysisData;
    let fileName = `${props.OrgName}(${props.LGORT}) - Fill Rate`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  const TooltipFormatter = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null && e.payload !== undefined) {
      let value = moment(e.payload[0]?.payload.DS).format('MM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>Fill Rate : {e.payload[0]?.payload.FILLRATE} %</b> <br />
          </span>
        </div>
      );
    }
  };
  return (
    <>
      <Button
        size="sm"
        className="export-Btn ml-2 mr-2 float-right"
        disabled={!getNBATrendAnalysisData.length > 0}
        onClick={exportToCSV}>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center">
        <span>
          <i className="fas fa-circle" style={{ color: '#be48a5e3' }} /> - Fill Rate{' '}
        </span>
      </div>
      {!getNBATrendAnalysisLoaderReducer && getNBATrendAnalysisData.length > 0 ? (
        <>
          {' '}
          <ResponsiveContainer height={350} width="100%">
            <AreaChart
              width={900}
              height={350}
              data={getNBATrendAnalysisData}
              margin={{
                top: 0,
                right: 10,
                left: 10,
                bottom: 20
              }}>
              <defs>
                <linearGradient id="color-fillrate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="15%" stopColor="#be48a5e3" stopOpacity={0.6} />
                  <stop offset="85%" stopColor="#be48a5e3" stopOpacity={0.4} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="DS"
                angle={-40}
                tickFormatter={formatXAxis}
                textAnchor="end"
                height={150}
                interval={0}
                stroke="#fff">
                <Label
                  value="Monthly"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  // position="insideLeft"
                  position="centerBottom"
                />
              </XAxis>
              <YAxis stroke="#fff">
                {' '}
                <Label
                  value=" Fill Rate"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              {getNBATrendAnalysisData.length > 0 ? <Tooltip content={TooltipFormatter} /> : ''}

              <Area
                type="monotone"
                dataKey="FILLRATE"
                fill="url(#color-fillrate)"
                stroke="url(#color-fillrate)"
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <ResponsiveContainer height={350} width="100%">
          {getNBATrendAnalysisLoaderReducer ? (
            <>
              {' '}
              <ReusableSysncLoader />{' '}
            </>
          ) : (
            <>
              {' '}
              <NoDataTextLoader />
            </>
          )}
        </ResponsiveContainer>
      )}
    </>
  );
};
