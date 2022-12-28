import React, { useState } from 'react';
import { Card, Carousel } from 'antd';
import { useSelector } from 'react-redux';
import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';

export const Announcement = () => {
  // eslint-disable-next-line no-unused-vars
  const [dotPosition, setDotPosition] = useState('bottom');
  const getNBAAnnouncementsData = useSelector((state) => state.getNBAAnnouncements);
  const getNBAAnnouncementsLoaderReducer = useSelector(
    (state) => state.getNBAAnnouncementsLoaderReducer
  );
  const contentStyle = {
    height: '100px',
    color: '#fff',
    lineHeight: '100px',
    textAlign: 'center',
    background: '#172f79'
  };
  return (
    <div className="card-alignment">
      <Card bodyStyle={{ height: '143px' }}>
        {!getNBAAnnouncementsLoaderReducer ? (
          <>
            <span className="head-cls">Announcement</span>{' '}
            <Carousel dotPosition={dotPosition} autoplay>
              {getNBAAnnouncementsData?.map((d, id) => {
                return (
                  <div key={id}>
                    <div className="icon-text-alignment" style={contentStyle}>
                      <p className="p-alignment">
                        {' '}
                        <i className="far fa-bullhorn icon-color" /> &nbsp; &nbsp;{d.flag}
                      </p>
                    </div>
                  </div>
                );
              })}
            </Carousel>
          </>
        ) : (
          <ReusableSysncLoader />
        )}
      </Card>
    </div>
  );
};
