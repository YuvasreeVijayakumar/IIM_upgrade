import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Tabs } from 'antd';
import { SummaryMaterial } from './SummaryMaterial';
import {
  getNBAInventorySummaryMaterial,
  getInventorySummaryManufacturerDD,
  getInventorySummaryVendorDD
} from '../../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { SummaryManufacturer } from './SummaryManufacturer';
import { SummaryVendor } from './SummaryVendor';
const { TabPane } = Tabs;

export const Inventorysummary = (props) => {
  const dispatch = useDispatch();
  const [ActiveKey, setActiveKey] = useState('1');
  const onChange = (key) => {
    if (key == '1') {
      setActiveKey(key);
      dispatch(getNBAInventorySummaryMaterial(props.Material));
    } else if (key == '2') {
      setActiveKey(key);
      dispatch(getInventorySummaryManufacturerDD(props.Material));
    } else {
      setActiveKey(key);
      dispatch(getInventorySummaryVendorDD(props.Material));
    }
  };
  const getNBAInventorySummaryMaterialData = useSelector(
    (state) => state.getNBAInventorySummaryMaterial
  );
  useEffect(() => {
    setActiveKey('1');
  }, [getNBAInventorySummaryMaterialData]);
  return (
    <>
      <Card title={<>Inventory Summary</>} bodyStyle={{ height: 250 }}>
        <Row>
          <Col span={24}>
            <Tabs activeKey={ActiveKey} onChange={onChange}>
              <TabPane tab="Material" key="1">
                <SummaryMaterial />
              </TabPane>
              <TabPane tab="Manufacturer" key="2">
                <SummaryManufacturer Material={props.Material} />
              </TabPane>
              <TabPane tab="Vendor" key="3">
                <SummaryVendor Material={props.Material} />
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Card>
    </>
  );
};
