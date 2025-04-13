import { useEffect, useState } from "react";
import { BrowserProvider, Contract } from "ethers";
import abi from "./artifacts/contracts/Will.sol/Will.json";
import "./App.css"; // Ensure basic styles

const contractAddress = "0x94D22E8C8A898150681500331f721e5E670eF5Cb"; // ✅ Replace with actual

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [generalWill, setGeneralWill] = useState("");
  const [newWill, setNewWill] = useState("");
  const [beneficiary, setBeneficiary] = useState({
    address: "",
    asset: "",
    message: "",
  });
  const [beneficiaries, setBeneficiaries] = useState([]);

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    if (window.ethereum) {
      const provider = new BrowserProvider(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const signer = await provider.getSigner();
      const userAddress = await signer.getAddress();
      setAccount(userAddress);

      const will = new Contract(contractAddress, abi.abi, signer);
      setContract(will);

      const willText = await will.generalWill();
      setGeneralWill(willText);

      const fetched = await will.getAllBeneficiaries();
      setBeneficiaries(fetched);
    }
  };

  const updateWill = async () => {
    if (!contract || !newWill) return;
    const tx = await contract.updateGeneralWill(newWill);
    await tx.wait();
    alert("Will updated!");
    setGeneralWill(newWill);
    setNewWill("");
  };

  const addBeneficiary = async () => {
    if (!contract || !beneficiary.address || !beneficiary.asset) return;
    const tx = await contract.addBeneficiary(
      beneficiary.address,
      beneficiary.asset,
      beneficiary.message
    );
    await tx.wait();
    alert("Beneficiary added!");
    const fetched = await contract.getAllBeneficiaries();
    setBeneficiaries(fetched);
    setBeneficiary({ address: "", asset: "", message: "" });
  };

  return (
    <div className="container">
      <h1> Digital Will Management DApp</h1>
      <p><strong>Connected:</strong> {account}</p>

      <section>
        <h2>📜 General Will</h2>
        <p>{generalWill || "No will message yet."}</p>
        <input
          placeholder="Enter new will message"
          value={newWill}
          onChange={(e) => setNewWill(e.target.value)}
        />
        <button onClick={updateWill}>Update Will</button>
      </section>

      <section>
        <h2>➕ Add Beneficiary</h2>
        <input
          placeholder="Wallet address"
          value={beneficiary.address}
          onChange={(e) =>
            setBeneficiary({ ...beneficiary, address: e.target.value })
          }
        />
        <input
          placeholder="Asset (e.g. ETH, NFT, Land)"
          value={beneficiary.asset}
          onChange={(e) =>
            setBeneficiary({ ...beneficiary, asset: e.target.value })
          }
        />
        <input
          placeholder="Message (optional)"
          value={beneficiary.message}
          onChange={(e) =>
            setBeneficiary({ ...beneficiary, message: e.target.value })
          }
        />
        <button onClick={addBeneficiary}>Add Beneficiary</button>
      </section>

      <section>
        <h2>📋 All Beneficiaries</h2>
        {beneficiaries.length === 0 ? (
          <p>No beneficiaries yet.</p>
        ) : (
          <ul>
            {beneficiaries.map((b, index) => (
              <li key={index}>
                <strong>Address:</strong> {b.wallet}<br />
                <strong>Asset:</strong> {b.asset}<br />
                <strong>Message:</strong> {b.message || "N/A"}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

export default App;
