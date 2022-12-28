import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPOMaterialChart } from '../../../../actions';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Label, Tooltip } from 'recharts';
import moment from 'moment';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';
import { Button } from 'antd';
import { ReusableExportExcel } from '../../../ReusableComponent/ReusableExportExcel';

export const OrderHistory = (props) => {
  const getPOMaterialChartData = useSelector((state) => state.getPOMaterialChart);
  const getPOMaterialChartReducerLoader = useSelector(
    (state) => state.getPOMaterialChartReducerLoader
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPOMaterialChart(props.Material, props.LGORT));
  }, []);
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormatterThree = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.PO_DATE).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>PO Date: {value}</b> <br />
          </span>
          <span className="text-white">
            <b>Delivered Quantity: {e.payload[0].payload.Delivered_Quantity}</b> <br />
          </span>
          {e.payload[0].payload.Open_Quantity > 0 ? (
            <>
              <span className="text-white">
                <b>Open Quantity: {e.payload[0].payload.Open_Quantity}</b> <br />
              </span>
            </>
          ) : (
            ''
          )}
        </div>
      );
    }
  };

  return (
    <>
      <Button
        size="sm"
        disabled={getPOMaterialChartReducerLoader}
        className="export-Btn mr-4 float-right"
        onClick={() =>
          ReusableExportExcel(
            getPOMaterialChartData,
            `${props.Material} (${props.LGORT})-Orders History`
          )
        }>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend">
        <span>
          <i className="fas fa-circle total-trend" /> - Delivered Quantity{' '}
        </span>
        <span>
          {' '}
          <i className="fas fa-circle predicted-consumption" /> - Open Quantity
        </span>
      </div>
      <ResponsiveContainer height={350} width="100%">
        {!getPOMaterialChartReducerLoader && getPOMaterialChartData != '' ? (
          <BarChart
            width={900}
            height={400}
            data={getPOMaterialChartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}>
            <XAxis
              dataKey="PO_DATE"
              angle={-40}
              tickFormatter={formatXAxis}
              textAnchor="end"
              height={150}
              interval={0}
              stroke="#fff">
              <Label
                value="PO Date"
                style={{ textAnchor: 'middle', fill: '#fff' }}
                // position="insideLeft"
                position="centerBottom"
              />
            </XAxis>
            <YAxis stroke="#fff">
              {' '}
              <Label
                value=" Quantity"
                angle="-90"
                style={{ textAnchor: 'middle', fill: '#fff' }}
                position="insideLeft"
              />
            </YAxis>
            <Tooltip content={TooltipFormatterThree} />
            <Bar dataKey="Delivered_Quantity" stackId="a" fill="#1870dc" />
            <Bar dataKey="Open_Quantity" stackId="a" fill="#fa9105" />
          </BarChart>
        ) : (
          <>{getPOMaterialChartReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}</>
        )}
      </ResponsiveContainer>
    </>
  );
};
