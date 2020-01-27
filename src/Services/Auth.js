import decode from "jwt-decode";

export default class Auth {
    constructor(realmName, redirectUri) {
        this.jwtAccessToken = localStorage.getItem("jwtAccessToken");
        this.jwtIdToken = localStorage.getItem("jwtIdToken");
        this.keycloakLoginUrl =
            "http://localhost:8281/auth/realms/" +
            realmName +
            "/protocol/openid-connect/auth?client_id=abc_dailyos&redirect_uri=" +
            redirectUri +
            "&response_type=code&scope=openid";
        this.keycloakTokenUrl =
            "http://localhost:8281/auth/realms/" +
            realmName +
            "/protocol/openid-connect/token";
    }

    getLoginUrl = () => {
        return this.keycloakLoginUrl;
    };

    fetchAccessToken = (code, redirectUri) => {
        const params = new URLSearchParams();
        params.append("grant_type", "authorization_code");
        params.append("client_id", "abc_dailyos");
        params.append("code", code);
        params.append("redirect_uri", redirectUri);

        fetch(this.keycloakTokenUrl, {
            method: "POST",
            body: params
        })
            .then(res => res.json())
            .then(json => {
                localStorage.setItem("jwtAccessToken", json.access_token);
                localStorage.setItem("jwtIdToken", json.id_token);
                window.location.href = redirectUri;
            });
    };

    isLoggedIn = () => {
        if (this.getToken() == null || this.isTokenExpired()) {
            return false;
        } else {
            return true;
        }
    };

    isTokenExpired = () => {
        try {
            const decodedToken = decode(this.jwtAccessToken);
            if (decodedToken.exp < Date.now() / 1000) {
                return true;
            } else return false;
        } catch (err) {
            console.log("Unable to check token expiration.");
            return false;
        }
    };

    getToken = () => {
        return this.jwtAccessToken;
    };
}
