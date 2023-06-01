import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  IGetTvResult,
  getMovies,
  getOnTheAirTv,
  getPopularTv,
  getTopRatedMovies,
  getTopRatedTv,
  getUpcomingMovies,
} from "../api";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import {
  AnimatePresence,
  Variants,
  motion,
  useViewportScroll,
} from "framer-motion";
import { useState } from "react";
import { useHistory, useRouteMatch } from "react-router-dom";
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
const Banner = styled.div<{ bgImage?: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 0),
      rgba(0, 0, 0, 1)
    ),
    url(${(props) => props.bgImage});
  background-size: cover;
`;
const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 30px;
  width: 50%;
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

const offset = 6; //한번에 보여주고싶은 영화 수

function Tv() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);

  const [Pindex, PsetIndex] = useState(0);

  const [Tindex, TsetIndex] = useState(0);

  const [back, setBack] = useState(false);

  const history = useHistory();
  const bigMovieMatch = useRouteMatch<{ movieId: string }>("/tv/:movieId");
  const { scrollY } = useViewportScroll();
  const { data, isLoading } = useQuery<IGetTvResult>(
    ["movies", "nowPlaying"],
    getOnTheAirTv
  );
  const { data: upcomingData, isLoading: upcomingLoading } =
    useQuery<IGetTvResult>(["movies", "popular"], getPopularTv);
  const { data: topRatedData, isLoading: topRatedIsLoading } =
    useQuery<IGetTvResult>(["movies", "top_rated"], getTopRatedTv);

  const onOverLayClick = () => history.push("/tv");

  const clickedMovie =
    bigMovieMatch?.params.movieId &&
    data?.results.find((movie) => movie.id === +bigMovieMatch.params.movieId);
  const TclickedMovie =
    bigMovieMatch?.params.movieId &&
    topRatedData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  const PclickedMovie =
    bigMovieMatch?.params.movieId &&
    upcomingData?.results.find(
      (movie) => movie.id === +bigMovieMatch.params.movieId
    );
  console.log(PclickedMovie);
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

  const PopularIncreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    if (upcomingData) {
      const totalMovies = upcomingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(false);
      PsetIndex((prev) => (maxIndex === prev ? 0 : prev + 1));
    }
  };
  const PopularDecreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    if (upcomingData) {
      const totalMovies = upcomingData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(true);
      PsetIndex((prev) => (0 === prev ? maxIndex : prev - 1));
    }
  };
  const TopRatedIncreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    if (topRatedData) {
      const totalMovies = topRatedData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(false);
      TsetIndex((prev) => (maxIndex === prev ? 0 : prev + 1));
    }
  };
  const TopRatedDecreaseIndex = () => {
    if (leaving) return;
    toggleLeaving();
    if (topRatedData) {
      const totalMovies = topRatedData.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset) - 1;
      setBack(true);
      TsetIndex((prev) => (0 === prev ? maxIndex : prev - 1));
    }
  };

  const onBoxClicked = (movieId: number) => {
    history.push(`/tv/${movieId}`);
  };

  return (
    <Wrapper>
      {isLoading && upcomingLoading && topRatedIsLoading ? (
        <Loader>loading</Loader>
      ) : (
        <>
          <Banner bgImage={makeImagePath(data?.results[0].backdrop_path || "")}>
            <Title>{data ? data.results[0].name : null}</Title>
            <Overview>{data?.results[0].overview}</Overview>
          </Banner>
          <SliderBox style={{ marginTop: "-80px" }}>
            <Slider>
              <BundleName>On the Air</BundleName>
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
                          <h4>{movie.name}</h4>
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

          <SliderBox>
            <Slider>
              <BundleName>Top Rated</BundleName>
              <ButtonL onClick={TopRatedDecreaseIndex}>
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
                  key={Tindex}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {topRatedData?.results
                    .slice(1)
                    .slice(offset * Tindex, offset * Tindex + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + "t"}
                        variants={boxVariants}
                        key={movie.id + "t"}
                        bgImage={makeImagePath(
                          movie.backdrop_path || movie.poster_path,
                          "w500"
                        )}
                        whileHover="hover"
                        initial="normal"
                        onClick={() => onBoxClicked(movie.id)}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <ButtonR onClick={TopRatedIncreaseIndex}>
                <i className="fa-solid fa-chevron-right"></i>
              </ButtonR>
            </Slider>
          </SliderBox>
          <SliderBox>
            <Slider>
              <BundleName>Upcoming</BundleName>
              <ButtonL onClick={PopularDecreaseIndex}>
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
                  key={Pindex}
                  transition={{ type: "tween", duration: 1 }}
                >
                  {upcomingData?.results
                    .slice(1)
                    .slice(offset * Pindex, offset * Pindex + offset)
                    .map((movie) => (
                      <Box
                        layoutId={movie.id + "p"}
                        variants={boxVariants}
                        key={movie.id + "p"}
                        bgImage={makeImagePath(
                          movie.backdrop_path || movie.poster_path,
                          "w500"
                        )}
                        whileHover="hover"
                        initial="normal"
                        onClick={() => onBoxClicked(movie.id)}
                      >
                        <Info variants={infoVariants}>
                          <h4>{movie.name}</h4>
                        </Info>
                      </Box>
                    ))}
                </Row>
              </AnimatePresence>
              <ButtonR onClick={PopularIncreaseIndex}>
                <i className="fa-solid fa-chevron-right"></i>
              </ButtonR>
            </Slider>
          </SliderBox>
          <AnimatePresence>
            {bigMovieMatch ? (
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
                      layoutId={bigMovieMatch.params.movieId + "n"}
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
                      <BigTitle>{clickedMovie.name}</BigTitle>
                      <BigOverview>{clickedMovie.overview}</BigOverview>
                    </BigMovie>
                  </>
                )}
                {PclickedMovie && (
                  <>
                    <BigMovie
                      style={{ top: scrollY.get() + 100 }}
                      layoutId={bigMovieMatch.params.movieId + "p"}
                    >
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            PclickedMovie.backdrop_path ||
                              PclickedMovie.poster_path,
                            "w500"
                          )})`,
                        }}
                      ></BigCover>
                      <BigTitle>{PclickedMovie.name}</BigTitle>
                      <BigOverview>{PclickedMovie.overview}</BigOverview>
                    </BigMovie>
                  </>
                )}
                {TclickedMovie && (
                  <>
                    <BigMovie
                      style={{ top: scrollY.get() + 100 }}
                      layoutId={bigMovieMatch.params.movieId + "t"}
                    >
                      <BigCover
                        style={{
                          backgroundImage: `linear-gradient(to top, black, transparent), url(${makeImagePath(
                            TclickedMovie.backdrop_path ||
                              TclickedMovie.poster_path,
                            "w500"
                          )})`,
                        }}
                      ></BigCover>
                      <BigTitle>{TclickedMovie.name}</BigTitle>
                      <BigOverview>{TclickedMovie.overview}</BigOverview>
                    </BigMovie>
                  </>
                )}
              </>
            ) : null}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}
export default Tv;
