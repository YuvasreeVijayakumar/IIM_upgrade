import React from 'react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, Label } from 'recharts';
import { useSelector } from 'react-redux';
import moment from 'moment';

import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { Button } from 'antd';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const SlaMet = (props) => {
  const getNBAManufTrendAnalysisData = useSelector((state) => state.getNBAManufTrendAnalysis);
  const getNBAManufTrendAnalysisReducerLoader = useSelector(
    (state) => state.getNBAManufTrendAnalysisReducerLoader
  );
  const exportToCSV = () => {
    let csvData = getNBAManufTrendAnalysisData;
    let fileName = `${props.Manuf}(${props.LGORT}) - SLA Met`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormatter = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null && e.payload !== undefined) {
      let value = moment(e.payload[0]?.payload.PO_DATE).format('MM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>Efficiency : {e.payload[0]?.payload.Perfect_Delivery_Rate} %</b> <br />
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
        disabled={!getNBAManufTrendAnalysisData.length > 0}
        onClick={exportToCSV}>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center">
        <span>
          <i className="fas fa-circle" style={{ color: '#03f0fcba' }} /> - Efficiency{' '}
        </span>
      </div>
      {!getNBAManufTrendAnalysisReducerLoader && getNBAManufTrendAnalysisData.length > 0 ? (
        <>
          {' '}
          <ResponsiveContainer height={350} width="100%" className="trend-analysis">
            <AreaChart
              width={900}
              height={350}
              data={getNBAManufTrendAnalysisData}
              margin={{
                top: 0,
                right: 10,
                left: 10,
                bottom: 20
              }}>
              <defs>
                <linearGradient id="colorSlamet" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#03f0fcba" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#03f0fcba" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="PO_DATE"
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
                  value=" Efficiency"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              {getNBAManufTrendAnalysisData.length > 0 ? (
                <Tooltip content={TooltipFormatter} />
              ) : (
                ''
              )}

              <Area
                type="monotone"
                dataKey="Perfect_Delivery_Rate"
                fill="url(#colorSlamet)"
                stroke="url(#colorSlamet)"
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </>
      ) : (
        <ResponsiveContainer height={350} width="100%">
          {getNBAManufTrendAnalysisReducerLoader ? (
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
