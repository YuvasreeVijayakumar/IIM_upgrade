import { Col, Row } from 'antd';
import React from 'react';
import {
  XAxis,
  YAxis,
  Label,
  ResponsiveContainer,
  Bar,
  ComposedChart,
  Tooltip,
  Cell,
  Line
} from 'recharts';
import { useSelector } from 'react-redux';
import { YAxisFormat } from '../../../ReusableComponent/YAxisFormat';

export const EndingOnhandView = () => {
  const getNBAManufCapGovPlotsData = useSelector((state) => state.getNBAManufCapGovPlots);
  const TooltipFormatter = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-bolder font-14">
            <b>
              Date: <span className="font-14 golden-text">{e.payload[0].payload.DS}</span>
            </b>{' '}
            <br />
          </span>
          {e.payload[0].payload.FORCAST_FLAG == 'TRUE' ? (
            <span className="text-white font-14">
              <b>
                Ending On Hand (Units):
                <span className="font-14" style={{ color: '#63ce46' }}>
                  {e.payload[0].payload.ON_HAND_UNITS}
                </span>
              </b>{' '}
              <br />
            </span>
          ) : (
            <span className="text-white font-14">
              <b>
                Ending On Hand (Units):
                <span className="font-14" style={{ color: '#1870dc' }}>
                  {e.payload[0].payload.ON_HAND_UNITS}
                </span>
              </b>{' '}
              <br />
            </span>
          )}
          <span className="text-white font-14">
            <b>
              Safety stock on hand:{' '}
              <span className="font-14" style={{ color: '#fa9105' }}>
                {e.payload[0].payload.MONTHS_ON_HAND}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  };
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <ResponsiveContainer height={400} width="100%">
            <ComposedChart
              width={500}
              height={300}
              data={getNBAManufCapGovPlotsData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}
              // ref={this.componentRefOnHandView}
            >
              <XAxis
                dataKey="DS"
                angle={-40}
                textAnchor="end"
                height={150}
                interval={0}
                stroke="#fff"
              />
              <YAxis yAxisId={1} orientation="left" stroke="#fff" tickFormatter={YAxisFormat}>
                <Label
                  value="Ending On Hand (Units)"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <YAxis yAxisId={2} orientation="right" stroke="#fff" tickFormatter={YAxisFormat}>
                <Label
                  value="Safety stock on hand"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideRight"
                />
              </YAxis>
              {/* <YAxis stroke="#fff" /> */}
              <Tooltip content={TooltipFormatter} />
              {/* <ReferenceLine y={0} stroke="#000" /> */}
              <Bar yAxisId={1} dataKey="ON_HAND_UNITS" barSize={20}>
                {getNBAManufCapGovPlotsData?.map((entry) => {
                  if (entry.FORCAST_FLAG == 'TRUE') {
                    return <Cell fill="#63ce46" />;
                  } else if (entry.FORCAST_FLAG == 'FALSE') {
                    return <Cell fill="#1870dc" />;
                  } else {
                    return <Cell />;
                  }
                })}
              </Bar>
              <Line yAxisId={2} type="monotone" dataKey="MONTHS_ON_HAND" stroke="#fa9105" />
            </ComposedChart>
          </ResponsiveContainer>
        </Col>
      </Row>
    </>
  );
};
