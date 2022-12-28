import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getInventorySummaryManufacturer } from '../../../actions';
import { Col, Row, TreeSelect } from 'antd';

import BootstrapTable from 'react-bootstrap-table-next';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
const { TreeNode } = TreeSelect;
export const SummaryManufacturer = (props) => {
  const dispatch = useDispatch();
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

  const [ManufName, setManufName] = useState('');
  const getInventorySummaryManufacturerDDData = useSelector(
    (state) => state.getInventorySummaryManufacturerDD
  );
  const getInventorySummaryManufacturerData = useSelector(
    (state) => state.getInventorySummaryManufacturer
  );
  const getInventorySummaryManufacturerDDLoaderReducer = useSelector(
    (state) => state.getInventorySummaryManufacturerDDLoaderReducer
  );
  useEffect(() => {
    if (getInventorySummaryManufacturerDDData[0]?.MANUF_NAME.length != undefined) {
      dispatch(
        getInventorySummaryManufacturer(
          props.Material,
          getInventorySummaryManufacturerDDData[0]?.MANUF_NAME
        )
      ),
        setManufName(getInventorySummaryManufacturerDDData[0]?.MANUF_NAME);
    }
  }, [getInventorySummaryManufacturerDDData]);
  const handleMaterialChange = (e) => {
    dispatch(getInventorySummaryManufacturer(props.Material, e));
    setManufName(e);
  };
  return (
    <div>
      {!getInventorySummaryManufacturerDDLoaderReducer ? (
        <>
          <Row gutter={16}>
            <Col span={24}>
              {getInventorySummaryManufacturerDDData.length > 0 ? (
                <TreeSelect
                  showSearch
                  style={{ width: '90%', fontSize: 12, color: 'white' }}
                  value={ManufName}
                  placeholder={getInventorySummaryManufacturerDDData[0]?.MANUF_NAME}
                  allowClear={false}
                  treeDefaultExpandAll
                  onChange={handleMaterialChange}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  className="chart-select float-right mr-4 mb-2">
                  {getInventorySummaryManufacturerDDData?.map((val1, ind1) => (
                    <TreeNode value={val1.MANUF_NAME} title={val1.MANUF_NAME} key={ind1} />
                  ))}
                </TreeSelect>
              ) : (
                ''
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {getInventorySummaryManufacturerData?.length > 0 ? (
                <BootstrapTable
                  keyField="LGORT"
                  data={getInventorySummaryManufacturerData}
                  columns={columns}
                  noDataIndication="No Data Available For This criteria"
                />
              ) : (
                <div style={{ height: '150px' }}>
                  <ReusableSysncLoader />
                </div>
              )}
            </Col>
          </Row>
        </>
      ) : (
        <div style={{ height: '220px' }}>
          <ReusableSysncLoader />
        </div>
      )}
    </div>
  );
};
