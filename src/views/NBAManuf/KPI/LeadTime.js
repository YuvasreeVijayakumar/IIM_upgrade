import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getLeadTimeTrendingManuf } from '../../../actions';

import { Row, Button } from 'antd';
import { ResponsiveContainer, XAxis, Label, Tooltip, YAxis, AreaChart, Area } from 'recharts';

import moment from 'moment';

import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { ReusableExportExcel } from '../../ReusableComponent/ReusableExportExcel';

const LeadTime = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getLeadTimeTrendingManuf(encodeURIComponent(props.ManufName)));
  }, []);
  const getLeadTimeTrendingManufData = useSelector((state) => state.getLeadTimeTrendingManuf);
  const getLeadTimeTrendingManufReducerLoader = useSelector(
    (state) => state.getLeadTimeTrendingManufReducerLoader
  );
  const TooltipFormatterLeadTimeTrend = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>Monthly: {moment(e.payload[0].payload.PO_DATE).format('MMM-YYYY')}</b> <br />
          </span>
          <span className="text-white">
            <b>Median: {e.payload[0].payload.MEDIAN} Days</b> <br />
          </span>
        </div>
      );
    }
  };
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MMM-YYYY');
  };
  return (
    <>
      <Button
        size="sm"
        disabled={getLeadTimeTrendingManufReducerLoader}
        className="export-Btn ml-2 mr-2 float-right"
        onClick={() =>
          ReusableExportExcel(
            getLeadTimeTrendingManufData,
            `${props.ManufName} (${props.LGORT}) - LeadTime Median`
          )
        }>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle leadtime" /> - LeadTime Median{' '}
        </span>
      </div>
      <Row className="v4">
        {!getLeadTimeTrendingManufReducerLoader && getLeadTimeTrendingManufData != '' ? (
          <ResponsiveContainer height={320} width="100%">
            <AreaChart
              width={900}
              height={320}
              data={getLeadTimeTrendingManufData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              <defs>
                <linearGradient id="colorLeadTime" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#ff7300" stopOpacity={0.7} />
                  <stop offset="90%" stopColor="#ff7300" stopOpacity={0.3} />
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
                  value="Receipt Date"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  // position="insideLeft"
                  position="centerBottom"
                />
              </XAxis>
              <YAxis stroke="#fff">
                {' '}
                <Label
                  value="LeadTime"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={TooltipFormatterLeadTimeTrend} />

              <Area
                type="monotone"
                dataKey="MEDIAN"
                fill="url(#colorLeadTime)"
                stroke="url(#colorLeadTime)"
                strokeWidth={3}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <>
            {getLeadTimeTrendingManufReducerLoader ? (
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

export default LeadTime;
