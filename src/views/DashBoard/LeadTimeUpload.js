import React, { useEffect, useState } from 'react';
import { Row, Modal, Col, Tabs } from 'antd';
import { UploadLeadTime } from './UploadLeadTime';
import { newLeadTimeColumn } from '../MaterialReport/TableColumNames';
import {
  getLeadtimeOverwriteReview,
  getReportForNewLeadTime,
  HandleleadTimeModal
} from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import ReusableTable from '../ReusableComponent/ReusableTable';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
import LeadTimeInvaildTable from './LeadTimeInvaildTable';
const { TabPane } = Tabs;
export const LeadTimeUpload = () => {
  const dispatch = useDispatch();
  const HandleleadTimeModalData = useSelector((state) => state.HandleleadTimeModal.leadTime);
  useEffect(() => {
    HandleModalUpload();
  }, [HandleleadTimeModalData]);

  const [ActiveTab, setActiveTab] = useState('1');
  const getReportForNewLeadTimeData = useSelector((state) => state.getReportForNewLeadTime);

  const getReportForNewLeadTimeReducerLoader = useSelector(
    (state) => state.getReportForNewLeadTimeReducerLoader
  );

  const getLeadtimeOverwriteReviewReducerLoader = useSelector(
    (state) => state.getLeadtimeOverwriteReviewReducerLoader
  );

  const HandleModalUpload = () => {
    if (HandleleadTimeModalData) {
      setActiveTab('1');
    } else {
      dispatch(
        getReportForNewLeadTime(
          sessionStorage.getItem('loggedcuid'),
          sessionStorage.getItem('lgort'),
          sessionStorage.getItem('colorcodedmatnr')
        )
      );
    }
  };
  const handleModalchange = (key) => {
    if (key === '1') {
      dispatch(
        getReportForNewLeadTime(
          sessionStorage.getItem('loggedcuid'),
          sessionStorage.getItem('lgort'),
          sessionStorage.getItem('colorcodedmatnr')
        )
      );
      setActiveTab(key);
    } else {
      dispatch(getLeadtimeOverwriteReview(sessionStorage.getItem('loggedEmailId')));
      setActiveTab(key);
    }
  };
  return (
    <>
      <Modal
        width={ActiveTab == '1' ? '40%' : '85%'}
        style={{ top: 40 }}
        footer={null}
        title={
          <Row>
            <Col span={12}>Leadtime Overwrite </Col>
            <Col span={12}>
              {ActiveTab != '1' ? (
                ''
              ) : (
                <div className="float-right mr-3">
                  <UploadLeadTime />
                </div>
              )}
            </Col>
          </Row>
        }
        visible={HandleleadTimeModalData}
        onCancel={() => dispatch(HandleleadTimeModal(false))}
        destroyOnClose={true}>
        <Tabs activeKey={ActiveTab} onChange={handleModalchange}>
          <TabPane tab="Overview" key="1">
            {!getReportForNewLeadTimeReducerLoader && getReportForNewLeadTimeData.length > 0 ? (
              <ReusableTable
                TableData={getReportForNewLeadTimeData}
                TableColumn={newLeadTimeColumn}
                fileName={`Leadtime Overview`}
              />
            ) : (
              <>
                {' '}
                {getReportForNewLeadTimeReducerLoader ? (
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
            {!getLeadtimeOverwriteReviewReducerLoader ? (
              <LeadTimeInvaildTable />
            ) : (
              <div style={{ height: '400px' }}>
                <ReusableSysncLoader />
              </div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};
