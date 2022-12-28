import { Col, Row } from 'antd';
import React from 'react';

import BootstrapTable from 'react-bootstrap-table-next';
import { useSelector } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';

export const SummaryMaterial = () => {
  const getNBAInventorySummaryMaterialData = useSelector(
    (state) => state.getNBAInventorySummaryMaterial
  );
  const getNBAInventorySummaryMaterialLoaderReducer = useSelector(
    (state) => state.getNBAInventorySummaryMaterialLoaderReducer
  );
  const columns = [
    {
      dataField: 'LGORT',
      text: 'LGORT'
    },
    {
      dataField: 'RED_INVENTORY',
      text: 'Red Inventory'
    },
    {
      dataField: 'GREEN_INVENTORY',
      text: 'Green Inventory'
    }
  ];

  return (
    <>
      <Row className="pt-1">
        <Col span={24}>
          {!getNBAInventorySummaryMaterialLoaderReducer ? (
            <BootstrapTable
              keyField="LGORT"
              data={getNBAInventorySummaryMaterialData}
              columns={columns}
              noDataIndication="No Data Available For This criteria"
            />
          ) : (
            <div style={{ height: '130px' }}>
              <ReusableSysncLoader />
            </div>
          )}
        </Col>
      </Row>
    </>
  );
};
