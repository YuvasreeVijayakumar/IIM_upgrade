import React, { useState, useEffect } from 'react';
import { Col, Row, Tree, TreeSelect, Radio } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { getIIMVideos } from '../../actions';
import 'video-react/dist/video-react.css';
import {
  Player,
  ControlBar,
  ReplayControl,
  ForwardControl,
  CurrentTimeDisplay,
  TimeDivider,
  PlaybackRateMenuButton,
  VolumeMenuButton
} from 'video-react';

const treeData = [
  {
    title: 'Inventory',
    key: 'Inventory',
    value: 'Inventory',
    // icon: <SmileOutlined />,
    children: [
      {
        title: 'Predicted CapEx',
        key: 'Predicted CapEx',
        value: 'Predicted CapEx'
      },
      {
        title: 'Fill Rate',
        key: 'Fill Rate',
        value: 'Fill Rate'
      },
      {
        title: 'Supplier Efficiency',
        key: 'Supplier Efficiency',
        value: 'Supplier Efficiency'
      },
      {
        title: 'Harvesting',
        key: 'Harvesting',
        value: 'Harvesting'
      },
      {
        title: 'Consumption CapEx Trend',
        key: 'Consumption CapEx Trend',
        value: 'Consumption CapEx Trend'
      },
      {
        title: 'Predicted Order Quantity(EOQ)',
        key: 'Predicted Order Quantity(EOQ)',
        value: 'Predicted Order Quantity(EOQ)'
      },
      {
        title: 'Inventory Exhaust Detail - Recommendation',
        key: 'Inventory Exhaust Detail - Recommendation',
        value: 'Inventory Exhaust Detail - Recommendation'
      }
    ]
  },
  {
    title: 'Cap Gov',
    key: 'Cap Gov',
    value: 'Cap Gov',
    children: [
      {
        title: 'Cap Gov Detail Supply Chain - Inventory POs',
        key: 'Cap Gov Detail Supply Chain Inventory POs',
        value: 'Cap Gov Detail Supply Chain Inventory POs'
      },
      {
        title: 'Push Pull POs',
        key: 'Push Pull POs',
        value: 'Push Pull POs'
      },
      {
        title: 'Top 10 Organizations (By Materials)',
        key: 'Top 10 Organizations By Materials',
        value: 'Top 10 Organizations By Materials'
      },
      {
        title: 'Material Cap Gov Report',
        key: 'Material Cap Gov Report',
        value: 'Material Cap Gov Report'
      }
    ]
  },
  {
    title: 'KPI',
    key: 'KPI',
    value: 'KPI',
    children: [
      {
        title: 'TurnOverRate',
        key: 'TurnOverRate',
        value: 'TurnOverRate'
      },
      {
        title: 'BackOrderRate',
        key: 'BackOrderRate',
        value: 'BackOrderRate'
      },
      {
        title: 'Accuracy of Forecast Demand',
        key: 'Accuracy of Forecast Demand',
        value: 'Accuracy of Forecast Demand'
      },
      {
        title: 'LeadTime',
        key: 'LeadTime',
        value: 'LeadTime'
      },
      {
        title: 'Outstanding Orders',
        key: 'Outstanding Orders',
        value: 'Outstanding Orders'
      }
    ]
  }
];

