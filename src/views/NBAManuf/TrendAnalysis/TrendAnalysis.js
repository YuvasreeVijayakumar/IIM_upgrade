import React, { useEffect, useState } from 'react';
import { getNBAManufTrendAnalysis } from '../../../actions';
import { Card, Col, Row, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';

import { CapexTrend } from './Components/CapexTrend';
import { Consumption } from './Components/Consumption';
import { SlaMet } from './Components/SlaMet';
import { Inventory } from './Components/Inventory';

export const TrendAnalysis = (props) => {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState('capextrend');
  const getNBAManufacturerWidget1Data = useSelector((state) => state.getNBAManufacturerWidget1);
  useEffect(() => {
    setSelected('capextrend');
  }, [getNBAManufacturerWidget1Data]);
  const onChange = (e) => {
    setSelected(e.target.value);
    if (e.target.value === 'consumption') {
      dispatch(
        getNBAManufTrendAnalysis(encodeURIComponent(props.ManufName), props.LGORT, 'CONSUMPTION')
      );
    } else if (e.target.value === 'inventory') {
      dispatch(
        getNBAManufTrendAnalysis(encodeURIComponent(props.ManufName), props.LGORT, 'INVENTORY')
      );
    } else if (e.target.value === 'capextrend') {
      dispatch(
        getNBAManufTrendAnalysis(encodeURIComponent(props.ManufName), props.LGORT, 'CAPEX_TREND')
      );
    } else if (e.target.value === 'slamet') {
      dispatch(
        getNBAManufTrendAnalysis(encodeURIComponent(props.ManufName), props.LGORT, 'SLAMET')
      );
    } else if (e.target.value === 'fillrate') {
      dispatch(
        getNBAManufTrendAnalysis(encodeURIComponent(props.ManufName), props.LGORT, 'FILLRATE')
      );
    }
  };
  let chartType;
  if (selected === 'consumption')
    chartType = <Consumption Manuf={props.ManufName} LGORT={props.LGORT} />;
  else if (selected === 'inventory')
    chartType = <Inventory Manuf={props.ManufName} LGORT={props.LGORT} />;
  else if (selected === 'capextrend')
    chartType = <CapexTrend Manuf={props.ManufName} LGORT={props.LGORT} />;
  else if (selected === 'slamet')
    chartType = <SlaMet Manuf={props.ManufName} LGORT={props.LGORT} />;

  return (
    <>
      {' '}
      <Card
        className="midLayout"
        bodyStyle={{ height: 350 }}
        title={
          <Row>
            <Col span={24}>
              <span>
                <i className="fas fa-chart-area mr-2" />
                Trend Analysis
              </span>
              <span className="float-right mr-2">
                <Radio.Group
                  className="NBA-Inventory-Prediction"
                  value={selected}
                  onChange={onChange}>
                  <Radio.Button value="capextrend">PO Capex</Radio.Button>
                  <Radio.Button value="consumption">Consumption</Radio.Button>

                  <Radio.Button value="inventory">Inventory</Radio.Button>

                  <Radio.Button value="slamet">SLA Met</Radio.Button>
                </Radio.Group>
              </span>
            </Col>
          </Row>
        }>
        {chartType}
      </Card>
    </>
  );
};
