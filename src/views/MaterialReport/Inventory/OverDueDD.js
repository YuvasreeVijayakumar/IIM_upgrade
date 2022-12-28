import React from 'react';
import { OverdueDDCol } from '../TableColumNames';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { useSelector } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

export const OverDueDD = (props) => {
  const getNBAOverdueDDData = useSelector((state) => state.getNBAOverdueDD);
  const getNBAOverdueDDReducerLoader = useSelector((state) => state.getNBAOverdueDDReducerLoader);
  return (
    <>
      {!getNBAOverdueDDReducerLoader && getNBAOverdueDDData.length > 0 ? (
        <ReusableTable
          TableData={getNBAOverdueDDData}
          TableColumn={OverdueDDCol}
          fileName={`${props.Material} (${props.LGORT})-Overdue Table`}
        />
      ) : (
        <div style={{ height: '400px' }}>
          {getNBAOverdueDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
        </div>
      )}
    </>
  );
};
