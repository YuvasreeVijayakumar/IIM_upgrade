import axios from 'axios';

import 'moment-timezone';
import 'url-search-params-polyfill';
// Dev URL
// App URL - After Deployment (Don't use this anywhere just check after deploy) - http://npinv.azurewebsites.net/
export const ROOT_URL =
  process.env.active === 'development'
    ? 'https://npinvapi.azurewebsites.net/api/Inventory/'
    : 'https://api-iimprod.azurewebsites.net/api/Inventory/';
// Prod URL
// App URL - After Deployment (Don't use this anywhere just check after deploy) - http://app-iim.azurewebsites.net/
// export const ROOT_URL = "https://api-iimprod.azurewebsites.net/api/Inventory/";

//BLOB API CALL

function BLOB_API_CALL(method, url, data, type) {
  return function (dispatch) {
    axios({ method: method, url: ROOT_URL + url, data: data })
      .then((response) => {
        dispatch({
          type,
          payload: response
        });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}

//NORMAL API CAll
function API_CALL(method, url, data, type) {
  return function (dispatch) {
    dispatch({
      type: `${type}Loader`,
      payload: true
    });
    axios({ method: method, url: ROOT_URL + url, data: data })
      .then((response) => {
        if (JSON.parse(response.data).length > 0) {
          dispatch({
            type,
            payload: response
          });
          dispatch({
            type: `${type}Loader`,
            payload: false
          });
        } else {
          dispatch({
            type,
            payload: response
          });
          dispatch({
            type: `${type}Loader`,
            payload: false
          });
        }
      })
      .catch((error) => {
        console.log(error, type);
      });
  };
}
export function getOrderPushPullMaterialFlag(v1, v2, v3, v4) {
  return API_CALL(
    'GET',
    `GetOrderPushPullMaterialFlag?Material=${v1}&Po=${v2}&Poline=${v3}&Date=${v4}`,
    null,
    'getOrderPushPullMaterialFlag'
  );
}
export function getNBAOrgBackordersRawData(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgBackordersRawData?Organization=${v1}&Lgort=${v2}`,
    null,
    'getNBAOrgBackordersRawData'
  );
}
export function getNBAOrgOutstandingOrdersDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgOutstandingOrdersDD?Organization=${v1}&Lgort=${v2}`,
    null,
    'getNBAOrgOutstandingOrdersDD'
  );
}
export function getNBAOrgoverdueDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgoverdueDD?Organization=${v1}&Lgort=${v2}`,
    null,
    'getNBAOrgoverdueDD'
  );
}
export function getMaterialManufFilterList(value) {
  return API_CALL(
    'GET',
    `GetMaterialManufFilterList?cuid=${value}`,
    null,
    'getMaterialManufFilterList'
  );
}
//Org-matnr filter
export function getMaterialFilter() {
  return API_CALL('GET', 'GETMATERIALLIST', null, 'getMaterialFilter');
}
//IIMVideos
export function getIIMVideos(view) {
  return BLOB_API_CALL('GET', `GetIIMVideos?videoName=${view}`, null, 'getIIMVideos');
}
export function getTopTrendingMatsPieChart() {
  return API_CALL('GET', 'GetTopTrendingMatsPieChart', null, 'getTopTrendingMatsPieChart');
}
//IIMUploads
export function getMatnrBulkUploadOverview() {
  return API_CALL('GET', `GetMatnrBulkUploadOverview`, null, 'getMatnrBulkUploadOverview');
}
export function getTopTrendingMaterialGraph(v1, v2) {
  return API_CALL(
    'GET',
    `GetTopTrendingMaterialGraph?material=${v1}&lgort=${v2}`,
    null,
    'getTopTrendingMaterialGraph'
  );
}
export function getMatnrUploadBulkInvalid(v1) {
  return API_CALL(
    'GET',
    `GetMatnrUploadBulkInvalid?submittedBy=${v1}`,
    null,
    'getMatnrUploadBulkInvalid'
  );
}

export const HandleforecastModal = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'HandleforecastModal',
      payload: data
    });
  };
};
export const HandleleadTimeModal = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'HandleleadTimeModal',
      payload: data
    });
  };
};
export const HandlematerialOnBoardModal = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'HandlematerialOnBoardModal',
      payload: data
    });
  };
};

//IIMReports
// params
export const UpdatePage = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'UpdatePage',
      payload: data
    });
  };
};
export const UpdateSizePerPage = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'UpdateSizePerPage',
      payload: data
    });
  };
};

export const UpdateSorting = (sortField, sortOrder) => {
  return function (dispatch) {
    dispatch({
      type: 'UpdateSorting',
      payload: { sortField, sortOrder }
    });
  };
};
export const InitialpageRender = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'InitialpageRender',
      payload: data
    });
  };
};

export const UpdateSearchValue = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'UpdateSearchValue',
      payload: data
    });
  };
};

export const ClearUpdateSearchValue = () => {
  return function (dispatch) {
    dispatch({
      type: 'ClearUpdateSearchValue',
      payload: []
    });
  };
};
export function getBulkExportColNames(view) {
  return API_CALL('GET', `GetBulkExportColNames?VIEW=${view}`, null, 'getBulkExportColNames');
}
export function getBulkExportColValues(view, col) {
  return API_CALL(
    'GET',
    `GetBulkExportColValues?View=${view}&Values=${col}`,
    null,
    'getBulkExportColValues'
  );
}
export function getBulkExcelExportBlob() {
  return BLOB_API_CALL('GET', 'GetBulkExcelExportBlob', null, 'getBulkExcelExportBlob');
}
export function getBulkExcelExport(v1, v2, v3, view, v4, v5) {
  let searchValueFormating = v5.map((d) => {
    return `and ${d.Column_Name} in ${d.Value}`;
  });
  let JsonValue = '';
  if (v5.length > 0) {
    JsonValue = {
      search: searchValueFormating.toString(),
      sort: v4
    };
  } else {
    JsonValue = {
      search: '',
      sort: v4
    };
  }
  return API_CALL(
    'GET',
    `GetBulkExcelExport?cuid=${v1}&LGORT=${v2}&Indicator=${v3}&View=${view}&filterValue=${JSON.stringify(
      JsonValue
    )}`,
    null,
    'getBulkExcelExport'
  );
}
//no need to remove org
export function getBulkExport(v1, v2, v3, view, v4, v5, v6, v7, func) {
  let JsonValue = '';
  if (v7.length > 0) {
    let searchValueFormating = v7.map((d) => {
      return `and ${d.Column_Name} in ${encodeURIComponent(d.Value)}`;
    });
    JsonValue = {
      search: searchValueFormating.toString(),
      sort: v4,
      offset: v5,
      fetch_next: v6
    };
  } else {
    JsonValue = {
      search: '',
      sort: v4,
      offset: v5,
      fetch_next: v6
    };
  }

  if (func) {
    func();
  }
  return API_CALL(
    'GET',
    `GetBulkExport?cuid=${v1}&LGORT=${v2}&Indicator=${v3}&View=${view}&filterValue=${JSON.stringify(
      JsonValue
    )}`,
    null,
    'getBulkExport'
  );
}
//kpi forecast Analysis Api
export function getKPIForecastAccuracyAnalysis() {
  return API_CALL('GET', 'GetKPIForecastAccuracyAnalysis', null, 'getKPIForecastAccuracyAnalysis');
}
export function getLeadtimeExpiryNotification() {
  return API_CALL('GET', 'GetLeadtimeExpiryNotification', null, 'getLeadtimeExpiryNotification');
}
export function getKPIForecastAccuracyAnalysisPieChart() {
  return API_CALL(
    'GET',
    'GetKPIForecastAccuracyAnalysisPieChart',
    null,
    'getKPIForecastAccuracyAnalysisPieChart'
  );
}

//NBA Manuf view API's
export function getNBAManufAnnouncements(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufAnnouncements?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufAnnouncements'
  );
}
export function getNBAManufBackOrdersDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufBackOrdersDD?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufBackOrdersDD'
  );
}
export function getLeadtimeExpiryNotificationDd() {
  return API_CALL(
    'GET',
    'GetLeadtimeExpiryNotificationDd',
    null,
    'getLeadtimeExpiryNotificationDd'
  );
}
export function getNBAManufBackordersMaterialDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufBackordersMaterialDD?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufBackordersMaterialDD'
  );
}
export function getNBAManufBackordersRawData(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufBackordersRawData?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufBackordersRawData'
  );
}
export function getNBAManufAwaitingRepairsDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufAwaitingRepairsDD?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufAwaitingRepairsDD'
  );
}
export function getNBAManufCapGovMatnrBreakdown(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufCapGovMatnrBreakdown?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufCapGovMatnrBreakdown'
  );
}
export function getNBAManufAnnouncementsDD(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAManufAnnouncementsDD?Manufacturer=${v1}&LGORT=${v2}&View=${v3}`,
    null,
    'getNBAManufAnnouncementsDD'
  );
}
export function getNBAManufAwaitingRepairs(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufAwaitingRepairs?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufAwaitingRepairs'
  );
}
export function getNBAManufTrendAnalysis(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAManufTrendAnalysis?Manufacturer=${v1}&LGORT=${v2}&View=${v3}`,
    null,
    'getNBAManufTrendAnalysis'
  );
}
export function getNBAManufOrdersChart(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufOrdersChart?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufOrdersChart'
  );
}
export function getNBAManufacturerWidget1(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufacturerWidget1?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufacturerWidget1'
  );
}
export function getNBAManufBackorders(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufBackorders?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufBackorders'
  );
}
export function getNBAManufCapGovRequest(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufCapGovRequest?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufCapGovRequest'
  );
}
export function getNBAManufCapGovPlots(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufCapGovPlots?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufCapGovPlots'
  );
}
export function getNBAManufCapGovPercent(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufCapGovPercent?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufCapGovPercent'
  );
}
export function getNBAManufCapGovGraph(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufCapGovGraph?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufCapGovGraph'
  );
}
export function getNBAManufacturerWidget2(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufacturerWidget2?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufacturerWidget2'
  );
}
export function getNBAManufCurrentInventoryCapexDD(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAManufCurrentInventoryCapexDD?Manufacturer=${v1}&LGORT=${v2}&View=${v3}`,
    null,
    'getNBAManufCurrentInventoryCapexDD'
  );
}

