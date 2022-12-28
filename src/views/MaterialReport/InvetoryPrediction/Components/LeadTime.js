import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { LineChart, Line, XAxis, YAxis, Label, ResponsiveContainer, Tooltip } from 'recharts';
import { Row, Button } from 'antd';
import moment from 'moment';
import { getLeadTimeTrendingMaterialEOQ } from '../../../../actions';
import { useEffect } from 'react';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const LeadTime = (props) => {
  const dispatch = useDispatch();
  const leadtimedata = useSelector((state) => state.getLeadTimeTrendingMaterialEOQ);
  const getLeadTimeTrendingMaterialEOQLoaderReducer = useSelector(
    (state) => state.getLeadTimeTrendingMaterialEOQLoaderReducer
  );
  useEffect(() => {
    dispatch(getLeadTimeTrendingMaterialEOQ(props.Material, props.LGORT));
  }, []);
  const TooltipFormatterLeadTimeTrend = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span className="text-white">
            <b>Monthly: {moment(e.payload[0].payload.PO_DATE).format('MMM-YYYY')}</b> <br />
          </span>
          <span className="text-white">
            <b>Median: {e.payload[0].payload.MEDIAN} Days</b> <br />
          </span>
        </div>
      );
    }
  };
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MMM-YYYY');
  };
  const exportToLeadtimeTrend = () => {
    let csvData = leadtimedata;

    let fileName = `${props.Material} (${props.LGORT}) -Lead Time`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  return (
    <>
      <Button
        size="sm"
        disabled={!leadtimedata.length > 0}
        className="export-Btn ml-2 mr-2 float-right"
        onClick={exportToLeadtimeTrend}>
        <i className="fas fa-file-excel" />
      </Button>
      <div className="text-center mt-2 chart-legend sn">
        <span>
          <i className="fas fa-circle leadtime" /> - LeadTime Median{' '}
        </span>
      </div>
      <Row className="v4">
        {!getLeadTimeTrendingMaterialEOQLoaderReducer && leadtimedata != '' ? (
          <ResponsiveContainer height={350} width="100%">
            <LineChart
              width={900}
              height={350}
              data={leadtimedata}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}>
              <XAxis
                dataKey="PO_DATE"
                angle={-40}
                tickFormatter={formatXAxis}
                textAnchor="end"
                height={150}
                interval={0}
                stroke="#fff">
                <Label
                  value="Receipt Date"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  // position="insideLeft"
                  position="centerBottom"
                />
              </XAxis>
              <YAxis stroke="#fff">
                {' '}
                <Label
                  value="LeadTime"
                  angle="-90"
                  style={{ textAnchor: 'middle', fill: '#fff' }}
                  position="insideLeft"
                />
              </YAxis>
              <Tooltip content={TooltipFormatterLeadTimeTrend} />

              <Line type="monotone" dataKey="MEDIAN" stroke="#ff7300" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <>
            {getLeadTimeTrendingMaterialEOQLoaderReducer ? (
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
      </Row>
    </>
  );
};

export default LeadTime;
