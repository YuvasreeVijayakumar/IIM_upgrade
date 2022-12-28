import React from 'react';

import { Row, Col, Card, Button } from 'antd';

export const Recomentation = () => {
  return (
    <>
      <Card title="Recommandations">
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <span>
                Transfer <br />
                Inventory
              </span>
            </Card>
          </Col>
          <Col span={12}>
            <Card>
              <span>Inventory Approching exaust date. Place transfeer request from plan 9001</span>
            </Card>
          </Col>
          <Col span={6}>
            <Button>Get started</Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Card>
              <span>Order management</span>
            </Card>
          </Col>
          <Col span={12}>
            <Card> Place a new Order to vendor 109801</Card>
          </Col>
          <Col span={6}>
            <Button>Get started</Button>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={6}>
            <Card>Expedine Order</Card>
          </Col>
          <Col span={12}>
            <Card />
          </Col>
          <Col span={6}>
            <Button>Get started</Button>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Card>What if senarios</Card>
          </Col>
          <Col span={12}>
            <Card>Check the propabality of backorder due to under stock</Card>
          </Col>
          <Col span={6}>
            <Button>Get started</Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};
