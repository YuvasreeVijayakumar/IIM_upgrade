import { Card, Col, Row, Modal } from 'antd';
import React, { useState } from 'react';
import { ReuseMiniAreaChart } from '../../ReusableComponent/ReuseMiniAreaChart';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { getHarvestChartDD } from '../../../actions';
import { ERTQtyChart } from './ERTQtyChart';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

export const ERTMainCard = (props) => {
  const dispatch = useDispatch();
  const getHarvestChartDDData = useSelector((state) => state.getHarvestChartDD);
  const getHarvestChartDDReducerLoader = useSelector(
    (state) => state.getHarvestChartDDReducerLoader
  );
  const getNBAHarvestingData = useSelector((state) => state.getNBAHarvesting);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const TooltipFormat = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span>
            <b>{e.payload[0].payload.year}</b> <br />
          </span>
          <span>
            <b>ERT Quantity: {e.payload[0].payload.ERT_Qty}</b> <br />
          </span>
        </div>
      );
    }
  };
  const showModal = () => {
    // if (e == 'chart') {
    setIsModalVisible(true);
    dispatch(getHarvestChartDD(props.Material, props.LGORT));

    // }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Modal
        style={{ top: 120 }}
        width="90%"
        footer={null}
        title={
          <Row>
            <Col span={24}> Monthly ERT Trend</Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <ERTQtyChart />
      </Modal>
      <Card
        bodyStyle={{ height: '150px' }}
        title={
          <span>
            {' '}
            <i className="fal fa-exchange-alt mr-2"></i>Total ERT Received{' '}
            <i
              className="far fa-external-link-alt float-right mr-3"
              onClick={() => showModal()}></i>
          </span>
        }>
        {!getHarvestChartDDReducerLoader && getHarvestChartDDData.length > 0 ? (
          <>
            {' '}
            <Row>
              <Col span={7} className="text-center nba-har-wid mt-3">
                <div className="nba-text-big text-center">
                  <span className="nba-text-small text-white">
                    {getNBAHarvestingData[0]?.ErtQty}
                  </span>
                </div>
                <div>
                  <span className=" text-white fs-16 mt-2">ERT Qty</span>
                </div>
              </Col>
              <Col span={17} className="nba-main-chart">
                <ReuseMiniAreaChart
                  data={getHarvestChartDDData}
                  dataKey={'ERT_Qty'}
                  stroke={'#FF8C8C'}
                  fill={'#FF8C8C'}
                  Tooltip={TooltipFormat}
                />
              </Col>
            </Row>
          </>
        ) : (
          <>{getHarvestChartDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}</>
        )}
      </Card>
    </>
  );
};
