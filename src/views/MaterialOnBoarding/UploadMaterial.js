import React, { useState } from 'react';
import { Upload, Button, message, Row, Col, Form, Input, Modal } from 'antd';
import moment from 'moment';
import * as FileSaver from 'file-saver';
import { useDispatch } from 'react-redux';
import * as XLSX from 'xlsx';
import { ROOT_URL, getMatnrBulkUploadOverview } from '../../actions';
import axios from 'axios';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

export const UploadMaterial = () => {
  const dispatch = useDispatch();
  const [ModalVissible, setModalVissible] = useState(false);
  const [fileData, setfileData] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [wrongCol, setWrongCol] = useState([]);
  const [error, seterror] = useState({});
  const [SubmitLoadng, setSubmitLoadng] = useState(false);
  const FileFormat = [
    {
      MATERIAL: '1378603',

      LEADTIME: '78'
    },
    {
      MATERIAL: '1478344',

      LEADTIME: '20'
    }
  ];

  // eslint-disable-next-line no-unused-vars
  const [FormCommentError, setFormCommentError] = useState('');
  const [validFile, setvalidFile] = useState(false);
  const [Xlsxfile, setXlsxfile] = useState([]);
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
    let column = ['MATERIAL', 'LEADTIME'];
    const val_res = Object.keys(ress);

    if (compareArrays(val_res, column)) {
      if (result) {
        message.success('validation success');
      }
    }

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
        readFile(file);
        getFileFunc(file);
      } else {
        seterror(`${file.name} is not a XLSX file`);
        message.error(`${file.name} is not a XLSX file`);
      }

      return false;
    }
  };

  const PostUploadApiCall = (v1, v2) => {
    setSubmitLoadng(true);
    axios
      .post(
        `${ROOT_URL}PostMatnrBulkUpload?submittedBy=${v2}&FileName=${
          sessionStorage.getItem('Username') + '_' + moment.utc().format() + '.xlsx'
        }`,
        {
          jsonFile: v1
        }
      )
      .then((res) => {
        if (res.status === 200) {
          message.success('Material Bulk upload data updated successfully');
          setModalVissible(false);
          seterror('');
          setfileData('');
          setSubmitLoadng(false);

          const formData = new FormData();
          formData.append('fileUpload', Xlsxfile);
          axios
            .post(ROOT_URL + `MatnrBulkUploadBlob?filename=${res.data}`, formData, {
              headers: {
                'Content-Type': 'multipart/form-data'
              }
            })
            .then((res) => {
              if (res.status == 200) {
                setXlsxfile([]);
                dispatch(getMatnrBulkUploadOverview(sessionStorage.getItem('loggedEmailId')));
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
    let fileName = 'Material Onboard FileFormat';
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

    seterror(errors);
    return isValid;
  };
  const HandleFormSubmit = () => {
    if (Handlevalidate() && !validFile) {
      PostUploadApiCall(fileData, sessionStorage.getItem('loggedEmailId'));
    }
  };

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
        width="40%"
        bodyStyle={{ padding: 0 }}
        title={
          <span>
            <i className="fas fa-upload"></i>Material Onboard
            <span className="float-right">
              <Button
                size="sm"
                className="export-Btn ml-2 mr-4 float-right"
                onClick={(e) => exportToCSVPushPullFileFormat(e)}>
                <i className="fas fa-file-excel mr-3" />{' '}
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
            <Col span={24}>
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
