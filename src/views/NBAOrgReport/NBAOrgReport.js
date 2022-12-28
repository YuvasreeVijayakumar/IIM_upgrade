import React, { useEffect, useState } from 'react';
import { Layout, Row, Col, Card, TreeSelect } from 'antd';
import { NBAOrgKpi } from './KPI/NBAOrgKpi';
import {
  getNBAMaterialReportDD,
  getTurnOverRateOrgMonthwise,
  getNBAOrgDetails,
  getNBAOrgOrdersChart,
  getNBATrendAnalysis,
  getNBAOrgCapGovRequest,
  getNBAOrgTotalHarvest,
  getNBAOrgOpenHarvest,
  getNBAOrgAnnouncements,
  getCapGovMaterialReport,
  getCapGovInfoForMaterial,
  getNBAOrgCapGovChart
} from '../../actions';
import { useDispatch, useSelector } from 'react-redux';
import { OrgMiniCards } from './OrgMiniCards/OrgMiniCards';
import OrdersChart from './OrdersAndCapgov/OrdersChart';
import { TrendAnalysis } from './TrendAnalysis/TrendAnalysis';
import { OrgCapgov } from './OrdersAndCapgov/Capgov';
import { Announcement } from './Harvesting/Announcement';
import ChatBot from '../DashBoard/ChatBot';
const { Footer } = Layout;
const { TreeNode } = TreeSelect;

const NBAOrgReport = () => {
  const dispatch = useDispatch();
  const [OrganizationName, setOrganizationName] = useState('Access');
  const [LGORT, setLGORT] = useState('1000');
  const ChatBotTogglerData = useSelector((state) => state.ChatBotToggler.ChatBotToggler);
  useEffect(() => {
    dispatch(getNBAMaterialReportDD('Organization'));
    dispatch(getNBAOrgDetails(OrganizationName, LGORT));
    dispatch(getNBAOrgOrdersChart(OrganizationName, LGORT));
    dispatch(getNBATrendAnalysis(OrganizationName, LGORT, 'capextrend'));
    dispatch(getNBAOrgCapGovRequest(OrganizationName, LGORT));
    dispatch(getNBAOrgTotalHarvest(OrganizationName, LGORT));
    dispatch(getNBAOrgOpenHarvest(OrganizationName, LGORT));
    dispatch(getNBAOrgAnnouncements(OrganizationName, LGORT));
    dispatch(getNBAOrgCapGovChart(OrganizationName, LGORT));
    dispatch(
      getCapGovMaterialReport(
        OrganizationName,
        'all',
        OrganizationName,
        LGORT,
        'ALL',
        'ORGANIZATION'
      )
    );
    dispatch(
      getCapGovInfoForMaterial(
        OrganizationName,
        'all',
        OrganizationName,
        LGORT,
        'ALL',
        'ORGANIZATION'
      )
    );
  }, []);
  const OrganizationData = useSelector((state) => state.getNBAMaterialReportDD);
  const handleMaterialChange = (e) => {
    setOrganizationName(e.slice(0, -4));
    setLGORT(e.slice(-4));
    dispatch(getTurnOverRateOrgMonthwise(e.slice(0, -4), e.slice(-4)));
    dispatch(getNBAOrgDetails(e.slice(0, -4), e.slice(-4)));
    dispatch(getNBAOrgOrdersChart(e.slice(0, -4), e.slice(-4)));
    dispatch(getNBATrendAnalysis(e.slice(0, -4), e.slice(-4), 'capextrend'));
    dispatch(getNBAOrgCapGovRequest(e.slice(0, -4), e.slice(-4)));
    dispatch(getNBAOrgTotalHarvest(e.slice(0, -4), e.slice(-4)));
    dispatch(getNBAOrgOpenHarvest(e.slice(0, -4), e.slice(-4)));
    dispatch(getNBAOrgAnnouncements(e.slice(0, -4), e.slice(-4)));
    dispatch(getNBAOrgCapGovChart(e.slice(0, -4), e.slice(-4)));
    dispatch(
      getCapGovMaterialReport(
        e.slice(0, -4),
        'all',
        e.slice(0, -4),
        e.slice(-4),
        'ALL',
        'ORGANIZATION'
      )
    );
    dispatch(
      getCapGovInfoForMaterial(
        e.slice(0, -4),
        'all',
        e.slice(0, -4),
        e.slice(-4),
        'ALL',
        'ORGANIZATION'
      )
    );
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
                          <i className="fad fa-sitemap mr-2" /> Organization 360&#176; view&nbsp; -{' '}
                          {OrganizationName} ({LGORT})
                        </span>
                        <span className="float-right mr-4">
                          <span className="font-18"> Search : &nbsp;&nbsp;</span>

                          {OrganizationData.length > 0 ? (
                            <TreeSelect
                              showSearch
                              style={{ width: '250px', fontSize: 16, color: 'white' }}
                              value={OrganizationName}
                              // placeholder={defaultValueDD[0]?.MATNR}
                              allowClear={false}
                              treeDefaultExpandAll
                              onChange={handleMaterialChange}
                              getPopupContainer={(trigger) => trigger.parentNode}
                              // className="text-select-form float-right mr-4 capgov-select"

                              className="chart-select float-right mr-4">
                              {OrganizationData?.map((val1, ind1) => (
                                <TreeNode
                                  value={`${val1.organization + val1.lgort}`}
                                  title={`${val1.organization}  (${val1.lgort})`}
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
                <OrgMiniCards org={OrganizationName} LGORT={LGORT} />
              </Col>
              <Col span={8}>
                <Announcement org={OrganizationName} LGORT={LGORT} />
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={8}>
                <Row gutter={16}>
                  <Col span={24}>
                    <OrdersChart org={OrganizationName} LGORT={LGORT} />
                  </Col>
                  <Col span={24}>
                    <OrgCapgov org={OrganizationName} LGORT={LGORT} />
                  </Col>
                </Row>
              </Col>
              <Col span={16}>
                <NBAOrgKpi OrgName={OrganizationName} LGORT={LGORT} />
              </Col>
            </Row>

            <Row gutter={[16, 16]}>
              <Col span={24}>
                <TrendAnalysis org={OrganizationName} LGORT={LGORT} />
              </Col>
            </Row>
            <Row>{ChatBotTogglerData ? <ChatBot /> : ''}</Row>
            <div>
              <Footer style={{ textAlign: 'center', bottom: '0' }}>
                <span className="Footer-logo" />
              </Footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NBAOrgReport;
