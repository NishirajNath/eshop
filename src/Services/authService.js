// authService.js

import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: 'your-client-id',
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

export const login = async (username, password) => {
    try {
        const loginResponse = await msalInstance.loginPopup({
            scopes: ["openid", "profile"],
            loginHint: username,
        });
        return loginResponse;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const logout = () => {
    msalInstance.logout();
};

export const getAccessToken = async () => {
    const account = msalInstance.getAllAccounts()[0];
    if (!account) {
        throw new Error('User not logged in');
    }
    try {
        const tokenResponse = await msalInstance.acquireTokenSilent({
            scopes: ["openid", "profile"],
            account: account
        });
        return tokenResponse.accessToken;
    } catch (error) {
        console.error('Error acquiring access token:', error);
        throw error;
    }
};

export const getUsername = () => {
    const account = msalInstance.getActiveAccount();
    return account ? account.username : null;
};
