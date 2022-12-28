import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Card, Modal, Button, Radio, Tabs, Popover, Switch, TreeSelect } from 'antd';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Label,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import moment from 'moment';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { Search } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import PropagateLoader from 'react-spinners/PropagateLoader';
import {
  getCapExTrend,
  getDataforMapFullView,
  getDataforMap,
  getPlantDetailsDD,
  getHarvestingWidget,
  getWidgetDDData,
  getHarvestChartDD,
  getCapExTrendPoPlaced,
  getMaterialDetailsForMapView,
  getMaterialForMapView,
  getMaterialForMapViewDD,
  getUserImpersonationDetails,
  getMaterialInsightsDropDown,
  getMaterialInsightsDefaultMatnr
} from '../../actions';

import { ReusableSysncLoader } from '../ReusableComponent/ReusableSysncLoader';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

import { calculation } from '../Calculation';
import ReactDragListView from 'react-drag-listview';
import { NoDataTextLoader } from '../ReusableComponent/NoDataTextLoader';

const { SearchBar } = Search;
const { TabPane } = Tabs;
const { TreeNode } = TreeSelect;

var Microsoft,
  scriptURL =
    'https://www.bing.com/api/maps/mapcontrol?key=AqXCIWqMv_cQYYPdwT0m444bkr2em_xJf2vG7dzroJUpjtVZ_xJ8UgM1WZl3VN1s&callback=bingmapsCallback';
var parsedFilterSettingsLGORT;

