import { createContext, useEffect, useReducer } from 'react';
import axios from 'src/utils/certifyAxios';
import TruffleContract from '@truffle/contract';

import PropTypes from 'prop-types';
import getWeb3 from './../getWeb3';
import CertificatesContract from '../contracts/CertificatesContract.json';

const initialAuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

const setSession = (accessToken) => {
  if (accessToken) {
    localStorage.setItem('accessToken', accessToken);
    axios.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    localStorage.removeItem('accessToken');
    delete axios.defaults.headers.common.Authorization;
  }
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  }
};

const reducer = (state, action) =>
  handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext({
  ...initialAuthState,
  method: 'JWT',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve()
});

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialAuthState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken) {
          setSession(accessToken);

          const response = await axios.get('/authentication/personal', {
            validateStatus: (status) => status < 500
          });

          if (response.status === 200) {
            const { user } = response.data;

            // Get web3
            const web3 = await getWeb3();

            // Get account
            const accounts = await web3.request({
              method: 'eth_requestAccounts'
            });

            const currentAccount = accounts[0];

            if (currentAccount === user.publicKey.toLowerCase()) {
              const contract = TruffleContract(CertificatesContract);
              contract.setProvider(web3);
              const certificateContract = await contract.deployed();

              setSession(accessToken);

              dispatch({
                type: 'INITIALIZE',
                payload: {
                  isAuthenticated: true,
                  user: {
                    ...user,
                    account: currentAccount,
                    contract: certificateContract
                  }
                }
              });
            }
          } else {
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user: null
              }
            });
          }
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null
            }
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    };

    initialize();
  }, []);

  const login = async (email, password) => {
    const response = await axios.post(
      '/authentication/login',
      {
        email,
        password
      },
      {
        validateStatus: (status) => status < 500
      }
    );

    if (response.status === 200) {
      const { accessToken, user } = response.data;

      // Get web3
      const web3 = await getWeb3();

      // Get account
      const accounts = await web3.request({
        method: 'eth_requestAccounts'
      });

      const currentAccount = accounts[0];

      if (currentAccount === user.publicKey.toLowerCase()) {
        const contract = TruffleContract(CertificatesContract);
        contract.setProvider(web3);
        const certificateContract = await contract.deployed();

        setSession(accessToken);

        dispatch({
          type: 'LOGIN',
          payload: {
            user: {
              ...user,
              account: currentAccount,
              contract: certificateContract
            }
          }
        });
      } else {
        // eslint-disable-next-line
        alert('La cuenta de Ethreum no coincide con la asignada a su cuenta');

        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null
          }
        });
      }
    } else {
      if (response.status === 401) {
        // eslint-disable-next-line
        alert('Credenciales incorrectas');
      }

      dispatch({
        type: 'INITIALIZE',
        payload: {
          isAuthenticated: false,
          user: null
        }
      });
    }
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  const register = async (email, name, password) => {
    const response = await axios.post('/api/account/register', {
      email,
      name,
      password
    });
    const { accessToken, user } = response.data;

    window.localStorage.setItem('accessToken', accessToken);
    dispatch({
      type: 'REGISTER',
      payload: {
        user
      }
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'JWT',
        login,
        logout,
        register
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
