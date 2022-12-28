import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Row, Button } from 'antd';
import { ResponsiveContainer, XAxis, Label, Tooltip, YAxis, AreaChart, Area } from 'recharts';

import moment from 'moment';
import { getTurnOverRateManufMonthwise } from '../../../actions';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { ReusableExportExcel } from '../../ReusableComponent/ReusableExportExcel';

const TurnOverRate = (props) => {
  const dispatch = useDispatch();
  //Fetching Datas
  const getTurnOverRateManufMonthwiseReducerLoader = useSelector(
    (state) => state.getTurnOverRateManufMonthwiseReducerLoader
  );
  const getTurnOverRateManufMonthwiseData = useSelector(
    (state) => state.getTurnOverRateManufMonthwise
  );
  //end

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
  useEffect(() => {
    dispatch(getTurnOverRateManufMonthwise(encodeURIComponent(props.ManufName), props.LGORT));
  }, []);
  return (
    <>
      <Button
        size="sm"
        disabled={getTurnOverRateManufMonthwiseReducerLoader}
        className="export-Btn ml-2 mr-2 float-right"
        onClick={() =>
          ReusableExportExcel(
            getTurnOverRateManufMonthwiseData,
            `${props.ManufName} (${props.LGORT}) - Turnover Rate`
          )
        }>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend ">
        <span>
          <i className="fas fa-circle nba-turnover" /> - TurnOver Rate{' '}
        </span>
      </div>

      <Row className="v4">
        {!getTurnOverRateManufMonthwiseReducerLoader &&
        getTurnOverRateManufMonthwiseData.length > 0 ? (
          <>
            <ResponsiveContainer height={320} width="100%">
              <AreaChart
                width={900}
                height={320}
                data={getTurnOverRateManufMonthwiseData}
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
          </>
        ) : (
          <>
            {' '}
            {getTurnOverRateManufMonthwiseReducerLoader ? (
              <ResponsiveContainer height={320} width="100%">
                <ReusableSysncLoader />
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer height={320} width="100%">
                <NoDataTextLoader />
              </ResponsiveContainer>
            )}
          </>
        )}
      </Row>
    </>
  );
};

export default TurnOverRate;
