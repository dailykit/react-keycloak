import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";

// Get the jwtToken from sessionStorage
var jwtToken = sessionStorage.getItem("jwtAccessToken");
const keycloakLoginUrl =
    "http://localhost:8281/auth/realms/realm1/protocol/openid-connect/auth?client_id=abc_dailyos&redirect_uri=http://localhost:3000&response_type=code&scope=openid";
const keycloakTokenUrl =
    "http://localhost:8281/auth/realms/realm1/protocol/openid-connect/token";

if (jwtToken == null) {
    // there is no active token.
    // Check if the url has a query param of code
    var queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);
    const code = urlParams.get("code");
    if (code != null) {
        // read the code and make a post request to get the access token and store it in sessionStorage
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", "abc_dailyos");
        params.append("code", code);
        params.append("redirect_uri", "http://localhost:3000");

        fetch(keycloakTokenUrl, {
            method: "POST",
            body: params
        })
            .then(res => res.json())
            .then(json => {
                console.log(json);
                sessionStorage.setItem("jwtAccessToken", json.access_token);
                sessionStorage.setItem("jwtIdToken", json.id_token);
                window.location.href = "http://localhost:3000";
            });
    } else {
        window.location.href = keycloakLoginUrl;
    }
} else {
    // There is an active token. redirect to home page
    ReactDOM.render(<App />, document.getElementById("root"));

    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
}
