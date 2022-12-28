import React, { useState } from 'react';
import { Card, Col, Row, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { getNBAManufAwaitingRepairsDD } from '../../../actions';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { AwaitingrepairsColumns } from '../NBAManufTableColumns';

const AwaitingRepairs = (props) => {
  const dispatch = useDispatch();
  const [isTblModalVisible, setisTblModalVisible] = useState(false);
  const getNBAManufAwaitingRepairsData = useSelector((state) => state.getNBAManufAwaitingRepairs);
  const getNBAManufAwaitingRepairsReducerLoader = useSelector(
    (state) => state.getNBAManufAwaitingRepairsReducerLoader
  );

  const getNBAManufAwaitingRepairsDDReducerLoader = useSelector(
    (state) => state.getNBAManufAwaitingRepairsDDReducerLoader
  );
  const getNBAManufAwaitingRepairsDDData = useSelector(
    (state) => state.getNBAManufAwaitingRepairsDD
  );
  const ShowModal = () => {
    setisTblModalVisible(true);
    dispatch(getNBAManufAwaitingRepairsDD(encodeURIComponent(props.ManufName), props.LGORT));
  };
  const handleTblModalCancel = () => {
    setisTblModalVisible(!isTblModalVisible);
  };
  return (
    <>
      <Modal
        style={{ top: 120 }}
        width="45%"
        footer={null}
        title={
          <Row>
            <Col span={24}>Awaiting Repairs</Col>
          </Row>
        }
        visible={isTblModalVisible}
        onOk={handleTblModalCancel}
        onCancel={handleTblModalCancel}>
        {!getNBAManufAwaitingRepairsDDReducerLoader &&
        getNBAManufAwaitingRepairsDDData.length > 0 ? (
          <ReusableTable
            TableData={getNBAManufAwaitingRepairsDDData}
            TableColumn={AwaitingrepairsColumns}
            fileName={`${props.ManufName}(${props.LGORT}) - Awaiting Repairs`}
          />
        ) : (
          <>
            <div style={{ height: '400px' }}>
              {' '}
              {getNBAManufAwaitingRepairsDDReducerLoader ? (
                <ReusableSysncLoader />
              ) : (
                <NoDataTextLoader />
              )}
            </div>
          </>
        )}
      </Modal>
      {!getNBAManufAwaitingRepairsReducerLoader ? (
        <Card className="nba-org-mini-card cursor-pointer" onClick={() => ShowModal()}>
          <>
            <div className="text-center text-center mini-card-icon">
              {' '}
              <i className="fad fa-tools"></i>
            </div>
            <div className="text-center text-center mini-card-value">
              {getNBAManufAwaitingRepairsData[0]?.REPAIR_PARTS}
            </div>
            <div className="text-center nba-wid-head">Awaiting Repairs</div>
          </>
        </Card>
      ) : (
        <Card className="nba-org-mini-card">
          <ReusableSysncLoader />
        </Card>
      )}
    </>
  );
};

export default AwaitingRepairs;
