import * as React from "react";
import styled from "styled-components/macro";
import PropTypes from "prop-types";
import { Bar, Pie, Doughnut } from "react-chartjs-2";

const generateChartDetails = (collection) => {
  if (!collection) {
    return;
  }

  const labels = Array.from(collection.keys());
  const values = Array.from(collection.values()).map((item) => item.length);

  const dataset = {
    label: "Users of this age bracket",
    data: values,
    backgroundColor: [...Array(labels.length)].reduce((colors) => {
      const randomColor = `#${Math.floor(Math.random() * 16777215).toString(
        16
      )}`;
      colors.push(randomColor);
      return colors;
    }, []),
  };

  return {
    labels: labels,
    datasets: [dataset],
  };
};

const ChartWrapper = styled.div``;

const options = {
  scales: {
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
        },
      },
    ],
  },
};

const Chart = ({ data, type }) => {
  const ChartVariations = {
    bar: Bar,
    pie: Pie,
    doughnut: Doughnut,
  };

  const Chart = ChartVariations[type || "bar"];

  return <Chart data={generateChartDetails(data)} />;
};

Chart.defaultProps = {
  data: [],
};

export default Chart;
