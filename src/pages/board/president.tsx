import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
import { Card, CardHeader } from "@mui/material";
import { useTheme, styled } from "@mui/material/styles";

import { BaseOptionChart } from "src/components/charts";

import { fNumber } from "src/utils/helper";

const CHART_HEIGHT = 372;
const LEGEND_HEIGHT = 72;

const ChartWrapperStyle = styled("div")(({ theme }) => ({
  height: CHART_HEIGHT,
  marginTop: theme.spacing(5),
  "& .apexcharts-canvas svg": { height: CHART_HEIGHT },
  "& .apexcharts-canvas svg,.apexcharts-canvas foreignObject": {
    overflow: "visible",
  },
  "& .apexcharts-legend": {
    height: LEGEND_HEIGHT,
    alignContent: "center",
    position: "relative !important" as "relative",
    borderTop: `solid 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

const CHART_DATA = [1500000, 1100000, 450000, 150000];

export default function President() {
  const theme = useTheme();

  const chartOptions = merge(BaseOptionChart(), {
    colors: [
      theme.palette.primary.main,
      theme.palette.chart.blue[0],
      theme.palette.chart.red[0],
      theme.palette.chart.yellow[0],
    ],
    labels: ["LIBRE", "PN", "PL", "Otros"],
    stroke: { colors: [theme.palette.background.paper] },
    legend: { floating: true, horizontalAlign: "center" },
    dataLabels: { enabled: true, dropShadow: { enabled: false } },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (seriesName: string) => fNumber(seriesName),
        title: {
          formatter: (seriesName: string) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: { donut: { labels: { show: false } } },
    },
  });

  return (
    <Card>
      <CardHeader title="Presidencial" />
      <ChartWrapperStyle dir="ltr">
        <ReactApexChart
          type="pie"
          series={CHART_DATA}
          options={chartOptions}
          height={280}
        />
      </ChartWrapperStyle>
    </Card>
  );
}
