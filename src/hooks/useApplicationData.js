import { useReducer, useEffect } from "react";

import axios from "axios";

import reducer, {
  SET_DAY,
  SET_APPLICATION_DATA,
  SET_INTERVIEW
} from "reducers/application";

import useRealTimeUpdate from "hooks/useRealtimeUpdate";

const HOST_URL = process.env.REACT_APP_API_BASE_URL || "";

export default function useApplicationData() {
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      axios.get(`${HOST_URL}/api/days`),
      axios.get(`${HOST_URL}/api/appointments`),
      axios.get(`${HOST_URL}/api/interviewers`)
    ]).then(
      ([{ data: days }, { data: appointments }, { data: interviewers }]) =>
        dispatch({
          type: SET_APPLICATION_DATA,
          days,
          appointments,
          interviewers
        })
    );
  }, []);

  useRealTimeUpdate(process.env.REACT_APP_WEBSOCKET_URL, dispatch);

  function bookInterview(id, interview) {
    return axios
      .put(`${HOST_URL}/api/appointments/${id}`, { interview })
      .then(() => {
        dispatch({
          type: SET_INTERVIEW,
          id,
          interview
        });
      });
  }

  function cancelInterview(id) {
    return axios.delete(`${HOST_URL}/api/appointments/${id}`).then(() => {
      dispatch({
        type: SET_INTERVIEW,
        id,
        interview: null
      });
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
