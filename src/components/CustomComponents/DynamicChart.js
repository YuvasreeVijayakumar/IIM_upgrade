import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  Label,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import {} from 'antd';

export const LineChartjs = (props) => {
  return (
    <div>
      <ResponsiveContainer height={400} width="100%">
        <LineChart
          width={900}
          height={400}
          data={props.data}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 0
          }}>
          <XAxis
            dataKey={props.Xdatakey}
            angle={-40}
            textAnchor="end"
            tick={{ fontSize: 12 }}
            height={150}
            interval={0}
            stroke="#B2B1B9"
            tickFormatter={props.formatXAxis}>
            <Label
              value={props.Xvalue}
              style={{ textAnchor: 'middle', fill: '#fff' }}
              position="centerBottom"
            />
          </XAxis>
          <YAxis tick={{ fontSize: 12 }} stroke="#B2B1B9">
            <Label
              value={props.Yvalue}
              angle="-90"
              style={{ textAnchor: 'middle', fill: '#fff' }}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip content={props.Tooltip} />
          <Legend content={props.Legend} />
          <Line
            type="monotone"
            dataKey={props.Ydatakey}
            stroke={props.stroke}
            fill={props.fill}
            strokeWidth={2}
            dot={false}
            radius={[5, 5, 0, 0]}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const AreaChartjs = (props) => {
  return (
    <div>
      <ResponsiveContainer height={400} width="100%">
        <AreaChart
          width={900}
          height={400}
          data={props.data}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 0
          }}>
          <XAxis
            dataKey={props.Xdatakey}
            angle={-40}
            textAnchor="end"
            height={150}
            interval={0}
            stroke="#B2B1B9"
            tick={{ fontSize: 12 }}
            tickFormatter={props.formatXAxis}>
            <Label
              value={props.Xvalue}
              style={{ textAnchor: 'middle', fill: '#fff' }}
              position="centerBottom"
            />
          </XAxis>
          <Tooltip content={props.Tooltip} />
          <YAxis tick={{ fontSize: 12 }} stroke="#B2B1B9">
            <Label
              value={props.Yvalue}
              angle="-90"
              style={{ textAnchor: 'middle', fill: '#fff' }}
              position="insideLeft"
            />
          </YAxis>
          <Legend content={props.Legend} />
          <Area
            type="monotone"
            dataKey={props.Ydatakey}
            stroke={props.stroke}
            fill={props.fill}
            strokeWidth={2}
            dot={false}
            radius={[5, 5, 0, 0]}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BarChartjs = (props) => {
  return (
    <div>
      <ResponsiveContainer height={400} width="100%">
        <BarChart
          width={900}
          height={400}
          data={props.data}
          margin={{
            top: 10,
            right: 30,
            left: 10,
            bottom: 0
          }}
          barSize={40}>
          <XAxis
            dataKey={props.Xdatakey}
            angle={-40}
            textAnchor="end"
            height={150}
            interval={0}
            tick={{ fontSize: 12 }}
            stroke="#B2B1B9"
            tickFormatter={props.formatXAxis}>
            <Label
              value={props.Xvalue}
              style={{ textAnchor: 'middle', fill: '#fff' }}
              position="centerBottom"
            />
          </XAxis>
          <YAxis tick={{ fontSize: 12 }} stroke="#B2B1B9">
            <Label
              value={props.Yvalue}
              angle="-90"
              style={{ textAnchor: 'middle', fill: '#fff' }}
              position="insideLeft"
            />
          </YAxis>
          <Tooltip content={props.Tooltip} />
          <Legend content={props.Legend} />
          <Bar
            type="monotone"
            dataKey={props.Ydatakey}
            stroke={props.stroke}
            fill={props.fill}
            strokeWidth={2}
            dot={false}
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export const DynamicChart = (props) => {
  return (
    <div>
      {props.chart === 'AREA' ? (
        <AreaChartjs
          data={props.data}
          fill={props.fill}
          stroke={props.stroke}
          formatXAxis={props.formatXAxis}
          Tooltip={props.Tooltip}
          Ydatakey={props.Ydatakey}
          Xdatakey={props.Xdatakey}
          Xvalue={props.Xvalue}
          Yvalue={props.Yvalue}
          Legend={props.Legend}
        />
      ) : (
        ''
      )}
      {props.chart === 'BAR' ? (
        <BarChartjs
          data={props.data}
          fill={props.fill}
          stroke={props.stroke}
          formatXAxis={props.formatXAxis}
          Tooltip={props.Tooltip}
          Ydatakey={props.Ydatakey}
          Xdatakey={props.Xdatakey}
          Xvalue={props.Xvalue}
          Yvalue={props.Yvalue}
          Legend={props.Legend}
        />
      ) : (
        ''
      )}
      {props.chart === 'LINE' ? (
        <LineChartjs
          data={props.data}
          fill={props.fill}
          stroke={props.stroke}
          formatXAxis={props.formatXAxis}
          Tooltip={props.Tooltip}
          Ydatakey={props.Ydatakey}
          Xdatakey={props.Xdatakey}
          Xvalue={props.Xvalue}
          Yvalue={props.Yvalue}
          Legend={props.Legend}
        />
      ) : (
        ''
      )}
    </div>
  );
};
