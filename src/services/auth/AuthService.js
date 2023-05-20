import axios from 'axios';
import { API_URL_CONSTANTS } from 'constants';

//login user
const loginUser = async (credentials) => {

    const { userName, password } = credentials;

    //Using create to avoid the request uses the interceptor
    return axios.create().post(API_URL_CONSTANTS.API_LOGIN_URL, {
        userName,
        password
    }).then(async (response) => {
        if (response.data.token) {
            localStorage.setItem("authData", JSON.stringify(response.data));
        }

        return response.data;
    })
};

const logout = (setAuthData) => {
    localStorage.removeItem('authData');
    //Eject interceptors. Important to avoid loop if the user login again!!
    axios.interceptors.request.handlers = [];
    axios.interceptors.response.handlers = [];
    setAuthData(null);
};

export {
    loginUser,
    logout
}
