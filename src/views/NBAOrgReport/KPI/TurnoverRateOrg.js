import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { AreaChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { Row, Button } from 'antd';
import { ResponsiveContainer, XAxis, Label, Tooltip, YAxis, AreaChart, Area } from 'recharts';

import moment from 'moment';

import { getTurnOverRateOrgMonthwise } from '../../../actions';
import { useEffect } from 'react';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

// import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const TurnoverRateOrg = (props) => {
  const dispatch = useDispatch();

  const getTurnOverRateOrgMonthwiseData = useSelector((state) => state.getTurnOverRateOrgMonthwise);
  const getTurnOverRateOrgMonthwiseLoaderReducer = useSelector(
    (state) => state.getTurnOverRateOrgMonthwiseLoaderReducer
  );

  const exportToCSVRadialTOMatnr = () => {
    let csvData = getTurnOverRateOrgMonthwiseData;
    let fileName = `${props.OrgName}(${props.LGORT}) -  TurnOverRateOrganization`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  useEffect(() => {
    dispatch(getTurnOverRateOrgMonthwise(props.OrgName, props.LGORT));
  }, []);

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormat = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.MONTHLY).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>TurnOverRate : {e.payload[0].payload.TOR}</b> <br />
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
        disabled={!getTurnOverRateOrgMonthwiseData.length > 0}
        onClick={exportToCSVRadialTOMatnr}>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle nba-turnover" /> - TurnOver Rate{' '}
        </span>
      </div>
      <Row className="v4">
        {!getTurnOverRateOrgMonthwiseLoaderReducer && getTurnOverRateOrgMonthwiseData != '' ? (
          <ResponsiveContainer height={320} width="100%">
            <AreaChart
              width={900}
              height={320}
              data={getTurnOverRateOrgMonthwiseData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              <defs>
                <linearGradient id="colorTurnOverRate" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#F47C7C" stopOpacity={0.7} />
                  <stop offset="90%" stopColor="#F47C7C" stopOpacity={0.3} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="MONTHLY"
                angle={-40}
                tickFormatter={formatXAxis}
                textAnchor="end"
                height={150}
                interval={0}
                stroke="#fff">
                <Label
                  value="  Monthly"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  // position="insideLeft"
                  position="centerBottom"
                />
              </XAxis>
              <YAxis stroke="#fff">
                {' '}
                <Label
                  value=" TurnOverRate"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={TooltipFormat} />

              <Area
                type="monotone"
                dataKey="TOR"
                fill="url(#colorTurnOverRate)"
                stroke="url(#colorTurnOverRate)"
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer height={320} width="100%">
            {getTurnOverRateOrgMonthwiseLoaderReducer ? (
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

export default TurnoverRateOrg;
