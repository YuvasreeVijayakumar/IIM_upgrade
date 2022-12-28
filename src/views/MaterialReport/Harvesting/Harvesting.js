import React from 'react';
import { Col, Row } from 'antd';
import { HarvestingWidjet } from './HarvestingWidjet';

export const Harvesting = (props) => {
  return (
    <>
      <Row gutter={16}>
        <Col span={24}>
          <HarvestingWidjet Material={props.Material} LGORT={props.LGORT} />
        </Col>
      </Row>
    </>
  );
};
