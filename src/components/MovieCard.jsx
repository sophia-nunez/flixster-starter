import '../styles/MovieCard.css'

const MovieCard = ({id, title, poster, rating, onClick}) => {

    return (
        <article className="movie-card" onClick={() => onClick(id)}>
            <img className="movie-poster" src={`https://image.tmdb.org/t/p/w300${poster}`}></img>
            <div className="movie-details">
                <h2>{title}</h2>
                <p>Rating: {rating.toFixed(2)}</p>
            </div>
        </article>
    )
}

export default MovieCard;