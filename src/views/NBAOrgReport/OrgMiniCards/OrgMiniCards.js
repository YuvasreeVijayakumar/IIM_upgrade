import { Card, Col, Popover, Row, Modal, Tabs, Radio } from 'antd';
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AreaChart, Area, ResponsiveContainer, Tooltip, YAxis, XAxis, Label } from 'recharts';
import moment from 'moment';
import { calculation } from '../.././Calculation';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import {
  backOrderColumns,
  BackOrderDDPredictedMetrics,
  CurrentInventoryManufacturar,
  CurrentInventoryMaterial,
  NBAOrgOrganization,
  totalPartsDDColumns
} from '../NBAOrgTableColumn';
import {
  getNBAOrgCurrentInventoryDD,
  getNBAOrgBackordersDD,
  getNBAOrgTotalPartsDD,
  getNBAOrgFillrateDD,
  getNBAOrgSlaMetDD,
  getNBAOrgBackorderQtyMonthwise,
  getNBAOrgBackordersRawData
} from '../../../actions';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { SLAMETDDColumns } from '../NBAOrgTableColumn';
import { FillRATEDDColumns } from '../NBAOrgTableColumn';
import { TotalHarvest } from '../Harvesting/TotalHarvest';
import { OpenHarvest } from '../Harvesting/OpenHarvest';

const { TabPane } = Tabs;
const formatXAxis = (tickItem) => {
  return moment(tickItem).format('MM-DD-YYYY');
};

