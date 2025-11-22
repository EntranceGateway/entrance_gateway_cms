import { createSlice } from "@reduxjs/toolkit";
import STATUSES from '../src/globals/status/statuses'
import API from '../src/http'

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    status: null,
    token: null,
    userId:null,
    error: null, 


  },
  reducers: {
    setStatus(state, action) {
      state.status = action.payload;
    },
     setError(state, action) {
      state.error = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    setToken(state, action) {
      state.token = action.payload;
    },
      setUserId(state, action) {
      state.userId = action.payload;
    },
    
    }
});

// Export reducers
export const { setStatus, setUser, setToken,setUserId,setError} = authSlice.actions;
export default authSlice.reducer;

// Thunks

export function addAuth(data) {
  return async function(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.post('/api/v1/auth/admin/register', data);
      if (response.status === 200) {
        dispatch(setStatus(STATUSES.SUCCESS));
      } else {
        dispatch(setStatus(STATUSES.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
    }
  }
}

export function login(data) {
  return async function (dispatch) {
    dispatch(setStatus(STATUSES.LOADING));

    try {
      const response = await API.post("/api/v1/auth/login", data);

      if (response.status === 200 && response.data.data.token) {
        const { token, userId, user } = response.data.data;

        dispatch(setToken(token));
        dispatch(setUserId(userId));
        dispatch(setUser(user));

        // persist
        localStorage.setItem("token", token);
        localStorage.setItem("userId", userId);

        dispatch(setStatus(STATUSES.SUCCESS));
      } else {
        // If backend responds 200 but no token
        dispatch(setStatus(STATUSES.ERROR));
        dispatch(setError(response.data.message || "Login failed"));
      }
    } catch (error) {
      // Backend returned an error response
      const message =
        error.response?.data?.message || "Something went wrong";
      dispatch(setStatus(STATUSES.ERROR));
      dispatch(setError(message));
    }
  };
}


export function fetchAuth() {
  return async function(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.get('/api/v1/notes');
      if (response.status === 200 && response.data.notes) {
        dispatch(setUser(response.data.notes)); // store notes or users consistently
        dispatch(setStatus(STATUSES.SUCCESS));
      } else {
        dispatch(setStatus(STATUSES.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
    }
  }
}

export function deleteAuth(id, token) {
  return async function(dispatch) {
    dispatch(setStatus(STATUSES.LOADING));
    try {
      const response = await API.delete(`notes/${id}`, {
        headers: { token }
      });
      if (response.status === 200) {
        dispatch(removeUserFromState(id)); // matches reducer name
        dispatch(setStatus(STATUSES.SUCCESS));
      } else {
        dispatch(setStatus(STATUSES.ERROR));
      }
    } catch (error) {
      dispatch(setStatus(STATUSES.ERROR));
    }
  }
}
