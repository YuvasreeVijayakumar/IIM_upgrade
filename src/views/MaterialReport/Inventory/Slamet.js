import { Card, Col, Row, Modal } from 'antd';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { SlametDD } from './SlametDD';
import { getNBASlaMetDD } from '../../../actions';

export const Slamet = (props) => {
  const dispatch = useDispatch();
  const getNBASlaMetData = useSelector((state) => state.getNBASlaMet);
  const getNBASlaMetReducerLoader = useSelector((state) => state.getNBASlaMetReducerLoader);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
    dispatch(getNBASlaMetDD(props.Material, props.LGORT));
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
        destroyOnClose
        title={
          <Row>
            <Col span={24}>
              SLA MET - {props.Material} ({props.LGORT})
            </Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <>
          <SlametDD />
        </>
      </Modal>
      <Card
        bodyStyle={{ height: 100 }}
        title={
          <span className="nba-title">
            SLA MET{' '}
            <span className="float-right">
              {' '}
              <i className="far fa-external-link-alt mr-3" onClick={() => showModal()}></i>
            </span>
          </span>
        }>
        {!getNBASlaMetReducerLoader ? (
          <Row gutter={16}>
            <Col span={24} className="mt-3 mb-3 pl-4">
              <div className="nba-text-big float-left">
                {getNBASlaMetData[0]?.Perfect_Order_Rate}%<span className="nba-text-small"></span>
              </div>
              <div className="nba-div-icon float-right pr-4">
                {' '}
                <i className="fas fa-truck-loading"></i>
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
