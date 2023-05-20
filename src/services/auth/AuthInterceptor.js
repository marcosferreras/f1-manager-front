import axios from 'axios';
import { useSnackbar } from 'notistack';
import { useHistory } from "react-router-dom";
import { useContext } from 'react';
import AuthContext from './AuthContext';
import { logout } from './AuthService';

const AxiosInterceptorsSetup = () => {
    const { enqueueSnackbar } = useSnackbar();
    const history = useHistory();
    const { authData, setAuthData } = useContext(AuthContext);
    axios.interceptors.response.use(undefined, data => {
        const { response } = data;
        // if error is 401 
        if (response && response.status === 401) {
            // request for a new token
            /*return getAuthToken().then(response => {
             // update the error config with new token
             error.config.__isRetryRequest = true;
             error.config.headers.token= localStorage.getItem("accessToken");
             return client(error.config);
            });*/
            logout(setAuthData);
            enqueueSnackbar('Your session has expired, please log in again', {
                variant: 'error',
            });
        } else if (!response) {
            enqueueSnackbar('Connection error, please try again', {
                variant: 'error',
            });
        } else if (response && response.status === 500) {
            enqueueSnackbar('Something went wrong, please try again', {
                variant: 'error',
            });
        }
        return response;
    });

    axios.interceptors.request.use(
        request => {
            //const accessToken = JSON.parse(localStorage.getItem('accessToken'));
            if (authData) {
                request.headers['Authorization'] = `${authData.bearer} ${authData.token}`;
            }

            return request;
        },
        error => {
            return Promise.reject(error);
        }
    )
};

export { AxiosInterceptorsSetup };