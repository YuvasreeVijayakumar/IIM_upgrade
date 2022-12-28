import React, { useState } from 'react';
import { Card, Col, Row, Modal } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { getNBAManufAnnouncementsDD } from '../../../actions';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import {
  UnderstockAnnouncementDDColumns,
  OverStockAnnouncementDDColumns,
  LTSCoulmns
} from '../../NBAOrgReport/NBAOrgTableColumn';
import { MaterialNoColumns, ORDERS_RECOMMENDATION } from '../NBAManufTableColumns';

const Annouancement = (props) => {
  const dispatch = useDispatch();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const { NO_OF_MATERIALS, UNDERSTOCK, OVERSTOCK, NUMBER_OF_LTS_EXPIRING, MAT_COUNT } = useSelector(
    (state) => state.getNBAManufAnnouncements
  );
  const getNBAManufAnnouncementsReducerLoader = useSelector(
    (state) => state.getNBAManufAnnouncementsReducerLoader
  );
  const getNBAManufAnnouncementsDDReducerLoader = useSelector(
    (state) => state.getNBAManufAnnouncementsDDReducerLoader
  );

  const getNBAManufAnnouncementsDDData = useSelector((state) => state.getNBAManufAnnouncementsDD);
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
          <Col span={24} className="text-center mb-2">
            {' '}
            <span className="tblHeader annouance-head"> Announcement</span>
          </Col>
        </Row>

        {!getNBAManufAnnouncementsReducerLoader ? (
          <>
            {' '}
            <Row>
              <Col span={24} className="nba-manuf-annouancement">
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Materials Require Action');
                    dispatch(
                      getNBAManufAnnouncementsDD(
                        encodeURIComponent(props.ManufName),
                        props.LGORT,
                        'ORDERS_RECOMMENDATION'
                      )
                    );
                  }}>
                  {' '}
                  <i className="fad fa-bullhorn mr-2"></i> Materials require action : {MAT_COUNT}
                </p>
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Inventory Exhaust Materials');
                    dispatch(
                      getNBAManufAnnouncementsDD(
                        encodeURIComponent(props.ManufName),
                        props.LGORT,
                        'INVENTORY_EXHAUST'
                      )
                    );
                  }}>
                  {' '}
                  <i className="fad fa-bullhorn mr-2"></i> Materials to exhaust inventory in next 2
                  weeks :{NO_OF_MATERIALS}
                </p>
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Under Stock');
                    dispatch(
                      getNBAManufAnnouncementsDD(
                        encodeURIComponent(props.ManufName),
                        props.LGORT,
                        'UNDERSTOCK'
                      )
                    );
                  }}>
                  {' '}
                  <i className="fad fa-bullhorn mr-2"></i> Understocked parts : {UNDERSTOCK}{' '}
                </p>
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Over Stock');
                    dispatch(
                      getNBAManufAnnouncementsDD(
                        encodeURIComponent(props.ManufName),
                        props.LGORT,
                        'OVERSTOCK'
                      )
                    );
                  }}>
                  {' '}
                  <i className="fad fa-bullhorn mr-2"></i> Overstocked parts : {OVERSTOCK}
                </p>
                <p
                  className="up flood-right"
                  onClick={() => {
                    setIsModalVisible('true');
                    setModalContent('Leadtime Expiring Materials');
                    dispatch(
                      getNBAManufAnnouncementsDD(
                        encodeURIComponent(props.ManufName),
                        props.LGORT,
                        'LEADTIME_EXPIRE'
                      )
                    );
                  }}>
                  {' '}
                  <i className="fad fa-bullhorn mr-2"></i> {NUMBER_OF_LTS_EXPIRING} Material
                  leadtime overwrite has expired or is about to expire in next 14
                </p>
              </Col>
            </Row>
          </>
        ) : (
          <>
            {' '}
            {getNBAManufAnnouncementsReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
          </>
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
              {!getNBAManufAnnouncementsDDReducerLoader &&
              getNBAManufAnnouncementsDDData.length > 0 ? (
                <ReusableTable
                  TableData={getNBAManufAnnouncementsDDData}
                  TableColumn={UnderstockAnnouncementDDColumns}
                  fileName={`${props.ManufName}(${props.LGORT}) - Understock`}
                />
              ) : (
                <>
                  {getNBAManufAnnouncementsDDReducerLoader ? (
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
                  {!getNBAManufAnnouncementsDDReducerLoader &&
                  getNBAManufAnnouncementsDDData.length > 0 ? (
                    <ReusableTable
                      TableData={getNBAManufAnnouncementsDDData}
                      TableColumn={OverStockAnnouncementDDColumns}
                      fileName={`${props.ManufName}(${props.LGORT}) - Overstock`}
                    />
                  ) : (
                    <>
                      {getNBAManufAnnouncementsDDReducerLoader ? (
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
                      {!getNBAManufAnnouncementsDDReducerLoader &&
                      getNBAManufAnnouncementsDDData.length > 0 ? (
                        <>
                          <ReusableTable
                            TableData={getNBAManufAnnouncementsDDData}
                            TableColumn={LTSCoulmns}
                            fileName={`${props.ManufName}(${props.LGORT}) - LTS Expiring Data`}
                          />
                        </>
                      ) : (
                        <>
                          {getNBAManufAnnouncementsDDReducerLoader ? (
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
                          {!getNBAManufAnnouncementsDDReducerLoader &&
                          getNBAManufAnnouncementsDDData.length > 0 ? (
                            <>
                              {' '}
                              <ReusableTable
                                TableData={getNBAManufAnnouncementsDDData}
                                TableColumn={MaterialNoColumns}
                                fileName={`${props.ManufName}(${props.LGORT}) - Inventory Exhaust Materials`}
                              />
                            </>
                          ) : (
                            <>
                              {getNBAManufAnnouncementsDDReducerLoader ? (
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
                              {!getNBAManufAnnouncementsDDReducerLoader &&
                              getNBAManufAnnouncementsDDData.length > 0 ? (
                                <>
                                  {' '}
                                  <ReusableTable
                                    TableData={getNBAManufAnnouncementsDDData}
                                    TableColumn={ORDERS_RECOMMENDATION}
                                    fileName={`${props.ManufName}(${props.LGORT}) - Materials Require Action`}
                                  />
                                </>
                              ) : (
                                <>
                                  {getNBAManufAnnouncementsDDReducerLoader ? (
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
                              {!getNBAManufAnnouncementsDDReducerLoader &&
                              getNBAManufAnnouncementsDDData.length > 0 ? (
                                <></>
                              ) : (
                                <>
                                  {getNBAManufAnnouncementsDDReducerLoader ? (
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

export default Annouancement;
