import { useState } from "react";

function LoginPage() {
  const [username, setUsername] = useState<string>("");

  const handleSubmit = (e: any) => {
    localStorage.setItem("username", username);
    console.log(username, "Submit");
    e.preventDefault();
  };
  return (
    <div>
      <p>Username</p>
      <form>
        <input type="text" onChange={(e) => setUsername(e.target.value)} />
      </form>
      <button onClick={handleSubmit}>Change Username</button>
    </div>
  );
}

export default LoginPage;
