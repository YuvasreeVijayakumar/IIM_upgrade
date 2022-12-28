import React, { useState, useEffect } from 'react';
import { Upload, Button, message, Row, Col, Form, Input, Space, Modal, TreeSelect } from 'antd';

import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import {
  ROOT_URL,
  getApproverList,
  getOrderPushPullMaterialV2,
  getApprovalStatusCount
} from '../../actions';
import axios from 'axios';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { TreeNode } = TreeSelect;

export const UploadFile = (props) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApproverList());
  }, []);

  const getApproverListData = useSelector((state) => state.getApproverList);

  const IsApproverFlag = sessionStorage.getItem('IsApprover');
  const [ApproverName, setApproverName] = useState('');
  const [Approverid, setApproverid] = useState('');
  const [ModalVissible, setModalVissible] = useState(false);
  const [fileData, setfileData] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [wrongCol, setWrongCol] = useState([]);
  const [error, seterror] = useState({});
  const FileFormat = [
    {
      Material: '1132149',
      Po: '4503853132',
      PoLine: '1',
      UpdatedDeliveryDate: '9/9/2022'
    },
    {
      Material: '1127212',
      Po: '4503839790',
      PoLine: '2',
      UpdatedDeliveryDate: '12/12/2022'
    }
  ];

  // eslint-disable-next-line no-unused-vars
  const [FormCommentError, setFormCommentError] = useState('');
  const [validFile, setvalidFile] = useState(false);
  const [Xlsxfile, setXlsxfile] = useState([]);

  const [FormComment, setFormComment] = useState('');
  function getFileFunc(file) {
    setXlsxfile(file);
  }
  function readFile(file) {
    var f = file;
    // eslint-disable-next-line no-unused-vars
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */

      setfileData(convertToJson(data));
    };
    reader.readAsBinaryString(f);
  }
  function convertToJson(csv) {
    var lines = csv.split('\n');

    var result = [];

    var headers = lines[0].split(',');

    for (var i = 1; i < lines.length - 1; i++) {
      var obj = {};
      var currentline = lines[i].split(',');

      for (var j = 0; j < headers.length; j++) {
        let datas = currentline[j].trim();

        obj[headers[j]] = datas;
      }

      result.push(obj);
    }

    let ress = result[0];
    let column = ['Material', 'Po', 'PoLine', 'UpdatedDeliveryDate'];
    const val_res = Object.keys(ress);

    if (compareArrays(val_res, column)) {
      var wrongDate = [];
      if (result) {
        result.map((d) => {
          if (moment(d.UpdatedDeliveryDate, 'MM/DD/YYYY', true).isValid() == false) {
            d.UpdatedDeliveryDate = moment(d.UpdatedDeliveryDate).format('MM-DD-YYYY');
            wrongDate.push(d.PO);
          }
        });
        message.success('validation success');
      }
    }
    // const check = JSON.parse(JSON.stringify(result), (key, value) =>
    //   value === null || value === "" ? undefined : value
    // );

    const check = JSON.stringify(result, (key, value) =>
      value === null || value === '' || value === 'Invalid date' ? undefined : value
    );

    return check;
  }

  function compareArrays(first, second) {
    var wrongData = [];
    first.map((e) => {
      if (second.includes(e) == false) {
        wrongData.push(e);
      }
    });
    setWrongCol(wrongData);
    if (wrongData.length != 0) {
      let errors = {};
      errors['filedata'] = ` column ${wrongData} is wrong`;
      seterror(errors);

      setvalidFile(true);
    } else {
      setvalidFile(false);
      return true;
    }
  }

  const props1 = {
    accept: '.xlsx',
    beforeUpload: (file) => {
      seterror('');
      if (
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        readFile(file);
        getFileFunc(file);
      } else {
        seterror(`${file.name} is not a XLSX file`);
        message.error(`${file.name} is not a XLSX file`);
      }

      return false;
    }
  };
  const HandleGetcomment = (e) => {
    setFormCommentError('');
    setFormComment(e.target.value);
  };

  const PostUploadApiCall = (v1, v2, v3, v4, v5) => {
    axios
      .post(
        `${ROOT_URL}PostPushPullBulkUpload?Approver=${v2}&SubmittedBy=${v3}&Comments=${v4}&IsApprover=${v5}&Filename=${
          sessionStorage.getItem('Username') + '_' + moment.utc().format() + '.xlsx'
        }`,
        {
          jsonFile: v1
        }
      )
      .then((res) => {
        if (res.data) {
          message.success('Bulk upload data updated successfully');
          setModalVissible(false);
          seterror('');
          setfileData('');
          setFormComment('');
          setApproverName('');
          setApproverid('');
          dispatch(
            getOrderPushPullMaterialV2(
              props.param,
              props.count,
              props.cuid,

              props.lgort,
              props.parsedBlockedDeleted
            )
          );
          dispatch(
            getApprovalStatusCount(
              props.param,
              props.cuid,

              props.lgort,
              props.parsedBlockedDeleted
            )
          );

          const formData = new FormData();
          formData.append('fileUpload', Xlsxfile);
          axios
            .post(ROOT_URL + `UploadBlob?Filename=${res.data}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((res) => {
              if (res.status == 200) {
                setXlsxfile([]);
              }
            });
        } else {
          message.error('File not Uploaded ');
        }
      })
      .catch(() => {
        message.error('Fail Not Uploaded');
      });
  };
  const exportToCSVPushPullFileFormat = () => {
    let csvData = FileFormat;
    let fileName = 'Orders Push/Pull FileFormat';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };
  const Handlevalidate = () => {
    let isValid = true;
    let errors = {};
    if (!fileData) {
      isValid = false;
      errors['filedata'] = '* File is required';
    }
    if (!FormComment) {
      isValid = false;
      errors['FormComment'] = '* comment is required';
    }
    if (IsApproverFlag != 'Y') {
      if (!ApproverName) {
        isValid = false;
        errors['ApproverName'] = '* ApproverName is required';
      }
    }
    seterror(errors);
    return isValid;
  };
  const HandleFormSubmit = () => {
    if (Handlevalidate() && !validFile) {
      PostUploadApiCall(
        fileData,
        Approverid,
        sessionStorage.getItem('loggedEmailId'),
        FormComment,
        IsApproverFlag
      );
    }
  };

  const HandleFormSubmitY = () => {
    if (Handlevalidate() && !validFile) {
      PostUploadApiCall(
        fileData,
        sessionStorage.getItem('loggedEmailId'),
        sessionStorage.getItem('loggedEmailId'),
        FormComment,
        IsApproverFlag
      );
    }
  };

  const HandleModal = () => {
    if (ModalVissible) {
      setModalVissible(false);
      seterror('');
      setfileData('');
      setFormComment('');
      setvalidFile(false);
    } else {
      setModalVissible(true);
    }
  };
  const handleApproverChange = (e) => {
    getApproverListData.map((dat) => {
      if (dat.ApproverName == e) {
        setApproverName(e);
        setApproverid(dat.ID);
      }
    });
  };
  return (
    <>
      <button size="sm" className="btn-style float-right mr-2" onClick={HandleModal}>
        {' '}
        <i className="fas fa-upload"></i>
        <span className="text-white-upload">Upload File</span>
      </button>
      <Modal
        style={{ top: 60 }}
        footer={null}
        className="Intervaltimeline"
        visible={ModalVissible}
        onCancel={HandleModal}
        width="60%"
        bodyStyle={{ padding: 0 }}
        title={
          <span>
            <i className="fas fa-upload"></i> Order Push/Pull Bulk Upload
            <span className="float-right">
              <Button
                size="sm"
                className="export-Btn ml-2 mr-3 float-right"
                onClick={(e) => exportToCSVPushPullFileFormat(e)}>
                <i className="fas fa-file-excel mr-2" />{' '}
                <span className="text-white">File Format</span>
              </Button>
            </span>
          </span>
        }
        destroyOnClose={true}>
        <Row>
          <Col span={8}></Col>
          <Col span={8} className="Custom_upload">
            <Upload {...props1} maxCount={1}>
              <button icon={<i className="fas fa-upload"></i>}>
                <i className="fas fa-upload"></i> Upload
              </button>
            </Upload>
          </Col>
          <Col span={8}></Col>
        </Row>

        <div className="upload_error">
          {validFile ? 'please check the columns' : error['filedata']}{' '}
        </div>
        <Form className="upload_form_css" layout="vertical">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              {IsApproverFlag != 'N' ? (
                <Form.Item label="Approver Name" name="Approver Name" className="label-form-text1">
                  <Input
                    prefix={<i className="fa fa-user icons-form " />}
                    type="text"
                    readOnly
                    id="supplier"
                    defaultValue={sessionStorage.getItem('Username')}
                    className="text-input-form"
                  />
                </Form.Item>
              ) : (
                <>
                  <Form.Item label="Approver" name="Approver" className="label-form-text1">
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      value={ApproverName}
                      placeholder="Please Choose Approver"
                      allowClear
                      treeDefaultExpandAll
                      onChange={handleApproverChange}
                      className="text-select-form fft">
                      {getApproverListData.map((val1, ind1) => (
                        <TreeNode value={val1.ApproverName} title={val1.ApproverName} key={ind1} />
                      ))}
                    </TreeSelect>
                  </Form.Item>
                  <span className="upload_error">{error['ApproverName']}</span>
                </>
              )}
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item label="Submitted By" name="Submitted By" className="label-form-text1">
                <Input
                  readOnly
                  prefix={<i className="fa fa-envelope icons-form1"></i>}
                  type="text"
                  id="supplier"
                  defaultValue={sessionStorage.getItem('loggedEmailId')}
                  className="text-input-form"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}></Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={12}>
              <Form.Item name="Comment" label="Comment" className="label-form-text1">
                <TextareaAutosize
                  minRows={1}
                  maxRows={6}
                  id="comment"
                  className="text-input-form cmnt-top fft ftsize"
                  onChange={(e) => HandleGetcomment(e)}
                  value={FormComment}
                />
              </Form.Item>
              <span className="upload_error">{error['FormComment']}</span>
            </Col>
            <Col xs={24} sm={24} md={6} lg={6} xl={6}></Col>
          </Row>
          <Form.Item wrapperCol={{ offset: 11, span: 16 }}>
            {IsApproverFlag != 'Y' ? (
              <Space>
                <Button type="primary" htmlType="submit" onClick={HandleFormSubmit}>
                  Submit
                </Button>
              </Space>
            ) : (
              <Space>
                <Button type="primary" htmlType="submit" onClick={HandleFormSubmitY}>
                  Submit
                </Button>
              </Space>
            )}
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
