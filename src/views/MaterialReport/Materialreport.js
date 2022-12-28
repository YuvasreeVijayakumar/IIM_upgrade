import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Col, Row, Layout, Card, TreeSelect, Popover, Checkbox } from 'antd';
import { InventoryPrediction } from './InvetoryPrediction/InventoryPrediction';
import { MaterialWidjet } from './MaterialWidjet';
// import { Recomentation } from './Recomentation';
// eslint-disable-next-line no-unused-vars
import { Inventorysummary } from './InventorySummary/Inventorysummary';
import ChatBot from '../DashBoard/ChatBot';

import {
  // eslint-disable-next-line no-unused-vars
  getDefaultMaterialCapGov,
  getNBAMaterialGeneralInfo,
  getNBAInventorySummaryMaterial,
  getMonthlyStockVisualization,
  getNBAMaterialReminder,
  // getNBAAnnouncements,
  getNBACapGovRequest,
  getCapGovMaterialReport,
  getNBAHarvesting,
  getNBAOutstandingOrders,
  getNBAOverdue,
  SwitchData,
  getNBAFillrate,
  getNBASlaMet,
  getHarvestChartDD,
  getNBABackorders,
  getNBABackorderQtyMaterialMonthwise,
  getNBADefaultMaterialReport,
  getNBAMaterialReportDD
} from '../../actions';
import { Reminder } from './Reminder';
// eslint-disable-next-line no-unused-vars
import { Announcement } from './Announcement';
import { CapitalGovernance } from './CapitalGovernance';

import { Harvesting } from './Harvesting/Harvesting';
import { Inventory } from './Inventory/Inventory';
import { ERTMainCard } from './Harvesting/ERTMainCard';
import { NoOfBackOrderCard } from './Harvesting/NoOfBackOrderCard';

const { Footer } = Layout;
const { TreeNode } = TreeSelect;

