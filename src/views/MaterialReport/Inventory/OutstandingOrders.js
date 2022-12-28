import React, { useState } from 'react';
import { Card, Col, Row, Modal, Switch } from 'antd';
import { calculation } from '../../Calculation';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { OutstandingOrdersDD } from './OutstandingOrdersDD';
import { getNBAOutstandingOrdersDD } from '../../../actions';
import OutstandingordersChart from './OutstandingordersChart ';

export const OutstandingOrders = (props) => {
  const dispatch = useDispatch();

  const getNBAOutstandingOrdersData = useSelector((state) => state.getNBAOutstandingOrders);
  const getNBAOutstandingOrdersReducerLoader = useSelector(
    (state) => state.getNBAOutstandingOrdersReducerLoader
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [showcomp, setshowcomp] = useState(true);
  const showModal = () => {
    setIsModalVisible(true);
    dispatch(getNBAOutstandingOrdersDD(props.Material, props.LGORT));
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setshowcomp(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setshowcomp(true);
  };
  const switchcomponent = (e) => {
    setshowcomp(e);
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
              Outstanding Quantity - {props.Material} ({props.LGORT})
              <Switch
                checkedChildren="Table"
                unCheckedChildren="Chart"
                defaultChecked
                className="pull-right mr-5"
                onChange={switchcomponent}
              />
            </Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <>
          {showcomp ? (
            <OutstandingOrdersDD Material={props.Material} LGORT={props.LGORT} />
          ) : (
            <OutstandingordersChart Material={props.Material} LGORT={props.LGORT} />
          )}
        </>
      </Modal>
      <Card
        bodyStyle={{ height: 100 }}
        title={
          <span className="nba-title">
            Outstanding Quantity{' '}
            <span className="float-right">
              {' '}
              <i className="far fa-external-link-alt mr-3" onClick={() => showModal()}></i>
            </span>
          </span>
        }>
        {!getNBAOutstandingOrdersReducerLoader ? (
          <Row gutter={16}>
            <Col span={24} className="mt-3 mb-3 pl-4">
              <div className="nba-text-big float-left">
                {calculation(getNBAOutstandingOrdersData[0]?.outstandingordersvalue)}
                <span className="nba-text-small text-blue">
                  ({getNBAOutstandingOrdersData[0]?.outstandingorders})
                </span>
              </div>
              <div className="nba-div-icon float-right pr-4">
                {' '}
                <i className="fas fa-cubes"></i>
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
