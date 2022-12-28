/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Button, Col, Popover, Row, message } from 'antd';
import { ROOT_URL, getMatnrUploadBulkInvalid } from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import filterFactory, { textFilter } from 'react-bootstrap-table2-filter';
import cellEditFactory from 'react-bootstrap-table2-editor';
import Axios from 'axios';
import moment from 'moment';
import { useSelector, useDispatch } from 'react-redux';

// eslint-disable-next-line no-unused-vars
var MATERIALFilter;
var LGORTFilter;
var LeadtimeFilter;
var SubmittedBy;
var Reason;
const pop_content = <span>Fields Are Editable</span>;
export const MaterialInvalidTable = () => {
  const dispatch = useDispatch();
  const [invalidToVaildSelected, setInvalidToVaildSelected] = useState([]);
  const [invalidToVaildData, setInvalidToVaildData] = useState([]);
  const [invalidToVaildSelectedDelete, setInvalidToVaildSelectedDelete] = useState([]);
  const [UpdateLoading, setUpdateLoading] = useState(false);
  const [DeleteLoading, setDeleteLoading] = useState(false);
  const getMatnrUploadBulkInvalidData = useSelector((state) => state.getMatnrUploadBulkInvalid);
  const [Tbldata, setTbldata] = useState([]);
  useEffect(() => {
    setTbldata(getMatnrUploadBulkInvalidData);
  }, [getMatnrUploadBulkInvalidData]);
  const InvalidCol = [
    {
      dataField: 'MATERIAL',
      text: (
        <Popover content={pop_content} placement="bottom">
          <span className="='cls">
            Material <i className="fas fa-pen clss"></i>
          </span>
        </Popover>
      ),

      sort: true,
      align: 'left',
      headerAlign: 'left',

      filter: textFilter({
        getFilter: (filter) => {
          MATERIALFilter = filter;
        },
        placeholder: 'Enter Material'
      }),
      headerStyle: { width: 125 },
      validator: (newValue) => {
        if (isNaN(newValue)) {
          return {
            valid: false,
            message: 'Enter a valid unit'
          };
        }
      }
    },

    {
      dataField: 'LEADTIME',
      text: (
        <Popover content={pop_content} placement="bottom">
          <span className="='cls">
            Lead Time <i className="fas fa-pen clss"></i>
          </span>
        </Popover>
      ),

      sort: true,

      headerStyle: { width: 190 },
      validator: (newValue) => {
        if (isNaN(newValue)) {
          return {
            valid: false,
            message: 'Enter a valid unit'
          };
        }
      },
      align: 'center',
      headerAlign: 'center',

      filter: textFilter({
        getFilter: (filter) => {
          LeadtimeFilter = filter;
        },
        placeholder: 'Enter New Lead Time'
      })
    },
    {
      dataField: 'SUBMITTED_BY',
      text: 'Submitted By',
      sort: true,
      headerStyle: { width: 300 },
      editable: false,
      align: 'left',
      headerAlign: 'left',
      filter: textFilter({
        getFilter: (filter) => {
          SubmittedBy = filter;
        }
      })
    },
    {
      dataField: 'REASON',
      text: 'Reason',
      sort: true,
      headerStyle: { width: 200 },
      editable: false,
      align: 'left',
      headerAlign: 'left',
      filter: textFilter({
        getFilter: (filter) => {
          Reason = filter;
        }
      })
    }
  ];

  const HandleClearTblFilter = () => {
    MATERIALFilter('');
    LGORTFilter('');
    LeadtimeFilter('');
    SubmittedBy('');
    Reason('');
  };

  const beforeSaveCell = (rooldValue, newValue, row, column, done) => {
    if (invalidToVaildData != '') {
      let value = invalidToVaildData.filter((d) => d.ID != row.ID);
      value.push(row);
      setInvalidToVaildData(value);
    } else {
      setInvalidToVaildData([row]);
    }
    return true;
  };

  const onRowSelectInvalid = (row, isSelected) => {
    if (isSelected) {
      let data = row.ID;
      setInvalidToVaildSelected((prev) => [...prev, data]);
      setInvalidToVaildSelectedDelete((prev) => [...prev, row]);
    } else {
      let data = row.ID;
      let dataInvalid = invalidToVaildData.filter((d) => d.ID != data);
      let selectedInvalidData = invalidToVaildSelected.filter((d) => d != data);
      let deleteData = invalidToVaildSelectedDelete.filter((v) => v.ID != data);
      setInvalidToVaildSelected(selectedInvalidData);
      setInvalidToVaildData(dataInvalid);
      setInvalidToVaildSelectedDelete(deleteData);
      setTbldata((prevstate) => {
        return prevstate.map((el) =>
          el.ID === data
            ? {
                ...el,
                MATERIAL: el.MATERIAL_TEMP,

                LEADTIME: el.LEADTIME_TEMP
              }
            : el
        );
      });
    }
  };
  const onRowSelectAllInvalid = (isSelect) => {
    if (isSelect) {
      let data = getMatnrUploadBulkInvalidData.map((d) => d.ID);
      setInvalidToVaildSelected(data);
      setInvalidToVaildSelectedDelete(getMatnrUploadBulkInvalidData);
    } else {
      setInvalidToVaildSelected([]);
      setInvalidToVaildData([]);
      setInvalidToVaildSelectedDelete([]);
    }
  };

  const ResetSelectedState = () => {
    setInvalidToVaildSelected([]);
    setInvalidToVaildData([]);
    setInvalidToVaildSelectedDelete([]);
  };
  const selectRowInvalid = {
    mode: 'checkbox',
    clickToEdit: true,
    selected: invalidToVaildSelected,
    classes: 'selection-row',
    onSelect: onRowSelectInvalid,
    onSelectAll: onRowSelectAllInvalid
  };
  const PostMatnrBulkUpdateInvalid = (v1, v2, v3) => {
    if (v3 === 'Y') {
      setUpdateLoading(true);
    } else {
      setDeleteLoading(true);
    }
    Axios.post(`${ROOT_URL}PostMatnrBulkUpdateInvalid?submittedBy=${v2}&IsUpdate=${v3}`, {
      jsonFile: v1
    })
      .then((res) => {
        if (res.data) {
          dispatch(getMatnrUploadBulkInvalid(sessionStorage.getItem('loggedEmailId')));
          setInvalidToVaildData(''),
            setInvalidToVaildSelected([]),
            setUpdateLoading(false),
            setInvalidToVaildSelectedDelete([]);
          setDeleteLoading(false);

          message.success('Data Updated Successfully');
        }
      })
      .catch(() => {
        message.error('Fail To Update');
        setUpdateLoading(false);
        setDeleteLoading(false);
      });
  };
  return (
    <div>
      <Row>
        <Col span={12}></Col>
        <Col span={12}>
          <button onClick={HandleClearTblFilter} className="ClearBtn float-right mb-2 mr-3">
            Clear Filter
          </button>
        </Col>
      </Row>

      <div className="table-color InvalidRequestOverWriteTable">
        <BootstrapTable
          keyField="ID"
          data={Tbldata}
          columns={InvalidCol}
          selectRow={selectRowInvalid}
          filterPosition="top"
          cellEdit={cellEditFactory({
            mode: 'click',
            blurToSave: true,
            autoSelectText: true,
            onStartEdit: () => {
              document.getElementsByTagName('tr').className += 'selection-row';
            },
            beforeSaveCell: beforeSaveCell
          })}
          pagination={paginationFactory()}
          noDataIndication={
            <>
              <div className="tbl-no-data-found">
                <div>
                  <h5>No data available for this criteria</h5>
                </div>
              </div>
            </>
          }
          filter={filterFactory()}
        />
        <Row>
          <Col span={24} className="mb-2 mt-2">
            <div className="float-right">
              {invalidToVaildSelectedDelete != '' ? (
                <Button
                  id="submitt"
                  loading={DeleteLoading}
                  key="submit"
                  onClick={() =>
                    PostMatnrBulkUpdateInvalid(
                      invalidToVaildSelectedDelete,
                      sessionStorage.getItem('loggedEmailId'),
                      'N'
                    )
                  }
                  className="tbl-DeleteBtn btn-css mr-2">
                  Delete
                </Button>
              ) : (
                <Button id="submitt" key="submit" className="btn-css mr-2" disabled>
                  Delete
                </Button>
              )}
              <Button
                className="btn-css mr-2 tbl-cancel"
                onClick={ResetSelectedState}
                type="primary"
                key="back">
                Cancel
              </Button>
              {invalidToVaildData != '' ? (
                <Button
                  id="submitt"
                  key="submit"
                  loading={UpdateLoading}
                  onClick={() =>
                    PostMatnrBulkUpdateInvalid(
                      invalidToVaildData,
                      sessionStorage.getItem('loggedEmailId'),
                      'Y'
                    )
                  }
                  className="tbl-Update btn-css mr-2">
                  Update
                </Button>
              ) : (
                <Button id="submitt" key="submit" className="btn-css mr-2" disabled>
                  Update
                </Button>
              )}
            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};
