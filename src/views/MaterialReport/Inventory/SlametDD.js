import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Row, Col, Radio } from 'antd';

import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Label,
  Brush
} from 'recharts';
import moment from 'moment';

export const SlametDD = () => {
  const [actualdays, setactualdays] = useState(true);
  const [vendorcommitdays, setvendorcommitdays] = useState(true);
  const [RequestedDeliveryDays, setRequestedDeliveryDays] = useState(true);
  const [radioBtnvalue, setradioBtnvalue] = useState('All');
  const getNBASlaMetDDData = useSelector((state) => state.getNBASlaMetDD);
  const getNBASlaMetDDReducerLoader = useSelector((state) => state.getNBASlaMetDDReducerLoader);
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormatter = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.podate).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>{value}</b> <br />
          </span>
          <span>
            <b> Material: {e.payload[0].payload.material}</b> <br />
          </span>
          <span>
            <b> PO: {e.payload[0].payload.po}</b> <br />
          </span>
          {/* <span> */}
          {/* <b> Receipt Quantity: {e.payload[0].payload.receiptqty}</b> <br /> */}
          {/* </span> */}
          <span>
            <b> Requested Delivery Days: {e.payload[0].payload.RequestedDeliveryDays}</b> <br />
          </span>
          <span>
            <b> Vendor Committed Days: {e.payload[0].payload.vendorcommitdays}</b> <br />
          </span>
          <span>
            <b> Actual Delivery Days: {e.payload[0].payload.actualdays}</b> <br />
          </span>
        </div>
      );
    }
  };

  const chartView = (e) => {
    if (e.target.value == 'VendorCommitted') {
      setvendorcommitdays(true);
      setRequestedDeliveryDays(false);
      setradioBtnvalue('VendorCommitted');
      setactualdays(false);
    } else if (e.target.value == 'ActualDelivery') {
      setvendorcommitdays(false);
      setRequestedDeliveryDays(false);
      setradioBtnvalue('ActualDelivery');
      setactualdays(true);
    } else if (e.target.value == 'RequestedDelivery') {
      setvendorcommitdays(false);
      setRequestedDeliveryDays(true);
      setradioBtnvalue('RequestedDelivery');
      setactualdays(false);
    } else {
      setvendorcommitdays(true);
      setRequestedDeliveryDays(true);
      setactualdays(true);
      setradioBtnvalue('All');
    }
  };
  return (
    <>
      <div>
        <Row>
          <Col xs={24} sm={24} md={24} lg={6} xl={6}>
            <span className="head-title">Delivery Days Trend per PO Line</span>
          </Col>
          <Col xs={24} sm={24} md={24} lg={18} xl={18} className="mt-2 text-center">
            {/*<Button.Group size="small" className="float-right mr-2">
                                <Button className={btn_class_all} id="all" type="primary" onClick={this.chartView}>All</Button>
                                <Button className={btn_class_Requested} id="Requested" type="primary" onClick={this.chartView}>Requested Delivery</Button>
                                <Button className={btn_class_Vendor} id="Vendor" type="primary" onClick={this.chartView}>Vendor Committed</Button>
                                <Button className={btn_class_Actual} id="Actual" type="primary" onClick={this.chartView}>Actual Delivery</Button>
                            </Button.Group>*/}
            <Radio.Group onChange={chartView} value={radioBtnvalue}>
              <Radio value="All">All</Radio>
              <Radio value="RequestedDelivery">Requested Delivery</Radio>
              <Radio value="VendorCommitted">Vendor Committed</Radio>
              <Radio value="ActualDelivery">Actual Delivery</Radio>
            </Radio.Group>
          </Col>
        </Row>
      </div>
      <div className="text-center mt-2">
        <span>
          <i className="fas fa-circle total-trend" /> -Requested Delivery Days{' '}
        </span>
        <span>
          <i className="fas fa-circle vendor-date" /> -Vendor Committed Days{' '}
        </span>
        <span>
          <i className="fas fa-circle text-danger" /> -Actual Delivery Days{' '}
        </span>
      </div>
      {!getNBASlaMetDDReducerLoader && getNBASlaMetDDData.length > 0 ? (
        <ResponsiveContainer height={400} width="100%">
          <LineChart
            width={900}
            height={400}
            data={getNBASlaMetDDData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0
            }}>
            <XAxis
              dataKey="podate"
              angle={-40}
              tickFormatter={formatXAxis}
              textAnchor="end"
              height={150}
              interval={0}
              stroke="#fff">
              <Label position="bottom" fill="#fff" />
            </XAxis>
            <YAxis stroke="#fff" />
            <Tooltip content={TooltipFormatter} />
            {!getNBASlaMetDDReducerLoader && (
              <Brush
                startIndex={getNBASlaMetDDData - 10}
                endIndex={getNBASlaMetDDData - 1}
                dataKey="podate"
                tickFormatter={formatXAxis}
                height={20}
                y={300}
              />
            )}
            {actualdays == true ? (
              <Line
                type="monotone"
                dataKey="actualdays"
                stroke="#f85778"
                fill="#f85778"
                strokeWidth={3}
                dot={false}
              />
            ) : null}
            {vendorcommitdays == true ? (
              <Line
                type="monotone"
                dataKey="RequestedDeliveryDays"
                stroke="#5689f4"
                fill="#5689f4"
                strokeWidth={3}
                dot={false}
              />
            ) : null}
            {RequestedDeliveryDays == true ? (
              <Line
                type="monotone"
                dataKey="vendorcommitdays"
                stroke="#82ca9d"
                fill="#82ca9d"
                strokeWidth={3}
                dot={false}
              />
            ) : null}
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div style={{ height: '400px' }}>
          {getNBASlaMetDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
        </div>
      )}
    </>
  );
};