export function getNBAManufSlametDD(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAManufSlametDD?Manufacturer=${v1}&LGORT=${v2}&view=${v3}`,
    null,
    'getNBAManufSlametDD'
  );
}
export function getNBAManufVendorsDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufVendorsDD?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufVendorsDD'
  );
}
export function getNBAManufMaterialDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufMaterialDD?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufMaterialDD'
  );
}
export function getNBAManufAvgEarlyDaysDD(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAManufAvgEarlyDaysDD?Manufacturer=${v1}&lgort=${v2}&view=${v3}`,
    null,
    'getNBAManufAvgEarlyDaysDD'
  );
}
export function getNBAManufLeadtimeDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufLeadtimeDD?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufLeadtimeDD'
  );
}
export function getNBAManufOverDueDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufOverDueDD?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufOverDueDD'
  );
}
export function getNBAManufOutStandingOrdersDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAManufOutStandingOrdersDD?Manufacturer=${v1}&lgort=${v2}`,
    null,
    'getNBAManufOutStandingOrdersDD'
  );
}
//NBA ORG API'S
export function getNBAOrgAnnouncementsDD(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAOrgAnnouncementsDD?Organization=${v1}&lgort=${v2}&View=${v3}`,
    null,
    'getNBAOrgAnnouncementsDD'
  );
}
export function getNBAOrgBackorderQtyMonthwise(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgBackorderQtyMonthwise?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgBackorderQtyMonthwise'
  );
}
export function getNBAOrgCapGovMaterialBreakDown(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgCapGovMaterialBreakDown?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgCapGovMaterialBreakDown'
  );
}
export function getNBAOrgSlaMetDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgSlaMetDD?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgSlaMetDD'
  );
}
export function getNBAOrgTotalHarvestDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgTotalHarvestDD?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgTotalHarvestDD'
  );
}
export function getNBAOrgOpenHarvestDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgOpenHarvestDD?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgOpenHarvestDD'
  );
}
export function getNBAOrgFillrateDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgFillrateDD?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgFillrateDD'
  );
}
export function getNBAOrgTotalPartsDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgTotalPartsDD?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgTotalPartsDD'
  );
}
export function getNBAOrgCapGovChart(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgCapGovChart?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgCapGovChart'
  );
}
export function getNBAOrgCurrentInventoryDD(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAOrgCurrentInventoryDD?Organization=${v1}&lgort=${v2}&view=${v3}`,
    null,
    'getNBAOrgCurrentInventoryDD'
  );
}
export function getNBAOrgBackordersDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgBackordersDD?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgBackordersDD'
  );
}
export function getNBAOrgAnnouncements(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgAnnouncements?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgAnnouncements'
  );
}
export function getNBAOrgOpenHarvest(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgOpenHarvest?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgOpenHarvest'
  );
}
export function getNBAOrgTotalHarvest(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgTotalHarvest?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgTotalHarvest'
  );
}
export function getNBATrendAnalysis(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBATrendAnalysis?Organization=${v1}&lgort=${v2}&view=${v3}`,
    null,
    'getNBATrendAnalysis'
  );
}
export function getNBAOrgCapGovRequest(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgCapGovRequest?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgCapGovRequest'
  );
}
export function getNBAOrgOrdersChart(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgOrdersChart?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgOrdersChart'
  );
}
export function getNBAOrgDetails(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOrgDetails?Organization=${v1}&lgort=${v2}`,
    null,
    'getNBAOrgDetails'
  );
}
//material report API's
export function getNBABackorderQtyMaterialMonthwise(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBABackorderQtyMaterialMonthwise?Material=${v1}&LGORT=${v2}`,
    null,
    'getNBABackorderQtyMaterialMonthwise'
  );
}
export function getNBADefaultMaterialReport() {
  return API_CALL('GET', 'GetNBADefaultMaterialReport', null, 'getNBADefaultMaterialReport');
}
export function getLeadtimeOverwriteReview(v1) {
  return API_CALL(
    'GET',
    `GetLeadtimeOverwriteReview?Review=InvalidRequest&Email=${v1}`,
    null,
    'getLeadtimeOverwriteReview'
  );
}
export function getNBABackorders(v1, v2) {
  return API_CALL('GET', `GetNBABackorders?Material=${v1}&LGORT=${v2}`, null, 'getNBABackorders');
}
export function getNBABackordersDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBABackordersDD?Material=${v1}&lgort=${v2}`,
    null,
    'getNBABackordersDD'
  );
}
export function getNBAInventoryCapexDD(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAInventoryCapexDD?Material=${v1}&Lgort=${v2}&View=${v3}`,
    null,
    'getNBAInventoryCapexDD'
  );
}
export function getNBAFillrateDD(v1, v2) {
  return API_CALL('GET', `GetNBAFillrateDD?Material=${v1}&Lgort=${v2}`, null, 'getNBAFillrateDD');
}
export function getNBASlaMetDD(v1, v2) {
  return API_CALL('GET', `GetNBASlaMetDD?Material=${v1}&Lgort=${v2}`, null, 'getNBASlaMetDD');
}
export function getNBAFillrate(v1, v2) {
  return API_CALL('GET', `GetNBAFillrate?Material=${v1}&Lgort=${v2}`, null, 'getNBAFillrate');
}
export function getNBASlaMet(v1, v2) {
  return API_CALL('GET', `GetNBASlaMet?Material=${v1}&Lgort=${v2}`, null, 'getNBASlaMet');
}
export function getNBAOverdueDD(v1, v2) {
  return API_CALL('GET', `GetNBAOverdueDD?Material=${v1}&Lgort=${v2}`, null, 'getNBAOverdueDD');
}
export function getNBAOutstandingOrdersDD(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOutstandingOrdersDD?Material=${v1}&Lgort=${v2}`,
    null,
    'getNBAOutstandingOrdersDD'
  );
}
export function getNBAMaterialReportDD(v) {
  return API_CALL('GET', `GetNBAMaterialReportDD?View=${v}`, null, 'getNBAMaterialReportDD');
}
export function getNBAOverdue(v1, v2) {
  return API_CALL('GET', `GetNBAOverdue?Material=${v1}&Lgort=${v2}`, null, 'getNBAOverdue');
}
export function getNBAOutstandingOrders(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAOutstandingOrders?Material=${v1}&Lgort=${v2}`,
    null,
    'getNBAOutstandingOrders'
  );
}
export function getNBAHarvesting(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetNBAHarvesting?material=${v1}&lgort=${v2}&stktype=${v3}`,
    null,
    'getNBAHarvesting'
  );
}
export function getNBAAnnouncements(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAAnnouncements?Material=${v1}&LGORT=${v2}`,
    null,
    'getNBAAnnouncements'
  );
}
export function getInventorySummaryVendor(v1, v2) {
  return API_CALL(
    'GET',
    `GetInventorySummaryVendor?Material=${v1}&vendorName=${v2}`,
    null,
    'getInventorySummaryVendor'
  );
}
export function getInventorySummaryVendorDD(v) {
  return API_CALL(
    'GET',
    `GetInventorySummaryVendorDD?Material=${v}`,
    null,
    'getInventorySummaryVendorDD'
  );
}
export function getInventorySummaryManufacturerDD(v) {
  return API_CALL(
    'GET',
    `GetInventorySummaryManufacturerDD?Material=${v}`,
    null,
    'getInventorySummaryManufacturerDD'
  );
}
export function getInventorySummaryManufacturer(v1, v2) {
  return API_CALL(
    'GET',
    `GetInventorySummaryManufacturer?Material=${v1}&manuf_Name=${v2}`,
    null,
    'getInventorySummaryManufacturer'
  );
}
export function getNBACapGovRequest(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBACapGovRequest?Material=${v1}&LGORT=${v2}`,
    null,
    'getNBACapGovRequest'
  );
}
export function getNBAMaterialGeneralInfo(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAMaterialGeneralInfo?Material=${v1}&Lgort=${v2}`,
    null,
    'getNBAMaterialGeneralInfo'
  );
}
export function getNBAMaterialKeymetrics(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAMaterialKeymetrics?Material=${v1}&Lgort=${v2}`,
    null,
    'getNBAMaterialKeymetrics'
  );
}
export function getNBAMaterialReminder(v1, v2) {
  return API_CALL(
    'GET',
    `GetNBAMaterialReminder?Material=${v1}&Lgort=${v2}`,
    null,
    'getNBAMaterialReminder'
  );
}
export function getNBAInventorySummaryMaterial(v) {
  return API_CALL(
    'GET',
    `GetNBAInventorySummaryMaterial?Material=${v}`,
    null,
    'getNBAInventorySummaryMaterial'
  );
}
//
export function getBoCriticalityFinalReport(v1, v2) {
  return API_CALL(
    'GET',
    `GetBoCriticalityFinalReport?startDate=${v1}&endDate=${v2}`,
    null,
    'getBoCriticalityFinalReport'
  );
}
export function getBoCriticalityReportMinMaxDate() {
  return API_CALL(
    'GET',
    'GetBoCriticalityReportMinMaxDate',
    null,
    'getBoCriticalityReportMinMaxDate'
  );
}
export function getBoCriticalityReportInvalid() {
  return API_CALL('GET', 'GetBoCriticalityReportInvalid', null, 'getBoCriticalityReportInvalid');
}
export function getBoCriticalityReportApproverList() {
  return API_CALL(
    'GET',
    'GetBoCriticalityReportApproverList',
    null,
    'getBoCriticalityReportApproverList'
  );
}
export function getBoCriticalityReportApproverReview() {
  return API_CALL(
    'GET',
    `GetBoCriticalityReportOverview`,
    null,
    'getBoCriticalityReportApproverReview'
  );
}
export function getForecastOverrideReviewData(v1, v2) {
  return API_CALL(
    'GET',
    `GetForecastOverrideReviewData?Review=${v1}&email=${v2}`,
    null,
    'getForecastOverrideReviewData'
  );
}
export function getForecastOverrideStatusCount(v1, v2, v4) {
  return API_CALL(
    'GET',
    `GetForecastOverrideStatusCount?cuid=${v1}&LGORT=${v2}&Indicator=${v4}`,
    null,
    'getForecastOverrideStatusCount'
  );
}
export function getForecastOverrideOverview(v, v1, v3, v4) {
  return API_CALL(
    'GET',
    `GetForecastOverrideOverview?cuid=${v}&status=${v1}&LGORT=${v3}&Indicator=${v4}

    `,
    null,
    'getForecastOverrideOverview'
  );
}
export function getSampleFileFormatForecastOverride() {
  return BLOB_API_CALL(
    'GET',
    'GetSampleFileFormatForecastOverride',
    null,
    'getSampleFileFormatForecastOverride'
  );
}
export function getCurrentInventoryCapexManufDD(v1, v3, v4, v5) {
  return API_CALL(
    'GET',
    `GetCurrentInventoryCapexManufDD?cuid=${v1}&lgort=${v3}&Indicator=${v4}&type=${v5}`,
    null,
    'getCurrentInventoryCapexManufDD'
  );
}
export function getForecastOverrideApproverReview(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetForecastOverrideApproverReview?Approver=${v1}&Material=${v2}&lgort=${v3}`,
    null,
    'getForecastOverrideApproverReview'
  );
}
export function getForecastOverrideApproverList() {
  return API_CALL(
    'GET',
    'GetForecastOverrideApproverList',
    null,
    'getForecastOverrideApproverList'
  );
}
export function getOrderPushPullApproverReviewData(value) {
  return API_CALL(
    'GET',
    `GetOrderPushPullApproverReviewData?email=${value}`,
    null,
    'getOrderPushPullApproverReviewData'
  );
}

