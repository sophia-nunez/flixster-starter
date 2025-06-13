import "../styles/MovieCard.css";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";
import { FcRating } from "react-icons/fc";
import noPoster from "../assets/images/no-poster.png";

const MovieCard = ({
  id,
  title,
  poster,
  rating,
  liked,
  watched,
  onClick,
  likeMovie,
  watchMovie,
  movieType,
}) => {
  // toggle liked and watched toggles the movie prop and adds/removes from corresponding array
  const toggleLiked = (event) => {
    event.stopPropagation();
    likeMovie(id, liked);
  };

  const toggleWatched = (event) => {
    event.stopPropagation();
    watchMovie(id, watched);
  };

  return (
    <article className="movie-card" onClick={() => onClick(id)}>
      <img
        className="movie-poster"
        src={
          poster === "" ? noPoster : `https://image.tmdb.org/t/p/w300${poster}`
        }
        alt={`Movie poster for ${title}`}
      ></img>
      <div className="movie-details">
        <h2>{title}</h2>
        <p className="rating-container">
          <FcRating /> {rating.toFixed(2)}
        </p>
        {movieType === "now-playing" && (
          <div className="status-icons">
            <button className="status-container" onClick={toggleLiked}>
              {liked ? (
                <p>
                  <GoHeartFill /> Liked
                </p>
              ) : (
                <p>
                  <GoHeart /> Like
                </p>
              )}
            </button>
            <button className="status-container" onClick={toggleWatched}>
              {watched ? (
                <p>
                  <MdCheckBox /> Watched
                </p>
              ) : (
                <p>
                  <MdCheckBoxOutlineBlank /> Watch
                </p>
              )}
            </button>
          </div>
        )}
      </div>
    </article>
  );
};

export default MovieCard;
