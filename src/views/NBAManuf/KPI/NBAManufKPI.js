import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Radio } from 'antd';
import TurnOverRate from './TurnOverRate';
import BackOrderRate from './BackOrderRate';
import LeadTime from './LeadTime';
import ForecatAccuracy from './ForecatAccuracy';
import { useSelector } from 'react-redux';

const NBAManufKPI = (props) => {
  const [selected, setselected] = useState('TurnoverRate');
  const getTurnOverRateManufMonthwiseData = useSelector(
    (state) => state.getTurnOverRateManufMonthwise
  );
  let chartType;
  if (selected === 'TurnoverRate')
    chartType = <TurnOverRate ManufName={props.ManufName} LGORT={props.LGORT} />;
  else if (selected === 'BackorderRate')
    chartType = <BackOrderRate ManufName={props.ManufName} LGORT={props.LGORT} />;
  else if (selected === 'Leadtime')
    chartType = <LeadTime ManufName={props.ManufName} LGORT={props.LGORT} />;
  else if (selected === 'ForecastAccuracy')
    chartType = <ForecatAccuracy ManufName={props.ManufName} LGORT={props.LGORT} />;

  useEffect(() => {
    setselected('TurnoverRate');
  }, [getTurnOverRateManufMonthwiseData]);

  const onChange = (e) => {
    setselected(e.target.value);
  };
  return (
    <>
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
    </>
  );
};

export default NBAManufKPI;
