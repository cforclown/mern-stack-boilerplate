const authURL = process.env.API_URL + "/auth";
const apiURL = process.env.API_URL + "/api";

import Store from "../store";
import { SetSession } from "../reducer/actions";



var session = null;
export function SetUserSession(userSession) {
    session = userSession;
}

export async function Request(query, param, throw401 = false) {
    if (param) {
        param.headers = {
            Authorization: 'Bearer ' + session.accessToken,
            "content-type": "application/json",
        };
    }
    else {
        param = {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + session.accessToken,
                "content-type": "application/json",
            },
        };
    }

    let response = await fetch(apiURL + query, param);
    if (response.status === 401) {
        if (!session || throw401) {
            const error = Error("UNAUTHORIZED");
            error.isUnauthorized = true;
            throw error;
        }
        session = await RefreshSession();

        return await Request(query, param, true);
    }
    else if (response.status === 403) {
        let errorMessage = "FORBIDDEN";
        try {
            const json = await response.json();
            if (json.message)
                errorMessage = json.message;
        }
        catch (error) {
            errorMessage = "FORBIDDEN";
        }
        const error=Error(errorMessage);
        error.isForbidden = true;
        throw error;
    }
    else if (response.status === 404) {
        let errorMessage = "NOT FOUND";
        try {
            const json = await response.json();
            if (json.message)
                errorMessage = json.message;
        }
        catch (error) {
            errorMessage = "NOT FOUND";
        }
        throw Error(errorMessage);
    }
    else if (response.status === 500) {
        let errorMessage = "INTERNAL SERVER ERROR";
        try {
            const json = await response.json();
            if (json.message)
                errorMessage = json.message;
        }
        catch (error) {
            errorMessage = "INTERNAL SERVER ERROR";
        }
        throw Error(errorMessage);
    }
    else if (!response.ok)
        throw Error("UNKNOWN ERROR");

    const json = await response.json();
    const data = json.data;

    return data;
}
export async function AuthRequest(query, param) {
    if (param) {
        param.headers = {
            Authorization: 'Bearer ' + session.accessToken,
            "content-type": "application/json",
        };
    }
    else {
        param = {
            method: "GET",
            headers: {
                Authorization: 'Bearer ' + session.accessToken,
                "content-type": "application/json",
            },
        };
    }

    let response = await fetch(authURL + query, param);
    if (response.status === 400){
        let errorMessage = "BAD REQUEST";
        try {
            const json = await response.json();
            if (json.message)
                errorMessage = json.message;
        }
        catch (error) {
            errorMessage = "BAD REQUEST";
        }
        throw Error(errorMessage);
    }
    else if (response.status === 401) {
        const error = Error("UNAUTHORIZED");
        error.isUnauthorized = true;
        throw error;
    }
    else if (response.status === 403) {
        let errorMessage = "FORBIDDEN";
        try {
            const json = await response.json();
            if (json.message)
                errorMessage = json.message;
        }
        catch (error) {
            errorMessage = "FORBIDDEN";
        }
        const error=Error(errorMessage);
        error.isForbidden = true;
        throw error;
    }
    else if (response.status === 404){
        let errorMessage = "NOT FOUND";
        try {
            const json = await response.json();
            if (json.message)
                errorMessage = json.message;
        }
        catch (error) {
            errorMessage = "NOT FOUND";
        }
        throw Error(errorMessage);
    }
    else if (response.status === 500) {
        let errorMessage = "INTERNAL SERVER ERROR";
        try {
            const json = await response.json();
            if (json.message)
                errorMessage = json.message;
        }
        catch (error) {
            errorMessage = "INTERNAL SERVER ERROR";
        }
        throw Error(errorMessage);
    }
    else if (!response.ok) 
        throw Error(`UNKNOWN ERROR`);

    const json = await response.json();
    const data = json.data;

    return data;
}

export async function Login(username, password) {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Cache", "no-cache");
        const response = await fetch(authURL + "/login", {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify({ username, password }),
        });

        if (!response.ok){
            let errorMessage = "UNKNOWN ERROR";
            try {
                const json = await response.json();
                if (json.message)
                    errorMessage = json.message;
            }
            catch (error) {
                errorMessage = `${response.status} UNKNOWN ERROR`;
            }
            throw Error(errorMessage);
        }

        const json = await response.json();
        const sessionData = json.data;

        session = sessionData;

        return sessionData;
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
}
export async function Register(registerData) {
    try {
        const headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Cache", "no-cache");
        const response = await fetch(authURL + "/register", {
            method: "POST",
            headers,
            credentials: "include",
            body: JSON.stringify({registerData}),
        });

        if (!response.ok){
            let errorMessage = "UNKNOWN ERROR";
            try {
                const json = await response.json();
                if (json.message)
                    errorMessage = json.message;
            }
            catch (error) {
                errorMessage = `${response.status} UNKNOWN ERROR`;
            }
            throw Error(errorMessage);
        }

        const json = await response.json();
        const sessionData = json.data;

        session = sessionData;

        return sessionData;
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
}
export async function Logout() {
    try {
        await AuthRequest("/logout");
        return true;
    }
    catch (error) {
        return true;
    }
}
export async function RefreshSession() {
    try {
        const newSession = await AuthRequest("/refresh", {
            method: "POST",
            body: JSON.stringify({ refreshToken: session.refreshToken }),
        });

        Store.dispatch(SetSession(newSession));

        return newSession;
    }
    catch (error) {
        console.log(error.message);
        throw error;
    }
}
