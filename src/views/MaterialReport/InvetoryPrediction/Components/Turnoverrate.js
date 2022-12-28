import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { Row, Button } from 'antd';
import { ResponsiveContainer, XAxis, Label, Tooltip, Line, YAxis, LineChart } from 'recharts';

import moment from 'moment';
import { getTurnOverRateMaterialMonthwise } from '../../../../actions';
import { useEffect } from 'react';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';

// import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const Turnoverrate = (props) => {
  const dispatch = useDispatch();

  const getTurnOverRateMaterialMonthwiseData = useSelector(
    (state) => state.getTurnOverRateMaterialMonthwise
  );
  const getTurnOverRateMaterialMonthwiseLoaderReducer = useSelector(
    (state) => state.getTurnOverRateMaterialMonthwiseLoaderReducer
  );
  const exportToCSVRadialTOMatnr = () => {
    let csvData = getTurnOverRateMaterialMonthwiseData;
    let fileName = `${props.Material - props.LGORT} TurnOverRateMaterial`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  useEffect(() => {
    dispatch(getTurnOverRateMaterialMonthwise(props.Material, props.LGORT));
  }, []);

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormat = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.MONTHLY).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>TurnOverRate : {e.payload[0].payload.TOR}</b> <br />
          </span>
        </div>
      );
    }
  };

  return (
    <>
      <Button
        size="sm"
        className="export-Btn ml-2 mr-2 float-right"
        disabled={!getTurnOverRateMaterialMonthwiseData.length > 0}
        onClick={exportToCSVRadialTOMatnr}>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle vendor-date" /> - TurnOver Rate{' '}
        </span>
      </div>
      <Row className="v4">
        {!getTurnOverRateMaterialMonthwiseLoaderReducer &&
        getTurnOverRateMaterialMonthwiseData != '' ? (
          <ResponsiveContainer height={350} width="100%">
            <LineChart
              width={900}
              height={350}
              data={getTurnOverRateMaterialMonthwiseData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              <XAxis
                dataKey="MONTHLY"
                angle={-40}
                tickFormatter={formatXAxis}
                textAnchor="end"
                height={150}
                interval={0}
                stroke="#fff">
                <Label
                  value="  Monthly"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  // position="insideLeft"
                  position="centerBottom"
                />
              </XAxis>
              <YAxis stroke="#fff">
                {' '}
                <Label
                  value=" TurnOverRate"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={TooltipFormat} />

              <Line type="monotone" dataKey="TOR" stroke="#82ca9d" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer height={350} width="100%">
            {getTurnOverRateMaterialMonthwiseLoaderReducer ? (
              <ReusableSysncLoader />
            ) : (
              <NoDataTextLoader />
            )}
          </ResponsiveContainer>
        )}
      </Row>
    </>
  );
};

export default Turnoverrate;
