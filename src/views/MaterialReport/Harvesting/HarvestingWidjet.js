import React, { useState } from 'react';
// eslint-disable-next-line no-unused-vars
import { Row, Col, Card, Switch, Modal } from 'antd';
import { getHarvestChartDD, SwitchData } from '../../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { calculation } from '../../Calculation';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { ERTQtyChart } from './ERTQtyChart';

export const HarvestingWidjet = (props) => {
  const dispatch = useDispatch();
  // const [Checkedvalue, setCheckedvalue] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  // useEffect(() => {

  //   if (Checkedvalue) {
  //     dispatch(getNBAHarvesting(props.Material, props.LGORT, 'stock'));
  //   } else {
  //     dispatch(getNBAHarvesting(props.Material, props.LGORT, 'spare'));
  //   }
  // }, [Checkedvalue]);
  // const SwitchDataRes = useSelector((state) => state.SwitchData);
  // useEffect(() => {
  //   if (SwitchDataRes) {
  //     setCheckedvalue(true);
  //   }
  // }, [SwitchDataRes]);

  const getNBAHarvestingData = useSelector((state) => state.getNBAHarvesting);
  const getNBAHarvestingReducerLoader = useSelector((state) => state.getNBAHarvestingReducerLoader);

  // eslint-disable-next-line no-unused-vars
  const switchChange = () => {
    // setCheckedvalue(!Checkedvalue);
    dispatch(SwitchData(false));
  };
  // eslint-disable-next-line no-unused-vars
  const showModal = () => {
    // if (e == 'chart') {
    setIsModalVisible(true);
    dispatch(getHarvestChartDD(props.Material, props.LGORT));

    // }
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <Modal
        style={{ top: 120 }}
        width="90%"
        footer={null}
        title={
          <Row>
            <Col span={24}> Monthly ERT Trend</Col>
          </Row>
        }
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}>
        <ERTQtyChart />
      </Modal>
      <Card
        bodyStyle={{ height: 190 }}
        title={
          <span>
            {' '}
            <i className="fal fa-exchange-alt mr-2"></i>Harvesting{' '}
            {/* <span className="float-right mr-3">
              <Switch
                className="toggleSwitch"
                checkedChildren="STOCK"
                unCheckedChildren="SPARE"
                checked={Checkedvalue}
                onChange={switchChange}
              />
              <i className="far fa-external-link-alt mr-3" onClick={() => showModal()}></i>
            </span> */}
          </span>
        }>
        {!getNBAHarvestingReducerLoader ? (
          <Row gutter={16}>
            <Col span={4} className="text-center nba-har-wid">
              <i className="fas fa-columns"></i>
              <div className="text-white wid-value wid-harvest mt-3 mb-1">
                <span> {getNBAHarvestingData[0]?.RED_INVENTORY_STOCK}</span> {''}| {''}
                <span className="sub-wid-value text-blue">
                  {getNBAHarvestingData[0]?.GREEN_INVENTORY_STOCK}
                </span>
              </div>
              <div className="mb-2">
                <div className="widget-sub-text text-white">Max Keep Level (Stock)</div>
                <div className="widget-sub-sub-text">(Red | Green)</div>
              </div>
            </Col>
            <Col span={4} className="text-center nba-har-wid">
              <i className="fas fa-project-diagram"></i>
              <div className="text-white wid-value wid-harvest mt-3 mb-1">
                <span> {getNBAHarvestingData[0]?.RED_INVENTORY_SPARE}</span>
                {''} | {''}
                <span className="sub-wid-value text-blue">
                  {getNBAHarvestingData[0]?.GREEN_INVENTORY_SPARE}
                </span>
              </div>
              <div className="mb-2">
                <div className="widget-sub-text text-white">Max Keep Level (Spare)</div>
                <div className="widget-sub-sub-text">(Red | Green)</div>
              </div>
            </Col>
            <Col span={4} className="text-center nba-har-wid">
              <i className="fas fa-cubes"></i>
              <div className="text-white wid-value wid-harvest mt-3 mb-1">
                <span> {calculation(getNBAHarvestingData[0]?.InstallBaseCapEx)} </span>(
                <span className="sub-wid-value text-blue">
                  {getNBAHarvestingData[0]?.InstallBaseQTY}
                </span>
                )
              </div>
              <div className="mb-2">
                {' '}
                <div className="widget-sub-text text-white">Install Base</div>
                <div className="widget-sub-sub-text">(Capex | QTY)</div>
              </div>
            </Col>
            <Col span={4} className="text-center nba-har-wid">
              <i className="fas fa-hand-holding-usd"></i>
              <div className="text-white wid-value wid-harvest mt-3 mb-1">
                <span> {calculation(getNBAHarvestingData[0]?.HarvestUniverseCapex)} </span>(
                <span className="sub-wid-value text-blue">
                  {getNBAHarvestingData[0]?.HarvestUniverse}
                </span>
                )
              </div>
              <div className="mb-2">
                {' '}
                <div className="widget-sub-text text-white">Harvest Universe</div>
                <div className="widget-sub-sub-text">(Capex | QTY)</div>
              </div>
            </Col>
            <Col span={4} className="text-center nba-har-wid">
              <i className="fas fa-kaaba"></i>
              <div className="text-white wid-value wid-harvest mt-3 mb-1">
                <span> {calculation(getNBAHarvestingData[0]?.OpenHarvestCapEx)} </span>(
                <span className="sub-wid-value text-blue">
                  {getNBAHarvestingData[0]?.OpenHarvestQTY}
                </span>
                )
              </div>
              <div className="mb-2">
                <div className="widget-sub-text text-white">Open Harvest</div>
                <div className="widget-sub-sub-text">(Capex | QTY)</div>
              </div>
            </Col>
            <Col span={4} className="text-center nba-har-wid">
              <i className="fas fa-layer-group"></i>
              <div className="text-white wid-value wid-harvest mt-3 mb-1">
                <span> {calculation(getNBAHarvestingData[0]?.HarvestCapex)} </span>(
                <span className="sub-wid-value text-blue">
                  {getNBAHarvestingData[0]?.HarvestQty}
                </span>
                )
              </div>
              <div className="mb-2">
                {' '}
                <div className="widget-sub-text text-white">Harvest</div>
                <div className="widget-sub-sub-text">(Capex | QTY)</div>
              </div>
            </Col>
          </Row>
        ) : (
          <ReusableSysncLoader />
        )}
      </Card>
    </>
  );
};
