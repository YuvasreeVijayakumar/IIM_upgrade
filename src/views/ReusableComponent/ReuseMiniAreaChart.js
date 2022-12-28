import React from 'react';
import { AreaChart, Area, Tooltip, ResponsiveContainer } from 'recharts';

export const ReuseMiniAreaChart = (props) => {
  return (
    <>
      {' '}
      <ResponsiveContainer height={100} width="100%">
        <AreaChart
          width={500}
          height={100}
          data={props.data}
          margin={{
            top: 0,
            right: 0,
            left: 10,
            bottom: 0
          }}>
          <Tooltip content={props.Tooltip} />
          <Area
            type="monotone"
            dataKey={props.dataKey}
            strokeWidth={3}
            stroke={props.stroke}
            fill={props.fill}
          />
        </AreaChart>
      </ResponsiveContainer>
    </>
  );
};
