import { useState, useEffect, useRef } from "react";
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

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { SHIBA_INU_TOKEN, TETHER_TOKEN } from "../constants/tokens";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

import { Bar } from "react-chartjs-2";

const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: true,
      text: "Volume of Token-related Transactions per Block",
    },
  },
};

function ERC20Chart() {
  const [provider, setProvider] = useState("");
  const startBlock = useRef(0);
  const [endBlock, setEndBlock] = useState("");
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);
  const [address, setAddress] = useState(SHIBA_INU_TOKEN);
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      asyncAction(true).catch(console.log);
      toast(`Updated at ${new Date().toLocaleTimeString()}`);
    }, 10000);

    const timeInterval = setInterval(() => {
      if (timer <= 0) {
        setTimer(5);
      } else {
        setTimer((prev) => prev - 1);
      }
    }, 1000);
    const asyncAction = async (isUpdate = false) => {
      const xLabels = [];

      const fetchedProvider = new ethers.providers.JsonRpcProvider(
        import.meta.env.VITE_ALCHEMY_HTTPS,
        "homestead"
      );
      setProvider(fetchedProvider);

      const latestBlock = await fetchedProvider.getBlockNumber();
      if (!isUpdate) {
        startBlock.current = latestBlock - 10;
      }
      setEndBlock(latestBlock);

      const token = new ethers.Contract(address, erc20abi, fetchedProvider);

      const events = await token.queryFilter(
        "Transfer",
        startBlock.current,
        latestBlock
      );

      for (let i = startBlock.current; i < latestBlock; i++) {
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

    asyncAction().catch(console.log);

    return () => {
      clearInterval(updateInterval);
      clearInterval(timeInterval);
    };
  }, [address]);

  // useEffect(() => {
  //   const updateInterval = setInterval(() => {

  //   }, 5000);

  //   const asyncUpdate = async () => {

  //   }

  //   return () => {
  //     clearInterval(updateInterval);
  //   }
  // })

  if (!(provider && startBlock && endBlock && labels.length)) {
    return <div>Loading</div>;
  }

  return (
    <div className="ERC20Chart">
      <ToastContainer
        position="top-center"
        autoClose={1000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="card">
        <p>ShibaInu: {SHIBA_INU_TOKEN}</p>
        <p>Tether: {TETHER_TOKEN}</p>
      </div>
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
