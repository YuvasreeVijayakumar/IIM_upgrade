import { Col, Row } from 'antd';
import React from 'react';
import { XAxis, YAxis, Label, ResponsiveContainer, Bar, Tooltip, BarChart, Cell } from 'recharts';
import { useSelector } from 'react-redux';
import { YAxisFormat } from '../../ReusableComponent/YAxisFormat';

export const CapgovForecastConsumption = () => {
  const getCapGovMaterialReportData = useSelector((state) => state.getCapGovMaterialReport);
  const TooltipFormatterConsumption = (e) => {
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
                Consumption (Units):{' '}
                <span className="font-14" style={{ color: '#63ce46' }}>
                  {e.payload[0].payload.CONSUMPTION}
                </span>
              </b>{' '}
              <br />
            </span>
          ) : (
            <span className="text-white font-14">
              <b>
                Consumption (Units):{' '}
                <span className="font-14" style={{ color: '#1870dc' }}>
                  {e.payload[0].payload.CONSUMPTION}
                </span>
              </b>{' '}
              <br />
            </span>
          )}
          <span className="text-white font-14">
            <b>
              <span className="text-white font-14">
                {e.payload[0].payload.CURRENT_MONTH_CONSUMPTION > 0 ? (
                  <span className="text-white font-14">
                    <b>
                      Current Month Consumption:{' '}
                      <span className="font-14" style={{ color: '#1870dc' }}>
                        {e.payload[0].payload.CURRENT_MONTH_CONSUMPTION}
                      </span>
                    </b>
                  </span>
                ) : (
                  ''
                )}
              </span>
            </b>
          </span>
        </div>
      );
    }
  };
  return (
    <>
      <>
        <Row gutter={16}>
          <Col span={24}>
            <ResponsiveContainer height={400} width="100%">
              <BarChart
                width={500}
                height={300}
                data={getCapGovMaterialReportData}
                margin={{
                  top: 5,
                  right: 10,
                  left: 0,
                  bottom: 5
                }}>
                <XAxis
                  dataKey="DS"
                  angle={-40}
                  textAnchor="end"
                  height={150}
                  interval={0}
                  stroke="#fff"
                />
                <YAxis stroke="#fff" tickFormatter={YAxisFormat}>
                  <Label
                    value="Consumption (Units)"
                    angle="-90"
                    style={{ textAnchor: 'middle', fill: '#fff' }}
                    position="insideLeft"
                  />
                </YAxis>
                <Tooltip content={TooltipFormatterConsumption} />
                <Bar dataKey="CONSUMPTION" stackId="a">
                  {getCapGovMaterialReportData?.map((entry) => {
                    if (entry.FORCAST_FLAG == 'TRUE') {
                      return <Cell fill="#63ce46" />;
                    } else if (entry.FORCAST_FLAG == 'FALSE') {
                      return <Cell fill="#1870dc" />;
                    } else {
                      return <Cell />;
                    }
                  })}
                </Bar>
                <Bar dataKey="CURRENT_MONTH_CONSUMPTION" stackId="a" fill="#1870dc" />
              </BarChart>
            </ResponsiveContainer>
          </Col>
        </Row>
      </>
    </>
  );
};
