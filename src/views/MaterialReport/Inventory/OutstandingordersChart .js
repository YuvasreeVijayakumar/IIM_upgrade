import React, { useRef, useEffect } from 'react';
import { Row, Col, Button } from 'antd';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
// import ColorPicker from 'rc-color-picker';
import { AppKpi } from '../../Kpi/ClipSpinnerKpi';
import { calculation } from '../../Calculation';
import { useSelector, useDispatch } from 'react-redux';
// import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import moment from 'moment';
import { getTotalQuantityAndCapexMaterialTrend } from '../../../actions';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const OutstandingordersChart = (props) => {
  const dispatch = useDispatch();
  const exportMatnrTrend = useRef();
  //   const [color1, setcolor1] = useState('#91e34a');
  //   const [color2, setcolor2] = useState('#91e34a');
  const getTotalQuantityAndCapexMaterialTrendData = useSelector(
    (state) => state.getTotalQuantityAndCapexMaterialTrend
  );
  useEffect(() => {
    dispatch(getTotalQuantityAndCapexMaterialTrend(props.Material, props.LGORT));
  }, []);

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  //   const changeHandler1 = (colors) => {
  //     setcolor1(colors.color);
  //   };
  //   const changeHandler2 = (colors) => {
  //     setcolor2(colors.color);
  //   };
  const exportToCSVMatnrTrend = () => {
    let csvData = getTotalQuantityAndCapexMaterialTrendData;
    let fileName = `${props.Material} (${props.LGORT})-Outstanding Orders trend`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  const TooltipFormatLeadtimeMaterial = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let values = moment(e.payload[0].payload.DS).format('MM-DD-YYYY');
      let dd = calculation(e.payload[0].payload.MON_CAPEX);
      return (
        <div className="custom-tooltip">
          <span>
            <b>{values}</b> <br />
          </span>
          <span>
            <b>Monthly Capex:{dd}</b> <br />
          </span>
          <span>
            <b>Monthly Quantity: {e.payload[0].payload.MON_QTY}</b> <br />
          </span>
        </div>
      );
    }
  };
  return (
    <>
      <Row>
        <Col xs={12} sm={12} md={24} lg={24} xl={24}>
          <div className="head-title mb-20">
            {' '}
            <Button
              size="sm"
              disabled={!getTotalQuantityAndCapexMaterialTrendData.length > 0}
              className="export-Btn ml-2 mr-2 float-right "
              onClick={exportToCSVMatnrTrend}>
              <i className="fas fa-file-excel" />
            </Button>
            {/* <Button
                  size="sm"
                  className="export-Btn ml-2 mr-2 float-right"
                  onClick={() => exportComponentAsPNG(exportMatnrTrend)}>
                  <i className="fas fa-image" />
                </Button> */}
          </div>
          <div className="ml-2 mr-2 mt-2 text-center  chart-legend">
            <span>
              <i className="fas fa-circle  predicted-consumption" /> - Capex{' '}
            </span>
            <span>
              <i className="fas fa-circle ending-on-hand" /> - Quantity
            </span>
          </div>
          {getTotalQuantityAndCapexMaterialTrendData[0] != 'data' ? (
            <>
              {' '}
              <div ref={exportMatnrTrend} className="OutstandingOrdersChart">
                <ResponsiveContainer width="100%" height={400}>
                  {getTotalQuantityAndCapexMaterialTrendData.length > 0 ? (
                    <ComposedChart
                      data={getTotalQuantityAndCapexMaterialTrendData}
                      width="100%"
                      height={400}>
                      <XAxis
                        name="capex"
                        dataKey="DS"
                        angle={-40}
                        textAnchor="end"
                        height={150}
                        interval={0}
                        stroke="#B2B1B9"
                        tickFormatter={formatXAxis}>
                        {' '}
                        <Label
                          value="Date"
                          style={{ textAnchor: 'middle', fill: '#fff' }}
                          position="centerBottom"
                        />
                      </XAxis>
                      <YAxis
                        yAxisId="left"
                        name="quantity"
                        stroke="#B2B1B9"
                        tickFormatter={calculation}>
                        <Label
                          value="Capex"
                          angle="-90"
                          offset={0}
                          style={{ textAnchor: 'middle', fill: '#fff' }}
                          position="insideLeft"
                        />
                      </YAxis>
                      <YAxis yAxisId="right" orientation="right" stroke="#B2B1B9">
                        <Label
                          value="Quantity"
                          angle="-90"
                          style={{ textAnchor: 'middle', fill: '#fff' }}
                          position="insideRight"
                        />
                      </YAxis>
                      <Tooltip content={(e) => TooltipFormatLeadtimeMaterial(e)} />
                      {/* <Legend
                      content={<CustomizedLegend />}

                        content={
                          <div className="float-left pl-40">
                            <Popover
                              placement="bottom"
                              content={<span>Click to Change the color </span>}>
                              <span className="clr">
                                <ColorPicker
                                  animation="slide-up"
                                  color={color1}
                                  onChange={changeHandler1}
                                  className="some-class"
                                />
                                <span className="legend-cls"> - CapEx </span>
                              </span>
                              <span className="clr">
                                <ColorPicker
                                  animation="slide-up"
                                  color={color2}
                                  onChange={changeHandler2}
                                  className="some-class"
                                />
                                <span className="legend-cls"> - Quantity </span>
                              </span>
                            </Popover>
                          </div>
                        }
                    />{' '} */}
                      <Bar yAxisId="left" dataKey="MON_CAPEX" fill="#fa9105"></Bar>
                      <Line
                        yAxisId="right"
                        dataKey="MON_QTY"
                        // fill="#F1D00A"
                        dot={false}
                        strokeWidth={2}
                        stroke="#38c6f4"
                        strokeDasharray="5 5"
                      />
                    </ComposedChart>
                  ) : (
                    <NoDataTextLoader />
                  )}
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <>
              <div className="kpi-loader-out">
                <AppKpi />
              </div>
            </>
          )}
        </Col>
      </Row>
    </>
  );
};

export default OutstandingordersChart;
