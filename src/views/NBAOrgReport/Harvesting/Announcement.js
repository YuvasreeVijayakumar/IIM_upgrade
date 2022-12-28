import React, { useState } from 'react';
import { Card, Col, Modal, Row } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { ResponsiveContainer, Tooltip, AreaChart, XAxis, Label, YAxis, Area } from 'recharts';

import { getNBAOrgAnnouncementsDD } from '../../../actions';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { ORDERS_RECOMMENDATION } from '../../NBAManuf/NBAManufTableColumns';
import {
  UnderstockAnnouncementDDColumns,
  OverStockAnnouncementDDColumns,
  LTSCoulmns,
  MaterialNoColumns
} from '../NBAOrgTableColumn';
import moment from 'moment';
import { calculation } from '../../Calculation';

export const Announcement = (props) => {
  // eslint-disable-next-line no-unused-vars
  const dispatch = useDispatch();
  // eslint-disable-next-line no-unused-vars
  const [dotPosition, setDotPosition] = useState('bottom');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const getNBAOrgAnnouncementsData = useSelector((state) => state.getNBAOrgAnnouncements);
  const getNBAOrgAnnouncementsDDData = useSelector((state) => state.getNBAOrgAnnouncementsDD);

  const getNBAOrgAnnouncementsLoaderReducer = useSelector(
    (state) => state.getNBAOrgAnnouncementsLoaderReducer
  );

  const getNBAOrgAnnouncementsDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgAnnouncementsDDLoaderReducer
  );
  const TooltipFormatter = (e) => {
    if (e.active && e.payload !== null && e.payload[0] !== null && e.payload !== undefined) {
      let value = moment(e.payload[0]?.payload.DS).format('MM-YYYY');
      return (
        <div className="custom-tooltip">
          <span>
            <b>Month : {value}</b> <br />
          </span>
          <span>
            <b>Capex : {calculation(e.payload[0]?.payload.TOTAL_CAPEX)}</b> <br />
          </span>
        </div>
      );
    }
  };

  const formatXAxis = (tickItem) => {
    return moment(tickItem).format('MM-DD-YYYY');
  };
  const formatYAxis = (tickItem) => {
    let value = calculation(tickItem);
    return value;
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    setModalContent('');
  };
  const leadtime = (
    <>
      <span>Leadtime Expiring Materials</span>
      <div className="float-right mr-5 exhaust mt-2 chart-legend sn">
        <span className="pr-2">
          <i className="fas fa-circle" style={{ color: '#ff4d4f' }} /> - Expired{' '}
        </span>
        <span>
          <i className="fas fa-circle" style={{ color: 'orange' }} /> - About to Expire{' '}
        </span>
      </div>
    </>
  );
  return (
    <>
      <Card className="midLayout" bodyStyle={{ height: 270 }}>
        <Row>
          <Col span={24} className="text-center">
            <span className="tblHeader annouance-head"> Announcement</span>
          </Col>
        </Row>
        {!getNBAOrgAnnouncementsLoaderReducer ? (
          <>
            <Row>
              <Col span={24} className="nba-org-annouancement">
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Materials Require Action');
                    dispatch(
                      getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'ORDERS_RECOMMENDATION')
                    );
                  }}>
                  {' '}
                  <i className="fad fa-bullhorn mr-2"></i> Materials require action :
                  {getNBAOrgAnnouncementsData[0]?.MAT_COUNT}
                </p>
                <p
                  className="up flood-right cros"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Inventory Capex Percent Change');
                    dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'PCT_CHANGE'));
                  }}>
                  {' '}
                  {getNBAOrgAnnouncementsData[0]?.PCT_FLAG === 'Increased' ? (
                    <>
                      {' '}
                      <i className="fad fa-bullhorn mr-2"></i> Current Inventory Capex vs last month
                      Capex by {getNBAOrgAnnouncementsData[0]?.PCT_CHANGE_CAP}{' '}
                      <i className="fas fa-long-arrow-alt-up"></i>
                    </>
                  ) : (
                    <>
                      {getNBAOrgAnnouncementsData[0]?.PCT_FLAG === 'Decreased' ? (
                        <>
                          <i className="fad fa-bullhorn mr-2"></i> Current Inventory Capex vs last
                          month Capex by {getNBAOrgAnnouncementsData[0]?.PCT_CHANGE_CAP}{' '}
                          <i className="fas fa-long-arrow-alt-down"></i>
                        </>
                      ) : (
                        <>
                          <i className="fad fa-bullhorn mr-2"></i> Current Inventory Capex vs last
                          month Capex by {getNBAOrgAnnouncementsData[0]?.PCT_CHANGE_CAP}{' '}
                        </>
                      )}
                    </>
                  )}
                </p>
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Inventory Exhaust Materials');
                    dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'INVENTORY_EXHAUST'));
                  }}>
                  <i className="fad fa-bullhorn mr-2"></i> Materials to exhaust inventory in next 2
                  weeks : {getNBAOrgAnnouncementsData[0]?.NO_OF_MATERIALS}
                </p>
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Under Stock');
                    dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'UNDERSTOCK'));
                  }}>
                  <i className="fad fa-bullhorn mr-2"></i> Understocked parts :
                  {getNBAOrgAnnouncementsData[0]?.UNDERSTOCK}
                </p>
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Over Stock');
                    dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'OVERSTOCK'));
                  }}>
                  <i className="fad fa-bullhorn mr-2"></i> Overstocked parts :
                  {getNBAOrgAnnouncementsData[0]?.OVERSTOCK}
                </p>
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Leadtime Expiring Materials');
                    dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'LEADTIME_EXPIRE'));
                  }}>
                  <i className="fad fa-bullhorn mr-2"></i>{' '}
                  {getNBAOrgAnnouncementsData[0]?.NUMBER_OF_LTS_EXPIRING} Material leadtime
                  overwrite has expired or is about to expire in next 14 days
                </p>
              </Col>
            </Row>
            {/* <Carousel dotPosition={dotPosition} autoplay className="nba-org-announ">
              <div
                className="cros cursor-pointer"
                onClick={() => {
                  setIsModalVisible('true');
                  setModalContent('Materials Require Action');
                  dispatch(
                    getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'ORDERS_RECOMMENDATION')
                  );
                }}>
                <h5 style={contentStyle}>
                  <div className="text-center">
                    <i className="far fa-bullhorn icon-color" /> &nbsp; Materials Require Action :{' '}
                    {getNBAOrgAnnouncementsData[0]?.MAT_COUNT}
                  </div>
                </h5>
              </div>
              <div className="cros cursor-pointer">
                <h5
                  style={contentStyle}
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Inventory Capex Percent Change');
                    dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'PCT_CHANGE'));
                  }}>
                  {' '}
                  {getNBAOrgAnnouncementsData[0]?.PCT_FLAG === 'Increased' ? (
                    <>
                      {' '}
                      <div className="text-center">
                        <i className="far fa-bullhorn icon-color" /> &nbsp; Current Inventory Capex
                        vs last month Capex by {getNBAOrgAnnouncementsData[0]?.PCT_CHANGE_CAP}{' '}
                        <i className="fas fa-long-arrow-alt-up"></i>
                      </div>
                    </>
                  ) : (
                    <>
                      {getNBAOrgAnnouncementsData[0]?.PCT_FLAG === 'Decreased' ? (
                        <>
                          <div className="text-center">
                            <i className="far fa-bullhorn icon-color" /> &nbsp; Current Inventory
                            Capex vs last month Capex by{' '}
                            {getNBAOrgAnnouncementsData[0]?.PCT_CHANGE_CAP}{' '}
                            <i className="fas fa-long-arrow-alt-down"></i>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-center">
                            <i className="far fa-bullhorn icon-color" /> &nbsp; Current Inventory
                            Capex vs last month Capex by{' '}
                            {getNBAOrgAnnouncementsData[0]?.PCT_CHANGE_CAP}{' '}
                          </div>
                        </>
                      )}
                    </>
                  )}
                </h5>
              </div>
              <div
                className="cros cursor-pointer"
                onClick={() => {
                  setIsModalVisible('true');
                  setModalContent('Inventory Exhaust Materials');
                  dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'INVENTORY_EXHAUST'));
                }}>
                <h5 style={contentStyle}>
                  {' '}
                  <div className="text-center">
                    <i className="far fa-bullhorn icon-color" /> &nbsp; Materials to exhaust
                    inventory in next 2 weeks : {getNBAOrgAnnouncementsData[0]?.NO_OF_MATERIALS}
                  </div>
                </h5>
              </div>
              <div
                className="cros cursor-pointer"
                onClick={() => {
                  setIsModalVisible('true');
                  setModalContent('Under Stock');
                  dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'UNDERSTOCK'));
                }}>
                <h5 style={contentStyle}>
                  <div className="text-center">
                    <i className="far fa-bullhorn icon-color" /> &nbsp; Understocked parts :{' '}
                    {getNBAOrgAnnouncementsData[0]?.UNDERSTOCK}
                  </div>
                </h5>
              </div>
              <div
                className="cros cursor-pointer"
                onClick={() => {
                  setIsModalVisible('true');
                  setModalContent('Over Stock');
                  dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'OVERSTOCK'));
                }}>
                <h5 style={contentStyle}>
                  {' '}
                  <div className="text-center">
                    <i className="far fa-bullhorn icon-color" /> &nbsp; Overstocked parts :{' '}
                    {getNBAOrgAnnouncementsData[0]?.OVERSTOCK}
                  </div>
                </h5>
              </div>
              <div
                className="cros cursor-pointer"
                onClick={() => {
                  setIsModalVisible('true');
                  setModalContent('Leadtime Expiring Materials');
                  dispatch(getNBAOrgAnnouncementsDD(props.org, props.LGORT, 'LEADTIME_EXPIRE'));
                }}>
                <h5 style={contentStyle}>
                  <div className="text-center">
                    <i className="far fa-bullhorn icon-color" /> &nbsp; Leadtime overwrites expiring
                    in next 2 weeks : {getNBAOrgAnnouncementsData[0]?.NUMBER_OF_LTS_EXPIRING}
                  </div>
                </h5>
              </div>
            </Carousel> */}
          </>
        ) : (
          <ReusableSysncLoader />
        )}
      </Card>

      <Modal
        title={modalContent === 'Leadtime Expiring Materials' ? leadtime : modalContent}
        visible={isModalVisible}
        onCancel={handleCancel}
        width={
          modalContent === 'Under Stock'
            ? '75%'
            : modalContent === 'Over Stock'
            ? '75%'
            : modalContent === 'Leadtime Expiring Materials'
            ? '70%'
            : modalContent === 'Inventory Exhaust Materials'
            ? '75%'
            : modalContent === 'Materials Require Action'
            ? '90%'
            : '75%'
        }
        footer={null}
        destroyOnClose
        height="auto">
        <>
          {modalContent === 'Under Stock' ? (
            <>
              {!getNBAOrgAnnouncementsDDLoaderReducer && getNBAOrgAnnouncementsDDData.length > 0 ? (
                <ReusableTable
                  TableData={getNBAOrgAnnouncementsDDData}
                  TableColumn={UnderstockAnnouncementDDColumns}
                  fileName={`${props.org}(${props.LGORT}) - Understock`}
                />
              ) : (
                <>
                  {getNBAOrgAnnouncementsDDLoaderReducer ? (
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
              {modalContent === 'Over Stock' ? (
                <>
                  {!getNBAOrgAnnouncementsDDLoaderReducer &&
                  getNBAOrgAnnouncementsDDData.length > 0 ? (
                    <ReusableTable
                      TableData={getNBAOrgAnnouncementsDDData}
                      TableColumn={OverStockAnnouncementDDColumns}
                      fileName={`${props.org}(${props.LGORT}) - Overstock`}
                    />
                  ) : (
                    <>
                      {getNBAOrgAnnouncementsDDLoaderReducer ? (
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
                  {modalContent === 'Leadtime Expiring Materials' ? (
                    <>
                      {!getNBAOrgAnnouncementsDDLoaderReducer &&
                      getNBAOrgAnnouncementsDDData.length > 0 ? (
                        <ReusableTable
                          TableData={getNBAOrgAnnouncementsDDData}
                          TableColumn={LTSCoulmns}
                          fileName={`${props.org}(${props.LGORT}) - LTS Expiring Data`}
                        />
                      ) : (
                        <>
                          {getNBAOrgAnnouncementsDDLoaderReducer ? (
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
                      {modalContent === 'Inventory Exhaust Materials' ? (
                        <>
                          {!getNBAOrgAnnouncementsDDLoaderReducer &&
                          getNBAOrgAnnouncementsDDData.length > 0 ? (
                            <ReusableTable
                              TableData={getNBAOrgAnnouncementsDDData}
                              TableColumn={MaterialNoColumns}
                              fileName={`${props.org}(${props.LGORT}) - Inventory Exhaust Materials`}
                            />
                          ) : (
                            <>
                              {getNBAOrgAnnouncementsDDLoaderReducer ? (
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
                          {modalContent === 'Materials Require Action' ? (
                            <>
                              {' '}
                              {!getNBAOrgAnnouncementsDDLoaderReducer &&
                              getNBAOrgAnnouncementsDDData.length > 0 ? (
                                <ReusableTable
                                  TableData={getNBAOrgAnnouncementsDDData}
                                  TableColumn={ORDERS_RECOMMENDATION}
                                  fileName={`${props.org}(${props.LGORT}) - Materials Require Action`}
                                />
                              ) : (
                                <>
                                  {getNBAOrgAnnouncementsDDLoaderReducer ? (
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
                              <div className="text-center">
                                <span>
                                  <i className="fas fa-circle voilet" /> - Capex{' '}
                                </span>
                              </div>
                              {!getNBAOrgAnnouncementsDDLoaderReducer &&
                              getNBAOrgAnnouncementsDDData.length > 0 ? (
                                <>
                                  <ResponsiveContainer height={400} width="100%">
                                    <AreaChart
                                      width={900}
                                      height={400}
                                      data={getNBAOrgAnnouncementsDDData}
                                      margin={{
                                        top: 0,
                                        right: 10,
                                        left: 10,
                                        bottom: 20
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
                                          value="Monthly"
                                          style={{ textAnchor: 'middle', fill: '#fff' }}
                                          // position="insideLeft"
                                          position="centerBottom"
                                        />
                                      </XAxis>
                                      <YAxis
                                        stroke="#fff"
                                        tickFormatter={formatYAxis}
                                        allowDecimals={false}>
                                        {' '}
                                        <Label
                                          value="Capex"
                                          angle="-90"
                                          style={{ textAnchor: 'middle', fill: '#fff' }}
                                          position="insideLeft"
                                        />
                                      </YAxis>
                                      {getNBAOrgAnnouncementsDDData.length > 0 ? (
                                        <Tooltip content={TooltipFormatter} />
                                      ) : (
                                        ''
                                      )}

                                      <Area
                                        type="monotone"
                                        dataKey="TOTAL_CAPEX"
                                        fill="#AB46D2"
                                        stroke="#AB46D2"
                                        strokeWidth={3}
                                        dot={false}
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </>
                              ) : (
                                <>
                                  {getNBAOrgAnnouncementsDDLoaderReducer ? (
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
                          )}
                        </>
                      )}
                    </>
                  )}
                </>
              )}
            </>
          )}
        </>
      </Modal>
    </>
  );
};