export function getOrderPushPullReviewData(value, v2) {
  return API_CALL(
    'GET',
    `GetOrderPushPullReviewData?Review=${value}&email=${v2}`,
    null,
    'getOrderPushPullReviewData'
  );
}
//dashboard refresh function
export function getUserImpersonationDetailsRefresh(value) {
  return API_CALL(
    'GET',
    'GetUserImpersonationDetails?Email=' + value,
    null,
    'getUserImpersonationDetailsRefresh'
  );
}

export function getPushPullDetailByUser(v1) {
  return API_CALL('GET', `GetPushPullDetailByUser?Usercuid=${v1}`, null, 'getPushPullDetailByUser');
}
export function getPushPullNotificationMessages(v1) {
  return API_CALL(
    'GET',
    `GetPushPullNotificationMessages?usercuid=${v1}`,
    null,
    'getPushPullNotificationMessages'
  );
}
export function getLeadTimeMaterialTrendwise(v1) {
  return API_CALL(
    'GET',
    `GetLeadTimeMaterialTrendwise?Trend=${v1}`,
    null,
    'getLeadTimeMaterialTrendwise'
  );
}

//dummy api call

export function getLeadTimeMaterialTrendwiseUp() {
  return API_CALL(
    'GET',
    `GetLeadTimeMaterialTrendwise?Trend=Up`,
    null,
    'getLeadTimeMaterialTrendwiseUp'
  );
}

