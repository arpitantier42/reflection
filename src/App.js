import React, { useState } from "react";
import useWallet from "./useWalle";
import { env } from "./appconstants";

// Example usage
const App = () => {
  const [value, setValue] = useState("");
  const [hash, setHash] = useState("");
  const { addNetwork } = useWallet();

  return (
    <div>
      <h1>Reflection</h1>
      <div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button
          onClick={async () => {
            const res = await addNetwork(value);
            console.log({ resswq: res });

            setHash(res);
          }}
        >
          Contract call
        </button>
        {hash ? (
          <p
            style={{
              cursor: "pointer",
              textDecoration: "underline",
              color: "blue",
            }}
            onClick={() =>
              window.open(`${env.txnExplorerUrl}${hash}`, "_blank")
            }
          >
            Txn : {hash}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default App;
