import { useState, useEffect, useRef } from "react";
import "./ERC20BaseChart.css";
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
      text: "Base Fee per block",
    },
  },
};

function ERC20BaseChart() {
  const [provider, setProvider] = useState("");
  const startBlock = useRef(0);
  const [labels, setLabels] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const updateInterval = setInterval(() => {
      asyncAction(true).catch(console.log);
      toast(`Updated at ${new Date().toLocaleTimeString()}`);
    }, 10000);
    const asyncAction = async (isUpdate = false) => {
      const xLabels = [];
      const requestPromises = [];

      const fetchedProvider = new ethers.providers.JsonRpcProvider(
        import.meta.env.VITE_ALCHEMY_HTTPS,
        "homestead"
      );
      setProvider(fetchedProvider);

      const latestBlock = await fetchedProvider.getBlockNumber();
      if (!isUpdate) {
        // initial run
        startBlock.current = latestBlock - 10;
      }

      for (let i = startBlock.current; i < latestBlock; i++) {
        xLabels.push(i);
        requestPromises.push(fetchedProvider.getBlock(i));
      }
      setLabels(xLabels);

      const results = await Promise.all(requestPromises);
      const baseFeeDict = results.reduce((acc, cur) => {
        acc[cur.number] = Number(
          ethers.utils.formatUnits(cur.baseFeePerGas, "gwei")
        );
        return acc;
      }, {});


      const data = {
        labels: xLabels,
        datasets: [
          {
            data: xLabels.map((val) => baseFeeDict[val]),
            label: "Base fee in Gwei",
            backgroundColor: "rgba(15, 99, 132, 0.9)",
          },
        ],
      };
      setData(data);
    };

    asyncAction().catch(console.log);

    return () => clearInterval(updateInterval);
  }, []);

  if (!(data.datasets && labels.length)) {
    return <div>Loading</div>;
  }

  return (
    <div className="ERC20BaseChart">
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
      <Bar data={data} options={options} />
    </div>
  );
}

export default ERC20BaseChart;
