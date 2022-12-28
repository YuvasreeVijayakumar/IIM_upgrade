import { Col, Row } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { calculation } from '../../../Calculation';
import { NoDataTextLoader } from '../../../ReusableComponent/NoDataTextLoader';
import { ReusableSysncLoader } from '../../../ReusableComponent/ReusableSysncLoader';
export const CapgovInstallBase = () => {
  const getNBAManufCapGovRequestData = useSelector((state) => state.getNBAManufCapGovRequest);
  const getNBAManufCapGovRequestReducerLoader = useSelector(
    (state) => state.getNBAManufCapGovRequestReducerLoader
  );
  return (
    <>
      {!getNBAManufCapGovRequestReducerLoader && getNBAManufCapGovRequestData.length > 0 ? (
        <div>
          <Row className="v4">
            <Col>
              <div>
                <Row>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">Install Base:</div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {getNBAManufCapGovRequestData[0]?.InstallBase}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">
                      <b>Harvesting</b>(Universe/InProgress/YTD)
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {getNBAManufCapGovRequestData[0]?.Harvesting}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">12 Month Redeploy Value:</div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {calculation(getNBAManufCapGovRequestData[0]?.Redeploy_Value)}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-5">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">
                      {' '}
                      <b>Begin:</b>Warehouse On-Hand
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {getNBAManufCapGovRequestData[0]?.Begin}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">
                      {' '}
                      <b>Less:</b>Leadtime Demand
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {getNBAManufCapGovRequestData[0]?.Less}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">
                      <b>Add:</b>Current Vendor On Order
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">{getNBAManufCapGovRequestData[0]?.Add}</div>
                  </Col>
                  <hr className="adjust_horizontal_line" />
                </Row>
                <Row className="mt-1">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">Gross New Need</div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {getNBAManufCapGovRequestData[0]?.Gross_New_Need}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-1">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">
                      <b>Add : </b>Safety Stock Adjust
                    </div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {getNBAManufCapGovRequestData[0]?.Add_MOH_Adjust}
                    </div>
                  </Col>
                  <hr className="adjust_horizontal_line" />
                </Row>
                <Row className="mt-1">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17"> Net New Need</div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {getNBAManufCapGovRequestData[0]?.Net_New_Need}
                    </div>
                  </Col>
                </Row>
                <Row className="mt-5 margin-change">
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17">Cap Gov Request:</div>
                  </Col>
                  <Col xs={12} sm={12} md={12} lg={12} xl={12} className="pr-2 pl-2">
                    <div className="font-17 text-right">
                      {calculation(getNBAManufCapGovRequestData[0]?.CapGov_Request)}
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      ) : (
        <div className="Nba-load-height">
          {getNBAManufCapGovRequestReducerLoader ? <ReusableSysncLoader /> : <NoDataTextLoader />}
        </div>
      )}
    </>
  );
};
