import React, { useState } from 'react';
import { Card, Col, Row, Modal, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { calculation } from '../../Calculation';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { CapGovLineChart } from './CapGovLineChart ';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { CapgovMaterialDD } from '../NBAOrgTableColumn';
import { getNBAOrgCapGovMaterialBreakDown } from '../.././../actions';
import { EndingOnhandView } from '../../MaterialReport/CapgovDrilldown/EndingOnhandView';
import { CapgovInstallBase } from '../../MaterialReport/CapgovDrilldown/CapgovInstallBase';
import { OrdersOverviewBarchart } from '../../MaterialReport/OrdersOverView/OrdersOverviewBarchart';
import { CapgovForecastConsumption } from '../../MaterialReport/CapgovDrilldown/CapgovForecastConsumption';
import { ReusableExportExcel } from '../../ReusableComponent/ReusableExportExcel';
export const OrgCapgov = (props) => {
  const dispatch = useDispatch();
  const getCapGovMaterialReportData = useSelector((state) => state.getCapGovMaterialReport);
  const getCapGovMaterialReportLoaderReducer = useSelector(
    (state) => state.getCapGovMaterialReportLoaderReducer
  );
  const getNBAOrgCapGovChartData = useSelector((state) => state.getNBAOrgCapGovChart);
  const getNBAOrgCapGovRequestData = useSelector((state) => state.getNBAOrgCapGovRequest);
  const getNBAOrgCapGovChartLoaderReducer = useSelector(
    (state) => state.getNBAOrgCapGovChartLoaderReducer
  );
  const getNBAOrgCapGovMaterialBreakDownLoaderReducer = useSelector(
    (state) => state.getNBAOrgCapGovMaterialBreakDownLoaderReducer
  );

  const getNBAOrgCapGovMaterialBreakDownData = useSelector(
    (state) => state.getNBAOrgCapGovMaterialBreakDown
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [ischartModalVisible, setischartModalVisible] = useState(false);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleCancelChart = () => {
    setischartModalVisible(false);
  };

  return (
    <div>
      <Modal
        title={
          <Row>
            <Col span={24}>
              <span className="float-right mr-4">
                <Button
                  size="sm"
                  disabled={!getCapGovMaterialReportData.length > 0}
                  className="export-Btn ml-2 mr-2 float-right"
                  onClick={() =>
                    ReusableExportExcel(
                      getCapGovMaterialReportData,
                      `${props.org} (${props.LGORT}) - CapGov Organization Report`
                    )
                  }>
                  <i className="fas fa-file-excel" />
                </Button>
              </span>
              CapGov Organization Report - {props.org} ({props.LGORT})
            </Col>
          </Row>
        }
        visible={ischartModalVisible}
        onCancel={handleCancelChart}
        footer={null}
        width="90%"
        destroyOnClose
        height="auto">
        {!getCapGovMaterialReportLoaderReducer && getCapGovMaterialReportData.length > 0 ? (
          <>
            <Row gutter={16}>
              <Col span={12}>
                <Card title={<span>Ending On Hand View</span>}>
                  <EndingOnhandView />
                </Card>
              </Col>
              <Col span={12}>
                <Card title={<span>Forecast Consumption</span>}>
                  <CapgovForecastConsumption />
                </Card>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={12}>
                <Card bodyStyle={{ height: '436px' }} title={<span>Quantity To Order</span>}>
                  <OrdersOverviewBarchart />
                </Card>
              </Col>
              <Col span={12}>
                <>
                  <Card bodyStyle={{ height: '492px' }}>
                    <CapgovInstallBase />
                  </Card>
                </>
              </Col>
            </Row>
          </>
        ) : (
          <div style={{ height: '400px' }}>
            {getCapGovMaterialReportLoaderReducer ? (
              <>
                <ReusableSysncLoader />
              </>
            ) : (
              <>
                <NoDataTextLoader />
              </>
            )}
          </div>
        )}
      </Modal>
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
                onClick={() => setischartModalVisible(true)}></i>
              <i
                className="far fa-external-link-alt pr-2 pt-2 "
                onClick={() => {
                  setIsModalVisible(true);
                  dispatch(getNBAOrgCapGovMaterialBreakDown(props.org, props.LGORT));
                }}></i>
            </span>
          </Col>
        </Row>
        <Row className="v4">
          {!getNBAOrgCapGovChartLoaderReducer && getNBAOrgCapGovChartData.length > 0 ? (
            <>
              <Col span={24} className="text-center">
                <span className="widget-sub-text text-adjust capgov-data">
                  {calculation(getNBAOrgCapGovRequestData[0]?.cap_gov_request)}
                </span>
              </Col>
              <Col span={24}>
                <CapGovLineChart />
              </Col>
            </>
          ) : (
            <>
              <span className="Nba-load-height">
                {' '}
                {getNBAOrgCapGovChartLoaderReducer ? <ReusableSysncLoader /> : <NoDataTextLoader />}
              </span>
            </>
          )}
        </Row>
      </Card>
      <Modal
        title="CapGov Material Request"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="40%"
        destroyOnClose
        height="auto">
        {!getNBAOrgCapGovMaterialBreakDownLoaderReducer && getNBAOrgCapGovMaterialBreakDownData ? (
          <ReusableTable
            TableData={getNBAOrgCapGovMaterialBreakDownData}
            TableColumn={CapgovMaterialDD}
            fileName={`${props.org}(${props.LGORT}) - CapGov Material Request`}
          />
        ) : (
          <>
            {getNBAOrgCapGovMaterialBreakDownLoaderReducer ? (
              <div style={{ height: '400px' }}>
                {' '}
                <ReusableSysncLoader />
              </div>
            ) : (
              <div style={{ height: '400px' }}>
                <NoDataTextLoader />
              </div>
            )}
          </>
        )}
      </Modal>
    </div>
  );
};
