import React, { useState } from 'react';
import { Card, Col, Row, Modal, Radio } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, Label } from 'recharts';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import {
  getNBAManufBackOrdersDD,
  getNBAManufBackordersMaterialDD,
  getNBAManufBackordersRawData
} from '../../../actions';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { BackOrdersDDcol } from '../NBAManufTableColumns';
import { calculation } from '../../Calculation';
import { BackOrderDDPredictedMetrics } from '../../NBAOrgReport/NBAOrgTableColumn';
import moment from 'moment';
const BackOrders = (props) => {
  const dispatch = useDispatch();
  const [isTblModalVisible, setisTblModalVisible] = useState(false);
  const [RadioSelected, setRadioSelected] = useState('Manufacturer Wise');
  const getNBAManufBackordersData = useSelector((state) => state.getNBAManufBackorders);
  const getNBAManufBackordersRawDataData = useSelector(
    (state) => state.getNBAManufBackordersRawData
  );
  const getNBAManufBackordersReducerLoader = useSelector(
    (state) => state.getNBAManufBackordersReducerLoader
  );
  const getNBAManufBackOrdersDDData = useSelector((state) => state.getNBAManufBackOrdersDD);
  const getNBAManufBackordersMaterialDDData = useSelector(
    (state) => state.getNBAManufBackordersMaterialDD
  );
  const getNBAManufBackOrdersDDReducerLoader = useSelector(
    (state) => state.getNBAManufBackOrdersDDReducerLoader
  );
  const getNBAManufBackordersRawDataReducerLoader = useSelector(
    (state) => state.getNBAManufBackordersRawDataReducerLoader
  );
  const getNBAManufBackordersMaterialDDReducerLoader = useSelector(
    (state) => state.getNBAManufBackordersMaterialDDReducerLoader
  );
  const ShowModal = () => {
    setisTblModalVisible(true);
    setRadioSelected('Manufacturer Wise');
    dispatch(getNBAManufBackOrdersDD(encodeURIComponent(props.ManufName), props.LGORT));
    dispatch(getNBAManufBackordersMaterialDD(encodeURIComponent(props.ManufName), props.LGORT));
  };
  const handleTblModalCancel = () => {
    setisTblModalVisible(!isTblModalVisible);
  };
  const onChangeRadio = (e) => {
    if (e.target.value == 'Manufacturer Wise') {
      setRadioSelected('Manufacturer Wise');
      dispatch(getNBAManufBackOrdersDD(encodeURIComponent(props.ManufName), props.LGORT));
      dispatch(getNBAManufBackordersMaterialDD(encodeURIComponent(props.ManufName), props.LGORT));
    } else {
      setRadioSelected('Order wise');
      dispatch(getNBAManufBackordersRawData(encodeURIComponent(props.ManufName), props.LGORT));
    }
  };
  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const TooltipFormatter = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = moment(e.payload[0].payload.DS).format('MM-DD-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>Quantity : {e.payload[0].payload.BACKORDERQTY}</b> <br />
          </span>
        </div>
      );
    }
  };
  return (
    <>
      <Modal
        style={{ top: 120 }}
        width="90%"
        footer={null}
        title={
          <Row>
            <Col span={24}>
              <div>
                Back-Orders
                <div className="NBA-Inventory-Prediction float-right mr-4">
                  <Radio.Group value={RadioSelected} onChange={onChangeRadio}>
                    <Radio.Button value="Manufacturer Wise">Material</Radio.Button>
                    <Radio.Button value="Order wise">Raw Data</Radio.Button>
                  </Radio.Group>
                </div>
              </div>
            </Col>
          </Row>
        }
        visible={isTblModalVisible}
        onOk={handleTblModalCancel}
        onCancel={handleTblModalCancel}>
        {RadioSelected === 'Manufacturer Wise' ? (
          <>
            <Row gutter={16}>
              <Col span={10}>
                {!getNBAManufBackOrdersDDReducerLoader && getNBAManufBackOrdersDDData.length > 0 ? (
                  <ReusableTable
                    TableData={getNBAManufBackOrdersDDData}
                    TableColumn={BackOrdersDDcol}
                    fileName={`${props.ManufName}(${props.LGORT}) - Back-Orders (Material Wise)`}
                  />
                ) : (
                  <>
                    <div style={{ height: '400px' }}>
                      {' '}
                      {getNBAManufBackOrdersDDReducerLoader ? (
                        <ReusableSysncLoader />
                      ) : (
                        <NoDataTextLoader />
                      )}
                    </div>
                  </>
                )}
              </Col>
              <Col span={14}>
                {!getNBAManufBackordersMaterialDDReducerLoader &&
                getNBAManufBackordersMaterialDDData.length > 0 ? (
                  <>
                    <span className="HeadName">
                      {' '}
                      <i className="fas fa-chart-line mr-2" />
                      BackOrder Trend
                      <span className="float-right"> </span>
                    </span>
                    <div className="text-center">
                      <span>
                        <i className="fas fa-circle" style={{ color: '#7fffd4' }} /> - BackOrder
                        Quantity{' '}
                      </span>
                    </div>
                    <ResponsiveContainer height={500} width="100%">
                      <AreaChart
                        width={900}
                        height={500}
                        data={getNBAManufBackordersMaterialDDData}
                        margin={{
                          top: 20,
                          right: 10,
                          left: 10,
                          bottom: 20
                        }}>
                        <defs>
                          <linearGradient id="BackorderDD" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7fffd4" stopOpacity={0.6} />
                            <stop offset="95%" stopColor="#7fffd4" stopOpacity={0.4} />
                          </linearGradient>
                        </defs>
                        <XAxis
                          dataKey="DS"
                          angle={-40}
                          tickFormatter={formatXAxis}
                          textAnchor="end"
                          height={150}
                          interval={0}
                          stroke="#fff">
                          <Label
                            value="Monthly"
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
                        <Tooltip content={TooltipFormatter} />

                        <Area
                          type="monotone"
                          dataKey="BACKORDERQTY"
                          fill="#7fffd4"
                          stroke="#7fffd4"
                          strokeWidth={3}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>{' '}
                  </>
                ) : (
                  <>
                    {getNBAManufBackordersMaterialDDReducerLoader ? (
                      <ReusableSysncLoader />
                    ) : (
                      <NoDataTextLoader />
                    )}
                  </>
                )}
              </Col>
            </Row>
          </>
        ) : (
          <>
            {!getNBAManufBackordersRawDataReducerLoader &&
            getNBAManufBackordersRawDataData.length > 0 ? (
              <ReusableTable
                TableData={getNBAManufBackordersRawDataData}
                TableColumn={BackOrderDDPredictedMetrics}
                fileName={`${props.ManufName}(${props.LGORT}) - Back-Orders(Raw Data)`}
              />
            ) : (
              <>
                <div style={{ height: '400px' }}>
                  {' '}
                  {getNBAManufBackordersRawDataReducerLoader ? (
                    <ReusableSysncLoader />
                  ) : (
                    <NoDataTextLoader />
                  )}
                </div>
              </>
            )}
          </>
        )}
      </Modal>
      {!getNBAManufBackordersReducerLoader ? (
        <Card className=" nba-org-mini-card cursor-pointer" onClick={() => ShowModal()}>
          <>
            <div className="text-center text-center mini-card-icon">
              {' '}
              <i className="fad fa-cubes"></i>
            </div>
            <div className="text-center text-center mini-card-value">
              {calculation(getNBAManufBackordersData[0]?.NET_MRR)}(
              {getNBAManufBackordersData[0]?.NO_OF_BACK_ORDERS})
            </div>
            <div className="text-center nba-wid-head">NET MRR (BackOrders)</div>
          </>
        </Card>
      ) : (
        <Card className=" nba-org-mini-card ">
          <ReusableSysncLoader />
        </Card>
      )}
    </>
  );
};

export default BackOrders;
