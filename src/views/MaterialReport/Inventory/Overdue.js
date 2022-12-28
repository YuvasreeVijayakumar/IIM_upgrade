import { Card, Col, Row, Modal } from 'antd';
import React, { useState } from 'react';
import { calculation } from '../../Calculation';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { getNBAOverdueDD } from '../../../actions';
import { OverDueDD } from './OverDueDD';

export const Overdue = (props) => {
  const dispatch = useDispatch();
  const getNBAOverdueData = useSelector((state) => state.getNBAOverdue);
  const getNBAOverdueReducerLoader = useSelector((state) => state.getNBAOverdueReducerLoader);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    setIsModalVisible(true);
    dispatch(getNBAOverdueDD(props.Material, props.LGORT));
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
              Overdue Quantity - {props.Material} ({props.LGORT})
            </Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <>
          <OverDueDD Material={props.Material} LGORT={props.LGORT} />
        </>
      </Modal>
      <Card
        bodyStyle={{ height: 100 }}
        title={
          <span className="nba-title">
            Overdue Quantity
            <span className="float-right">
              {' '}
              <i className="far fa-external-link-alt mr-3" onClick={() => showModal()}></i>
            </span>
          </span>
        }>
        {!getNBAOverdueReducerLoader ? (
          <Row gutter={16}>
            <Col span={24} className="mt-3 mb-3 pl-4">
              <div className="nba-text-big float-left">
                {calculation(getNBAOverdueData[0]?.overduevalue)}
                <span className="nba-text-small text-blue">
                  ({getNBAOverdueData[0]?.overduetoday})
                </span>
              </div>
              <div className="nba-div-icon float-right pr-4">
                {' '}
                <i className="fas fa-exclamation-triangle"></i>
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