export function getLeadTimeMaterialTrendwiseDown() {
  return API_CALL(
    'GET',
    `GetLeadTimeMaterialTrendwise?Trend=Up`,
    null,
    'getLeadTimeMaterialTrendwiseDown'
  );
}

export function getLeadTimeMaterialTrendwiseNeutral() {
  return API_CALL(
    'GET',
    `GetLeadTimeMaterialTrendwise?Trend=Neutral`,
    null,
    'getLeadTimeMaterialTrendwiseNeutral'
  );
}

//end

export function getForcastAccuracyOrgQuarterlyTrend(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyOrgQuarterlyTrend?Organization=${v1}&LGORT=${v2}`,
    null,
    'getForcastAccuracyOrgQuarterlyTrend'
  );
}

export function getForcastAccuracyManufQuarterlyTrend(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyManufQuarterlyTrend?Manufacturer=${v1}&LGORT=${v2}`,
    null,
    'getForcastAccuracyManufQuarterlyTrend'
  );
}
export function getForcastAccuracyMaterialQuarterlyTrend(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyMaterialQuarterlyTrend?Material=${v1}&LGORT=${v2}`,
    null,
    'getForcastAccuracyMaterialQuarterlyTrend'
  );
}
export function getForcastAccuracyOrganizationQuarterly() {
  return API_CALL(
    'GET',
    'GetForcastAccuracyOrganizationQuarterly',
    null,
    'getForcastAccuracyOrganizationQuarterly'
  );
}
export function getForcastAccuracyManufacturerQuarterly() {
  return API_CALL(
    'GET',
    'GetForcastAccuracyManufacturerQuarterly',
    null,
    'getForcastAccuracyManufacturerQuarterly'
  );
}
export function getForcastAccuracyMaterialQuarterly() {
  return API_CALL(
    'GET',
    'GetForcastAccuracyMaterialQuarterly',
    null,
    'getForcastAccuracyMaterialQuarterly'
  );
}
export function getForcastAccuracyQuarterlyTrend() {
  return API_CALL(
    'GET',
    'GetForcastAccuracyQuarterlyTrend',
    null,
    'getForcastAccuracyQuarterlyTrend'
  );
}
export function getForcastAccuracyQuarterly() {
  return API_CALL('GET', 'GetForcastAccuracyQuarterly', null, 'getForcastAccuracyQuarterly');
}

export function getOustandingOrdersMonthwise(data) {
  return API_CALL(
    'GET',
    `GetOustandingOrdersMonthwise?Date=${data}`,
    null,
    'getOustandingOrdersMonthwise'
  );
}

export function getTotalQuantityAndCapexOrgTrend(v1, v2) {
  return API_CALL(
    'GET',
    `GetTotalQuantityAndCapexOrgTrend?Org=${v1}&LGORT=${v2}`,
    null,
    'getTotalQuantityAndCapexOrgTrend'
  );
}

export function getOutStandingOrdersOrg(v1, v2) {
  return API_CALL(
    'GET',
    `GetOutStandingOrdersOrg?Org=${v1}&LGORT=${v2}`,
    null,
    'getOutStandingOrdersOrg'
  );
}
export function getOutStandingOrdersManuf(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetOutStandingOrdersManuf?Manuf=${v1}&LGORT=${v2}&vendor=${v3}`,
    null,
    'getOutStandingOrdersManuf'
  );
}
export function getTotalQuantityAndCapexManufTrend(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetTotalQuantityAndCapexManufTrend?Manuf=${v1}&LGORT=${v2}&vendor=${v3}`,
    null,
    'getTotalQuantityAndCapexManufTrend'
  );
}
export function getTopTrendingMatsDD(v1) {
  return API_CALL('GET', `GetTopTrendingMatsDD?View=${v1}`, null, 'getTopTrendingMatsDD');
}
//Top Moving Materials

export function getOutStandingOrdersMaterial(v1, v2) {
  return API_CALL(
    'GET',
    `GetOutStandingOrdersMaterial?Material=${v1}&LGORT=${v2}`,
    null,
    'getOutStandingOrdersMaterial'
  );
}
export function getTotalQuantityAndCapexMaterialTrend(v1, v2) {
  return API_CALL(
    'GET',
    `GetTotalQuantityAndCapexMaterialTrend?Material=${v1}&LGORT=${v2}`,
    null,
    'getTotalQuantityAndCapexMaterialTrend'
  );
}
export function getTotalQuantityAndCapex() {
  return API_CALL('GET', 'GetTotalQuantityAndCapex', null, 'getTotalQuantityAndCapex');
}

export function getTotalCapexForMaterial() {
  return API_CALL('GET', 'GetTotalCapexForMaterial', null, 'getTotalCapexForMaterial');
}

export function getTotalQuantityForMonthAndYear() {
  return API_CALL(
    'GET',
    'GetTotalQuantityForMonthAndYear',
    null,
    'getTotalQuantityForMonthAndYear'
  );
}
export function getTotalCapexForMonthandYear() {
  return API_CALL('GET', 'GetTotalCapexForMonthandYear', null, 'getTotalCapexForMonthandYear');
}
export function getTotalCapexForOrganization() {
  return API_CALL('GET', 'GetTotalCapexForOrganization', null, 'getTotalCapexForOrganization');
}
export function getTotalCapexForManufacturer() {
  return API_CALL('GET', 'GetTotalCapexForManufacturer', null, 'getTotalCapexForManufacturer');
}
export function getTotalCapexforTopMats() {
  return API_CALL('GET', 'GetTotalCapexforTopMats', null, 'getTotalCapexforTopMats');
}
export function getPredictedOrderQuantityColumns() {
  return API_CALL(
    'GET',
    'GetPredictedOrderQuantityColumns',
    null,
    'getPredictedOrderQuantityColumns'
  );
}
export function getForcastAccuracyMinMaxDate() {
  return API_CALL('GET', 'GetForcastAccuracyMinMaxDate', null, 'getForcastAccuracyMinMaxDate');
}
export function getReasonCodeList() {
  return API_CALL('GET', 'GetReasonCodeList', null, 'getReasonCodeList');
}
export function getForcastOverwriteDetails(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastOverwriteDetails?Material=${v1}&LGORT=${v2}`,
    null,
    'getForcastOverwriteDetails'
  );
}
//temp Api For FAD Overall count
export function getForcastAccuracyDemandSample(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyDemandSample?StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyDemandSample'
  );
}
export function getAllTurnOverRateOrgMonthwise(v1, v2) {
  return API_CALL(
    'GET',
    `GetAllTurnOverRateOrgMonthwise?Organization=${v1}&LGORT=${v2}`,
    null,
    'getAllTurnOverRateOrgMonthwise'
  );
}
export function getAllTurnOverRateManufMonthwise(v1, v2) {
  return API_CALL(
    'GET',
    `GetAllTurnOverRateManufMonthwise?Manufacturer=${v1}&LGORT=${v2}`,
    null,
    'getAllTurnOverRateManufMonthwise'
  );
}
export function getAllTurnOverRateOrganization() {
  return API_CALL('GET', 'GetAllTurnOverRateOrganization', null, 'getAllTurnOverRateOrganization');
}
export function getAllTurnOverRateManufacturer() {
  return API_CALL('GET', 'GetAllTurnOverRateManufacturer', null, 'getAllTurnOverRateManufacturer');
}
export function getAllTurnOverRateMonthwise() {
  return API_CALL('GET', 'GetAllTurnOverRateMonthwise', null, 'getAllTurnOverRateMonthwise');
}
export function getAllTurnOverRate() {
  return API_CALL('GET', 'GetAllTurnOverRate', null, 'getAllTurnOverRate');
}
export function getReplacedMaterialDetails(value) {
  return API_CALL(
    'GET',
    'GetReplacedMaterialDetails?material=' + value,
    null,
    'getReplacedMaterialDetails'
  );
}
export function getLeadTimeTrending1() {
  return API_CALL('GET', 'GetLeadTimeTrending', null, 'getLeadTimeTrending1');
}
export function getLeadTimeOverall() {
  return API_CALL('GET', 'GetLeadTimeOverall', null, 'getLeadTimeOverall');
}
export function getLeadTimeTrendingOrg(val) {
  return API_CALL('GET', 'GetLeadTimeTrendingOrg?Org=' + val, null, 'getLeadTimeTrendingOrg');
}
export function getLeadTimeOrg() {
  return API_CALL('GET', 'GetLeadTimeOrg', null, 'getLeadTimeOrg');
}
export function getLeadTimeTrendingManuf(val) {
  return API_CALL('GET', 'GetLeadTimeTrendingManuf?Manuf=' + val, null, 'getLeadTimeTrendingManuf');
}
export function getLeadTimeManuf() {
  return API_CALL('GET', 'GetLeadTimeManuf', null, 'getLeadTimeManuf');
}
export function getLeadTimeTrendingMaterial(val) {
  return API_CALL(
    'GET',
    'GetLeadTimeTrendingMaterial?Material=' + val,
    null,
    'getLeadTimeTrendingMaterial'
  );
}
export function getLeadTimeMaterial() {
  return API_CALL('GET', 'GetLeadTimeMaterial', null, 'getLeadTimeMaterial');
}
export function getLeadTimeTrendingMaterialEOQ(val) {
  return API_CALL(
    'GET',
    'GetLeadTimeTrendingMaterialEOQ?material=' + val,
    null,
    'getLeadTimeTrendingMaterialEOQ'
  );
}
export function getAllBackOrderRateOrgMonthwise(val, val2) {
  return API_CALL(
    'GET',
    `GetAllBackOrderRateOrgMonthwise?Organization=${val}&LGORT=${val2}`,
    null,
    'getAllBackOrderRateOrgMonthwise'
  );
}
export function getAllBackOrderRateOrganization() {
  return API_CALL(
    'GET',
    'GetAllBackOrderRateOrganization',
    null,
    'getAllBackOrderRateOrganization'
  );
}
export function getAllBackOrderRateManufMonthwise(value) {
  return API_CALL(
    'GET',
    'GetAllBackOrderRateManufMonthwise?Manufacturer=' + value,
    null,
    'getAllBackOrderRateManufMonthwise'
  );
}
export function getAllBackOrderRateManufacturer() {
  return API_CALL(
    'GET',
    'GetAllBackOrderRateManufacturer',
    null,
    'getAllBackOrderRateManufacturer'
  );
}
export function getAllBackOrderRateMonthwise() {
  return API_CALL('GET', 'GetAllBackOrderRateMonthwise', null, 'getAllBackOrderRateMonthwise');
}
export function getAllBackOrderRate() {
  return API_CALL('GET', 'GetAllBackOrderRate', null, 'getAllBackOrderRate');
}
export function getOrganizationList() {
  return API_CALL('GET', 'GetOrganizationList', null, 'getOrganizationList');
}
export function getLeadTimeTrending(value) {
  return API_CALL(
    'GET',
    // "GetLeadTimeTrendingMaterial?Material=" + value,
    'GetLeadTimeTrendingMaterialEOQ?Material=' + value,
    null,
    'getLeadTimeTrending'
  );
}
export function getReportForNewLeadTime(value, v2, v4) {
  return API_CALL(
    'GET',
    `GetReportForNewLeadTime?cuid=${value}&LGORT=${v2}&Indicator=${v4}`,

    null,
    'getReportForNewLeadTime'
  );
}
export function getForcastAccuracyMonthwise(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyMonthwise?StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyMonthwise'
  );
}
export function getBackOrderRateMonthwise() {
  return API_CALL('GET', 'GetBackOrderRateMonthwise', null, 'getBackOrderRateMonthwise');
}
export function getForcastAccuracyOrgMonthwise(value, lgort, v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyOrgMonthwise?Organization=${value}&LGORT=${lgort}&StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyOrgMonthwise'
  );
}
export function getForcastAccuracyManufMonthwise(value, lgort, v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyManufMonthwise?Manufacturer=${value}&LGORT=${lgort}&StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyManufMonthwise'
  );
}
export function getForcastAccuracyMaterialMonthwise(value, lgort, v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyMaterialMonthwise?Material=${value}&LGORT=${lgort}&StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyMaterialMonthwise'
  );
}
export function getBackOrderRateOrgMonthwise(value, lgort) {
  return API_CALL(
    'GET',
    `GetBackOrderRateOrgMonthwise?Organization=${value}&LGORT=${lgort}`,
    null,
    'getBackOrderRateOrgMonthwise'
  );
}
export function getBackOrderRateManufMonthwise(value, lgort) {
  return API_CALL(
    'GET',
    `GetBackOrderRateManufMonthwise?Manufacturer=${value}&LGORT=${lgort}`,
    null,
    'getBackOrderRateManufMonthwise'
  );
}

