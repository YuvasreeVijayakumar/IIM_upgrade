import React, { useEffect, useState } from 'react';
import { Row, Col, Card, TreeSelect, Layout } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import {
  getNBAMaterialReportDD,
  getTurnOverRateManufMonthwise,
  getNBAManufacturerWidget2,
  getNBAManufacturerWidget1,
  getNBAManufCapGovGraph,
  getNBAManufCapGovPercent,
  getNBAManufCapGovRequest,
  getNBAManufCapGovPlots,
  getNBAManufBackorders,
  getNBAManufAwaitingRepairs,
  getNBAManufOrdersChart,
  getNBAManufTrendAnalysis,
  getNBAManufAnnouncements
} from '../../actions';
import NBAManufKPI from './KPI/NBAManufKPI';
import MiniCards from './MiniCards';
import CapgovWid from './Capgov/CapgovWid';
import ChatBot from '../DashBoard/ChatBot';

import OrdersChart from './Orders/Orders';
import { TrendAnalysis } from './TrendAnalysis/TrendAnalysis';
import Annouancement from './Annouancement/Annouancement';
const { TreeNode } = TreeSelect;
const { Footer } = Layout;

const NBAManufReport = () => {
  const [Manuf_name, setManuf_name] = useState('CIENA CORP');
  const [LGORT, setLGORT] = useState('1000');
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getNBAMaterialReportDD('Manufacturer'));
    dispatch(getTurnOverRateManufMonthwise(Manuf_name, LGORT));
    dispatch(getNBAManufacturerWidget2(Manuf_name, LGORT));
    dispatch(getNBAManufacturerWidget1(Manuf_name, LGORT));
    dispatch(getNBAManufCapGovGraph(Manuf_name, LGORT));
    dispatch(getNBAManufCapGovPercent(Manuf_name, LGORT));
    dispatch(getNBAManufCapGovRequest(Manuf_name, LGORT));
    dispatch(getNBAManufCapGovPlots(Manuf_name, LGORT));
    dispatch(getNBAManufBackorders(Manuf_name, LGORT));
    dispatch(getNBAManufAwaitingRepairs(Manuf_name, LGORT));
    dispatch(getNBAManufOrdersChart(Manuf_name, LGORT));
    dispatch(getNBAManufTrendAnalysis(Manuf_name, LGORT, 'CAPEX_TREND'));
    dispatch(getNBAManufAnnouncements(Manuf_name, LGORT));
  }, []);

  const handleMaterialChange = (e) => {
    getNBAMaterialReportDDData.map((d) => {
      if (d.MANUFLGORT === e) {
        setLGORT(d.LGORT);
        setManuf_name(d.MANUF_NAME);
        dispatch(getTurnOverRateManufMonthwise(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufacturerWidget2(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufacturerWidget1(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufCapGovGraph(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufCapGovPercent(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufCapGovRequest(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufCapGovPlots(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufBackorders(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufAwaitingRepairs(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(getNBAManufOrdersChart(encodeURIComponent(d.MANUF_NAME), d.LGORT));
        dispatch(
          getNBAManufTrendAnalysis(encodeURIComponent(d.MANUF_NAME), d.LGORT, 'CAPEX_TREND')
        );
        dispatch(getNBAManufAnnouncements(encodeURIComponent(d.MANUF_NAME), d.LGORT));
      }
    });
  };
  const ChatBotTogglerData = useSelector((state) => state.ChatBotToggler.ChatBotToggler);
  const getNBAMaterialReportDDData = useSelector((state) => state.getNBAMaterialReportDD);

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
                          <i className="fad fa-sitemap mr-2" /> Manufacturer 360&#176; view&nbsp; -{' '}
                          {Manuf_name}
                          {'  '}({LGORT})
                        </span>
                        <span className="float-right mr-4">
                          <span className="font-18"> Search : &nbsp;&nbsp;</span>

                          {getNBAMaterialReportDDData.length > 0 ? (
                            <TreeSelect
                              showSearch
                              style={{ width: '300px', fontSize: 16, color: 'white' }}
                              value={Manuf_name}
                              // placeholder={defaultValueDD[0]?.MATNR}
                              allowClear={false}
                              treeDefaultExpandAll
                              onChange={handleMaterialChange}
                              getPopupContainer={(trigger) => trigger.parentNode}
                              // className="text-select-form float-right mr-4 capgov-select"

                              className="chart-select float-right mr-4">
                              {getNBAMaterialReportDDData?.map((val1, ind1) => (
                                <TreeNode
                                  value={`${val1.MANUF_NAME + val1.LGORT}`}
                                  title={`${val1.MANUF_NAME}  (${val1.LGORT})`}
                                  key={ind1}
                                />
                              ))}
                            </TreeSelect>
                          ) : (
                            ''
                          )}
                        </span>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </div>
            <Row gutter={[16, 16]}>
              <Col span={16}>
                <MiniCards ManufName={Manuf_name} LGORT={LGORT} />
              </Col>
              <Col span={8}>
                {' '}
                <Annouancement ManufName={Manuf_name} LGORT={LGORT} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <OrdersChart ManufName={Manuf_name} LGORT={LGORT} />
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <CapgovWid ManufName={Manuf_name} LGORT={LGORT} />
                  </Col>
                </Row>
              </Col>
              <Col span={16}>
                <NBAManufKPI ManufName={Manuf_name} LGORT={LGORT} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                {' '}
                <TrendAnalysis ManufName={Manuf_name} LGORT={LGORT} />
              </Col>
            </Row>
          </div>
          <Row>{ChatBotTogglerData ? <ChatBot /> : ''}</Row>
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

export default NBAManufReport;
