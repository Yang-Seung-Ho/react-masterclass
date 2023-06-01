import { useHistory, useLocation, useRouteMatch } from "react-router-dom";
import { ISearch, getSearchedWork } from "../api";
import { get } from "http";
import { useQuery } from "react-query";
import { relative } from "path";
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  Variants,
  motion,
  useViewportScroll,
} from "framer-motion";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";

<script
  src="https://kit.fontawesome.com/bae4df805e.js"
  crossOrigin="anonymous"
></script>;
const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
`;
const Loader = styled.div`
  height: 20vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const SliderBox = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 250px;
`;
const Slider = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
`;
const Row = styled(motion.div)`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(6, 1fr);
  position: absolute;
  width: 95%;
`;
const Box = styled(motion.div)<{ bgImage?: string }>`
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background-color: white;
  background-image: url(${(props) => props.bgImage});
  background-size: cover;
  background-position: center center;
  border-radius: 5px;
  height: 150px;
  font-size: 66px;
  cursor: pointer;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;
const ResultHeader = styled.div`
  font-size: 28px;
  margin-top: 5%;
  margin-bottom: -3%;
  margin-left: 3%;
  font-weight: 300;
`;
const ResultKeyword = styled.span`
  font-size: 32px;
  color: rgb(230, 74, 74);
  font-weight: 400;
`;
const boxVariants: Variants = {
  normal: {
    scale: 1,
    transition: {
      type: "tween",
    },
  },
  hover: {
    y: -50,
    scale: 1.3,
    transition: {
      duration: 0.3,
      delay: 0.5,
      type: "tween",
    },
  },
};
const ButtonL = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  z-index: 100;
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
  width: 2.5%;
  position: absolute;
  left: 0px;
  height: 150px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 24px;
`;
const ButtonR = styled.button`
  background-color: rgba(0, 0, 0, 0.3);
  border: none;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
  width: 2.5%;
  position: absolute;
  right: 0px;
  height: 150px;
  color: ${(props) => props.theme.white.lighter};
  font-size: 24px;
`;
const Info = styled(motion.div)`
  padding: 5px;
  background-color: ${(props) => props.theme.black.lighter};
  display: flex;
  justify-content: center;
  opacity: 0;
  width: 100%;
  bottom: 0;
  position: absolute;
  h4 {
    font-size: 16px;
  }
`;
const infoVariants: Variants = {
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3,
      delay: 0.5,
      type: "tween",
    },
  },
};
const BigMovie = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
  border-radius: 15px;
  overflow: hidden;
  background-color: ${(props) => props.theme.black.lighter};
`;
const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;
const BigCover = styled.div`
  width: 100%;
  background-size: cover;
  background-position: center center;
  height: 400px;
`;
const BigTitle = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  padding: 20px;
  font-size: 40px;
  position: relative;
  top: -80px;
`;

const BigOverview = styled.p`
  padding: 20px;
  position: relative;
  top: -80px;
  color: ${(props) => props.theme.white.lighter};
`;
const BundleName = styled.h1`
  position: absolute;
  top: -46px;
  font-size: 36px;
  color: ${(props) => props.theme.white.lighter};
  left: 3%;
`;
const OverLayBgBox = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  z-index: -999;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Logo = styled(motion.svg)`
  opacity: 0.4;
  margin-right: 50px;
  width: 500px;
  height: auto;
  fill: red;
  path {
    stroke-width: 6px;
    stroke: #0000004a;
  }
`;

const offset = 6; //한번에 보여주고싶은 영화 수