export function getBackOrderRateMaterialMonthwise(value, lgort) {
  return API_CALL(
    'GET',
    `GetBackOrderRateMaterialMonthwise?Material=${value}&LGORT=${lgort}`,
    null,
    'getBackOrderRateMaterialMonthwise'
  );
}
export function getTurnOverRateManufMonthwise(value, lgort) {
  return API_CALL(
    'GET',
    `GetTurnOverRateManufMonthwise?Manuf=${value}&LGORT=${lgort}`,
    null,
    'getTurnOverRateManufMonthwise'
  );
}
export function getTurnOverRateOrgMonthwise(value, lgort) {
  return API_CALL(
    'GET',
    `GetTurnOverRateOrgMonthwise?Org=${value}&LGORT=${lgort}`,
    null,
    'getTurnOverRateOrgMonthwise'
  );
}
export function getForcastAccuracyOrganization(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyOrganization?StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyOrganization'
  );
}
export function getForcastAccuracyManufacturer(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyManufacturer?StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyManufacturer'
  );
}
export function getForcastAccuracyMaterial(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyMaterial?StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyMaterial'
  );
}
export function getForcastAccuracyDemand(v1, v2) {
  return API_CALL(
    'GET',
    `GetForcastAccuracyDemand?StartDate=${v1}&EndDate=${v2}`,
    null,
    'getForcastAccuracyDemand'
  );
}
export function getTurnOverRateMonthwise() {
  return API_CALL('GET', 'GetTurnOverRateMonthwise', null, 'getTurnOverRateMonthwise');
}
export function getTurnOverRateMaterialMonthwise(value, lgort) {
  return API_CALL(
    'GET',
    `GetTurnOverRateMaterialMonthwise?Material=${value}&LGORT=${lgort}`,
    null,
    'getTurnOverRateMaterialMonthwise'
  );
}
export function getHarvestingWidget(val, v3, v4) {
  return API_CALL(
    'GET',
    `GetHarvestingWidget?cuid=${val}&LGORT=${v3}&Indicator=${v4}`,
    null,
    'getHarvestingWidget'
  );
}
export function getBackOrderRate() {
  return API_CALL('GET', 'GetBackOrderRate', null, 'getBackOrderRate');
}
// export function getBackOrderRateOrganization() {
//   return API_CALL(
//     "GET",
//     "GetBackOrderRateOrganization",
//     null,
//     "getBackOrderRateOrganization"
//   );
// }
export function getNotificationDetails() {
  return API_CALL('GET', 'GetNotificationDetails', null, 'getNotificationDetails');
}
export function getTopSpendsByOrganization(v1, v3, v4) {
  return API_CALL(
    'GET',
    `GetTopSpendsByOrganization?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

    null,
    'getTopSpendsByOrganization'
  );
}
export function getExhaustDetailNotification() {
  return API_CALL('GET', 'GetExhaustDetailNotification', null, 'getExhaustDetailNotification');
}
export function getPredictedCapEx(value1, value3, value4) {
  return API_CALL(
    'GET',
    `GetPredictedCapEx?cuid=${value1}&LGORT=${value3}&Indicator=${value4}`,

    null,
    'getPredictedCapEx'
  );
}
export function getStockPercent(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetStockPercent?cuid=${v1}&LGORT=${v2}&Indicator=${v3}`,
    null,
    'GetStockPercent'
  );
}
export function getPredictedCapExDD(v1) {
  return API_CALL(
    'GET',
    `GetPredictedCapExDD?cuid=${v1}`,

    null,
    'getPredictedCapExDD'
  );
}
export function getExhaustDetails() {
  return API_CALL('GET', 'GetExhaustDetails', null, 'getExhaustDetails');
}
export function getFillRate(v1, v2, v3) {
  return API_CALL('GET', `GetFillRate?cuid=${v1}&LGORT=${v2}&Indicator=${v3}`, null, 'getFillRate');
}
export function getSupplierEfficiency(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetSupplierEfficiencyWidget?cuid=${v1}&LGORT=${v2}&Indicator=${v3}`,
    null,
    'getSupplierEfficiency'
  );
}
export function getEOQTbl(value, v3, v4, v5) {
  return API_CALL(
    'GET',
    `GetPredictedOrderQuantity?cuid=${value}&LGORT=${v3}&userid=${v4}&Indicator=${v5}`,
    null,
    'getEOQTbl'
  );
}
export function getCapExTrend(val, v3, v4) {
  return API_CALL(
    'GET',
    `GetCapExTrendConsumption?cuid=${val}&LGORT=${v3}&Indicator=${v4}`,
    null,
    'getCapExTrend'
  );
}
export function getCapExTrendPoPlaced(val, v3, v4) {
  return API_CALL(
    'GET',
    `GetCapExTrend?cuid=${val}&LGORT=${v3}&Indicator=${v4}`,

    null,
    'getCapExTrendPoPlaced'
  );
}
export function getDataforMapFullView(val, v3, v4) {
  return API_CALL(
    'GET',
    `GetDataforMapFullView?cuid=${val}&LGORT=${v3}&Indicator=${v4}`,
    null,
    'getDataforMapFullView'
  );
}
export function getFillRateUnderStockChart(v1, v3, v4, v5) {
  return API_CALL(
    'GET',
    `GetFillRate_understock_Graph?cuid=${v1}&LGORT=${v3}&Indicator=${v4}&Material=${v5}`,
    null,
    'getFillRateUnderStockChart'
  );
}

export function getFillRateOverStockChart(v1, v3, v4, v5) {
  return API_CALL(
    'GET',
    `GetFillRate_Overstock_Graph?cuid=${v1}&LGORT=${v3}&Indicator=${v4}&Material=${v5}`,
    null,
    'getFillRateOverStockChart'
  );
}
export function getDataforMap(value, val, v3, v4) {
  return API_CALL(
    'GET',
    `GetDataforMap?Plant=${value}&cuid=${val}&LGORT=${v3}&Indicator=${v4}`,

    null,
    'getDataforMap'
  );
}
export function getPlantDetailsDD(value, v1, v3, v4) {
  return API_CALL(
    'GET',
    `GetPlantDetailsDD?Plant=${value}&cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
    null,
    'getPlantDetailsDD'
  );
}
export function getUserRole(value) {
  return API_CALL('GET', 'GetUserRole?mailid=' + value, null, 'getUserRole');
}
export function getEOQHeaderDD(value, lgort) {
  return API_CALL(
    'GET',
    `GetPredictedConsumptionHeaderView?Material=${value}&LGORT=${lgort}`,

    null,
    'getEOQHeaderDD'
  );
}
export function getExhaustDetailsbyId(value, v) {
  return API_CALL(
    'GET',
    `GetExhaustDetailsDD?Material=${value}&LGORT=${v}`,
    null,
    'getExhaustDetailsbyId'
  );
}
export function getPredictedChart(value1, v2) {
  return API_CALL(
    'GET',
    `GetPredictedConsumptionChart?Material=${value1}&LGORT=${v2}`,

    null,
    'getPredictedChart'
  );
}
export function getPredictedChartMonth(value, v1) {
  return API_CALL(
    'GET',
    `GetPredictedConsumptionChartByMonth?Material=${value}&LGORT=${v1}`,

    null,
    'getPredictedChartMonth'
  );
}
export function getOrdersinPipelineDD(value, lgort) {
  return API_CALL(
    'GET',
    `GetOrdersinPipelineDD?Material=${value}&LGORT=${lgort}`,
    null,
    'getOrdersinPipelineDD'
  );
}
export function getHarvestChartDD(value, lgort) {
  return API_CALL(
    'GET',
    `GetHarvestDDChartByMaterial?Material=${value}&LGORT=${lgort}`,

    null,
    'getHarvestChartDD'
  );
}

