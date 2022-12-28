import React from 'react';

// eslint-disable-next-line no-unused-vars
import { Row, Col, Button } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';
// eslint-disable-next-line no-unused-vars
import ToolkitProvider, { Search, CSVExport } from 'react-bootstrap-table2-toolkit';

import ReactDragListView from 'react-drag-listview';

import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const fileExtension = '.xlsx';
const { SearchBar } = Search;
// const { ExportCSVButton } = CSVExport;

class ReusableTable extends React.Component {
  constructor(props) {
    super(props);
    this.exportToCSV = this.exportToCSV.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);
    this.state = {
      TableData: this.props.TableData,
      TableColumn: this.props.TableColumn,
      HeaderTitle: ''
    };
  }
  onDragEnd(fromIndex, toIndex) {
    const columnsCopy = this.state.TableColumn.slice();
    const item = columnsCopy.splice(fromIndex, 1)[0];
    columnsCopy.splice(toIndex, 0, item);
    this.setState({ TableColumn: columnsCopy });
  }
  exportToCSV() {
    let csvData = this.state.TableData;
    let fileName = this.props.fileName;
    const ws = XLSX.utils.json_to_sheet(csvData);
    const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  render() {
    return (
      <>
        <ToolkitProvider
          keyField="id"
          data={this.state.TableData}
          columns={this.state.TableColumn}
          exportCSV={{
            onlyExportFiltered: true,
            exportAll: false,
            fileName: `${this.props.fileName}.csv`
          }}
          search={{
            afterSearch: (newResult) => {
              if (!newResult.length) {
                this.setState({
                  newResultLength: newResult.length
                });
              }
            }
          }}>
          {(props) => (
            <div>
              <Row className="mb-1">
                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  {this.props.HeaderTitle}
                </Col>
                <Col xs={12} sm={12} md={12} lg={12} xl={12} className="float-right search-right">
                  {this.state.TableData != 0 ? (
                    <Button
                      size="sm"
                      className="export-Btn ml-2 mr-2 float-right"
                      onClick={this.exportToCSV}>
                      <i className="fas fa-file-excel" />
                    </Button>
                  ) : (
                    <Button
                      disabled
                      size="sm"
                      className="export-Btn ml-2 mr-2 float-right"
                      onClick={this.exportToCSV}>
                      <i className="fas fa-file-excel" />
                    </Button>
                  )}
                  {/* <Button size="sm" className="export-Btn1 float-right ml-3 mr-2 mb-2" onClick={this.exportToCSV}><i className="fas fa-file-excel" style={{"color":"#007c00"}} /></Button> */}
                  <SearchBar {...props.searchProps} />
                </Col>
              </Row>
              <ReactDragListView.DragColumn onDragEnd={this.onDragEnd.bind(this)} nodeSelector="th">
                <div className="capgov-table">
                  <BootstrapTable
                    {...props.baseProps}
                    pagination={paginationFactory()}
                    noDataIndication={
                      <div className="tbl-no-data-found">
                        <div>
                          <h5>No data available for this criteria</h5>
                        </div>
                      </div>
                    }
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
ReusableTable.defaultProps = {
  HeaderTitle: ''
};
export default ReusableTable;
