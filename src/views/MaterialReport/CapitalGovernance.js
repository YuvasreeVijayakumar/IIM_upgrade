import React, { useState } from 'react';
import { Card, Col, Row, Modal, Button } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { calculation } from '../Calculation';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { CapgovDrilldown } from './CapgovDrilldown/CapgovDrilldown';
import { getCapGovMaterialReport, getCapGovInfoForMaterial } from '../../actions';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
import { ReusableExportExcel } from '../ReusableComponent/ReusableExportExcel';

export const CapitalGovernance = (props) => {
  const dispatch = useDispatch();
  const getNBACapGovRequestData = useSelector((state) => state.getNBACapGovRequest);
  const getCapGovMaterialReportData = useSelector((state) => state.getCapGovMaterialReport);
  const getNBACapGovRequestLoaderReducer = useSelector(
    (state) => state.getNBACapGovRequestLoaderReducer
  );
  const getCapGovMaterialReportLoaderReducer = useSelector(
    (state) => state.getCapGovMaterialReportLoaderReducer
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    // if (e == 'chart') {
    setIsModalVisible(true);
    dispatch(getCapGovMaterialReport(props.Material, 'All', 'All', props.LGORT, 'ALL', 'MATERIAL'));
    dispatch(
      getCapGovInfoForMaterial(props.Material, 'All', 'All', props.LGORT, 'ALL', 'MATERIAL')
    );
    // }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <div className="card-alignment">
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
                  disabled={getCapGovMaterialReportLoaderReducer}
                  className="export-Btn ml-2 mr-2 float-right"
                  onClick={() =>
                    ReusableExportExcel(
                      getCapGovMaterialReportData,
                      `${props.Material} (${props.LGORT}) -Material Report`
                    )
                  }>
                  <i className="fas fa-file-excel" />
                </Button>
              </span>
              Material Report - {props.Material} ({props.LGORT})
            </Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <>
          {!getCapGovMaterialReportLoaderReducer && getCapGovMaterialReportData.length > 0 ? (
            <CapgovDrilldown />
          ) : (
            <div className="Nba-load-height">
              {getCapGovMaterialReportLoaderReducer ? (
                <ReusableSysncLoader />
              ) : (
                <NoDataTextLoader />
              )}
            </div>
          )}
        </>
      </Modal>
      <Card
        title={
          <Row>
            <Col span={24}>
              <span>CapGov</span>
              <span className="float-right">
                <i className="far fa-external-link-alt mr-3" onClick={() => showModal()}></i>
              </span>
            </Col>
          </Row>
        }
        bodyStyle={{ height: '168px' }}>
        {!getNBACapGovRequestLoaderReducer ? (
          <>
            <Row gutter={16}>
              <Col span={24} className="text-center">
                {' '}
                <i className="fal fa-search-dollar" />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <p className="widget-sub-text text-adjust capgov-data">
                  {calculation(getNBACapGovRequestData[0]?.CAP_GOV_REQUEST)}
                </p>
              </Col>
            </Row>
          </>
        ) : (
          <>
            <ReusableSysncLoader />
          </>
        )}
      </Card>
    </div>
  );
};
