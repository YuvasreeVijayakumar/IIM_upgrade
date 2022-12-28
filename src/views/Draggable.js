/**
 * Table columns set dynamically.
 */
import React, { useState, useRef } from 'react';
import { Modal, Transfer, Row, Space, Button } from 'antd';
import styled from 'styled-components';
import { MenuOutlined } from '@ant-design/icons';
import { DndProvider, useDrop, useDrag } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import { ROOT_URL, getEOQTbl, EoqTblLoader, getPredictedOrderQuantityColumns } from '../actions';
import { useDispatch } from 'react-redux';

const ItemWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  > .label {
    display: inline-block;
    max-width: calc(100% - 20px);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  &.drop-over-downward {
    border-bottom: 2px dashed #1890ff;
  }
  &.drop-over-upward {
    border-top: 2px dashed #1890ff;
  }
`;

export const TableColSettings = ({
  onClose = () => void 0,
  onSuccess = () => void 0,
  fieldColumns,
  parsedFilterSettingsLGORT,
  parsedBlockedDeleted,

  defaultColumns,
  showColumns,
  // eslint-disable-next-line no-unused-vars
  setShowColumns
}) => {
  const dispatch = useDispatch();

  const [targetKeys, setTargetKeys] = useState(showColumns.map((it) => it.name));

  // handle changed
  const onChange = (nextTargetKeys) => {
    setTargetKeys(Array.from(new Set(nextTargetKeys)));
  };

  // handle submit
  const onOk = () => {
    let mapping = {};
    const columns = fieldColumns.filter((col) => new Set(targetKeys).has(col.name));

    columns.forEach((col) => {
      mapping[col.name] = col.label;
    });
    let finalColumns = targetKeys.map((tar) => ({
      name: tar,
      label: mapping[tar]
    }));
    if (!finalColumns.length) {
      finalColumns = defaultColumns;
    }
    let col = finalColumns.map((d) => d.label);
    sessionStorage.setItem('eoqcol', col);

    let theme = localStorage.getItem('theme');
    let bot = sessionStorage.getItem('chatbot');
    let data_ = sessionStorage.getItem('FilterSetting');
    let usrcuid_one = sessionStorage.getItem('loggedcuid');
    let matList = sessionStorage.getItem('MaterialList');
    let manufList = sessionStorage.getItem('ManufacturerList');
    let orglist = sessionStorage.getItem('OrganizationList');

    axios({
      url:
        ROOT_URL +
        'SaveImpersonationDetails?Usercuid=' +
        usrcuid_one +
        '&Impcuid=' +
        'all' +
        '&FilterSetting= ' +
        data_ +
        '&SaveMode=' +
        'y' +
        '&Theme=' +
        theme +
        '&Chatbot=' +
        bot +
        '&EOQColumns=' +
        col,
      method: 'post',
      data: {
        MaterialList: matList === 'ALL' ? 'ALL' : matList.split(','),
        ManufacturerList: manufList === 'ALL' ? 'ALL' : manufList.split(','),
        OrganizationList: orglist === 'ALL' ? 'ALL' : orglist.split(',')
      }
    }).then((res) => {
      if (res.status == 200) {
        dispatch(
          getEOQTbl(
            sessionStorage.getItem('loggedcuid'),

            parsedFilterSettingsLGORT,
            sessionStorage.getItem('loggedcuid'),
            parsedBlockedDeleted
          )
        );
        dispatch(EoqTblLoader(true));
        dispatch(getPredictedOrderQuantityColumns());
      }
    });
    onClose();
    onSuccess();
  };

  // handle reset
  const reset = () => {
    const finalKeys = defaultColumns.map((it) => it.name);
    setTargetKeys(finalKeys);
  };

  // change order
  const moveRow = async (dragIndex, hoverIndex) => {
    const clonedList = targetKeys;
    const el = clonedList.splice(dragIndex, 1)[0];
    clonedList.splice(hoverIndex, 0, el);
    onChange(clonedList);
  };

  return (
    <div>
      <Modal
        width="55%"
        visible={true}
        className="tbl-col-settings"
        title="Table Columns Settings"
        onCancel={onClose}
        footer={
          <Row justify="space-between">
            <Button type="link" onClick={reset}>
              Reset
            </Button>
            <Space size="middle">
              <Button className="oncancel" onClick={onClose}>
                Cancel
              </Button>
              <Button className="onok" type="primary" onClick={onOk}>
                Ok
              </Button>
            </Space>
          </Row>
        }>
        <DndProvider backend={HTML5Backend}>
          <Transfer
            rowKey={(record) => record.name}
            listStyle={{ flex: 1 }}
            dataSource={fieldColumns}
            operations={['  Add', 'Remove']}
            render={(it) => (
              <DraggableItem
                index={targetKeys.findIndex((key) => key === it.name)}
                label={it.label}
                moveRow={moveRow}
              />
            )}
            titles={['Avaliable columns', 'Show these columns in this order']}
            targetKeys={targetKeys}
            onChange={onChange}
          />
        </DndProvider>
      </Modal>
    </div>
  );
};

const type = 'DraggableItem';

const DraggableItem = ({ index, label, moveRow }) => {
  const ref = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: (monitor) => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ` drop-over-downward` : ` drop-over-upward`
      };
    },
    drop: (item) => {
      moveRow(item.index, index);
    }
  });

  // eslint-disable-next-line no-unused-vars
  const [{ isDragging }, drag, preview] = useDrag({
    type,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  preview(drop(ref));

  return (
    <ItemWrapper key={label} ref={ref} className={`${isOver ? dropClassName : ''}`}>
      <span className="label">{label}</span>
      {index !== -1 && (
        <span ref={drag}>
          <MenuOutlined />
        </span>
      )}
    </ItemWrapper>
  );
};
