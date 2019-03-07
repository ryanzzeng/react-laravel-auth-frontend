import React, { Component } from 'react';
import {  Route, Switch } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import axios from "axios";
import $ from "jquery";
import './App.css';

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoggedIn:false,
      user:{}
    };
  }

  _loginUser = (username,password) => {
    $("#login-form button")
      .attr("disabled","disabled")
      .html(
        '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
      );
    var formData = new FormData();
    formData.append("username",username);
    formData.append("password",password);

    axios
    .post("http://localhost:8000/api/auth/login", formData)
    .then(response => {
      console.log(response);
      return response;
    })
    .then(json => {
      if(json.data.status === 0){
        alert("Login Successfully! ");
        const {username,access_token,token_type,expires_in } = json.data.data;

        let userData = {
          username,
          access_token,
          token_type,
          expires_in,
          timestamp: new Date().toString()
        };

        let appState = {
          isLoggedIn: true,
          user: userData
        };

        localStorage["appState"] = JSON.stringify(userData.access_token);
        this.setState({
          isLoggedIn:appState.isLoggedIn,
          user:appState.user
        });
      }else alert("Login Failed!");

      $("#login-form button")
        .removeAttr("disabled")
        .html("Login");
    })
    .catch(error => {
      alert(`An Error Occured! ${error}`);
      $("#login-form button")
      .removeAttr("disabled")
      .html("Login");
    });
  };

  _registerUser = (name,email,password) => {
    $("#email-login-btn")
      .attr("disabled","disabled")
      .html(
        '<i class="fa fa-spinner fa-spin fa-1x fa-fw"></i><span class="sr-only">Loading...</span>'
      );
    var formData = new FormData();
    formData.append("type", "email");
    formData.append("username", name);
    formData.append("password", password);
    formData.append("phone", 33322212231);
    formData.append("email", email);
    formData.append("address", "address okoko");
    formData.append("name", name);
    formData.append("id", 76);

    axios
      .post("http://localhost:8000/api/auth/register", formData)
      .then(response => {
        console.log(response);
        return response;
      })
      .then(json => {
        if(json.data.status === 0){
          alert('Registeration Successfully!');
          const {username,access_token,token_type,expires_in } = json.data.data;
          let userData = {
            username,
            access_token,
            token_type,
            expires_in,
            timestamp: new Date().toString()
          };
          let appState = {
            isLoggedIn:true,
            user: userData
          };
          localStorage["appState"] = JSON.stringify(userData.access_token);
          this.setState({
            isLoggedIn: appState.isLoggedIn,
            user: appState.user
          });
        }else{
          alert(`Registration Failed!`);
          $("#email-login-btn")
            .removeAttr("disabled")
            .html("Register");
        }
      })
      .catch(error => {
        console.log(error);
        alert("An Error Occured!" + error);
        // console.log(`${formData} ${error}`);
        $("#email-login-btn")
          .removeAttr("disabled")
          .html("Register");
      });
  };

  _logoutUser = () => {
    let appState = {
      isLoggedIn:false,
      user:{}
    };
    localStorage["appState"] = JSON.stringify(appState);
    this.setState(appState);
  };

  componentDidMount(){
    let state = localStorage["appState"];
    if(state){
      let AppState = JSON.parse(state);
      console.log(AppState);
      this.setState({ isLoggedIn: AppState.isLoggedIn, user: AppState });
    }
  }

  render(){
    console.log(this.state.isLoggedIn);
    // console.log(localStorage["appState"]);
    // console.log("path name: " + this.props.location.pathname);

    if(
      !this.state.isLoggedIn &&
      this.props.location.pathname !== "/login" &&
      this.props.location.pathname !== "/register"
    ){
      console.log(
        "you are not loggedin and are not visiting login or register, so go to login page"
      );
      this.props.history.push("/login");
    }

    if (
      this.state.isLoggedIn &&
      (this.props.location.pathname === "/login" ||
        this.props.location.pathname === "/register")
    ) {
      console.log(
        "you are either going to login or register but youre logged in"
      );

      this.props.history.push("/");
    }

    return (
      <Switch data="data">
        <div id="main">
        <Route
            exact
            path="/"
            render={props => (
              <Home
                {...props}
                logoutUser={this._logoutUser}
                user={this.state.user}
              />
            )}
          />

          <Route
            path="/login"
            render={props => <Login {...props} loginUser={this._loginUser} />}
          />

          <Route
            path="/register"
            render={props => (
              <Register {...props} registerUser={this._registerUser} />
            )}
          />
        </div>
      </Switch>
    )
  }
}

export default App;
