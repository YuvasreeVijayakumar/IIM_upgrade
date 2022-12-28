import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Label, Tooltip } from 'recharts';
import { calculation } from '../../../Calculation';
import { useSelector } from 'react-redux';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';
import { Button } from 'antd';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const Consumption = (props) => {
  const [consumptionPercentage, setconsumptionPercentage] = useState('');
  const [monthlyPredictedYCons, setmonthlyPredictedYCons] = useState('');
  const getNBATrendAnalysisLoaderReducer = useSelector(
    (state) => state.getNBATrendAnalysisLoaderReducer
  );

  const getNBATrendAnalysisData = useSelector((state) => state.getNBATrendAnalysis);
  const formatYAxis = (tickItem) => {
    let value = calculation(tickItem);
    return value;
  };
  useEffect(() => {
    for (var i = 0; i < getNBATrendAnalysisData.length; i++) {
      if (getNBATrendAnalysisData[i].Is_Predicted == 'Y') {
        let data = i;
        setmonthlyPredictedYCons(data);
      }
    }
  }, [getNBATrendAnalysisData]);
  useEffect(() => {
    setconsumptionPercentage(
      100 -
        ((getNBATrendAnalysisData.length - monthlyPredictedYCons - 0) /
          (getNBATrendAnalysisData.length - 0)) *
          100
    );
  }, [monthlyPredictedYCons]);

  const exportToCSV = () => {
    let csvData = getNBATrendAnalysisData;
    let fileName = `${props.OrgName}(${props.LGORT}) - Consumption`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  const TooltipFormatter = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null && e.payload !== undefined) {
      let value = calculation(e.payload[0]?.payload.Total_CapEX);
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {e.payload[0]?.payload.year}</b> <br />
          </span>
          {e.payload[0]?.payload.Is_Predicted == 'N' ? (
            <span>
              <b> Total CapEx : {value}</b> <br />
            </span>
          ) : (
            <span>
              <b> Predicted CapEx: {value}</b> <br />
            </span>
          )}
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
          <i className="fas fa-circle total-trend-bar" /> - Total CapEx{' '}
        </span>
        <span>
          <i className="fas fa-circle predict-capex" /> - Predicted CapEx{' '}
        </span>
      </div>
      {!getNBATrendAnalysisLoaderReducer && getNBATrendAnalysisData.length > 0 ? (
        <>
          {consumptionPercentage != '' ? (
            <ResponsiveContainer height={350} width="100%">
              <AreaChart
                width={900}
                height={350}
                data={getNBATrendAnalysisData}
                margin={{
                  top: 0,
                  right: 30,
                  left: 0,
                  bottom: 0
                }}>
                <XAxis
                  dataKey="year"
                  angle={-40}
                  textAnchor="end"
                  height={150}
                  interval={0}
                  stroke="#fff">
                  <Label value="ds" position="bottom" fill="#fff" />
                </XAxis>
                <YAxis
                  stroke="#fff"
                  tickFormatter={formatYAxis}
                  // old value
                  // domain={[0, "dataMax + 40000000"]}
                  // domain={[0, "dataMax + 200000"]}
                  allowDecimals={false}
                />
                {getNBATrendAnalysisData.length > 0 &&
                !getNBATrendAnalysisLoaderReducer &&
                consumptionPercentage != '' ? (
                  <Tooltip content={TooltipFormatter} />
                ) : (
                  ''
                )}

                <defs>
                  <linearGradient id="gradientone11" x1="0" y1="0" x2="100%" y2="0">
                    <stop offset="0%" stopColor="#1870dc" />
                    <stop offset={`${consumptionPercentage}%`} stopColor="#1870dc" />
                    <stop offset={`${consumptionPercentage}%`} stopColor="#63ce46" />
                    <stop offset="100%" stopColor="#63ce46" />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="Total_CapEX"
                  stroke="url(#gradientone11)"
                  fill="url(#gradientone11)"
                  strokeWidth={3}
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <ReusableSysncLoader />
          )}
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
              <NoDataTextLoader />{' '}
            </>
          )}
        </ResponsiveContainer>
      )}
    </>
  );
};
