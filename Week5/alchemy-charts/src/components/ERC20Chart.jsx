import { useState, useEffect } from "react";
import "./ERC20Chart.css";
import erc20abi from "./erc20abi.json";
import { ethers } from "ethers";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { Bar } from "react-chartjs-2";

const shibaInuToken = "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE";

const filter = {
  address: shibaInuToken,
  topics: [ethers.utils.id("Transfer(address,address,uint256)")],
};

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Token Volume Transactions",
    },
  },
};

function ERC20Chart() {
  const [provider, setProvider] = useState("");
  const [startBlock, setStartBlock] = useState("");
  const [endBlock, setEndBlock] = useState("");
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [address, setAddress] = useState(shibaInuToken);

  useEffect(() => {
    const asyncAction = async () => {
      const xLabels = [];

      const fetchedProvider = new ethers.providers.JsonRpcProvider(
        import.meta.env.VITE_ALCHEMY_HTTPS,
        "homestead"
      );
      setProvider(fetchedProvider);

      const latestBlock = await fetchedProvider.getBlockNumber();
      const offsetBlock = latestBlock - 10;
      setEndBlock(latestBlock);
      setStartBlock(offsetBlock);

      const token = new ethers.Contract(
        shibaInuToken,
        erc20abi,
        fetchedProvider
      );

      const events = await token.queryFilter(
        "Transfer",
        offsetBlock,
        latestBlock
      );

      for (let i = offsetBlock; i <= latestBlock; i++) {
        xLabels.push(i);
      }
      setLabels(xLabels);
      const eventsDictionary = events.reduce((acc, cur) => {
        if (acc[cur.blockNumber]) {
          acc[cur.blockNumber] += 1;
        } else {
          acc[cur.blockNumber] = 1;
        }
        return acc;
      }, {});
      const data = {
        labels: xLabels,
        datasets: [
          {
            data: xLabels.map((val) => eventsDictionary[val] || 0),
            label: "Volume",
            backgroundColor: "rgba(15, 99, 132, 0.9)",
          },
        ],
      };
      setData(data);
    };

    asyncAction()
      .catch(console.log)
      .then(() => console.log({ startBlock, endBlock }));
  }, [address, setAddress]);

  if (!(provider && startBlock && endBlock && labels.length)) {
    return <div>Loading</div>;
  }

  return (
    <div className="ERC20Chart">
      <Bar data={data} options={options} />
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
    </div>
  );
}

export default ERC20Chart;
