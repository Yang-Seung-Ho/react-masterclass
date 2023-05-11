import { useQuery } from "react-query";
import { fetchCoinChart } from "../api";
import ApexCharts from "react-apexcharts";

interface ChartProps {
  coinId: string;
}

function Candle({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery(["ohlcv", coinId], () =>
    fetchCoinChart(coinId)
  );
  console.log(
    data?.map(
      (price: {
        low: any;
        high: any;
        open: any;
        time_close: any;
        close: any;
      }) => [
        {
          x: price.time_close,
          y: [price.open, price.high, price.low, price.close],
        },
      ]
    )
  );

  return (
    <div>
      {isLoading ? (
        "Candle Loading..."
      ) : (
        <ApexCharts
          type="candlestick"
          options={{
            chart: {
              height: 500,
              width: 500,
              toolbar: {
                show: false,
              },
            },
            xaxis: {
              labels: { show: false },
              axisTicks: { show: false },
              axisBorder: { show: false },
            },
            yaxis: {
              labels: { show: false },
            },
          }}
          series={[
            {
              data: data.map(
                (price: {
                  time_close: string | number | Date;
                  open: any;
                  high: any;
                  low: any;
                  close: any;
                }) => ({
                  x: new Date(price.time_close),
                  y: [price.open, price.high, price.low, price.close],
                })
              ),
            },
          ]}
        />
      )}
    </div>
  );
}
export default Candle;
