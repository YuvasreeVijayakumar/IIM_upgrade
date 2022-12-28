import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  XAxis,
  YAxis,
  Label,
  Cell,
  ResponsiveContainer,
  ComposedChart,
  ReferenceLine,
  Line,
  Bar,
  Tooltip
} from 'recharts';
import { Row, Col, Button } from 'antd';
// import { Barloaderjs } from '../../../../Barloader';
// import PropagateLoader from 'react-spinners/PropagateLoader';

import { getWeeklyStockVisualization, getMonthlyStockVisualization } from '../../../../actions';
import moment from 'moment';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';
import { ReusableExportExcel } from '../../../ReusableComponent/ReusableExportExcel';
// import { useState } from 'react';

const StockVisualization = (props) => {
  const Montly_Stock_data = useSelector((state) => state.getMonthlyStockVisualization);
  const Weekly_Stock_data = useSelector((state) => state.getWeeklyStockVisualization);
  const getMonthlyStockVisualizationLoaderReducer = useSelector(
    (state) => state.getMonthlyStockVisualizationLoaderReducer
  );
  const getWeeklyStockVisualizationLoaderReducer = useSelector(
    (state) => state.getWeeklyStockVisualizationLoaderReducer
  );

  const [weeklyView, setweeklyView] = useState(false);
  const [monthlyView, setmonthlyView] = useState(true);
  let btn_class_Weekly = weeklyView ? '' : 'white-btn ';
  let btn_class_Monthly = monthlyView ? '' : 'white-btn';

  useEffect(() => {
    setmonthlyView(true);
    setweeklyView(false);
  }, [Montly_Stock_data]);
  const monthlyChart = () => {
    setmonthlyView(true);
    setweeklyView(false);
    dispatch(getMonthlyStockVisualization(props.Material, props.LGORT));
  };
  const weeklyChart = () => {
    setmonthlyView(false);
    setweeklyView(true);
    dispatch(getWeeklyStockVisualization(props.Material, props.LGORT));
  };

  const dispatch = useDispatch();

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormatterWeeklystock = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-bolder golden-text font-14">
            <b>Date: {value}</b> <br />
          </span>
          <span className="text-white font-14">
            <b>
              Ending on hand:{' '}
              <span className="ending-on-hand-text font-14">
                {e.payload[0].payload.Ending_on_hand}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Predicted Consumption:{' '}
              <span className="predicted-consumption-text font-14">
                {e.payload[0].payload.Predicted_consumption}
              </span>
            </b>{' '}
            <br />
          </span>
          <span className="text-white font-14">
            <b>
              Quantity To Order:{' '}
              <span className="projected-need-text font-14">
                {e.payload[0].payload.Quantity_To_Order}
              </span>
            </b>{' '}
            <br />
          </span>
        </div>
      );
    }
  };

  return (
    <>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2 mb-2">
        <Button.Group size="small" className="float-right">
          {monthlyView ? (
            <Button
              size="sm"
              className="export-Btn ml-2 mr-2 "
              disabled={getMonthlyStockVisualizationLoaderReducer}
              onClick={() =>
                ReusableExportExcel(
                  Montly_Stock_data,
                  `${props.Material} (${props.LGORT})-Stock Visualization Monthly`
                )
              }>
              <i className="fas fa-file-excel" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="export-Btn ml-2 mr-2 "
              disabled={getWeeklyStockVisualizationLoaderReducer}
              onClick={() =>
                ReusableExportExcel(
                  Weekly_Stock_data,
                  `${props.Material} (${props.LGORT})-Stock Visualization Weekly`
                )
              }>
              <i className="fas fa-file-excel" />
            </Button>
          )}

          <Button
            className={btn_class_Weekly}
            id="Weekly_Stock"
            type="primary"
            onClick={weeklyChart}>
            Weekly Trend
          </Button>
          <Button
            className={btn_class_Monthly}
            id="Montly_Stock"
            type="primary"
            onClick={monthlyChart}>
            Monthly Trend
          </Button>
        </Button.Group>
      </Col>
      <div className="ml-2 mr-2 mt-2 text-center  chart-legend">
        <span>
          <i className="fas fa-circle ending-on-hand" /> - Ending on hand(QTY){' '}
        </span>
        <span>
          <i className="fas fa-circle predicted-consumption" /> - Predicted Consumption(QTY){' '}
        </span>
        <span>
          <i className="fas fa-circle projected-need" /> - Quantity To Order{' '}
        </span>
      </div>

      <Row className="v4">
        {monthlyView == true ? (
          <>
            {!getMonthlyStockVisualizationLoaderReducer && Montly_Stock_data != '' ? (
              <>
                <ResponsiveContainer height={350} width="100%">
                  <ComposedChart
                    width={900}
                    height={350}
                    data={Montly_Stock_data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 0
                    }}>
                    <XAxis
                      dataKey="ds"
                      angle={-40}
                      tickFormatter={formatXAxis}
                      textAnchor="end"
                      height={150}
                      interval={0}
                      stroke="#fff">
                      {' '}
                      <Label
                        value=" Date"
                        style={{ textAnchor: 'middle', fill: '#fff' }}
                        // position="insideLeft"
                        position="centerBottom"
                      />
                    </XAxis>
                    <YAxis stroke="#ffffff">
                      <Label
                        value="Quantity"
                        angle="-90"
                        style={{ textAnchor: 'middle', fill: '#fff' }}
                        position="insideLeft"
                      />
                    </YAxis>
                    <Tooltip content={TooltipFormatterWeeklystock} />
                    <ReferenceLine y={0} stroke="#000" />
                    <Bar dataKey="Ending_on_hand" barSize={20} fill="#1870dc">
                      {Montly_Stock_data?.map((entry) => {
                        if (entry.Flag == 1) {
                          return (
                            <Cell
                              style={{
                                'outline-color': 'red',
                                'outline-style': 'solid'
                              }}
                            />
                          );
                        } else if (entry.Flag == 2) {
                          return (
                            <Cell
                              style={{
                                'outline-color': 'orange',
                                'outline-style': 'solid'
                              }}
                            />
                          );
                        } else {
                          return <Cell />;
                        }
                      })}
                    </Bar>
                    <Bar dataKey="Quantity_To_Order" barSize={20} fill="#63ce46" />
                    <Line type="monotone" dataKey="Predicted_consumption" stroke="#fa9105" />
                    {/* {this.state.getMonthlyStockVisualizationData.length > 20 && <Brush dataKey="ds" tickFormatter={this.formatXAxis} height={20} y={350} />} */}
                  </ComposedChart>
                </ResponsiveContainer>
              </>
            ) : (
              <>
                {getMonthlyStockVisualizationLoaderReducer ? (
                  <ResponsiveContainer height={350} width="100%">
                    <ReusableSysncLoader />
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer height={350} width="100%">
                    <NoDataTextLoader />
                  </ResponsiveContainer>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {!getWeeklyStockVisualizationLoaderReducer && Weekly_Stock_data != '' ? (
              <>
                <ResponsiveContainer height={350} width="100%">
                  <ComposedChart
                    width={900}
                    height={350}
                    data={Weekly_Stock_data}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 0,
                      bottom: 0
                    }}>
                    <XAxis
                      dataKey="ds"
                      angle={-40}
                      tickFormatter={formatXAxis}
                      textAnchor="end"
                      height={150}
                      interval={0}
                      stroke="#fff">
                      {' '}
                      <Label
                        value=" Date"
                        style={{ textAnchor: 'middle', fill: '#fff' }}
                        // position="insideLeft"
                        position="centerBottom"
                      />
                    </XAxis>
                    <YAxis stroke="#ffffff">
                      <Label
                        value="Quantity"
                        angle="-90"
                        style={{ textAnchor: 'middle', fill: '#fff' }}
                        position="insideLeft"
                      />
                    </YAxis>
                    <Tooltip content={TooltipFormatterWeeklystock} />
                    <ReferenceLine y={0} stroke="#000" />
                    <Bar dataKey="Ending_on_hand" barSize={20} fill="#1870dc">
                      {Weekly_Stock_data.map((entry) => {
                        if (entry.Flag == 1) {
                          return (
                            <Cell
                              style={{
                                'outline-color': 'red',
                                'outline-style': 'solid'
                              }}
                            />
                          );
                        } else if (entry.Flag == 2) {
                          return (
                            <Cell
                              style={{
                                'outline-color': 'orange',
                                'outline-style': 'solid'
                              }}
                            />
                          );
                        } else {
                          return <Cell />;
                        }
                      })}
                    </Bar>
                    <Bar dataKey="Quantity_To_Order" barSize={20} fill="#63ce46" />
                    <Line type="monotone" dataKey="Predicted_consumption" stroke="#fa9105" />
                  </ComposedChart>
                </ResponsiveContainer>
              </>
            ) : (
              <>
                {getWeeklyStockVisualizationLoaderReducer ? (
                  <ResponsiveContainer height={350} width="100%">
                    <ReusableSysncLoader />
                  </ResponsiveContainer>
                ) : (
                  <ResponsiveContainer height={350} width="100%">
                    <NoDataTextLoader />
                  </ResponsiveContainer>
                )}
              </>
            )}
          </>
        )}
      </Row>
    </>
  );
};

export default StockVisualization;
