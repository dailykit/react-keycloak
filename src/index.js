import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import Auth from "./Services/Auth.js";

const redirectUri = "http://localhost:3000";
const AuthService = new Auth("realm1", redirectUri);

// Get the jwtToken from localStorage
var isLoggedIn = AuthService.isLoggedIn();

if (!isLoggedIn) {
    // there is no active token.
    // Check if the url has a query param of code
    var queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    if (code != null) {
        // read the code and make a post request to get the access token and store it in localStorage
        AuthService.fetchAccessToken(code, redirectUri);
    } else {
        window.location.href = AuthService.getLoginUrl();
    }
} else {
    // Check if token is expired or not
    if (AuthService.isTokenExpired()) {
        window.location.href = AuthService.getLoginUrl();
    } else {
        // There is an active token. redirect to home page
        ReactDOM.render(<App />, document.getElementById("root"));

        // If you want your app to work offline and load faster, you can change
        // unregister() to register() below. Note this comes with some pitfalls.
        // Learn more about service workers: https://bit.ly/CRA-PWA
        serviceWorker.unregister();
    }
}
