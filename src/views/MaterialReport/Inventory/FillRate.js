import { Card, Col, Row, Modal } from 'antd';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { useDispatch } from 'react-redux';
import { getNBAFillrateDD } from '../../../actions';
import { FillrateDD } from './FillrateDD';

export const FillRate = (props) => {
  const dispatch = useDispatch();
  const getNBAFillrateData = useSelector((state) => state.getNBAFillrate);
  const getNBAFillrateReducerLoader = useSelector((state) => state.getNBAFillrateReducerLoader);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
    dispatch(getNBAFillrateDD(props.Material, props.LGORT));
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
        width="60%"
        footer={null}
        destroyOnClose
        title={
          <Row>
            <Col span={24}>
              Fill Rate - {props.Material} ({props.LGORT})
            </Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <>
          <FillrateDD Material={props.Material} LGORT={props.LGORT} />
        </>
      </Modal>
      <Card
        bodyStyle={{ height: 100 }}
        title={
          <span className="nba-title">
            FillRate{' '}
            <span className="float-right">
              {' '}
              <i className="far fa-external-link-alt mr-3" onClick={() => showModal()}></i>
            </span>
          </span>
        }>
        {!getNBAFillrateReducerLoader ? (
          <Row gutter={16}>
            <Col span={24} className="mt-3 mb-3 pl-4">
              <div className="nba-text-big float-left">
                {getNBAFillrateData[0]?.fillrate}%<span className="nba-text-small"></span>
              </div>
              <div className="nba-div-icon float-right pr-4">
                {' '}
                <i className="fas fa-fill"></i>
              </div>
            </Col>
          </Row>
        ) : (
          <ReusableSysncLoader />
        )}
      </Card>
    </>
  );
};
