import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Modal, Row, Tabs } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getTopTrendingMatsDD, getTopTrendingMatsPieChart } from '../../../actions';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { TopTrendingMatColumns } from './TopMovingColumns';
import ReusableInfoModal from '../../ReusableComponent/ReusableInfoModal ';

import Chart from 'react-apexcharts';

const { TabPane } = Tabs;

export const TopmovingMaterial = () => {
  const dispatch = useDispatch();
  const [ModalVisible, setModalVisible] = useState(false);
  const [activekey, setActivekey] = useState('1');

  const getTopTrendingMatsData = useSelector((state) => state.getTopTrendingMatsDD);
  const { Count, PieValue, PieKey, PieNum } = useSelector(
    (state) => state.getTopTrendingMatsPieChart
  );

  const getTopTrendingMatsDDReducerLoader = useSelector(
    (state) => state.getTopTrendingMatsDDReducerLoader
  );

  const getTopTrendingMatsPieChartReducerLoader = useSelector(
    (state) => state.getTopTrendingMatsPieChartReducerLoader
  );

  const handleModal = () => {
    setModalVisible(false);
  };
  const tabChange = (key) => {
    if (key == 1) {
      setActivekey('1');
      dispatch(getTopTrendingMatsDD('TrendingUp'));
    } else if (key == 2) {
      setActivekey('2');
      dispatch(getTopTrendingMatsDD('TrendingDown'));
    } else if (key == 3) {
      setActivekey('3');
      dispatch(getTopTrendingMatsDD('Non-moving'));
    }
  };
  useEffect(() => {
    dispatch(getTopTrendingMatsPieChart());
  }, []);

  return (
    <>
      <Card className="parts-wid  prl wid-card-height-kpi" size="small">
        <Row>
          <p className="kpi-w1">
            <i className="fad fa-analytics"></i> Top Trending Materials
            <span className="ml-2">
              <ReusableInfoModal
                title={'Top Trending Materials'}
                width="40%"
                content={
                  <>
                    <p>
                      <ul className="ml-3">
                        <li>
                          The material consumption is analyzed over the last 12 months to calculate
                          the trend.
                        </li>
                        <li className="pt-2">
                          We take into account the backorders, and do not analyze the materials
                          which have very irregular consumption (more than 60% of the data having no
                          consumption).
                        </li>
                      </ul>
                    </p>
                  </>
                }
              />
            </span>
          </p>
          {!getTopTrendingMatsPieChartReducerLoader && PieValue != undefined ? (
            <>
              {' '}
              <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                <p className="kpi-this-month">Total Materials </p>
                <p className="kpi-series">{Count}</p>
                <p className="kpi-this-month"></p>
                <Button
                  type="primary"
                  onClick={() => {
                    setModalVisible(true);
                    setActivekey('1');
                    dispatch(getTopTrendingMatsDD('TrendingUp'));
                  }}>
                  <span className="kpi-btn">
                    View more &nbsp;<i className="fas fa-arrow-right"></i>
                  </span>
                </Button>
              </Col>
              <Col span={12} className="kpi-chart">
                <>
                  {' '}
                  <Chart
                    options={{
                      legend: {
                        show: false
                      },
                      tooltip: {
                        style: {
                          fontSize: '12px',
                          padding: '7px'
                        },
                        custom: function ({ series, seriesIndex }) {
                          return (
                            '<div class="arrow_box moving-tooltip">' +
                            '<span>' +
                            PieKey[seriesIndex] +
                            ':' +
                            (series[seriesIndex].toFixed(1) + '%' + '</span>') +
                            '</div>'
                          );
                        }
                      },

                      responsive: [
                        {
                          breakpoint: 480,
                          options: {
                            legend: {
                              show: false
                            }
                          }
                        }
                      ],
                      plotOptions: {
                        pie: {
                          donut: {
                            size: '50%'
                          },
                          dataLabels: {
                            offset: 20,
                            minAngleToShowLabel: 12,
                            style: {
                              fontSize: '10px',
                              fontFamily: 'Helvetica, Arial, sans-serif'
                            }
                          }
                        }
                      },
                      stroke: { show: false, colors: ['#666'], width: 4 },
                      colors: ['#007ED6', '#60B99F', '#FF7300', '#DC143C'],

                      labels: PieKey
                    }}
                    height={180}
                    width="100%"
                    series={PieNum}
                    type="donut"
                  />
                </>
              </Col>
            </>
          ) : (
            <>
              <ReusableSysncLoader />
            </>
          )}
        </Row>
      </Card>
      <Modal
        width="80%"
        title={
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <span className="float-left mr-2 cls">
                <i className="fad fa-analytics pr-2"></i>
              </span>
              <span className="tab-head">Top Trending Materials</span>
            </Col>
          </Row>
        }
        className="modal-turnover"
        visible={ModalVisible}
        onCancel={handleModal}
        footer={null}
        destroyOnClose={true}>
        <Tabs defaultActiveKey={'1'} activeKey={activekey} onChange={tabChange}>
          <TabPane tab="Trending Up" key="1">
            {!getTopTrendingMatsDDReducerLoader && getTopTrendingMatsData.length > 0 ? (
              <>
                <ReusableTable
                  TableData={getTopTrendingMatsData}
                  TableColumn={TopTrendingMatColumns}
                  fileName={'Trending Up - Top Trending Materials'}
                />
              </>
            ) : (
              <div style={{ height: '400px' }}>
                {' '}
                {getTopTrendingMatsDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
              </div>
            )}
          </TabPane>
          <TabPane tab="Trending Down" key="2">
            {!getTopTrendingMatsDDReducerLoader && getTopTrendingMatsData.length > 0 ? (
              <>
                <ReusableTable
                  TableData={getTopTrendingMatsData}
                  TableColumn={TopTrendingMatColumns}
                  fileName={'Trending Down - Top Trending Materials'}
                />
              </>
            ) : (
              <div style={{ height: '400px' }}>
                {' '}
                {getTopTrendingMatsDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
              </div>
            )}
          </TabPane>
          <TabPane tab="Non Moving" key="3">
            {!getTopTrendingMatsDDReducerLoader && getTopTrendingMatsData.length > 0 ? (
              <>
                <ReusableTable
                  TableData={getTopTrendingMatsData}
                  TableColumn={TopTrendingMatColumns}
                  fileName={'Non Moving - Top Trending Materials'}
                />
              </>
            ) : (
              <div style={{ height: '400px' }}>
                {' '}
                {getTopTrendingMatsDDReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
              </div>
            )}
          </TabPane>
        </Tabs>
      </Modal>
    </>
  );
};
