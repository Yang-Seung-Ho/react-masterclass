import { useLocation } from "react-router-dom";

function Search() {
  const location = useLocation();
  const searchedMovie = new URLSearchParams(location.search).get("keyword");
  console.log(searchedMovie);
  return null;
}
export default Search;
