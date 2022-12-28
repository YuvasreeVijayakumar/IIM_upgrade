import React from 'react';
import { Card, Timeline } from 'antd';

import { useSelector } from 'react-redux';
import moment from 'moment-timezone';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';

export const Reminder = () => {
  const { inv_date, LeadTime_date, Reorder_date } = useSelector(
    (state) => state.getNBAMaterialReminder
  );

  const getNBAMaterialReminderLoaderReducer = useSelector(
    (state) => state.getNBAMaterialReminderLoaderReducer
  );

  const dateformat = (cell) => {
    if (cell == 'null') {
      return <span>No Date</span>;
    } else {
      let value = moment(cell).format('MM-DD-YYYY');
      return <span>{value}</span>;
    }
  };

  return (
    <div className="card-alignment">
      <Card title="Take Action" bodyStyle={{ height: '168px' }}>
        {!getNBAMaterialReminderLoaderReducer ? (
          <Timeline className="nba-timeline" mode="right">
            <Timeline.Item label={<span>{dateformat(inv_date)}</span>}>
              <span> Inventory Exhaust </span>
            </Timeline.Item>
            <Timeline.Item label={<span>{dateformat(LeadTime_date)}</span>}>
              <span>LeadTime Till Date</span>
            </Timeline.Item>

            <Timeline.Item label={<span>{dateformat(Reorder_date)}</span>}>
              {' '}
              <span>Reorder date</span>
            </Timeline.Item>
            {/* <Timeline.Item label={<span>{dateformat(ReminderData[0]?.PUSH_PULL_DATE)}</span>}>
            {' '}
            <span>Push/Pull </span>
          </Timeline.Item> */}
          </Timeline>
        ) : (
          <ReusableSysncLoader />
        )}
      </Card>
    </div>
  );
};
