import React, {Component} from 'react';
import { Container, Row, Col, Button, Progress, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import './App.css';
import withConnectivity from "./hoc/withConnectivity";
import produce from "immer";
type Props = {};

export class App extends Component<Props> {

  constructor(props) {

    super(props);

    this.state = {
      selectedProgressBar: 0,
      dropdownOpen: false
    };
  }

  getProgressBarColor = (i) => {
    switch(i) {
      case 0:
        return "success";
      case 1:
        return "info";
      case 2:
        return "warning";
      case 3:
        return "danger";
      case 4:
        return "secondary";
      default:
        return "primary";
    }
  }

  generateProgressBar = () => {

    const {success} = this.props.endPointResult;
    var arr = [];

    if (success != null) {

      for (let i = 0; i < success.bars.length; i++) {

        arr.push(<Row key={i} className="progress-bar-box">
          <Col sm="12" md={{size: 6, offset:3}} className="progress-bar-spacing">
            <Progress value={success.bars[i]} color={this.getProgressBarColor(i)} />
          </Col>
        </Row>);

      }

      return arr;
    }

  }

  generateButton = () => {

    const {success} = this.props.endPointResult;
    var arr = [];

    if (success !== null) {
      var size = 12/success.buttons.length;

      return success.buttons.map((button, idx) => {
        return (
          <Col sm={12} md={size} className="button-spacing" key={`_generateButton_${idx}`}>
            <Button className="progress-button">{button}</Button>
          </Col>
        )
      });
    }
    return <React.Fragment/>

  }

  _selectItem = (value) => () => {



    this.setState(
      produce(this.state, draft => {
        draft.selectedProgressBar = value;
      })
    );
  }


  _toggle = () => {

    this.setState(
      produce(this.state, draft => {
        draft.dropdownOpen =  !draft.dropdownOpen;
      })
    );

  }

  _getMenuItem = () => {

    const {success} = (this.props.endPointResult);

    if (success !== null) {
      return success.bars.map((eachValue,idx) => {

        return (
          <DropdownItem onClick={this._selectItem(idx)} key={`_getMenuItem_${idx}`}>
            {`Progress Bar ${idx}`}
          </DropdownItem>
        )}
      );
    }
    else {
      return <React.Fragment/>
    }

  }

  render() {

    const {dropdownOpen,selectedProgressBar} = this.state;
    const {success} = this.props.endPointResult;

    console.log(selectedProgressBar,"selectedProgressBar");

    return (
      <div className="App">
        <Container>
          <Row className="App-header">
            <Col col="12">
              <h4>Progress Bar</h4>
            </Col>
          </Row>
          {this.generateProgressBar()}
          <Row className="button-row">
          <Dropdown isOpen={dropdownOpen} toggle={this._toggle} size="sm">
            <DropdownToggle caret>
              Progress Bar
            </DropdownToggle>
            <DropdownMenu>
              {this._getMenuItem()}
            </DropdownMenu>
          </Dropdown>
          </Row>
          <Row className="button-row">
          {this.generateButton()}
          </Row>
        </Container>
      </div>
    );
  }

}


const mapEndPoint = (result) => ({
  endPointResult:result
})

export default withConnectivity(mapEndPoint)('http://pb-api.herokuapp.com/bars')(App)
