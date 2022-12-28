import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  getTurnOverRate,
  getTurnOverRateMaterial,
  getTurnOverRateMonthwise,

  //  all To
  getAllTurnOverRate,
  getAllTurnOverRateMonthwise,

  //bo
  getBackOrderRate,
  getBackOrderRateMonthwise,
  getBackOrderRateMaterial,

  //fao
  getForcastAccuracyDemand,
  getForcastAccuracyMaterial,
  getForcastAccuracyMonthwise,
  getForcastAccuracyMinMaxDate,
  getAllTurnOverRateManufacturer
} from '../../actions';

import { Row, Col } from 'antd';
import TurnoverRate from './TurnoverRate/TurnoverRate';
import Backorder from './BackorderRate.js/Backorder';
import ForecastAccuracy from './ForecastAccuracy/ForecastAccuracy';

class Kpi extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // this.props.getTurnOverRate(),
    //   this.props.getTurnOverRateMaterial(),
    //   this.props.getTurnOverRateMonthwise();
    //  all To
    // this.props.getAllTurnOverRate(),
    // this.props.getAllTurnOverRateMonthwise(),
    // this.props.getAllTurnOverRateManufacturer();
    // //bo
    // this.props.getBackOrderRate(),
    // this.props.getBackOrderRateMonthwise(),
    // this.props.getBackOrderRateMaterial(),
    //fao
    // this.props.getForcastAccuracyDemand("all", "all"),
    //   this.props.getForcastAccuracyMaterial("all", "all"),
    //   this.props.getForcastAccuracyMonthwise("all", "all"),
    //   this.props.getForcastAccuracyMinMaxDate();
  }

  render() {
    return (
      <div>
        <Row gutter={16} style={{ margin: '0px' }}>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            <TurnoverRate />{' '}
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            {' '}
            <Backorder />{' '}
          </Col>
          <Col xs={24} sm={24} md={12} lg={8} xl={8}>
            {' '}
            <ForecastAccuracy />
          </Col>
        </Row>
      </div>
    );
  }
}

function mapState() {
  return {};
}

export default connect(mapState, {
  getTurnOverRate,
  getTurnOverRateMaterial,
  getTurnOverRateMonthwise,
  getAllTurnOverRate,
  getAllTurnOverRateMonthwise,
  getBackOrderRate,
  getBackOrderRateMonthwise,
  getBackOrderRateMaterial,
  getForcastAccuracyDemand,
  getForcastAccuracyMaterial,
  getForcastAccuracyMonthwise,
  getForcastAccuracyMinMaxDate,
  getAllTurnOverRateManufacturer
})(Kpi);
