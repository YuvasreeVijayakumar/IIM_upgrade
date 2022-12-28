import { Card, Modal } from 'antd';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { calculation } from '../../Calculation';
import { getNBAOrgTotalHarvestDD } from '../../../actions';

import { CalculationWithoutDollar } from '../../ReusableComponent/CalculationWithoutDollar';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { TotalHarvestDD } from '../NBAOrgTableColumn';

export const TotalHarvest = (props) => {
  const dispatch = useDispatch();
  const getNBAOrgTotalHarvestData = useSelector((state) => state.getNBAOrgTotalHarvest);
  const getNBAOrgTotalHarvestLoaderReducer = useSelector(
    (state) => state.getNBAOrgTotalHarvestLoaderReducer
  );
  const getNBAOrgTotalHarvestDDData = useSelector((state) => state.getNBAOrgTotalHarvestDD);
  const getNBAOrgTotalHarvestDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgTotalHarvestDDLoaderReducer
  );
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      {!getNBAOrgTotalHarvestLoaderReducer ? (
        <>
          <Card
            className=" nba-org-mini-card cursor-pointer"
            onClick={() => {
              setIsModalVisible(true);
              dispatch(getNBAOrgTotalHarvestDD(props.org, props.LGORT));
            }}>
            <div className="text-center text-center mini-card-icon">
              <i className="fad fa-cubes"></i>
            </div>
            <div className="text-center text-center mini-card-value">
              {calculation(getNBAOrgTotalHarvestData[0]?.Total_Harvest_capex)} (
              {CalculationWithoutDollar(getNBAOrgTotalHarvestData[0]?.Total_Harvest)})
            </div>
            <div className="text-center nba-wid-head">Total Harvest</div>
          </Card>
        </>
      ) : (
        <Card className="nba-org-mini-card ">
          <ReusableSysncLoader />
        </Card>
      )}

      <Modal
        title="Total Harvest"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="60%"
        destroyOnClose
        height="auto">
        {!getNBAOrgTotalHarvestDDLoaderReducer && getNBAOrgTotalHarvestDDData.length > 0 ? (
          <>
            {' '}
            <ReusableTable
              TableData={getNBAOrgTotalHarvestDDData}
              TableColumn={TotalHarvestDD}
              fileName={`${props.org}(${props.LGORT}) - Total Harvest`}
            />
          </>
        ) : (
          <>
            {getNBAOrgTotalHarvestDDLoaderReducer ? (
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
