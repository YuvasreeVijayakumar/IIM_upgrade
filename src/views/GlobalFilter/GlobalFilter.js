import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Drawer,
  Row,
  Col,
  Switch,
  Button,
  Checkbox,
  Radio,
  Space,
  message,
  Popover,
  Modal,
  Upload,
  Avatar,
  Select,
  Badge
} from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { ROOT_URL, getUserImpersonationDetails, getMaterialManufFilterList } from '../../actions';
import Axios from 'axios';
import { isEmpty } from 'lodash';

const { Option } = Select;

const CheckboxGroup = Checkbox.Group;

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

const FileFormat = [
  {
    Material: '1069013'
  },
  {
    Material: '1101143'
  }
];

const GlobalFilter = () => {
  const dispatch = useDispatch();

  // eslint-disable-next-line no-unused-vars
  const [Org, setOrg] = useState('ALL');

  // eslint-disable-next-line no-unused-vars
  const [LGORT, setLGORT] = useState('ALL');
  // eslint-disable-next-line no-unused-vars
  const [Indicator, setIndicator] = useState('ALL');
  const [ApplyCloseLoading, setApplyCloseLoading] = useState(false);
  const [checkedList, setCheckedList] = useState([]);
  const [TempcheckedList, setTempCheckedList] = useState([]);
  const [OrgCount, setOrgCount] = useState(0);
  const [lgortCheckList, setlgortCheckList] = useState('ALL');
  const [BlockedDeletedList, setBlockedDeletedList] = useState('ALL');

  const [Usercuid, setUsercuid] = useState('');
  const [MaterialCount, setMaterialCount] = useState(0);
  const [ManufCount, setManufCount] = useState(0);
  const [showDrawer, setshowDrawer] = useState(false);
  const [SaveMode, setSaveMode] = useState(true);
  const [disabledFilter, setdisabledFilter] = useState(true);
  const [filterApplied, setFilterApplied] = useState(false);

  const lgortParams = ['1000', 'CPEQ'];
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenName, setIsModalOpenName] = useState('');

  const [fileData, setfileData] = useState([]);
  const [TempfileData, setTempfileData] = useState([]);
  const [ManufSelectData, setManufSelectData] = useState([]);
  const [TempManufSelectData, setTempManufSelectData] = useState([]);

  const [plainOptions, setplainOptions] = useState([]);
  const [MaterialOption, setMaterialOption] = useState([]);

  const getUserImpersonationDetailsData = useSelector((state) => state.getUserImpersonationDetails);
  const getOrganizationListData = useSelector((state) => state.getOrganizationList);
  const getMaterialFilterData = useSelector((state) => state.getMaterialFilter);
  const getMaterialManufFilterListData = useSelector((state) => state.getMaterialManufFilterList);

  const filterAppliedLength =
    fileData.length > 0 ||
    ManufSelectData.length > 0 ||
    checkedList.length > 0 ||
    lgortCheckList != 'ALL' ||
    BlockedDeletedList != 'ALL'
      ? true
      : false;

  useEffect(() => {
    if (isEmpty(getMaterialManufFilterListData) != true) {
      let material_List = getMaterialManufFilterListData?.Table.map((d) => d.MATERIAL);
      let manuf_List = getMaterialManufFilterListData?.Table1.map((d) => d.MANUFACTURER);
      let org_List = getMaterialManufFilterListData?.Table2.map((d) => d.ORGANIZATION);
      let filterSetting = getMaterialManufFilterListData?.Table3.map((d) => d.filterSetting);
      let LGORTListUpdate = JSON.parse(filterSetting)[0].LGORT;
      let BlockedDeletedListUpdate = JSON.parse(filterSetting)[0].BlockedDeleted;

      const fill =
        (material_List.length > 0 && !material_List.includes('ALL')) ||
        (manuf_List.length > 0 && !manuf_List.includes('ALL')) ||
        (org_List.length > 0 && !org_List.includes('ALL')) ||
        LGORTListUpdate != 'ALL' ||
        BlockedDeletedListUpdate != 'ALL'
          ? true
          : false;
      setFilterApplied(fill);

      if (SaveMode) {
        // let filterSetting = getMaterialManufFilterListData?.Table3.map((d) => d.filterSetting);
        // let LGORTListUpdate = JSON.parse(filterSetting)[0].LGORT;
        // let BlockedDeletedListUpdate = JSON.parse(filterSetting)[0].BlockedDeleted;
        setlgortCheckList(LGORTListUpdate);
        setBlockedDeletedList(BlockedDeletedListUpdate);
      } else {
        setlgortCheckList('ALL');
        setBlockedDeletedList('ALL');
      }

      sessionStorage.setItem('MaterialList', material_List);
      sessionStorage.setItem('ManufacturerList', manuf_List);
      sessionStorage.setItem('OrganizationList', org_List);

      //material
      if (material_List.length === 1) {
        if (material_List.includes('ALL')) {
          setfileData([]);
          setTempfileData([]);
          setMaterialCount(0);
        } else {
          setfileData(material_List);
          setTempfileData(material_List);
          setMaterialCount(parseInt(material_List.length));
        }
      } else {
        setfileData(material_List);
        setTempfileData(material_List);
        setMaterialCount(parseInt(material_List.length));
      }
      //manufacturer
      if (manuf_List.length === 1) {
        if (manuf_List.includes('ALL')) {
          setManufSelectData([]);
          setTempManufSelectData([]);
          setManufCount(0);
        } else {
          setManufSelectData(manuf_List);
          setTempManufSelectData(manuf_List);
          setManufCount(parseInt(manuf_List.length));
        }
      } else {
        setManufSelectData(manuf_List);
        setTempManufSelectData(manuf_List);
        setManufCount(parseInt(manuf_List.length));
      }
      //organization

      if (org_List.length === 1) {
        if (org_List.includes('ALL')) {
          setCheckedList([]);
          setTempCheckedList([]);
          setOrgCount(0);
        } else {
          setCheckedList(org_List);
          setTempCheckedList(org_List);
          setOrgCount(parseInt(org_List.length));
        }
      } else {
        setCheckedList(org_List);
        setTempCheckedList(org_List);
        setOrgCount(parseInt(org_List.length));
      }
    }
  }, [getMaterialManufFilterListData]);

  useEffect(() => {
    if (isEmpty(getMaterialFilterData) != true) {
      setMaterialOption(getMaterialFilterData);
    }
  }, [getMaterialFilterData]);

  useEffect(() => {
    if (isEmpty(getOrganizationListData) != true) {
      setplainOptions(getOrganizationListData);
    }
  }, [getOrganizationListData]);

  useEffect(() => {
    if (getUserImpersonationDetailsData.length > 0) {
      let data = JSON.parse(getUserImpersonationDetailsData[0].FilterSetting);

      setLGORT(data[0].LGORT);
      setOrg(data[0].Organization);
      setIndicator(data[0].BlockedDeleted);

      setlgortCheckList(data[0].LGORT);
      setBlockedDeletedList(data[0].BlockedDeleted);
      setUsercuid(getUserImpersonationDetailsData.map((data) => data.loggedcuid));

      let savemodeApiRes = getUserImpersonationDetailsData[0].SaveMode === 'N' ? false : true;
      setSaveMode(savemodeApiRes);

      setdisabledFilter(false);
    }
  }, [getUserImpersonationDetailsData]);

  const onLgortCheckAll = (e) => {
    setlgortCheckList(e.target.checked ? lgortParams : []);
  };
  const onLgortCheckBox = (list) => {
    setlgortCheckList(list);
  };

  const blockedDeletedCheckBox = (e) => {
    setBlockedDeletedList(e.target.value);
  };

  const DrawerClose = () => {
    if (lgortCheckList.length == 0 || BlockedDeletedList.length == 0) {
      setshowDrawer(true);
    } else {
      setshowDrawer(false);
    }
  };

  const HandleDrawerOpen = () => {
    dispatch(getMaterialManufFilterList(Usercuid));
    let data = JSON.parse(getUserImpersonationDetailsData[0].FilterSetting);

    setLGORT(data[0].LGORT);
    setOrg(data[0].Organization);
    setIndicator(data[0].BlockedDeleted);

    setlgortCheckList(data[0].LGORT);
    setBlockedDeletedList(data[0].BlockedDeleted);
    setUsercuid(getUserImpersonationDetailsData.map((data) => data.loggedcuid));
    let savemodeApiRes = getUserImpersonationDetailsData[0].SaveMode === 'N' ? false : true;
    if (!savemodeApiRes) {
      message.info('Filter is Turned Off. Please Turn on to apply filter');
    }
    setSaveMode(savemodeApiRes);
    if (isEmpty(getMaterialManufFilterListData) != true) {
      let material_List = getMaterialManufFilterListData?.Table.map((d) => d.MATERIAL);
      let manuf_List = getMaterialManufFilterListData?.Table1.map((d) => d.MANUFACTURER);
      let org_List = getMaterialManufFilterListData?.Table2.map((d) => d.ORGANIZATION);

      //material
      if (material_List.length === 1) {
        if (material_List.includes('ALL')) {
          setfileData([]);
          setTempfileData([]);
          setMaterialCount(0);
        } else {
          setfileData(material_List);
          setTempfileData(material_List);
          setMaterialCount(parseInt(material_List.length));
        }
      } else {
        setfileData(material_List);
        setTempfileData(material_List);
        setMaterialCount(parseInt(material_List.length));
      }
      //manufacturer
      if (manuf_List.length === 1) {
        if (manuf_List.includes('ALL')) {
          setManufSelectData([]);
          setTempManufSelectData([]);
          setManufCount(0);
        } else {
          setManufSelectData(manuf_List);
          setTempManufSelectData(manuf_List);
          setManufCount(parseInt(manuf_List.length));
        }
      } else {
        setManufSelectData(manuf_List);
        setTempManufSelectData(manuf_List);
        setManufCount(parseInt(manuf_List.length));
      }

      //organization

      if (org_List.length === 1) {
        if (org_List.includes('ALL')) {
          setCheckedList([]);
          setTempCheckedList([]);
          setOrgCount(0);
        } else {
          setCheckedList(org_List);
          setTempCheckedList(org_List);
          setOrgCount(parseInt(org_List.length));
        }
      } else {
        setCheckedList(org_List);
        setTempCheckedList(org_List);
        setOrgCount(parseInt(org_List.length));
      }
    }

    setshowDrawer(true);
  };

  const toggleDrawer = () => {
    setdisabledFilter(true);

    setFilterApplied(filterAppliedLength);

    GlobalFIlterPostApi(
      checkedList.length === 0 ? 'ALL' : checkedList,
      lgortCheckList.length === lgortParams.length ? 'ALL' : lgortCheckList,
      BlockedDeletedList,
      Usercuid,
      SaveMode ? 'Y' : 'N',
      fileData.length === 0 ? 'ALL' : fileData,
      ManufSelectData.length === 0 ? 'ALL' : ManufSelectData
    );

    setshowDrawer(false);
  };

  const confirmTotalReset = () => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to Reset?',
      onOk: () => {
        setLGORT('ALL');
        setOrg('ALL');
        setIndicator('ALL');
        setCheckedList([]);
        setTempCheckedList([]);
        setOrgCount(0);
        setlgortCheckList('ALL');
        setBlockedDeletedList('ALL');
        setfileData([]);
        setTempfileData([]);
        setMaterialCount(0);
        setManufSelectData([]);
        setTempManufSelectData([]);
        setdisabledFilter(true);
        setFilterApplied(false);
        setManufCount(0);
        // setFilterBadge('ON');
        setshowDrawer(false);
        GlobalFIlterPostApi([], 'ALL', 'ALL', Usercuid, 'Y', [], []);
      },
      okText: 'Confirm',
      cancelText: 'Cancel'
    });
  };
  // const onDrawerResetBtn = () => {};

  const PostFilterOnOffApi = (cuid, filterMode) => {
    Axios({
      url: ROOT_URL + 'PostFilterOnOff?Cuid=' + cuid + '&FilterFlag=' + filterMode,
      method: 'post'
    }).then((res) => {
      if (res.status == 200) {
        dispatch(getMaterialManufFilterList(Usercuid));

        setApplyCloseLoading(false);
      } else {
        setApplyCloseLoading(true);
      }
    });
  };

  const GlobalFIlterPostApi = (
    Org,
    LGORT,
    BlockedDeleted,
    UsrCuid,
    Mode,
    MatfileData,
    ManufData
  ) => {
    var FilterSettingData = JSON.stringify([
      {
        LGORT: LGORT,
        BlockedDeleted: BlockedDeleted
      }
    ]);
    let theme = localStorage.getItem('theme');
    let bot = sessionStorage.getItem('chatbot');
    let col = sessionStorage.getItem('eoqcol');
    Axios({
      url:
        ROOT_URL +
        'SaveImpersonationDetails?Usercuid=' +
        UsrCuid +
        '&Impcuid=' +
        'ALL' +
        '&FilterSetting=' +
        FilterSettingData +
        '&SaveMode=' +
        Mode +
        '&Theme=' +
        theme +
        '&Chatbot=' +
        bot +
        '&EOQColumns=' +
        col,
      method: 'post',
      data: {
        MaterialList: MatfileData.length === 0 ? 'ALL' : MatfileData,
        ManufacturerList: ManufData.length === 0 ? 'ALL' : ManufData,
        OrganizationList: Org.length === 0 ? 'ALL' : Org
      }
    }).then((res) => {
      if (res.status == 200) {
        dispatch(getUserImpersonationDetails(sessionStorage.getItem('loggedEmailId')));
        message.success('Filter Updated');
      } else {
        message.error('Filter Not Updated');
      }
    });
  };

  const onChangeDrawerSwitch = (checked) => {
    if (checked) {
      PostFilterOnOffApi(Usercuid, 'Y');
      setApplyCloseLoading(true);
      setSaveMode(checked);
    } else {
      PostFilterOnOffApi(Usercuid, 'N');
      setApplyCloseLoading(true);
      setSaveMode(checked);
    }
  };
  const ModalClose = () => {
    if (isModalOpenName === 'MATNR') {
      setfileData(TempfileData);

      setIsModalOpen(false);
    } else if (isModalOpenName === 'MANUF') {
      setManufSelectData(TempManufSelectData);

      setIsModalOpen(false);
    } else if (isModalOpenName === 'ORG') {
      setCheckedList(TempcheckedList);

      setIsModalOpen(false);
    }
  };
  const showModal = (value) => {
    if (value === 'MATNR') {
      setIsModalOpen(true);
      setIsModalOpenName('MATNR');
    } else if (value === 'MANUF') {
      setIsModalOpen(true);
      setIsModalOpenName('MANUF');
    } else if (value === 'ORG') {
      setIsModalOpen(true);
      setIsModalOpenName('ORG');
    } else {
      setIsModalOpen(false);
      setIsModalOpenName('');
    }
  };

  const HandleMatnrApply = () => {
    if (isModalOpenName === 'MATNR') {
      setMaterialCount(parseInt(fileData.length));
      setTempfileData(fileData);
      setIsModalOpen(false);
    } else if (isModalOpenName === 'MANUF') {
      setManufCount(parseInt(ManufSelectData.length));
      setTempManufSelectData(ManufSelectData);
      setIsModalOpen(false);
    } else if (isModalOpenName === 'ORG') {
      setOrgCount(parseInt(checkedList.length));
      setTempCheckedList(checkedList);
      setIsModalOpen(false);
    }
  };

  const props1 = {
    accept: '.xlsx',
    onRemove: () => {
      setfileData([]);
      return true;
    },
    beforeUpload: (file) => {
      if (
        file.type === 'application/vnd.ms-excel' ||
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ) {
        ReadFile(file);
      } else {
        message.error(`${file.name} is not a XLSX file`);
      }

      return false;
    }
  };

  function ReadFile(file) {
    var f = file;
    // eslint-disable-next-line no-unused-vars
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        /* Parse data */
        const bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        /* Get first worksheet */
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        /* Convert array of arrays */
        const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
        /* Update state */
        let res_parse = convertToJson(data)?.toString() || '';

        let strSplit = res_parse.split(',');

        var filtered = strSplit.filter(function (el) {
          return el != '';
        });
        let concatArray = fileData.concat(filtered);

        //getting valid material
        const compareData = getMaterialFilterData?.Table.filter((d) =>
          concatArray.includes(d.MATERIAL)
        ).map((d) => d.MATERIAL);
        setfileData(compareData);
        // setfileData(filtered);

        //getting invalid material
        const invalidMat = concatArray.filter((d) => compareData.indexOf(d) === -1);
        if (invalidMat.length > 0) {
          let rm_dupli = invalidMat.filter((d, ind, input) => {
            return input.indexOf(d) === ind;
          });
          message.warning(`${rm_dupli} are Invalid Material`);
        }
      } catch (error) {
        console.log('error', error);
      }
    };
    reader.readAsBinaryString(f);
  }
  function convertToJson(csv) {
    var lines = csv.split('\n');

    var result = [];

    var headers = lines[0].split(',');

    if (headers.length == 1) {
      if (headers.includes('Material') || headers.includes('MATERIAL')) {
        for (var i = 1; i < lines.length - 1; i++) {
          var obj = {};
          var currentline = lines[i].split(',');

          for (var j = 0; j < headers.length; j++) {
            let datas = currentline[j].trim();

            obj[headers[j]] = datas;
          }
          let obj_check = Object.values(obj);
          result.push(obj_check);
        }

        // const check = JSON.stringify(result);
        const check = result;

        return Object.values(check);
      } else {
        message.error(`${headers} is an invalid column`);
        throw new Error(`${headers} is an invalid column`);
      }
    } else {
      message.error('Please Check the Columns');
      throw new Error('Please Check the Columns');
    }
  }
  const onDrawerCheckBox = (value) => {
    setCheckedList(value);
  };
  const handleChange = (value) => {
    setfileData(value);
  };
  const handleChangeManuf = (value) => {
    setManufSelectData(value);
  };
  const confirm = () => {
    Modal.confirm({
      title: 'Confirm',
      icon: <ExclamationCircleOutlined />,
      content: 'Do you want to Reset?',
      onOk: () => {
        if (isModalOpenName === 'MATNR') {
          setfileData([]);
          setTempfileData([]);
          setMaterialCount(0);
          message.success('Material Reset Successfully');
        } else if (isModalOpenName === 'MANUF') {
          setManufSelectData([]);
          setTempManufSelectData([]);
          setManufCount(0);
          message.success('Manufacturer Reset Successfully');
        } else if (isModalOpenName === 'ORG') {
          setCheckedList([]);
          setTempCheckedList([]);
          setOrgCount(0);
          message.success('Organization Reset Successfully');
        }
      },
      okText: 'Confirm',
      cancelText: 'Cancel'
    });
  };
  const exportToCSVFileFormat = () => {
    let csvData = FileFormat;
    let fileName = 'Sample File Format For Material Filter';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  };

  return (
    <>
      <Drawer
        title={
          <div>
            <Row>
              <Col span={24}>
                <Row>
                  <Col span={24}>
                    <span className="float-left drawer-head-txt">ADVANCED FILTER</span>
                    <span className="float-right fil-switch">
                      <span className="drawer-toggle-label pr-1"> FILTER</span>

                      <Switch
                        size="default"
                        checkedChildren="ON"
                        unCheckedChildren="OFF"
                        checked={SaveMode}
                        onChange={onChangeDrawerSwitch}
                      />
                      <Button
                        className="btn-Advance-filter ml-2"
                        type="primary"
                        loading={ApplyCloseLoading}
                        disabled={lgortCheckList.length == 0 || BlockedDeletedList.length == 0}
                        onClick={toggleDrawer}
                        size="small">
                        Apply & Close
                      </Button>
                    </span>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        }
        placement="right"
        width={400}
        closable={false}
        destroyOnClose={true}
        onClose={DrawerClose}
        visible={showDrawer}>
        <>
          <Row>
            <Col span={24}>
              {' '}
              <span>
                <span>
                  <Button
                    className="btn-Advance-filter mr-2 "
                    type="primary"
                    disabled={!SaveMode}
                    onClick={confirmTotalReset}
                    size="small">
                    Reset
                  </Button>
                </span>
              </span>
            </Col>
          </Row>
          <Row>
            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pl-2">
              <div className="mt-4">
                {' '}
                <span className="view-text">
                  <h5 className="organization_title">MATERIAL</h5>
                  {!SaveMode ? (
                    <>
                      <span className="fil-disabled-avatar">
                        {' '}
                        <Avatar
                          size="large"
                          shape="square"
                          icon={<i className="fas fa-cube"></i>}
                        />
                      </span>
                    </>
                  ) : (
                    <>
                      {' '}
                      <Badge count={parseInt(MaterialCount)}>
                        <span onClick={() => showModal('MATNR')} className="cursor-pointer">
                          <Avatar
                            size="large"
                            shape="square"
                            icon={<i className="fas fa-cube"></i>}
                          />
                        </span>
                      </Badge>
                    </>
                  )}
                </span>
              </div>

              <div className="mt-4">
                <span className="view-text">
                  <h5 className="organization_title">MANUFACTURER</h5>
                  {!SaveMode ? (
                    <>
                      <span className="fil-disabled-avatar">
                        {' '}
                        <Avatar
                          size="large"
                          shape="square"
                          icon={<i className="far fa-industry"></i>}
                        />
                      </span>
                    </>
                  ) : (
                    <>
                      {' '}
                      <Badge count={parseInt(ManufCount)}>
                        <span onClick={() => showModal('MANUF')} className="cursor-pointer">
                          <Avatar
                            size="large"
                            shape="square"
                            icon={<i className="far fa-industry"></i>}
                          />
                        </span>
                      </Badge>
                    </>
                  )}
                </span>
              </div>
              <div className="mt-4">
                <span className="view-text">
                  <h5 className="organization_title">ORGANIZATION</h5>
                  {!SaveMode ? (
                    <>
                      <span className="fil-disabled-avatar">
                        {' '}
                        <Avatar
                          size="large"
                          shape="square"
                          icon={<i className="fas fa-sitemap"></i>}
                        />
                      </span>
                    </>
                  ) : (
                    <>
                      {' '}
                      <Badge count={parseInt(OrgCount)}>
                        <span onClick={() => showModal('ORG')} className="cursor-pointer">
                          <Avatar
                            size="large"
                            shape="square"
                            icon={<i className="fas fa-sitemap"></i>}
                          />
                        </span>
                      </Badge>
                    </>
                  )}
                </span>
              </div>
            </Col>
            <Col xs={12} sm={12} md={12} lg={12} xl={12}>
              {' '}
              <div className="mt-4">
                <span className="view-text">
                  <h5 className="organization_title">MANAGED SERVICES</h5>

                  <Checkbox
                    disabled={!SaveMode}
                    onChange={onLgortCheckAll}
                    className="drawer-lgort"
                    checked={
                      lgortCheckList === 'ALL'
                        ? true
                        : lgortCheckList.length === lgortParams.length
                        ? true
                        : false
                    }>
                    <span className="checkboxstyle"> ALL</span>
                  </Checkbox>
                  <CheckboxGroup
                    disabled={!SaveMode}
                    options={lgortParams}
                    value={lgortCheckList === 'ALL' ? lgortParams : lgortCheckList}
                    onChange={onLgortCheckBox}
                  />
                </span>
              </div>
              <div className="mt-4">
                <span className="view-text">
                  <h5 className="organization_title"> COLOR CODE MATERIALS</h5>

                  <Radio.Group
                    disabled={!SaveMode}
                    className="Drawer-class"
                    value={BlockedDeletedList}
                    onChange={blockedDeletedCheckBox}>
                    <Space direction="vertical">
                      <Radio value="ALL">ALL</Radio>
                      <Radio value="BLOCKED">BLOCKED</Radio>
                      <Radio value="DELETED">DELETED</Radio>
                      <Radio value="OTHERS">OTHERS</Radio>
                    </Space>
                  </Radio.Group>
                </span>
              </div>
            </Col>
          </Row>
        </>
      </Drawer>

      <button className="roboicon">
        <span className={!disabledFilter ? 'viewtxt' : 'v1'}>
          {disabledFilter ? (
            <Popover content="Fetching Data" placement="leftTop" trigger="hover">
              {/* <Button loading className="roboicon"> */}
              <i className="far fa-filter"></i>
              {/* </Button> */}
            </Popover>
          ) : (
            <>
              {SaveMode ? (
                <>
                  {filterApplied ? (
                    <>
                      <span onClick={HandleDrawerOpen}>
                        <Popover content={'Advanced Filter'} placement="leftTop">
                          <Badge
                            count={
                              <>
                                <i className="fas fa-check-circle"></i>
                              </>
                            }>
                            <i className="far fa-filter"></i>
                          </Badge>
                        </Popover>
                      </span>
                    </>
                  ) : (
                    <>
                      <Popover content={'Advanced Filter'} placement="leftTop">
                        <i className="far fa-filter" onClick={HandleDrawerOpen}></i>
                      </Popover>
                    </>
                  )}
                </>
              ) : (
                <>
                  <Popover content={'Advanced Filter'} placement="leftTop">
                    <i className="far fa-filter" onClick={HandleDrawerOpen}></i>
                  </Popover>
                </>
              )}
            </>
          )}
        </span>
      </button>

      <Modal
        maskClosable={false}
        width="35%"
        style={{ top: 60 }}
        footer={null}
        title={
          <>
            {isModalOpenName === 'MATNR' ? (
              <>
                {' '}
                <span>
                  {' '}
                  <i className="fas fa-filter pr-1 "></i>Material Filter
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
              </>
            ) : (
              <>
                {isModalOpenName === 'MANUF' ? (
                  <>
                    <span>
                      {' '}
                      <i className="fas fa-filter pr-1 "></i>Manufacturer Filter
                    </span>
                  </>
                ) : (
                  <>
                    {' '}
                    {isModalOpenName === 'ORG' ? (
                      <>
                        {' '}
                        <span>
                          {' '}
                          <i className="fas fa-filter pr-1 "></i>Organization Filter
                        </span>
                      </>
                    ) : (
                      <></>
                    )}
                  </>
                )}
              </>
            )}
          </>
        }
        visible={isModalOpen}
        destroyOnClose={true}
        onCancel={() => ModalClose()}>
        {isModalOpenName === 'MATNR' ? (
          <>
            {' '}
            <Row>
              <Col span={24} className="Custom_upload">
                <Upload {...props1} maxCount={1} showUploadList={false}>
                  <button icon={<i className="fas fa-upload"></i>}>
                    <i className="fas fa-upload"></i> Upload
                  </button>
                </Upload>
              </Col>
            </Row>
            <Row className="mt-3">
              {' '}
              <Col span={1}></Col>
              <Col span={22}>
                <Select
                  mode="multiple"
                  allowClear={false}
                  style={{
                    width: '100%'
                  }}
                  className="mat-fil-select"
                  placeholder="Please select Material"
                  value={fileData}
                  tokenSeparators={[',']}
                  onChange={handleChange}>
                  {!isEmpty(MaterialOption) ? (
                    <>
                      {MaterialOption?.Table.map((d, ind) => {
                        return <Option value={d.MATERIAL} label={d.MATERIAL} key={ind} />;
                      })}
                    </>
                  ) : (
                    <></>
                  )}{' '}
                </Select>
              </Col>
              <Col span={1}></Col>
            </Row>
            <Row>
              <Col span={24} className=" mt-4">
                <div className="float-left pl-2">
                  Selected Materials : {parseInt(fileData.length)}
                </div>
                <Button
                  type="primary"
                  size="middle"
                  htmlType="submit"
                  className="float-right btn-css"
                  onClick={HandleMatnrApply}>
                  Apply
                </Button>
                <Button
                  htmlType="submit"
                  size="middle"
                  className="btn-css mr-2 float-right upload-reset"
                  disabled={fileData.length == 0}
                  onClick={confirm}>
                  Reset
                </Button>
              </Col>
            </Row>
          </>
        ) : (
          <>
            {isModalOpenName === 'MANUF' ? (
              <>
                {' '}
                <Row className="mt-3">
                  {' '}
                  <Col span={1}></Col>
                  <Col span={22}>
                    <Select
                      mode="multiple"
                      allowClear={false}
                      style={{
                        width: '100%'
                      }}
                      className="mat-fil-select"
                      placeholder="Please select Manufacturer"
                      value={ManufSelectData}
                      tokenSeparators={[',']}
                      onChange={handleChangeManuf}>
                      {!isEmpty(MaterialOption) ? (
                        <>
                          {MaterialOption?.Table1.map((d, ind) => {
                            return <Option value={d.MANUF_NAME} label={d.MANUF_NAME} key={ind} />;
                          })}
                        </>
                      ) : (
                        <></>
                      )}{' '}
                    </Select>
                  </Col>
                  <Col span={1}></Col>
                </Row>
                <Row>
                  <Col span={24} className=" mt-4">
                    <div className="float-left pl-2">
                      Selected Manufacturers : {ManufSelectData.length}
                    </div>
                    <Button
                      type="primary"
                      size="middle"
                      htmlType="submit"
                      className="float-right btn-css"
                      onClick={HandleMatnrApply}>
                      Apply
                    </Button>
                    <Button
                      htmlType="submit"
                      size="middle"
                      className="btn-css mr-2 float-right upload-reset"
                      disabled={ManufSelectData.length == 0}
                      onClick={confirm}>
                      Reset
                    </Button>
                  </Col>
                </Row>
              </>
            ) : (
              <>
                {isModalOpenName === 'ORG' ? (
                  <>
                    <>
                      {' '}
                      <Row className="mt-3">
                        {' '}
                        <Col span={1}></Col>
                        <Col span={22}>
                          <Select
                            mode="multiple"
                            allowClear={false}
                            style={{
                              width: '100%'
                            }}
                            className="mat-fil-select"
                            placeholder="Please select Organization"
                            value={checkedList}
                            tokenSeparators={[',']}
                            onChange={onDrawerCheckBox}>
                            {!isEmpty(plainOptions) ? (
                              <>
                                {plainOptions?.map((d, ind) => {
                                  return (
                                    <Option
                                      value={d.ORGANIZATION}
                                      label={d.ORGANIZATION}
                                      key={ind}
                                    />
                                  );
                                })}
                              </>
                            ) : (
                              <></>
                            )}{' '}
                          </Select>
                        </Col>
                        <Col span={1}></Col>
                      </Row>
                      <Row>
                        <Col span={24} className=" mt-4">
                          <div className="float-left pl-2">
                            Selected Organizations : {checkedList.length}
                          </div>
                          <Button
                            type="primary"
                            size="middle"
                            htmlType="submit"
                            className="float-right btn-css"
                            onClick={HandleMatnrApply}>
                            Apply
                          </Button>
                          <Button
                            htmlType="submit"
                            size="middle"
                            className="btn-css mr-2 float-right upload-reset"
                            disabled={checkedList.length == 0}
                            onClick={confirm}>
                            Reset
                          </Button>
                        </Col>
                      </Row>
                    </>
                  </>
                ) : (
                  <></>
                )}
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
};

export default GlobalFilter;
