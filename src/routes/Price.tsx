import { useQuery } from "react-query";
import { fetchCoinChart } from "../api";
import { fetchCoinInfo, fetchCoinTicker } from "../api";
import { styled } from "styled-components";
interface PriceData {
  id: string;
  name: string;
  symbol: string;
  rank: number;
  circulating_supply: number;
  total_supply: number;
  max_supply: number;
  beta_value: number;
  first_data_at: string;
  last_updated: string;
  quotes: {
    USD: {
      ath_date: string;
      ath_price: number;
      market_cap: number;
      market_cap_change_24h: number;
      percent_change_1h: number;
      percent_change_1y: number;
      percent_change_6h: number;
      percent_change_7d: number;
      percent_change_12h: number;
      percent_change_15m: number;
      percent_change_24h: number;
      percent_change_30d: number;
      percent_change_30m: number;
      percent_from_price_ath: number;
      price: number;
      volume_24h: number;
      volume_24h_change_24h: number;
    };
  };
}
interface ChartProps {
  coinId: string;
}
const OuterBox = styled.div`
  display: flex;
  flex-direction: column;
`;
const Info = styled.span`
  font-size: 24px;
`;
const InfoData = styled.span`
  font-size: 24px;
  border-left: 3px solid ${(props) => props.theme.textColor};
  padding-left: 7%;
`;
const InfoBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
`;
function Price({ coinId }: ChartProps) {
  const { isLoading, data } = useQuery(["ohlcv", coinId], () =>
    fetchCoinChart(coinId)
  );
  const { isLoading: tickerLoading, data: tickerData } = useQuery<PriceData>(
    ["ticker", coinId],
    () => fetchCoinTicker(coinId)
  );
  console.log(tickerData);
  return (
    <OuterBox>
      <InfoBox>
        <Info>All Time High</Info>
        <InfoData>{tickerData?.quotes.USD.ath_price?.toFixed(3)}</InfoData>
      </InfoBox>
      <InfoBox>
        <Info>Price Now</Info>
        <InfoData>{tickerData?.quotes.USD.price?.toFixed(3)}</InfoData>
      </InfoBox>
      <InfoBox>
        <Info>1Hour Percent Change</Info>
        <InfoData>{tickerData?.quotes.USD.percent_change_1h}</InfoData>
      </InfoBox>
      <InfoBox>
        <Info>1Day Percent Cap with Market</Info>
        <InfoData>{tickerData?.quotes.USD.market_cap_change_24h}</InfoData>
      </InfoBox>
    </OuterBox>
  );
}
export default Price;
