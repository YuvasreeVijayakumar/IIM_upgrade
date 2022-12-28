import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, TreeSelect } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';

import { getInventorySummaryVendor } from '../../../actions';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
const { TreeNode } = TreeSelect;

export const SummaryVendor = (props) => {
  const dispatch = useDispatch();
  const getInventorySummaryVendorDDData = useSelector((state) => state.getInventorySummaryVendorDD);
  const getInventorySummaryVendorData = useSelector((state) => state.getInventorySummaryVendor);
  const getInventorySummaryVendorDDLoaderReducer = useSelector(
    (state) => state.getInventorySummaryVendorDDLoaderReducer
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

  const [VendorName, setVendorName] = useState('');
  const handleMaterialChange = (e) => {
    setVendorName(e);
    dispatch(getInventorySummaryVendor(props.Material, e));
  };

  useEffect(() => {
    if (getInventorySummaryVendorDDData[0]?.VENDOR_NAME.length != undefined) {
      dispatch(
        getInventorySummaryVendor(props.Material, getInventorySummaryVendorDDData[0]?.VENDOR_NAME)
      ),
        setVendorName(getInventorySummaryVendorDDData[0]?.VENDOR_NAME);
    }
  }, [getInventorySummaryVendorDDData]);
  return (
    <>
      {!getInventorySummaryVendorDDLoaderReducer ? (
        <>
          <Row gutter={16}>
            <Col span={24}>
              {getInventorySummaryVendorDDData.length > 0 ? (
                <TreeSelect
                  showSearch
                  style={{ width: '90%', fontSize: 12, color: 'white' }}
                  value={VendorName}
                  placeholder={getInventorySummaryVendorDDData[0]?.VENDOR_NAME}
                  allowClear={false}
                  treeDefaultExpandAll
                  onChange={handleMaterialChange}
                  getPopupContainer={(trigger) => trigger.parentNode}
                  className="chart-select float-right mr-4 mb-3">
                  {getInventorySummaryVendorDDData?.map((val1, ind1) => (
                    <TreeNode value={val1.VENDOR_NAME} title={val1.VENDOR_NAME} key={ind1} />
                  ))}
                </TreeSelect>
              ) : (
                ''
              )}
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              {getInventorySummaryVendorData?.length > 0 ? (
                <BootstrapTable
                  keyField="LGORT"
                  data={getInventorySummaryVendorData}
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
    </>
  );
};
