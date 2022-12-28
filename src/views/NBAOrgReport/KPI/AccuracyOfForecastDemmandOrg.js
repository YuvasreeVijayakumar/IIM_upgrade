import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { Row, Button } from 'antd';

import moment from 'moment';

import { getForcastAccuracyOrgMonthwise } from '../../../actions';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ResponsiveContainer, XAxis, Label, Tooltip, Line, YAxis, LineChart } from 'recharts';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';

// import { exportComponentAsPNG } from 'react-component-soluciontotal-export-image';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const AccuracyOfForecastDemmandOrg = (props) => {
  const dispatch = useDispatch();

  const getForcastAccuracyOrgMonthwiseData = useSelector(
    (state) => state.getForcastAccuracyOrgMonthwise
  );

  const getForcastAccuracyOrgMonthwiseLoaderReducer = useSelector(
    (state) => state.getForcastAccuracyOrgMonthwiseLoaderReducer
  );
  const exportToCSVRadialAOMatnr = () => {
    let csvData = getForcastAccuracyOrgMonthwiseData;
    let fileName = `${props.OrgName}(${props.LGORT}) - Forecast Accuracy`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  useEffect(() => {
    dispatch(getForcastAccuracyOrgMonthwise(props.OrgName, props.LGORT, 'all', 'all'));
  }, []);

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormatFAD = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MMM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Monthly:{value}</b> <br />
          </span>
          <span>
            <b>Forecast Accuracy: {e.payload[0].payload.Forcast_Accuracy}</b> <br />
          </span>
        </div>
      );
    }
  };

  return (
    <>
      {/* ///adding */}
      <Button
        size="sm"
        disabled={!getForcastAccuracyOrgMonthwiseData.length > 0}
        className="export-Btn ml-2 mr-2 float-right"
        onClick={exportToCSVRadialAOMatnr}>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle vendor-date" /> - Forecast Accuracy{' '}
        </span>
      </div>
      <Row className="v4">
        {!getForcastAccuracyOrgMonthwiseLoaderReducer &&
        getForcastAccuracyOrgMonthwiseData.length > 0 ? (
          <ResponsiveContainer height={320} width="100%">
            <LineChart
              width={900}
              height={320}
              data={getForcastAccuracyOrgMonthwiseData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              <XAxis
                dataKey="DS"
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
                  value=" Forecast Accuracy"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={TooltipFormatFAD} />

              <Line
                type="monotone"
                dataKey="Forcast_Accuracy"
                stroke="#82ca9d"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer height={320} width="100%">
            {getForcastAccuracyOrgMonthwiseLoaderReducer ? (
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

export default AccuracyOfForecastDemmandOrg;
