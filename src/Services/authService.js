import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: process.env.REACT_APP_B2C_CLIENT_ID,
        authority: `https://${process.env.REACT_APP_B2C_TENANT}.b2clogin.com/${process.env.REACT_APP_B2C_TENANT}.onmicrosoft.com/${process.env.REACT_APP_B2C_POLICY_SIGN_IN}`,
        redirectUri: window.location.origin,
    },
    cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true,
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

export const login = async () => {
    try {
        const loginResponse = await msalInstance.loginPopup({
            scopes: ["openid", "profile"],
        });
        return loginResponse;
    } catch (error) {
        console.error(error);
        throw error; // Propagate error for handling in UI
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
        throw error; // Propagate error for handling in UI
    }
};

export const getUsername = () => {
    const account = msalInstance.getAllAccounts()[0];
    return account ? account.username : null;
};
