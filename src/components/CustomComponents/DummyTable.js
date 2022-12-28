import React from "react";
import BootstrapTable from "react-bootstrap-table-next";
import paginationFactory from "react-bootstrap-table2-paginator";
import filterFactory, { textFilter } from "react-bootstrap-table2-filter";

import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import PropagateLoader from "react-spinners/PropagateLoader";
import { Row, Col, Button } from "antd";
const { SearchBar } = Search;
const tblLoader = () => {
  return (
    <div className="tbl-loading">
      <h6>Loading</h6>
      <PropagateLoader color={"#fff"} />
    </div>
  );
};

export const DummyTable = (props) => {
  const sizePerPageRenderer = ({
    options,
    currSizePerPage,
    onSizePerPageChange,
  }) => (
    <div className="btn-group" role="group">
      {options.map((option) => {
        const isSelect = currSizePerPage === `${option.page}`;
        return (
          <button
            key={option.text}
            type="button"
            onClick={() => onSizePerPageChange(option.page)}
            className={`btn ${isSelect ? "btn-secondary" : "btn-warning"}`}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );

  const pageoptions = {
    sizePerPageRenderer,
  };
  const data = [];
  return (
    <div>
      <ToolkitProvider keyField="id" data={data} columns={props.column} search>
        {(props) => (
          <div>
            <Row>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} />
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className="text-right float-right"
              >
                <SearchBar {...props.searchProps} />
                <Button
                  disabled
                  size="sm"
                  className="export-Btn ml-2 mr-2 float-right"
                >
                  <i className="fas fa-file-excel" />
                </Button>
              </Col>
            </Row>

            <BootstrapTable
              {...props.baseProps}
              noDataIndication={tblLoader}
              pagination={paginationFactory(pageoptions)}
            />
          </div>
        )}
      </ToolkitProvider>

      {/* <ToolkitProvider
  keyField="id"
  data={ products }
  columns={ columns }
  search
>
  {
    props => (
      <div>
        <h3>Input something at below input field:</h3>
        <SearchBar { ...props.searchProps } />
        <hr />
        <BootstrapTable
          { ...props.baseProps }
        />
      </div>
    )
  }
</ToolkitProvider>

      <BootstrapTable
        keyField="id"
        data={data}
        columns={props.column}
        noDataIndication={tblLoader}
        pagination={paginationFactory()}
      /> */}
    </div>
  );
};
