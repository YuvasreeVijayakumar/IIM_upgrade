import React, { useEffect, useState } from 'react';
import { Dropdown, Menu, Modal } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  HandleforecastModal,
  HandleleadTimeModal,
  HandlematerialOnBoardModal,
  getReasonCodeList,
  getApprovalStatusCount,
  getOrderPushPullMaterialV2,
  getForecastOverrideApproverList,
  getUserImpersonationDetails,
  getReportForNewLeadTime
} from '../../../actions';
import ForecastOverRideUpload from '../ForecastOverRideUpload';
import { LeadTimeUpload } from '../LeadTimeUpload';
import { OnBoadingMaterial } from '../../MaterialOnBoarding/onBoadingMaterial';
import CapGovPushPullTable from '../../CapGov/CapGovPushPullTable';

export const FileDownload = () => {
  const dispatch = useDispatch();
  const [usercuid, setusercuid] = useState('ALL');

  const [LGORT, setLGORT] = useState('All');
  const [Indicator, setIndicator] = useState('All');
  const [ModalVissible, setModalVissible] = useState(false);
  const [ForecastIsApprover, setForecastIsApprover] = useState('N');
  const getUserImpersonationDetailsData = useSelector((state) => state.getUserImpersonationDetails);
  const getReasonCodeListData = useSelector((state) => state.getReasonCodeList);
  useEffect(() => {
    if (getUserImpersonationDetailsData.length > 0) {
      let data = JSON.parse(getUserImpersonationDetailsData[0].FilterSetting);
      let Flag = getUserImpersonationDetailsData[0].IsForecastOverrideApprover;
      setusercuid(getUserImpersonationDetailsData[0].loggedcuid);

      setLGORT(data[0].LGORT);

      setIndicator(data[0].BlockedDeleted);
      setForecastIsApprover(Flag);
      if (sessionStorage.getItem('currentPage') != 'capgov') {
        dispatch(
          getApprovalStatusCount(
            'push',
            getUserImpersonationDetailsData[0].loggedcuid,

            data[0].LGORT,
            data[0].BlockedDeleted
          )
        );
        dispatch(
          getOrderPushPullMaterialV2(
            'push',
            'all',
            getUserImpersonationDetailsData[0].loggedcuid,

            data[0].LGORT,
            data[0].BlockedDeleted
          )
        );
      }
    }
  }, [getUserImpersonationDetailsData]);
  const menu = (
    <Menu onClick={(e) => HandleChoose(e)} className="iim-uploads-menu">
      {' '}
      <Menu.Item key="1">
        <span>Forecast Overwrite</span>
      </Menu.Item>
      {ForecastIsApprover != 'N' ? (
        <Menu.Item key="2">
          <span>Leadtime Overwrite</span>
        </Menu.Item>
      ) : (
        ''
      )}
      <Menu.Item key="3">
        <span>Material Onboard</span>
      </Menu.Item>
      <Menu.Item key="4">
        <span>Push/Pull Upload</span>
      </Menu.Item>
    </Menu>
  );
  const HandleChoose = (e) => {
    if (e.key === '1') {
      dispatch(getForecastOverrideApproverList());
      dispatch(getReasonCodeList());
      dispatch(HandleforecastModal(true));
    } else if (e.key === '2') {
      dispatch(HandleleadTimeModal(true));
      dispatch(getReportForNewLeadTime(usercuid, LGORT, Indicator));
    } else if (e.key === '3') {
      dispatch(HandlematerialOnBoardModal(true));
    } else if (e.key === '4') {
      dispatch(getUserImpersonationDetails(sessionStorage.getItem('loggedEmailId')));
      setModalVissible(true);
    }
  };
  const handleModalClose = () => {
    setModalVissible(false);
    dispatch(getApprovalStatusCount('push', usercuid, LGORT, Indicator));
    dispatch(getOrderPushPullMaterialV2('push', 'all', usercuid, LGORT, Indicator));
  };
  return (
    <>
      <Modal
        width="90%"
        style={{ top: 40 }}
        footer={null}
        visible={ModalVissible}
        onCancel={handleModalClose}
        className="upload-pushpull-modal"
        destroyOnClose={true}>
        <CapGovPushPullTable />
      </Modal>
      <ForecastOverRideUpload
        parsedFilterSettingsLGORT={LGORT}
        parsedBlockedDeleted={Indicator}
        getReasonCodeListData={getReasonCodeListData}
      />
      <OnBoadingMaterial LGORT={LGORT} parsedBlockedDeleted={Indicator} />

      <LeadTimeUpload LGORT={LGORT} parsedBlockedDeleted={Indicator} />

      <Dropdown overlay={menu} placement="bottomCenter" arrow className="iim-uploads">
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          <i className="far fa-upload"></i>
        </a>
      </Dropdown>
    </>
  );
};
