import React from 'react';

// eslint-disable-next-line no-unused-vars
import { Row, Col, Button, Input } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
import ToolkitProvider, { CSVExport } from 'react-bootstrap-table2-toolkit';
import filterFactory from 'react-bootstrap-table2-filter';
import PropagateLoader from 'react-spinners/PropagateLoader';

import {
  getBulkExport,
  UpdatePage,
  UpdateSizePerPage,
  UpdateSorting,
  UpdateSearchValue,
  ClearUpdateSearchValue,
  getBulkExcelExport,
  getBulkExcelExportBlob
} from '../../actions';
import { connect } from 'react-redux';

import ReactDragListView from 'react-drag-listview';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';

// eslint-disable-next-line no-unused-vars
const { ExportCSVButton } = CSVExport;

class CutomTable extends React.Component {
  constructor(props) {
    super(props);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.onSearch = this.onSearch.bind(this);

    this.handleTableChange = this.handleTableChange.bind(this);
    this.state = {
      cuid: this.props.cuid,
      view: this.props.view,
      Org: this.props.Org,
      LGORT: this.props.LGORT,
      Indicator: this.props.Ind,
      TableData: this.props.TableData,
      TableColumn: [{ text: '' }],
      SearchInput: this.props.SearchValue,
      sizePerPage: this.props.SizePerPage,
      Loader: this.props.Loader,
      iconLoading: false,
      page: this.props.Page,
      totalSize: this.props.PageCount,
      HeaderTitle: '',
      getBulkExcelExportBlobData: ''
    };
  }
  // componentDidMount() {}
  UNSAFE_componentWillUpdate(nextProps) {
    if (this.props.getBulkExcelExportBlobData != nextProps.getBulkExcelExportBlobData) {
      if (nextProps.getBulkExcelExportBlobData != 0) {
        this.setState({
          getBulkExcelExportBlobData: nextProps.getBulkExcelExportBlobData
        });
      } else {
        this.setState({
          getBulkExcelExportBlobData: ''
        });
      }
    }
    if (this.props.getBulkExcelExportData != nextProps.getBulkExcelExportData) {
      if (nextProps.getBulkExcelExportData.Table != 0) {
        let csvData = nextProps.getBulkExcelExportData.Table;
        let fileName = this.props.fileName;
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
        this.setState({
          iconLoading: false
        });
      } else {
        this.setState({
          iconLoading: true
        });
      }
    }
  }
  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.TableColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ TableColumn: columnsCopy });
  }
  exportToCSV() {
    this.setState({
      iconLoading: true
    });
    if (this.props.view != 'Inventory Balances') {
      this.props.getBulkExcelExport(
        this.props.cuid,
        this.props.LGORT,
        this.props.Ind,
        this.props.view == 'CapGov Request'
          ? 'Capgov_request'
          : this.props.view == 'Stock Visualization'
          ? 'CAPGOV_REPORT'
          : this.props.view == 'Forecast'
          ? 'FORECAST_OVERWRITE'
          : this.props.view == 'Inventory Balances'
          ? 'INVENTORY_BALANCES'
          : '',

        this.props.sortField + ' ' + this.props.sortOrder,
        this.props.SearchValue
      );
    } else {
      this.props.getBulkExcelExportBlob();
    }
  }
  onSearch(value) {
    this.props.UpdateSearchValue(value);
    this.props.getBulkExport(
      this.props.cuid,
      this.props.LGORT,
      this.props.Ind,
      this.props.view == 'CapGov Request'
        ? 'Capgov_request'
        : this.props.view == 'Stock Visualization'
        ? 'CAPGOV_REPORT'
        : this.props.view == 'Forecast'
        ? 'FORECAST_OVERWRITE'
        : this.props.view == 'Inventory Balances'
        ? 'INVENTORY_BALANCES'
        : '',

      this.props.sortField + ' ' + this.props.sortOrder,
      this.props.Page,
      this.props.SizePerPage,

      value,

      this.props.EmptyAction
    );
  }

  // eslint-disable-next-line no-unused-vars
  handleTableChange(type, { page, sizePerPage, filters, sortField, sortOrder, cellEdit }) {
    return '';
  }
  sizePerPageListChange(sizePerPage) {
    this.setState({
      sizePerPage: sizePerPage
    });
    this.props.UpdatePage(1);
    this.props.UpdateSizePerPage(sizePerPage);
    this.props.getBulkExport(
      this.props.cuid,
      this.props.LGORT,
      this.props.Ind,
      this.props.view == 'CapGov Request'
        ? 'Capgov_request'
        : this.props.view == 'Stock Visualization'
        ? 'CAPGOV_REPORT'
        : this.props.view == 'Forecast'
        ? 'FORECAST_OVERWRITE'
        : this.props.view == 'Inventory Balances'
        ? 'INVENTORY_BALANCES'
        : '',

      this.props.sortField + ' ' + this.props.sortOrder,
      1,
      sizePerPage,
      this.props.SearchValue,

      this.props.EmptyAction
    );
  }

  onPageChange(page, sizePerPage) {
    this.setState({
      page: page,
      sizePerPage: sizePerPage
    });

    this.props.getBulkExport(
      this.props.cuid,
      this.props.LGORT,
      this.props.Ind,
      this.props.view == 'CapGov Request'
        ? 'Capgov_request'
        : this.props.view == 'Stock Visualization'
        ? 'CAPGOV_REPORT'
        : this.props.view == 'Forecast'
        ? 'FORECAST_OVERWRITE'
        : this.props.view == 'Inventory Balances'
        ? 'INVENTORY_BALANCES'
        : '',

      this.props.sortField + ' ' + this.props.sortOrder,
      page,
      sizePerPage,
      this.props.SearchValue,

      this.props.EmptyAction
    );

    this.props.UpdatePage(page);
  }
  ClearFilter() {
    this.setState({
      iconLoading: false
    });
    this.props.ClearUpdateSearchValue();
    this.props.getBulkExport(
      this.props.cuid,
      this.props.LGORT,
      this.props.Ind,
      this.props.view == 'CapGov Request'
        ? 'Capgov_request'
        : this.props.view == 'Stock Visualization'
        ? 'CAPGOV_REPORT'
        : this.props.view == 'Forecast'
        ? 'FORECAST_OVERWRITE'
        : this.props.view == 'Inventory Balances'
        ? 'INVENTORY_BALANCES'
        : '',

      this.props.sortField + ' ' + this.props.sortOrder,
      this.state.page,
      this.state.sizePerPage,
      [],

      this.props.EmptyAction
    );
  }

  tblLoader() {
    if (!this.props.Loader && !this.props.TableData.length > 0) {
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
  render() {
    const options = {
      showTotal: true,
      paginationTotalRenderer: customTotal,
      page: this.props.Page,
      sizePerPage: this.props.SizePerPage,
      totalSize: this.props.PageCount,
      //handlers
      onPageChange: this.onPageChange.bind(this),
      onSizePerPageChange: this.sizePerPageListChange.bind(this)
    };
    const customTotal = (from, to, size) => (
      <span className="react-bootstrap-table-pagination-total">
        Showing {from} to {to} of {size} Results
      </span>
    );
    // const defaultSortedBy = [
    //   {
    //     dataField: this.props.sortField,
    //     order: this.props.sortOrder // or asc
    //   }
    // ];

    return (
      <>
        <ToolkitProvider keyField="ID" data={this.props.TableData} columns={this.props.TableColumn}>
          {(props) => (
            <div>
              <Row className="mb-1">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  {this.props.HeaderTitle}
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="float-right search-right">
                  {/* <ExportCSVButton
                    {...props.csvProps}
                    className="float-right export-filer-css ml-2">
                    {' '}
                    <i className="fas fa-file-excel  pr-2" />
                    Excel
                  </ExportCSVButton> */}
                  {this.props.view != 'Inventory Balances' ? (
                    <>
                      {' '}
                      {this.props.TableData != 0 ? (
                        <Button
                          size="sm"
                          className="export-Btn ml-2 mr-2 float-right"
                          loading={this.state.iconLoading}
                          disabled={this.state.iconLoading}
                          onClick={this.exportToCSV}>
                          <i className="fas fa-file-excel pr-2" />
                          Excel
                        </Button>
                      ) : (
                        <Button
                          disabled
                          size="sm"
                          className="export-Btn ml-2 mr-2 float-right"
                          onClick={this.exportToCSV}>
                          <i className="fas fa-file-excel pr-2" />
                          Excel
                        </Button>
                      )}
                    </>
                  ) : (
                    <>
                      {this.props.TableData != 0 ? (
                        <>
                          <a
                            href={this.state.getBulkExcelExportBlobData}
                            className="hrefBtnExport ml-2 mr-2 float-right">
                            <i className="fas fa-file-excel mr-2" />{' '}
                            <span className="text-white">Excel</span>
                          </a>
                        </>
                      ) : (
                        <>
                          {' '}
                          <Button
                            size="sm"
                            disabled
                            className="export-Btn ml-2 mr-2 float-right"
                            // onClick={(e) => exportToCSVPushPullFileFormat(e)}
                            //onClick={<a>{this.state.getBulkExcelExportBlobData}</a>}
                          >
                            <i className="fas fa-file-excel mr-2" />{' '}
                            <a href={this.state.getBulkExcelExportBlobData}>
                              {' '}
                              <span className="text-white">Excel</span>
                            </a>
                          </Button>
                        </>
                      )}
                    </>
                  )}

                  {/* <div className="float-right mr-3">
                    {' '}
                    <SearchFilter
                      view={
                        this.props.view == 'CapGov Request'
                          ? 'Capgov_request'
                          : this.props.view == 'Stock Visualization'
                          ? 'CAPGOV_REPORT'
                          : this.props.view == 'Forecast'
                          ? 'FORECAST_OVERWRITE'
                          : this.props.view == 'Inventory Balances'
                          ? 'INVENTORY_BALANCES'
                          : ''
                      }
                      onSearch={this.onSearch}
                    />
                  </div> */}
                  {/* <Button
                    size="middle"
                    type="primary"
                    danger
                    className="mr-2 report-clr float-right"
                    onClick={this.ClearFilter.bind(this)}>
                    Clear Filter
                  </Button> */}
                </Col>
              </Row>
              <ReactDragListView.DragColumn onDragEnd={this.onDragEnd.bind(this)} nodeSelector="th">
                <div className="IIM-Reports">
                  <BootstrapTable
                    remote
                    keyField="Material"
                    filterPosition="top"
                    {...props.baseProps}
                    //defaultSorted={defaultSortedBy}
                    pagination={paginationFactory(options)}
                    filter={filterFactory()}
                    noDataIndication={this.tblLoader.bind(this)}
                    onTableChange={this.handleTableChange}
                  />
                </div>
              </ReactDragListView.DragColumn>
            </div>
          )}
        </ToolkitProvider>
      </>
    );
  }
}
CutomTable.defaultProps = {
  HeaderTitle: '',
  TableData: [],
  Loader: true,
  TableColumn: [{ text: '' }]
};
// eslint-disable-next-line no-unused-vars
function mapState(state) {
  return {
    getBulkExcelExportData: state.getBulkExcelExport,
    getBulkExcelExportBlobData: state.getBulkExcelExportBlob
  };
}
export default connect(mapState, {
  getBulkExport,
  UpdateSizePerPage,
  getBulkExcelExportBlob,
  UpdatePage,
  UpdateSorting,
  UpdateSearchValue,
  getBulkExcelExport,
  ClearUpdateSearchValue
})(CutomTable);
