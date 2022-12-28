import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu } from 'antd';
import classNames from 'classnames';
//import nav from './_nav';

import { getUserImpersonationDetails, ReportNavHideShow } from '../../actions';
//import Header from '../Header/Header';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.activeRoute = this.activeRoute.bind(this);
    this.hideMobile = this.hideMobile.bind(this);
    this.onMenuClicked = this.onMenuClicked.bind(this);

    this.state = {
      current:
        window.location.hash.substring(2) === '' ? 'dashboard' : window.location.hash.substring(2)
    };
  }

  componentDidMount() {}
  handleClick(e) {
    e.preventDefault();
    e.target.parentElement.classList.toggle('open');
  }

  activeRoute(routeName, props) {
    return props.location.pathname.indexOf(routeName) > -1
      ? 'nav-item nav-dropdown open'
      : 'nav-item nav-dropdown';
  }

  hideMobile() {
    this.props.getUserImpersonationDetails(sessionStorage.getItem('loggedEmailId'));
    if (document.body.classList.contains('sidebar-mobile-show')) {
      document.body.classList.toggle('sidebar-mobile-show');
    }
  }

  onMenuClicked(e) {
    this.setState({
      current: e.key
    });
    this.props.getUserImpersonationDetails(sessionStorage.getItem('loggedEmailId'));
  }

  render() {
    // const location = this.props;
    const props = this.props;

    // badge addon to NavItem
    const badge = (badge) => {
      if (badge) {
        const classes = classNames(badge.class);
        return (
          <span className={classes} color={badge.variant}>
            {badge.text}
          </span>
        );
      }
    };

    // simple wrapper for nav-title item
    const wrapper = (item) => {
      return item.wrapper && item.wrapper.element
        ? React.createElement(item.wrapper.element, item.wrapper.attributes, item.name)
        : item.name;
    };

    // nav list section title
    const title = (title, key) => {
      const classes = classNames('nav-title', title.class);
      return (
        <li key={key} className={classes}>
          {wrapper(title)}{' '}
        </li>
      );
    };

    // nav list divider
    const divider = (divider, key) => {
      const classes = classNames('divider', divider.class);
      return <li key={key} className={classes}></li>;
    };

    // nav label with nav link
    const navLabel = (item, key) => {
      const classes = {
        item: classNames('hidden-cn', item.class),
        link: classNames('nav-label', item.class ? item.class : ''),
        icon: classNames(
          !item.icon ? 'fa fa-circle' : item.icon,
          item.label.variant ? `text-${item.label.variant}` : '',
          item.label.class ? item.label.class : ''
        )
      };
      return navLink(item, key, classes);
    };

    // nav item with nav link
    const navItem = (item, key) => {
      const classes = {
        item: classNames(item.class),
        link: classNames('nav-link', item.variant ? `nav-link-${item.variant}` : ''),
        icon: classNames(item.icon)
      };
      return navLink(item, key, classes);
    };

    // nav link
    const navLink = (item, key, classes) => {
      const url = item.url ? item.url : '';
      return (
        <Menu.Item key={key} className={classes.item}>
          {isExternal(url) ? (
            <NavLink href={url} className={classes.link} active>
              <i className={classes.icon}></i>
              {item.name}
              {badge(item.badge)}
            </NavLink>
          ) : (
            <NavLink
              to={url}
              className={classes.link}
              activeClassName="active"
              onClick={this.hideMobile}>
              <i className={classes.icon}></i>
              <span>{item.name}</span>
              {badge(item.badge)}
            </NavLink>
          )}
        </Menu.Item>
      );
    };

    // nav dropdown
    const navDropdown = (item, key) => {
      return (
        <li key={key} className={this.activeRoute(item.url, props)}>
          <a className="nav-link nav-dropdown-toggle" href="#" onClick={this.handleClick}>
            <i className={item.icon}></i>
            {item.name}
          </a>
          <ul className="nav-dropdown-items">{navList(item.children)}</ul>
        </li>
      );
    };

    // nav type
    const navType = (item, idx) =>
      item.title
        ? title(item, idx)
        : item.divider
        ? divider(item, idx)
        : item.label
        ? navLabel(item, idx)
        : item.children
        ? navDropdown(item, idx)
        : navItem(item, idx);

    // nav list
    const navList = (items) => {
      let data = items.filter((d) => d.name !== 'Report');

      if (this.props.ReportNavHideShowData) {
        return items.map((item, index) => navType(item, index));
      } else {
        return data.map((item, index) => navType(item, index));
      }
    };

    const isExternal = (url) => {
      const link = url ? url.substring(0, 4) : '';
      return link === 'http';
    };

    // sidebar-nav root
    return (
      <div className="sidebar" style={{ paddingTop: '15px' }}>
        {/* <SidebarMinimizer /> */}

        <nav className="sidebar-nav new-nav">
          <Menu mode="vertical" selectedKeys={[this.state.current]} onClick={this.onMenuClicked}>
            <Menu.Item key="dashboard" icon={<i className="fas fa-warehouse" />}>
              <NavLink to="/dashboard"></NavLink> Inventory
            </Menu.Item>
            <Menu.Item key="capgov" icon={<i className="fas fa-hand-holding-usd" />}>
              <NavLink to="/capgov"></NavLink>CapGov
            </Menu.Item>
            <Menu.Item key="kpi" icon={<i className="far fa-chart-bar" />}>
              <NavLink to="/kpi"></NavLink>KPI
            </Menu.Item>
            {!this.props.ReportNavHideShowData ? (
              ''
            ) : (
              <Menu.Item key="materialReport" icon={<i className="far fa-address-card " />}>
                <NavLink to="/materialReport"></NavLink>Report
              </Menu.Item>
            )}

            <Menu.SubMenu key="360°view" icon={<i className="far fa-file-alt" />}>
              <Menu.ItemGroup title="360° view">
                <Menu.Item key="360view" icon={<i className="far fa-chart-bar" />}>
                  <NavLink to="/360view"></NavLink>Material
                </Menu.Item>
                <Menu.Item key="360manuf" icon={<i className="far fa-address-card " />}>
                  <NavLink to="/360manuf"></NavLink>Manufacturer
                </Menu.Item>
                <Menu.Item key="360org" icon={<i className="far fa-address-card " />}>
                  <NavLink to="/360org"></NavLink>Organization
                </Menu.Item>
              </Menu.ItemGroup>
            </Menu.SubMenu>
            <Menu.Item key="IIMReports" icon={<i className="fad fa-window-restore" />}>
              <NavLink to="/IIMReports"></NavLink>Bulk Export
            </Menu.Item>
          </Menu>
        </nav>
      </div>
    );
  }
}

function mapState(state) {
  return {
    ReportNavHideShowData: state.ReportNavHideShows
  };
}
export default connect(mapState, { getUserImpersonationDetails, ReportNavHideShow })(Sidebar);
