import React, { useState, useEffect } from 'react';
import {
  Upload,
  Button,
  message,
  Row,
  Col,
  Form,
  Input,
  Space,
  Modal,
  TreeSelect,
  Spin
} from 'antd';

import moment from 'moment';

import { useSelector, useDispatch } from 'react-redux';

import {
  ROOT_URL,
  getForecastOverrideApproverList,
  getSampleFileFormatForecastOverride,
  getForecastOverrideOverview,
  getForecastOverrideStatusCount
} from '../../actions';
import axios from 'axios';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { TreeNode } = TreeSelect;

export const UploadForecast = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getForecastOverrideApproverList());
  }, []);

  const getApproverListApiData = useSelector((state) => state.getForecastOverrideApproverList);
  // eslint-disable-next-line no-unused-vars
  const getSampleFileFormatForecastOverrideData = useSelector(
    (state) => state.getSampleFileFormatForecastOverride
  );

  const [getApproverListData, setgetApproverListData] = useState([]);
  const ForecastOverrideApprover = sessionStorage.getItem('ForecastOverrideApprover');
  const [ApproverName, setApproverName] = useState('');
  const [Approverid, setApproverid] = useState('');
  const [ModalVissible, setModalVissible] = useState(false);
  const [fileData, setfileData] = useState('');
  const [UpdateLoading, setUpdateLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [wrongCol, setWrongCol] = useState([]);
  const [error, seterror] = useState({});
  useEffect(() => {
    if (getApproverListApiData.length > 0) {
      setgetApproverListData(getApproverListApiData);
    }
  }, [getApproverListApiData]);
  const FileFormat = [
    {
      Material: '1132149',
      LGORT: '1000',
      Date: '9/9/2022',
      OverwriteQuantity: '111',
      ReasonCode: 'Material replaced',
      Comment: 'Testing'
    },
    {
      Material: '1132149',
      LGORT: '1000',
      Date: '7/9/2022',
      OverwriteQuantity: '2345',
      ReasonCode: 'Material replaced',
      Comment: 'Testing'
    }
  ];

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

    let checking = headers.map((d) => {
      let data = moment(d).isValid() ? moment(d).format('YYYY-MM-DD') : d;
      return data;
    });

    for (var i = 1; i < lines.length - 1; i++) {
      var obj = {};
      var currentline = lines[i].split(',');

      for (var j = 0; j < checking.length; j++) {
        let datas = currentline[j].trim();

        obj[checking[j]] = datas;
      }

      result.push(obj);
    }

    return result;
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

  const PostUploadApiCall = (v1, v2, v3, v4) => {
    try {
      axios
        .post(
          `${ROOT_URL}PostForecastOverrideBulkUploadSample?Approver=${v2}&SubmittedBy=${v3}&IsApprover=${v4}&Filename=${
            sessionStorage.getItem('Username') + '_' + moment.utc().format() + '.xlsx'
          }`,
          {
            jsonFile: v1
          }
        )
        .then((res) => {
          if (res.status == 200) {
            message.success('Bulk upload data updated successfully');
            setModalVissible(false);
            seterror('');
            setfileData('');
            setUpdateLoading(false);

            setApproverName('');
            setApproverid('');
            dispatch(
              getForecastOverrideOverview(
                sessionStorage.getItem('loggedcuid'),
                'all',

                sessionStorage.getItem('lgort'),
                sessionStorage.getItem('colorcodedmatnr')
              )
            );
            dispatch(
              getForecastOverrideStatusCount(
                sessionStorage.getItem('loggedcuid'),
                sessionStorage.getItem('lgort'),
                sessionStorage.getItem('colorcodedmatnr')
              )
            );

            const formData = new FormData();
            formData.append('fileUpload', Xlsxfile);
            axios
              .post(ROOT_URL + `ForecastOverrideUploadBlob?Filename=${res.data}`, formData, {
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
            message.error('Fail To Upload');
            setUpdateLoading(false);
          }
        })
        .catch((err) => {
          message.error(err.response.data);
          setUpdateLoading(false);
        });
    } catch (error) {
      message.error('Fail To Upload ');
      setUpdateLoading(false);
    }
  };
  // eslint-disable-next-line no-unused-vars
  const exportToCSVPushPullFileFormat = () => {
    let csvData = FileFormat;
    let fileName = 'Sample File Format For Forecast Overwrite';
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

    if (ForecastOverrideApprover != 'Y') {
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
      setUpdateLoading(true);
      PostUploadApiCall(
        fileData,
        Approverid,
        sessionStorage.getItem('loggedEmailId'),
        ForecastOverrideApprover
      );
    }
  };

  const HandleFormSubmitY = () => {
    if (Handlevalidate() && !validFile) {
      setUpdateLoading(true);
      PostUploadApiCall(
        fileData,
        sessionStorage.getItem('loggedEmailId'),
        sessionStorage.getItem('loggedEmailId'),
        ForecastOverrideApprover
      );
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
      dispatch(getSampleFileFormatForecastOverride());
    }
  };
  const handleApproverChange = (e) => {
    getApproverListData.map((dat) => {
      if (dat.FULLNAME == e) {
        setApproverName(e);
        setApproverid(dat.ID);
      }
    });
  };
  return (
    <>
      <button size="sm" className="btn-style float-right mr-4" onClick={HandleModal}>
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
            <i className="fas fa-upload"></i> Forecast Overwrite Bulk Upload
            <span className="float-right">
              <Button
                size="sm"
                className="export-Btn ml-2 mr-4 float-right"
                // onClick={(e) => exportToCSVPushPullFileFormat(e)}
                onClick={<a>{getSampleFileFormatForecastOverrideData}</a>}>
                <i className="fas fa-file-excel mr-2" />{' '}
                <a href={getSampleFileFormatForecastOverrideData}>
                  {' '}
                  <span className="text-white">File Format</span>
                </a>
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
            <Col xs={24} sm={24} md={10} lg={10} xl={10}>
              {ForecastOverrideApprover != 'N' ? (
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
                      notFoundContent={
                        <span className="pt-5 pb-5">
                          <span style={{ paddingLeft: '33%' }}>
                            <Spin style={{ color: '#fff' }} size="large" tip="Loading..."></Spin>
                          </span>
                        </span>
                      }
                      onChange={handleApproverChange}
                      className="text-select-form fft">
                      {getApproverListData.length > 0 ? (
                        <>
                          {' '}
                          {getApproverListData.map((val1, ind1) => (
                            <TreeNode value={val1.FULLNAME} title={val1.FULLNAME} key={ind1} />
                          ))}
                        </>
                      ) : (
                        <></>
                      )}
                    </TreeSelect>
                  </Form.Item>
                  <span className="upload_error">{error['ApproverName']}</span>
                </>
              )}
            </Col>
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
          </Row>
          <Row>
            <Col span={24} className="text-center">
              {ForecastOverrideApprover != 'Y' ? (
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
              ) : (
                <Space>
                  <Button
                    loading={UpdateLoading}
                    type="primary"
                    className=" btn-css "
                    htmlType="submit"
                    onClick={HandleFormSubmitY}>
                    Submit
                  </Button>
                </Space>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};
