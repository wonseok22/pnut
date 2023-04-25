import React, { useRef } from "react";
import { Chart, registerables } from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

Chart.register(...registerables);

const NutrientDataForm = ({ nutrientData }) => {
  const chartRef = useRef(null);

  const sortedNutrientData = nutrientData.slice().sort((a, b) => b[1] - a[1]);

  const top10Nutrients = sortedNutrientData.slice(0, 10);

  const nutrientNames = top10Nutrients.map((nutrient) => nutrient[0]);
  const nutrientPercentages = top10Nutrients.map((nutrient) => nutrient[1]);

  // 일일권장량 highlight
  const highlightPlugin = {
    id: "highlightPlugin",
    beforeDraw: (chart) => {
      const ctx = chart.canvas.getContext("2d");
      const yAxis = chart.scales.y;
      const xAxis = chart.scales.x;

      const y100Percent = yAxis.getPixelForValue(100);

      ctx.save();
      ctx.fillStyle = "#FFD1D1";
      ctx.fillRect(
        xAxis.left,
        y100Percent - yAxis.height * 0.05,
        xAxis.width,
        yAxis.height * 0.1
      );
      ctx.restore();
    },
  };

  const chartData = {
    labels: nutrientNames,
    datasets: [
      {
        label: "Nutrient Percentage",
        data: nutrientPercentages,
        backgroundColor: "#FFD771",
        borderColor: "#FFD771",
        borderWidth: 1,
        barThickness: 40,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRaio: false,
    aspectRatio: 4,
    plugins: {
      datalabels: {
        color: "#2B2C2B",
        weight: "bold",
        font: {
          size: 15,
        },
        anchor: "start",
        align: "top",
        formatter: (value) => `${value} %`,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        grid: {
          display: false,
        },
        beginAtZero: true,
        max: 150,
      },
      x: {
        grid: {
          display: false,
        },
        categoryPercentage: 1,
      },
    },
  };

  return (
    <div className="relative h-260">
      {/* 우상단 labels */}
      <div className="flex justify-end items-center mt-4 mr-40">
        <div className="flex items-center mr-20">
          <div className="w-12 h-12 mr-2 bg-#FFD1D1" />
          <span className="text-#2B2C2B font-bold ">일일 권장섭취량</span>
        </div>
        <div className="flex items-center">
          <div className="w-12 h-12 mr-2 bg-[#FFD771]" />
          <span className="text-#2B2C2B font-bold ">함유량</span>
        </div>
      </div>
      <Bar
        ref={chartRef}
        plugins={[ChartDataLabels, highlightPlugin]}
        data={chartData}
        options={chartOptions}
      />
    </div>
  );
};

export default NutrientDataForm;
