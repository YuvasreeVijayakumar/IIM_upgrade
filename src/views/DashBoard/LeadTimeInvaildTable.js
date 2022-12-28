/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { Row, Col, Popover, Button, message } from 'antd';
// import { getLeadtimeOverwriteReview } from '../../actions';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import { getLeadtimeOverwriteReview } from '../../actions';
import Axios from 'axios';
import { ROOT_URL } from '../../actions';

import filterFactory, { textFilter, dateFilter } from 'react-bootstrap-table2-filter';
import cellEditFactory, { Type } from 'react-bootstrap-table2-editor';

import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';
const pop_content = <span>Fields Are Editable</span>;

// eslint-disable-next-line no-unused-vars
var MATERIALFilter;
// eslint-disable-next-line no-unused-vars

var LeadtimeFilter;
var Comments;
var SubmittedBy;
var InvalidReason;
var LeadtimeData;

const LeadTimeInvaildTable = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.getLeadtimeOverwriteReview);
  const HandleClearTblFilter = () => {
    MATERIALFilter(''),
      LeadtimeFilter(''),
      Comments(''),
      SubmittedBy(''),
      InvalidReason(''),
      LeadtimeData('');
  };
  const [InvalidToVaildData, setInvalidToVaildData] = useState([]);
  const [InvalidToVaildSelected, setInvalidToVaildSelected] = useState([]);
  const [InvalidToVaildSelectedDelete, setInvalidToVaildSelectedDelete] = useState([]);
  const [UpdateLoading, setUpdateLoading] = useState(false);
  const [DeleteLoading, setDeleteLoading] = useState(false);
  const [Tbldata, setTbldata] = useState([]);
  useEffect(() => {
    setTbldata(data);
  }, [data]);
  const sortFuncDate = (a, b, order) => {
    if (order === 'asc') {
      return moment(a) - moment(b);
    } else if (order === 'desc') {
      return moment(b) - moment(a);
    }
  };
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
      dataField: 'NEW_LEAD_TIME',
      text: (
        <Popover content={pop_content} placement="bottom">
          <span className="='cls">
            New Lead Time <i className="fas fa-pen clss"></i>
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
      dataField: 'TILLDATE',
      text: 'Till Date',
      sortFunc: sortFuncDate,
      validator: (newValue) => {
        if (isNaN(newValue)) {
          return {
            valid: false,
            message: 'Enter a valid unit'
          };
        }
      },
      filter: dateFilter({
        getFilter: (filter) => {
          LeadtimeData = filter;
        }
      }),
      formatter: (cell) => {
        let dateObj = cell;
        if (typeof cell !== 'object') {
          dateObj = new Date(cell);
        }
        return moment(dateObj).format('MM-DD-YYYY');
      },
      editor: {
        type: Type.DATE
      },

      sort: true,

      headerStyle: { width: 190 },
      align: 'center',
      editable: false,
      headerAlign: 'center'
    },
    {
      dataField: 'SUBMITTED_BY',
      text: 'Submitted By',

      sort: true,

      headerStyle: { width: 400 },
      align: 'center',
      editable: false,
      filter: textFilter({
        getFilter: (filter) => {
          SubmittedBy = filter;
        }
      }),
      headerAlign: 'center'
    },
    {
      dataField: 'COMMENTS',
      text: 'Comments',
      editable: false,
      filter: textFilter({
        getFilter: (filter) => {
          Comments = filter;
        }
      }),

      sort: true,

      headerStyle: { width: 130 },
      align: 'center',
      headerAlign: 'center'
    },
    {
      dataField: 'Reason',
      text: 'Reason',
      editable: false,

      sort: true,

      headerStyle: { width: 250 },
      align: 'center',
      filter: textFilter({
        getFilter: (filter) => {
          InvalidReason = filter;
        }
      }),
      headerAlign: 'center'
    }
  ];
  //comment
  const onRowSelectInvalid = (row, isSelected) => {
    if (isSelected) {
      let data = row.ID;

      setInvalidToVaildSelected((prevState) => [...prevState, data]);
      setInvalidToVaildSelectedDelete((prevState) => [...prevState, row]);
    } else {
      let data = row.ID;
      let invalidData = InvalidToVaildData.filter((d) => d.ID != data);
      let invalidSelected = InvalidToVaildSelected.filter((d) => d != data);
      let invalidSelectedDelete = InvalidToVaildSelectedDelete.filter((d) => d.ID != data);
      setInvalidToVaildData(invalidData);
      setInvalidToVaildSelected(invalidSelected);
      setInvalidToVaildSelectedDelete(invalidSelectedDelete);
      setTbldata((prevstate) => {
        return prevstate.map((el) =>
          el.ID === data
            ? {
                ...el,
                MATERIAL: el.MATERIAL_TEMP,
                NEW_LEAD_TIME: el.NEW_LEAD_TIME_TEMP
              }
            : el
        );
      });
    }
  };

  const onRowSelectAllInvalid = (isSelect) => {
    if (isSelect) {
      let ID = Tbldata.map((d) => d.ID);

      setInvalidToVaildSelected(ID);
      setInvalidToVaildSelectedDelete(Tbldata);
    } else {
      setInvalidToVaildData('');
      setInvalidToVaildSelected('');
      setInvalidToVaildSelectedDelete('');
    }
  };
  const selectRowInvalid = {
    mode: 'checkbox',

    clickToEdit: true,
    selected: InvalidToVaildSelected,
    classes: 'selection-row',
    onSelect: onRowSelectInvalid,
    onSelectAll: onRowSelectAllInvalid
  };

  const PostLeadTimeBulkUpdateInvalid = (v1, v2, v3) => {
    if (v3 === 'Y') {
      setUpdateLoading(true);
    } else {
      setDeleteLoading(true);
    }
    Axios.post(`${ROOT_URL}PostLeadTimeOverwiteUpdateInvalid?SubmittedBy=${v2}&IsUpdate=${v3}`, {
      ID: v1
    })
      .then((res) => {
        if (res.data) {
          dispatch(getLeadtimeOverwriteReview(sessionStorage.getItem('loggedEmailId')));
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
  const ResetSelectedState = () => {
    setInvalidToVaildData([]);
    setInvalidToVaildSelected([]);
    setInvalidToVaildSelectedDelete([]);
  };
  const beforeSaveCell = (rooldValue, newValue, row, column, done) => {
    if (InvalidToVaildData != '') {
      let vall = InvalidToVaildData.filter((d) => d.ID != row.ID);
      vall.push(row);
      setInvalidToVaildData(vall);
    } else {
      setInvalidToVaildData([row]);
    }

    return true;
  };

  return (
    <>
      <div>
        <>
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
                  {InvalidToVaildSelectedDelete != '' ? (
                    <Button
                      id="submitt"
                      loading={DeleteLoading}
                      key="submit"
                      onClick={() =>
                        PostLeadTimeBulkUpdateInvalid(
                          InvalidToVaildSelectedDelete,
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
                  )}{' '}
                  <Button
                    className="btn-css mr-2 tbl-cancel"
                    onClick={ResetSelectedState}
                    type="primary"
                    key="back">
                    Cancel
                  </Button>
                  {InvalidToVaildData != '' ? (
                    <Button
                      id="submitt"
                      key="submit"
                      loading={UpdateLoading}
                      onClick={() =>
                        PostLeadTimeBulkUpdateInvalid(
                          InvalidToVaildData,
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
        </>
      </div>
    </>
  );
};

export default LeadTimeInvaildTable;
