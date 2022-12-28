import React, { Component } from 'react';

class SidebarMinimizer extends Component {
  sidebarMinimize() {
    document.body.classList.toggle('sidebar-minimized');
  }

  brandMinimize() {
    document.body.classList.toggle('brand-minimized');
  }

  render() {
    return (
      <button
        className="sidebar-minimizer"
        type="button"
        onClick={() => {
          this.sidebarMinimize();
          this.brandMinimize();
        }}>
        <i className="fas fa-angle-double-right icon-hidden"></i>
        <i className="fas fa-angle-double-left icon-hidden1"></i>
        {/* <i className="fa fa-bars icon-hidden"></i> */}
      </button>
    );
  }
}

export default SidebarMinimizer;
