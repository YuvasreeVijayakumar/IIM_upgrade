import React from 'react';
import { Row, Col } from 'antd';
import { useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { XAxis, YAxis, Label, ResponsiveContainer, Bar, BarChart, Tooltip } from 'recharts';
import { YAxisFormat } from '../../../ReusableComponent/YAxisFormat';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';

export const OrdersOverviewBarchart = () => {
  const getNBAManufCapGovPlotsData = useSelector((state) => state.getNBAManufCapGovPlots);

  const TooltipFormatterStackedBar = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-bolder font-14">
            <b>
              Date: <span className="font-14 golden-text">{e.payload[0].payload.DS}</span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Actual Deliveries:{' '}
              <span className="font-14" style={{ color: '#1870dc' }}>
                {e.payload[0].payload.ACTUAL_DELIVERIES}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Current On Orders:{' '}
              <span className="font-14" style={{ color: '#fa9105' }}>
                {e.payload[0].payload.CURRENT_ON_ORDERS}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Recommended New Order:{' '}
              <span className="font-14" style={{ color: '#63ce46' }}>
                {e.payload[0].payload.RECOMMENDED_NEW_ORDER}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  };
  return (
    <div className="card-alignment">
      <Row className="v4">
        <Col span={24}>
          {getNBAManufCapGovPlotsData.length > 0 ? (
            <div className="text-center pd-2 chart-legend">
              <span>
                <i className="fas fa-circle total-trend ml-2" /> - Actual Deliveries
              </span>
              <span>
                <i className="fas fa-circle predicted-consumption ml-2" /> Current On Orders
              </span>
              <span>
                <i className="fas fa-circle predict-capex ml-2" /> Recommended New Order
              </span>
            </div>
          ) : (
            ''
          )}
          {getNBAManufCapGovPlotsData.length > 0 ? (
            <>
              <ResponsiveContainer height={400} width="100%">
                <BarChart
                  width={500}
                  height={300}
                  data={getNBAManufCapGovPlotsData}
                  margin={{
                    top: 10,
                    right: 0,
                    left: 0,
                    bottom: 0
                  }}
                  // ref={this.componentRefQuantityToOrder}
                >
                  <XAxis
                    dataKey="DS"
                    angle={-40}
                    textAnchor="end"
                    height={150}
                    interval={0}
                    stroke="#fff"
                  />
                  <YAxis stroke="#fff" tickFormatter={YAxisFormat}>
                    {' '}
                    <Label
                      value="WareHouse Inbound"
                      angle="-90"
                      style={{
                        textAnchor: 'middle',
                        fill: '#fff'
                      }}
                      position="insideLeft"
                    />
                  </YAxis>
                  <Tooltip content={TooltipFormatterStackedBar} />

                  <Bar dataKey="ACTUAL_DELIVERIES" fill="#1870dc" stackId="a" />
                  <Bar dataKey="CURRENT_ON_ORDERS" fill="#fa9105" stackId="a" />
                  <Bar dataKey="RECOMMENDED_NEW_ORDER" fill="#63ce46" stackId="a" />
                </BarChart>
              </ResponsiveContainer>
            </>
          ) : (
            <div style={{ height: '400px' }}>
              <ReusableSysncLoader />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};
