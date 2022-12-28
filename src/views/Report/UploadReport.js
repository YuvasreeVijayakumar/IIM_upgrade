import React, { useState } from 'react';
import { Upload, Button, message, Row, Col, Form, Input, Modal } from 'antd';

import moment from 'moment';

import { useDispatch } from 'react-redux';
import TextareaAutosize from 'react-textarea-autosize';
import { ROOT_URL, getBoCriticalityReportApproverReview } from '../../actions';
import axios from 'axios';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const UploadReport = () => {
  const dispatch = useDispatch();

  const [ModalVissible, setModalVissible] = useState(false);
  const [fileData, setfileData] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [wrongCol, setWrongCol] = useState([]);
  const [error, seterror] = useState({});
  const [SubmitLoadng, setSubmitLoadng] = useState(false);
  const FileFormat = [
    {
      PO: '4503849709',
      PoLine: '2',
      MPN: 'CSMN-CL3110',
      Quantity: '507',
      EstimatedDeliveryDate: '10/20/2022'
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
    let column = ['PO', 'PoLine', 'MPN', 'Quantity', 'EstimatedDeliveryDate'];
    const val_res = Object.keys(ress);

    if (compareArrays(val_res, column)) {
      var wrongDate = [];
      if (result) {
        result.map((d) => {
          if (moment(d.EstimatedDeliveryDate, 'MM/DD/YYYY', true).isValid() == false) {
            d.EstimatedDeliveryDate = moment(d.EstimatedDeliveryDate).format('MM-DD-YYYY');
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

  const PostUploadApiCall = (v1, v2, v3) => {
    setSubmitLoadng(true);
    axios
      .post(
        `${ROOT_URL}PostBoCriticalityReport?SubmittedBy=${v2}&Comments=${v3}&FileName=${
          sessionStorage.getItem('Username') + '_' + moment.utc().format() + '.xlsx'
        }`,
        {
          jsonFile: v1
        }
      )
      .then((res) => {
        if (res.status === 200) {
          message.success('Bulk upload data updated successfully');
          setModalVissible(false);
          seterror('');
          setfileData('');
          setFormComment('');
          setSubmitLoadng(false);
          dispatch(
            getBoCriticalityReportApproverReview(
              'all',
              'all',
              sessionStorage.getItem('loggedEmailId')
            )
          );

          const formData = new FormData();
          formData.append('fileUpload', Xlsxfile);
          axios
            .post(ROOT_URL + `BoCriticalityReportUploadBlob?Filename=${res.data}`, formData, {
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
          message.error('Fail To Upload ');
          setSubmitLoadng(false);
        }
      })
      .catch(() => {
        message.error('Fail To Upload');
        setSubmitLoadng(false);
      });
  };
  const exportToCSVPushPullFileFormat = () => {
    let csvData = FileFormat;
    let fileName = 'Backorder criticality report FileFormat';
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

    seterror(errors);
    return isValid;
  };
  const HandleFormSubmit = () => {
    if (Handlevalidate() && !validFile) {
      PostUploadApiCall(
        fileData,

        sessionStorage.getItem('loggedEmailId'),
        FormComment
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

  return (
    <>
      <button size="sm" className="btn-style mr-2" onClick={HandleModal}>
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
            <i className="fas fa-upload"></i> Report Upload
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
            <Col xs={24} sm={24} md={14} lg={14} xl={14}>
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

            <Col xs={24} sm={24} md={10} lg={10} xl={10}>
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
          </Row>
          <Row>
            <Col span={24} className="text-center">
              <Button
                type="primary"
                htmlType="submit"
                className="btn-css"
                onClick={HandleFormSubmit}
                loading={SubmitLoadng}>
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
