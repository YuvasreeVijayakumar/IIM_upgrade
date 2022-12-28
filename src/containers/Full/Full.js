import { Component } from 'react'
import * as React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom';

import Header from '../../components/Header/';
import Sidebar from '../../components/Sidebar/';

import DashBoard from '../../views/DashBoard/';
import CapGov from '../../views/CapGov';
// import Kpi from "../../views/Kpi/Kpi";
import KpiMainPage from '../../views/Kpi/KpiMainPage';
import Report from '../../views/Report/Report';
import Materialreport from '../../views/MaterialReport/Materialreport';
import NBAOrgReport from '../../views/NBAOrgReport/NBAOrgReport';
import NBAManufReport from '../../views/NBAManuf/NBAManufReport';
import IIMReports from '../../views/IIMReports/IIMReports';

// document.body.classList.toggle('sidebar-hidden');
class Full extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <>
        <div className="app">
          <div className="app-body">
            <Header />
            <main className="main">
              <Sidebar {...this.props} />
              <div className="container-fluid">
                <Switch>
                  <Route path="/dashboard" name="DashBoard" component={DashBoard} />
                  <Route path="/capgov" name="CapGov" component={CapGov} />
                  <Route path="/kpi" name="Kpi" component={KpiMainPage} />
                  <Route path="/materialReport" name="report" component={Report} />
                  <Route path="/360view" name="360view" component={Materialreport} />
                  <Route path="/360org" name="360org" component={NBAOrgReport} />
                  <Route path="/360manuf" name="360manuf" component={NBAManufReport} />
                  <Route path="/IIMReports" name="IIMReports" component={IIMReports} />
                  <Redirect from="/" to="/dashboard" />
                </Switch>
              </div>
            </main>
          </div>
        </div>

        {sessionStorage.setItem('currentPage', window.location.hash.slice(2, 11))}
      </>
    );
  }
}

export default Full;
