import { useEffect, useRef } from "react";
import { SET_INTERVIEW } from "reducers/application";

export default function useRealtimeUpdate(url, dispatch) {
  const socket = useRef();

  useEffect(() => {
    socket.current = new WebSocket(url);

    return () => {
      socket.current.close();
    };
  }, [url]);

  useEffect(() => {
    socket.current.onmessage = event => {
      const data = JSON.parse(event.data);

      if (typeof data === "object" && data.type === SET_INTERVIEW) {
        dispatch(data);
      }
    };
  }, [dispatch]);
}