function Search() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchedKeyword = searchParams.get("keyword");
  const searchedMovie = searchParams.get("movies");
  const { data, isLoading } = useQuery<ISearch>(["movies", "nowPlaying"], () =>
    getSearchedWork(searchedKeyword as any)
  );
  console.log(data);
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const [back, setBack] = useState(false);
  const history = useHistory();
  const { scrollY } = useViewportScroll();
  const onOverLayClick = () =>
    history.push(`/search?keyword=${searchedKeyword}`);

  const clickedMovie =
    searchedMovie && data?.results.find((movie) => movie.id === +searchedMovie);
  const rowVariants: Variants = {
    hidden: (back: Boolean) => ({
      x: back ? -window.outerWidth - 10 : window.outerWidth - 10,
      transition: {
        duration: 1,
      },
    }),
    visible: { x: 0 },
    exit: (back: Boolean) => ({
      x: back ? window.outerWidth + 10 : -window.outerWidth + 10,
      transition: {
        duration: 1,
      },
    }),
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const increaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    if (data) {
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(false);
      setIndex((prev) => (maxIndex === prev ? 0 : prev + 1));
    }
  };
  const decreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    if (data) {
      const totalMovies = data.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(true);
      setIndex((prev) => (0 === prev ? maxIndex : prev - 1));
    }
  };
  const onBoxClicked = (keyword: number) => {
    history.push(`/search?keyword=${searchedKeyword}&movies=${keyword}`);
  };

  return (
    <>
      {isLoading ? (
        <div> load</div>
      ) : (
        <>
          <Wrapper>
            {isLoading ? (
              <Loader>loading</Loader>
            ) : (
              <>
                <ResultHeader>
                  <ResultKeyword>{`${searchedKeyword}`}</ResultKeyword>
                  {` search results...`}
                </ResultHeader>
                <SliderBox style={{ marginTop: "100px" }}>
                  <Slider>
                    <BundleName>Results</BundleName>
                    <ButtonL onClick={decreaseIndex}>
                      <i className="fa-solid fa-chevron-left"></i>
                    </ButtonL>
                    <AnimatePresence
                      custom={back}
                      initial={false}
                      onExitComplete={toggleLeaving}
                    >
                      <Row
                        custom={back}
                        variants={rowVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        key={index}
                        transition={{ type: "tween", duration: 1 }}
                      >
                        {data?.results
                          .slice(1)
                          .slice(offset * index, offset * index + offset)
                          .map((movie) => (
                            <Box
                              layoutId={movie.id + "n"}
                              variants={boxVariants}
                              key={movie.id + "n"}
                              bgImage={makeImagePath(
                                movie.backdrop_path || movie.poster_path,
                                "w500"
                              )}
                              whileHover="hover"
                              initial="normal"
                              onClick={() => onBoxClicked(movie.id)}
                            >
                              <Info variants={infoVariants}>
                                <h4>{movie.title || "null"}</h4>
                              </Info>
                            </Box>
                          ))}
                      </Row>
                    </AnimatePresence>
                    <ButtonR onClick={increaseIndex}>
                      <i className="fa-solid fa-chevron-right"></i>
                    </ButtonR>
                  </Slider>
                </SliderBox>
                <AnimatePresence>
                  {searchedMovie ? (
                    <>
                      <Overlay
                        exit={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={onOverLayClick}
                      ></Overlay>
                      {clickedMovie && (
                        <>
                          <BigMovie
                            style={{ top: scrollY.get() + 100 }}
                            layoutId={searchedMovie + "n"}
                          >
                            <BigCover
                              style={{
                                backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                                  clickedMovie.backdrop_path ||
                                    clickedMovie.poster_path,
                                  "w500"
                                )})`,
                              }}
                            ></BigCover>
                            <BigTitle>{clickedMovie.title}</BigTitle>
                            <BigOverview>{clickedMovie.overview}</BigOverview>
                          </BigMovie>
                        </>
                      )}
                    </>
                  ) : null}
                </AnimatePresence>
              </>
            )}
            <OverLayBgBox>
              <Logo
                xmlns="http://www.w3.org/2000/svg"
                width="1024"
                height="276.742"
                viewBox="0 0 1024 276.742"
              >
                <motion.path d="M140.803 258.904c-15.404 2.705-31.079 3.516-47.294 5.676l-49.458-144.856v151.073c-15.404 1.621-29.457 3.783-44.051 5.945v-276.742h41.08l56.212 157.021v-157.021h43.511v258.904zm85.131-157.558c16.757 0 42.431-.811 57.835-.811v43.24c-19.189 0-41.619 0-57.835.811v64.322c25.405-1.621 50.809-3.785 76.482-4.596v41.617l-119.724 9.461v-255.39h119.724v43.241h-76.482v58.105zm237.284-58.104h-44.862v198.908c-14.594 0-29.188 0-43.239.539v-199.447h-44.862v-43.242h132.965l-.002 43.242zm70.266 55.132h59.187v43.24h-59.187v98.104h-42.433v-239.718h120.808v43.241h-78.375v55.133zm148.641 103.507c24.594.539 49.456 2.434 73.51 3.783v42.701c-38.646-2.434-77.293-4.863-116.75-5.676v-242.689h43.24v201.881zm109.994 49.457c13.783.812 28.377 1.623 42.43 3.242v-254.58h-42.43v251.338zm231.881-251.338l-54.863 131.615 54.863 145.127c-16.217-2.162-32.432-5.135-48.648-7.838l-31.078-79.994-31.617 73.51c-15.678-2.705-30.812-3.516-46.484-5.678l55.672-126.75-50.269-129.992h46.482l28.377 72.699 30.27-72.699h47.295z" />
              </Logo>
            </OverLayBgBox>
          </Wrapper>
        </>
      )}
    </>
  );
}
export default Search;
