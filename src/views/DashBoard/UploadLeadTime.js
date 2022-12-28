/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Row, Col, Button, Modal, Upload, message, Form, Input, Select, Space } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
// eslint-disable-next-line no-unused-vars
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import TextareaAutosize from 'react-textarea-autosize';
import { ROOT_URL, getReportForNewLeadTime } from '../../actions';
import axios from 'axios';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { Option } = Select;
export const UploadLeadTime = () => {
  const [ModalVissible, setModalVissible] = useState(false);
  const [Xlsxfile, setXlsxfile] = useState([]);
  const [fileData, setfileData] = useState('');
  const [error, seterror] = useState({});
  const [wrongCol, setWrongCol] = useState([]);
  const [validFile, setvalidFile] = useState(false);
  const [UpdateLoading, setUpdateLoading] = useState(false);
  const [textautosize, setTextAutoSize] = useState('');
  const [validTillDate, setValidTillDate] = useState('30');
  const FileFormat = [
    {
      Material: '1069013',
      NewLeadTime: '42'
    },
    {
      Material: '1101143',
      NewLeadTime: '100'
    }
  ];
  const dispatch = useDispatch();

  const funcTextAutoSize = (e) => {
    setTextAutoSize(e.target.value);
  };
  const PostUploadApiCall = (v1, v2, v3, v4) => {
    try {
      axios
        .post(
          `${ROOT_URL}PostLeadtimeOverwriteBulk?FileName=${
            sessionStorage.getItem('Username') + '_' + moment.utc().format() + '.xlsx'
          }&SubmittedBy=${v2}&Comments=${v3}&TillDate=${v4}`,
          {
            jsonFile: v1
          }
        )
        .then((res) => {
          if (res.status == 200) {
            message.success('Bulk upload data updated successfully');
            dispatch(
              getReportForNewLeadTime(
                sessionStorage.getItem('loggedcuid'),
                sessionStorage.getItem('lgort'),
                sessionStorage.getItem('colorcodedmatnr')
              )
            );
            setModalVissible(false);
            seterror('');
            setfileData('');
            setValidTillDate('');
            setTextAutoSize('');
            setUpdateLoading(false);

            const formData = new FormData();
            formData.append('fileUpload', Xlsxfile);
            axios
              .post(ROOT_URL + `PostLeadTimeOverwriteBlobUpload?Filename=${res.data}`, formData, {
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
            setUpdateLoading(false);
          }
        })
        .catch(() => {
          message.error('Fail To Upload');
          setUpdateLoading(false);
        });
    } catch (error) {
      message.error('Fail To Upload ');
      setUpdateLoading(false);
    }
  };
  function getFileFunc(file) {
    setXlsxfile(file);
  }
  function ReadFile(file) {
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
    let column = ['Material', 'NewLeadTime'];
    const val_res = Object.keys(ress);

    if (compareArrays(val_res, column)) {
      var wrongDate = [];
      if (result) {
        result.map((d) => {
          if (moment(d.Date, 'MM/DD/YYYY', true).isValid() == false) {
            d.Date = moment(d.Date).format('MM-DD-YYYY');
            wrongDate.push(d.Material);
          }
        });
        message.success('validation success');
      }
    }

    // let Nullvalidation = result.filter(
    //   (d) => d.Material != '' && d.LGORT != '' && d.OverrideQuantity != '' && d.ReasonCode != ''
    //   //  &&
    //   // d.Date != 'Invalid date'
    // );

    // const check = JSON.stringify(Nullvalidation);
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
  const HandleModal = () => {
    if (ModalVissible) {
      setModalVissible(false);
      seterror('');
      setfileData('');
      setvalidFile(false);
    } else {
      setModalVissible(true);
    }
  };
  const props1 = {
    accept: '.xlsx',
    onRemove: () => {
      let errors = {};
      errors['filedata'] = '';
      seterror(errors);
      setvalidFile(false);
      setfileData('');
      return true;
    },
    beforeUpload: (file) => {
      seterror('');
      if (
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        ReadFile(file);
        getFileFunc(file);
      } else {
        seterror(`${file.name} is not a XLSX file`);
        message.error(`${file.name} is not a XLSX file`);
      }

      return false;
    }
  };
  const handleTillDatechange = (value) => {
    setValidTillDate(value);
  };
  const Handlevalidate = () => {
    let isValid = true;
    let errors = {};
    if (!fileData) {
      isValid = false;
      errors['filedata'] = '* File is required';
    }
    if (!validTillDate) {
      isValid = false;
      errors['validTillDate'] = '* Valid Till Date is required';
    }
    if (!textautosize) {
      isValid = false;
      errors['textautosize'] = '* Comments is required';
    }

    seterror(errors);
    return isValid;
  };
  const HandleFormSubmit = () => {
    if (Handlevalidate() && !validFile) {
      setUpdateLoading(true);
      PostUploadApiCall(
        fileData,
        sessionStorage.getItem('loggedEmailId'),
        textautosize,
        validTillDate
      );
    }
  };
  const exportToCSVFileFormat = () => {
    let csvData = FileFormat;
    let fileName = 'Sample File Format For Leadtime Overwrite';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
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
        width="40%"
        bodyStyle={{ padding: 0 }}
        title={
          <span>
            <i className="fas fa-upload"></i>Leadtime Overwrite Bulk Upload
            <span className="float-right">
              <Button
                size="sm"
                className="export-Btn ml-2 mr-4 float-right"
                onClick={(e) => exportToCSVFileFormat(e)}>
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
            <Col span={12}>
              <Form.Item label="Submitted By" name="Submitted By" className="label-form-text1">
                <Input
                  readOnly
                  prefix={<i className="fa fa-envelope icons-form1"></i>}
                  type="text"
                  id="supplier"
                  defaultValue={sessionStorage.getItem('loggedEmailId')}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Valid Till Date"
                name="Valid Till Date"
                className="label-form-text1"
                required>
                <Select defaultValue="30" value={validTillDate} onChange={handleTillDatechange}>
                  <Option value="30">30</Option>
                  <Option value="60">60</Option>
                </Select>
              </Form.Item>
              <span className="upload_error">{error['validTillDate']}</span>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col span={6}></Col>
            <Col span={12}>
              <Form.Item
                label=" Comment"
                name="Comment1"
                className="label-form-text1 text-adjust"
                required>
                <TextareaAutosize
                  id="comment"
                  className="text-input-form cmnt-top ftsize"
                  minRows={1}
                  maxRows={6}
                  prefix={<i className="far fa-comments"></i>}
                  value={textautosize}
                  onChange={funcTextAutoSize}
                />
              </Form.Item>
              <span className="upload_error">{error['textautosize']}</span>
            </Col>
            <Col span={6}></Col>
          </Row>
          <Row>
            <Col span={24} className="text-center mb-3">
              <Space>
                <Button
                  loading={UpdateLoading}
                  type="primary"
                  className=" btn-css "
                  htmlType="submit"
                  onClick={HandleFormSubmit}>
                  Submit
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
