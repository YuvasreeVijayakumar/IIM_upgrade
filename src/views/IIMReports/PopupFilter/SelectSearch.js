import React, { useState, useEffect } from 'react';
import { TreeSelect, Row, Col, Empty } from 'antd';
import { useSelector } from 'react-redux';
const { TreeNode } = TreeSelect;
export const SelectSearch = (props) => {
  const [selectValue, setselectValue] = useState('');
  const getBulkExportColNamesData = useSelector((state) => state.getBulkExportColNames);
  const getBulkExportColValuesData = useSelector((state) => state.getBulkExportColValues);
  useEffect(() => {
    if (props.value.length > 0) {
      setselectValue(props.value);
    }
  }, [props.value]);

  return (
    <div>
      <Row>
        <Col span={24}>
          {' '}
          <TreeSelect
            showSearch
            style={{ width: '100%', color: 'white' }}
            className="float-right chart-select mr-1"
            allowClear={false}
            treeDefaultExpandAll
            defaultOpen={true}
            notFoundContent={
              <span>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </span>
            }
            value={selectValue}
            onChange={(value) => {
              props.onUpdate(value), setselectValue(value);
            }}>
            <>
              <>
                {props.column.dataField === 'Column_Name' ? (
                  <>
                    {' '}
                    {getBulkExportColNamesData.Table?.map((val1, ind1) => (
                      <TreeNode value={val1.value} title={val1.label} key={ind1} />
                    ))}
                  </>
                ) : (
                  <>
                    {' '}
                    {getBulkExportColValuesData.Table?.map((val1, ind1) => (
                      <TreeNode value={val1.value} title={val1.label} key={ind1} />
                    ))}
                  </>
                )}
              </>
            </>
          </TreeSelect>
        </Col>
      </Row>
    </div>
  );
};