let parsedBlockedDeleted;
class Map extends Component {
  constructor(props) {
    super(props);
    this.imploader = this.imploader.bind(this);
    this.RevenueCalculation = this.RevenueCalculation.bind(this);
    this.togglemapDetails = this.togglemapDetails.bind(this);
    this.togglematerialmapDetails = this.togglematerialmapDetails.bind(this);
    this.mapInventoryDD = this.mapInventoryDD.bind(this);
    this.TooltipFormatter = this.TooltipFormatter.bind(this);

    this.sortFunc = this.sortFunc.bind(this);
    this.infoDD = this.infoDD.bind(this);
    this.onClickTblDD = this.onClickTblDD.bind(this);
    this.onclickHarvestDD = this.onclickHarvestDD.bind(this);
    this.chartView = this.chartView.bind(this);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.exportToCSVPlantDetails = this.exportToCSVPlantDetails.bind(this);
    this.exportToCSVPlantCurrentInventory = this.exportToCSVPlantCurrentInventory.bind(this);
    this.exportToCSVPlantMaterialView = this.exportToCSVPlantMaterialView.bind(this);
    this.materialDescription = this.materialDescription.bind(this);
    this.handleMaterialChange = this.handleMaterialChange.bind(this);
    this.formatXAxis = this.formatXAxis.bind(this);

    var removeCallback = [];
    if (document.querySelector('script[src="' + scriptURL + '"]') === null) {
      this.loadScript(scriptURL);
      window.bingmapsCallback = function () {
        Microsoft = window.Microsoft;
        if (Microsoft === null || Microsoft === undefined) {
          removeCallback = setInterval(() => this.loadScript(scriptURL), 2000);
        } else {
          clearInterval(removeCallback);
        }
      }.bind(this);
    }
    this.insightmap = this.insightmap.bind(this);
    this.insightmap1 = this.insightmap1.bind(this);
    //Future Use
    this.getcheckValues = this.getcheckValues.bind(this);
    this.switchChange = this.switchChange.bind(this);

    this.state = {
      usercuid: 'ALL',
      SwitchData: true,
      disableExcelButton: true,
      harvestData: [],

      load: true,
      getMaterialForMapViewDDData: [],
      getUserImpersonationDetailsData: [],
      getMaterialInsightsDropDownData: [],

      mapData: [],
      mapDDData: [],
      ChartData: [],
      plantDetailsData: [],
      getPlantdetailsData: [],
      tblDDData: [],
      tblColumn: [{ text: '' }],
      mapDDModal: false,
      inventoryDDModal: false,
      Loader: true,
      Loader1: true,
      Loading: true,
      ChartLoader: true,
      MapLoader: true,
      MapViewLoader: true,
      isDataFetched: false,
      isDataFetched1: false,
      InfoModal: false,
      tblDDModal: false,
      harvestDDModal: false,
      harvestChartDDData: [],
      pochartData: [],
      poView: true,
      consumptionView: false,
      radioBtnvalue: 'PO',
      getMaterialForMapViewData: [],
      openHarvestData: 0,
      InstallHarvestData: 0,
      ERTData: 0,
      YTDData: 0,
      TotalHarvestCapEx: 0,
      TotalERTCapEx: 0,
      OpenHarvestCapEx: 0,
      InstallBaseCapEx: 0,
      universeCapEx: 0,
      universeHarvestData: 0,
      newResultLength: '',
      defaultActiveKey: '1',
      getMaterialDetailsForMapViewData: [],
      mapMaterialModal: false,
      materialmapView: false,

      materialNumber: '',
      MapLGORT: '',

      chartTitle: (
        <span>
          <i className="fas fa-chart-line mr-2" />
          PO Placed - CapEx Trend
          <span className="sub-text clr-white">(As of Date)</span>
        </span>
      ),
      materialcolumns: [
        {
          dataField: 'Material',
          text: 'Material',
          sort: true,
          headerStyle: { width: 90 },
          formatter: this.materialDescription,
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'LGORT',
          text: 'LGORT',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        },

        {
          dataField: 'Manuf_name',
          text: 'Manufacturer',
          sort: true,
          headerStyle: { width: 150 },
          align: 'left',
          headerAlign: 'left'
        },

        {
          dataField: '1900-S002-DENVER',
          text: '1900-S002-DENVER',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1901-S002-DENVER',
          text: '1901-S002-DENVER',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1910-S002-DENVER',
          text: '1910-S002-DENVER',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1920-S002-DENVER',
          text: '1920-S002-DENVER',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1921-S002-PHOENIX',
          text: '1921-S002-PHOENIX',
          sort: true,
          headerStyle: { width: 165 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1923-S002-New Brighton',
          text: '1923-S002-New Brighton',
          sort: true,
          headerStyle: { width: 190 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '5500-E002-Olathe',
          text: '5500-E002-Olathe',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '5501-E002-Ontario',
          text: '5501-E002-Ontario',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '5502-E002-SUWANEE',
          text: '5502-E002-SUWANEE',
          sort: true,
          headerStyle: { width: 170 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '5504-E002-WILSONVILLE',
          text: '5504-E002-WILSONVILLE',
          sort: true,
          headerStyle: { width: 195 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '7863-T600-Denver',
          text: '7863-T600-Denver',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9002-K899-Tulsa',
          text: '9002-K899-Tulsa',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9003-K100-Tulsa',
          text: '9003-K100-Tulsa',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9004-K899-Lewisberry',
          text: '9004-K899-Lewisberry',
          sort: true,
          headerStyle: { width: 175 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9005-K100-Lewisberry',
          text: '9005-K100-Lewisberry',
          sort: true,
          headerStyle: { width: 175 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9006-K899-TUSTIN',
          text: '9006-K899-TUSTIN',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9007-K100-TUSTIN',
          text: '9007-K100-TUSTIN',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9010-K899-Denver',
          text: '9010-K899-Denver',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9011-K100-Denver',
          text: '9011-K100-Denver',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1800-S002-LEESBURG',
          text: '1800-S002-LEESBURG',
          sort: true,
          headerStyle: { width: 175 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1250-S002-COLUMBIA',
          text: '1250-S002-COLUMBIA',
          sort: true,
          headerStyle: { width: 175 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '5503-E002-Warsaw',
          text: '5503-E002-Warsaw',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1600-S002-Las Vegas',
          text: '1600-S002-Las Vegas',
          sort: true,
          headerStyle: { width: 170 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9001-K100-Dallas',
          text: '9001-K100-Dallas',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '9000-K899-Dallas',
          text: '9000-K899-Dallas',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: '1700-S002-TARBORO',
          text: '1700-S002-TARBORO',
          sort: true,
          headerStyle: { width: 175 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Unit_Price',
          text: 'Unit Price',
          sort: true,
          headerStyle: { width: 100 },
          align: 'right',
          headerAlign: 'right',
          formatter: calculation
        },
        {
          dataField: 'Inventory_capex',
          text: 'Inventory Capex',
          sort: true,
          headerStyle: { width: 140 },
          align: 'right',
          headerAlign: 'right',
          formatter: calculation
        },
        {
          dataField: 'Total',
          text: 'Current Inventory',
          sort: true,
          headerStyle: { width: 150 },
          align: 'right',
          headerAlign: 'right'
        }
      ],
      columns: [
        {
          dataField: 'matnr',
          text: 'Material',
          sort: true,
          formatter: this.materialDescription,
          headerStyle: { width: 65 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'currentinventory',
          text: 'Current Inventory(Qty)',
          sort: true,
          headerStyle: { width: 160 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Unit_Price',
          text: 'Unit Price',
          sort: true,
          sortFunc: this.sortFunc,
          formatter: calculation,
          headerStyle: { width: 100 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'inventorycapex',
          text: 'Inventory CapEx',
          sortFunc: this.sortFunc,
          formatter: calculation,
          sort: true,
          headerStyle: { width: 150 },
          align: 'right',
          headerAlign: 'right'
        }
      ],
      materialMapcolumns: [
        {
          dataField: 'PLANT',
          text: 'Plant',
          sort: true,
          headerStyle: { width: 88 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Current_Inventory',
          text: 'Current Inventory(QTY)',
          sort: true,
          headerStyle: { width: 167 },
          align: 'right',
          headerAlign: 'right'
        },
        {
          dataField: 'Inventory_CapEx',
          text: 'Inventory CapEx',
          sort: true,
          headerStyle: { width: 90 },
          align: 'right',
          headerAlign: 'right',
          formatter: calculation
        },
        {
          dataField: 'PlantName',
          text: 'Plant Name',
          sort: true,
          headerStyle: { width: 200 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'region',
          text: 'Region',
          sort: true,
          headerStyle: { width: 85 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Address',
          text: 'Address',
          sort: true,
          headerStyle: { width: 95 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'Location',
          text: 'Location',
          sort: true,
          headerStyle: { width: 95 },
          align: 'left',
          headerAlign: 'left'
        },
        {
          dataField: 'ZipCode',
          text: 'Zipcode',
          sort: true,
          headerStyle: { width: 90 },
          align: 'left',
          headerAlign: 'left'
        }
      ]
    };
  }
  componentDidMount() {
    setTimeout(() => this.insightmap(), 10000);
  }
  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.getUserImpersonationDetailsData != nextProps.getUserImpersonationDetailsData) {
      this.imploader();
      const filterSettingsOrg = nextProps.getUserImpersonationDetailsData[0].FilterSetting;

      parsedBlockedDeleted = JSON.parse(filterSettingsOrg)[0].BlockedDeleted;
      parsedFilterSettingsLGORT = JSON.parse(filterSettingsOrg)[0].LGORT;
      if (nextProps.getUserImpersonationDetailsData != 0) {
        this.setState({
          organization: nextProps.getUserImpersonationDetailsData[0].FilterSetting,
          usercuid:
            nextProps.getUserImpersonationDetailsData[0].loggedcuid == null
              ? 'all'
              : nextProps.getUserImpersonationDetailsData[0].loggedcuid
        });
      }
    }

    if (
      this.props.getMaterialInsightsDefaultMatnrData !=
      nextProps.getMaterialInsightsDefaultMatnrData
    ) {
      if (nextProps.getMaterialInsightsDefaultMatnrData != 0) {
        this.setState({
          defaultValueDD: nextProps.getMaterialInsightsDefaultMatnrData[0].matnr,
          materialNumber: nextProps.getMaterialInsightsDefaultMatnrData[0].matnr,
          MapLGORT: nextProps.getMaterialInsightsDefaultMatnrData[0].lgort
        });
      }
    }

    if (this.props.getMaterialInsightsDropDownData != nextProps.getMaterialInsightsDropDownData) {
      if (nextProps.getMaterialInsightsDropDownData != 0) {
        this.setState({
          getMaterialInsightsDropDownData: nextProps.getMaterialInsightsDropDownData
        });
      } else {
        this.setState({
          getMaterialInsightsDropDownData: []
        });
      }
    }

    if (this.props.mapData != nextProps.mapData) {
      if (nextProps.mapData != 0) {
        this.setState({
          mapData: nextProps.mapData,
          load: false
        });
        setTimeout(() => this.insightmap(), 1000);
      } else {
        this.setState({
          mapData: [],
          load: true
        });
      }
    }

    if (this.props.getMaterialForMapViewDDData != nextProps.getMaterialForMapViewDDData) {
      if (nextProps.getMaterialForMapViewDDData != 0) {
        nextProps.getMaterialForMapViewDDData.map((val) => {
          this.setState({
            MapViewLoader: false,
            Loader1: false,

            materialDataforPlantViewDD: (
              <div>
                <Row className="mat-val">
                  <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <span>Manufacturer: </span>
                    <div className="map-value">{val.MANUF_NAME}</div>
                  </Col>
                  <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                    <span>Organization: </span>
                    <div className="map-value">{val.ORGANIZATION}</div>
                  </Col>

                  <Col xs={3} sm={3} md={3} lg={3} xl={3}>
                    <span>Unit Price: </span>
                    <div className="map-value"> {calculation(val.Unit_Price)}</div>
                  </Col>
                  <Col xs={9} sm={9} md={9} lg={9} xl={9}>
                    <span>Description: </span>
                    <div className="map-value"> {val.DESCRIPTION}</div>
                  </Col>
                </Row>
                <Card>
                  <Row className="map-plant-details bottom-clr mb-3">
                    <ToolkitProvider
                      keyField="PLANT"
                      data={nextProps.getMaterialForMapViewDDData}
                      columns={this.state.materialMapcolumns}
                      search={{
                        afterSearch: (newResult) => {
                          if (!newResult.length) {
                            if (nextProps.getMaterialForMapViewDDData != '') {
                              this.setState({
                                newResultLength: newResult.length
                              });
                            } else {
                              this.setState({
                                newResultLength: ''
                              });
                            }
                          }
                        }
                      }}>
                      {(props) => (
                        <div>
                          <Row>
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} />
                            <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                              <div>
                                <SearchBar {...props.searchProps} />
                              </div>
                            </Col>
                          </Row>
                          <ReactDragListView.DragColumn
                            onDragEnd={this.onDragEndmaterialMapcolumns.bind(this)}
                            nodeSelector="th">
                            <BootstrapTable
                              {...props.baseProps}
                              noDataIndication={() => this.tblLoaderOne()}
                              pagination={paginationFactory()}
                              filter={filterFactory()}
                            />
                          </ReactDragListView.DragColumn>
                        </div>
                      )}
                    </ToolkitProvider>
                  </Row>
                </Card>
              </div>
            )
          });
        });
      } else {
        this.setState({
          MapViewLoader: true,
          Loader1: true
          //  getMaterialForMapViewDDData:[]
        });
      }
    }

    if (this.props.getMaterialForMapViewData != nextProps.getMaterialForMapViewData) {
      if (nextProps.getMaterialForMapViewData != 0) {
        this.setState({
          MapLoader: false,
          getMaterialForMapViewData: nextProps.getMaterialForMapViewData
        });
        setTimeout(() => this.insightmap1(), 1000);
      } else {
        this.setState({
          MapLoader: true,
          getMaterialForMapViewData: []
        });
      }
    }

    if (this.props.harvestData != nextProps.harvestData) {
      if (nextProps.harvestData != 0) {
        let TotalHarvestCapEx = calculation(nextProps.harvestData.Table[0].TotalHarvestCapEx);
        let TotalERTCapEx = calculation(nextProps.harvestData.Table[0].TotalERTCapEx);
        let OpenHarvestCapEx = calculation(nextProps.harvestData.Table1[0].OpenHarvestCapEx);
        let InstallBaseCapEx = calculation(nextProps.harvestData.Table1[0].totalInstallBaseCapex);
        let YTDData = parseFloat(nextProps.harvestData.Table[0].TotalHarvest);
        let ERTData = parseFloat(nextProps.harvestData.Table[0].TotalERT);
        let openHarvestData = parseFloat(nextProps.harvestData.Table1[0].TotalOpenHarvest);
        let universeCapEx = calculation(nextProps.harvestData.Table1[0].TotalHarvestUniverseCapex);
        this.setState({
          harvestData: nextProps.harvestData,
          YTDData: YTDData,
          ERTData: ERTData,
          openHarvestData: openHarvestData,
          InstallHarvestData: nextProps.harvestData.Table1[0].Totalinstallbase,
          TotalHarvestCapEx: TotalHarvestCapEx,
          TotalERTCapEx: TotalERTCapEx,
          OpenHarvestCapEx: OpenHarvestCapEx,
          InstallBaseCapEx: InstallBaseCapEx,
          universeCapEx: universeCapEx,
          universeHarvestData: nextProps.harvestData.Table1[0].TotalHarvestUniverse
        });
        this.setState({
          isDataFetched: true
        });
      } else {
        this.setState({
          harvestData: [],
          isDataFetched: false
        });
      }
    }
    if (this.props.plantDetailsData != nextProps.plantDetailsData) {
      if (nextProps.plantDetailsData != 0) {
        this.setState({
          plantDetailsData: nextProps.plantDetailsData,
          isDataFetched: false
        });
      } else {
        this.setState({
          plantDetailsData: [],
          isDataFetched: true
        });
      }
    }

    if (this.props.getMaterialDetailsForMapViewData != nextProps.getMaterialDetailsForMapViewData) {
      if (nextProps.getMaterialDetailsForMapViewData != 0) {
        this.setState({
          getMaterialDetailsForMapViewData: nextProps.getMaterialDetailsForMapViewData,
          isDataFetched1: false,
          disableExcelButton: false
        });
      } else {
        this.setState({
          isDataFetched1: true,
          getMaterialDetailsForMapViewData: []
        });
      }
    }
    if (this.props.mapDDData != nextProps.mapDDData) {
      if (nextProps.mapDDData != 0) {
        this.setState({
          getPlantdetailsData: nextProps.mapDDData
        });
        var mapDDDetails = [];
        nextProps.mapDDData.map((val) => {
          mapDDDetails.push(
            <div className="map-headerDD">
              <div className="mb-3">
                <span className="mb-3 map-plant-name">Plant: {val.plant}</span>
                <span className="view-btn" id={val.plant} onClick={this.mapInventoryDD}>
                  {' '}
                  <i className="fas fa-table mr-2" />
                  View Current Inventory
                </span>
              </div>
              <Row className="map-plant-details mb-3">
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <span>Name: </span>
                  <div className="map-value"> {val.name1}</div>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <span>Address: </span>
                  <div className="map-value"> {val.address}</div>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <span>Location: </span>
                  <div className="map-value"> {val.location}</div>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <span>ZIP Code: </span>
                  <div className="map-value"> {val.zipcode}</div>
                </Col>
              </Row>
              <Row className="map-plant-details bottom-clr mb-3">
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <span>Current Inventory: </span>
                  {val.currentinventory == null ? (
                    <div className="map-value" id={val.plant} onClick={this.mapInventoryDD}>
                      0
                    </div>
                  ) : (
                    <div className="map-value" id={val.plant} onClick={this.mapInventoryDD}>
                      {' '}
                      {val.currentinventory}
                    </div>
                  )}
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <span>Current CapEx: </span>
                  <div className="map-value"> {calculation(val.currentcapex)}</div>
                </Col>
                <Col xs={6} sm={6} md={6} lg={6} xl={6}>
                  <span>REGION: </span>
                  <div className="map-value"> {val.REGION}</div>
                </Col>
              </Row>
            </div>
          );
        });
        this.setState({
          Loader: false,
          mapDDData: mapDDDetails
        });
      } else {
        this.setState({
          Loader: false,
          mapDDData: []
        });
      }
    }
    if (this.props.capExtrendData != nextProps.capExtrendData) {
      if (nextProps.capExtrendData != '') {
        for (var i = 0; i < nextProps.capExtrendData.length; i++) {
          if (nextProps.capExtrendData[i].Is_Predicted == 'Y') {
            this.setState({
              monthlyPredictedYCons: i
            });
            break;
          }
        }
        this.setState({
          ChartLoader: false,
          ChartData: nextProps.capExtrendData
        });
      } else {
        this.setState({
          ChartData: [],
          ChartLoader: true
        });
      }
    }
    if (this.props.harvestChartDDData != nextProps.harvestChartDDData) {
      if (nextProps.harvestChartDDData != 0) {
        this.setState({
          Loading: false,
          harvestChartDDData: nextProps.harvestChartDDData
        });
      } else {
        this.setState({
          Loading: true,
          harvestChartDDData: []
        });
      }
    }
    if (this.props.pochartData != nextProps.pochartData) {
      if (nextProps.pochartData != 0) {
        // eslint-disable-next-line no-redeclare
        for (var i = 0; i < nextProps.pochartData.length; i++) {
          if (nextProps.pochartData[i].ISPREDICTED == 'Y') {
            this.setState({
              monthlyPredictedY: i
            });
            break;
          }
        }
        this.setState({
          ChartLoader: false,
          pochartData: nextProps.pochartData
        });
      } else {
        this.setState({
          pochartData: [],
          ChartLoader: true
        });
      }
    }
    if (this.props.tblDDData != nextProps.tblDDData) {
      if (nextProps.tblDDData != 0) {
        this.setState({
          tblDDData: nextProps.tblDDData,
          isDataFetched: false
        });
      } else {
        this.setState({
          tblDDData: [],
          isDataFetched: true
        });
      }
    }
  }

  sortFunc(a, b, order) {
    if (order === 'asc') {
      return b - a;
    }
    return a - b;
  }

  handleMaterialChange(e) {
    this.state.getMaterialInsightsDropDownData.map((d) => {
      if (e === d.matnrlgort) {
        this.setState({ materialNumber: d.matnr, MapLGORT: d.lgort });
        if (this.state.usercuid != null) {
          this.props.getMaterialForMapView(
            d.matnr,
            this.state.usercuid,
            d.lgort,
            parsedBlockedDeleted
          );
        } else {
          this.props.getMaterialForMapView(d.matnr, 'all', d.lgort, parsedBlockedDeleted);
        }
      }
    });
  }
  // Future Use
  getcheckValues(checked) {
    if (checked == false) {
      this.setState({
        materialmapView: true
      });
      if (this.state.usercuid != null) {
        this.props.getMaterialForMapView(
          this.state.defaultValueDD,
          this.state.usercuid,

          this.state.MapLGORT,
          parsedBlockedDeleted
        );
        this.props.getMaterialInsightsDropDown(
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getMaterialForMapView(
          this.state.defaultValueDD,
          'all',

          this.state.MapLGORT,
          parsedBlockedDeleted
        );
        this.props.getMaterialInsightsDropDown(
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        materialmapView: false
      });
    }
  }

  callback(key) {
    if (key == 1) {
      this.setState({
        Loader: true,
        defaultActiveKey: '1',
        materialmapView: false
      });
    } else {
      this.setState({
        defaultActiveKey: '2',
        load: true
      });
      if (this.state.usercuid != null) {
        this.props.getDataforMapFullView(
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getDataforMapFullView(
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }

  materialDescription(cell, row) {
    return (
      <Popover
        placement="right"
        className="modal-tool-tip"
        content={
          <span>
            {row.description}
            {row.STK_TYPE == '' || row.STK_TYPE == null ? (
              ''
            ) : (
              <>
                <br />
                <span className="Stk-style">
                  Stock Type : &nbsp;
                  {row.STK_TYPE}
                </span>
              </>
            )}

            {row.HECI == '' || row.HECI == null ? (
              ''
            ) : (
              <>
                <br />
                <span className="heci-style">
                  HECI : &nbsp;
                  {row.HECI}
                </span>
              </>
            )}
            {row.CTL_STOCKOUT_FLAG != 'Y' ? (
              ''
            ) : (
              <>
                <br />
                <span className="stockout-style">CTL Stockout : &nbsp; Yes</span>
              </>
            )}

            {row.LVLT_STOCKOUT_FLAG != 'Y' ? (
              ''
            ) : (
              <>
                <br />
                <span className="stockout-style">LVLT Stockout : &nbsp; Yes</span>
              </>
            )}
          </span>
        }>
        <span className="row-data" onClick={() => this.DrilldownDD(row)}>
          {cell}
        </span>
      </Popover>
    );
  }

  insightmap() {
    var _this1 = this;
    var pinInfobox;
    var Data = this.state.mapData;
    function GetMap() {
      var pushpinInfos = Data;

      var infoboxLayer = new Microsoft.Maps.EntityCollection();
      var pinLayer = new Microsoft.Maps.EntityCollection();
      var apiKey =
        'U4VD6Xi1NuVkAaN8KvJF~dereRmfzkm5VdVorK5lmlA~Ar4MuDpGzRmqdUtbXYvjm31t06tAU-400GnsVAY8Zna23hb05WjeiHiszdHOEAXU';

      var map = new Microsoft.Maps.Map(document.getElementById('myMap'), {
        credentials: apiKey,
        mapTypeId: Microsoft.Maps.MapTypeId.road
      });

      var locs = [];
      for (var i = 0; i < pushpinInfos.length; i++) {
        locs = new Microsoft.Maps.Location(pushpinInfos[i].Latitude, pushpinInfos[i].Longitude);
        var pin = new Microsoft.Maps.Pushpin(locs);
        pin.Title = pushpinInfos[i].plant;
        //pin.Description = {
        //    lastmnthQTY: pushpinInfos[i].Last_Month_QTY,
        //    lastmnthCapEX: pushpinInfos[i].Last_Month_CapEX,
        //    currentmnthQTY: pushpinInfos[i].Current_Month_Qty,
        //    currentmnthCapEX: pushpinInfos[i].Current_Month_CapEx,
        //};
        pin.Description = pushpinInfos[i].Latitude;
        pin.LON = pushpinInfos[i].Longitude;
        pinLayer.push(pin);
        Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
        // Create the info box for the pushpin
        pinInfobox = new Microsoft.Maps.Infobox(
          new Microsoft.Maps.Location(pushpinInfos[i].Latitude, pushpinInfos[i].Longitude),
          { visible: false }
        );
        infoboxLayer.push(pinInfobox);
        //Microsoft.Maps.Events.addHandler(pin, 'mouseout', hideInfobox );
      }

      map.entities.push(pinLayer);
      map.entities.push(pinInfobox);

      //var bestview = Microsoft.Maps.LocationRect.fromLocations(locs);
      map.setView({
        center: new Microsoft.Maps.Location(39.7920733, -104.8533056),
        zoom: 4
      });
    }
    function displayInfobox(e) {
      var infoData = Data;
      var plantinfo = infoData.filter(
        (i) => i.Latitude === e.target.Description && i.Longitude === e.target.LON
      );
      var plantlabel = plantinfo.map((val) => {
        return (
          '<tr>' +
          '<td>' +
          val.plant +
          '</td>' +
          '<td>' +
          calculation(val.currentcapex) +
          '</td>' +
          '</tr>'
        );
      });
      var datas = plantlabel.join('');
      pinInfobox.setOptions({
        description:
          '<table>' +
          '<tr>' +
          '<th>' +
          'Plant' +
          '</th>' +
          '<th>' +
          'Current CapEx' +
          '</th>' +
          '</tr>' +
          datas +
          '</table>',
        actions: [
          {
            label: 'View All Details',
            eventHandler: () => _this1.togglemapDetails(e.target.Description)
          }
        ],
        visible: true,
        offset: new Microsoft.Maps.Point(0, 25)
      });
      pinInfobox.setLocation(e.target.getLocation());
    }

    // eslint-disable-next-line no-unused-vars
    function hideInfobox(e) {
      pinInfobox.setOptions({ visible: false });
    }
    GetMap();
  }

  insightmap1() {
    var _this1 = this;
    var pinInfobox;
    var Data = this.state.getMaterialForMapViewData;
    function GetMap1() {
      var pushpinInfos = Data;

      var infoboxLayer = new Microsoft.Maps.EntityCollection();
      var pinLayer = new Microsoft.Maps.EntityCollection();
      var apiKey =
        'U4VD6Xi1NuVkAaN8KvJF~dereRmfzkm5VdVorK5lmlA~Ar4MuDpGzRmqdUtbXYvjm31t06tAU-400GnsVAY8Zna23hb05WjeiHiszdHOEAXU';

      var map = new Microsoft.Maps.Map(document.getElementById('myMaterialMap'), {
        credentials: apiKey,
        mapTypeId: Microsoft.Maps.MapTypeId.road
      });

      var locs = [];
      for (var i = 0; i < pushpinInfos.length; i++) {
        locs = new Microsoft.Maps.Location(pushpinInfos[i].Latitude, pushpinInfos[i].Longitude);
        var pin = new Microsoft.Maps.Pushpin(locs);
        pin.Title = pushpinInfos[i].plant;
        pin.Description = pushpinInfos[i].Latitude;
        pin.LON = pushpinInfos[i].Longitude;
        pinLayer.push(pin);
        Microsoft.Maps.Events.addHandler(pin, 'click', displayInfobox);
        // Create the info box for the pushpin
        pinInfobox = new Microsoft.Maps.Infobox(
          new Microsoft.Maps.Location(pushpinInfos[i].Latitude, pushpinInfos[i].Longitude),
          { visible: false }
        );
        infoboxLayer.push(pinInfobox);
        //Microsoft.Maps.Events.addHandler(pin, 'mouseout', hideInfobox );
      }

      map.entities.push(pinLayer);
      map.entities.push(pinInfobox);

      //var bestview = Microsoft.Maps.LocationRect.fromLocations(locs);
      map.setView({
        center: new Microsoft.Maps.Location(39.7920733, -104.8533056),
        zoom: 4
      });
    }
    function displayInfobox(e) {
      var infoData = Data;
      var plantinfo = infoData.filter(
        (i) => i.Latitude === e.target.Description && i.Longitude === e.target.LON
      );
      var plantlabel = plantinfo.map((val) => {
        return (
          '<tr>' +
          '<td>' +
          val.PLANT +
          '</td>' +
          '<td>' +
          val.Current_Inventory +
          '</td>' +
          '<td>' +
          calculation(val.Inventory_CapEx) +
          '</td>' +
          '</tr>'
        );
      });
      var datas = plantlabel.join('');
      pinInfobox.setOptions({
        description:
          '<table>' +
          '<tr>' +
          '<th>' +
          'Plant' +
          '</th>' +
          '<th>' +
          'Current Inventory(QTY)' +
          '</th>' +
          '<th>' +
          'Inventory Capex' +
          '</th>' +
          '</tr>' +
          datas +
          '</table>',
        actions: [
          {
            label: 'View All Details',
            eventHandler: () => _this1.togglematerialmapDetails(e.target.Description)
          }
        ],
        visible: true,
        offset: new Microsoft.Maps.Point(0, 25)
      });
      pinInfobox.setLocation(e.target.getLocation());
    }

    // eslint-disable-next-line no-unused-vars
    function hideInfobox(e) {
      pinInfobox.setOptions({ visible: false });
    }
    GetMap1();
  }

  onclickHarvestDD(e) {
    if (this.state.harvestDDModal == true) {
      this.setState({
        harvestDDModal: false,
        harvestChartDDData: [],
        Loading: true
      });
    } else {
      this.setState({
        harvestDDModal: true,
        materialNo: e.Material
      });
      if (this.state.usercuid != null) {
        this.props.getHarvestChartDD(e.Material, e.LGORT);
      } else {
        this.props.getHarvestChartDD(e.Material, e.LGORT);
      }
    }
  }

  togglematerialmapDetails(e) {
    if (this.state.mapMaterialModal == true) {
      this.setState({
        mapMaterialModal: false
        // getMaterialForMapViewDDData:[]
      });
    } else {
      this.setState({
        mapMaterialModal: true,
        getMaterialForMapViewDDData: []
      });
      //this.props.getMaterialForMapView(this.state.materialNumber);
      if (this.state.usercuid != null) {
        this.props.getMaterialForMapViewDD(
          this.state.materialNumber,
          e,
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getMaterialForMapViewDD(
          this.state.materialNumber,
          e,
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }

  chartView(e) {
    if (e.target.value == 'PO') {
      this.setState({
        chartTitle: (
          <span>
            <i className="fas fa-chart-line mr-2" />
            PO Placed - CapEx Trend
            <span className="sub-text clr-white">(As of Date)</span>
          </span>
        ),
        poView: true,
        consumptionView: false,
        ChartData: [],
        ChartLoader: true,
        radioBtnvalue: 'PO'
      });
      if (this.state.usercuid != null) {
        this.props.getCapExTrendPoPlaced(
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getCapExTrendPoPlaced(
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    } else {
      this.setState({
        chartTitle: (
          <span>
            <i className="fas fa-chart-line mr-2" />
            Consumption CapEx Trend
            <span className="sub-text clr-white">(As of Date)</span>
          </span>
        ),
        poView: false,
        consumptionView: true,
        ChartLoader: true,
        pochartData: [],
        radioBtnvalue: 'Consumption'
      });
      if (this.state.usercuid != null) {
        this.props.getCapExTrend(
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getCapExTrend(
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }
  onClickTblDD(e) {
    if (this.state.tblDDModal == true) {
      this.setState({
        SwitchData: true,
        tblDDModal: false,
        tblDDData: [],
        tblColumn: [{ text: '' }],
        isDataFetched: false,
        newResultLength: '',
        WidName: ''
      });
    } else {
      this.setState({
        tblDDModal: true
      });
      if (e == 'Harvest') {
        this.setState({
          tblDDData: [],
          isDataFetched: false,
          newResultLength: '',
          WidName: 'Harvest',
          tblDDTitle: (
            <div>
              <i className="fas fa-table mr-2" />
              Harvesting
            </div>
          ),
          tblColumn: [
            {
              text: 'Action',
              dataField: '',
              headerStyle: { width: 80 },
              formatter: (cell, row) => (
                <div className="text-center">
                  <Button
                    size="small"
                    type="primary"
                    className="mr-1 modal-action-icon"
                    id={row.Material}
                    onClick={() => this.onclickHarvestDD(row)}>
                    <i className="fas fa-chart-line" />
                  </Button>
                </div>
              )
            },
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 90 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'LGORT',
              text: 'LGORT',
              sort: true,
              headerStyle: { width: 80 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'HarvestQTY',
              text: 'Harvest QTY',
              sortFunc: this.sortFunc,
              sort: true,
              headerStyle: { width: 111 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'HarvestCapEx',
              text: 'Harvest CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 125 }
            },
            {
              dataField: 'ERTQTY',
              text: 'ERT QTY',
              sortFunc: this.sortFunc,
              sort: true,
              headerStyle: { width: 90 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'ERTCapEx',
              text: 'ERT CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 100 }
            }
          ]
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted
          );
        }
      } else if (e == 'InstallBaseHarvest') {
        this.setState({
          tblDDData: [],
          isDataFetched: false,
          newResultLength: '',
          WidName: 'Install Base Harvest',
          tblDDTitle: (
            <div>
              <i className="fas fa-table mr-2" />
              Install Base
            </div>
          ),
          tblColumn: [
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 100 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'LGORT',
              text: 'LGORT',
              sort: true,
              headerStyle: { width: 80 },
              align: 'left',
              headerAlign: 'left'
            },

            {
              dataField: 'RED_INVENTORY',
              text: 'Max Keep Level (Red)',
              sort: true,
              headerStyle: { width: 106 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'GREEN_INVENTORY',
              text: 'Max Keep Level (Green)',
              sort: true,
              headerStyle: { width: 130 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'UnitPrice',
              text: 'Unit Price',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 100 }
            },
            {
              dataField: 'InstallBaseQTY',
              text: 'Install Base QTY',
              sortFunc: this.sortFunc,
              sort: true,
              headerStyle: { width: 140 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'InstallBaseCapEx',
              text: 'Install Base CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 150 }
            },
            {
              dataField: 'HarvestUniverse',
              text: 'Harvest Universe',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 140 }
            },
            {
              dataField: 'HarvestUniverseCapex',
              text: 'Harvest Universe CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 120 }
            },
            {
              dataField: 'OpenHarvestQTY',
              text: 'Open Harvest QTY',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 110 }
            },
            {
              dataField: 'OpenHarvestCapEx',
              text: 'Open Harvest CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 100 }
            }
          ]
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            e,
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.SwitchData ? 'STOCK' : 'SPARE'
          );
        } else {
          this.props.getWidgetDDData(
            e,
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.SwitchData ? 'STOCK' : 'SPARE'
          );
        }
      } else if (e == 'Openuniverse') {
        this.setState({
          tblDDData: [],
          isDataFetched: false,
          newResultLength: '',
          WidName: 'Open Harvest',
          tblDDTitle: (
            <div>
              <i className="fas fa-table mr-2" />
              Open Harvest
            </div>
          ),
          tblColumn: [
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 100 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'LGORT',
              text: 'LGORT',
              sort: true,
              headerStyle: { width: 80 },
              align: 'left',
              headerAlign: 'left'
            },

            {
              dataField: 'RED_INVENTORY',
              text: 'Max Keep Level (Red)',
              sort: true,
              headerStyle: { width: 106 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'GREEN_INVENTORY',
              text: 'Max Keep Level (Green)',
              sort: true,
              headerStyle: { width: 130 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'UnitPrice',
              text: 'Unit Price',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 100 }
            },
            {
              dataField: 'InstallBaseQTY',
              text: 'Install Base QTY',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 140 }
            },
            {
              dataField: 'InstallBaseCapEx',
              text: 'Install Base CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 150 }
            },
            {
              dataField: 'HarvestUniverse',
              text: 'Harvest Universe',
              sortFunc: this.sortFunc,
              sort: true,
              headerStyle: { width: 135 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'HarvestUniverseCapex',
              text: 'Harvest Universe CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 120 }
            },
            {
              dataField: 'OpenHarvestQTY',
              text: 'Open Harvest QTY',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 110 }
            },
            {
              dataField: 'OpenHarvestCapEx',
              text: 'Open Harvest CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 100 }
            }
          ]
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            'InstallBaseHarvest',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.SwitchData ? 'STOCK' : 'SPARE'
          );
        } else {
          this.props.getWidgetDDData(
            'InstallBaseHarvest',
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.SwitchData ? 'STOCK' : 'SPARE'
          );
        }
      } else if (e == 'Harvestuniverse') {
        this.setState({
          tblDDData: [],
          isDataFetched: false,
          newResultLength: '',
          WidName: 'Harvest Universe',
          tblDDTitle: (
            <div>
              <i className="fas fa-table mr-2" />
              Harvest Universe
            </div>
          ),
          tblColumn: [
            {
              dataField: 'Material',
              text: 'Material',
              sort: true,
              formatter: this.materialDescription,
              headerStyle: { width: 100 },
              align: 'left',
              headerAlign: 'left'
            },
            {
              dataField: 'LGORT',
              text: 'LGORT',
              sort: true,
              headerStyle: { width: 80 },
              align: 'left',
              headerAlign: 'left'
            },

            {
              dataField: 'RED_INVENTORY',
              text: 'Max Keep Level (Red)',
              sort: true,
              headerStyle: { width: 106 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'GREEN_INVENTORY',
              text: 'Max Keep Level (Green)',
              sort: true,
              headerStyle: { width: 130 },
              align: 'right',
              headerAlign: 'right'
            },
            {
              dataField: 'UnitPrice',
              text: 'Unit Price',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 100 }
            },
            {
              dataField: 'InstallBaseQTY',
              text: 'Install Base QTY',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 140 }
            },
            {
              dataField: 'InstallBaseCapEx',
              text: 'Install Base CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 150 }
            },
            {
              dataField: 'HarvestUniverse',
              text: 'Harvest Universe',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              headerStyle: { width: 140 }
            },
            {
              dataField: 'HarvestUniverseCapex',
              text: 'Harvest Universe CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 120 }
            },
            {
              dataField: 'OpenHarvestQTY',
              text: 'Open Harvest QTY',
              sortFunc: this.sortFunc,
              align: 'right',
              headerAlign: 'right',
              sort: true,
              headerStyle: { width: 110 }
            },
            {
              dataField: 'OpenHarvestCapEx',
              text: 'Open Harvest CapEx',
              sortFunc: this.sortFunc,
              sort: true,
              align: 'right',
              headerAlign: 'right',
              formatter: calculation,
              headerStyle: { width: 100 }
            }
          ]
        });
        if (this.state.usercuid != null) {
          this.props.getWidgetDDData(
            'InstallBaseHarvest',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.SwitchData ? 'STOCK' : 'SPARE'
          );
        } else {
          this.props.getWidgetDDData(
            'InstallBaseHarvest',
            'all',

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.SwitchData ? 'STOCK' : 'SPARE'
          );
        }
      }
    }
  }
  togglemapDetails(e) {
    if (this.state.mapDDModal == true) {
      this.setState({
        isDataFetched: false,
        mapDDModal: false,
        mapDDData: [],
        Loader: true
      });
    } else {
      this.setState({
        mapDDModal: true,
        isDataFetched: false
      });
      if (this.state.usercuid != null) {
        this.props.getDataforMap(
          e,
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getDataforMap(
          e,
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }
  infoDD(e) {
    if (this.state.InfoModal == true) {
      this.setState({
        InfoModal: false
      });
    } else {
      this.setState({
        InfoModal: true
      });
      if (e == 'Harvest') {
        this.setState({
          descriptionTitle: <div> Harvesting - Description</div>,
          WidDescription: (
            <div>
              <p>
                <strong>Total Harvest :</strong>
              </p>
              <ul>
                <li>Total quantity harvested through harvest process in past 12 months</li>
              </ul>
              <p>
                <strong>Total ERTs :</strong>
              </p>
              <ul>
                <li>Total quantity harvested through ERT process in past 12 months</li>
              </ul>
              <p>
                <strong>Open Harvest :</strong>
              </p>
              <ul>
                <li>Total quantity of items open harvest state</li>
              </ul>
              <p>
                <strong>Install Base :</strong>
              </p>
              <ul>
                <li>Total items installed in the field</li>
              </ul>
              <p>
                <strong>Harvest Universe :</strong>
              </p>
              <ul>
                <li>Universe of Opportunities that has potential to be Harvested</li>
              </ul>
            </div>
          )
        });
      } else if (e == 'Consumption') {
        this.setState({
          descriptionTitle: <div>Consumption CapEx Trend(As of Date)- Description</div>,
          WidDescription: (
            <div>
              <p>
                <strong>Consumption CapEx trend :</strong>
              </p>
              <ul>
                <li>Capital Expenditure Trend based on Monthly Consumption</li>
              </ul>
              <p>
                <strong>PO Placed CapEx trend :</strong>
              </p>
              <ul>
                <li>Capital Expenditure Trend based on PO Placed</li>
              </ul>
            </div>
          )
        });
      }
    }
  }
  mapInventoryDD(e) {
    if (this.state.inventoryDDModal == true) {
      this.setState({
        inventoryDDModal: false,
        isDataFetched: false,
        plantDetailsData: []
      });
    } else {
      this.setState({
        inventoryDDModal: true,
        plantHeader: e.currentTarget.id
      });
      if (this.state.usercuid != null) {
        this.props.getPlantDetailsDD(
          e.currentTarget.id,
          this.state.usercuid,

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      } else {
        this.props.getPlantDetailsDD(
          e.currentTarget.id,
          'all',

          parsedFilterSettingsLGORT,
          parsedBlockedDeleted
        );
      }
    }
  }
  loadScript(url) {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.src = url;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  RevenueCalculation(value) {
    let result = '';
    if (value >= 1e3 && value < 1e6) {
      result = (value / 1e3).toFixed(1).replace(/\.0$/, '') + '000';
    }
    if (value >= 1e6 && value < 1e9) {
      result = (value / 1e6).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (value >= 1e9) {
      result = (value / 1e9).toFixed(1).replace(/\.0$/, '') + 'T';
    }
    return result;
  }

  formatYAxis(tickItem) {
    let value = calculation(tickItem);
    return value;
  }

  TooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = calculation(e.payload[0].payload.Total_CapEX);
      return (
        <div className="custom-tooltip">
          <span>
            <b>{e.payload[0].payload.year}</b> <br />
          </span>
          {e.payload[0].payload.Is_Predicted == 'N' ? (
            <span>
              <b> Total CapEx: {value}</b> <br />
            </span>
          ) : (
            <span>
              <b> Predicted CapEx: {value}</b> <br />
            </span>
          )}
        </div>
      );
    }
  }
  POTooltipFormatter(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      let value = calculation(e.payload[0].payload.Total_CapEX);
      return (
        <div className="custom-tooltip">
          <span>
            <b>{e.payload[0].payload.year}</b> <br />
          </span>
          {e.payload[0].payload.ISPREDICTED == 'N' ? (
            <span>
              <b> Total CapEx: {value}</b> <br />
            </span>
          ) : (
            <span>
              <b> Predicted CapEx(With Harvest): {value}</b> <br />
            </span>
          )}
        </div>
      );
    }
  }
  TooltipFormat(e) {
    if (e.active && e.payload !== null && e.payload[0] !== null) {
      return (
        <div className="custom-tooltip">
          <span>
            <b>{e.payload[0].payload.year}</b> <br />
          </span>
          <span>
            <b>ERT Quantity: {e.payload[0].payload.ERT_Qty}</b> <br />
          </span>
        </div>
      );
    }
  }

  tblLoader() {
    if (this.state.isDataFetched || this.state.newResultLength === 0) {
      return (
        <div className="tbl-no-data-found">
          <div>
            <h5>No data available for this criteria</h5>
          </div>
        </div>
      );
    } else {
      return (
        <div className="tbl-loading">
          <h6>Loading</h6>
          <PropagateLoader color={'#fff'} />
        </div>
      );
    }
  }
  // tblLoader() {
  //   if (this.state.isDataFetched == true) {
  //     return (
  //       <div className="tbl-loading">
  //         <h6>Loading</h6>
  //         <PropagateLoader color={"#fff"} />
  //       </div>
  //     );
  //   } else if (this.state.newResultLength == 0) {
  //     return (
  //       <div className="tbl-no-data-found">
  //         <div>
  //           <h5>No data available for this criteria</h5>
  //         </div>
  //       </div>
  //     );
  //   } else {
  //     return (
  //       <div className="tbl-no-data-found">
  //         <div>
  //           <h5>No data available for this criteria</h5>
  //         </div>
  //       </div>
  //     );
  //   }
  // }

  tblLoaderOne() {
    if (this.state.isDataFetched1 || this.state.newResultLength1 === 0) {
      return (
        <div className="tbl-no-data-found">
          <div>
            <h5>No data available for this criteria</h5>
          </div>
        </div>
      );
    } else {
      return (
        <div className="tbl-loading">
          <h6>Loading</h6>
          <PropagateLoader color={'#fff'} />
        </div>
      );
    }
  }

  exportToCSVPlantMaterialView() {
    let csvData = this.state.getMaterialDetailsForMapViewData;
    let fileName = 'Material Plant inventory';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSV() {
    let csvData = this.state.tblDDData;
    let fileDownload =
      this.state.WidName != 'Harvest'
        ? this.state.WidName + ' ' + `${this.state.SwitchData ? 'STOCK' : 'SPARE'}`
        : this.state.WidName;
    //let fileName = {`${this.state.WidName != 'Harvest' ? (this.state.WidName + ' ' + `${this.state.SwitchData ? 'STOCK' : 'SPARE'}`):(this.state.WidName)};
    let fileName = fileDownload;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVPlantDetails() {
    let csvData = this.state.getPlantdetailsData;
    let fileName = 'Plant Details';
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  exportToCSVPlantCurrentInventory() {
    let csvData = this.state.plantDetailsData;
    let fileName = `Plant - ${this.state.plantHeader}`;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }
  imploader() {
    this.setState({
      defaultActiveKey: '1',
      materialmapView: false,
      poView: true,
      pochartData: [],
      ChartData: [],
      radioBtnvalue: 'PO',
      getMaterialDetailsForMapViewData: [],
      isDataFetched1: false,
      defaultValueDD: '',
      mapData: [],
      load: true,
      capExtrendData: [],

      ChartLoader: true,

      harvestData: [],
      isDataFetched: false,
      openHarvestData: 0,
      InstallHarvestData: 0,
      ERTData: 0,
      YTDData: 0,
      TotalHarvestCapEx: 0,
      TotalERTCapEx: 0,
      OpenHarvestCapEx: 0,
      InstallBaseCapEx: 0,
      universeCapEx: 0,
      universeHarvestData: 0
    });
  }

  formatXAxis(tickItem) {
    return moment(tickItem).format('MM-DD-YYYY');
  }
  switchChange() {
    this.setState(
      {
        SwitchData: !this.state.SwitchData
      },
      () => {
        if (this.state.SwitchData) {
          this.setState({
            tblDDData: [],
            isDataFetched: false,
            newResultLength: ''
          });
          this.props.getWidgetDDData(
            'InstallBaseHarvest',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.SwitchData ? 'STOCK' : 'SPARE'
          );
        } else {
          this.setState({
            tblDDData: [],
            isDataFetched: false,
            newResultLength: ''
          });
          this.props.getWidgetDDData(
            'InstallBaseHarvest',
            this.state.usercuid,

            parsedFilterSettingsLGORT,
            parsedBlockedDeleted,
            this.state.SwitchData ? 'STOCK' : 'SPARE'
          );
        }
      }
    );
  }
  onDragEndmaterialMapcolumns(fromIndex, toIndex) {
    const columnsCopy = this.state.materialMapcolumns.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ materialMapcolumns: columnsCopy });
  }
  onDragEndmaterialcolumns(fromIndex, toIndex) {
    const columnsCopy = this.state.materialcolumns.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ materialcolumns: columnsCopy });
  }
  onDragEndcolumns(fromIndex, toIndex) {
    const columnsCopy = this.state.columns.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ columns: columnsCopy });
  }
  onDragEndtblColumn(fromIndex, toIndex) {
    const columnsCopy = this.state.tblColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ tblColumn: columnsCopy });
  }
  render() {
    const consumptionPercentage =
      100 -
      ((this.state.ChartData.length - this.state.monthlyPredictedYCons - 0) /
        (this.state.ChartData.length - 0)) *
        100;
    const popercentage =
      100 -
      ((this.state.pochartData.length - this.state.monthlyPredictedY - 0) /
        (this.state.pochartData.length - 0)) *
        100;

    return (
      <div>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card className="returns-wid harvest-height" size="small">
                <p className="text-white mb-0 widget-text text-left">
                  <i className="fas fa-exchange-alt mr-2" />
                  Harvesting{' '}
                  <Popover placement="right" content={<span>Info</span>}>
                    <i
                      className="fas fa-info-circle info-logo-widget mr-2"
                      onClick={() => this.infoDD('Harvest')}
                    />
                  </Popover>
                </p>
                {this.state.harvestData != 0 ? (
                  <div>
                    <Row className="mt-3">
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="text-center"
                        onClick={() => this.onClickTblDD('InstallBaseHarvest')}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <div className="text-white wid-value wid-harvest">
                            <span> {this.state.InstallBaseCapEx}</span>(
                            <span className="sub-wid-value text-blue">
                              {this.state.InstallHarvestData}
                            </span>
                            )
                          </div>
                          <div className="widget-sub-text text-white">Install Base(QTY)</div>
                        </Col>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="text-center"
                        onClick={() => this.onClickTblDD('Harvestuniverse')}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <div className="text-white wid-value wid-harvest">
                            <span> {this.state.universeCapEx}</span>(
                            <span className="sub-wid-value text-blue">
                              {this.state.universeHarvestData}
                            </span>
                            )
                          </div>
                          <div className="widget-sub-text text-white">Harvest Universe</div>
                        </Col>
                      </Col>
                      <Col
                        xs={6}
                        sm={6}
                        md={6}
                        lg={8}
                        xl={8}
                        className="text-center"
                        onClick={() => this.onClickTblDD('Openuniverse')}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <div className="text-white wid-value wid-harvest">
                            <span> {this.state.OpenHarvestCapEx}</span>(
                            <span className="sub-wid-value text-blue">
                              {this.state.openHarvestData}
                            </span>
                            )
                          </div>
                          <div className="widget-sub-text text-white">Open Harvest(QTY)</div>
                        </Col>
                      </Col>
                    </Row>
                    <Row className="mt-2 ">
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={10}
                        xl={10}
                        className="text-right"
                        onClick={() => this.onClickTblDD('Harvest')}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <div className="text-white wid-value wid-harvest">
                            <span> {this.state.TotalHarvestCapEx}</span>(
                            <span className="sub-wid-value text-blue">{this.state.YTDData}</span>)
                          </div>
                          <div className="widget-sub-text text-white">Total Harvested(QTY)</div>
                        </Col>
                      </Col>
                      <Col
                        xs={24}
                        sm={24}
                        md={24}
                        lg={9}
                        xl={9}
                        className="text-right"
                        onClick={() => this.onClickTblDD('Harvest')}>
                        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                          <div className="text-white wid-value wid-harvest">
                            <span> {this.state.TotalERTCapEx}</span>(
                            <span className="sub-wid-value text-blue">{this.state.ERTData}</span>)
                          </div>
                          <div className="widget-sub-text text-white">Total ERT Received(QTY)</div>
                        </Col>
                      </Col>
                    </Row>
                  </div>
                ) : (
                  <div className="mapjs-loader">
                    <ReusableSysncLoader />
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Card
                bodyStyle={{ height: 225 }}
                title={
                  <div>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} className="fl">
                      {this.state.chartTitle}
                      <Popover placement="right" content={<span>Info</span>}>
                        <i
                          className="fas fa-info-circle info-logo ml-2 "
                          onClick={() => this.infoDD('Consumption')}
                        />
                      </Popover>
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} className="text-right fr">
                      {/*<Button.Group size="small" className="float-right mr-2">
                                        <Button className={btn_class_consumption} id="Consumption" type="primary" onClick={this.chartView}>Consumption</Button>
                                        <Button className={btn_class_po} id="PO" type="primary" onClick={this.chartView}>PO Placed</Button>
                                    </Button.Group>*/}
                      <Radio.Group
                        className="consumption_radio"
                        onChange={this.chartView.bind(this)}
                        value={this.state.radioBtnvalue}>
                        <Radio value="Consumption">Consumption</Radio>
                        <Radio value="PO">PO Placed</Radio>
                      </Radio.Group>
                    </Col>
                  </div>
                }>
                {this.state.poView == false ? (
                  <>
                    {!this.props.getCapExTrendReducerLoader && this.state.ChartData.length > 0 ? (
                      <>
                        {' '}
                        <div className="chart-height">
                          <ResponsiveContainer height={250} width="100%">
                            <AreaChart
                              width={900}
                              height={350}
                              data={this.state.ChartData}
                              margin={{
                                top: 0,
                                right: 30,
                                left: 0,
                                bottom: 0
                              }}>
                              <XAxis
                                dataKey="year"
                                angle={-40}
                                textAnchor="end"
                                height={150}
                                interval={0}
                                stroke="#fff">
                                <Label value="ds" position="bottom" fill="#fff" />
                              </XAxis>
                              <YAxis
                                stroke="#fff"
                                tickFormatter={this.formatYAxis}
                                // old value
                                // domain={[0, "dataMax + 40000000"]}
                                // domain={[0, "dataMax + 200000"]}
                                allowDecimals={false}
                              />
                              <Tooltip content={this.TooltipFormatter} />
                              <defs>
                                <linearGradient id="gradientone11" x1="0" y1="0" x2="100%" y2="0">
                                  <stop offset="0%" stopColor="#1870dc" />
                                  <stop offset={`${consumptionPercentage}%`} stopColor="#1870dc" />
                                  <stop offset={`${consumptionPercentage}%`} stopColor="#63ce46" />
                                  <stop offset="100%" stopColor="#63ce46" />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="Total_CapEX"
                                stroke="url(#gradientone11)"
                                fill="url(#gradientone11)"
                                strokeWidth={3}
                                dot={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    ) : (
                      <>
                        {this.props.getCapExTrendReducerLoader ? (
                          <>
                            <ReusableSysncLoader />{' '}
                          </>
                        ) : (
                          <>
                            <NoDataTextLoader />
                          </>
                        )}
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {!this.props.getCapExTrendPoPlacedReducerLoader &&
                    this.state.pochartData.length > 0 ? (
                      <>
                        <div className="chart-height">
                          <ResponsiveContainer height={250} width="100%">
                            <AreaChart
                              width={900}
                              height={350}
                              data={this.state.pochartData}
                              margin={{
                                top: 0,
                                right: 30,
                                left: 0,
                                bottom: 0
                              }}>
                              <XAxis
                                dataKey="year"
                                angle={-40}
                                textAnchor="end"
                                height={150}
                                interval={0}
                                stroke="#fff">
                                <Label value="ds" position="bottom" fill="#fff" />
                              </XAxis>
                              <YAxis
                                stroke="#fff"
                                tickFormatter={this.formatYAxis}
                                // domain={[0, "dataMax + 40000000"]}
                                allowDecimals={false}
                              />
                              <Tooltip content={this.POTooltipFormatter} />
                              <defs>
                                <linearGradient id="pogradient" x1="0" y1="0" x2="100%" y2="0">
                                  <stop offset="0%" stopColor="#1870dc" />
                                  <stop offset={`${popercentage}%`} stopColor="#1870dc" />
                                  <stop offset={`${popercentage}%`} stopColor="#63ce46" />
                                  <stop offset="100%" stopColor="#63ce46" />
                                </linearGradient>
                              </defs>
                              <Area
                                type="monotone"
                                dataKey="Total_CapEX"
                                stroke="url(#pogradient)"
                                fill="url(#pogradient)"
                                strokeWidth={3}
                                dot={false}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                      </>
                    ) : (
                      <>
                        {this.props.getCapExTrendPoPlacedReducerLoader ? (
                          <ReusableSysncLoader />
                        ) : (
                          <NoDataTextLoader />
                        )}
                      </>
                    )}
                  </>
                )}

                {this.state.poView == false ? (
                  <div className="text-center">
                    <span>
                      <i className="fas fa-circle total-trend-bar" /> - Total CapEx{' '}
                    </span>
                    <span>
                      <i className="fas fa-circle predict-capex" /> - Predicted CapEx{' '}
                    </span>
                  </div>
                ) : (
                  <div className="text-center">
                    <span>
                      <i className="fas fa-circle total-trend-bar" /> - Total CapEx{' '}
                    </span>
                    <span>
                      <i className="fas fa-circle predict-capex" /> - Predicted CapEx(With Harvest){' '}
                    </span>
                  </div>
                )}
                {/*<span><i className="fas fa-circle predict-capex-bar" />  - Predicted CapEx(Next 30 Days) </span>*/}
              </Card>
            </Col>
          </Col>
          <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
            <Card bodyStyle={{ height: 470 }}>
              <Tabs
                activeKey={this.state.defaultActiveKey}
                // defaultActiveKey = '2'
                onChange={this.callback.bind(this)}>
                <TabPane
                  tab={
                    <div>
                      <i className="fas fa-table mr-2" />
                      Material Insights
                    </div>
                  }
                  key="1">
                  {/* Need this for future use  */}
                  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} className="v4">
                    <Col span={12}>
                      <span className="view-text">
                        View :
                        <Switch
                          className="z-index-1"
                          checkedChildren={<i className="fas fa-table" />}
                          unCheckedChildren={<i className="fas fa-map" />}
                          checked={!this.state.materialmapView}
                          onChange={this.getcheckValues}
                        />
                      </span>
                    </Col>
                  </Row>

                  {this.state.materialmapView == false ? (
                    <>
                      {!this.props.getMaterialDetailsForMapViewReducerLoader &&
                      this.state.getMaterialDetailsForMapViewData.length > 0 ? (
                        <>
                          {' '}
                          <ToolkitProvider
                            keyField="id"
                            data={this.state.getMaterialDetailsForMapViewData}
                            columns={this.state.materialcolumns}
                            search={{
                              afterSearch: (newResult) => {
                                if (!newResult.length) {
                                  if (this.state.getMaterialDetailsForMapViewData != '') {
                                    this.setState({
                                      newResultLength1: newResult.length
                                    });
                                  } else {
                                    this.setState({
                                      newResultLength1: ''
                                    });
                                  }
                                }
                              }
                            }}>
                            {(props) => (
                              <div>
                                {/* <Row> */}
                                {/* Need this for future use  */}
                                <Row
                                  className="margin-point-minus-20px "
                                  gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                                  <Col span={12} />
                                  <Col span={12} className="text-right">
                                    <div>
                                      <SearchBar {...props.searchProps} />
                                      {this.state.getMaterialDetailsForMapViewData != 0 ? (
                                        <Button
                                          size="sm"
                                          className="export-Btn ml-2"
                                          onClick={this.exportToCSVPlantMaterialView}
                                          disabled={this.state.disableExcelButton}>
                                          <i className="fas fa-file-excel mr-2" />{' '}
                                          <span className="text-white">Excel</span>
                                        </Button>
                                      ) : (
                                        <Button
                                          size="sm"
                                          className="export-Btn ml-2"
                                          onClick={this.exportToCSVPlantMaterialView}
                                          disabled>
                                          <i className="fas fa-file-excel mr-2" />{' '}
                                          <span className="text-white">Excel</span>
                                        </Button>
                                      )}
                                    </div>
                                  </Col>
                                </Row>
                                <ReactDragListView.DragColumn
                                  onDragEnd={this.onDragEndmaterialcolumns.bind(this)}
                                  nodeSelector="th">
                                  <div className="material-insights-table table-pagination-top">
                                    <BootstrapTable
                                      {...props.baseProps}
                                      pagination={paginationFactory()}
                                      noDataIndication={() => this.tblLoaderOne()}
                                      filter={filterFactory()}
                                    />
                                  </div>
                                </ReactDragListView.DragColumn>
                              </div>
                            )}
                          </ToolkitProvider>
                        </>
                      ) : (
                        <>
                          {this.props.getMaterialDetailsForMapViewReducerLoader ? (
                            <ReusableSysncLoader />
                          ) : (
                            <NoDataTextLoader />
                          )}
                        </>
                      )}
                    </>
                  ) : (
                    <Row className="v4">
                      <div className="map-material-height">
                        <div className="material-dropdown-map  " id="getPopupContainerDiv">
                          <TreeSelect
                            showSearch
                            style={{ width: '30%', fontSize: 16 }}
                            defaultValue={this.state.defaultValueDD}
                            value={this.state.materialNumber}
                            placeholder={this.state.defaultValueDD}
                            allowClear
                            getPopupContainer={() =>
                              document.getElementById('getPopupContainerDiv')
                            }
                            treeDefaultExpandAll
                            onChange={this.handleMaterialChange}
                            className="text-select-form float-right mr-4">
                            {this.state.getMaterialInsightsDropDownData.map((val1, ind1) => (
                              <TreeNode
                                value={`${val1.matnr + val1.lgort}`}
                                title={`${val1.matnr} - ${val1.lgort}`}
                                key={ind1}
                              />
                            ))}
                          </TreeSelect>
                        </div>
                        {!this.props.getMaterialForMapViewReducerLoader &&
                        this.state.getMaterialForMapViewData.length > 0 ? (
                          <>
                            <div id="myMaterialMap" className="mt-3"></div>
                          </>
                        ) : (
                          <>
                            {this.props.getMaterialForMapViewReducerLoader ? (
                              <>
                                <ReusableSysncLoader />{' '}
                              </>
                            ) : (
                              <>
                                <NoDataTextLoader />
                              </>
                            )}
                          </>
                        )}
                      </div>
                    </Row>
                  )}
                </TabPane>
                <TabPane
                  tab={
                    <div>
                      <i className="fas fa-map mr-2" />
                      Plant Insights
                    </div>
                  }
                  key="2">
                  {!this.props.getDataforMapFullViewReducerLoader &&
                  this.state.mapData.length > 0 ? (
                    <>
                      <div className="map-height">
                        <div id="myMap"></div>
                      </div>
                    </>
                  ) : (
                    <>
                      {this.props.getDataforMapFullViewReducerLoader ? (
                        <>
                          {' '}
                          <ReusableSysncLoader />{' '}
                        </>
                      ) : (
                        <>
                          <NoDataTextLoader />{' '}
                        </>
                      )}
                    </>
                  )}
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
        <Modal
          width="75%"
          style={{ top: 60 }}
          footer={null}
          title={
            <div>
              <i className="fas fa-warehouse mr-2" /> Plant Details{' '}
              <Button
                size="sm"
                className="export-Btn mr-3 float-right"
                onClick={this.exportToCSVPlantDetails}>
                <i className="fas fa-file-excel mr-2" /> <span className="text-white">Excel</span>
              </Button>{' '}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.mapDDModal}
          onCancel={this.togglemapDetails}>
          {!this.props.getDataforMapReducerLoader && this.state.mapDDData.length > 0 ? (
            <> {this.state.mapDDData}</>
          ) : (
            <>
              {this.props.getDataforMapReducerLoader ? (
                <>
                  <div style={{ height: '200px' }}>
                    <ReusableSysncLoader />{' '}
                  </div>
                </>
              ) : (
                <>
                  <div style={{ height: '200px' }}>
                    <NoDataTextLoader />{' '}
                  </div>
                </>
              )}
            </>
          )}
        </Modal>
        <Modal
          width="50%"
          style={{ top: 60 }}
          footer={null}
          title={
            <div>
              <i className="fas fa-warehouse mr-2" />
              Plant - {this.state.plantHeader}{' '}
              {this.state.plantDetailsData != 0 ? (
                <Button
                  size="sm"
                  className="export-Btn ml-2 mr-3 float-right"
                  onClick={this.exportToCSVPlantCurrentInventory}>
                  <i className="fas fa-file-excel mr-2" /> <span className="text-white">Excel</span>
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled
                  className="export-Btn ml-2 mr-3 float-right"
                  onClick={this.exportToCSVPlantCurrentInventory}>
                  <i className="fas fa-file-excel mr-2" /> <span className="text-white">Excel</span>
                </Button>
              )}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.inventoryDDModal}
          onCancel={this.mapInventoryDD}>
          <ReactDragListView.DragColumn
            onDragEnd={this.onDragEndcolumns.bind(this)}
            nodeSelector="th">
            <BootstrapTable
              keyField="matnr"
              data={this.state.plantDetailsData}
              columns={this.state.columns}
              pagination={paginationFactory()}
              noDataIndication={() => this.tblLoader()}
              filter={filterFactory()}
            />
          </ReactDragListView.DragColumn>
        </Modal>
        <Modal
          style={{ top: 60 }}
          footer={null}
          title={<div>{this.state.descriptionTitle}</div>}
          className="Intervaltimeline"
          visible={this.state.InfoModal}
          onCancel={this.infoDD}>
          {this.state.WidDescription}
        </Modal>
        <Modal
          width="75%"
          style={{ top: 60 }}
          footer={null}
          title={
            <div>
              <i className="fas fa-warehouse mr-2" /> Material Details - {this.state.materialNumber}{' '}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.mapMaterialModal}
          onCancel={this.togglematerialmapDetails}>
          {!this.props.getMaterialForMapViewDDReducerLoader &&
          this.state.materialDataforPlantViewDD != '' ? (
            <> {this.state.materialDataforPlantViewDD}</>
          ) : (
            <>
              {this.props.getMaterialForMapViewDDReducerLoader ? (
                <>
                  <div style={{ height: '200px' }}>
                    <ReusableSysncLoader />{' '}
                  </div>
                </>
              ) : (
                <>
                  {' '}
                  <div style={{ height: '200px' }}>
                    {' '}
                    <NoDataTextLoader />
                  </div>
                </>
              )}
            </>
          )}
        </Modal>

        <Modal
          style={{ top: 60 }}
          width={this.state.WidName == 'Harvest' ? '50%' : '70%'}
          footer={null}
          title={this.state.tblDDTitle}
          className="Intervaltimeline"
          visible={this.state.tblDDModal}
          onCancel={this.onClickTblDD}>
          <ToolkitProvider
            keyField="id"
            data={this.state.tblDDData}
            columns={this.state.tblColumn}
            search={{
              afterSearch: (newResult) => {
                if (!newResult.length) {
                  if (this.state.tblDDData != '') {
                    this.setState({
                      newResultLength: newResult.length
                    });
                  } else {
                    this.setState({
                      newResultLength: ''
                    });
                  }
                }
              }
            }}>
            {(props) => (
              <div>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12}></Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="text-right">
                    <div>
                      {this.state.WidName != 'Harvest' ? (
                        <>
                          <Popover
                            content={<span>Only affects max keep level value</span>}
                            placement="top">
                            <Switch
                              className="toggleSwitch"
                              checkedChildren="STOCK"
                              unCheckedChildren="SPARE"
                              checked={this.state.SwitchData}
                              onChange={this.switchChange}
                            />
                          </Popover>
                        </>
                      ) : (
                        ''
                      )}

                      <SearchBar {...props.searchProps} />
                      {this.state.tblDDData != 0 ? (
                        <Button size="sm" className="export-Btn ml-2" onClick={this.exportToCSV}>
                          <i className="fas fa-file-excel mr-2" />{' '}
                          <span className="text-white">Excel</span>
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          disabled
                          className="export-Btn ml-2"
                          onClick={this.exportToCSV}>
                          <i className="fas fa-file-excel mr-2" />{' '}
                          <span className="text-white">Excel</span>
                        </Button>
                      )}
                    </div>
                  </Col>
                </Row>
                <ReactDragListView.DragColumn
                  onDragEnd={this.onDragEndtblColumn.bind(this)}
                  nodeSelector="th">
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory()}
                    noDataIndication={() => this.tblLoader()}
                    filter={filterFactory()}
                  />
                </ReactDragListView.DragColumn>
              </div>
            )}
          </ToolkitProvider>
        </Modal>
        <Modal
          style={{ top: 60 }}
          width="60%"
          footer={null}
          title={
            <div>
              <i className="fas fa-chart-line mr-2" />
              Material- {this.state.materialNo}
            </div>
          }
          className="Intervaltimeline"
          visible={this.state.harvestDDModal}
          onCancel={this.onclickHarvestDD}>
          <>
            {!this.props.getHarvestChartDDReducerLoader &&
            this.state.harvestChartDDData.length > 0 ? (
              <>
                {' '}
                <Row className="mt-2 v4">
                  <div className="head-title">Monthly ERT Trend</div>
                  <div className="text-center">
                    <span>
                      <i className="fas fa-circle vendor-date" /> - ERT Quantity{' '}
                    </span>
                  </div>
                  <ResponsiveContainer height={400} width="100%">
                    <LineChart
                      width={900}
                      height={400}
                      data={this.state.harvestChartDDData}
                      margin={{
                        top: 10,
                        right: 30,
                        left: 0,
                        bottom: 0
                      }}>
                      <XAxis
                        dataKey="year"
                        angle={-40}
                        textAnchor="end"
                        height={150}
                        interval={0}
                        stroke="#fff"
                        tickFormatter={this.formatXAxis}>
                        <Label
                          value="Date"
                          style={{ textAnchor: 'middle', fill: '#fff' }}
                          // position="insideLeft"
                          position="centerBottom"
                        />
                      </XAxis>
                      <YAxis stroke="#fff">
                        <Label
                          value="ERT Quantity"
                          angle="-90"
                          style={{ textAnchor: 'middle', fill: '#fff' }}
                          position="insideLeft"
                        />
                      </YAxis>
                      <Tooltip content={this.TooltipFormat} />
                      <Line
                        type="monotone"
                        dataKey="ERT_Qty"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                        strokeWidth={3}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Row>
              </>
            ) : (
              <>
                {this.props.getHarvestChartDDReducerLoader ? (
                  <div style={{ height: '400px' }}>
                    <ReusableSysncLoader />
                  </div>
                ) : (
                  <div style={{ height: '400px' }}>
                    <NoDataTextLoader />
                  </div>
                )}
              </>
            )}
          </>
        </Modal>
      </div>
    );
  }
}

function mapState(state) {
  return {
    capExtrendData: state.getCapExTrend,
    mapData: state.getDataforMapFullView,
    mapDDData: state.getDataforMap,
    plantDetailsData: state.getPlantDetailsDD,
    harvestData: state.getHarvestingWidget,
    tblDDData: state.getWidgetDDData,
    harvestChartDDData: state.getHarvestChartDD,
    pochartData: state.getCapExTrendPoPlaced,
    getMaterialDetailsForMapViewData: state.getMaterialDetailsForMapView,
    getMaterialForMapViewData: state.getMaterialForMapView,

    getMaterialForMapViewDDData: state.getMaterialForMapViewDD,
    getUserImpersonationDetailsData: state.getUserImpersonationDetails,
    getMaterialInsightsDropDownData: state.getMaterialInsightsDropDown,
    getMaterialInsightsDefaultMatnrData: state.getMaterialInsightsDefaultMatnr,
    getCapExTrendReducerLoader: state.getCapExTrendReducerLoader,
    getCapExTrendPoPlacedReducerLoader: state.getCapExTrendPoPlacedReducerLoader,
    getDataforMapFullViewReducerLoader: state.getDataforMapFullViewReducerLoader,
    getMaterialForMapViewReducerLoader: state.getMaterialForMapViewReducerLoader,
    getMaterialDetailsForMapViewReducerLoader: state.getMaterialDetailsForMapViewReducerLoader,
    getHarvestChartDDReducerLoader: state.getHarvestChartDDReducerLoader,
    getDataforMapReducerLoader: state.getDataforMapReducerLoader,
    getMaterialForMapViewDDReducerLoader: state.getMaterialForMapViewDDReducerLoader
  };
}

export default connect(mapState, {
  getMaterialInsightsDropDown,
  getUserImpersonationDetails,
  getMaterialForMapViewDD,
  getCapExTrend,
  getDataforMapFullView,
  getDataforMap,
  getPlantDetailsDD,
  getHarvestingWidget,
  getWidgetDDData,
  getMaterialDetailsForMapView,
  getHarvestChartDD,
  getCapExTrendPoPlaced,
  getMaterialForMapView,

  getMaterialInsightsDefaultMatnr
})(Map);
