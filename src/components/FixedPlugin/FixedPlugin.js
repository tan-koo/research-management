
import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Button } from "reactstrap";

class FixedPlugin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      classes: "dropdown show",
    };
    this.handleClick = this.handleClick.bind(this);
  }
  handleClick() {
    if (this.state.classes === "dropdown") {
      this.setState({ classes: "dropdown show" });
    } else {
      this.setState({ classes: "dropdown" });
    }
  }
  render() {
    return (
      <div className="fixed-plugin">
        {/* <div className={this.state.classes}>
          <div onClick={this.handleClick}>

            <i className="fa fa-gift fa-3x" />
          </div>
          <ul className="dropdown-menu show">

            <li className="header-title"><h4>การจัดการฐานข้อมูลงานวิจัยภาควิชาคณิตศาสตร์ มจธ.</h4></li>
            <li className="header-title"><h4></h4></li>
            <li className="adjustments-line">

            </li>
            <Link to="/general/regis">
              <li className="button-container">
                <Button

                  color="info"
                  block
                  className="btn-round"
                >
                  สมัครสมาชิก
                </Button>
              </li>
            </Link>
            <Link to="/general/login">
              <li className="button-container">
                <Button
                  color="danger"
                  block
                  className="btn-round"
                  target="_blank"
                >
                  Login
                </Button>
              </li>
            </Link>
          </ul>
        </div> */}
      </div>
    );
  }
}

export default FixedPlugin;