const Materialreport = () => {
  const dispatch = useDispatch();
  const [material_no, setmaterial_no] = useState('');
  const [LeadtimeExpireFlag, setLeadtimeExpireFlag] = useState('');
  const [selected, setselected] = useState(false);
  const [MPNData, setMPN] = useState('');
  const [LGORT, setLGORT] = useState('');
  const MaterialData = useSelector((state) => state.getNBAMaterialReportDD);
  const defaultValueDD = useSelector((state) => state.getNBADefaultMaterialReport);
  const getNBACapGovRequestData = useSelector((state) => state.getNBACapGovRequest);

  useEffect(() => {
    dispatch(getNBADefaultMaterialReport());
    dispatch(getNBAMaterialReportDD('Material'));
  }, []);
  const ChatBotTogglerData = useSelector((state) => state.ChatBotToggler.ChatBotToggler);

  useEffect(() => {
    if (defaultValueDD.length > 0) {
      setmaterial_no(defaultValueDD[0]?.MATNR),
        setLGORT(defaultValueDD[0]?.LGORT),
        setMPN(defaultValueDD[0]?.MPN);
      setLeadtimeExpireFlag(defaultValueDD[0]?.LEADTIME_EXPIRY_FLAG);
      //material report Material
      dispatch(getNBAMaterialGeneralInfo(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getNBAInventorySummaryMaterial(defaultValueDD[0]?.MATNR));
      dispatch(getMonthlyStockVisualization(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getNBAMaterialReminder(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      // dispatch(getNBAAnnouncements(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getNBACapGovRequest(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getNBAHarvesting(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT, 'stock'));
      dispatch(
        getCapGovMaterialReport(
          defaultValueDD[0]?.MATNR,

          'ALL',
          'ALL',
          defaultValueDD[0]?.LGORT,
          'all',
          'MATERIAL'
        )
      );
      dispatch(getNBAOutstandingOrders(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getNBAOverdue(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getNBAFillrate(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getNBASlaMet(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getHarvestChartDD(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(getNBABackorders(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT));
      dispatch(
        getNBABackorderQtyMaterialMonthwise(defaultValueDD[0]?.MATNR, defaultValueDD[0]?.LGORT)
      );
    }
  }, [defaultValueDD]);

  const handleMaterialChange = (e) => {
    MaterialData.map((d) => {
      if (e === d.MATNRLGORT) {
        dispatch(SwitchData(true));
        setMPN(d.MPN);
        setmaterial_no(d.matnr);
        setLGORT(d.lgort);
        setLeadtimeExpireFlag(d.LEADTIME_EXPIRY_FLAG);
        dispatch(getNBAMaterialGeneralInfo(d.matnr, d.lgort));
        dispatch(getMonthlyStockVisualization(d.matnr, d.lgort));
        dispatch(getNBAInventorySummaryMaterial(d.matnr, d.lgort));
        dispatch(getNBAMaterialReminder(d.matnr, d.lgort));
        // dispatch(getNBAAnnouncements(d.matnr, d.lgort));
        dispatch(getNBACapGovRequest(d.matnr, d.lgort));
        dispatch(getCapGovMaterialReport(d.matnr, 'all', 'ALL', d.lgort, 'all', 'MATERIAL'));
        dispatch(getNBAHarvesting(d.matnr, d.lgort, 'stock'));
        dispatch(getNBAOutstandingOrders(d.matnr, d.lgort));
        dispatch(getNBAOverdue(d.matnr, d.lgort));
        dispatch(getNBAFillrate(d.matnr, d.lgort));
        dispatch(getNBASlaMet(d.matnr, d.lgort));
        dispatch(getHarvestChartDD(d.matnr, d.lgort));
        dispatch(getNBABackorders(d.matnr, d.lgort));
        dispatch(getNBABackorderQtyMaterialMonthwise(d.matnr, d.lgort));
      }
    });
  };
  const handleMaterialChangeMPN = (e) => {
    MaterialData.map((d) => {
      if (e === d.MPNLGORT) {
        setMPN(d.MPN);
        setmaterial_no(d.matnr);
        setLGORT(d.lgort);
        dispatch(getNBAMaterialGeneralInfo(d.matnr, d.lgort));
        dispatch(getMonthlyStockVisualization(d.matnr, d.lgort));
        dispatch(getNBAInventorySummaryMaterial(d.matnr, d.lgort));
        dispatch(getNBAMaterialReminder(d.matnr, d.lgort));
        // dispatch(getNBAAnnouncements(d.matnr, d.lgort));
        dispatch(getNBACapGovRequest(d.matnr, d.lgort));
        dispatch(getCapGovMaterialReport(d.matnr, 'all', 'ALL', d.lgort, 'ALL', 'MATERIAL'));
        dispatch(getNBAHarvesting(d.matnr, d.lgort, 'stock'));
        dispatch(getNBAOutstandingOrders(d.matnr, d.lgort));
        dispatch(getNBAOverdue(d.matnr, d.lgort));
        dispatch(getNBAFillrate(d.matnr, d.lgort));
        dispatch(getNBASlaMet(d.matnr, d.lgort));
        dispatch(getHarvestChartDD(d.matnr, d.lgort));
        dispatch(getNBABackorders(d.matnr, d.lgort));
        dispatch(getNBABackorderQtyMaterialMonthwise(d.matnr, d.lgort));
      }
    });
    return;
  };
  const onChange = (e) => {
    if (!e.target.checked) {
      // setMPN(defaultValueDD[0]?.MPN);
      // setmaterial_no(defaultValueDD[0]?.MATNR);
      // setLGORT(defaultValueDD[0]?.LGORT);
      setselected(e.target.checked);
      // handleMaterialChange(defaultValueDD[0]?.MATNR + defaultValueDD[0]?.LGORT);
    } else if (e.target.checked) {
      // setMPN(defaultValueDD[0]?.MPN);
      // setmaterial_no(defaultValueDD[0]?.MATNR);
      // setLGORT(defaultValueDD[0]?.LGORT);
      // handleMaterialChangeMPN(defaultValueDD[0]?.MPN + defaultValueDD[0]?.LGORT);

      setselected(e.target.checked);
    }
  };

  return (
    <>
      <div className="animated fadeIn">
        <div className="scroll-set-body">
          <div className="pr-2 pl-1 materialReport">
            <div className="stick-top">
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card className="Material-Report-header">
                    <Row>
                      <Col span={24}>
                        <span className="tblHeader">
                          <i className="fas fa-table mr-2" />

                          <>
                            Material -
                            <span className="nba-head-text-highlight-color">
                              {' '}
                              {material_no} &nbsp;
                              <span className="nba-head-text-highlight-color-sub">({LGORT})</span>
                            </span>
                            &nbsp;&nbsp;MPN -
                            <span className="nba-head-text-highlight-color">{MPNData}</span>
                          </>

                          <span className="ml-3 cursor-pointer">
                            {' '}
                            {getNBACapGovRequestData[0]?.STOCKTYPE == 'UNDERSTOCK' ? (
                              <Popover content={<span>Understock</span>} placement="right">
                                <span>
                                  <i className="fas fa-circle fa-2x milestone-risk-red ml-2"></i>
                                </span>
                              </Popover>
                            ) : (
                              ''
                            )}
                            {getNBACapGovRequestData[0]?.STOCKTYPE == 'OVERSTOCK' ? (
                              <Popover content={<span>OverStock</span>} placement="right">
                                {' '}
                                <span>
                                  <i className="fas fa-circle fa-2x milestone-risk-yellow ml-2"></i>
                                </span>
                              </Popover>
                            ) : (
                              ''
                            )}
                            {getNBACapGovRequestData[0]?.STOCKTYPE == null ? (
                              <Popover content={<span>Optimal</span>} placement="right">
                                {' '}
                                <span>
                                  <i className="fas fa-circle fa-2x milestone-risk-green ml-2"></i>
                                </span>
                              </Popover>
                            ) : (
                              ''
                            )}
                          </span>
                          <span>
                            {LeadtimeExpireFlag === 'Y' ? (
                              <span className="nba-mat-head-teaxt-leadtime ml-3">
                                Leadtime Expired
                              </span>
                            ) : (
                              ''
                            )}
                          </span>
                        </span>
                        <span className="float-right mr-4">
                          <span className="font-18"> Search : &nbsp;&nbsp;</span>
                          {!selected ? (
                            <>
                              {' '}
                              {MaterialData.length > 0 && defaultValueDD.length > 0 ? (
                                <TreeSelect
                                  showSearch
                                  style={{ width: '200px', fontSize: 16, color: 'white' }}
                                  value={material_no}
                                  placeholder={defaultValueDD[0]?.MATNR}
                                  allowClear={false}
                                  treeDefaultExpandAll
                                  onChange={handleMaterialChange}
                                  getPopupContainer={(trigger) => trigger.parentNode}
                                  // className="text-select-form float-right mr-4 capgov-select"

                                  className="chart-select  mr-4">
                                  {MaterialData?.map((val1, ind1) => (
                                    <TreeNode
                                      value={`${val1.matnr + val1.lgort}`}
                                      title={`${val1.matnr}  (${val1.lgort})`}
                                      key={ind1}
                                    />
                                  ))}
                                </TreeSelect>
                              ) : (
                                ''
                              )}
                            </>
                          ) : (
                            <>
                              {' '}
                              {MaterialData.length > 0 && defaultValueDD.length > 0 ? (
                                <TreeSelect
                                  showSearch
                                  style={{ width: '200px', fontSize: 16, color: 'white' }}
                                  value={MPNData}
                                  placeholder={defaultValueDD[0]?.MPN}
                                  allowClear={false}
                                  treeDefaultExpandAll
                                  onChange={handleMaterialChangeMPN}
                                  getPopupContainer={(trigger) => trigger.parentNode}
                                  // className="text-select-form float-right mr-4 capgov-select"

                                  className="chart-select  mr-4">
                                  {MaterialData?.map((val1, ind1) => (
                                    <TreeNode
                                      value={`${val1.MPN + val1.lgort}`}
                                      title={`${val1.MPN}  (${val1.lgort})`}
                                      key={ind1}
                                    />
                                  ))}
                                </TreeSelect>
                              ) : (
                                ''
                              )}
                            </>
                          )}
                          <span className="NBA-Inventory-Prediction  mr-2">
                            <Checkbox className="nba-check-box" onChange={onChange}>
                              MPN
                            </Checkbox>
                          </span>
                        </span>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={14}>
                {' '}
                <MaterialWidjet Material={material_no} LGORT={LGORT} />
              </Col>
              <Col span={5}>
                {' '}
                <CapitalGovernance Material={material_no} LGORT={LGORT} />{' '}
              </Col>
              <Col span={5}>
                {' '}
                <Reminder />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <InventoryPrediction Material={material_no} LGORT={LGORT} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Inventory Material={material_no} LGORT={LGORT} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <ERTMainCard Material={material_no} LGORT={LGORT} />
              </Col>
              <Col span={12}>
                <NoOfBackOrderCard Material={material_no} LGORT={LGORT} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Harvesting Material={material_no} LGORT={LGORT} />
              </Col>
            </Row>

            {/* third row */}
            <Row>{ChatBotTogglerData ? <ChatBot /> : ''}</Row>
          </div>
          <div>
            <Footer style={{ textAlign: 'center', bottom: '0' }}>
              <span className="Footer-logo" />
            </Footer>
          </div>
        </div>
      </div>
    </>
  );
};

export default Materialreport;
