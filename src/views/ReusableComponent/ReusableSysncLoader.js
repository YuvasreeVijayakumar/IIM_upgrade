import React from 'react';
import SyncLoader from 'react-spinners/SyncLoader';

export const ReusableSysncLoader = () => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)'
  };
  return (
    <div style={style}>
      <SyncLoader size={10} color="#fff" />
    </div>
  );
};
