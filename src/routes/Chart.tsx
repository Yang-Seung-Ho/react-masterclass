import { useQuery } from "react-query";
import { fetchCoinChart } from "../api";
import ApexCharts from "react-apexcharts";

interface ChartProps {
  coinId: string;
}

function Chart({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery(["ohlcv", coinId], () =>
    fetchCoinChart(coinId)
  );

  return (
    <div>
      {isLoading ? (
        "Chart Loading..."
      ) : (
        <ApexCharts
          type="line"
          series={[
            {
              name: "Price",
              data: data?.map((price: { close: any }) => price.close),
            },
          ]}
          options={{
            theme: {
              mode: "light",
              palette: "palette4",
            },
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
            },
            tooltip: {
              y: {
                formatter: (value) => `$ ${value.toFixed(2)}`,
              },
            },
            stroke: { curve: "smooth", width: 5 },
            grid: { show: false },
            xaxis: {
              categories: data?.map(
                (price: { time_close: any }) => price.time_close
              ),
              type: "datetime",
              labels: { show: false },
              axisTicks: { show: false },
              axisBorder: { show: false },
            },
            yaxis: {
              labels: { show: false },
            },
            fill: {
              type: "gradient",
              gradient: { gradientToColors: ["#0be881"], stops: [0, 100] },
            },
            colors: ["#0fbcf9"],
          }}
        />
      )}
    </div>
  );
}
export default Chart;
