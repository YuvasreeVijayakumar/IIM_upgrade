import React, { useEffect, useState } from 'react';
import { InventoryCapexDDTblCol, InventoryCapexDDTblPlantCol } from './TableColumNames';
import ReusableTable from '../ReusableComponent/ReusableTable';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { getNBAInventoryCapexDD } from '../../actions';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
import { Switch } from 'antd';

export const InventoryCapexDDTbl = (props) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNBAInventoryCapexDD(props.Material, props.LGORT, 'plant'));
  }, []);
  const [showcomp, setshowcomp] = useState(true);
  const getNBAInventoryCapexDDData = useSelector((state) => state.getNBAInventoryCapexDD);
  const getNBAInventoryCapexDDReducerLoader = useSelector(
    (state) => state.getNBAInventoryCapexDDReducerLoader
  );

  const switchcomponent = (e) => {
    setshowcomp(e);
    if (e) {
      dispatch(getNBAInventoryCapexDD(props.Material, props.LGORT, 'plant'));
    } else {
      dispatch(getNBAInventoryCapexDD(props.Material, props.LGORT, 'Material'));
    }
  };
  return (
    <>
      <Switch
        checkedChildren="Plant"
        unCheckedChildren="Material"
        defaultChecked
        className="pull-right ml-3 float-left"
        onChange={switchcomponent}
      />
      {showcomp ? (
        <>
          {' '}
          {!getNBAInventoryCapexDDReducerLoader && getNBAInventoryCapexDDData.length > 0 ? (
            <ReusableTable
              TableData={getNBAInventoryCapexDDData}
              TableColumn={InventoryCapexDDTblPlantCol}
              fileName={`${props.Material} (${props.LGORT})-Inventory Capex Plant`}
            />
          ) : (
            <>
              {getNBAInventoryCapexDDReducerLoader ? (
                <div style={{ height: '400px' }}>
                  {' '}
                  <ReusableSysncLoader />{' '}
                </div>
              ) : (
                <div style={{ height: '400px' }}>
                  <NoDataTextLoader />
                </div>
              )}
            </>
          )}
        </>
      ) : (
        <>
          {' '}
          {!getNBAInventoryCapexDDReducerLoader && getNBAInventoryCapexDDData.length > 0 ? (
            <ReusableTable
              TableData={getNBAInventoryCapexDDData}
              TableColumn={InventoryCapexDDTblCol}
              fileName={`${props.Material} (${props.LGORT})-Inventory Capex Material`}
            />
          ) : (
            <>
              {getNBAInventoryCapexDDReducerLoader ? (
                <div style={{ height: '400px' }}>
                  {' '}
                  <ReusableSysncLoader />{' '}
                </div>
              ) : (
                <div style={{ height: '400px' }}>
                  <NoDataTextLoader />
                </div>
              )}
            </>
          )}
        </>
      )}
    </>
  );
};
