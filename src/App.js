import React, {Component} from 'react';
import { Container, Row, Col, Button, Progress, Dropdown, DropdownToggle, DropdownMenu, DropdownItem , Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './App.css';
import withConnectivity from "./hoc/withConnectivity";
import produce from "immer";
type Props = {};

export class App extends Component<Props> {

  constructor(props) {

    super(props);

    this.state = {
      selectedProgressBar: -1,
      dropdownOpen: false,
      progressDropDownTitle: "Progress Bar",
      bars: [],
      showErrorModal:false
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
    const {isFirstLoad,progressBarValue, bars} = this.state;

    var arr = [];
    var val = []

    if (success != null) {

      if (bars.length  == 0 ) {

        this.setState(
          produce(this.state, draft => {
            draft.bars = success.bars;
          })
        );

      }

      for (let i = 0; i < success.bars.length; i++) {
        var value = this.state.bars[i];
        arr.push(<Row key={i} className="progress-bar-box">
          <Col sm="12" md={{size: 6, offset:3}} className="progress-bar-spacing">
            <Progress value={value} color={this.state.bars[i] > 100 ? "danger" : this.getProgressBarColor(i)}>{value + "%"}</Progress>
          </Col>
        </Row>);
      }

      return arr;

    }

  }

  buttonClick = (ev) => {

    const {dropdownOpen,selectedProgressBar, bars} = this.state;
    const {success} = this.props.endPointResult;
    var arr = [];
      if (selectedProgressBar > -1) {

        for (let i = 0; i < bars.length; i++) {

          if (selectedProgressBar == i) {

            if (parseInt(ev.target.value) + parseInt(bars[i]) < 0) {
              arr.push(0);
            } else {
              arr.push(parseInt(ev.target.value) + parseInt(bars[i]));
            }

          } else {
            arr.push(bars[i]);
          }

      }

      this.setState(
        produce(this.state, draft => {
          draft.bars = arr;
        })
      );
    }
    else {

      this.setState(
        produce(this.state, draft => {
          draft.showErrorModal = true;
        })
      );
    }

  }

  onClickCloseModal = () => {

    this.setState(
      produce(this.state, draft => {
        draft.showErrorModal = false;
      })
    );
  }

  errorMessageModal = () => {

    const {showErrorModal} = this.state;

    return(
      <Modal isOpen={showErrorModal} size="lg" toggle={this.onClickCloseModal}>
        <ModalHeader toggle={this.onClickCloseModal}>
          <label>Info</label>
        </ModalHeader>
        <ModalBody>
            <label>Please select a progress bar.</label>
        </ModalBody>
        <ModalFooter>
          <div>
            <Button className={"btn-default space-right"} onClick={this.onClickCloseModal}>Close</Button>

          </div>
        </ModalFooter>
      </Modal>);

  }

  generateButton = () => {

    const {success} = this.props.endPointResult;
    var arr = [];

    if (success !== null) {

      var size = 12/success.buttons.length;

      return success.buttons.map((button, idx) => {
        return (
          <Col sm={12} md={size} className="button-spacing" key={`_generateButton_${idx}`}>
            <Button color="primary" className="progress-button" onClick={this.buttonClick} value={button}>{button}</Button>
          </Col>
        )
      });
    }

    return <React.Fragment/>

  }

  _selectItem = (value) => () => {

    this.setState(
      produce(this.state, draft => {
        draft.dropdownOpen =  false;
        draft.selectedProgressBar= value;
        draft.progressDropDownTitle =  "Progress Bar " + value;
      })
    );

  }

  _toggle = () => {

    if(this.state.dropdownOpen) {
      return;
    }

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

    const {dropdownOpen,selectedProgressBar, bars} = this.state;
    const {success} = this.props.endPointResult;

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
          <Dropdown isOpen={dropdownOpen} toggle={this._toggle} size="sm" className="progress-bar-margin">
            <DropdownToggle caret>
              {this.state.progressDropDownTitle}
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
        {this.errorMessageModal()}
      </div>
    );
  }

}


const mapEndPoint = (result) => ({
  endPointResult:result
})

export default withConnectivity(mapEndPoint)('http://pb-api.herokuapp.com/bars')(App)
