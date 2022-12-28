import React, { useState } from 'react';
import { Col, Modal, Row, Tabs } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getMatnrBulkUploadOverview,
  HandlematerialOnBoardModal,
  getMatnrUploadBulkInvalid
} from '../../actions';
import { UploadMaterial } from './UploadMaterial';
import ReusableTable from '../ReusableComponent/ReusableTable';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
import { overviewMaterialColumns } from './MaterialUploadColumns';
import { MaterialInvalidTable } from './MaterialInvalidTable';

export const OnBoadingMaterial = () => {
  const dispatch = useDispatch();
  const { TabPane } = Tabs;
  const [ActiveTab, setActiveTab] = useState('1');
  const HandlematerialOnBoardModalData = useSelector(
    (state) => state.HandlematerialOnBoardModal.materialOnBoard
  );
  const getMatnrBulkUploadOverviewData = useSelector((state) => state.getMatnrBulkUploadOverview);
  const getMatnrBulkUploadOverviewReducerLoader = useSelector(
    (state) => state.getMatnrBulkUploadOverviewReducerLoader
  );
  const getMatnrUploadBulkInvalidReducerLoader = useSelector(
    (state) => state.getMatnrUploadBulkInvalidReducerLoader
  );
  const getMatnrUploadBulkInvalidData = useSelector((state) => state.getMatnrUploadBulkInvalid);
  useEffect(() => {
    HandleModal();
  }, [HandlematerialOnBoardModalData]);

  const HandleModal = () => {
    if (HandlematerialOnBoardModalData) {
      setActiveTab('1');
      dispatch(getMatnrBulkUploadOverview(sessionStorage.getItem('loggedEmailId')));
    }
  };

  const tabChange = (key) => {
    if (key === '1') {
      setActiveTab(key);
      dispatch(getMatnrBulkUploadOverview(sessionStorage.getItem('loggedEmailId')));
    } else if (key === '2') {
      setActiveTab(key);
      dispatch(getMatnrUploadBulkInvalid(sessionStorage.getItem('loggedEmailId')));
    }
  };

  return (
    <>
      <Modal
        width={ActiveTab === '1' ? '40%' : '80%'}
        style={{ top: 40 }}
        footer={null}
        title={
          <Row>
            <Col span={12}>Material Onboard</Col>
            <Col span={12}>
              {ActiveTab != '1' ? (
                ''
              ) : (
                <div className="float-right mr-3">
                  <UploadMaterial />
                </div>
              )}
            </Col>
          </Row>
        }
        visible={HandlematerialOnBoardModalData}
        onCancel={() => dispatch(HandlematerialOnBoardModal(false))}
        destroyOnClose={true}>
        <Tabs activeKey={ActiveTab} onChange={tabChange}>
          <TabPane tab="Overview" key="1">
            {!getMatnrBulkUploadOverviewReducerLoader &&
            getMatnrBulkUploadOverviewData.length > 0 ? (
              <>
                <ReusableTable
                  TableData={getMatnrBulkUploadOverviewData}
                  TableColumn={overviewMaterialColumns}
                  fileName={`Material Onboard Overview`}
                />
              </>
            ) : (
              <>
                {getMatnrBulkUploadOverviewReducerLoader ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </TabPane>
          <TabPane tab="Invalid" key="2">
            {!getMatnrUploadBulkInvalidReducerLoader && getMatnrUploadBulkInvalidData.length > 0 ? (
              <>
                <MaterialInvalidTable />
              </>
            ) : (
              <>
                {getMatnrUploadBulkInvalidReducerLoader ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};
