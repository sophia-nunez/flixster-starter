import { useState, useEffect } from "react";
import "../styles/SearchBar.css";
import { MdClear } from "react-icons/md";

import { searchData, parseMovieData } from "../utils/utils";

const SearchBar = (props) => {
  const [searchInput, setSearchInput] = useState("");
  const [dropdownValue, setDropdownValue] = useState("");

  useEffect(() => {
    setDropdownValue("default");
  }, [searchInput]);

  useEffect(() => {
    if (dropdownValue) {
      props.setFilter(dropdownValue);
      props.sortMovies(dropdownValue);
    }
  }, [dropdownValue]);

  const updateSearch = (event) => {
    const { value } = event.target;

    setSearchInput(value);
  };

  // checks if search has text before updating display
  const handleSearch = (event) => {
    if (searchInput === "") {
      handleClear();
    }

    searchForMovie();
  };

  // fetches query of searchInput and sets display
  async function searchForMovie() {
    const data = await searchData(searchInput);
    const movies = await parseMovieData(data);

    props.setDisplayedList(movies);
    props.setMorePages(false);
  }

  const handleChange = (event) => {
    const { value } = event.target;
    setDropdownValue(value);
  };

  const enterSearch = (event) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  // loads previous displayedList (not searched) when search is cleared
  const handleClear = () => {
    setSearchInput("");
    props.loadList();
  };

  return (
    <section className="search-bar">
      {props.movieType === "now-playing" && <div className="search-container">
        <div className="search-bar-container">
          <input
            type="text"
            id="search-bar"
            placeholder="Find a movie..."
            value={searchInput}
            onChange={updateSearch}
            onKeyUp={enterSearch}
          ></input>
          <div className="clear-x" onClick={handleClear}>
            <MdClear />
          </div>
        </div>
        <button type="submit" onClick={handleSearch}>
          Search
        </button>
      </div>}
      <div className="sort-container">
        <select
          id="sort-by"
          name="sort-by"
          defaultValue="default"
          onChange={handleChange}
        >
          <option value="default" disabled={true}>
            Select option
          </option>
          <option value="alphabetical">Title (A-Z)</option>
          <option value="release">Most recent</option>
          <option value="rating">Highly Rated</option>
        </select>
      </div>
    </section>
  );
};

export default SearchBar;