export function getWeeklyStockVisualization(value, v1) {
  return API_CALL(
    'GET',
    `GetWeeklyStockvisualization?Material=${value}&LGORT=${v1}`,

    null,
    'getWeeklyStockVisualization'
  );
}
export function getMonthlyStockVisualization(value, v1) {
  return API_CALL(
    'GET',
    `GetmonthlyStockvisualization?Material=${value}&LGORT=${v1}`,

    null,
    'getMonthlyStockVisualization'
  );
}
export function getPOMaterialChart(value, v1) {
  return API_CALL(
    'GET',
    `GetPredictedConsumptionPObyMaterialChart?Material=${value}&LGORT=${v1}`,

    null,
    'getPOMaterialChart'
  );
}
export function getSuppEfficiencyChart(value, v1, v3) {
  return API_CALL(
    'GET',
    `GetSupplierEfficiencyOrderRateDDGraph?vendorNum=${value}&cuid=${v1}&Indicator=${v3}`,

    null,
    'getSuppEfficiencyChart'
  );
}
export function getTopSpendsByOrganizationChart(v1, v3, v4) {
  return API_CALL(
    'GET',
    `GetTopSpendsByOrganizationChart?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
    null,
    'getTopSpendsByOrganizationChart'
  );
}
//temp
export function getMaterialDetailsForMapView(v1, v3, v4) {
  return API_CALL(
    'GET',
    `GetMaterialDetailsForMapView?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
    null,
    'getMaterialDetailsForMapView'
  );
}
export function getHistoricalSnapshotForecastMinMaxDate(value) {
  return API_CALL(
    'GET',
    'GetHistoricalSnapshotForecastMinMaxDate?Material=' + value,
    null,
    'getHistoricalSnapshotForecastMinMaxDate'
  );
}
//
//treeselect Inventory exhaust table
export function getExhaustDetailsV2(value, v2, v4, v5) {
  return API_CALL(
    'GET',
    `GetExhaustDetailsV2?Duration=${value}&cuid=${v2}&LGORT=${v4}&Indicator=${v5}
    `,

    null,
    'getExhaustDetailsV2'
  );
}
//
export function getHistoricalForecastMonthly(value1, value2, v3) {
  return API_CALL(
    'GET',
    `GetHistoricalForecastMonthly?Material=${value1}&Date=${value2}&LGORT=${v3}`,
    null,
    'getHistoricalForecastMonthly'
  );
}

