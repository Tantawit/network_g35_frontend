import { useEffect, useState } from "react";
import SendTo from "./components/sendTo";
import LoginPage from "./components/username";

function Chat() {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [message, setMessage] = useState<string>("");
  const [sendToList, setSendToList] = useState<string[]>([]);
  const [messageList, setMessageList] = useState<string[]>([]);

  let username: string;

  const addSendToList = (sendTo: string) => {
    setSendToList((sendToList) => [...sendToList, sendTo]);
  };

  const addMessageList = (message: string) => {
    setMessageList((messageList) => [...messageList, message]);
  };

  if (typeof window !== "undefined") {
    username = localStorage.getItem("username") || "";
  }

  useEffect(() => {
    const ws = new WebSocket(`wss://chat.samithiwat.dev/v1/chat/ws`);
    ws.onopen = () => {
      console.debug("connecting to server");
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: 1,
          username,
        })
      );
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.debug(`receive message: ${data}`);
        switch (data.type) {
          case undefined:
            data as { connect_success: boolean };
            if (data.connect_success) {
              console.info("Successfully connected to server");
            }
            return;
          case 4:
            data as { type: 4; message: string };
            console.debug(`receive message ${data.message}`);
            console.debug(`total message: ${messageList.length}`);
            addMessageList(data.message);
            break;
          case 5:
            console.error(data);
            break;
          case 6:
            ws.send(
              JSON.stringify({
                type: 6,
                message: "pong",
              })
            );
            break;
          default:
            console.error(data);
        }
      } catch (error) {
        console.error("Error parsing JSON message", error);
      }
    };

    ws.onerror = (ev: Event) => {
      console.error(`Got error`, ev);
    };

    ws.onclose = (ev: CloseEvent) => {
      console.debug(`WebSocket disconnected at code ${ev.code}`);
      setSocket(null);
    };

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, [username]);

  const handleSend = () => {
    if (socket && message) {
      console.debug(`targets: ${sendToList}`);
      socket.send(
        JSON.stringify({
          type: 2,
          message,
          targets: sendToList,
        })
      );
      setMessage("");
    }
  };
  return (
    <>
      <LoginPage />
      <SendTo addSendToList={addSendToList} />
      {messageList.map((e) => {
        <>{e}</>;
      })}
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </>
  );
}

export default Chat;
