import { useState } from "react";

type SendToProps = {
  addSendToList: (sendTo: string) => void;
};

const SendTo = ({ addSendToList }: SendToProps) => {
  const [sendTo, setSendTo] = useState<string>("admin");

  const handleClick = (e: any) => {
    addSendToList(sendTo);
    e.preventDefault();
  };

  return (
    <div>
      <p>Target</p>
      <form>
        <input
          type="text"
          onChange={(e) => {
            setSendTo(e.target.value);
          }}
        />
      </form>
      <button onClick={handleClick}>Add Target</button>
    </div>
  );
};

export default SendTo;