export function getPONumberForMaterial(value) {
  return API_CALL(
    'GET',
    'GetPONumberForMaterial?Material=' + value,
    null,
    'getPONumberForMaterial'
  );
}
export function getMaterialforPushPull(value) {
  return API_CALL(
    'GET',
    'GetMaterialforPushPull?Material=' + value,
    null,
    'getMaterialforPushPull'
  );
}
export function getPOLineForPO(Material, PO) {
  return API_CALL(
    'GET',
    'GetPOLineForPO?Material=' + Material + '&PO=' + PO,
    null,
    'getPOLineForPO'
  );
}
export function getCapGovAdvancePo() {
  return API_CALL('GET', 'GetCapGovAdvancePo', null, 'getCapGovAdvancePo');
}
export function getCapGovOnOrders() {
  return API_CALL('GET', 'GetCapGovOnOrders', null, 'getCapGovOnOrders');
}
export function getPushPullOrders() {
  return API_CALL('GET', 'GetPushPullOrders', null, 'getPushPullOrders');
}
export function getPushPullMaterialDD(val, v3, v4) {
  return API_CALL(
    'GET',
    `GetPushPullMaterialDD?cuid=${val}&LGORT=${v3}&Indicator=${v4}`,

    null,
    'getPushPullMaterialDD'
  );
}
export function getMaterialInsightsDropDown(v1, v3, v4) {
  return API_CALL(
    'GET',
    `GetMaterialInsightsDropDown?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

    null,
    'getMaterialInsightsDropDown'
  );
}
export function getDefaultMaterialCapGov(v1, v3, v4) {
  return API_CALL(
    'GET',
    `GetDefaultMaterialCapGov?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
    null,
    'getDefaultMaterialCapGov'
  );
}
export function getMaterialInsightsDefaultMatnr(v1, v3, v4) {
  return API_CALL(
    'GET',
    `GetMaterialInsightsDefaultMatnr?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

    null,
    'getMaterialInsightsDefaultMatnr'
  );
}
export function getCapGovMaterialReport(value, v1, v2, v3, v4, v5) {
  return API_CALL(
    'GET',
    `GetCapGovMaterialReport?Material=${value}&cuid=${v1}&Organization=${v2}&LGORT=${v3}&Indicator=${v4}&View=${v5}`,

    null,
    'getCapGovMaterialReport'
  );
}
//temp
export function getCapGovMaterialReport1(value, v1, v2, v3, v4, v5) {
  return API_CALL(
    'GET',
    `GetCapGovMaterialReport?Material=${value}&cuid=${v1}&Organization=${v2}&LGORT=${v3}&Indicator=${v4}&View=${v5}`,
    null,
    'getCapGovMaterialReport1'
  );
}

//

export function getCapGovInfoForMaterial(value, v1, v2, v3, v4, v5) {
  return API_CALL(
    'GET',
    `GetCapGovInfoForMaterial?Material=${value}&cuid=${v1}&Organization=${v2}&LGORT=${v3}&Indicator=${v4}&View=${v5}`,

    null,
    'getCapGovInfoForMaterial'
  );
}

//temp
export function getCapGovInfoForMaterial1(value, v1, v2, v3, v4, v5) {
  return API_CALL(
    'GET',
    `GetCapGovInfoForMaterial?Material=${value}&cuid=${v1}&Organization=${v2}&LGORT=${v3}&Indicator=${v4}&View=${v5}`,
    null,
    'getCapGovInfoForMaterial1'
  );
}

//

export function getMaterialForMapView(value, val, v3, v4) {
  return API_CALL(
    'GET',
    `GetMaterialForMapView?Material=${value}&cuid=${val}&LGORT=${v3}&Indicator=${v4}`,
    null,
    'getMaterialForMapView'
  );
}
export function getMaterialForMapViewDD(val1, val2, val3, v5, v6) {
  return API_CALL(
    'GET',
    `GetMaterialForMapViewDD?Material=${val1}&Latitude=${val2}&cuid=${val3}&LGORT=${v5}&Indicator=${v6}`,
    null,
    'getMaterialForMapViewDD'
  );
}
export function getHistoricalForecastWeekly(val1, val2, v3) {
  return API_CALL(
    'GET',
    `GetHistoricalForecastWeekly?Material=${val1}&Date=${val2}&LGORT=${v3}`,
    null,
    'getHistoricalForecastWeekly'
  );
}
export function getUserDetailsBySearch(value) {
  return API_CALL(
    'GET',
    'GetUserDetailsBySearch?SearchFieldValue=' + value,
    null,
    'getUserDetailsBySearch'
  );
}
export function getUserImpersonationDetails(value) {
  return API_CALL(
    'GET',
    'GetUserImpersonationDetails?Email=' + value,
    null,
    'getUserImpersonationDetails'
  );
}
export function saveImpersonationDetails(val1, val2) {
  return API_CALL(
    'GET',
    `SaveImpersonationDetails?Usercuid=${val1}&Impcuid=${val2}`,
    null,
    'saveImpersonationDetails'
  );
}
export function clearImpersonationDetails(value) {
  return API_CALL(
    'GET',
    'ClearImpersonationDetails?Usercuid=' + value,
    null,
    'clearImpersonationDetails'
  );
}
export function getCapGovMaterialReportDD(v1, v2, v3) {
  return API_CALL(
    'GET',
    `GetCapGovMaterialReportDD?cuid=${v1}&LGORT=${v2}&Indicator=${v3}`,

    null,
    'getCapGovMaterialReportDD'
  );
}
export function getTurnOverRate() {
  return API_CALL('GET', 'GetTurnOverRate', null, 'getTurnOverRate');
}
export function getBackOrderRateMaterial() {
  return API_CALL('GET', 'GetBackOrderRateMaterial', null, 'getBackOrderRateMaterial');
}
export function getBackOrderRateManufacturer() {
  return API_CALL('GET', 'GetBackOrderRateManufacturer', null, 'getBackOrderRateManufacturer');
}
export function getBackOrderRateOrganization() {
  return API_CALL('GET', 'GetBackOrderRateOrganization', null, 'getBackOrderRateOrganization');
}
export function getTurnOverRateOrganization() {
  return API_CALL('GET', 'GetTurnOverRateOrganization', null, 'getTurnOverRateOrganization');
}
export function getTurnOverRateMaterial() {
  return API_CALL('GET', 'GetTurnOverRateMaterial', null, 'getTurnOverRateMaterial');
}
export function getTurnOverRateManufacturer() {
  return API_CALL('GET', 'getTurnOverRateManufacturer', null, 'getTurnOverRateManufacturer');
}

export function getOrderPushPullMaterial(callName) {
  if (callName == 'Push') {
    return API_CALL(
      'GET',
      'GetOrderPushPullMaterial?push_pull=' + callName,
      null,
      'getOrderPushPullMaterial'
    );
  }
  if (callName == 'Pull') {
    return API_CALL(
      'GET',
      'GetOrderPushPullMaterial?push_pull=' + callName,
      null,
      'getOrderPushPullMaterial'
    );
  }
}

export function getOrderPushPullManufacturer(callName, v2, v4, v5) {
  if (callName == 'Push') {
    return API_CALL(
      'GET',
      `GetOrderPushPullManufacturer?push_pull=${callName}&cuid=${v2}&LGORT=${v4}&Indicator=${v5}`,

      null,
      'getOrderPushPullManufacturer'
    );
  } else {
    return API_CALL(
      'GET',
      `GetOrderPushPullManufacturer?push_pull=${callName}&cuid=${v2}&LGORT=${v4}&Indicator=${v5}`,
      null,
      'getOrderPushPullManufacturer'
    );
    // if (callName == "Pull") {
    //   return API_CALL(
    //     "GET",
    //     `GetOrderPushPullManufacturer?push_pull=${callName}&cuid=${v2}`,
    //     null,
    //     "getOrderPushPullManufacturer"
    //   );
    // }
  }
}

//backup manufacturer
// export function getOrderPushPullManufacturer(callName, v2) {
//   if (callName == "Push") {
//     return API_CALL(
//       "GET",
//       `GetOrderPushPullManufacturer?push_pull=${callName}&cuid=${v2}`,

//       null,
//       "getOrderPushPullManufacturer"
//     );
//   }
//   if (callName == "Pull") {
//     return API_CALL(
//       "GET",
//       `GetOrderPushPullManufacturer?push_pull=${callName}&cuid=${v2}`,
//       null,
//       "getOrderPushPullManufacturer"
//     );
//   }
// }
//end

export function getApproverList() {
  return API_CALL('GET', 'GetApproverList', null, 'getApproverList');
}
export function getApprovalStatusCount(val, v1, v4, v5) {
  return API_CALL(
    'GET',
    `GetApprovalStatusCount?push_pull=${val}&cuid=${v1}&LGORT=${v4}&Indicator=${v5}`,
    null,
    'getApprovalStatusCount'
  );
}
export function getApprovalStatusForMaterial(v1, v2, v3, v4) {
  return API_CALL(
    'GET',
    `GetApprovalStatusForMaterial?Material=${v1}&PO=${v2}&PO_LINE=${v3}&email=${v4}`,
    null,
    'getApprovalStatusForMaterial'
  );
}
export function getOrderPushPullMaterialV2(val1, val2, v3, v5, v6) {
  return API_CALL(
    'GET',
    `GetOrderPushPullMaterialV2?push_pull=${val1}&Status=${val2}&cuid=${v3}&LGORT=${v5}&Indicator=${v6}`,
    null,
    'getOrderPushPullMaterialV2'
  );
}

export function getSupplyChainInventoryPos(callName, v1, v3, v4) {
  if (callName == 'AdvancePoMatnr') {
    return API_CALL(
      'GET',
      `GetSupplyChainInventoryPos?typeOfView=${callName}&cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

      null,
      'getSupplyChainInventoryPos'
    );
  } else if (callName == 'AdvancePoOrganisation') {
    return API_CALL(
      'GET',
      `GetSupplyChainInventoryPos?typeOfView=${callName}&cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
      null,
      'getSupplyChainInventoryPos'
    );
  } else if (callName == 'OnOrderMatnr') {
    return API_CALL(
      'GET',
      `GetSupplyChainInventoryPos?typeOfView=${callName}&cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
      null,
      'getSupplyChainInventoryPos'
    );
  } else if (callName == 'OnOrderOrganisation') {
    return API_CALL(
      'GET',
      `GetSupplyChainInventoryPos?typeOfView=${callName}&cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
      null,
      'getSupplyChainInventoryPos'
    );
  }
}

export function getWidgetDDData(callName, v1, v3, v4, v5) {
  if (callName == 'UnderStock') {
    return API_CALL(
      'GET',
      `GetFillRateDD_Understock?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

      null,
      'getWidgetDDData'
    );
  } else if (callName == 'OverStock') {
    return API_CALL(
      'GET',
      `GetFillRateDD_Overstock?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

      null,
      'getWidgetDDData'
    );
  } else if (callName == 'fillrate') {
    return API_CALL(
      'GET',
      `GetHarvestERTReceivedDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

      null,
      'getWidgetDDData'
    );
  } else if (callName == 'PredictedCapEx') {
    return API_CALL(
      'GET',
      `GetPredictedCapExDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

      null,
      'getWidgetDDData'
    );
  } else if (callName == 'SuppOrderRateDD') {
    return API_CALL(
      'GET',
      `GetSupplierEfficiencyOrderRateDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

      null,
      'getWidgetDDData'
    );
  } else if (callName == 'SuppOverDueDD') {
    return API_CALL(
      'GET',
      `GetSupplierEfficiencyOverDueTodayDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
      null,
      'getWidgetDDData'
    );
  } else if (callName == 'SuppOutstandingDD') {
    return API_CALL(
      'GET',
      `GetNoOfOutStandingOrdersDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
      null,
      'getWidgetDDData'
    );
  } else if (callName == 'SuppBackOrdersDD') {
    return API_CALL(
      'GET',
      `GetNoOfBackOrdersDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,
      null,
      'getWidgetDDData'
    );
  } else if (callName == 'CurrentInventory') {
    return API_CALL(
      'GET',
      //`GetPredictedOrderQuantity?cuid=${v1}&Organization=${v2}&LGORT=${v3}`,
      `GetCurrentInventoryCapexDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}&type=${v5}`,
      null,
      'getWidgetDDData'
    );
  } else if (callName == 'Harvest') {
    return API_CALL(
      'GET',
      `GetHarvestCompletedDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}`,

      null,
      'getWidgetDDData'
    );
  } else if (callName == 'InstallBaseHarvest') {
    return API_CALL(
      'GET',
      `GetInstallBaseDD?cuid=${v1}&LGORT=${v3}&Indicator=${v4}&type=${v5}`,

      null,
      'getWidgetDDData'
    );
  }
}

export function getPredictedBarChart(value) {
  if (value == 'cancel') {
    // eslint-disable-next-line no-undef
    source.cancel();
  } else {
    let type = 'getPredictedBarChart';
    return function (dispatch) {
      dispatch({
        type,
        payload: value
      });
    };
  }
}
export const ChatBotToggler = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'ChatBotToggler',
      payload: data
    });
  };
};

export const ChatBot = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'ChatBot',
      payload: data
    });
  };
};

export const getTotalQuantityAndCapexLoader = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'getTotalQuantityAndCapexLoader',
      payload: data
    });
  };
};
export const DirectLineController = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'DirectLineController',
      payload: data
    });
  };
};

//redux-loaders

export const EoqTblLoader = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'EoqTblLoader',
      payload: data
    });
  };
};

//report
export const ReportFilterToggle = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'ReportFilterToggle',
      payload: data
    });
  };
};

//report hide and show
export const ReportNavHideShow = (data) => {
  return function (dispatch) {
    dispatch({
      type: 'ReportNavHideShow',
      payload: data
    });
  };
};

//NBA- Harvesting Switch toggle
export const SwitchData = (data) => {
  return async function (dispatch) {
    dispatch({
      type: 'SwitchData',
      payload: data
    });
  };
};
