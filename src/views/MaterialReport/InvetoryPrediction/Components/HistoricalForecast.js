import React, { useEffect, useState } from 'react';
import { Col, Row, Button, DatePicker } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import {
  getHistoricalForecastMonthly,
  getHistoricalForecastWeekly,
  getHistoricalSnapshotForecastMinMaxDate
} from '../../../../actions';
import { ReusableExportExcel } from '../../../ReusableComponent/ReusableExportExcel';
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  Label,
  YAxis,
  Tooltip,
  Area,
  Line
} from 'recharts';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';

export const HistoricalForecast = (props) => {
  const dispatch = useDispatch();
  const [weeklyView, setweeklyView] = useState(false);
  const [monthlyView, setmonthlyView] = useState(true);
  const [startdate, setStartdate] = useState('');
  const [snapMonthlyN, setsnapMonthlyN] = useState('');
  const [snapWeeklyN, setsnapWeeklyN] = useState('');
  useEffect(() => {
    dispatch(getHistoricalSnapshotForecastMinMaxDate(props.Material));
  }, []);
  const resMinMaxDate = useSelector((state) => state.getHistoricalSnapshotForecastMinMaxDate);
  const getHistoricalForecastMonthlyData = useSelector(
    (state) => state.getHistoricalForecastMonthly
  );

  const getHistoricalForecastWeeklyData = useSelector((state) => state.getHistoricalForecastWeekly);
  const getHistoricalForecastMonthlyReducerLoader = useSelector(
    (state) => state.getHistoricalForecastMonthlyReducerLoader
  );

  const getHistoricalForecastWeeklyReducerLoader = useSelector(
    (state) => state.getHistoricalForecastWeeklyReducerLoader
  );
  useEffect(() => {
    if (getHistoricalForecastWeeklyData.length > 0) {
      for (var i = 0; i < getHistoricalForecastWeeklyData.length; i++) {
        if (getHistoricalForecastWeeklyData[i].Is_Predicted == 'Y') {
          setsnapWeeklyN(i);
          break;
        }
      }
    }
  }, [getHistoricalForecastWeeklyData]);
  const snap_percentage =
    100 -
    ((getHistoricalForecastWeeklyData.length - snapWeeklyN - 1) /
      (getHistoricalForecastWeeklyData.length - 1)) *
      100;

  useEffect(() => {
    if (getHistoricalForecastMonthlyData.length > 0) {
      for (var i = 0; i < getHistoricalForecastMonthlyData.length; i++) {
        if (getHistoricalForecastMonthlyData[i].Is_Predicted == 'Y') {
          setsnapMonthlyN(i);
          break;
        }
      }
    }
  }, [getHistoricalForecastMonthlyData]);
  var snap_percentageOne =
    100 -
    ((getHistoricalForecastMonthlyData?.length - snapMonthlyN - 1) /
      (getHistoricalForecastMonthlyData?.length - 1)) *
      100;
  useEffect(() => {
    if (resMinMaxDate.length > 0) {
      setStartdate(resMinMaxDate[0]?.Min_Date_Monthly);
      {
        monthlyView
          ? dispatch(
              getHistoricalForecastMonthly(
                props.Material,
                resMinMaxDate[0]?.Min_Date_Monthly,
                props.LGORT
              )
            )
          : dispatch(
              getHistoricalForecastWeekly(
                props.Material,
                resMinMaxDate[0]?.Min_Date_Monthly,
                props.LGORT
              )
            );
      }
    }
  }, [resMinMaxDate]);

  let btn_class_Weekly = weeklyView ? '' : 'white-btn ';
  let btn_class_Monthly = monthlyView ? '' : 'white-btn';
  const monthlyChart = () => {
    setmonthlyView(true);
    setweeklyView(false);

    dispatch(getHistoricalSnapshotForecastMinMaxDate(props.Material));
  };
  const weeklyChart = () => {
    setmonthlyView(false);
    setweeklyView(true);

    dispatch(getHistoricalSnapshotForecastMinMaxDate(props.Material));
  };
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipMonth = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let Value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>{Value}</b> <br />
          </span>

          {e.payload[0].payload.Original_value != null ? (
            <span className="text-white">
              <b> Actual Consumption(Qty): {e.payload[0].payload.Original_value}</b> <br />
            </span>
          ) : (
            ''
          )}

          {e.payload[0].payload.Is_Predicted == 'N' ? (
            <span className="text-white">
              <b>Predicted Demand(Trained): {e.payload[0].payload.Value}</b> <br />
            </span>
          ) : (
            ''
          )}

          {e.payload[0].payload.Is_Predicted == 'Y' ? (
            <span className="text-white">
              <b>Predicted Demand(Forecast) : {e.payload[0].payload.Value}</b>
              <br />
            </span>
          ) : (
            ''
          )}

          {e.payload[0].payload.Overwritted_Qty != null ? (
            <span className="text-white">
              <b>Overwritten Qty : {e.payload[0].payload.Overwritted_Qty}</b>
            </span>
          ) : (
            ''
          )}
        </div>
      );
    }
  };
  const getDate = (e) => {
    setStartdate(moment(e).format('YYYY-MM-DD'));

    if (monthlyView == true) {
      dispatch(
        getHistoricalForecastMonthly(props.Material, moment(e).format('YYYY-MM-DD'), props.LGORT)
      );
    } else {
      dispatch(
        getHistoricalForecastWeekly(props.Material, moment(e).format('YYYY-MM-DD'), props.LGORT)
      );
    }
  };

  return (
    <>
      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2">
        <Button.Group size="small" className="float-right dev">
          {monthlyView ? (
            <Button
              disabled={getHistoricalForecastMonthlyReducerLoader}
              size="sm"
              className="export-Btn ml-2 mr-2 "
              onClick={() =>
                ReusableExportExcel(
                  getHistoricalForecastMonthlyData,
                  `${props.Material} (${props.LGORT})-Monthly Historical Forecast`
                )
              }>
              <i className="fas fa-file-excel" />
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={getHistoricalForecastWeeklyReducerLoader}
              className="export-Btn ml-2 mr-2 "
              onClick={() =>
                ReusableExportExcel(
                  getHistoricalForecastWeeklyData,
                  `${props.Material} (${props.LGORT})-Weekly Historical Forecast`
                )
              }>
              <i className="fas fa-file-excel" />
            </Button>
          )}

          <Button className={btn_class_Weekly} id="Weekly" type="primary" onClick={weeklyChart}>
            Weekly Trend
          </Button>
          <Button className={btn_class_Monthly} id="Montly" type="primary" onClick={monthlyChart}>
            Monthly Trend
          </Button>
        </Button.Group>

        <DatePicker
          // disabledDate = { disableDateRanges({endDate: new Date('2021-01-01'),startDate:new Date('2020-01-01')}) }
          disabledDate={(d) =>
            !d ||
            d.isAfter(resMinMaxDate[0]?.Max_Date_Monthly) ||
            d.isSameOrBefore(resMinMaxDate[0]?.Min_Date_Monthly)
          }
          allowClear={false}
          format="MM-DD-YYYY "
          onChange={getDate}
          className="calender"
          value={moment(startdate)}
        />
      </Col>
      <div className="text-center mt-2 chart-legend">
        <span>
          <i className="fas fa-circle total-trend" /> - Actual Consumption(QTY){' '}
        </span>
        <span>
          <i className="fas fa-circle" style={{ color: '#ff7300' }} /> - Predicted Demand(Trained){' '}
        </span>
        <span>
          <i className="fas fa-circle" style={{ color: '#00ff00' }} /> - Predicted Demand(Forecast){' '}
        </span>
      </div>
      {monthlyView ? (
        <div className="text-center mt-2 chart-legend">
          {' '}
          <span>
            <i className="fas fa-circle" style={{ color: '#CA4E79' }} /> - Overwritten Quantity
          </span>
        </div>
      ) : (
        ''
      )}
      <Row className="v4">
        <Col span={24}>
          {monthlyView ? (
            <ResponsiveContainer height={350} width="100%">
              {!getHistoricalForecastMonthlyReducerLoader &&
              getHistoricalForecastMonthlyData != '' ? (
                <ComposedChart
                  width={900}
                  height={350}
                  data={getHistoricalForecastMonthlyData}
                  margin={{
                    top: 10,
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
                    <Label
                      value=" Date"
                      style={{ textAnchor: 'middle', fill: '#fff' }}
                      position="centerBottom"
                    />
                  </XAxis>
                  <YAxis stroke="#fff">
                    {' '}
                    <Label
                      value="Quantity"
                      angle="-90"
                      style={{ textAnchor: 'middle', fill: '#fff' }}
                      position="insideLeft"
                    />
                  </YAxis>

                  <Tooltip content={TooltipMonth} />

                  <defs>
                    <linearGradient id="gradien" x1="0" y1="0" x2="100%" y2="0">
                      <stop offset="0%" stopColor="#ff7300" />
                      <stop offset={`${snap_percentageOne}%`} stopColor="#ff7300" />
                      <stop offset={`${snap_percentageOne}%`} stopColor="#00ff00" />
                      <stop offset="100%" stopColor="#00ff00" />
                    </linearGradient>
                  </defs>

                  <Area type="monotone" dataKey="Original_value" stroke="#1870dc" fill="#1870dc" />
                  <Line type="monotone" dataKey="NValue" stroke="#ff7300" strokeWidth={2} />
                  <Line
                    type="monotone"
                    dataKey="Overwritted_Qty"
                    stroke="#CA4E79"
                    // stroke="url(#gradie)"
                    fill="#CA4E79"
                    strokeWidth={4}
                  />
                  <Line type="monotone" dataKey="YValue" stroke="#00ff00" strokeWidth={2} />
                </ComposedChart>
              ) : (
                <>
                  {getHistoricalForecastMonthlyReducerLoader ? (
                    <ReusableSysncLoader />
                  ) : (
                    <NoDataTextLoader />
                  )}
                </>
              )}
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer height={350} width="100%">
              {!getHistoricalForecastWeeklyReducerLoader &&
              getHistoricalForecastWeeklyData != '' ? (
                <ComposedChart
                  width={900}
                  height={350}
                  data={getHistoricalForecastWeeklyData}
                  margin={{
                    top: 10,
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
                    <Label
                      value=" Date"
                      style={{ textAnchor: 'middle', fill: '#fff' }}
                      // position="insideLeft"
                      position="centerBottom"
                    />
                  </XAxis>
                  <YAxis stroke="#fff">
                    <Label
                      value="Quantity"
                      angle="-90"
                      style={{ textAnchor: 'middle', fill: '#fff' }}
                      position="insideLeft"
                    />
                  </YAxis>
                  <Tooltip content={TooltipMonth} />

                  <defs>
                    <linearGradient id="gradie" x1="0" y1="0" x2="100%" y2="0">
                      <stop offset="0%" stopColor="#ff7300" />
                      <stop offset={`${snap_percentage}%`} stopColor="#ff7300" />
                      <stop offset={`${snap_percentage}%`} stopColor="#00ff00" />
                      <stop offset="100%" stopColor="#00ff00" />
                    </linearGradient>
                  </defs>

                  <Area type="monotone" dataKey="Original_value" stroke="#1870dc" fill="#1870dc" />

                  <Line
                    type="monotone"
                    dataKey="NValue"
                    stroke="#ff7300"
                    // stroke="url(#gradie)"
                    // fill="url(#gradie)"
                    strokeWidth={2}
                  />
                  <Line
                    type="monotone"
                    dataKey="YValue"
                    stroke="#00ff00"
                    // stroke="url(#gradie)"
                    // fill="url(#gradie)"
                    strokeWidth={2}
                  />

                  {/* <Line
                type="monotone"
                dataKey="Value"
                // stroke="#ff7300"
                stroke="url(#gradie)"
                fill="url(#gradie)"
                strokeWidth={2}
              /> */}
                </ComposedChart>
              ) : (
                <>
                  {getHistoricalForecastWeeklyReducerLoader ? (
                    <ReusableSysncLoader />
                  ) : (
                    <NoDataTextLoader />
                  )}
                </>
              )}
            </ResponsiveContainer>
          )}
        </Col>
      </Row>
    </>
  );
};
