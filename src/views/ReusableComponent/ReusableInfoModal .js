import React, { useState } from 'react';
import { Modal, Popover } from 'antd';
const ReusableInfoModal = ({ title, width, content }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  return (
    <>
      <Popover placement="right" content={<span>Info</span>}>
        <i
          className="fas fa-info-circle info-logo-widget mr-2"
          onClick={() => {
            setIsModalVisible(true);
          }}
        />
      </Popover>

      <Modal
        title={title}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={width}
        destroyOnClose
        height="auto">
        {content}
      </Modal>
    </>
  );
};

export default ReusableInfoModal;
