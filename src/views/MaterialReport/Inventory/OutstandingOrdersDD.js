import React from 'react';
import { useSelector } from 'react-redux';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { OutstandingOrdersDDCol } from '../TableColumNames';

export const OutstandingOrdersDD = (props) => {
  const getNBAOutstandingOrdersDDData = useSelector((state) => state.getNBAOutstandingOrdersDD);
  const getNBAOutstandingOrdersDDReducerLoader = useSelector(
    (state) => state.getNBAOutstandingOrdersDDReducerLoader
  );

  return (
    <div>
      {!getNBAOutstandingOrdersDDReducerLoader && getNBAOutstandingOrdersDDData.length > 0 ? (
        <ReusableTable
          TableData={getNBAOutstandingOrdersDDData}
          TableColumn={OutstandingOrdersDDCol}
          fileName={`${props.Material} (${props.LGORT})-Outstanding Orders Table`}
        />
      ) : (
        <div style={{ height: '400px' }}>
          {getNBAOutstandingOrdersDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
        </div>
      )}
    </div>
  );
};
