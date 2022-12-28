import React, { useEffect } from 'react';
import { getForcastAccuracyManufMonthwise } from '../../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Button } from 'antd';
import { ResponsiveContainer, XAxis, Label, Tooltip, YAxis, LineChart, Line } from 'recharts';

import moment from 'moment';

import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { ReusableExportExcel } from '../../ReusableComponent/ReusableExportExcel';

const ForecatAccuracy = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(
      getForcastAccuracyManufMonthwise(
        encodeURIComponent(props.ManufName),
        props.LGORT,
        'all',
        'all'
      )
    );
  }, []);

  const getForcastAccuracyManufMonthwiseReducerLoader = useSelector(
    (state) => state.getForcastAccuracyManufMonthwiseReducerLoader
  );

  const getForcastAccuracyManufMonthwiseData = useSelector(
    (state) => state.getForcastAccuracyManufMonthwise
  );
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormatFAD = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>Forecast Accuracy: {e.payload[0].payload.Forcast_Accuracy}</b> <br />
          </span>
        </div>
      );
    }
  };
  return (
    <>
      <Button
        size="sm"
        disabled={getForcastAccuracyManufMonthwiseReducerLoader}
        className="export-Btn ml-2 mr-2 float-right"
        onClick={() =>
          ReusableExportExcel(
            getForcastAccuracyManufMonthwiseData,
            `${props.ManufName} (${props.LGORT}) -  Forecast Accuracy`
          )
        }>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle vendor-date" /> - Forecast Accuracy{' '}
        </span>
      </div>
      <Row className="v4">
        {!getForcastAccuracyManufMonthwiseReducerLoader &&
        getForcastAccuracyManufMonthwiseData.length > 0 ? (
          <ResponsiveContainer height={320} width="100%">
            <LineChart
              width={900}
              height={320}
              data={getForcastAccuracyManufMonthwiseData}
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
                  value="  Monthly"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  // position="insideLeft"
                  position="centerBottom"
                />
              </XAxis>
              <YAxis stroke="#fff">
                {' '}
                <Label
                  value=" Forecast Accuracy"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={TooltipFormatFAD} />

              <Line
                type="monotone"
                dataKey="Forcast_Accuracy"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer height={320} width="100%">
            {getForcastAccuracyManufMonthwiseReducerLoader ? (
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

export default ForecatAccuracy;
