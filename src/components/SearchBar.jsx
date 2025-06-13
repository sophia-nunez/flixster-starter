import { useState, useEffect } from "react";
import "../styles/SearchBar.css";
import { MdClear } from "react-icons/md";

import { searchData, parseMovieData } from "../utils/utils";

const SearchBar = ({
  setDisplayedList,
  loadList,
  sortMovies,
  movieType,
  setMorePages,
  setDropdownValue,
  dropdownValue,
  setIsLoading,
}) => {
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    // reset select when search is started
    setDropdownValue("default");
  }, [searchInput]);

  useEffect(() => {
    if (dropdownValue) {
      sortMovies(dropdownValue);
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
    setIsLoading(true);
    searchForMovie();
    setIsLoading(false);
  };

  // fetches query of searchInput and sets display
  async function searchForMovie() {
    const data = await searchData(searchInput);
    const movies = await parseMovieData(data);

    setDisplayedList(movies);
    setMorePages(false);
  }

  // when new option is selected, updates sort value
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
    loadList();
  };

  return (
    <section className="search-bar">
      {movieType === "now-playing" && (
        <div className="search-container">
          <div className="search-bar-container">
            <label for="search-bar" />
            <input
              type="text"
              name="search-bar"
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
        </div>
      )}
      <div className="sort-container">
        <label for="sort-by" />
        <select
          id="sort-by"
          name="sort-by"
          value={dropdownValue}
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
