import * as React from 'react';
import produce from "immer";

const withConnectivity = (result) => (path) => (Component) => {
  class Connectivity extends React.Component {

    constructor(props) {
      super(props);
      this.state = {
        isLoading: false,
        isError: false,
        error: "",
        success:null
      }
    }

    componentDidMount() {
      this._init();
    }

    _init() {
      this._startConnection();

     fetch(path, {
       method: "GET",
       headers: {
         'Content-Type': 'application/json'
       }
     }).then(resp => resp.json())
       .then(data => {this._checkForError(data); return data})
       .then(data => this._handleReturnData(data, "Error in connecting to endpoint"))
       .catch(error => this._handleException(error));
    }

    _serialize = (obj) => {
      var str = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          str.push(encodeURIComponent(p) + "=" + encodeURIComponent((obj)[p]));
        }
      }
      return str.join("&");
    }

    _checkForError = (data: any) => {
      if(!data || data === undefined) {
        throw Error("No valid data");
      }
      if(data.errors) {
        const {code, description} = data.errors;
        throw Error(`${description}`);
      }
    }

    _handleReturnData = (successfulData, errorMessage) => {
      if(!successfulData || successfulData === undefined) {
        throw Error("No valid data");
      } else {
        if (successfulData.Error) {
          this.setState(
            produce(this.state, draft => {
                draft.isError = true;
                draft.isLoading = false;
                draft.error = successfulData.ErrorDesc;
            })
          );
        } else {
          this.setState(
            produce(this.state, draft => {
                draft.isError = false;
                draft.isLoading = false;
                draft.success = successfulData;
            })
          );
        }
      }
    }

    _handleException = (error) => {
      this.setState(
        produce(this.state, draft => {
            draft.isLoading = false;
            draft.isError = true;
            draft.error = (error).message;
        })
      );
    }

    _startConnection = () => {
      this.setState(
        produce(this.state, draft => {
            draft.isLoading = true;
        })
      );
    }

    render() {
      const {isLoading, isError, error, success} = this.state;
      const {forwardedRef, ...otherProps} = this.props;
      const componentProps = otherProps;
      const responseWithConnection = {
        ...this.state
      }
      const response = result(responseWithConnection);

      return (
        <Component
          {...componentProps}
          {...response}
          ref={forwardedRef}/>
        ) //spreading
    }
  }
  const RefForwardingFactory = (props, ref) => {return <Connectivity {...props} forwardedRef={ref}/>};
  return React.forwardRef(RefForwardingFactory);
}

const _withConnectivity = (composure) => (url) => {
  return withConnectivity(composure)(url)
}

export default _withConnectivity;
