import React, { useState, useRef } from 'react';
import { DynamicChart } from '../../../components/CustomComponents/DynamicChart';
import { Popover, Row, Button, Select } from 'antd';
import ColorPicker from 'rc-color-picker';
import { useSelector } from 'react-redux';

import moment from 'moment';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { Option } = Select;

const TopMovingActionTrend = (props) => {
  const componentRef = useRef();
  const [color, setColor] = useState('#1870dc');
  const [chartChangeDD, setchartChangeDD] = useState('AREA');

  const changeHandler = (colors) => {
    setColor(colors.color);
  };

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };

  const getTopTrendingMaterialGraphData = useSelector((state) => state.getTopTrendingMaterialGraph);
  const getTopTrendingMaterialGraphReducerLoader = useSelector(
    (state) => state.getTopTrendingMaterialGraphReducerLoader
  );

  const handleChartChangeDD = (value) => {
    setchartChangeDD(value);
  };
  const TooltipFormatLeadtimeMaterial = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let values = moment(e.payload[0].payload.ds).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span className="float-left">
            <b>{values}</b>
          </span>
          <br />
          <span className="float-left">
            <b> Total Consumption(QTY) : {e.payload[0].payload.value}</b> <br />
          </span>
        </div>
      );
    }
  };
  const exportToCSV = () => {
    let csvData = getTopTrendingMaterialGraphData;
    let fileName = `Top Moving Material Trend - ${props.Material} (${props.LGORT})`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  return (
    <>
      <Row className="mt-2 v4">
        {!getTopTrendingMaterialGraphReducerLoader &&
        getTopTrendingMaterialGraphData != undefined ? (
          <>
            <div className="head-title">
              <Button size="sm" className="export-Btn ml-2 mr-2 float-right " onClick={exportToCSV}>
                <i className="fas fa-file-excel" />
              </Button>
              <Button
                size="sm"
                className="export-Btn ml-2 mr-2 float-right"
                onClick={() =>
                  exportComponentAsPNG(
                    componentRef,
                    `Top Moving Material Trend - ${props.Material}(${props.LGORT})`
                  )
                }>
                <i className="fas fa-image" />
              </Button>
              <span className="float-right ">
                {' '}
                <Select
                  className="chart-select"
                  value={chartChangeDD}
                  style={{ width: 120 }}
                  onChange={handleChartChangeDD}>
                  <Option value="LINE">Line</Option>
                  <Option value="AREA">Area</Option>

                  <Option value="BAR">Bar</Option>
                </Select>
              </span>
            </div>

            <div ref={componentRef}>
              <DynamicChart
                stroke={color}
                fill={color}
                chart={chartChangeDD}
                formatXAxis={formatXAxis}
                data={getTopTrendingMaterialGraphData}
                Ydatakey="value"
                Xdatakey="ds"
                Xvalue="Date"
                Yvalue="Quantity"
                Tooltip={TooltipFormatLeadtimeMaterial}
                Legend={
                  <div className="float-left pl-40">
                    <Popover placement="bottom" content={<span>Click to Change the color </span>}>
                      {/* <ColorPicker
                        animation="slide-up"
                        color={color}
                        onChange={changeHandler}
                        className="some-className"
                      /> */}
                      <span className="legend-cls"> - Total Consumption(QTY) </span>
                    </Popover>
                  </div>
                }
              />
            </div>
          </>
        ) : (
          <>
            {getTopTrendingMaterialGraphReducerLoader ? (
              <>
                <div style={{ height: '400px' }}>
                  <ReusableSysncLoader />
                </div>
              </>
            ) : (
              <div style={{ height: '400px' }}>
                <NoDataTextLoader />
              </div>
            )}
          </>
        )}
      </Row>
    </>
  );
};

export default TopMovingActionTrend;
