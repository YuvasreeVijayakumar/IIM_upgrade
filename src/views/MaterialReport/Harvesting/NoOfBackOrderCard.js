import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Modal, Row, Col, Card } from 'antd';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { ReuseMiniAreaChart } from '../../ReusableComponent/ReuseMiniAreaChart';
import { calculation } from '../../Calculation';
import { getNBABackordersDD } from '../../../actions';
import moment from 'moment';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { NoOfBacordersDDCol } from '../TableColumNames';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
export const NoOfBackOrderCard = (props) => {
  const dispatch = useDispatch();
  const getNBABackordersData = useSelector((state) => state.getNBABackorders);
  const getNBABackorderQtyMaterialMonthwiseData = useSelector(
    (state) => state.getNBABackorderQtyMaterialMonthwise
  );
  const getNBABackordersReducerLoader = useSelector((state) => state.getNBABackordersReducerLoader);
  const getNBABackorderQtyMaterialMonthwiseReducerLoader = useSelector(
    (state) => state.getNBABackorderQtyMaterialMonthwiseReducerLoader
  );
  const getNBABackordersDDData = useSelector((state) => state.getNBABackordersDD);
  const getNBABackordersDDReducerLoader = useSelector(
    (state) => state.getNBABackordersDDReducerLoader
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const showModal = () => {
    // if (e == 'chart') {
    setIsModalVisible(true);
    dispatch(getNBABackordersDD(props.Material, props.LGORT));

    // }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const TooltipBackorder = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>BackOrder Qty: {e.payload[0].payload.BACKORDERQTY}</b> <br />
          </span>
        </div>
      );
    }
  };

  return (
    <>
      <Modal
        style={{ top: 120 }}
        width="90%"
        destroyOnClose
        footer={null}
        title={
          <Row>
            <Col span={24}> Back Orders Quantity</Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        {!getNBABackordersDDReducerLoader && getNBABackordersDDData.length > 0 ? (
          <ReusableTable
            TableData={getNBABackordersDDData}
            TableColumn={NoOfBacordersDDCol}
            fileName={`${props.Material} (${props.LGORT})- Back Orders`}
          />
        ) : (
          <>
            {' '}
            <div style={{ height: '400px' }}>
              {getNBABackordersDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}{' '}
            </div>
          </>
        )}
      </Modal>
      <Card
        bodyStyle={{ height: '150px' }}
        title={
          <span>
            {' '}
            <i className="fas fa-boxes mr-2 float-left"></i>Back Orders Quantity{' '}
            <i
              className="far fa-external-link-alt float-right mr-3"
              onClick={() => showModal()}></i>
          </span>
        }>
        {!getNBABackordersReducerLoader && getNBABackordersData.length > 0 ? (
          <>
            {' '}
            <Row>
              <Col span={8} className="text-center nba-har-wid mt-3">
                <div className="nba-text-big text-center mt-1">
                  <span className="nba-text-small text-white">
                    {calculation(getNBABackordersData[0]?.BackordersRevenueLoss)}
                  </span>
                  <span className="nba-text-small">
                    ({getNBABackordersData[0]?.noofbackorders})
                  </span>
                </div>
                <div>
                  <span className=" fs-16 text-white mt-3">Back Orders</span>
                </div>
              </Col>
              <Col span={16} className="nba-main-chart">
                {!getNBABackorderQtyMaterialMonthwiseReducerLoader &&
                getNBABackorderQtyMaterialMonthwiseData.length > 0 ? (
                  <>
                    <ReuseMiniAreaChart
                      data={getNBABackorderQtyMaterialMonthwiseData}
                      dataKey={'BACKORDERQTY'}
                      stroke={'#00FFAB'}
                      fill={'#00FFAB'}
                      Tooltip={TooltipBackorder}
                    />
                  </>
                ) : (
                  <>
                    {getNBABackorderQtyMaterialMonthwiseReducerLoader ? (
                      <ReusableSysncLoader />
                    ) : (
                      <span style={{ height: '100px' }}>
                        <NoDataTextLoader />
                      </span>
                    )}
                  </>
                )}
              </Col>
            </Row>
          </>
        ) : (
          <> {getNBABackordersReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}</>
        )}
      </Card>
    </>
  );
};
