import { Card, Col, Row } from 'antd';
import React from 'react';

import { OrdersOverviewBarchart } from '../OrdersOverView/OrdersOverviewBarchart';
import { CapgovForecastConsumption } from './CapgovForecastConsumption';
import { EndingOnhandView } from './EndingOnhandView';
import { CapgovInstallBase } from './CapgovInstallBase';

export const CapgovDrilldown = () => {
  return (
    <>
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
    </>
  );
};
