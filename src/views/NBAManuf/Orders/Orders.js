import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Chart from 'react-apexcharts';
import { Card, Modal } from 'antd';
import { ReusableSysncLoader } from '../../ReusableComponent/ReusableSysncLoader';
import { NoDataTextLoader } from '../../ReusableComponent/NoDataTextLoader';
import { calculation } from '../../Calculation';
import { getNBAManufOutStandingOrdersDD, getNBAManufOverDueDD } from '../../../actions';
import ReusableTable from '../../ReusableComponent/ReusableTable';
import { OutstandingOrderstblColumn, OverdueTblCOl } from '../../NBAOrgReport/NBAOrgTableColumn';
const OrdersChart = ({ ManufName, LGORT }) => {
  const dispatch = useDispatch();
  const getNBAManufOrdersChartData = useSelector((state) => state.getNBAManufOrdersChart);
  const getNBAManufOverDueDDData = useSelector((state) => state.getNBAManufOverDueDD);
  const getNBAManufOutStandingOrdersDDData = useSelector(
    (state) => state.getNBAManufOutStandingOrdersDD
  );
  const getNBAManufOrdersChartReducerLoader = useSelector(
    (state) => state.getNBAManufOrdersChartReducerLoader
  );
  const getNBAManufOverDueDDReducerLoader = useSelector(
    (state) => state.getNBAManufOverDueDDReducerLoader
  );
  const getNBAManufOutStandingOrdersDDReducerLoader = useSelector(
    (state) => state.getNBAManufOutStandingOrdersDDReducerLoader
  );

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
        {!getNBAManufOrdersChartReducerLoader && getNBAManufOrdersChartData.length > 0 ? (
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
                      '<span>' +
                      'Outstanding   ' +
                      '<br />' +
                      '  Orders (Capex)' +
                      ':' +
                      calculation(getNBAManufOrdersChartData[0]?.OUTSTANDINGORDERSVALUE) +
                      '</span>' +
                      '</div>'
                    );
                  } else {
                    return (
                      '<div class ="box">' +
                      '<span>' +
                      'Overdue (Capex)' +
                      ':' +
                      calculation(getNBAManufOrdersChartData[0]?.OVERDUEVALUE) +
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
                        dispatch(getNBAManufOverDueDD(ManufName, LGORT));
                      }
                    } else {
                      if (isModalVisible) {
                        setIsModalVisible(false);
                      } else {
                        setIsModalVisible(true);
                        setModalTitle('Outstanding Orders');
                        dispatch(getNBAManufOutStandingOrdersDD(ManufName, LGORT));
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
              getNBAManufOrdersChartData[0]?.OUTSTANDING_PERCENT,
              getNBAManufOrdersChartData[0]?.OVERDUE_PERCENTAGE
            ]}
            type="radialBar"
          />
        ) : (
          <div className="Nba-load-height">
            {getNBAManufOrdersChartReducerLoader ? (
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
        <>
          {modalTitle === 'OverDue' ? (
            <>
              {!getNBAManufOverDueDDReducerLoader && getNBAManufOverDueDDData.length > 0 ? (
                <>
                  <ReusableTable
                    TableData={getNBAManufOverDueDDData}
                    TableColumn={OverdueTblCOl}
                    fileName={`${ManufName}(${LGORT}) - Overdue`}
                  />
                </>
              ) : (
                <>
                  {getNBAManufOverDueDDReducerLoader ? (
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
              {!getNBAManufOutStandingOrdersDDReducerLoader &&
              getNBAManufOutStandingOrdersDDData.length > 0 ? (
                <>
                  {' '}
                  <ReusableTable
                    TableData={getNBAManufOutStandingOrdersDDData}
                    TableColumn={OutstandingOrderstblColumn}
                    fileName={`${ManufName}(${LGORT})- Outstanding Orders`}
                  />
                </>
              ) : (
                <>
                  {' '}
                  {getNBAManufOutStandingOrdersDDReducerLoader ? (
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
        </>
      </Modal>
    </>
  );
};

export default OrdersChart;
