import { Card, Col, Popover, Row, Radio, Modal } from 'antd';
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import Odometer from 'react-odometerjs';
import { getNBAMaterialGeneralInfo, getNBAMaterialKeymetrics, getEOQHeaderDD } from '../../actions';
import { calculation } from '../Calculation';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';
import Turnoverrate from './InvetoryPrediction/Components/Turnoverrate';
import AccuracyForecast from './InvetoryPrediction/Components/AccuracyForecast';
import LeadTime from './InvetoryPrediction/Components/LeadTime';
import { Backorderrate } from './InvetoryPrediction/Components/Backorderrate';
import { InventoryCapexDDTbl } from './InventoryCapexDDTbl';
export const MaterialWidjet = (props) => {
  const dispatch = useDispatch();
  const [selected, setselected] = useState('General');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalContent, setModalContent] = useState('');
  const onChange = (value) => {
    setselected(value.target.value);
    if (value.target.value == 'General') {
      dispatch(getNBAMaterialGeneralInfo(props.Material, props.LGORT));
    } else if (value.target.value == 'PredictedMetrics') {
      dispatch(getEOQHeaderDD(props.Material, props.LGORT));
    } else if (value.target.value == 'KeyMetrics') {
      dispatch(getNBAMaterialKeymetrics(props.Material, props.LGORT));
    }
  };
  const getNBAMaterialGeneralInfoData = useSelector((state) => state.getNBAMaterialGeneralInfo);
  const getNBAMaterialKeymetricsData = useSelector((state) => state.getNBAMaterialKeymetrics);
  const getEOQHeaderDDData = useSelector((state) => state.getEOQHeaderDD);
  const GetNBAMaterialGeneralInfoLoaderReducer = useSelector(
    (state) => state.GetNBAMaterialGeneralInfoLoaderReducer
  );
  const GetEOQHeaderDDLoaderReducer = useSelector((state) => state.GetEOQHeaderDDLoaderReducer);
  const getNBAMaterialKeymetricsLoaderReducer = useSelector(
    (state) => state.getNBAMaterialKeymetricsLoaderReducer
  );

  useEffect(() => {
    setselected('General');
  }, [getNBAMaterialGeneralInfoData]);

  const handleModal = () => {
    setIsModalVisible(true);
    setModalTitle('Turnover Rate');
    setModalContent('turnoverrate');
  };
  const handleModal1 = () => {
    setIsModalVisible(true);
    setModalTitle('Backorder Rate');
    setModalContent('backorderrate');
  };
  const handleModal2 = () => {
    setIsModalVisible(true);
    setModalTitle(' Forecast Accuracy');
    setModalContent('forecast');
  };
  const handleModal3 = () => {
    setIsModalVisible(true);
    setModalTitle('Lead Time');
    setModalContent('leadtime');
  };
  const handleModal4 = () => {
    setIsModalVisible(true);
    setModalTitle('Inventory Capex');
    setModalContent('InventoryCapex');
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  let modalRender;
  if (modalContent == 'turnoverrate')
    modalRender = <Turnoverrate Material={props.Material} LGORT={props.LGORT} />;
  // else if (modalContent == 'backorderrate') modalRender = <Turnoverrate />;
  else if (modalContent == 'forecast')
    modalRender = <AccuracyForecast Material={props.Material} LGORT={props.LGORT} />;
  else if (modalContent == 'leadtime')
    modalRender = <LeadTime Material={props.Material} LGORT={props.LGORT} />;
  else if (modalContent == 'backorderrate')
    modalRender = <Backorderrate Material={props.Material} LGORT={props.LGORT} />;
  else if (modalContent == 'InventoryCapex')
    modalRender = <InventoryCapexDDTbl Material={props.Material} LGORT={props.LGORT} />;

  return (
    <>
      <Card
        className="mainLayout"
        title={
          <>
            <Row>
              {/* <Col span={18} className="float-right">
                {' '}
                <Select
                  style={{ width: '45%' }}
                  className="chart-select float-right mr-3"
                  placeholder="Select a value"
                  optionFilterProp="children"
                  onChange={onChange}
                  value={selected}>
                  <Option value="General">General</Option>
                  <Option value="PredictedMetrics">Predicted-Metrics</Option>
                  <Option value="KeyMetrics">Key-Metrics</Option>
                </Select>
              </Col> */}
              <Col span={24}>
                <span>
                  {' '}
                  <i className="fas fa-globe mr-2"></i>
                  Metrics
                </span>
                <div className="NBA-Inventory-Prediction float-right mr-2">
                  <Radio.Group value={selected} onChange={onChange}>
                    <Radio.Button value="General">General</Radio.Button>
                    <Radio.Button value="PredictedMetrics">Predicted Metrics</Radio.Button>
                    <Radio.Button value="KeyMetrics">Key-Metrics</Radio.Button>
                  </Radio.Group>
                </div>
              </Col>
            </Row>
          </>
        }>
        {selected == 'General' ? (
          <>
            {!GetNBAMaterialGeneralInfoLoaderReducer ? (
              <>
                {' '}
                <Row gutter={16} className="mt-3 mb-3 Overridecss">
                  <Col span={6}>
                    <Row gutter={16} onClick={handleModal4}>
                      <Col span={24} className=" text-center cursor-pointer">
                        {' '}
                        <div className="nba-wid-value">
                          {' '}
                          <span className="symbol-color">
                            {calculation(getNBAMaterialGeneralInfoData[0]?.INVENTORY_CAPEX)}
                          </span>{' '}
                          <span className="nba-text-small text-blue">
                            ({getNBAMaterialGeneralInfoData[0]?.QUANTITY})
                          </span>
                        </div>
                      </Col>
                      <Col span={24} className=" text-center cursor-pointer">
                        {' '}
                        <div className="nba-wid-head">Inventory Capex</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={6}>
                    <Row gutter={16}>
                      <Col span={24} className=" text-center cursor-pointer">
                        {' '}
                        <div className="nba-wid-value">
                          <span className="symbol-color">
                            <Popover content={<span>Average Consumption</span>} placement="top">
                              {' '}
                              {getNBAMaterialGeneralInfoData[0]?.AVG_CONSUMPTION}{' '}
                            </Popover>
                            {getNBAMaterialGeneralInfoData[0]?.BO_CONSUMPTION != null ? (
                              <>
                                |
                                <Popover
                                  content={<span>Average Consumption with Back-Order</span>}
                                  placement="top">
                                  {' '}
                                  {getNBAMaterialGeneralInfoData[0]?.BO_CONSUMPTION}
                                </Popover>
                              </>
                            ) : (
                              ''
                            )}
                          </span>
                          {/* <Odometer
                        value={getNBAMaterialGeneralInfoData[0]?.AVG_CONSUMPTION}
                        options={{ format: '' }}
                      /> */}
                        </div>
                      </Col>
                      <Col span={24} className=" text-center cursor-pointer">
                        {' '}
                        <div className="nba-wid-head">Avg Consumption</div>
                        <div className="nba-wid-head">(Monthly)</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={6}>
                    <Row gutter={16}>
                      <Col span={24} className=" text-center cursor-pointer">
                        {' '}
                        <div className="nba-wid-value">
                          <span className="symbol-color">
                            <Popover content={<span>Median Lead Time</span>}>
                              {getNBAMaterialGeneralInfoData[0]?.MEDIAN_LEADTIME}
                            </Popover>
                            {getNBAMaterialGeneralInfoData[0]?.NEW_LEAD_TIME != null ? (
                              <>
                                |{' '}
                                <Popover content={<span>Overwritten Lead Time</span>}>
                                  {getNBAMaterialGeneralInfoData[0]?.NEW_LEAD_TIME}
                                </Popover>{' '}
                              </>
                            ) : (
                              ''
                            )}
                          </span>
                          {/* <Odometer
                        value={getNBAMaterialGeneralInfoData[0]?.DEMAND_PER_DAY}
                        options={{ format: '' }}
                      /> */}
                        </div>
                      </Col>
                      <Col span={24} className=" text-center cursor-pointer">
                        <div className="nba-wid-head">LeadTime</div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={6}>
                    <Row gutter={16}>
                      <Col span={24} className=" text-center cursor-pointer">
                        {' '}
                        <div className="nba-wid-value">
                          <span className="symbol-color">
                            {calculation(getNBAMaterialGeneralInfoData[0]?.UNIT_PRICE)}
                          </span>{' '}
                          {/* <Odometer
                        value={getNBAMaterialGeneralInfoData[0]?.UNIT_PRICE}
                        options={{ format: '' }}
                      /> */}
                        </div>
                      </Col>
                    </Row>
                    <Row gutter={16}>
                      <Col span={24} className=" text-center cursor-pointer">
                        {' '}
                        <div className="nba-wid-head">Unit Price</div>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <div className=" mb-2 mt-2 garage-title">
                  <Popover
                    placement="bottom"
                    content={
                      <>
                        {' '}
                        {getNBAMaterialGeneralInfoData[0]?.DESCRIPTION}
                        {getNBAMaterialGeneralInfoData[0]?.HECI != '' ? (
                          <>
                            <br />
                            <span className="nba-wid-value">
                              HECI : &nbsp;
                              {getNBAMaterialGeneralInfoData[0]?.HECI}{' '}
                            </span>
                          </>
                        ) : (
                          ''
                        )}
                        {getNBAMaterialGeneralInfoData[0]?.STK_TYPE != null ? (
                          <>
                            <br />
                            <span className="Stk-style">
                              Stock Type : &nbsp;&nbsp;
                              {getNBAMaterialGeneralInfoData[0]?.STK_TYPE}
                            </span>
                          </>
                        ) : (
                          ''
                        )}
                        {getNBAMaterialGeneralInfoData[0]?.CTL_STOCKOUT_FLAG != 'N' ? (
                          <>
                            <br />
                            <span className="stockout-style">CTL Stockout : &nbsp; Yes</span>
                          </>
                        ) : (
                          ''
                        )}
                        {getNBAMaterialGeneralInfoData[0]?.LVLT_STOCKOUT_FLAG != 'N' ? (
                          <>
                            <br />
                            <span className="stockout-style">LVLT Stockout: &nbsp; Yes</span>
                          </>
                        ) : (
                          ''
                        )}
                      </>
                    }>
                    {' '}
                    <span className="nba-wid-head">Description : </span>
                    {getNBAMaterialGeneralInfoData[0]?.DESCRIPTION}
                  </Popover>
                </div>
              </>
            ) : (
              <ReusableSysncLoader />
            )}
          </>
        ) : (
          <>
            {selected == 'KeyMetrics' ? (
              <>
                {!getNBAMaterialKeymetricsLoaderReducer ? (
                  <>
                    <Row gutter={16} className="mt-3 mb-3 Overridecss">
                      <Col span={6}>
                        <Row gutter={16} onClick={handleModal}>
                          <Col span={24} className=" text-center  cursor-pointer">
                            {' '}
                            <div className="nba-wid-value">
                              <span className="symbol-color">
                                {getNBAMaterialKeymetricsData[0]?.TURNOVERRATE}
                              </span>{' '}
                              {/* <Odometer
                        value={getNBAMaterialKeymetricsData[0]?.TURNOVERRATE}
                        options={{ format: '' }}
                      /> */}
                            </div>
                          </Col>
                          <Col span={24} className=" text-center  cursor-pointer">
                            <div className="nba-wid-head">Turnover Rate</div>
                          </Col>
                        </Row>
                      </Col>
                      <Col span={6}>
                        <Row gutter={16} onClick={handleModal1}>
                          <Col span={24} className=" text-center cursor-pointer">
                            <div className="nba-wid-value">
                              <span className="symbol-color">
                                {getNBAMaterialKeymetricsData[0]?.BACK_ORDER_RATE} %
                              </span>{' '}
                              {/* <Odometer
                        value={getNBAMaterialKeymetricsData[0]?.BACK_ORDER_RATE}
                        options={{ format: '' }}
                      /> */}
                            </div>
                          </Col>
                          <Col span={24} className=" text-center cursor-pointer">
                            <div className="nba-wid-head">Backorder Rate</div>
                          </Col>
                        </Row>
                      </Col>

                      <Col span={6}>
                        <Row gutter={16} onClick={handleModal2}>
                          <Col span={24} className=" text-center cursor-pointer">
                            {' '}
                            <div className="nba-wid-value">
                              <span className="symbol-color">
                                {getNBAMaterialKeymetricsData[0]?.FORECAST_ACCURACY} %
                              </span>{' '}
                              {/* <Odometer
                        value={getNBAMaterialKeymetricsData[0]?.TURNOVERRATE}
                        options={{ format: '' }}
                      /> */}
                            </div>
                          </Col>
                          <Col span={24} className=" text-center cursor-pointer">
                            <div className="nba-wid-head">Forecast Accuracy</div>
                          </Col>
                        </Row>
                      </Col>

                      {/* working */}
                      <Col span={6}>
                        <Row gutter={16} onClick={handleModal3}>
                          <Col span={24} className=" text-center cursor-pointer">
                            {' '}
                            <div className="nba-wid-value">
                              <span className="symbol-color">
                                {getNBAMaterialKeymetricsData[0]?.MEDIAN_LEADTIME} Days
                              </span>{' '}
                              {/* <Odometer
                        value={getNBAMaterialKeymetricsData[0]?.TURNOVERRATE}
                        options={{ format: '' }}
                      /> */}
                            </div>
                          </Col>
                          <Col span={24} className=" text-center cursor-pointer">
                            <div className="nba-wid-head">LeadTime Median</div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className=" mb-2 mt-2 garage-title">
                      <Popover
                        placement="bottom"
                        content={
                          <>
                            {' '}
                            <span className="nba-wid-value">Description : </span>
                            {getNBAMaterialGeneralInfoData[0]?.DESCRIPTION}
                            {getNBAMaterialGeneralInfoData[0]?.HECI != '' ? (
                              <>
                                <br />
                                <span className="nba-wid-value">
                                  HECI : &nbsp;
                                  {getNBAMaterialGeneralInfoData[0]?.HECI}{' '}
                                </span>
                              </>
                            ) : (
                              ''
                            )}
                            {getNBAMaterialGeneralInfoData[0]?.STK_TYPE != null ? (
                              <>
                                <br />
                                <span className="Stk-style">
                                  STK_TYPE : &nbsp;&nbsp;
                                  {getNBAMaterialGeneralInfoData[0]?.STK_TYPE}
                                </span>
                              </>
                            ) : (
                              ''
                            )}
                            {getNBAMaterialGeneralInfoData[0]?.CTL_STOCKOUT_FLAG != 'N' ? (
                              <>
                                <br />
                                <span className="stockout-style">
                                  CTL_STOCKOUT_FLAG : &nbsp; Yes
                                </span>
                              </>
                            ) : (
                              ''
                            )}
                            {getNBAMaterialGeneralInfoData[0]?.LVLT_STOCKOUT_FLAG != 'N' ? (
                              <>
                                <br />
                                <span className="stockout-style">
                                  LVLT_STOCKOUT_FLAG : &nbsp; Yes
                                </span>
                              </>
                            ) : (
                              ''
                            )}
                          </>
                        }>
                        {' '}
                        <span className="nba-wid-head">Description : </span>
                        {getNBAMaterialKeymetricsData[0]?.DESCRIPTION}
                      </Popover>
                    </div>
                  </>
                ) : (
                  <ReusableSysncLoader />
                )}
              </>
            ) : (
              <>
                {!GetEOQHeaderDDLoaderReducer ? (
                  <>
                    <Row gutter={16} className="mt-3 mb-3 Overridecss">
                      <Col span={6}>
                        <Row gutter={16}>
                          <Col span={24} className=" text-center cursor-pointer">
                            {' '}
                            <div className="nba-wid-value">
                              <span className="symbol-color">
                                {getEOQHeaderDDData[0]?.PredictedDemandMonthly}
                              </span>{' '}
                              {/* <Odometer
                            value={getNBAMaterialKeymetricsData[0]?.TURNOVERRATE}
                            options={{ format: '' }}
                          /> */}
                            </div>
                          </Col>
                          <Col span={24} className=" text-center cursor-pointer">
                            <div className="nba-wid-head"> Predicted Demand</div>
                            <div className="nba-wid-head">(Next 30 Days)</div>
                          </Col>
                        </Row>
                      </Col>

                      <Col span={6}>
                        <Row gutter={16}>
                          <Col span={24} className=" text-center cursor-pointer">
                            {' '}
                            <div className="nba-wid-value">
                              <span className="symbol-color">
                                {getEOQHeaderDDData[0]?.ReorderPoint}
                              </span>{' '}
                              {/* <Odometer
                            value={getNBAMaterialKeymetricsData[0]?.TURNOVERRATE}
                            options={{ format: '' }}
                          /> */}
                            </div>
                          </Col>
                          <Col span={24} className=" text-center cursor-pointer">
                            <div className="nba-wid-head"> Reorder Point</div>
                          </Col>
                        </Row>
                      </Col>

                      <Col span={6}>
                        <Row gutter={16}>
                          <Col span={24} className=" text-center cursor-pointer">
                            {' '}
                            <div className="nba-wid-value">
                              <span className="symbol-color">
                                {calculation(getEOQHeaderDDData[0]?.Predicted_CapEx_With_Harvest)}
                              </span>{' '}
                              {/* <Odometer
                            value={getNBAMaterialKeymetricsData[0]?.TURNOVERRATE}
                            options={{ format: '' }}
                          /> */}
                            </div>
                          </Col>
                          <Col span={24} className=" text-center cursor-pointer">
                            <div className="nba-wid-head"> Predicted Capex</div>
                          </Col>
                        </Row>
                      </Col>

                      <Col span={6}>
                        <Row gutter={16}>
                          <Col span={24} className=" text-center cursor-pointer">
                            {' '}
                            <div className="nba-wid-value">
                              <span className="symbol-color">
                                {getEOQHeaderDDData[0]?.Safety_Stock}
                              </span>{' '}
                              {/* <Odometer
                            value={getNBAMaterialKeymetricsData[0]?.TURNOVERRATE}
                            options={{ format: '' }}
                          /> */}
                            </div>
                          </Col>
                          <Col span={24} className=" text-center cursor-pointer">
                            <div className="nba-wid-head"> Safety Stock</div>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                    <div className=" mb-2 mt-2 garage-title">
                      <Popover
                        placement="bottom"
                        content={
                          <>
                            {' '}
                            <span className="nba-wid-value">Description : </span>
                            {getNBAMaterialGeneralInfoData[0]?.DESCRIPTION}
                            {getNBAMaterialGeneralInfoData[0]?.HECI != '' ? (
                              <>
                                <br />
                                <span className="nba-wid-value">
                                  HECI : &nbsp;
                                  {getNBAMaterialGeneralInfoData[0]?.HECI}{' '}
                                </span>
                              </>
                            ) : (
                              ''
                            )}
                            {getNBAMaterialGeneralInfoData[0]?.STK_TYPE != null ? (
                              <>
                                <br />
                                <span className="Stk-style">
                                  STK_TYPE : &nbsp;&nbsp;
                                  {getNBAMaterialGeneralInfoData[0]?.STK_TYPE}
                                </span>
                              </>
                            ) : (
                              ''
                            )}
                            {getNBAMaterialGeneralInfoData[0]?.CTL_STOCKOUT_FLAG != 'N' ? (
                              <>
                                <br />
                                <span className="stockout-style">
                                  CTL_STOCKOUT_FLAG : &nbsp; yes
                                </span>
                              </>
                            ) : (
                              ''
                            )}
                            {getNBAMaterialGeneralInfoData[0]?.LVLT_STOCKOUT_FLAG != 'N' ? (
                              <>
                                <br />
                                <span className="stockout-style">
                                  LVLT_STOCKOUT_FLAG : &nbsp; Yes
                                </span>
                              </>
                            ) : (
                              ''
                            )}
                          </>
                        }>
                        {' '}
                        <span className="nba-wid-head">Description : </span>
                        {getEOQHeaderDDData[0]?.DESCRIPTION}
                      </Popover>
                    </div>
                  </>
                ) : (
                  <>
                    <ReusableSysncLoader />
                  </>
                )}
              </>
            )}
          </>
        )}
      </Card>
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="60%"
        destroyOnClose
        height="auto">
        {modalRender}
      </Modal>
    </>
  );
};
