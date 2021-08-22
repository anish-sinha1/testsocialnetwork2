import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

const Alert: React.FC<{ alerts: any }> = (props) =>
  props.alerts !== null &&
  props.alerts.length > 0 &&
  props.alerts.map((alert: any) => (
    <div key={alert.id} className={`alert alert-${alert.alertType}`}>
      {alert.msg}
    </div>
  ));

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state: any) => ({
  alerts: state.alert,
});

export default connect(mapStateToProps)(Alert);
