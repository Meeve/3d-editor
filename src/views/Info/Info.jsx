import React, { Component } from 'react';
import { connect } from 'react-redux';

class Info extends Component {
   render() {
      const logs = this.props.logs.map((log, key) => <div key={key}>{log}</div>);
      return <div className="infoList">{logs}</div>;
   }
}

function mapStateToProps(state) {
   return {
      logs: state.logs
   };
}

export default connect(mapStateToProps)(Info);
