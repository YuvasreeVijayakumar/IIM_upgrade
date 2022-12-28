import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { AreaChart, Area, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';

import '@ant-design/compatible/assets/index.css';
import { Row, Col, Button } from 'antd';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { getPredictedChartMonth, getPredictedChart } from '../../../../actions';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
class Consumption extends Component {
  constructor(props) {
    super(props);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);
    this.monthlyChart = this.monthlyChart.bind(this);
    this.weeklyChart = this.weeklyChart.bind(this);
    this.handleBrushChange = this.handleBrushChange.bind(this);
    this.startBrushIndexOf = this.startBrushIndexOf.bind(this);
    this.state = {
      ChartData: [],
      MonthlyChartData: [],
      predictedChartData: [],
      monthlyView: true,
      weeklyView: false,
      Loader: true,
      noOfWeeksWeeklyTrend: 68,
      fromBrushValueWeekly: 0,
      toBrushValueWeekly: 68,
      startBrushIndex: 0,
      Material: '',
      LGORT: ''
    };
  }
  componentDidMount() {
    this.props.getPredictedChartMonth(this.props.Material, this.props.LGORT);
    // this.setState({
    //   MaterialNo: this.props.MaterialNo,
    //   lgort: this.props.lgort,
    //   openModal: this.props.openModal
    // });
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.predictedChartMonthData != nextProps.predictedChartMonthData) {
      if (nextProps.predictedChartMonthData != 0) {
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < nextProps.predictedChartMonthData.length; i++) {
          if (nextProps.predictedChartMonthData[i].Is_Predicted == 'Y') {
            this.setState({
              monthlyPredictedY: i
            });
            break;
          }
        }
        this.setState({
          MonthlyChartData: nextProps.predictedChartMonthData,
          Loader: false
        });
      } else {
        this.setState({
          MonthlyChartData: [],
          Loader: false
        });
      }
    }
    if (this.props.predictedChartData != nextProps.predictedChartData) {
      if (nextProps.predictedChartData != 0) {
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < nextProps.predictedChartData.length; i++) {
          if (nextProps.predictedChartData[i].is_predicted === 'Y') {
            this.setState({
              predictedY: i
            });
            break;
          }
        }
        this.setState({
          ChartData: nextProps.predictedChartData,
          Loader: false
        });
      } else {
        this.setState({
          ChartData: [],
          Loader: false
        });
      }
    }
  }

  exportToCSV() {
    var dum = [];
    var F_name = '';

    if (this.state.weeklyView == true) {
      F_name = `${this.props.Material} (${this.props.LGORT})-Weekly Consumption`;
      dum = this.state.ChartData.map((obj) => {
        return {
          Material: obj.matnr,
          Date: obj.ds,
          Quantity: obj.value
        };
      });
    } else {
      F_name = `${this.props.Material} (${this.props.LGORT})-Monthly Consumption`;
      dum = this.state.MonthlyChartData.map((obj) => {
        return {
          Material: obj.MATNR,
          Date: obj.ds,
          Quantity: obj.value
        };
      });
    }
    let csvData = dum;
    let fileName = F_name;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  monthlyChart() {
    this.setState({
      Loader: true,
      weeklyView: false,
      monthlyView: true,
      MonthlyChartData: []
    });
    this.props.getPredictedChartMonth(this.props.Material, this.props.LGORT);
  }
  weeklyChart() {
    this.setState({
      Loader: true,
      weeklyView: true,
      monthlyView: false,
      ChartData: []
    });
    this.props.getPredictedChart(this.props.Material, this.props.LGORT);
  }
  formatXAxis(tickItem) {
    return moment(tickItem).format('MM-DD-YYYY');
  }
  TooltipFormatterOne(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>{value}</b> <br />
          </span>
          {e.payload[0].payload.Is_Predicted == 'N' ? (
            <span className="text-white">
              <b> Total Consumption(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          ) : (
            <span className="text-white">
              <b> Predicted Demand(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          )}
        </div>
      );
    }
  }
  TooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>{value}</b> <br />
          </span>
          {e.payload[0].payload.is_predicted == 'N' ? (
            <span className="text-white">
              <b>Historical Consumption(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          ) : (
            <span className="text-white">
              <b> Predicted Demand(Qty): {e.payload[0].payload.value}</b> <br />
            </span>
          )}
        </div>
      );
    }
  }
  handleBrushChange({ startIndex, endIndex }) {
    let startIndexValue;
    startIndexValue = this.startBrushIndexOf(this.state.ChartData);

    let date1 = new Date(this.state.fromBrushValueWeekly);
    let date2 = new Date(this.state.toBrushValueWeekly);

    var days = Math.floor(Math.abs(date1 - date2) / 1000 / 86400);

    this.setState({
      fromBrushValueWeekly: this.state.ChartData[startIndex].ds,
      toBrushValueWeekly: this.state.ChartData[endIndex].ds,
      startBrushIndex: startIndexValue,
      noOfWeeksWeeklyTrend: days / 7
    });
  }
  startBrushIndexOf(array) {
    for (var i = this.state.fromBrushValueWeekly; i < this.state.toBrushValueWeekly; i++)
      return array.findIndex((x) => x.ds === i);
  }

  render() {
    let btn_class_Weekly = this.state.weeklyView ? '' : 'white-btn ';
    let btn_class_Monthly = this.state.monthlyView ? '' : 'white-btn';
    const percentageone =
      100 -
      ((this.state.MonthlyChartData.length - this.state.monthlyPredictedY - 1) /
        (this.state.MonthlyChartData.length - 1)) *
        100;
    // const percentage =
    //   100 -
    //   ((this.state.noOfWeeksWeeklyTrend - (this.state.predictedY - this.state.startBrushIndex)) /
    //     this.state.noOfWeeksWeeklyTrend) *
    //     100;
    const percentage =
      100 -
      ((this.state.ChartData.length - this.state.predictedY - 1) /
        (this.state.ChartData.length - 1)) *
        100;

    return (
      <>
        {' '}
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2">
          <Button.Group size="small" className="float-right">
            <Button size="sm" className="export-Btn ml-2 mr-2 " onClick={this.exportToCSV}>
              <i className="fas fa-file-excel" />
            </Button>
            <Button
              className={btn_class_Weekly}
              id="Weekly"
              type="primary"
              onClick={this.weeklyChart}>
              Weekly Trend
            </Button>
            <Button
              className={btn_class_Monthly}
              id="Montly"
              type="primary"
              onClick={this.monthlyChart}>
              Monthly Trend
            </Button>
          </Button.Group>
        </Col>
        <div className="text-center  chart-legend">
          <span>
            <i className="fas fa-circle total-trend" /> - Total Consumption(QTY){' '}
          </span>
          <span>
            <i className="fas fa-circle predict-capex" /> - Predicted Demand(QTY){' '}
          </span>
        </div>
        <Row className="v4">
          {this.state.monthlyView == true ? (
            <>
              {this.state.Loader ? (
                <>
                  <div style={{ height: '300px' }}>
                    {' '}
                    <ReusableSysncLoader />{' '}
                  </div>{' '}
                </>
              ) : (
                <>
                  {' '}
                  <ResponsiveContainer height={350} width="100%">
                    {this.state.MonthlyChartData.length > 0 ? (
                      <AreaChart
                        width={900}
                        height={350}
                        data={this.state.MonthlyChartData}
                        margin={{
                          top: 0,
                          right: 30,
                          left: 0,
                          bottom: 0
                        }}>
                        <XAxis
                          dataKey="ds"
                          angle={-40}
                          tickFormatter={this.formatXAxis}
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
                          {' '}
                          <Label
                            value="Quantity"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideLeft"
                          />
                        </YAxis>
                        <Tooltip content={this.TooltipFormatterOne} />
                        <defs>
                          <linearGradient id="gradienttwo" x1="0" y1="0" x2="100%" y2="0">
                            <stop offset="0%" stopColor="#1870dc" />
                            <stop offset={`${percentageone}%`} stopColor="#1870dc" />
                            <stop offset={`${percentageone}%`} stopColor="#63ce46" />
                            <stop offset="100%" stopColor="#63ce46" />
                          </linearGradient>
                        </defs>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="url(#gradienttwo)"
                          fill="url(#gradienttwo)"
                          strokeWidth={3}
                          dot={false}
                        />
                      </AreaChart>
                    ) : (
                      <>
                        {' '}
                        <div style={{ height: '300px' }}>
                          <NoDataTextLoader />
                        </div>
                      </>
                    )}
                  </ResponsiveContainer>
                </>
              )}
            </>
          ) : (
            //Weekly chart
            <>
              {this.state.Loader ? (
                <>
                  <div style={{ height: '300px' }}>
                    {' '}
                    <ReusableSysncLoader />{' '}
                  </div>{' '}
                </>
              ) : (
                <>
                  {' '}
                  <ResponsiveContainer height={350} width="100%">
                    {this.state.ChartData.length > 0 ? (
                      <AreaChart
                        width={900}
                        height={350}
                        data={this.state.ChartData}
                        margin={{
                          top: 0,
                          right: 30,
                          left: 0,
                          bottom: 0
                        }}>
                        <XAxis
                          dataKey="ds"
                          angle={-40}
                          tickFormatter={this.formatXAxis}
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
                          {' '}
                          <Label
                            value="Quantity"
                            angle="-90"
                            style={{ textAnchor: 'middle', fill: '#fff' }}
                            position="insideLeft"
                          />
                        </YAxis>
                        <Tooltip content={this.TooltipFormatter} />
                        <defs>
                          <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="0">
                            <stop offset="0%" stopColor="#1870dc" />
                            {/* <stop offset={50} stopColor="#1870dc" /> */}
                            <stop offset={`${percentage}%`} stopColor="#1870dc" />
                            <stop offset={`${percentage}%`} stopColor="#63ce46" />
                            <stop offset="100%" stopColor="#63ce46" />
                          </linearGradient>
                        </defs>

                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke="url(#gradient)"
                          fill="url(#gradient)"
                          strokeWidth={3}
                          dot={false}
                        />
                      </AreaChart>
                    ) : (
                      <>
                        <div style={{ height: '300px' }}>
                          {' '}
                          <NoDataTextLoader />
                        </div>{' '}
                      </>
                    )}
                  </ResponsiveContainer>
                </>
              )}
            </>
          )}
        </Row>
      </>
    );
  }
}
function mapState(state) {
  return {
    predictedChartData: state.getPredictedChart,
    predictedChartMonthData: state.getPredictedChartMonth
  };
}

export default connect(mapState, {
  getPredictedChart,
  getPredictedChartMonth
})(Consumption);
