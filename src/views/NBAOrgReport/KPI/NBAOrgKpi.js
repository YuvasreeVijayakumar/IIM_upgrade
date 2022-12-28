import React, { useState } from 'react';
import { Card, Col, Row, Radio } from 'antd';
import TurnoverRateOrg from './TurnoverRateOrg';
import { BackorderRateOrg } from './BackorderRateOrg';
import LeadtimeOrg from './LeadtimeOrg';
import AccuracyOfForecastDemmandOrg from './AccuracyOfForecastDemmandOrg';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const NBAOrgKpi = (props) => {
  const getTurnOverRateOrgMonthwiseData = useSelector((state) => state.getTurnOverRateOrgMonthwise);

  const [selected, setselected] = useState('TurnoverRate');
  const onChange = (e) => {
    setselected(e.target.value);
  };
  useEffect(() => {
    setselected('TurnoverRate');
  }, [getTurnOverRateOrgMonthwiseData]);
  let chartType;
  if (selected === 'TurnoverRate')
    chartType = <TurnoverRateOrg OrgName={props.OrgName} LGORT={props.LGORT} />;
  else if (selected === 'BackorderRate')
    chartType = <BackorderRateOrg OrgName={props.OrgName} LGORT={props.LGORT} />;
  else if (selected === 'Leadtime')
    chartType = <LeadtimeOrg OrgName={props.OrgName} LGORT={props.LGORT} />;
  else if (selected === 'ForecastAccuracy')
    chartType = <AccuracyOfForecastDemmandOrg OrgName={props.OrgName} LGORT={props.LGORT} />;
  return (
    <div>
      <Card
        className="midLayout"
        bodyStyle={{ height: 350 }}
        title={
          <>
            {' '}
            <Row>
              <Col span={24}>
                <span>
                  {' '}
                  <i className="fas fa-chart-bar mr-2"></i>
                  KPI&#39;S
                </span>
                <span className="float-right mr-2">
                  {' '}
                  <Radio.Group
                    className="NBA-Inventory-Prediction"
                    value={selected}
                    onChange={onChange}>
                    <Radio.Button value="TurnoverRate">TurnOver Rate</Radio.Button>
                    <Radio.Button value="BackorderRate">Backorder Rate</Radio.Button>
                    <Radio.Button value="Leadtime">Leadtime</Radio.Button>

                    <Radio.Button value="ForecastAccuracy">Forecast Accuracy</Radio.Button>
                  </Radio.Group>
                </span>
              </Col>
            </Row>
          </>
        }>
        <Row gutter={[16, 16]}>
          <Col span={24}>{chartType}</Col>
        </Row>
      </Card>
    </div>
  );
};
