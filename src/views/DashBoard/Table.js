import React from 'react';

import { Row, Col, Card } from 'antd';
import BootstrapTable from 'react-bootstrap-table-next';
import paginationFactory from 'react-bootstrap-table2-paginator';

class Table extends React.Component {
  constructor(props) {
    super(props);
    this.costformat = this.costformat.bind(this);
    this.state = {
      tableData: [
        {
          MATNR: '1377179',
          'Prediction demand 30_days': '281',
          MEDIAN_LEADTIME: '41',
          'Current Inventory': '146',
          'Quantiy to Order': '281',
          'Reorder Date': '3/23/21',
          'Unit Price': '6475',
          'Predicted CapEx': '1819475',
          'Reorder Point': '463'
        },
        {
          MATNR: '1369153',
          'Prediction demand 30_days': '54',
          MEDIAN_LEADTIME: '64',
          'Current Inventory': '135',
          'Quantiy to Order': '100',
          'Reorder Date': '12/17/20',
          'Unit Price': '9000',
          'Predicted CapEx': '900000',
          'Reorder Point': '227'
        },
        {
          MATNR: '1368444',
          'Prediction demand 30_days': '79',
          MEDIAN_LEADTIME: '58',
          'Current Inventory': '52',
          'Quantiy to Order': '104',
          'Reorder Date': '12/17/20',
          'Unit Price': '7053',
          'Predicted CapEx': '733512',
          'Reorder Point': '384'
        },
        {
          MATNR: '1385483',
          'Prediction demand 30_days': '167',
          MEDIAN_LEADTIME: '70',
          'Current Inventory': '125',
          'Quantiy to Order': '167',
          'Reorder Date': '2/5/21',
          'Unit Price': '2125.63',
          'Predicted CapEx': '354980.21',
          'Reorder Point': '481'
        },
        {
          MATNR: '1368472',
          'Prediction demand 30_days': '353',
          MEDIAN_LEADTIME: '61',
          'Current Inventory': '5',
          'Quantiy to Order': '534',
          'Reorder Date': '12/17/20',
          'Unit Price': '2552',
          'Predicted CapEx': '1362768',
          'Reorder Point': '794'
        },
        {
          MATNR: '1365514',
          'Prediction demand 30_days': '224',
          MEDIAN_LEADTIME: '45',
          'Current Inventory': '160',
          'Quantiy to Order': '293',
          'Reorder Date': '12/17/20',
          'Unit Price': '2825',
          'Predicted CapEx': '827725',
          'Reorder Point': '423'
        },
        {
          MATNR: '1341595',
          'Prediction demand 30_days': '21',
          MEDIAN_LEADTIME: '44',
          'Current Inventory': '123',
          'Quantiy to Order': '21',
          'Reorder Date': '3/7/21',
          'Unit Price': '11644',
          'Predicted CapEx': '244524',
          'Reorder Point': '68'
        },
        {
          MATNR: '1391566',
          'Prediction demand 30_days': '198',
          MEDIAN_LEADTIME: '28',
          'Current Inventory': '67',
          'Quantiy to Order': '198',
          'Reorder Date': '12/20/20',
          'Unit Price': '2159',
          'Predicted CapEx': '427482',
          'Reorder Point': '248'
        },
        {
          MATNR: '1413939',
          'Prediction demand 30_days': '23',
          MEDIAN_LEADTIME: '64',
          'Current Inventory': '13',
          'Quantiy to Order': '46',
          'Reorder Date': '12/17/20',
          'Unit Price': '29133',
          'Predicted CapEx': '1340118',
          'Reorder Point': '45'
        },
        {
          MATNR: '1413910',
          'Prediction demand 30_days': '28',
          MEDIAN_LEADTIME: '62',
          'Current Inventory': '9',
          'Quantiy to Order': '42',
          'Reorder Date': '12/17/20',
          'Unit Price': '29133',
          'Predicted CapEx': '1223586',
          'Reorder Point': '46'
        },
        {
          MATNR: '1413993',
          'Prediction demand 30_days': '17',
          MEDIAN_LEADTIME: '50',
          'Current Inventory': '18',
          'Quantiy to Order': '23',
          'Reorder Date': '12/17/20',
          'Unit Price': '29133',
          'Predicted CapEx': '670059',
          'Reorder Point': '32'
        },
        {
          MATNR: '1368681',
          'Prediction demand 30_days': '9',
          MEDIAN_LEADTIME: '63',
          'Current Inventory': '3',
          'Quantiy to Order': '9',
          'Reorder Date': '2/24/21',
          'Unit Price': '48165',
          'Predicted CapEx': '433485',
          'Reorder Point': '24'
        },
        {
          MATNR: '1452969',
          'Prediction demand 30_days': '86',
          MEDIAN_LEADTIME: '108',
          'Current Inventory': '131',
          'Quantiy to Order': '86',
          'Reorder Date': '1/11/21',
          'Unit Price': '7000',
          'Predicted CapEx': '602000',
          'Reorder Point': '795'
        },
        {
          MATNR: '1415603',
          'Prediction demand 30_days': '367',
          MEDIAN_LEADTIME: '32',
          'Current Inventory': '1876',
          'Quantiy to Order': '367',
          'Reorder Date': '3/25/21',
          'Unit Price': '749',
          'Predicted CapEx': '274883',
          'Reorder Point': '444'
        },
        {
          MATNR: '1413955',
          'Prediction demand 30_days': '13',
          MEDIAN_LEADTIME: '54',
          'Current Inventory': '18',
          'Quantiy to Order': '17',
          'Reorder Date': '12/17/20',
          'Unit Price': '29133',
          'Predicted CapEx': '495261',
          'Reorder Point': '30'
        },
        {
          MATNR: '1380210',
          'Prediction demand 30_days': '187',
          MEDIAN_LEADTIME: '33',
          'Current Inventory': '121',
          'Quantiy to Order': '187',
          'Reorder Date': '5/6/21',
          'Unit Price': '1518.81',
          'Predicted CapEx': '284017.47',
          'Reorder Point': '146'
        },
        {
          MATNR: '1381063',
          'Prediction demand 30_days': '7',
          MEDIAN_LEADTIME: '63',
          'Current Inventory': '5',
          'Quantiy to Order': '7',
          'Reorder Date': '1/29/21',
          'Unit Price': '85800',
          'Predicted CapEx': '600600',
          'Reorder Point': '15'
        },
        {
          MATNR: '1368619',
          'Prediction demand 30_days': '16',
          MEDIAN_LEADTIME: '67',
          'Current Inventory': '2',
          'Quantiy to Order': '17',
          'Reorder Date': '12/17/20',
          'Unit Price': '48165',
          'Predicted CapEx': '818805',
          'Reorder Point': '21'
        },
        {
          MATNR: '1408198',
          'Prediction demand 30_days': '6',
          MEDIAN_LEADTIME: '25',
          'Current Inventory': '7',
          'Quantiy to Order': '12',
          'Reorder Date': '12/17/20',
          'Unit Price': '16453',
          'Predicted CapEx': '197436',
          'Reorder Point': '13'
        },
        {
          MATNR: '1456827',
          'Prediction demand 30_days': '61',
          MEDIAN_LEADTIME: '49',
          'Current Inventory': '106',
          'Quantiy to Order': '111',
          'Reorder Date': '12/17/20',
          'Unit Price': '22990',
          'Predicted CapEx': '2551890',
          'Reorder Point': '156'
        }
      ],
      tableColumn: [
        {
          dataField: 'MATNR',
          text: 'Material',
          sort: true,
          headerStyle: { width: 100 }
        },
        {
          dataField: 'Prediction demand 30_days',
          text: 'Predicted Demand(Monthly)',
          sort: true,
          headerStyle: { width: 150 }
        },
        {
          dataField: 'MEDIAN_LEADTIME',
          text: 'Lead Time(Median)',
          sort: true,
          headerStyle: { width: 120 }
        },
        {
          dataField: 'Current Inventory',
          text: 'Current Inventory',
          sort: true
        },
        {
          dataField: 'Quantiy to Order',
          text: 'Quantity to Order',
          sort: true
        },
        { dataField: 'Reorder Date', text: 'Reorder Date', sort: true },
        {
          dataField: 'Unit Price',
          text: 'Unit Price',
          formatter: this.costformat,
          sort: true,
          headerStyle: { width: 120 }
        },
        {
          dataField: 'Predicted CapEx',
          text: 'Predicted CapEx',
          formatter: this.costformat,
          sort: true
        },
        { dataField: 'Reorder Point', text: 'Reorder Point', sort: true }
      ]
    };
  }
  costformat(cell) {
    var values = [];
    if (cell < 1000) {
      let value = (cell / 1).toFixed(2);
      values.push(<span>${value}</span>);
    } else if (cell < 9999 || cell < 1000000) {
      let value = cell;
      values.push(<span>${value}</span>);
    } else if (cell < 10000000 || cell < 1000000000) {
      let value = (cell / 1000000).toFixed(2);
      values.push(<span>${value}M</span>);
    } else if (cell < 1000000000000) {
      let value = (cell / 1000000000).toFixed(2);
      values.push(<span>${value}B</span>);
    }
    return values;
  }
  render() {
    return (
      <div>
        <Row>
          <Row>
            <Col xs={24} sm={24} md={24} lg={24} xl={24} className="pr-2 pl-2">
              <Card
                title={
                  <div>
                    <Col xs={14} sm={14} md={14} lg={14} xl={14} className="pr-2 pl-2">
                      <i className="fas fa-table mr-2" />
                      Predicted Order Quantity(EOQ)
                    </Col>
                  </div>
                }>
                <div>
                  <BootstrapTable
                    keyField="id"
                    data={this.state.tableData}
                    columns={this.state.tableColumn}
                    pagination={paginationFactory()}
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </Row>
      </div>
    );
  }
}
export default Table;
