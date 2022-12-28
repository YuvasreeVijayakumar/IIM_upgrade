import React from 'react';
import { Card, Col, Row, Radio } from 'antd';
import StockVisualization from './Components/StockVisualization';
import Consumption from './Components/Consumption';
import Leadtime from './Components/LeadTime';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { OrderHistory } from './Components/OrderHistory';
import { HistoricalForecast } from './Components/HistoricalForecast';

export const InventoryPrediction = (props) => {
  const Montly_Stock_data = useSelector((state) => state.getMonthlyStockVisualization);
  useEffect(() => {
    setselected('StockVisualization');
  }, [Montly_Stock_data]);
  const [selected, setselected] = useState('StockVisualization');
  const onChange = (e) => {
    setselected(e.target.value);
  };

  let chartType;
  if (selected === 'StockVisualization')
    chartType = <StockVisualization Material={props.Material} LGORT={props.LGORT} />;
  else if (selected === 'Consumption')
    chartType = <Consumption Material={props.Material} LGORT={props.LGORT} />;
  else if (selected == 'Leadtime')
    chartType = <Leadtime Material={props.Material} LGORT={props.LGORT} />;
  else if (selected == 'HistoricalForecast')
    chartType = <HistoricalForecast Material={props.Material} LGORT={props.LGORT} />;
  else if (selected == 'OrderHistory')
    chartType = <OrderHistory Material={props.Material} LGORT={props.LGORT} />;
  return (
    <div>
      <Card
        className="midLayout"
        bodyStyle={{ height: 400 }}
        title={
          <>
            {' '}
            <Row>
              <Col span={24}>
                <span>
                  {' '}
                  <i className="fas fa-chart-bar mr-2"></i>
                  Inventory Prediction
                </span>
                <span className="float-right mr-2">
                  {' '}
                  <Radio.Group
                    className="NBA-Inventory-Prediction"
                    value={selected}
                    onChange={onChange}>
                    <Radio.Button value="StockVisualization">Stock Visualization</Radio.Button>
                    <Radio.Button value="Consumption">Consumption</Radio.Button>
                    <Radio.Button value="OrderHistory">Order History</Radio.Button>

                    <Radio.Button value="HistoricalForecast">Historical Forecast</Radio.Button>
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
