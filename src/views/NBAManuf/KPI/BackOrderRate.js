import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getBackOrderRateManufMonthwise } from '../../../actions';
import { Row, Button } from 'antd';
import { ResponsiveContainer, XAxis, Label, Tooltip, YAxis, AreaChart, Area } from 'recharts';

import moment from 'moment';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { ReusableExportExcel } from '../../ReusableComponent/ReusableExportExcel';

const BackOrderRate = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getBackOrderRateManufMonthwise(encodeURIComponent(props.ManufName), props.LGORT));
  }, []);
  const getBackOrderRateManufMonthwiseReducerLoader = useSelector(
    (state) => state.getBackOrderRateManufMonthwiseReducerLoader
  );
  const getBackOrderRateManufMonthwiseData = useSelector(
    (state) => state.getBackOrderRateManufMonthwise
  );
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
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
  return (
    <>
      <Button
        size="sm"
        disabled={getBackOrderRateManufMonthwiseReducerLoader}
        className="export-Btn ml-2 mr-2 float-right"
        onClick={() =>
          ReusableExportExcel(
            getBackOrderRateManufMonthwiseData,
            `${props.ManufName} (${props.LGORT}) -Backorder Rate`
          )
        }>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle vendor-date" /> - Backorder Rate{' '}
        </span>
      </div>
      <Row className="v4">
        {!getBackOrderRateManufMonthwiseReducerLoader &&
        getBackOrderRateManufMonthwiseData != '' ? (
          <ResponsiveContainer height={320} width="100%">
            <AreaChart
              width={900}
              height={320}
              data={getBackOrderRateManufMonthwiseData}
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
            {getBackOrderRateManufMonthwiseReducerLoader ? (
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

export default BackOrderRate;
