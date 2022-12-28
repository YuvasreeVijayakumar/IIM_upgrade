import React from 'react';
import { useSelector } from 'react-redux';
import { FillRateDDCol } from '../TableColumNames';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

export const FillrateDD = (props) => {
  const getNBAFillrateDDData = useSelector((state) => state.getNBAFillrateDD);
  const getNBAFillrateDDReducerLoader = useSelector((state) => state.getNBAFillrateDDReducerLoader);
  return (
    <>
      {!getNBAFillrateDDReducerLoader && getNBAFillrateDDData.length > 0 ? (
        <>
          <div className="note float-left">
            Note : Fill rate is calculated using past 1 year data.{' '}
          </div>
          <ReusableTable
            TableData={getNBAFillrateDDData}
            TableColumn={FillRateDDCol}
            fileName={`${props.Material} (${props.LGORT})-Fill Rate DD`}
          />
        </>
      ) : (
        <>
          <div style={{ height: '400px' }}>
            {getNBAFillrateDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}{' '}
          </div>{' '}
        </>
      )}
    </>
  );
};
