import { useEffect, useState } from "react";
import { ethers } from "ethers";

// Components
import Navigation from "./components/Navigation";
import Sort from "./components/Sort";
import Card from "./components/Card";
import SeatChart from "./components/SeatChart";

// ABIs
import TokenMaster from "./abis/TokenMaster.json";

// Config
import config from "./config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);

  const [tokenMaster, setTokenMaster] = useState(null);
  const [occasions, setOccasions] = useState([]);

  const [occasion, setOccasion] = useState({});
  const [toggle, setToggle] = useState(false);

  // 🔹 Function to load blockchain data
  const loadBlockchainData = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(provider);

      const network = await provider.getNetwork();
      console.log("Connected to network:", network.chainId); // Debugging log

      if (!config[network.chainId]) {
        console.error("Unsupported network. Change to the correct network.");
        return;
      }

      const tokenMaster = new ethers.Contract(
        config[network.chainId].TokenMaster.address,
        TokenMaster,
        provider
      );

      setTokenMaster(tokenMaster);
      console.log("TokenMaster contract loaded:", tokenMaster.address); // Debugging log

      const totalOccasions = await tokenMaster.totalOccasions();
      console.log("Total Occasions:", totalOccasions.toString()); // Debugging log

      const occasions = [];
      for (var i = 1; i <= totalOccasions; i++) {
        const occasion = await tokenMaster.getOccasion(i);
        console.log(`Occasion ${i}:`, occasion); // Debugging log

        occasions.push({
          name: occasion.name,
          date: occasion.date,
          time: occasion.time,
          location: occasion.location,
          cost: occasion.cost,
          tickets: occasion.tickets
        });
      }

      console.log("Final loaded occasions:", occasions); // Debugging log
      setOccasions(occasions);

      window.ethereum.on("accountsChanged", async () => {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
      });
    } catch (error) {
      console.error("Error loading blockchain data:", error);
    }
  };

  // 🔹 Load data when component mounts
  useEffect(() => {
    loadBlockchainData();
  }, []);

  return (
    <div>
      <header>
        <Navigation account={account} setAccount={setAccount} />
        <h2 className="header__title"><strong>Event</strong>Token</h2>
      </header>

      <Sort />

      <div className="cards">
        {occasions.length > 0 ? (
          occasions.map((occasion, index) => (
            <Card
              occasion={occasion}
              id={index + 1}
              tokenMaster={tokenMaster}
              provider={provider}
              account={account}
              toggle={toggle}
              setToggle={setToggle}
              setOccasion={setOccasion}
              key={index}
            />
          ))
        ) : (
          <p>No events available.</p>
        )}
      </div>

      {toggle && (
        <SeatChart
          occasion={occasion}
          tokenMaster={tokenMaster}
          provider={provider}
          setToggle={setToggle}
        />
      )}
    </div>
  );
}

export default App;
