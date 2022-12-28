import React, { useEffect, useState } from 'react';
import { getNBATrendAnalysis } from '../../../actions';
import { Card, Col, Row, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Consumption } from './Components/Consumption';
import { Inventory } from './Components/Inventory';
import { CapexTrend } from './Components/CapexTrend';
import { SlaMet } from './Components/SlaMet';
import { FillRate } from './Components/FillRate';

export const TrendAnalysis = (props) => {
  const dispatch = useDispatch();

  const [selected, setSelected] = useState('capextrend');
  const getNBAOrgDetailsData = useSelector((state) => state.getNBAOrgDetails);
  useEffect(() => {
    setSelected('capextrend');
  }, [getNBAOrgDetailsData]);
  const onChange = (e) => {
    setSelected(e.target.value);
    if (e.target.value === 'consumption') {
      dispatch(getNBATrendAnalysis(props.org, props.LGORT, 'consumption'));
    } else if (e.target.value === 'inventory') {
      dispatch(getNBATrendAnalysis(props.org, props.LGORT, 'Inventory'));
    } else if (e.target.value === 'capextrend') {
      dispatch(getNBATrendAnalysis(props.org, props.LGORT, 'capextrend'));
    } else if (e.target.value === 'slamet') {
      dispatch(getNBATrendAnalysis(props.org, props.LGORT, 'SLAMET'));
    } else if (e.target.value === 'fillrate') {
      dispatch(getNBATrendAnalysis(props.org, props.LGORT, 'FILLRATE'));
    }
  };
  let chartType;
  if (selected === 'consumption')
    chartType = <Consumption OrgName={props.org} LGORT={props.LGORT} />;
  else if (selected === 'inventory')
    chartType = <Inventory OrgName={props.org} LGORT={props.LGORT} />;
  else if (selected === 'capextrend')
    chartType = <CapexTrend OrgName={props.org} LGORT={props.LGORT} />;
  else if (selected === 'fillrate')
    chartType = <FillRate OrgName={props.org} LGORT={props.LGORT} />;
  else if (selected === 'slamet') chartType = <SlaMet OrgName={props.org} LGORT={props.LGORT} />;

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
                  <Radio.Button value="fillrate">Fill Rate</Radio.Button>
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