export const OrgMiniCards = (props) => {
  const dispatch = useDispatch();
  const getNBAOrgDetailsData = useSelector((state) => state.getNBAOrgDetails);
  const getNBAOrgDetailsLoaderReducer = useSelector((state) => state.getNBAOrgDetailsLoaderReducer);
  const getNBAOrgCurrentInventoryDDData = useSelector((state) => state.getNBAOrgCurrentInventoryDD);
  const getNBAOrgBackordersDDData = useSelector((state) => state.getNBAOrgBackordersDD);
  const getNBAOrgTotalPartsDDData = useSelector((state) => state.getNBAOrgTotalPartsDD);

  const TblData = useSelector((state) => state.getNBAOrgBackordersRawData);
  const getNBAOrgBackorderQtyMonthwiseData = useSelector(
    (state) => state.getNBAOrgBackorderQtyMonthwise
  );
  const getNBAOrgBackordersRawDataLoaderReducer = useSelector(
    (state) => state.getNBAOrgBackordersRawDataLoaderReducer
  );
  const getNBAOrgBackorderQtyMonthwiseLoaderReducer = useSelector(
    (state) => state.getNBAOrgBackorderQtyMonthwiseLoaderReducer
  );
  const getNBAOrgBackordersDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgBackordersDDLoaderReducer
  );
  const getNBAOrgCurrentInventoryDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgCurrentInventoryDDLoaderReducer
  );
  const getNBAOrgTotalPartsDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgTotalPartsDDLoaderReducer
  );
  const getNBAOrgSlaMetDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgSlaMetDDLoaderReducer
  );
  const getNBAOrgFillrateDDData = useSelector((state) => state.getNBAOrgFillrateDD);
  const getNBAOrgFillrateDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgFillrateDDLoaderReducer
  );
  const getNBAOrgSlaMetDDData = useSelector((state) => state.getNBAOrgSlaMetDD);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isVisibleModalTotal, setIsVisibleModalTotal] = useState(false);
  const [RadioSelected, setRadioSelected] = useState('Organization Wise');
  const [selected, setselected] = useState('1');
  const [modalContent, setModalContent] = useState('');

  const handleCancel = () => {
    setIsModalVisible(false);
    setRadioSelected('Organization Wise');
    setModalContent('');
    setselected('1');
  };
  const handleModalCancel = () => {
    setIsVisibleModalTotal(false);
    setModalContent('');
  };
  const onChangeRadio = (value) => {
    setselected(value.target.value);
    if (value.target.value == 'Organization Wise') {
      setRadioSelected('Organization Wise');
      setModalContent('BackOrderRate');
      dispatch(getNBAOrgBackordersDD(props.org, props.LGORT));
      dispatch(getNBAOrgBackorderQtyMonthwise(props.org, props.LGORT));
    } else if (value.target.value == 'Order Wise') {
      setRadioSelected('Order Wise');
      setModalContent('BackOrderRate');

      dispatch(getNBAOrgBackordersRawData(props.org, props.LGORT));
    }
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
  const onChange = (key) => {
    if (key === '1') {
      setselected(key);
      setModalContent('Material');
      dispatch(getNBAOrgCurrentInventoryDD(props.org, props.LGORT, 'material'));
    } else if (key === '2') {
      setModalContent('Manufacturer');
      dispatch(getNBAOrgCurrentInventoryDD(props.org, props.LGORT, 'MANUF'));
      setselected(key);
    } else if (key === '3') {
      setselected(key);
      setModalContent('Plant');
      dispatch(getNBAOrgCurrentInventoryDD(props.org, props.LGORT, 'PLANT'));
    }
  };

  return (
    <>
      <div>
        <Row gutter={16}>
          <Col span={6}>
            <Card
              className="nba-org-mini-card cursor-pointer"
              onClick={() => {
                setIsModalVisible(true);
                setModalContent('Material');
                dispatch(getNBAOrgCurrentInventoryDD(props.org, props.LGORT, 'material'));
              }}>
              {!getNBAOrgDetailsLoaderReducer ? (
                <>
                  {' '}
                  <div className="text-center text-center mini-card-icon">
                    {' '}
                    <i className="fad fa-warehouse"></i>
                  </div>
                  <div className="text-center text-center mini-card-value">
                    {calculation(getNBAOrgDetailsData[0]?.CURRENT_INVENTORY)}
                  </div>
                  <div className="text-center nba-wid-head">Current Inventory</div>
                </>
              ) : (
                <ReusableSysncLoader />
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card
              className="nba-org-mini-card cursor-pointer"
              onClick={() => {
                setIsVisibleModalTotal(true);
                setModalContent('Total Parts');
                dispatch(getNBAOrgTotalPartsDD(props.org, props.LGORT));
              }}>
              {!getNBAOrgDetailsLoaderReducer ? (
                <>
                  {' '}
                  <div className="text-center text-center mini-card-icon">
                    {' '}
                    <i className="fad fa-boxes"></i>
                  </div>
                  <div className="text-center text-center mini-card-value">
                    {getNBAOrgDetailsData[0]?.TOTAL_PARTS}
                  </div>
                  <div className="text-center nba-wid-head">Total Parts</div>
                </>
              ) : (
                <ReusableSysncLoader />
              )}
            </Card>
          </Col>
          <Col span={6}>
            <Card className="nba-org-mini-card">
              {!getNBAOrgDetailsLoaderReducer ? (
                <>
                  {' '}
                  <div className="text-center text-center mini-card-icon">
                    {' '}
                    <i className="fad fa-sack-dollar"></i>
                  </div>
                  <div className="text-center text-center mini-card-value">
                    <Popover content={<span>Avg Capex</span>} placement="left">
                      {' '}
                      {calculation(getNBAOrgDetailsData[0]?.AVG_CAPEX)}{' '}
                    </Popover>
                    |{' '}
                    <Popover content={<span>Predicted Capex</span>} placement="right">
                      {calculation(getNBAOrgDetailsData[0]?.PREDICTED_CAPEX)}
                    </Popover>
                  </div>
                  <div className="text-center nba-wid-head">Capex</div>
                </>
              ) : (
                <ReusableSysncLoader />
              )}
            </Card>
          </Col>
          <Col span={6}>
            <TotalHarvest org={props.org} LGORT={props.LGORT} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            {' '}
            <Card
              className="nba-org-mini-card cursor-pointer"
              onClick={() => {
                setIsVisibleModalTotal(true);
                setModalContent('SLA MET');
                dispatch(getNBAOrgSlaMetDD(props.org, props.LGORT));
              }}>
              {!getNBAOrgDetailsLoaderReducer ? (
                <>
                  <div className="text-center text-center mini-card-icon">
                    {' '}
                    <i className="fad fa-truck-couch"></i>
                  </div>
                  <div className="text-center text-center mini-card-value">
                    {getNBAOrgDetailsData[0]?.SLA_MET} %
                  </div>
                  <div className="text-center nba-wid-head">SLA MET</div>
                </>
              ) : (
                <ReusableSysncLoader />
              )}
            </Card>
          </Col>
          <Col span={6}>
            {' '}
            <Card
              className="nba-org-mini-card cursor-pointer"
              onClick={() => {
                setIsVisibleModalTotal(true);
                setModalContent('Fill Rate');
                dispatch(getNBAOrgFillrateDD(props.org, props.LGORT));
              }}>
              {!getNBAOrgDetailsLoaderReducer ? (
                <>
                  {' '}
                  <div className="text-center text-center mini-card-icon">
                    {' '}
                    <i className="fad fa-fill"></i>
                  </div>
                  <div className="text-center text-center mini-card-value">
                    {getNBAOrgDetailsData[0]?.FILLRATE} %
                  </div>
                  <div className="text-center nba-wid-head">Fill Rate</div>
                </>
              ) : (
                <ReusableSysncLoader />
              )}
            </Card>
          </Col>
          <Col span={6}>
            {' '}
            <Card
              className="nba-org-mini-card cursor-pointer"
              onClick={() => {
                setIsModalVisible(true);
                setModalContent('BackOrderRate');
                dispatch(getNBAOrgBackordersDD(props.org, props.LGORT));
                dispatch(getNBAOrgBackorderQtyMonthwise(props.org, props.LGORT));
              }}>
              {!getNBAOrgDetailsLoaderReducer ? (
                <>
                  <div className="text-center text-center mini-card-icon">
                    {' '}
                    <i className="fad fa-box-open"></i>
                  </div>
                  <div className="text-center text-center mini-card-value">
                    {calculation(getNBAOrgDetailsData[0]?.NET_MRR)} (
                    {getNBAOrgDetailsData[0]?.BACK_ORDER_RATE})
                  </div>
                  <div className="text-center nba-wid-head"> NET MRR (Back-Orders)</div>
                </>
              ) : (
                <ReusableSysncLoader />
              )}
            </Card>
          </Col>
          <Col span={6}>
            <OpenHarvest org={props.org} LGORT={props.LGORT} />
          </Col>
        </Row>

        <Modal
          title={
            <span>
              {modalContent === 'BackOrderRate' ? (
                <div>
                  Back-Orders
                  <div className="NBA-Inventory-Prediction float-right mr-4">
                    <Radio.Group value={RadioSelected} onChange={onChangeRadio}>
                      <Radio.Button value="Organization Wise">Material</Radio.Button>
                      <Radio.Button value="Order Wise">Raw Data</Radio.Button>
                    </Radio.Group>
                  </div>
                </div>
              ) : (
                modalContent
              )}
            </span>
          }
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
          width={modalContent === 'BackOrderRate' ? '90%' : '75%'}
          destroyOnClose>
          {modalContent === 'BackOrderRate' ? (
            <>
              {RadioSelected === 'Organization Wise' ? (
                <Row gutter={16}>
                  <Col span={12}>
                    {' '}
                    {!getNBAOrgBackordersDDLoaderReducer && getNBAOrgBackordersDDData.length > 0 ? (
                      <ReusableTable
                        TableData={getNBAOrgBackordersDDData}
                        TableColumn={backOrderColumns}
                        fileName={`${props.org}(${props.LGORT}) - Back-Orders (Material Wise)`}
                      />
                    ) : (
                      <>
                        {getNBAOrgBackordersDDLoaderReducer ? (
                          <div style={{ height: '400px' }}>
                            <ReusableSysncLoader />
                          </div>
                        ) : (
                          <div style={{ height: '400px' }}>
                            <NoDataTextLoader />
                          </div>
                        )}
                      </>
                    )}
                  </Col>
                  <Col span={12}>
                    {!getNBAOrgBackorderQtyMonthwiseLoaderReducer &&
                    getNBAOrgBackorderQtyMonthwiseData.length > 0 ? (
                      <>
                        <span className="HeadName">
                          {' '}
                          <i className="fas fa-chart-line mr-2" />
                          BackOrder Trend
                          <span className="float-right"> </span>
                        </span>
                        <div className="text-center">
                          <span>
                            <i className="fas fa-circle" style={{ color: '#C87941' }} /> - BackOrder
                            Quantity{' '}
                          </span>
                        </div>
                        <ResponsiveContainer height={500} width="100%">
                          <AreaChart
                            width={900}
                            height={500}
                            data={getNBAOrgBackorderQtyMonthwiseData}
                            margin={{
                              top: 20,
                              right: 10,
                              left: 10,
                              bottom: 20
                            }}>
                            <defs>
                              <linearGradient id="BackorderDD" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#d29fe6cf" stopOpacity={0.6} />
                                <stop offset="95%" stopColor="#d29fe6cf" stopOpacity={0.4} />
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
                              fill="#C87941"
                              stroke="#C87941"
                              strokeWidth={3}
                              dot={false}
                            />
                          </AreaChart>
                        </ResponsiveContainer>{' '}
                      </>
                    ) : (
                      <>
                        {getNBAOrgBackorderQtyMonthwiseLoaderReducer ? (
                          <ReusableSysncLoader />
                        ) : (
                          <NoDataTextLoader />
                        )}
                      </>
                    )}
                  </Col>
                </Row>
              ) : (
                <>
                  {!getNBAOrgBackordersRawDataLoaderReducer && TblData.length > 0 ? (
                    <ReusableTable
                      TableData={TblData}
                      TableColumn={BackOrderDDPredictedMetrics}
                      fileName={`${props.org}(${props.LGORT}) - Back-Orders(Raw Data)`}
                    />
                  ) : (
                    <>
                      {getNBAOrgBackordersRawDataLoaderReducer ? (
                        <>
                          {' '}
                          <div style={{ height: '400px' }}>
                            <ReusableSysncLoader />
                          </div>
                        </>
                      ) : (
                        <>
                          {' '}
                          <div style={{ height: '400px' }}>
                            <NoDataTextLoader />
                          </div>
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <Tabs activeKey={selected} onChange={onChange}>
              <TabPane tab="Material" key="1">
                {!getNBAOrgCurrentInventoryDDLoaderReducer &&
                getNBAOrgCurrentInventoryDDData.length > 0 ? (
                  <ReusableTable
                    TableData={getNBAOrgCurrentInventoryDDData}
                    TableColumn={CurrentInventoryMaterial}
                    fileName={`${props.org}(${props.LGORT}) - Current Inventory Material`}
                  />
                ) : (
                  <>
                    {getNBAOrgCurrentInventoryDDLoaderReducer ? (
                      <div style={{ height: '400px' }}>
                        <ReusableSysncLoader />
                      </div>
                    ) : (
                      <div style={{ height: '400px' }}>
                        <NoDataTextLoader />
                      </div>
                    )}
                  </>
                )}
              </TabPane>
              <TabPane tab="Manufacturer" key="2">
                {!getNBAOrgCurrentInventoryDDLoaderReducer &&
                getNBAOrgCurrentInventoryDDData.length > 0 ? (
                  <ReusableTable
                    TableData={getNBAOrgCurrentInventoryDDData}
                    TableColumn={CurrentInventoryManufacturar}
                    fileName={`${props.org}(${props.LGORT}) - Current Inventory Manufacturer`}
                  />
                ) : (
                  <>
                    {getNBAOrgCurrentInventoryDDLoaderReducer ? (
                      <div style={{ height: '400px' }}>
                        <ReusableSysncLoader />
                      </div>
                    ) : (
                      <div style={{ height: '400px' }}>
                        <NoDataTextLoader />
                      </div>
                    )}
                  </>
                )}
              </TabPane>
              <TabPane tab="Plant" key="3">
                {!getNBAOrgCurrentInventoryDDLoaderReducer &&
                getNBAOrgCurrentInventoryDDData.length > 0 ? (
                  <ReusableTable
                    TableData={getNBAOrgCurrentInventoryDDData}
                    TableColumn={NBAOrgOrganization}
                    fileName={`${props.org}(${props.LGORT}) - Current Inventory Plant`}
                  />
                ) : (
                  <>
                    {getNBAOrgCurrentInventoryDDLoaderReducer ? (
                      <div style={{ height: '400px' }}>
                        <ReusableSysncLoader />
                      </div>
                    ) : (
                      <div style={{ height: '400px' }}>
                        <NoDataTextLoader />
                      </div>
                    )}
                  </>
                )}
              </TabPane>
            </Tabs>
          )}
        </Modal>
        <Modal
          title={modalContent}
          visible={isVisibleModalTotal}
          onCancel={handleModalCancel}
          footer={null}
          width={modalContent === 'SLA MET' ? '50%' : modalContent === 'Fill Rate' ? '70%' : '90%'}
          destroyOnClose
          height="auto">
          <>
            {modalContent === 'Total Parts' ? (
              <>
                {' '}
                {!getNBAOrgTotalPartsDDLoaderReducer && getNBAOrgTotalPartsDDData.length > 0 ? (
                  <ReusableTable
                    TableData={getNBAOrgTotalPartsDDData}
                    TableColumn={totalPartsDDColumns}
                    fileName={`${props.org}(${props.LGORT}) - Total Parts`}
                  />
                ) : (
                  <>
                    {getNBAOrgTotalPartsDDLoaderReducer ? (
                      <div style={{ height: '400px' }}>
                        <ReusableSysncLoader />
                      </div>
                    ) : (
                      <div style={{ height: '400px' }}>
                        <NoDataTextLoader />
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {' '}
                {modalContent === 'SLA MET' ? (
                  <>
                    {!getNBAOrgSlaMetDDLoaderReducer && getNBAOrgSlaMetDDData.length > 0 ? (
                      <ReusableTable
                        TableData={getNBAOrgSlaMetDDData}
                        TableColumn={SLAMETDDColumns}
                        fileName={`${props.org}(${props.LGORT}) - SLA MET`}
                      />
                    ) : (
                      <>
                        {getNBAOrgSlaMetDDLoaderReducer ? (
                          <div style={{ height: '400px' }}>
                            {' '}
                            <ReusableSysncLoader />
                          </div>
                        ) : (
                          <div style={{ height: '400px' }}>
                            {' '}
                            <NoDataTextLoader />
                          </div>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {modalContent === 'Fill Rate' ? (
                      <>
                        <div className="note float-left">
                          Note : Fill rate is calculated using past 1 year data.{' '}
                        </div>
                        {!getNBAOrgFillrateDDLoaderReducer && getNBAOrgFillrateDDData.length > 0 ? (
                          <ReusableTable
                            TableData={getNBAOrgFillrateDDData}
                            TableColumn={FillRATEDDColumns}
                            fileName={`${props.org}(${props.LGORT}) - Fill Rate`}
                          />
                        ) : (
                          <>
                            {getNBAOrgFillrateDDLoaderReducer ? (
                              <div style={{ height: '400px' }}>
                                {' '}
                                <ReusableSysncLoader />
                              </div>
                            ) : (
                              <div style={{ height: '400px' }}>
                                {' '}
                                <NoDataTextLoader />
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      ''
                    )}
                  </>
                )}
              </>
            )}
          </>
        </Modal>
      </div>
    </>
  );
};
