import React from 'react';
import Chart from 'react-apexcharts';

export const PieChartOrdersToReview = () => {
  return (
    <Chart
      options={{
        legend: {
          show: true
        },
        responsive: [
          {
            breakpoint: 600,
            options: {
              chart: {
                width: '100%',
                height: 250
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
        labels: ['Open Po', 'Open Harvest Qty', 'Orders in Pipeline']
      }}
      height={280}
      series={[44, 55, 13]}
      type="donut"
    />
  );
};
