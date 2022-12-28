import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, Row, Col, Modal, Tabs } from 'antd';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import { calculation } from '../Calculation';
import { useDispatch } from 'react-redux';
import {
  getNBAManufAvgEarlyDaysDD,
  getNBAManufCurrentInventoryCapexDD,
  getNBAManufLeadtimeDD,
  getNBAManufMaterialDD,
  getNBAManufSlametDD,
  getNBAManufVendorsDD
} from '../../actions';
import ReusableTable from '../ReusableComponent/ReusableTable';
import {
  AvgEarlyDaysColumns,
  AvgEarlyDaysPlantColumns,
  materialDDColumns,
  SLAMETDDColumns,
  vendorColumns,
  InventoryCapexDDTblCol,
  InventoryCapexDDTblPlantCol,
  LeadTimeColumns,
  SLAMETDDvendorColumns
} from './NBAManufTableColumns';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';
import BackOrders from './BackOrders/BackOrders';
import AwaitingRepairs from './AwaitingRepairs/AwaitingRepairs';
const { TabPane } = Tabs;
const MiniCards = (props) => {
  const dispatch = useDispatch();
  const [visible, setVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [tabContent, setTabContent] = useState('');
  const [selected, setselected] = useState('1');
  const [selectedAvg, setSelectedAvg] = useState('3');
  const [selectedSM, setSelectedSM] = useState('5');
  const getNBAManufacturerWidget2ReducerLoader = useSelector(
    (state) => state.getNBAManufacturerWidget2ReducerLoader
  );
  const getNBAManufacturerWidget1ReducerLoader = useSelector(
    (state) => state.getNBAManufacturerWidget1ReducerLoader
  );
  const getNBAManufSlametDDReducerLoader = useSelector(
    (state) => state.getNBAManufSlametDDReducerLoader
  );
  const getNBAManufVendorsDDReducerLoader = useSelector(
    (state) => state.getNBAManufVendorsDDReducerLoader
  );
  const getNBAManufMaterialDDReducerLoader = useSelector(
    (state) => state.getNBAManufMaterialDDReducerLoader
  );
  const getNBAManufAvgEarlyDaysDDReducerLoader = useSelector(
    (state) => state.getNBAManufAvgEarlyDaysDDReducerLoader
  );
  const getNBAManufCurrentInventoryCapexDDReducerLoader = useSelector(
    (state) => state.getNBAManufCurrentInventoryCapexDDReducerLoader
  );
  const getNBAManufLeadtimeDDReducerLoader = useSelector(
    (state) => state.getNBAManufLeadtimeDDReducerLoader
  );

  const { materials, vendors, leadtime } = useSelector((state) => state.getNBAManufacturerWidget2);
  const { Total_Capex, avg_early_days, SLA_MET } = useSelector(
    (state) => state.getNBAManufacturerWidget1
  );
  const getNBAManufSlametDDData = useSelector((state) => state.getNBAManufSlametDD);
  const getNBAManufVendorsDDData = useSelector((state) => state.getNBAManufVendorsDD);
  const getNBAManufMaterialDDData = useSelector((state) => state.getNBAManufMaterialDD);
  const getNBAManufAvgEarlyDaysDDData = useSelector((state) => state.getNBAManufAvgEarlyDaysDD);
  const getNBAManufLeadtimeDDData = useSelector((state) => state.getNBAManufLeadtimeDD);
  const getNBAManufCurrentInventoryCapexDDData = useSelector(
    (state) => state.getNBAManufCurrentInventoryCapexDD
  );

  const handleCancel = () => {
    setVisible(false);
    setModalContent('');
    setTabContent('');
  };
  const tabChange = (key) => {
    if (key === '1') {
      setselected('1');
      setTabContent('Plant');
      dispatch(
        getNBAManufCurrentInventoryCapexDD(
          encodeURIComponent(props.ManufName),
          props.LGORT,
          'Plant'
        )
      );
    } else if (key === '2') {
      setselected('2');
      setTabContent('Material');
      dispatch(
        getNBAManufCurrentInventoryCapexDD(
          encodeURIComponent(props.ManufName),
          props.LGORT,
          'MATERIAL'
        )
      );
    } else if (key === '3') {
      setSelectedAvg('3');
      setTabContent('Material');
      dispatch(
        getNBAManufAvgEarlyDaysDD(encodeURIComponent(props.ManufName), props.LGORT, 'MATERIAL')
      );
    } else if (key === '4') {
      setSelectedAvg('4');
      setTabContent('Vendor');
      dispatch(
        getNBAManufAvgEarlyDaysDD(encodeURIComponent(props.ManufName), props.LGORT, 'VENDOR')
      );
    } else if (key === '5') {
      setSelectedSM('5');
      setTabContent('Material');
      dispatch(getNBAManufSlametDD(encodeURIComponent(props.ManufName), props.LGORT, 'MATERIAL'));
    } else {
      setSelectedSM('6');
      setTabContent('Vendor');
      dispatch(getNBAManufSlametDD(encodeURIComponent(props.ManufName), props.LGORT, 'VENDOR'));
    }
  };
  return (
    <>
      <Row gutter={16}>
        <Col span={6}>
          <Card
            className="nba-org-mini-card cursor-pointer"
            onClick={() => {
              setVisible(true);
              setselected('1');
              setModalContent('Total Capex');
              setTabContent('Plant');
              dispatch(
                getNBAManufCurrentInventoryCapexDD(
                  encodeURIComponent(props.ManufName),
                  props.LGORT,
                  'Plant'
                )
              );
            }}>
            {' '}
            {!getNBAManufacturerWidget1ReducerLoader ? (
              <>
                <div className="text-center text-center mini-card-icon">
                  {' '}
                  <i className="fad fa-warehouse"></i>
                </div>
                <div className="text-center text-center mini-card-value">
                  {calculation(Total_Capex)}
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
              setVisible(true);
              setSelectedAvg('3');
              setModalContent('Average Early Days');
              setTabContent('Material');
              dispatch(
                getNBAManufAvgEarlyDaysDD(
                  encodeURIComponent(props.ManufName),
                  props.LGORT,
                  'MATERIAL'
                )
              );
            }}>
            {' '}
            {!getNBAManufacturerWidget1ReducerLoader ? (
              <>
                {' '}
                <div className="text-center text-center mini-card-icon">
                  {' '}
                  <i className="fad fa-stopwatch"></i>
                </div>
                <div className="text-center text-center mini-card-value">{avg_early_days}</div>
                <div className="text-center nba-wid-head">Avg Early Delivery Days</div>
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
              setVisible(true);
              setSelectedSM('5');
              setModalContent('SLA MET');
              setTabContent('Material');
              dispatch(
                getNBAManufSlametDD(encodeURIComponent(props.ManufName), props.LGORT, 'MATERIAL')
              );
            }}>
            {' '}
            {!getNBAManufacturerWidget1ReducerLoader ? (
              <>
                {' '}
                <div className="text-center text-center mini-card-icon">
                  {' '}
                  <i className="fad fa-truck-couch"></i>
                </div>
                <div className="text-center text-center mini-card-value">{SLA_MET}%</div>
                <div className="text-center nba-wid-head">SLA MET</div>
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
              setVisible(true);
              setModalContent('Vendors');
              dispatch(getNBAManufVendorsDD(encodeURIComponent(props.ManufName), props.LGORT));
            }}>
            {' '}
            {!getNBAManufacturerWidget2ReducerLoader ? (
              <>
                {' '}
                <div className="text-center text-center mini-card-icon">
                  {' '}
                  <i className="fad fa-people-carry"></i>
                </div>
                <div className="text-center text-center mini-card-value">{vendors}</div>
                <div className="text-center nba-wid-head">Vendors</div>
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
              setVisible(true);
              setModalContent('Total Parts');
              dispatch(getNBAManufMaterialDD(encodeURIComponent(props.ManufName), props.LGORT));
            }}>
            {' '}
            {!getNBAManufacturerWidget2ReducerLoader ? (
              <>
                {' '}
                <div className="text-center text-center mini-card-icon">
                  {' '}
                  <i className="fad fa-cube"></i>
                </div>
                <div className="text-center text-center mini-card-value">{materials}</div>
                <div className="text-center nba-wid-head">Total Parts</div>
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
              setVisible(true);
              setModalContent('Lead Time');
              dispatch(getNBAManufLeadtimeDD(encodeURIComponent(props.ManufName), props.LGORT));
            }}>
            {' '}
            {!getNBAManufacturerWidget2ReducerLoader ? (
              <>
                {' '}
                <div className="text-center text-center mini-card-icon">
                  {' '}
                  <i className="fad fa-hourglass-half"></i>
                </div>
                <div className="text-center text-center mini-card-value">{leadtime}</div>
                <div className="text-center nba-wid-head">LeadTime</div>
              </>
            ) : (
              <ReusableSysncLoader />
            )}
          </Card>
        </Col>
        <Col span={6}>
          <BackOrders ManufName={props.ManufName} LGORT={props.LGORT} />
        </Col>
        <Col span={6}>
          <AwaitingRepairs ManufName={props.ManufName} LGORT={props.LGORT} />
        </Col>
      </Row>

      <Modal
        title={modalContent}
        visible={visible}
        onCancel={handleCancel}
        footer={null}
        width={
          modalContent === 'SLA MET' && tabContent === 'Material'
            ? '40%'
            : modalContent === 'Total Parts'
            ? '90%'
            : modalContent === 'Average Early Days' && tabContent === 'Material'
            ? '40%'
            : modalContent === 'Total Capex' && tabContent === 'Plant'
            ? '40%'
            : modalContent === 'Vendors'
            ? '80%'
            : '60%'
        }
        height="auto"
        destroyOnClose>
        <>
          {modalContent === 'SLA MET' ? (
            <>
              <Tabs activeKey={selectedSM} title={tabContent} onChange={tabChange}>
                <TabPane tab="Material" key="5">
                  {!getNBAManufSlametDDReducerLoader && getNBAManufSlametDDData.length > 0 ? (
                    <>
                      <ReusableTable
                        TableData={getNBAManufSlametDDData}
                        TableColumn={SLAMETDDColumns}
                        fileName={`${props.ManufName}(${props.LGORT}) -SLA MET Material`}
                      />
                    </>
                  ) : (
                    <>
                      {getNBAManufSlametDDReducerLoader ? (
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
                </TabPane>
                <TabPane tab="Vendor" key="6">
                  {!getNBAManufSlametDDReducerLoader && getNBAManufSlametDDData.length > 0 ? (
                    <>
                      <ReusableTable
                        TableData={getNBAManufSlametDDData}
                        TableColumn={SLAMETDDvendorColumns}
                        fileName={`${props.ManufName}(${props.LGORT}) -SLA MET Vendor`}
                      />
                    </>
                  ) : (
                    <>
                      {getNBAManufSlametDDReducerLoader ? (
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
                </TabPane>
              </Tabs>
            </>
          ) : (
            <>
              {modalContent === 'Total Parts' ? (
                <>
                  {!getNBAManufMaterialDDReducerLoader && getNBAManufMaterialDDData.length > 0 ? (
                    <>
                      <ReusableTable
                        TableData={getNBAManufMaterialDDData}
                        TableColumn={materialDDColumns}
                        fileName={`${props.ManufName}(${props.LGORT}) -Total Parts`}
                      />
                    </>
                  ) : (
                    <>
                      {getNBAManufMaterialDDReducerLoader ? (
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
                  {modalContent === 'Average Early Days' ? (
                    <>
                      <Tabs activeKey={selectedAvg} title={tabContent} onChange={tabChange}>
                        <TabPane tab="Material" key="3">
                          {!getNBAManufAvgEarlyDaysDDReducerLoader &&
                          getNBAManufAvgEarlyDaysDDData.length > 0 ? (
                            <>
                              <ReusableTable
                                TableData={getNBAManufAvgEarlyDaysDDData}
                                TableColumn={AvgEarlyDaysColumns}
                                fileName={`${props.ManufName}(${props.LGORT}) -Average Early Days Material`}
                              />
                            </>
                          ) : (
                            <>
                              {getNBAManufAvgEarlyDaysDDReducerLoader ? (
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
                        </TabPane>
                        <TabPane tab="Vendor" key="4">
                          {!getNBAManufAvgEarlyDaysDDReducerLoader &&
                          getNBAManufAvgEarlyDaysDDData.length > 0 ? (
                            <>
                              <ReusableTable
                                TableData={getNBAManufAvgEarlyDaysDDData}
                                TableColumn={AvgEarlyDaysPlantColumns}
                                fileName={`${props.ManufName}(${props.LGORT}) -Average Early Days Vendor`}
                              />
                            </>
                          ) : (
                            <>
                              {getNBAManufAvgEarlyDaysDDReducerLoader ? (
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
                        </TabPane>
                      </Tabs>
                    </>
                  ) : (
                    <>
                      {modalContent === 'Total Capex' ? (
                        <>
                          <Tabs activeKey={selected} title={tabContent} onChange={tabChange}>
                            <TabPane tab="Plant" key="1">
                              {!getNBAManufCurrentInventoryCapexDDReducerLoader &&
                              getNBAManufCurrentInventoryCapexDDData.length > 0 ? (
                                <>
                                  <ReusableTable
                                    TableData={getNBAManufCurrentInventoryCapexDDData}
                                    TableColumn={InventoryCapexDDTblPlantCol}
                                    fileName={`${props.ManufName} (${props.LGORT})-Inventory Capex Plant`}
                                  />
                                </>
                              ) : (
                                <>
                                  {getNBAManufCurrentInventoryCapexDDReducerLoader ? (
                                    <div style={{ height: '400px' }}>
                                      {' '}
                                      <ReusableSysncLoader />{' '}
                                    </div>
                                  ) : (
                                    <div style={{ height: '400px' }}>
                                      <NoDataTextLoader />
                                    </div>
                                  )}
                                </>
                              )}
                            </TabPane>
                            <TabPane tab="Material" key="2">
                              {!getNBAManufCurrentInventoryCapexDDReducerLoader &&
                              getNBAManufCurrentInventoryCapexDDData.length > 0 ? (
                                <>
                                  <ReusableTable
                                    TableData={getNBAManufCurrentInventoryCapexDDData}
                                    TableColumn={InventoryCapexDDTblCol}
                                    fileName={`${props.ManufName} (${props.LGORT})-Inventory Capex Material`}
                                  />
                                </>
                              ) : (
                                <>
                                  {getNBAManufCurrentInventoryCapexDDReducerLoader ? (
                                    <div style={{ height: '400px' }}>
                                      {' '}
                                      <ReusableSysncLoader />{' '}
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
                        </>
                      ) : (
                        <>
                          {modalContent === 'Vendors' ? (
                            <>
                              {!getNBAManufVendorsDDReducerLoader &&
                              getNBAManufVendorsDDData.length > 0 ? (
                                <>
                                  <ReusableTable
                                    TableData={getNBAManufVendorsDDData}
                                    TableColumn={vendorColumns}
                                    fileName={`${props.ManufName}(${props.LGORT}) - Vendors`}
                                  />
                                </>
                              ) : (
                                <>
                                  {getNBAManufVendorsDDReducerLoader ? (
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
                              {!getNBAManufLeadtimeDDReducerLoader &&
                              getNBAManufLeadtimeDDData.length > 0 ? (
                                <>
                                  <ReusableTable
                                    TableData={getNBAManufLeadtimeDDData}
                                    TableColumn={LeadTimeColumns}
                                    fileName={`${props.ManufName}(${props.LGORT}) - Lead Time`}
                                  />
                                </>
                              ) : (
                                <>
                                  {getNBAManufLeadtimeDDReducerLoader ? (
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

export default MiniCards;
