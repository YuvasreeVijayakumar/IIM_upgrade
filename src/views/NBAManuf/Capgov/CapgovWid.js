import React, { useState } from 'react';
import { Card, Col, Modal, Row, Button } from 'antd';
import { calculation } from '../../Calculation';
import CapgovChart from './CapgovChart';
import { useSelector } from 'react-redux';

import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { CapgovForecastConsumption } from './CapgovReport/CapgovForecastConsumption';
import { EndingOnhandView } from './CapgovReport/EndingOnhandView';
import { OrdersOverviewBarchart } from './CapgovReport/OrdersOverviewBarchart';
import { CapgovInstallBase } from './CapgovReport/CapgovInstallBase';
import { ReusableExportExcel } from '../../ReusableComponent/ReusableExportExcel';
import { getNBAManufCapGovMatnrBreakdown } from '../../../actions';
import { useDispatch } from 'react-redux';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { CapgovMaterialReportDdColumns } from '../NBAManufTableColumns';

const CapgovWid = (props) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isTblModalVisible, setIsTblModalVisible] = useState(false);

  const showModal = () => {
    // if (e == 'chart') {
    setIsModalVisible(true);

    // }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleTblModalCancel = () => {
    setIsTblModalVisible(!isTblModalVisible);
  };
  const getNBAManufCapGovRequestReducerLoader = useSelector(
    (state) => state.getNBAManufCapGovRequestReducerLoader
  );

  const getNBAManufCapGovRequestData = useSelector((state) => state.getNBAManufCapGovRequest);
  const getNBAManufCapGovPlotsReducerLoader = useSelector(
    (state) => state.getNBAManufCapGovPlotsReducerLoader
  );

  const getNBAManufCapGovMatnrBreakdownData = useSelector(
    (state) => state.getNBAManufCapGovMatnrBreakdown
  );
  const getNBAManufCapGovPlotsData = useSelector((state) => state.getNBAManufCapGovPlots);
  const getNBAManufCapGovMatnrBreakdownReducerLoader = useSelector(
    (state) => state.getNBAManufCapGovMatnrBreakdownReducerLoader
  );
  const showTblModal = () => {
    dispatch(getNBAManufCapGovMatnrBreakdown(encodeURIComponent(props.ManufName), props.LGORT));
    setIsTblModalVisible(true);
  };
  return (
    <>
      <Card bodyStyle={{ height: 175 }}>
        <Row>
          <Col span={24} className="float-left">
            <span className="tblHeader ml-2">
              {' '}
              <i className="fad fa-search-dollar mr-2"></i>CapGov
            </span>
            <span className="float-right">
              {' '}
              <i
                className="fad fa-chart-area mr-3 cursor-pointer  pt-2"
                onClick={() => showModal()}></i>
              <i className="far fa-external-link-alt pr-2 pt-2 " onClick={() => showTblModal()}></i>
            </span>
          </Col>
        </Row>
        <Row className="v4">
          <Col span={24} className="text-center"></Col>
        </Row>
        <div className="text-center">
          {!getNBAManufCapGovRequestReducerLoader && getNBAManufCapGovRequestData.length > 0 ? (
            <span className="widget-sub-text text-adjust capgov-data">
              {calculation(getNBAManufCapGovRequestData[0]?.CapGov_Request)}
            </span>
          ) : (
            ''
          )}
        </div>
        <div>
          <CapgovChart showModal={showModal} />
        </div>
      </Card>

      <Modal
        style={{ top: 120 }}
        width="35%"
        footer={null}
        title={
          <Row>
            <Col span={24}>CapGov Material Request</Col>
          </Row>
        }
        visible={isTblModalVisible}
        onOk={handleTblModalCancel}
        onCancel={handleTblModalCancel}>
        {!getNBAManufCapGovMatnrBreakdownReducerLoader &&
        getNBAManufCapGovMatnrBreakdownData.length > 0 ? (
          <ReusableTable
            TableData={getNBAManufCapGovMatnrBreakdownData}
            TableColumn={CapgovMaterialReportDdColumns}
            fileName={`${props.ManufName}(${props.LGORT}) - CapGov Material Request`}
          />
        ) : (
          <>
            <div style={{ height: '400px' }}>
              {' '}
              {getNBAManufCapGovMatnrBreakdownReducerLoader ? (
                <ReusableSysncLoader />
              ) : (
                <NoDataTextLoader />
              )}
            </div>
          </>
        )}
      </Modal>

      <Modal
        style={{ top: 120 }}
        width="90%"
        footer={null}
        title={
          <Row>
            <Col span={24}>
              <span className="float-right mr-4">
                <Button
                  size="sm"
                  disabled={getNBAManufCapGovPlotsReducerLoader}
                  className="export-Btn ml-2 mr-2 float-right"
                  onClick={() =>
                    ReusableExportExcel(
                      getNBAManufCapGovPlotsData,
                      `${props.ManufName} (${props.LGORT}) - Capgov Manufacturer Report`
                    )
                  }>
                  <i className="fas fa-file-excel" />
                </Button>
              </span>
              Capgov Manufacturer Report - {props.ManufName} ({props.LGORT})
            </Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <>
          {!getNBAManufCapGovPlotsReducerLoader && getNBAManufCapGovPlotsData.length > 0 ? (
            <>
              <Row gutter={16}>
                <Col span={12}>
                  <Card title={<span>Ending On Hand View</span>}>
                    {' '}
                    <EndingOnhandView />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card title={<span>Forecast Consumption</span>}>
                    {' '}
                    <CapgovForecastConsumption />
                  </Card>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Card bodyStyle={{ height: '436px' }} title={<span>Quantity To Order</span>}>
                    {' '}
                    <OrdersOverviewBarchart />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card bodyStyle={{ height: '492px' }}>
                    {' '}
                    <CapgovInstallBase />
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            // <CapgovDrilldown />
            <div style={{ height: '400px' }}>
              {getNBAManufCapGovPlotsReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
            </div>
          )}
        </>
      </Modal>
    </>
  );
};

export default CapgovWid;
