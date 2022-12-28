import React from 'react';
// getHarvestChartDD
import { ResponsiveContainer, XAxis, Label, Line, YAxis, LineChart, Tooltip } from 'recharts';
import { useSelector } from 'react-redux';

import moment from 'moment';
import { Row } from 'antd';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

export const ERTQtyChart = () => {
  const getHarvestChartDDData = useSelector((state) => state.getHarvestChartDD);
  const getHarvestChartDDReducerLoader = useSelector(
    (state) => state.getHarvestChartDDReducerLoader
  );
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormat = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span>
            <b>{e.payload[0].payload.year}</b> <br />
          </span>
          <span>
            <b>ERT Quantity: {e.payload[0].payload.ERT_Qty}</b> <br />
          </span>
        </div>
      );
    }
  };
  return (
    <>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle vendor-date" /> - ERT QTY{' '}
        </span>
      </div>
      <Row className="v4">
        {!getHarvestChartDDReducerLoader && getHarvestChartDDData.length > 0 ? (
          <ResponsiveContainer height={350} width="100%">
            <LineChart
              width={900}
              height={350}
              data={getHarvestChartDDData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              <XAxis
                dataKey="year"
                angle={-40}
                tickFormatter={formatXAxis}
                textAnchor="end"
                height={150}
                interval={0}
                stroke="#fff">
                <Label
                  value="  Date"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  // position="insideLeft"
                  position="centerBottom"
                />
              </XAxis>
              <YAxis stroke="#fff">
                {' '}
                <Label
                  value="ERT Quantity"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={TooltipFormat} />

              <Line
                type="monotone"
                dataKey="ERT_Qty"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer height={350} width="100%">
            {getHarvestChartDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
          </ResponsiveContainer>
        )}
      </Row>
    </>
  );
};
