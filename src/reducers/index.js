import { combineReducers } from 'redux';
import { EoqTblLoader } from './Loader-reducer/EoqTblLoader';
import { ChatBotToggler } from './chatboxonoff';
import getPredictedBarChart from './getPredictedBarChart';
import getPredictedCapEx from './getPredictedCapEx';
import getStockPercent from './getStockPercent';
import getEOQTbl from './getEOQTbl';
import getCapExTrend from './getCapExTrend';
import getEOQHeaderDD from './getEOQHeaderDD';
import getPredictedChart from './getPredictedChart';
import getDataforMapFullView from './getDataforMapFullView';
import getFillRate from './getFillRate';
import getWidgetDDData from './getWidgetDDData';
import getDataforMap from './getDataforMap';
import getSupplierEfficiency from './getSupplierEfficiency';
import getSuppEfficiencyChart from './getSuppEfficiencyChart';
import getPlantDetailsDD from './getPlantDetailsDD';
import getFillRateUnderStockChart from './getFillRateUnderStockChart';
import getFillRateOverStockChart from './getFillRateOverStockChart';
import getPredictedChartMonth from './getPredictedChartMonth';
import getPOMaterialChart from './getPOMaterialChart';
import getHarvestingWidget from './getHarvestingWidget';
import getHarvestChartDD from './getHarvestChartDD';
import getCapExTrendPoPlaced from './getCapExTrendPoPlaced';
import getOrdersinPipelineDD from './getOrdersinPipelineDD';
import getPredictedCapExDD from './getPredictedCapExDD';
import getExhaustDetails from './getExhaustDetails';
import getExhaustDetailsbyId from './getExhaustDetailsbyId';
import getNotificationDetails from './getNotificationDetails';
import getWeeklyStockVisualization from './getWeeklyStockVisualization';
import getMonthlyStockVisualization from './getMonthlyStockVisualization';
import getExhaustDetailNotification from './getExhaustDetailNotification';
import getMaterialDetailsForMapView from './getMaterialDetailsForMapView';
import getMaterialforPushPull from './getMaterialforPushPull';
import getPONumberForMaterial from './getPONumberForMaterial';
import getPOLineForPO from './getPOLineForPO';
import getCapGovAdvancePo from './getCapGovAdvancePo';
import getCapGovOnOrders from './getCapGovOnOrders';
import getPushPullMaterialDD from './getPushPullMaterialDD';
import getSupplyChainInventoryPos from './getSupplyChainInventoryPos';
import getOrderPushPullMaterial from './getOrderPushPullMaterial';
import getOrderPushPullManufacturer from './getOrderPushPullManufacturer';
import getCapGovMaterialReport from './getCapGovMaterialReport';
import getCapGovInfoForMaterial from './getCapGovInfoForMaterial';
import getMaterialForMapView from './getMaterialForMapView';
import getMaterialForMapViewDD from './getMaterialForMapViewDD';
import getTopSpendsByOrganization from './getTopSpendsByOrganization';
import getCapGovMaterialReport1 from './getCapGovMaterialReport1';
import getCapGovInfoForMaterial1 from './getCapGovInfoForMaterial1';
import getTopSpendsByOrganizationChart from './getTopSpendsByOrganizationChart';
import getUserRole from './getUserRole';
import getHistoricalForecastWeekly from './getHistoricalForecastWeekly';
import getHistoricalSnapshotForecastMinMaxDate from './getHistoricalSnapshotForecastMinMaxDate';
import getExhaustDetailsV2 from './getExhaustDetailsV2';
import getHistoricalForecastMonthly from './getHistoricalForecastMonthly';
import getUserDetailsBySearch from './getUserDetailsBySearch';
import getUserImpersonationDetails from './getUserImpersonationDetails';
import saveImpersonationDetails from './getsaveImpersonationDetails';
import clearImpersonationDetails from './clearImpersonationDetails';
import getApproverList from './getApproverList';
import getApprovalStatusCount from './getApprovalStatusCount';
import getApprovalStatusForMaterial from './getApprovalStatusForMaterial';
import getOrderPushPullMaterialV2 from './getOrderPushPullMaterialV2';
import getOrderPushPullMaterialFlag from './getOrderPushPullMaterialFlag';
import getCapGovMaterialReportDD from './getCapGovMaterialReportDD';
import getTurnOverRate from './getTurnOverRate';
import getTurnOverRateMaterial from './getTurnOverRateMaterial';
import getTurnOverRateManufacturer from './getTurnOverRateManufacturer';
import getBackOrderRateMaterial from './getBackOrderRateMaterial';
import getBackOrderRateManufacturer from '../components/getBackOrderRateManufacturer';
import getBackOrderRateOrganization from './getBackOrderRateOrganization';
import getBackOrderRate from './getBackOrderRate';
import getTurnOverRateOrganization from './getTurnOverRateOrganization';
import getTurnOverRateMaterialMonthwise from './getTurnOverRateMaterialMonthwise';
import getTurnOverRateMonthwise from './getTurnOverRateMonthwise';
import getForcastAccuracyDemand from './getForcastAccuracyDemand';
import getForcastAccuracyMaterial from './getForcastAccuracyMaterial';
import getForcastAccuracyManufacturer from './getForcastAccuracyManufacturer';
import getForcastAccuracyOrganization from './getForcastAccuracyOrganization';
import getTurnOverRateOrgMonthwise from './getTurnOverRateOrgMonthwise';
import getTurnOverRateManufMonthwise from './getTurnOverRateManufMonthwise';
import getBackOrderRateMaterialMonthwise from './getBackOrderRateMaterialMonthwise';
import getBackOrderRateManufMonthwise from './getBackOrderRateManufMonthwise';
import getBackOrderRateOrgMonthwise from './getBackOrderRateOrgMonthwise';
import getForcastAccuracyMaterialMonthwise from './getForcastAccuracyMaterialMonthwise';
import getForcastAccuracyManufMonthwise from './getForcastAccuracyManufMonthwise';
import getForcastAccuracyOrgMonthwise from './getForcastAccuracyOrgMonthwise';
import getBackOrderRateMonthwise from './getBackOrderRateMonthwise';
import getForcastAccuracyMonthwise from './getForcastAccuracyMonthwise';
import getMaterialInsightsDropDown from './getMaterialInsightsDropDown';
import getMaterialInsightsDefaultMatnr from './getMaterialInsightsDefaultMatnr';
import getDefaultMaterialCapGov from './getDefaultMaterialCapGov';
import getMaterialManufFilterList from './getMaterialManufFilterList';
import getReportForNewLeadTime from './getReportForNewLeadTime';
import getLeadTimeTrending from './getLeadTimeTrending';
import getOrganizationList from './getOrganizationList';
import getAllBackOrderRate from './getAllBackOrderRate';
import getAllBackOrderRateMonthwise from './getAllBackOrderRateMonthwise';
import getAllBackOrderRateManufacturer from './getAllBackOrderRateManufacturer';
import getAllBackOrderRateManufMonthwise from './getAllBackOrderRateManufMonthwise';
import getAllBackOrderRateOrganization from './getAllBackOrderRateOrganization';
import getAllBackOrderRateOrgMonthwise from './getAllBackOrderRateOrgMonthwise';
import getKPIForecastAccuracyAnalysisPieChart from './getKPIForecastAccuracyAnalysisPieChart';
import getLeadTimeTrendingMaterialEOQ from './getLeadTimeTrendingMaterialEOQ';
import getLeadTimeMaterial from './getLeadTimeMaterial';
import getLeadTimeTrendingMaterial from './getLeadTimeTrendingMaterial';
import getLeadTimeManuf from './getLeadTimeManuf';
import getLeadTimeTrendingManuf from './getLeadTimeTrendingManuf';
import getLeadTimeOrg from './getLeadTimeOrg';
import getLeadTimeTrendingOrg from './getLeadTimeTrendingOrg';
import getLeadTimeOverall from './getLeadTimeOverall';
import getLeadTimeTrending1 from './getLeadTimeTrending1';
import getReplacedMaterialDetails from './getReplacedMaterialDetails';
import getAllTurnOverRate from './getAllTurnOverRate';
import getAllTurnOverRateMonthwise from './getAllTurnOverRateMonthwise';
import getAllTurnOverRateManufacturer from './getAllTurnOverRateManufacturer';
import getAllTurnOverRateOrganization from './getAllTurnOverRateOrganization';
import getAllTurnOverRateManufMonthwise from './getAllTurnOverRateManufMonthwise';
import getAllTurnOverRateOrgMonthwise from './getAllTurnOverRateOrgMonthwise';
import { ChatBot, DirectLineController } from './ChatBot';
import getNBAOrgBackordersRawData from './getNBAOrgBackordersRawData';
import {
  UpdatePage,
  UpdateSizePerPage,
  UpdateSorting,
  UpdateSearchValue,
  InitialpageRender
} from './IIMExports/IIMExportsParams';
import getForcastAccuracyDemandSample from './getForcastAccuracyDemandSample';
import getNBAOrgoverdueDD from './getNBAOrgoverdueDD';
import getForcastOverwriteDetails from './getForcastOverwriteDetails';
import getReasonCodeList from './getReasonCodeList';
import getForcastAccuracyMinMaxDate from './getForcastAccuracyMinMaxDate';
import getPredictedOrderQuantityColumns from './getPredictedOrderQuantityColumns';
import getTotalCapexforTopMats from './getTotalCapexforTopMats';
import getTotalCapexForMaterial from './getTotalCapexForMaterial';
import getTotalCapexForManufacturer from './getTotalCapexForManufacturer';
import getTotalCapexForOrganization from './getTotalCapexForOrganization';
import getTotalCapexForMonthandYear from './getTotalCapexForMonthandYear';
import getTotalQuantityForMonthAndYear from './getTotalQuantityForMonthAndYear';
import getTotalQuantityAndCapex from './getTotalQuantityAndCapex';
import getTotalQuantityAndCapexMaterialTrend from './getTotalQuantityAndCapexMaterialTrend';
import getOutStandingOrdersMaterial from './getOutStandingOrdersMaterial';
import getTotalQuantityAndCapexManufTrend from './getTotalQuantityAndCapexManufTrend';
import getOutStandingOrdersManuf from './getOutStandingOrdersManuf';
import getOutStandingOrdersOrg from './getOutStandingOrdersOrg';
import getTotalQuantityAndCapexOrgTrend from './getTotalQuantityAndCapexOrgTrend';
import getOustandingOrdersMonthwise from './getOustandingOrdersMonthwise';
import getTopTrendingMatsDD from './getTopTrendingMatsDD';
import getForcastAccuracyQuarterly from './getForcastAccuracyQuarterly';
import getForcastAccuracyQuarterlyTrend from './getForcastAccuracyQuarterlyTrend';
import getForcastAccuracyMaterialQuarterly from './getForcastAccuracyMaterialQuarterly';
import getForcastAccuracyManufacturerQuarterly from './getForcastAccuracyManufacturerQuarterly';
import getForcastAccuracyOrganizationQuarterly from './getForcastAccuracyOrganizationQuarterly';
import getForcastAccuracyMaterialQuarterlyTrend from './getForcastAccuracyMaterialQuarterlyTrend';
import getForcastAccuracyManufQuarterlyTrend from './getForcastAccuracyManufQuarterlyTrend';
import getForcastAccuracyOrgQuarterlyTrend from './getForcastAccuracyOrgQuarterlyTrend';
import getLeadTimeMaterialTrendwise from './getLeadTimeMaterialTrendwise';
import getLeadTimeMaterialTrendwiseUp from './getLeadTimeMaterialTrendwiseUp';
import getLeadTimeMaterialTrendwiseDown from './getLeadTimeMaterialTrendwiseDown';
import getLeadTimeMaterialTrendwiseNeutral from './getLeadTimeMaterialTrendwiseNeutral';
import getPushPullNotificationMessages from './getPushPullNotificationMessages';
import getPushPullDetailByUser from './getPushPullDetailByUser';
import getUserImpersonationDetailsRefresh from './getUserImpersonationDetailsRefresh';
import { getTotalQuantityAndCapexLoader } from './Loader-reducer/getTotalQuantityAndCapexLoader';
import getOrderPushPullReviewData from './getOrderPushPullReviewData';
import getOrderPushPullApproverReviewData from './getOrderPushPullApproverReviewData';
import getForecastOverrideApproverList from './getForecastOverrideApproverList';
import getForecastOverrideApproverReview from './getForecastOverrideApproverReview';
import getCurrentInventoryCapexManufDD from './getCurrentInventoryCapexManufDD';
import { ReportFilterToggle } from './Loader-reducer/ReportFilterToggle';
import getSampleFileFormatForecastOverride from './getSampleFileFormatForecastOverride';
import getForecastOverrideOverview from './getForecastOverrideOverview';
import getForecastOverrideStatusCount from './getForecastOverrideStatusCount';
import getForecastOverrideReviewData from './getForecastOverrideReviewData';
import getBoCriticalityReportApproverReview from './getBoCriticalityReportApproverReview';
import getBoCriticalityReportApproverList from './getBoCriticalityReportApproverList';
import getBoCriticalityReportInvalid from './getBoCriticalityReportInvalid';
import getBoCriticalityReportMinMaxDate from './getBoCriticalityReportMinMaxDate';
import getBoCriticalityFinalReport from './getBoCriticalityFinalReport';
import getNBAMaterialGeneralInfo from './getNBAMaterialGeneralInfo';
import getNBAMaterialKeymetrics from './getNBAMaterialKeymetrics';
import getNBAMaterialReminder from './getNBAMaterialReminder';
import getNBAInventorySummaryMaterial from './getNBAInventorySummaryMaterial';
import getNBAAnnouncements from './getNBAAnnouncements';
import getNBACapGovRequest from './getNBACapGovRequest';
import getInventorySummaryManufacturerDD from './getInventorySummaryManufacturerDD';
import getInventorySummaryManufacturer from './getInventorySummaryManufacturer';
import getInventorySummaryVendorDD from './getInventorySummaryVendorDD';
import getInventorySummaryVendor from './getInventorySummaryVendor';
import getNBAHarvesting from './getNBAHarvesting';
import getNBAOutstandingOrders from './getNBAOutstandingOrders';
import getNBAOverdue from './getNBAOverdue';
import { SwitchData } from './SwitchData';
import getNBAMaterialReportDD from './getNBAMaterialReportDD';
import getNBAOutstandingOrdersDD from './getNBAOutstandingOrdersDD';
import getNBAOverdueDD from './getNBAOverdueDD';
import getNBAFillrate from './getNBAFillrate';
import getNBASlaMet from './getNBASlaMet';
import getNBASlaMetDD from './getNBASlaMetDD';
import getNBAFillrateDD from './getNBAFillrateDD';
import getNBAInventoryCapexDD from './getNBAInventoryCapexDD';
import getNBABackorders from './getNBABackorders';
import getNBABackordersDD from './getNBABackordersDD';
import getNBADefaultMaterialReport from './getNBADefaultMaterialReport';
import getLeadtimeOverwriteReview from './getLeadtimeOverwriteReview';
import getNBAOrgBackordersDD from './getNBAOrgBackordersDD';
import getNBAOrgTotalPartsDD from './getNBAOrgTotalPartsDD';

