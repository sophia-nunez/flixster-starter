import "../styles/MovieCard.css";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

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
        src={`https://image.tmdb.org/t/p/w300${poster}`}
      ></img>
      <div className="movie-details">
        <h2>{title}</h2>
        <p>Rating: {rating.toFixed(2)}</p>
        {movieType === "now-playing" && (
          <>
            <button className="status-container" onClick={toggleLiked}>
              {liked ? <GoHeartFill /> : <GoHeart />}
            </button>
            <button className="status-container" onClick={toggleWatched}>
              {watched ? <MdCheckBox /> : <MdCheckBoxOutlineBlank />}
            </button>
          </>
        )}
      </div>
    </article>
  );
};

export default MovieCard;
