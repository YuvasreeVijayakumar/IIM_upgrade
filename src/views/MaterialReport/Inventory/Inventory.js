import { Col, Row } from 'antd';
import React from 'react';

import { OutstandingOrders } from './OutstandingOrders';
import { FillRate } from './FillRate';
import { Slamet } from './Slamet';

import { Overdue } from './Overdue';

export const Inventory = (props) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <OutstandingOrders Material={props.Material} LGORT={props.LGORT} />
        </Col>
        <Col span={6}>
          <Overdue Material={props.Material} LGORT={props.LGORT} />
        </Col>
        <Col span={6}>
          <FillRate Material={props.Material} LGORT={props.LGORT} />
        </Col>
        <Col span={6}>
          <Slamet Material={props.Material} LGORT={props.LGORT} />
        </Col>
      </Row>
    </>
  );
};