import { ReportNavHideShow } from './Loader-reducer/ReportNavHideShow';
import getNBAOrgDetails from './getNBAOrgDetails';
import getNBATrendAnalysis from './getNBATrendAnalysis';
import getNBAOrgOrdersChart from './getNBAOrgOrdersChart';
import getNBABackorderQtyMaterialMonthwise from './getNBABackorderQtyMaterialMonthwise';
import getNBAOrgCapGovRequest from './getNBAOrgCapGovRequest';
import getNBAOrgTotalHarvest from './getNBAOrgTotalHarvest';
import getNBAOrgOpenHarvest from './getNBAOrgOpenHarvest';
import getNBAOrgAnnouncements from './getNBAOrgAnnouncements';
import getNBAOrgCurrentInventoryDD from './getNBAOrgCurrentInventoryDD';
import getNBAOrgCapGovChart from './getNBAOrgCapGovChart';
import getNBAOrgSlaMetDD from './getNBAOrgSlaMetDD';
import getNBAOrgFillrateDD from './getNBAOrgFillrateDD';
import getNBAOrgTotalHarvestDD from './getNBAOrgTotalHarvestDD';
import getNBAOrgOpenHarvestDD from './getNBAOrgOpenHarvestDD';
import getNBAOrgCapGovMaterialBreakDown from './getNBAOrgCapGovMaterialBreakDown';
import getNBAOrgBackorderQtyMonthwise from './getNBAOrgBackorderQtyMonthwise';
import getNBAOrgAnnouncementsDD from './getNBAOrgAnnouncementsDD';
import getNBAManufacturerWidget2 from './getNBAManufacturerWidget2';
import getNBAManufacturerWidget1 from './getNBAManufacturerWidget1';
import getNBAManufCapGovGraph from './getNBAManufCapGovGraph';
import getNBAManufCapGovPercent from './getNBAManufCapGovPercent';
import getNBAManufCapGovPlots from './getNBAManufCapGovPlots';
import getNBAManufCapGovRequest from './getNBAManufCapGovRequest';
import getNBAManufBackorders from './getNBAManufBackorders';
import getNBAManufAwaitingRepairs from './getNBAManufAwaitingRepairs';
import getNBAManufOrdersChart from './getNBAManufOrdersChart';
import getNBAManufOverDueDD from './getNBAManufOverDueDD';
import getNBAManufOutStandingOrdersDD from './getNBAManufOutStandingOrdersDD';
import getNBAManufTrendAnalysis from './getNBAManufTrendAnalysis';
import getNBAManufCurrentInventoryCapexDD from './getNBAManufCurrentInventoryCapexDD';
import getNBAManufSlametDD from './getNBAManufSlametDD';
import getNBAManufVendorsDD from './getNBAManufVendorsDD';
import getNBAManufMaterialDD from './getNBAManufMaterialDD';
import getNBAManufAvgEarlyDaysDD from './getNBAManufAvgEarlyDaysDD';
import getNBAManufLeadtimeDD from './getNBAManufLeadtimeDD';
import getNBAManufAnnouncements from './getNBAManufAnnouncements';
import getNBAManufAnnouncementsDD from './getNBAManufAnnouncementsDD';
import getNBAManufCapGovMatnrBreakdown from './getNBAManufCapGovMatnrBreakdown';
import getNBAManufAwaitingRepairsDD from './getNBAManufAwaitingRepairsDD';
import getNBAManufBackOrdersDD from './getNBAManufBackOrdersDD';
import getNBAManufBackordersMaterialDD from './getNBAManufBackordersMaterialDD';
import getNBAManufBackordersRawData from './getNBAManufBackordersRawData';
import getKPIForecastAccuracyAnalysis from './getKPIForecastAccuracyAnalysis';
import getBulkExport from './getBulkExport';
import getLeadtimeExpiryNotification from './getLeadtimeExpiryNotification';
import getLeadtimeExpiryNotificationDd from './getLeadtimeExpiryNotificationDd';
import getBulkExcelExport from './getBulkExcelExport';
import getBulkExcelExportBlob from './getBulkExcelExportBlob';
import getBulkExportColNames from './getBulkExportColNames';
import getBulkExportColValues from './getBulkExportColValues';
import getIIMVideos from './getIIMVideos';
import getMatnrBulkUploadOverview from './getMatnrBulkUploadOverview';
import getMatnrUploadBulkInvalid from './getMatnrUploadBulkInvalid';
import getTopTrendingMatsPieChart from './getTopTrendingMatsPieChart';
import getTopTrendingMaterialGraph from './getTopTrendingMaterialGraph';
import getMaterialFilter from './getMaterialFilter';
import getNBAOrgOutstandingOrdersDD from './getNBAOrgOutstandingOrdersDD';

