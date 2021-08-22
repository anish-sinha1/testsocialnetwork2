import React, { Fragment, useState } from "react";
import { connect } from "react-redux";
import { setAlert } from "../../actions/alert";
import { Link, Redirect } from "react-router-dom";
import PropTypes from "prop-types";
import { register } from "../../actions/auth";

const Register: React.FC<{
  setAlert: (alert: string, alertType: string) => void;
  register: any;

  isAuthenticated: any;
}> = (props) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const { name, email, password, passwordConfirm } = formData;
  const fieldChangeHandler = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const submitHandler = async (e: any) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      props.setAlert("Passwords do not match", "danger");
    } else {
      props.register({ name, email, password });
    }
  };
  if (props.isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }
  return (
    <Fragment>
      <h1 className="large text-primary">Sign up</h1>
      <p className="lead">
        <i className="fas fa-user"></i>Create your account
      </p>
      <form className="form" onSubmit={submitHandler}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            value={name}
            onChange={fieldChangeHandler}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            placeholder="example@email.com"
            name="email"
            value={email}
            onChange={fieldChangeHandler}
          />
          <small>This site uses Gravatar for profile images</small>
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="password"
            name="password"
            value={password}
            onChange={fieldChangeHandler}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="confirm password"
            name="passwordConfirm"
            value={passwordConfirm}
            onChange={fieldChangeHandler}
          />
        </div>
        <input type="submit" value="Register" className="btn btn-primary" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="login.html">Sign in</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes = {
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setAlert, register })(Register);
