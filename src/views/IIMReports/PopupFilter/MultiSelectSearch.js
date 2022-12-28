import React, { useState, useEffect } from 'react';
import { TreeSelect, Row, Col, Popover, Empty, Spin } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { getBulkExportColValues } from '../../../actions';
const { TreeNode } = TreeSelect;

export const MultiSelectSearch = (props) => {
  const dispatch = useDispatch();
  const [selectValue, setselectValue] = useState([]);
  useEffect(() => {
    if (props.value.length > 0) {
      dispatch(getBulkExportColValues(props.view, props.row.Column_Name));

      let strSplit = props.value.split(',');

      var filtered = strSplit.filter(function (el) {
        return el != '';
      });

      setselectValue(filtered);
    } else {
      if (props.row.Column_Name.length > 0) {
        dispatch(getBulkExportColValues(props.view, props.row.Column_Name));
      } else {
        dispatch(getBulkExportColValues(props.view, 'no'));
      }
    }
  }, [props.value]);

  const getBulkExportColValuesData = useSelector((state) => state.getBulkExportColValues);
  const getBulkExportColValuesReducerLoader = useSelector(
    (state) => state.getBulkExportColValuesReducerLoader
  );
  return (
    <div>
      <div>
        <Row>
          <Col span={18}>
            {' '}
            <TreeSelect
              maxTagCount={3}
              multiple
              showSearch
              style={{ width: '100%', color: 'white' }}
              className="float-right chart-select filter-multiselect mr-1"
              allowClear={false}
              treeDefaultExpandAll
              defaultOpen={true}
              maxTagPlaceholder={
                <Popover placement="top" content={selectValue.join(',  ')}>
                  +{selectValue.length - 3}
                </Popover>
              }
              notFoundContent={
                <span>
                  {getBulkExportColValuesReducerLoader ? (
                    <div className="select-spin">
                      {' '}
                      <Spin tip="Loading..." size="large"></Spin>
                    </div>
                  ) : (
                    <>
                      <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                    </>
                  )}
                </span>
              }
              // getPopupContainer={(trigger) => trigger.parentNode}
              value={selectValue}
              onChange={(value) => {
                // if (value.length > 0) {
                setselectValue(value);
                // }
              }}
              loading={getBulkExportColValuesReducerLoader}
              // onChange={handleReportChange}
            >
              <>
                {/* *********Disiabled select DropDown loaders***************** */}
                {/* {!getBulkExportReducerLoader ? ( */}

                <>
                  {props.row.Column_Name === '' ? (
                    <></>
                  ) : (
                    <>
                      {getBulkExportColValuesReducerLoader ? (
                        <></>
                      ) : (
                        <>
                          {getBulkExportColValuesData.Table?.map((val1, ind1) => (
                            <TreeNode value={val1.value} title={val1.label} key={ind1} />
                          ))}
                        </>
                      )}
                    </>
                  )}
                </>
              </>
            </TreeSelect>
          </Col>
          <Col span={6}>
            {' '}
            <button
              key="submit"
              className="btn btn-default tbl-done"
              onClick={() => props.onUpdate(selectValue.toString())}>
              Done
            </button>
          </Col>
        </Row>
      </div>
    </div>
  );
};