import {
  getNBAMaterialReminderLoaderReducer,
  getNBACapGovRequestLoaderReducer,
  getNBAInventorySummaryMaterialLoaderReducer,
  getNBAAnnouncementsLoaderReducer,
  getCapGovMaterialReportLoaderReducer,
  getDefaultMaterialCapGovLoaderReducer,
  GetNBAMaterialGeneralInfoLoaderReducer,
  GetEOQHeaderDDLoaderReducer,
  getNBAMaterialKeymetricsLoaderReducer,
  getForcastAccuracyMaterialMonthwiseLoaderReducer,
  getPredictedChartMonthLoaderReducer,
  getLeadTimeTrendingMaterialEOQLoaderReducer,
  getMonthlyStockVisualizationLoaderReducer,
  getTurnOverRateMaterialMonthwiseLoaderReducer,
  getWeeklyStockVisualizationLoaderReducer,
  getPredictedChartLoaderReducer,
  getInventorySummaryManufacturerDDLoaderReducer,
  getInventorySummaryVendorDDLoaderReducer,
  getCapGovInfoForMaterialLoaderReducer,
  getPOMaterialChartReducerLoader,
  getHistoricalForecastMonthlyReducerLoader,
  getHistoricalForecastWeeklyReducerLoader,
  getBackOrderRateMaterialMonthwiseReducerLoader,
  getNBAHarvestingReducerLoader,
  getHarvestChartDDReducerLoader,
  getNBAOutstandingOrdersReducerLoader,
  getNBAOverdueReducerLoader,
  getNBAOutstandingOrdersDDReducerLoader,
  getNBAOverdueDDReducerLoader,
  getNBAFillrateReducerLoader,
  getNBASlaMetReducerLoader,
  getNBASlaMetDDReducerLoader,
  getNBAFillrateDDReducerLoader,
  getNBAInventoryCapexDDReducerLoader,
  getBackOrderRateMonthwiseReducerLoader,
  getNBABackordersDDReducerLoader,
  getNBABackordersReducerLoader,
  getNBABackorderQtyMaterialMonthwiseReducerLoader
} from './NBALoader';
import {
  getTurnOverRateOrgMonthwiseLoaderReducer,
  getBackOrderRateOrgMonthwiseReducerLoader,
  getLeadTimeTrendingOrgLoaderReducer,
  getForcastAccuracyOrgMonthwiseLoaderReducer,
  getNBAOrgDetailsLoaderReducer,
  getNBAOrgOrdersChartLoaderReducer,
  getNBATrendAnalysisLoaderReducer,
  getNBAOrgOpenHarvestLoaderReducer,
  getNBAOrgTotalHarvestLoaderReducer,
  getNBAOrgAnnouncementsLoaderReducer,
  getNBAOrgCurrentInventoryDDLoaderReducer,
  getNBAOrgBackordersDDLoaderReducer,
  getNBAOrgTotalPartsDDLoaderReducer,
  getNBAOrgCapGovChartLoaderReducer,
  getNBAOrgSlaMetDDLoaderReducer,
  getNBAOrgFillrateDDLoaderReducer,
  getNBAOrgTotalHarvestDDLoaderReducer,
  getNBAOrgOpenHarvestDDLoaderReducer,
  getWidgetDDDataLoaderReducer,
  getNBAOrgCapGovMaterialBreakDownLoaderReducer,
  getNBAOrgBackorderQtyMonthwiseLoaderReducer,
  getNBAOrgAnnouncementsDDLoaderReducer,
  getNBAOrgoverdueDDLoaderReducer,
  getNBAOrgOutstandingOrdersDDLoaderReducer,
  getNBAOrgBackordersRawDataLoaderReducer
} from './NBALoaderOrg';
import {
  getLeadtimeOverwriteReviewReducerLoader,
  getReportForNewLeadTimeReducerLoader,
  getCapExTrendReducerLoader,
  getCapExTrendPoPlacedReducerLoader,
  getDataforMapFullViewReducerLoader,
  getMaterialForMapViewReducerLoader,
  getMaterialDetailsForMapViewReducerLoader,
  getDataforMapReducerLoader,
  getMaterialForMapViewDDReducerLoader,
  getSuppEfficiencyChartReducerLoader,
  getPredictedChartReducerLoader,
  getLeadtimeExpiryNotificationDdReducerLoader,
  getMatnrUploadBulkInvalidReducerLoader,
  getExhaustDetailsbyIdReducerLoader,
  getMatnrBulkUploadOverviewReducerLoader
} from './DashboardLoader';
import {
  getCapGovMaterialReport1ReducerLoader,
  getCapGovInfoForMaterial1ReducerLoader
} from './CapgovTopOrgLoader';
import {
  getLeadTimeTrendingMaterialReducerLoader,
  getLeadTimeMaterialTrendwiseLoaderReducerLoader,
  getAllTurnOverRateManufMonthwiseReducerLoader,
  getAllTurnOverRateOrgMonthwiseReducerLoader,
  getAllBackOrderRateManufMonthwiseReducerLoader,
  getAllBackOrderRateOrgMonthwiseReducerLoader,
  getForcastAccuracyMaterialQuarterlyTrendReducerLoader,
  getForcastAccuracyManufQuarterlyTrendReducerLoader,
  getForcastAccuracyOrgQuarterlyTrendReducerLoader,
  getKPIForecastAccuracyAnalysisReducerLoader,
  getKPIForecastAccuracyAnalysisPieChartReducerLoader,
  getOutStandingOrdersMaterialReducerLoader,
  getTotalQuantityAndCapexMaterialTrendReducerLoader,
  getOutStandingOrdersManufReducerLoader,
  getTotalQuantityAndCapexManufTrendReducerLoader,
  getOutStandingOrdersOrgReducerLoader,
  getTotalQuantityAndCapexOrgTrendReducerLoader,
  getTopTrendingMatsDDReducerLoader,
  getTopTrendingMatsPieChartReducerLoader,
  getTopTrendingMaterialGraphReducerLoader
} from './KpiPageLoader';
import {
  getTurnOverRateManufMonthwiseReducerLoader,
  getBackOrderRateManufMonthwiseReducerLoader,
  getLeadTimeTrendingManufReducerLoader,
  getForcastAccuracyManufMonthwiseReducerLoader,
  getNBAManufacturerWidget2ReducerLoader,
  getNBAManufacturerWidget1ReducerLoader,
  getNBAManufCapGovGraphReducerLoader,
  getNBAManufCapGovPercentReducerLoader,
  getNBAManufCapGovRequestReducerLoader,
  getNBAManufCapGovPlotsReducerLoader,
  getNBAManufBackordersReducerLoader,
  getNBAManufAwaitingRepairsReducerLoader,
  getNBAManufOrdersChartReducerLoader,
  getNBAManufOverDueDDReducerLoader,
  getNBAManufOutStandingOrdersDDReducerLoader,
  getNBAManufTrendAnalysisReducerLoader,
  getNBAManufCurrentInventoryCapexDDReducerLoader,
  getNBAManufSlametDDReducerLoader,
  getNBAManufVendorsDDReducerLoader,
  getNBAManufMaterialDDReducerLoader,
  getNBAManufAvgEarlyDaysDDReducerLoader,
  getNBAManufLeadtimeDDReducerLoader,
  getNBAManufAnnouncementsReducerLoader,
  getNBAManufAnnouncementsDDReducerLoader,
  getNBAManufCapGovMatnrBreakdownReducerLoader,
  getNBAManufAwaitingRepairsDDReducerLoader,
  getNBAManufBackOrdersDDReducerLoader,
  getNBAManufBackordersMaterialDDReducerLoader,
  getNBAManufBackordersRawDataReducerLoader
} from './NBAManufLoader';
import {
  getBulkExportReducerLoader,
  getBulkExportColValuesReducerLoader
} from './IIMReportsLoader';
import {
  HandleforecastModal,
  HandleleadTimeModal,
  HandlematerialOnBoardModal
} from '../reducers/IIMUploads/IIMUploadsParams';

