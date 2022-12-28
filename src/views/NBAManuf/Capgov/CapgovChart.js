import React from 'react';

import { useSelector } from 'react-redux';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';
import { calculation } from '../../Calculation';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

const CapgovChart = () => {
  const getNBAManufCapGovGraphReducerLoader = useSelector(
    (state) => state.getNBAManufCapGovGraphReducerLoader
  );
  const getNBAManufCapGovGraphData = useSelector((state) => state.getNBAManufCapGovGraph);
  const getNBAManufCapGovPercentData = useSelector((state) => state.getNBAManufCapGovPercent);
  const getNBAManufCapGovPercentReducerLoader = useSelector(
    (state) => state.getNBAManufCapGovPercentReducerLoader
  );

  const TooltipFormat = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.MONTHLY).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b> {value}</b> <br />
          </span>
          <span>
            <b>Total Capex : {calculation(e.payload[0].payload.CAP_GOV)}</b> <br />
          </span>
        </div>
      );
    }
  };

  return (
    <div>
      {!getNBAManufCapGovGraphReducerLoader && getNBAManufCapGovGraphData.length > 0 ? (
        <div>
          {' '}
          <ResponsiveContainer height={90} width="100%" className="nba-manuf-chart">
            <AreaChart
              width={100}
              height={100}
              data={getNBAManufCapGovGraphData}
              margin={{
                top: 0,
                right: 10,
                left: 10,
                bottom: 0
              }}>
              <Tooltip content={TooltipFormat} />
              <Area
                type="monotone"
                dataKey="CAP_GOV"
                strokeWidth={3}
                stroke="#a83232"
                fill="#a83232"
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="text-center text-white mb-1">
            {!getNBAManufCapGovPercentReducerLoader ? (
              <span className="widget-sub-text">
                <span></span>
                <span className="ml-2">
                  {getNBAManufCapGovPercentData[0]?.FLAG === 'DECREASED' ? (
                    <span className="indicated-red">
                      <i className="fas fa-long-arrow-alt-down"></i>
                    </span>
                  ) : getNBAManufCapGovPercentData[0]?.FLAG === 'INCREASED' ? (
                    <span className="indicated-green">
                      <i className="fas fa-long-arrow-alt-up"></i>
                    </span>
                  ) : (
                    <span></span>
                  )}{' '}
                  {getNBAManufCapGovPercentData[0]?.PERCENT_CHANGE} % vs Previous Month
                </span>
              </span>
            ) : (
              <span className="Nba-load-height">
                {getNBAManufCapGovPercentReducerLoader ? '' : ''}
              </span>
            )}
          </div>
        </div>
      ) : (
        <ResponsiveContainer height={190} width="100%" className="nba-manuf-chart">
          {getNBAManufCapGovGraphReducerLoader ? (
            <>
              {' '}
              <ReusableSysncLoader />
            </>
          ) : (
            <>
              {' '}
              <NoDataTextLoader />
            </>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default CapgovChart;