export const OverAllFormula = () => {
  const dispatch = useDispatch();
  const getIIMVideosData = useSelector((state) => state.getIIMVideos);

  const [selected, setselected] = useState('formula');
  // const [expKeys, setExpKeys] = useState(['Inventory']);
  // eslint-disable-next-line no-unused-vars
  const [value, setValue] = useState(undefined);
  const [selKeys, setSelKeys] = useState(['Predicted CapEx']);
  const onChangeView = (value) => {
    setselected(value.target.value);

    if (value.target.value == 'formula') {
      setselected('formula');
    } else if (value.target.value == 'Video') {
      setselected('Video');
    }
  };
  useEffect(() => {
    dispatch(getIIMVideos('Predicted CapEx'));
  }, []);

  const [viewtxt, setviewtxt] = useState([
    // eslint-disable-next-line react/jsx-key
    <div>
      <div>
        {' '}
        <span className="white_clr">
          <div className="pr-20">
            <h4 className="text-info"> Predicted CapEx (Monthly)</h4>
            <p>
              <strong>Avg Budget Spend:</strong>
            </p>
            <ul>
              <li>Monthly Average Spend Based on the Historical data for past 12 months</li>
            </ul>
            <p>
              <strong>Predicted With Harvesting :</strong>
            </p>
            <ul>
              <li>Predicted Capital Expenditure for Next 30 Days (With Harvesting)</li>
            </ul>
            <p>
              <strong>Predicted Without Harvesting:</strong>
            </p>
            <ul>
              <li>Predicted Capital Expenditure for Next 30 Days (Without Harvesting)</li>
            </ul>
          </div>
        </span>
      </div>
    </div>
  ]);

  const datafunc = (val) => {
    if (val == 'Inventory') {
      setSelKeys(['Inventory']);
      setviewtxt(
        <div>
          <div>
            {' '}
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info"> Inventory</h4>
                <p>
                  <strong> Formulas for various metrics used in the IIM tool</strong>
                </p>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Predicted CapEx') {
      setSelKeys(['Predicted CapEx']);
      setviewtxt(
        <div>
          <div>
            {' '}
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info"> Predicted CapEx (Monthly)</h4>
                <p>
                  <strong>Avg Budget Spend:</strong>
                </p>
                <ul>
                  <li>Monthly Average Spend Based on the Historical data for past 12 months</li>
                </ul>
                <p>
                  <strong>Predicted With Harvesting :</strong>
                </p>
                <ul>
                  <li>Predicted Capital Expenditure for Next 30 Days (With Harvesting)</li>
                </ul>
                <p>
                  <strong>Predicted Without Harvesting:</strong>
                </p>
                <ul>
                  <li>Predicted Capital Expenditure for Next 30 Days (Without Harvesting)</li>
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Fill Rate') {
      setSelKeys(['Fill Rate']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info"> Fill Rate (Lead Time Based)</h4>

                <p>
                  <strong>Materials are flagged as Overstock when :-</strong>
                </p>
                <ul>
                  <li>{span2_content}</li>
                </ul>
                <p>
                  <strong>Materials are flagged as Understock when :-</strong>
                </p>
                <ul>
                  <li>{underStockDescription}</li>
                </ul>
                <p>
                  <strong>Fill Rate %:</strong>
                </p>
                <ul>
                  <li>Percent of Demand met (Calculated using Back Orders)</li>
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Supplier Efficiency') {
      setSelKeys(['Supplier Efficiency']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info"> Supplier Efficiency</h4>
                <p>
                  <strong>SLA Met(RDD):</strong>
                </p>
                <ul>
                  <li>% of orders which has been shipped on or before the requested date.</li>
                </ul>
                <p>
                  <strong>Overdue(RDD):</strong>
                </p>
                <ul>
                  <li>Number of Open Orders for which requested shipping date has passed.</li>
                </ul>
                <p>
                  <strong>No Of BackOrders:</strong>
                </p>
                <ul>
                  <li>No of orders that cannot be fulfilled and the revenue loss associated</li>
                </ul>
                <p>
                  <strong>Outstanding Orders:</strong>
                </p>
                <ul>
                  <li>Number of Open POs</li>
                </ul>
                <p>
                  <strong>RDD:</strong>
                </p>
                <ul>
                  <li>Requested Delivery Date</li>
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Harvesting') {
      setSelKeys(['Harvesting']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info"> Harvesting</h4>
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
            </span>
          </div>
        </div>
      );
    } else if (val == 'Consumption CapEx Trend') {
      setSelKeys(['Consumption CapEx Trend']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Consumption CapEx Trend(As of Date)</h4>
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
            </span>
          </div>
        </div>
      );
    } else if (val == 'Predicted Order Quantity(EOQ)') {
      setSelKeys(['Predicted Order Quantity(EOQ)']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Predicted Order Quantity(EOQ)</h4>
                <p>
                  <strong>Reorder Point:</strong>
                </p>
                <ul>
                  <li> Demand in Next Lead time + Safety Stock</li>
                  <div className="formula-img" />
                </ul>
                <p>
                  <strong>Total Incoming :</strong>
                </p>
                <ul>
                  <li>Inventory + Open POs + Incoming Harvest</li>
                </ul>
                <p>
                  <strong>Quantity to Order :</strong>
                </p>
                <ul>
                  <li>Reorder Point - Total Incoming + Next 30 day Demand (If understock) </li>
                  <li>Next 30 day Demand (If not understock)</li>
                  <li>
                    Calculated using Predicted Future Demand (Using Prophet Model) and Leadtime. The
                    Materials where we don&#39;t have enough data points, it is calculated using
                    Statistical Model(Demand Variation, Z Score Etc.)
                  </li>
                </ul>
                <p>
                  <strong>Reorder Date :</strong>
                </p>
                <ul>
                  <li>Today (If understock)</li>
                  <li>
                    Today + ((Total Incoming - Reorder Point)/demand per day) (If not understock)
                  </li>
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Inventory Exhaust Detail - Recommendation') {
      setSelKeys(['Inventory Exhaust Detail - Recommendation']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info"> Inventory Exhaust Detail - Recommendation</h4>
                <p>
                  <strong>Place PO:</strong>
                </p>
                <ul>
                  <li>When there are no Open Pos</li>
                </ul>
                <p>
                  <strong>Deliver overdue POs ASAP:</strong>
                </p>
                <ul>
                  <li>
                    When Open PO will last for next lead-time if delivered on requested ship date
                  </li>
                </ul>
                <p>
                  <strong>Deliver overdue POs ASAP &amp; Place PO:</strong>
                </p>
                <ul>
                  <li>
                    When Open PO will not last for next lead-time if delivered on requested ship
                    date
                  </li>
                </ul>
                <p>
                  <strong>Pull POs to exhaust date:</strong>
                </p>
                <ul>
                  <li>
                    When there is a gap between inventory exhaust date and requested ship date. And
                    Open PO will last for next lead-time if delivered on requested ship date
                  </li>
                </ul>
                <p>
                  <strong>Pull POs to exhaust date &amp; Place PO:</strong>
                </p>
                <ul>
                  <li>
                    When there is a gap between inventory exhaust date and requested ship date. And
                    Open PO will not last for next lead-time if delivered on requested ship date
                  </li>
                </ul>
                <p>
                  <strong>Overstock:</strong>
                </p>
                <ul>
                  <li>
                    Inventory + Open Pos (within lead-time) + harvest incoming (within lead-time)
                    &gt; (2*Reorder Point)
                  </li>
                </ul>
                <p>
                  <strong>Push POs to lead-time date:</strong>
                </p>
                <ul>
                  <li>When material is overstock, push extra quantity</li>
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    }
    //Cap Gov formulae starts
    else if (val == 'Cap Gov') {
      setSelKeys(['Cap Gov']);
      setviewtxt(
        <div>
          <div>
            {' '}
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info"> Cap Gov</h4>
                <p>
                  <strong>
                    {' '}
                    Cap Gov-Formulas for Capital Governance Report-(Order Push/Pull etc)used in the
                    iim tool
                  </strong>
                </p>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Cap Gov Detail Supply Chain Inventory POs') {
      setSelKeys(['Cap Gov Detail Supply Chain Inventory POs']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Cap Gov Detail Supply Chain - Inventory POs</h4>
                <p>
                  <ul>
                    <li>
                      <strong>Cap Gov Detail Supply Chain - Inventory POs</strong>
                      <br />
                      <br />
                      <ul>
                        <li>
                          Material and Organization details for: Advance PO: Monthly qty for
                          Advanced PO recommendation (Calculated using Cap Gov Report) Current PO:
                          Monthly qty for placed POs(Calculated using Open POs table)
                        </li>
                      </ul>
                    </li>
                  </ul>
                </p>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Push Pull POs') {
      setSelKeys(['Push Pull POs']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Push Pull POs</h4>
                <p>
                  <strong>Push Pull POs</strong>
                </p>
                <ul>
                  <li>
                    Details for Pulled/Pushed POs and their status as they are approved or Rejected.
                  </li>
                  <br />
                  <li>
                    Other reports gets updated according to Pull/Push date as a Pull/Push request is
                    approved.
                  </li>
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Top 10 Organizations By Materials') {
      setSelKeys(['Top 10 Organizations By Materials']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Top 10 Organizations (By Materials)</h4>
                <p>
                  <strong>Top 10 Organizations (By Materials)</strong>
                </p>
                <ul>
                  <li>
                    Top material from each organization in terms of Cap Gov request for material.
                  </li>
                  <br />
                  <li>Report is generated from Cap Gov report</li>
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Material Cap Gov Report') {
      setSelKeys(['Material Cap Gov Report']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Material Cap Gov Report</h4>
                <ul>
                  <li>
                    <p>
                      <strong>Ending On Hand View</strong>
                    </p>
                    <ul>
                      <li>
                        <p>
                          Monthly ending on hand quantity for materials. We try to maintain Ending
                          on Hand as Safety Stock.
                        </p>

                        <div className="eoh"></div>
                      </li>
                    </ul>
                  </li>
                </ul>
                <ul>
                  <li>
                    <strong>Forecast Consumption</strong>
                    <br />
                    <ul>
                      <li>
                        Bo distribution - open back orders quantity distributed on the forecast,
                        based on historical back orders delivery
                      </li>

                      <li>When an overwritten forecast is available:</li>
                      <span className="pl-3">Forecast = overwritten forecast</span>
                      <br />
                      <li>When an overwritten forecast is not available:</li>
                      <span className="pl-3">Forecast = iIM Forecast + Bo distribution</span>
                    </ul>
                  </li>
                </ul>
                <ul>
                  <li>
                    <p>
                      {' '}
                      <strong>Quantity To Order</strong>
                    </p>
                    <ul>
                      <li>
                        <p>
                          {' '}
                          Monthly quantity to order recommendation based on demand forecast and
                          inventory and place POs <br />
                        </p>
                      </li>
                      <ul>
                        <li>When Current month Ending on Hand &gt; Safety Stock</li>
                        <br />
                        <p style={{ paddingLeft: '15px' }}>
                          Quantity to Order = 0 <br />
                        </p>

                        <li>
                          When Current month Ending on Hand &lt; Safety Stock <br />
                        </li>
                      </ul>
                      <br />
                    </ul>
                  </li>
                </ul>

                <div className="qto" />
              </div>
            </span>
          </div>
        </div>
      );
    }
    //Cap Gov Formulae ends
    else if (val == 'KPI') {
      setSelKeys(['KPI']);
      setviewtxt(
        <div>
          <div>
            {' '}
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info"> KPI</h4>
                <p>
                  <strong>
                    {' '}
                    Formulas for Key Performance Indicators-(Turnover rate ,Lead time etc)used in
                    the IIM tool
                  </strong>
                </p>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'TurnOverRate') {
      setSelKeys(['TurnOverRate']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Turnover Rate</h4>
                <p>
                  <strong>TurnOverRate:</strong>
                </p>
                <ul>
                  <li>
                    Inventory turnover rate is the number of times a company sells and replaces its
                    stock in a period, usually one year.
                  </li>
                  <div className="kpito-img" />
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'BackOrderRate') {
      setSelKeys(['BackOrderRate']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">BackOrderRate</h4>
                <p>
                  <strong>BackOrderRate:</strong>
                </p>
                <ul>
                  <li>
                    Backorder rate is a measurement of the number of orders a company cannot fulfill
                    when a customer places an order.
                  </li>
                  <div className="kpibo-img" />
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Accuracy of Forecast Demand') {
      setSelKeys(['Accuracy of Forecast Demand']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Accuracy of Forecast Demand</h4>
                <p>
                  <strong>Accuracy of Forecast Demand:</strong>
                </p>
                <ul>
                  <li>
                    Accuracy of forecast demand, also known as the demand forecast accuracy, is a
                    percent of how close the consumption quantity is to the forecast
                  </li>
                  <div className="kpifad-img" />
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'LeadTime') {
      setSelKeys(['LeadTime']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">LeadTime</h4>
                <p>
                  <strong>LeadTime</strong>
                </p>
                <ul>
                  <li>
                    Description : The amount of time between when a purchase order is placed to
                    replenish products and when the order is received in the warehouse.
                  </li>
                </ul>
                <div className="KpiLt-img" />
              </div>
            </span>
          </div>
        </div>
      );
    } else if (val == 'Outstanding Orders') {
      setSelKeys(['Outstanding Orders']);
      setviewtxt(
        <div>
          <div>
            <span className="white_clr">
              <div className="pr-20">
                <h4 className="text-info">Outstanding Orders</h4>
                <p>
                  <strong>Outstanding Orders</strong>
                </p>
                <ul>
                  <li>Number of Open POs</li>
                </ul>
              </div>
            </span>
          </div>
        </div>
      );
    }
  };

  const span2_content = '(Current Inventory + Open POs + Possible Harvest) > 2 X (ReorderPoint)';
  const underStockDescription =
    '(Current Inventory + Open POs + Possible Harvest) <= Reorder Point';

  const onSelect = (selectedKeys) => {
    datafunc(selectedKeys);
    setselected('formula');
    dispatch(getIIMVideos(selectedKeys));
  };

  const onChange = (value) => {
    setValue(value);
    onSelect(value);
  };

  const treeSearch = () => {
    return (
      <TreeSelect
        showSearch
        // value={value}
        value={selKeys}
        dropdownStyle={{ maxHeight: 300, overflow: 'auto' }}
        placeholder="Please select"
        allowClear
        treeDefaultExpandAll
        onChange={onChange}
        treeData={treeData}
        className="treeSearchLeftPanel chart-select"
      />
    );
  };

  const selectData = treeSearch();

  return (
    <div>
      <Row>
        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
          <Col span={24}>{selectData}</Col>
          <Col span={24} className="formula-left">
            <div className="treeData">
              <Tree
                showLine
                treeData={treeData}
                onSelect={onSelect}
                selectedKeys={selKeys}
                defaultExpandAll
                defaultExpandedKeys={['Predicted CapEx']}
              />
            </div>
          </Col>
        </Col>
        <Col xs={16} sm={16} md={16} lg={16} xl={16} className="rightPanel">
          {process.env.active === 'development' ? (
            <>
              {' '}
              <Radio.Group
                value={selected}
                onChange={onChangeView}
                className="float-right NBA-Inventory-Prediction pr-4">
                <Radio.Button value="formula">Info</Radio.Button>
                <Radio.Button value="video">Demo</Radio.Button>
              </Radio.Group>
            </>
          ) : (
            <></>
          )}

          {selected === 'formula' ? (
            <> {viewtxt}</>
          ) : (
            <>
              <div className="pt-5">
                {' '}
                <Player autoPlay playsInline width="100%" height={340} fluid={false}>
                  <source src={getIIMVideosData} type="video/mp4" />

                  <ControlBar>
                    <ReplayControl seconds={10} order={1.1} />
                    <ForwardControl seconds={30} order={1.2} />
                    <CurrentTimeDisplay order={4.1} />
                    <TimeDivider order={4.2} />
                    <PlaybackRateMenuButton rates={[5, 2, 1, 0.5, 0.1]} order={7.1} />
                    <VolumeMenuButton />
                  </ControlBar>
                </Player>
              </div>
            </>
          )}
        </Col>
      </Row>
    </div>
  );
};