const rootReducer = combineReducers({
  //iimUploads
  HandleforecastModal,
  HandleleadTimeModal,
  HandlematerialOnBoardModal,
  getMatnrBulkUploadOverview,
  getMatnrUploadBulkInvalid,
  getTopTrendingMatsPieChart,
  getTopTrendingMaterialGraph,
  getMaterialFilter,
  getNBAOrgOutstandingOrdersDD,

  getMatnrBulkUploadOverviewReducerLoader,
  //IIMReports
  getBulkExportReducerLoader,
  getBulkExportColValuesReducerLoader,
  //Cap-gov-top-org dd
  getCapGovMaterialReport1ReducerLoader,
  getCapGovInfoForMaterial1ReducerLoader,
  //Kpi_page Loaders
  getLeadTimeTrendingMaterialReducerLoader,
  getLeadTimeMaterialTrendwiseLoaderReducerLoader,
  getAllTurnOverRateManufMonthwiseReducerLoader,
  getAllTurnOverRateOrgMonthwiseReducerLoader,
  getAllBackOrderRateManufMonthwiseReducerLoader,
  getAllBackOrderRateOrgMonthwiseReducerLoader,
  getForcastAccuracyMaterialQuarterlyTrendReducerLoader,
  getForcastAccuracyManufQuarterlyTrendReducerLoader,
  getForcastAccuracyOrgQuarterlyTrendReducerLoader,
  getKPIForecastAccuracyAnalysisReducerLoader,
  getKPIForecastAccuracyAnalysisPieChartReducerLoader,
  getOutStandingOrdersMaterialReducerLoader,
  getTotalQuantityAndCapexMaterialTrendReducerLoader,
  getOutStandingOrdersManufReducerLoader,
  getTotalQuantityAndCapexManufTrendReducerLoader,
  getOutStandingOrdersOrgReducerLoader,
  getTotalQuantityAndCapexOrgTrendReducerLoader,
  getTopTrendingMatsDDReducerLoader,
  getTopTrendingMatsPieChartReducerLoader,
  getTopTrendingMaterialGraphReducerLoader,
  //nba_manuf-loaders
  getTurnOverRateManufMonthwiseReducerLoader,
  getNBAManufacturerWidget2ReducerLoader,
  getNBAManufacturerWidget1ReducerLoader,
  getNBAManufCapGovGraphReducerLoader,
  getNBAManufCapGovPercentReducerLoader,
  getNBAManufCapGovRequestReducerLoader,
  getNBAManufCapGovPlotsReducerLoader,
  getLeadTimeTrendingManufReducerLoader,
  getBackOrderRateManufMonthwiseReducerLoader,
  getForcastAccuracyManufMonthwiseReducerLoader,
  getNBAManufBackordersReducerLoader,
  getNBAManufAwaitingRepairsReducerLoader,
  getNBAManufOrdersChartReducerLoader,
  getNBAManufOverDueDDReducerLoader,
  getNBAManufOutStandingOrdersDDReducerLoader,
  getNBAManufTrendAnalysisReducerLoader,
  getNBAManufCurrentInventoryCapexDDReducerLoader,
  getNBAManufSlametDDReducerLoader,
  getNBAManufVendorsDDReducerLoader,
  getNBAManufMaterialDDReducerLoader,
  getNBAManufAvgEarlyDaysDDReducerLoader,
  getNBAManufLeadtimeDDReducerLoader,
  getNBAManufAnnouncementsReducerLoader,
  getNBAManufAnnouncementsDDReducerLoader,
  getNBAManufCapGovMatnrBreakdownReducerLoader,
  getNBAManufAwaitingRepairsDDReducerLoader,
  getNBAManufBackOrdersDDReducerLoader,
  getNBAManufBackordersMaterialDDReducerLoader,
  getNBAManufBackordersRawDataReducerLoader,
  //nba_manuf-loaders
  //dashboard Loaders
  getLeadtimeOverwriteReviewReducerLoader,
  getReportForNewLeadTimeReducerLoader,
  getCapExTrendReducerLoader,
  getCapExTrendPoPlacedReducerLoader,
  getDataforMapFullViewReducerLoader,
  getMaterialForMapViewReducerLoader,
  getMaterialDetailsForMapViewReducerLoader,
  getDataforMapReducerLoader,
  getMaterialForMapViewDDReducerLoader,
  getSuppEfficiencyChartReducerLoader,
  getPredictedChartReducerLoader,
  getLeadtimeExpiryNotificationDdReducerLoader,
  getMatnrUploadBulkInvalidReducerLoader,
  getExhaustDetailsbyIdReducerLoader,
  //NBA Org Loaders
  getBackOrderRateOrgMonthwiseReducerLoader,
  getNBABackorderQtyMaterialMonthwiseReducerLoader,
  getNBATrendAnalysisLoaderReducer,
  getNBAOrgOpenHarvestLoaderReducer,
  getNBAOrgTotalHarvestLoaderReducer,
  getNBAOrgAnnouncementsLoaderReducer,
  getNBAOrgCurrentInventoryDDLoaderReducer,
  getNBAOrgBackordersDDLoaderReducer,
  getNBAOrgTotalPartsDDLoaderReducer,
  getNBAOrgCapGovChartLoaderReducer,
  getNBAOrgSlaMetDDLoaderReducer,
  getNBAOrgFillrateDDLoaderReducer,
  getNBAOrgTotalHarvestDDLoaderReducer,
  getNBAOrgOpenHarvestDDLoaderReducer,
  getWidgetDDDataLoaderReducer,
  getNBAOrgCapGovMaterialBreakDownLoaderReducer,
  getNBAOrgBackorderQtyMonthwiseLoaderReducer,
  getNBAOrgAnnouncementsDDLoaderReducer,
  getNBAOrgoverdueDDLoaderReducer,
  getNBAOrgOutstandingOrdersDDLoaderReducer,
  getNBAOrgBackordersRawDataLoaderReducer,
  getTurnOverRateOrgMonthwiseLoaderReducer,
  getLeadTimeTrendingOrgLoaderReducer,
  getForcastAccuracyOrgMonthwiseLoaderReducer,
  getNBAOrgDetailsLoaderReducer,
  getNBAOrgOrdersChartLoaderReducer,
  //NBALoaders
  getWeeklyStockVisualizationLoaderReducer,
  getNBABackordersReducerLoader,
  getNBABackordersDDReducerLoader,
  getBackOrderRateMonthwiseReducerLoader,
  getInventorySummaryVendorDDLoaderReducer,
  getInventorySummaryManufacturerDDLoaderReducer,
  getPredictedChartLoaderReducer,
  getNBAMaterialReminderLoaderReducer,
  getNBAFillrateDDReducerLoader,
  getNBAInventoryCapexDDReducerLoader,

  getNBASlaMetDDReducerLoader,
  getNBACapGovRequestLoaderReducer,
  getNBAInventorySummaryMaterialLoaderReducer,
  getNBAAnnouncementsLoaderReducer,
  getCapGovMaterialReportLoaderReducer,
  getDefaultMaterialCapGovLoaderReducer,
  GetNBAMaterialGeneralInfoLoaderReducer,
  GetEOQHeaderDDLoaderReducer,
  getNBAMaterialKeymetricsLoaderReducer,
  getForcastAccuracyMaterialMonthwiseLoaderReducer,
  getPredictedChartMonthLoaderReducer,
  getLeadTimeTrendingMaterialEOQLoaderReducer,
  getMonthlyStockVisualizationLoaderReducer,
  getNBAOrgDetails,
  getTurnOverRateMaterialMonthwiseLoaderReducer,
  getCapGovInfoForMaterialLoaderReducer,
  getPOMaterialChartReducerLoader,
  getHistoricalForecastMonthlyReducerLoader,
  getHistoricalForecastWeeklyReducerLoader,
  getBackOrderRateMaterialMonthwiseReducerLoader,
  getNBAHarvestingReducerLoader,
  getHarvestChartDDReducerLoader,
  getNBAOutstandingOrdersReducerLoader,
  getNBAOverdueReducerLoader,
  getNBAOutstandingOrdersDDReducerLoader,
  getNBAOverdueDDReducerLoader,
  getNBAFillrateReducerLoader,
  getNBASlaMetReducerLoader,
  //loaders
  EoqTblLoaders: EoqTblLoader,
  getBoCriticalityReportMinMaxDate: getBoCriticalityReportMinMaxDate,
  ReportFilterToggles: ReportFilterToggle,
  ReportNavHideShows: ReportNavHideShow,
  getTotalQuantityAndCapexLoader: getTotalQuantityAndCapexLoader,
  SwitchData,
  //loaders - end;
  getNBAOrgOrdersChart,
  getNBAOrgBackordersDD,
  getNBAOrgOpenHarvest,
  getNBAOrgTotalHarvest,
  getNBAOrgAnnouncements,
  getNBAOrgCurrentInventoryDD,
  getNBAOrgCapGovChart,
  getNBAOrgSlaMetDD,
  getNBAOrgFillrateDD,
  getNBAOrgCapGovRequest,
  getNBABackorderQtyMaterialMonthwise,
  getNBATrendAnalysis,
  getNBAHarvesting: getNBAHarvesting,
  getLeadtimeOverwriteReview,
  getNBAInventoryCapexDD,
  getNBADefaultMaterialReport,
  getNBAOrgTotalHarvestDD,
  getNBAOrgOpenHarvestDD,
  getNBAOrgCapGovMaterialBreakDown,
  getNBAOrgBackorderQtyMonthwise,
  getNBAOrgAnnouncementsDD,
  getNBAManufacturerWidget2,
  getNBAManufacturerWidget1,
  getNBAManufCapGovGraph,
  getNBAManufCapGovPercent,
  getNBAManufCapGovPlots,
  getNBAManufCapGovRequest,
  getNBAManufBackorders,
  getNBAManufAwaitingRepairs,
  getNBAManufOrdersChart,
  getNBAManufOverDueDD,
  getNBAManufOutStandingOrdersDD,
  getNBAManufTrendAnalysis,
  getNBAManufCurrentInventoryCapexDD,
  getNBAManufSlametDD,
  getNBAManufVendorsDD,
  getNBAManufMaterialDD,
  getNBAManufAvgEarlyDaysDD,
  getNBAManufLeadtimeDD,
  getNBAManufAnnouncements,
  getNBAManufAnnouncementsDD,
  getNBAManufCapGovMatnrBreakdown,
  getNBAManufAwaitingRepairsDD,
  getNBAManufBackOrdersDD,
  getNBAManufBackordersMaterialDD,
  getNBAManufBackordersRawData,
  getKPIForecastAccuracyAnalysis,
  getBulkExport,
  getLeadtimeExpiryNotification,
  getNBABackorders,
  getLeadtimeExpiryNotificationDd,
  getBulkExcelExport,
  getBulkExcelExportBlob,
  getBulkExportColNames,
  getBulkExportColValues,
  getIIMVideos,
  getNBAFillrateDD,
  getNBAOverdue,
  getNBASlaMetDD,
  getNBABackordersDD,
  getNBAOrgTotalPartsDD,
  getNBAFillrate,
  getNBASlaMet,
  getNBAOverdueDD,
  getNBAOutstandingOrdersDD,
  getInventorySummaryVendor: getInventorySummaryVendor,
  getInventorySummaryVendorDD: getInventorySummaryVendorDD,
  getInventorySummaryManufacturer: getInventorySummaryManufacturer,
  getInventorySummaryManufacturerDD: getInventorySummaryManufacturerDD,
  getNBACapGovRequest: getNBACapGovRequest,
  getNBAAnnouncements: getNBAAnnouncements,
  getNBAMaterialGeneralInfo: getNBAMaterialGeneralInfo,
  getNBAInventorySummaryMaterial: getNBAInventorySummaryMaterial,
  getBoCriticalityFinalReport: getBoCriticalityFinalReport,
  getNBAMaterialReminder: getNBAMaterialReminder,
  getNBAMaterialKeymetrics: getNBAMaterialKeymetrics,
  getBoCriticalityReportInvalid: getBoCriticalityReportInvalid,
  getBoCriticalityReportApproverList: getBoCriticalityReportApproverList,
  getBoCriticalityReportApproverReview: getBoCriticalityReportApproverReview,
  getForecastOverrideReviewData: getForecastOverrideReviewData,
  getForecastOverrideOverview: getForecastOverrideOverview,
  getForecastOverrideStatusCount: getForecastOverrideStatusCount,
  getSampleFileFormatForecastOverride: getSampleFileFormatForecastOverride,
  getCurrentInventoryCapexManufDD: getCurrentInventoryCapexManufDD,
  getForecastOverrideApproverReview: getForecastOverrideApproverReview,
  getForecastOverrideApproverList: getForecastOverrideApproverList,
  getOrderPushPullApproverReviewData,
  getNBAMaterialReportDD,
  getOrderPushPullReviewData,
  getUserImpersonationDetailsRefresh,
  getPushPullNotificationMessages,
  getNBAOutstandingOrders,
  getPushPullDetailByUser,
  getLeadTimeMaterialTrendwiseNeutral,
  getLeadTimeMaterialTrendwiseDown,
  getLeadTimeMaterialTrendwiseUp,
  getLeadTimeMaterialTrendwise,
  getForcastAccuracyOrgQuarterlyTrend,
  getForcastAccuracyManufQuarterlyTrend,
  getForcastAccuracyMaterialQuarterlyTrend,
  getForcastAccuracyManufacturerQuarterly,
  getForcastAccuracyOrganizationQuarterly,
  getForcastAccuracyMaterialQuarterly,
  getForcastAccuracyQuarterlyTrend,
  getForcastAccuracyQuarterly,
  getOustandingOrdersMonthwise,
  getTotalQuantityAndCapexOrgTrend,
  getOutStandingOrdersOrg,
  getOutStandingOrdersManuf,
  getTotalQuantityAndCapexManufTrend,
  getTopTrendingMatsDD,
  getOutStandingOrdersMaterial,
  getTotalQuantityAndCapexMaterialTrend,
  getTotalQuantityForMonthAndYear,
  getTotalQuantityAndCapex,
  getTotalCapexForMonthandYear,
  getTotalCapexForOrganization,
  getTotalCapexforTopMats,
  getTotalCapexForMaterial,
  getTotalCapexForManufacturer,
  getPredictedOrderQuantityColumns,
  getForcastAccuracyMinMaxDate,
  getReasonCodeList,
  getForcastAccuracyDemandSample,
  getNBAOrgoverdueDD,
  getForcastOverwriteDetails,
  ChatBot,
  UpdatePage,
  InitialpageRender,
  UpdateSizePerPage,
  UpdateSorting,
  UpdateSearchValue,

  DirectLineController,
  getAllTurnOverRateOrgMonthwise,
  getNBAOrgBackordersRawData,
  getAllTurnOverRateManufMonthwise,
  getAllTurnOverRateOrganization,
  getAllTurnOverRateManufacturer,
  getAllTurnOverRateMonthwise,
  getAllTurnOverRate,
  ChatBotToggler,
  getReplacedMaterialDetails,
  getLeadTimeTrending1,
  getLeadTimeOverall,
  getLeadTimeTrendingOrg,
  getLeadTimeOrg,
  getLeadTimeTrendingManuf,
  getLeadTimeManuf,
  getLeadTimeTrendingMaterial,
  getLeadTimeMaterial,
  getLeadTimeTrendingMaterialEOQ,
  getAllBackOrderRateOrgMonthwise,
  getKPIForecastAccuracyAnalysisPieChart,
  getAllBackOrderRateOrganization,
  getAllBackOrderRateManufMonthwise,
  getAllBackOrderRateManufacturer,
  getAllBackOrderRateMonthwise,
  getAllBackOrderRate,
  getOrganizationList,
  getLeadTimeTrending,
  getReportForNewLeadTime,
  getDefaultMaterialCapGov,
  getMaterialManufFilterList,
  getMaterialInsightsDefaultMatnr,
  getMaterialInsightsDropDown,
  getForcastAccuracyMonthwise,
  getBackOrderRateMonthwise,
  getForcastAccuracyOrgMonthwise,
  getForcastAccuracyManufMonthwise,
  getForcastAccuracyMaterialMonthwise,
  getBackOrderRateOrgMonthwise,
  getBackOrderRateManufMonthwise,
  getBackOrderRateMaterialMonthwise,
  getTurnOverRateManufMonthwise,
  getTurnOverRateOrgMonthwise,
  getForcastAccuracyOrganization,
  getForcastAccuracyManufacturer,
  getForcastAccuracyMaterial,
  getForcastAccuracyDemand,
  getTurnOverRateMonthwise,
  getTurnOverRateMaterialMonthwise,
  getTurnOverRateOrganization,
  getBackOrderRate,
  getBackOrderRateOrganization,
  getBackOrderRateManufacturer,
  getBackOrderRateMaterial,
  getTurnOverRateManufacturer,
  getTurnOverRateMaterial,
  getTurnOverRate,
  getCapGovMaterialReportDD,
  getOrderPushPullMaterialV2,
  getOrderPushPullMaterialFlag,
  getApprovalStatusForMaterial,
  getApprovalStatusCount,
  getApproverList,
  clearImpersonationDetails,
  saveImpersonationDetails,
  getUserImpersonationDetails,
  getUserDetailsBySearch,
  getHistoricalForecastMonthly,
  getExhaustDetailsV2,
  getHistoricalSnapshotForecastMinMaxDate,

  getHistoricalForecastWeekly,
  getUserRole,
  getTopSpendsByOrganizationChart,
  getCapGovInfoForMaterial1,
  getCapGovMaterialReport1,
  getMaterialForMapViewDD,
  getPredictedBarChart,
  getExhaustDetails,
  getPredictedCapEx,
  getStockPercent,
  getPredictedCapExDD,
  getEOQTbl,
  getCapExTrend,
  getEOQHeaderDD,
  getPredictedChart,
  getDataforMapFullView,
  getFillRate,
  getExhaustDetailsbyId,
  getWidgetDDData,
  getDataforMap,
  getSupplierEfficiency,
  getSuppEfficiencyChart,
  getPlantDetailsDD,
  getFillRateUnderStockChart,
  getFillRateOverStockChart,
  getPredictedChartMonth,
  getPOMaterialChart,
  getHarvestingWidget,
  getHarvestChartDD,
  getCapExTrendPoPlaced,
  getOrdersinPipelineDD,
  getNotificationDetails,
  getWeeklyStockVisualization,
  getMonthlyStockVisualization,
  getExhaustDetailNotification,
  getMaterialDetailsForMapView,
  getMaterialforPushPull,
  getPONumberForMaterial,
  getPOLineForPO,
  getCapGovAdvancePo,
  getCapGovOnOrders,
  getPushPullMaterialDD,
  getSupplyChainInventoryPos,
  getOrderPushPullMaterial,
  getOrderPushPullManufacturer,
  getCapGovMaterialReport,
  getCapGovInfoForMaterial,
  getMaterialForMapView,
  getTopSpendsByOrganization
});

export default rootReducer;
