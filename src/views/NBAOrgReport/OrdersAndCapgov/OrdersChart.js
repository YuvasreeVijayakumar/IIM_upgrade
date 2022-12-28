import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Chart from 'react-apexcharts';
import { Card, Modal } from 'antd';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { getNBAOrgoverdueDD, getNBAOrgOutstandingOrdersDD } from '../../../actions';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { OutstandingOrderstblColumn, OverdueTblCOl } from '../NBAOrgTableColumn';
import { calculation } from '../../Calculation';

const OrdersChart = (props) => {
  const dispatch = useDispatch();
  const getNBAOrgOrdersChartData = useSelector((state) => state.getNBAOrgOrdersChart);
  const getNBAOrgOrdersChartLoaderReducer = useSelector(
    (state) => state.getNBAOrgOrdersChartLoaderReducer
  );
  const TblDataOutstanding = useSelector((state) => state.getNBAOrgOutstandingOrdersDD);
  const getNBAOrgOutstandingOrdersDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgOutstandingOrdersDDLoaderReducer
  );
  const getNBAOrgoverdueDDLoaderReducer = useSelector(
    (state) => state.getNBAOrgoverdueDDLoaderReducer
  );
  const tblDDData = useSelector((state) => state.getNBAOrgoverdueDD);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const handleCancel = () => {
    setIsModalVisible(false);
    setModalTitle('');
  };
  return (
    <>
      <Card
        bodyStyle={{ height: 170 }}
        title={
          <span>
            <i className="fas fa-chart-pie-alt mr-2"></i>
            Orders
          </span>
        }>
        {/* {!getNBAOrgOrdersChartLoaderReducer && getNBAOrgOrdersChartData.length > 0 ? (
          <Chart
            options={{
              legend: {
                show: true
              },
              tooltip: {
                // eslint-disable-next-line no-unused-vars
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  if (seriesIndex == 0) {
                    return (
                      '<div class ="box">' +
                      // '<span>' +
                      // 'OverDue ' +
                      // ':' +
                      // getNBAOrgOrdersChartData[0]?.OVERDUE_PERCENTAGE +
                      // '%' +
                      // '</span>' +
                      // '<br />' +
                      '<span>' +
                      'Overdue (Capex)' +
                      ':' +
                      calculation(getNBAOrgOrdersChartData[0]?.OVERDUEVALUE) +
                      '</span>' +
                      '</div>'
                    );
                  } else {
                    return (
                      '<div class ="box">' +
                      // '<span>' +
                      // 'Outstanding Orders ' +
                      // ':' +
                      // getNBAOrgOrdersChartData[0]?.OUTSTANDING_PERCENT +
                      // '%' +
                      // '</span>' +
                      // '<br />' +
                      // '<span>' +
                      'Outstanding   ' +
                      '<br />' +
                      '  Orders (Capex)' +
                      ':' +
                      calculation(getNBAOrgOrdersChartData[0]?.OUTSTANDINGORDERSVALUE) +
                      '</span>' +
                      '</div>'
                    );
                  }
                }
              },
              chart: {
                events: {
                  dataPointSelection: (event, chartContext, config) => {
                    if (config.w.config.labels[config.dataPointIndex] === 'OverDue') {
                      if (isModalVisible) {
                        setIsModalVisible(false);
                      } else {
                        setIsModalVisible(true);
                        setModalTitle('OverDue');
                        dispatch(getWidgetDDData('SuppOverDueDD', 'all', props.org, props.LGORT));
                      }
                    } else {
                      if (isModalVisible) {
                        setIsModalVisible(false);
                      } else {
                        setIsModalVisible(true);
                        setModalTitle('Outstanding Orders');
                        dispatch(
                          getWidgetDDData('SuppOutstandingDD', 'all', props.org, props.LGORT)
                        );
                      }
                    }
                  }
                }
              },
              responsive: [
                {
                  breakpoint: 600,
                  options: {
                    chart: {
                      width: '100%',
                      height: 200
                    },
                    legend: {
                      show: true
                    }
                  }
                },
                {
                  breakpoint: 480,
                  options: {
                    chart: {
                      width: '100%'
                    },
                    legend: {
                      position: 'bottom'
                    }
                  }
                }
              ],
              stroke: {
                show: true,
                curve: 'smooth',
                lineCap: 'butt',
                colors: undefined,
                width: 2,
                dashArray: 0
              },

              labels: ['OverDue', 'Outstanding Orders']
            }}
            height={150}
            series={[
              getNBAOrgOrdersChartData[0]?.OVERDUE_PERCENTAGE,
              getNBAOrgOrdersChartData[0]?.OUTSTANDING_PERCENT
            ]}
            type="donut"
          />
        ) : (
          <div className="Nba-load-height">
            {getNBAOrgOrdersChartLoaderReducer ? (
              <>
                {' '}
                <ReusableSysncLoader />
              </>
            ) : (
              <NoDataTextLoader />
            )}
          </div>
        )} */}

        {!getNBAOrgOrdersChartLoaderReducer && getNBAOrgOrdersChartData.length > 0 ? (
          <Chart
            options={{
              legend: {
                show: true,
                floating: true,
                fontSize: '16px',
                position: 'right',
                offsetX: 0,
                offsetY: 10,
                labels: {
                  useSeriesColors: true
                },
                itemMargin: {
                  horizontal: 1
                }
              },
              tooltip: {
                enabled: true,
                // eslint-disable-next-line no-unused-vars
                custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                  if (seriesIndex == 0) {
                    return (
                      '<div class ="box">' +
                      // '<span>' +
                      // 'Outstanding Orders ' +
                      // ':' +
                      // getNBAOrgOrdersChartData[0]?.OUTSTANDING_PERCENT +
                      // '%' +
                      // '</span>' +
                      // '<br />' +
                      // '<span>' +
                      'Outstanding   ' +
                      '<br />' +
                      '  Orders (Capex)' +
                      ':' +
                      calculation(getNBAOrgOrdersChartData[0]?.OUTSTANDINGORDERSVALUE) +
                      '</span>' +
                      '</div>'
                    );
                  } else {
                    return (
                      '<div class ="box">' +
                      // '<span>' +
                      // 'OverDue ' +
                      // ':' +
                      // getNBAOrgOrdersChartData[0]?.OVERDUE_PERCENTAGE +
                      // '%' +
                      // '</span>' +
                      // '<br />' +
                      '<span>' +
                      'Overdue (Capex)' +
                      ':' +
                      calculation(getNBAOrgOrdersChartData[0]?.OVERDUEVALUE) +
                      '</span>' +
                      '</div>'
                    );
                  }
                }
              },
              chart: {
                events: {
                  dataPointSelection: (event, chartContext, config) => {
                    if (config.w.config.labels[config.dataPointIndex] === 'OverDue') {
                      if (isModalVisible) {
                        setIsModalVisible(false);
                      } else {
                        setIsModalVisible(true);
                        setModalTitle('OverDue');
                        dispatch(getNBAOrgoverdueDD(props.org, props.LGORT));
                      }
                    } else {
                      if (isModalVisible) {
                        setIsModalVisible(false);
                      } else {
                        setIsModalVisible(true);
                        setModalTitle('Outstanding Orders');
                        dispatch(getNBAOrgOutstandingOrdersDD(props.org, props.LGORT));
                      }
                    }
                  }
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
                radialBar: {
                  offsetY: -20,
                  offsetX: -100,
                  startAngle: 0,
                  endAngle: 360,
                  track: {
                    background: '#525655'
                  },
                  hollow: {
                    margin: 20,
                    size: '20%',
                    background: 'transparent'
                  },
                  dataLabels: {
                    show: true,
                    name: {
                      show: false
                    },
                    value: {
                      show: true,
                      fontSize: '13px',
                      color: '#fff',
                      offsetY: 5
                    },
                    total: {
                      show: true,
                      label: 'Total',
                      // formatter function goes here
                      formatter: function (w) {
                        return `${w.config.series[1]}%`;
                      }
                    }
                  }
                }
              },
              colors: ['#bf8e35', '#05a3ff'],
              labels: ['Outstanding Orders', 'OverDue']
            }}
            height={200}
            series={[
              getNBAOrgOrdersChartData[0]?.OUTSTANDING_PERCENT,
              getNBAOrgOrdersChartData[0]?.OVERDUE_PERCENTAGE
            ]}
            type="radialBar"
          />
        ) : (
          <div className="Nba-load-height">
            {getNBAOrgOrdersChartLoaderReducer ? (
              <>
                {' '}
                <ReusableSysncLoader />
              </>
            ) : (
              <NoDataTextLoader />
            )}
          </div>
        )}
      </Card>
      <Modal
        title={modalTitle}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width="90%"
        destroyOnClose
        height="auto">
        {modalTitle === 'OverDue' ? (
          <>
            {' '}
            {!getNBAOrgoverdueDDLoaderReducer && tblDDData.length > 0 ? (
              <>
                {' '}
                <ReusableTable
                  TableData={tblDDData}
                  TableColumn={OverdueTblCOl}
                  fileName={`${props.org}(${props.LGORT}) - Overdue`}
                />
              </>
            ) : (
              <>
                {getNBAOrgoverdueDDLoaderReducer ? (
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
            {!getNBAOrgOutstandingOrdersDDLoaderReducer && TblDataOutstanding.length > 0 ? (
              <>
                {' '}
                <ReusableTable
                  TableData={TblDataOutstanding}
                  TableColumn={OutstandingOrderstblColumn}
                  fileName={`${props.org}(${props.LGORT}) - Outstanding Orders`}
                />
              </>
            ) : (
              <>
                {' '}
                {getNBAOrgOutstandingOrdersDDLoaderReducer ? (
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
        )}
      </Modal>
    </>
  );
};

export default OrdersChart;
