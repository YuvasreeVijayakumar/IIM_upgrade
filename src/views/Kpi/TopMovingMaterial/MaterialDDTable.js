import React, { useState } from 'react';
import { Button, Col, Modal, Row } from 'antd';
import { useDispatch } from 'react-redux';
import { getTopTrendingMaterialGraph } from '../../../actions';
import TopMovingActionTrend from './TopMovingActionTrend';

export const MaterialDDTable = ({ row }) => {
  const dispatch = useDispatch();

  const [modalVisible, setModalVisible] = useState(false);
  const handleCancel = () => {
    setModalVisible(false);
  };
  return (
    <div>
      <Button
        size="small"
        type="primary"
        className="mr-1 modal-action-icon"
        id={row.MATNR}
        onClick={() => {
          setModalVisible(true), dispatch(getTopTrendingMaterialGraph(row.MATNR, row.LGORT));
        }}>
        <i className="fas fa-chart-line" />
      </Button>
      <Modal
        style={{ top: 60 }}
        width="60%"
        title={
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <div>
                <i className="fas fa-chart-line mr-2" />
                Material - {row.MATNR} ({row.LGORT})
              </div>
            </Col>
          </Row>
        }
        className="Intervaltimeline"
        visible={modalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose={true}>
        <h4 className="text-center">
          <TopMovingActionTrend Material={row.MATNR} LGORT={row.LGORT} />
        </h4>
      </Modal>
    </div>
  );
};
