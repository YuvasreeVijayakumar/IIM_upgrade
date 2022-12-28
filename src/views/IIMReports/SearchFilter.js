import React, { useState, useEffect } from 'react';
import { Button, message, Modal, Row, Col, Badge } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import cellEditFactory from 'react-bootstrap-table2-editor';
import { useDispatch, useSelector } from 'react-redux';
// eslint-disable-next-line no-unused-vars
import { getBulkExportColValues, UpdateSearchValue } from '../../actions';
import { SelectSearch } from './PopupFilter/SelectSearch';
import { MultiSelectSearch } from './PopupFilter/MultiSelectSearch';

export const SearchFilter = (props) => {
  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Count, setCount] = useState(1);
  const [AvailableCount, setAvailableCount] = useState(0);

  const [Data, setData] = useState([{ id: 0, Column_Name: '', Value: '' }]);
  const formatWithIcon = (cell) => {
    if (cell != '') {
      return <span>{cell}</span>;
    } else {
      return (
        <span className="advanceFilter">
          <i className="fad fa-edit pr-2"></i> Select Column
        </span>
      );
    }
  };
  const formatWithIconval = (cell) => {
    if (cell != '') {
      return <span>{cell}</span>;
    } else {
      return (
        <span className="advanceFilter">
          <i className="fad fa-edit pr-2"></i> Select Value
        </span>
      );
    }
  };
  const UpdateSearchValueData = useSelector((state) => state.UpdateSearchValue.SearchValue);
  useEffect(() => {
    if (UpdateSearchValueData.length > 0) {
      setData(UpdateSearchValueData);
    }
  }, [isModalOpen]);
  const columns = [
    {
      dataField: 'Column_Name',
      text: 'Column Name',
      formatter: formatWithIcon,
      headerStyle: { width: 150 },
      align: 'center',
      headerAlign: 'center',
      // eslint-disable-next-line no-unused-vars
      editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
        <SelectSearch {...editorProps} value={value} column={column} />
      ),
      // eslint-disable-next-line no-unused-vars
      validator: (newValue, row, column) => {
        let validate = Data.filter((d) => d.Column_Name == newValue);

        if (newValue.length > 0 && validate.length > 0) {
          return {
            valid: false,
            message: 'Column Name already exist'
          };
        }
        return true;
      }
    },

    {
      dataField: 'Value',
      text: 'Value',
      headerStyle: { width: 250 },
      align: 'center',
      formatter: formatWithIconval,
      headerAlign: 'center',
      // eslint-disable-next-line no-unused-vars
      editorRenderer: (editorProps, value, row, column, rowIndex, columnIndex) => (
        <MultiSelectSearch
          {...editorProps}
          value={value}
          column={column}
          row={row}
          view={props.view}
        />
      )
    },
    {
      text: 'Action',
      dataField: '',
      headerStyle: { width: 100 },
      align: 'center',
      headerAlign: 'center',

      editable: false,
      formatter: (cell, row) => (
        <div className="text-center">
          <i className="fad fa-trash-alt btn-export-delete" onClick={() => HandleDelete(row)}></i>
        </div>
      )
    }
  ];
  const AddNewRow = () => {
    const validation = Data.every((item) => item.Column_Name != '' && item.Value != '');
    if (validation) {
      setData([...Data, { id: Count, Column_Name: '', Value: '' }]);
      setCount(Count + 1);
    } else {
      message.warning('Please select Column Name and Value');
    }
  };
  const HandleDelete = (row) => {
    setData((d) => d.filter((a) => a.id != row.id));
  };

  function beforeSaveCell(oldValue, newValue, row, column) {
    if (newValue.length > 0) {
      if (column.dataField === 'Column_Name') {
        let validation = Data.every((item) => item.Column_Name != '' && item.Value != '');
        if (validation) {
          // dispatch(getBulkExportColValues(props.view, newValue));
          return '';
        }
      }
    } else {
      console.log('invalid', column);
    }
  }
  const resetSelected = () => {
    setIsModalOpen(false);
    setData([{ id: 0, Column_Name: '', Value: '' }]);
    setCount(1);
    setAvailableCount(0);
    dispatch(UpdateSearchValue([]));
    props.onSearch([]);
    message.success('Filter Cleared');
  };
  function afterSaveCell(oldValue, newValue, row, column) {
    if (newValue.length > 0) {
      if (column.dataField === 'Column_Name') {
        let validation = Data.every((item) => item.Column_Name != '' && item.Value != '');

        const newState = Data.map((obj) => {
          if (obj.id === row.id) {
            if (row.Value != '') {
              if (validation) {
                // dispatch(getBulkExportColValues(props.view, newValue));
                return { ...obj, Column_Name: newValue, Value: '' };
              } else {
                message.warning('Please fill the Columns');

                // dispatch(getBulkExportColValues(props.view, oldValue));
                return { ...obj, Column_Name: oldValue };
              }
            } else {
              // dispatch(getBulkExportColValues(props.view, newValue));
              return { ...obj, Column_Name: newValue };
            }
          }

          return obj;
        });
        setData(newState);
      } else {
        const newState = Data.map((obj) => {
          if (obj.id === row.id) {
            return { ...obj, Value: newValue };
          }

          return obj;
        });
        setData(newState);
      }
    } else {
      console.log('invalid', column);
    }
  }
  const showModal = () => {
    setIsModalOpen(!isModalOpen);
  };
  const HandleApply = () => {
    if (Data.length > 0) {
      let checkArray = Data.every((d) => {
        if (d.Column_Name === '' && d.Value === '') {
          message.error('please fill The Column Name and Value');
          return false;
        } else if (d.Column_Name === '') {
          message.error('please select the Column Name field');
          return false;
        } else if (d.Value === '') {
          message.error('please select the Value field');
          return false;
        } else {
          return true;
        }
      });
      if (checkArray) {
        let countCheck = Data.filter((m) => m.Column_Name.length && m.Value.length);
        setCount(countCheck.length);

        dispatch(UpdateSearchValue(Data));
        props.onSearch(Data);
        setAvailableCount(Data.length);
        setIsModalOpen(false);
      }
    } else {
      setData([{ id: 0, Column_Name: '', Value: '' }]);
      setCount(1);
      setAvailableCount(0);
      setIsModalOpen(false);
    }
  };
  return (
    <div>
      <Badge count={AvailableCount}>
        <i
          className="fas fa-filter bulk-export"
          style={{ color: 'white' }}
          onClick={() => showModal()}></i>
      </Badge>
      <Modal
        destroyOnClose={true}
        width="55%"
        style={{ top: 60 }}
        footer={null}
        title={
          <span>
            {' '}
            <i className="fas fa-filter pr-1 "></i>Advanced Filter
          </span>
        }
        visible={isModalOpen}
        onCancel={() => showModal()}>
        <Row>
          <Col span={24}>
            <div className="float-right mb-2">
              <Button className="sm-btn-css rpt-cancel   mr-2" size="small" onClick={resetSelected}>
                Reset
              </Button>
              <Button size="small" className="add-row" onClick={AddNewRow}>
                Add Filter
              </Button>
            </div>{' '}
          </Col>
          <Col span={24} className="report-advanced-filter">
            <BootstrapTable
              keyField="id"
              data={Data}
              columns={columns}
              cellEdit={cellEditFactory({
                mode: 'click',
                blurToSave: true,
                afterSaveCell,

                beforeSaveCell
              })}
            />
          </Col>
        </Row>

        <Row>
          <Col span={24}>
            <Button
              size="small"
              className="sm-btn-css rpt-apply float-right mr-2"
              onClick={() => HandleApply()}>
              Apply
            </Button>
          </Col>
        </Row>
      </Modal>
    </div>
  );
};
