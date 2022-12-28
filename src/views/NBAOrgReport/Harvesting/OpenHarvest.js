import { Card, Modal } from 'antd';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { calculation } from '../../Calculation';
import { getNBAOrgOpenHarvestDD } from '../../../actions';

import { CalculationWithoutDollar } from '../../ReusableComponent/CalculationWithoutDollar';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { OpenHarvestDD } from '../NBAOrgTableColumn';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

export const OpenHarvest = (props) => {
  const dispatch = useDispatch();
  const getNBAOrgOpenHarvestData = useSelector((state) => state.getNBAOrgOpenHarvest);
  const getNBAOrgOpenHarvestLoaderReducer = useSelector(
    (state) => state.getNBAOrgOpenHarvestLoaderReducer
  );
  const getNBAOrgOpenHarvestDDData = useSelector((state) => state.getNBAOrgOpenHarvestDD);
  const getNBAOrgOpenHarvestDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgOpenHarvestDDLoaderReducer
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      {!getNBAOrgOpenHarvestLoaderReducer ? (
        <>
          <Card
            className=" nba-org-mini-card cursor-pointer"
            onClick={() => {
              setIsModalVisible(true);
              dispatch(getNBAOrgOpenHarvestDD(props.org, props.LGORT));
            }}>
            <div className="text-center text-center mini-card-icon">
              {/* <i className="fad fa-kaaba"></i> */}
              <i className="fad fa-person-dolly"></i>
            </div>
            <div className="text-center text-center mini-card-value">
              {calculation(getNBAOrgOpenHarvestData[0]?.Open_Harvest_capex)} (
              {CalculationWithoutDollar(getNBAOrgOpenHarvestData[0]?.Open_Harvest)})
            </div>
            <div className="text-center nba-wid-head">Open Harvest</div>
          </Card>
        </>
      ) : (
        <>
          <Card className="nba-org-mini-card ">
            <ReusableSysncLoader />
          </Card>
        </>
      )}

      <Modal
        title="Open Harvest"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="60%"
        destroyOnClose
        height="auto">
        {!getNBAOrgOpenHarvestDDLoaderReducer && getNBAOrgOpenHarvestDDData.length > 0 ? (
          <>
            {' '}
            <ReusableTable
              TableData={getNBAOrgOpenHarvestDDData}
              TableColumn={OpenHarvestDD}
              fileName={`${props.org}(${props.LGORT}) - Open Harvest`}
            />
          </>
        ) : (
          <>
            {getNBAOrgOpenHarvestDDLoaderReducer ? (
              <>
                {' '}
                <div style={{ height: '400px' }}>
                  {' '}
                  <ReusableSysncLoader />
                </div>
              </>
            ) : (
              <div style={{ height: '400px' }}>
                {' '}
                <NoDataTextLoader />
              </div>
            )}
          </>
        )}
      </Modal>
    </>
  );
};
