import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';
import { Modal, Row, Col, Card } from 'antd';
import { EndingOnhandView } from '../../MaterialReport/CapgovDrilldown/EndingOnhandView';
import { CapgovForecastConsumption } from '../../MaterialReport/CapgovDrilldown/CapgovForecastConsumption';
import { OrdersOverviewBarchart } from '../../MaterialReport/OrdersOverView/OrdersOverviewBarchart';
import { CapgovInstallBase } from '../../MaterialReport/CapgovDrilldown/CapgovInstallBase';
import { calculation } from '../../Calculation';
import moment from 'moment';

export const CapGovLineChart = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const getNBAOrgCapGovChartData = useSelector((state) => state.getNBAOrgCapGovChart);
  const getNBAOrgCapGovRequestData = useSelector((state) => state.getNBAOrgCapGovRequest);
  const getNBAOrgCapGovRequestLoaderReducer = useSelector(
    (state) => state.getNBAOrgCapGovRequestLoaderReducer
  );

  const TooltipFormatter = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = calculation(e.payload[0].payload.CAP_GOV);
      let date = moment(e.payload[0].payload.date).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>{date}</b> <br />
          </span>

          <span>
            <b> Total CapEx: {value}</b> <br />
          </span>
        </div>
      );
    }
  };

  return (
    <div className="org-cap-chart-top ">
      <ResponsiveContainer height={90} width="100%">
        <AreaChart
          width={100}
          height={100}
          data={getNBAOrgCapGovChartData}
          margin={{
            top: 0,
            right: 10,
            left: 10,
            bottom: 0
          }}>
          <defs>
            <linearGradient id="colorCapgov" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#A0BCC2" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#A0BCC2" stopOpacity={0.2} />
            </linearGradient>
          </defs>
          <Tooltip content={TooltipFormatter} />

          <Area
            type="monotone"
            dataKey="CAP_GOV"
            fill="url(#colorCapgov)"
            stroke="url(#colorCapgov)"
            strokeWidth={3}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
      <div className="text-center text-white mb-1">
        {!getNBAOrgCapGovRequestLoaderReducer ? (
          <span className="widget-sub-text">
            <span></span>
            <span className="ml-2">
              {getNBAOrgCapGovRequestData[0]?.FLAG === 'DECREASED' ? (
                <span className="indicated-red">
                  <i className="fas fa-long-arrow-alt-down"></i>
                </span>
              ) : getNBAOrgCapGovRequestData[0]?.FLAG === 'INCREASED' ? (
                <span className="indicated-green">
                  <i className="fas fa-long-arrow-alt-up"></i>
                </span>
              ) : (
                <span></span>
              )}{' '}
              {getNBAOrgCapGovRequestData[0]?.PERCENT_CHANGE} % vs Previous Month
            </span>
          </span>
        ) : (
          <span className="Nba-load-height">{getNBAOrgCapGovRequestLoaderReducer ? '' : ''}</span>
        )}
      </div>
      <Modal
        title={<span>CapGov Organization Report</span>}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="90%"
        destroyOnClose
        height="auto">
        <Row gutter={16}>
          <Col span={12}>
            <Card title={<span>Ending On Hand View</span>}>
              <EndingOnhandView />
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<span>Forecast Consumption</span>}>
              <CapgovForecastConsumption />
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Card bodyStyle={{ height: '436px' }} title={<span>Quantity To Order</span>}>
              <OrdersOverviewBarchart />
            </Card>
          </Col>
          <Col span={12}>
            <>
              <Card bodyStyle={{ height: '492px' }}>
                <CapgovInstallBase />
              </Card>
            </>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
