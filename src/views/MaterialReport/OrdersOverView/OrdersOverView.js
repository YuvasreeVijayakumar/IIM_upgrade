import React from 'react';
import { Card, Col, Row } from 'antd';
import { PieChartOrdersToReview } from './PieChartOrdersToReview';
import { OrdersOverviewBarchart } from './OrdersOverviewBarchart';
import { useSelector } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { ResponsiveContainer } from 'recharts';

export const OrdersOverView = () => {
  const getCapGovMaterialReportLoaderReducer = useSelector(
    (state) => state.getCapGovMaterialReportLoaderReducer
  );
  return (
    <>
      <Card
        title={
          <span>
            {' '}
            <i className="fas fa-book-open mr-2"></i>Orders OverView
          </span>
        }>
        <ResponsiveContainer height={300} width="100%">
          <>
            {' '}
            {!getCapGovMaterialReportLoaderReducer ? (
              <Row gutter={16}>
                <Col span={16}>
                  <OrdersOverviewBarchart />
                </Col>
                <Col span={8}>
                  <PieChartOrdersToReview />
                </Col>
              </Row>
            ) : (
              <ReusableSysncLoader />
            )}
          </>
        </ResponsiveContainer>
      </Card>
    </>
  );
};
