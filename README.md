# tmdb_top_100

## Usage

Clone the repo, cd into the folder, and:

```bash
npm install
npm run serve
```

### Notes

#### App Structure

The app is structured something like this:

App.vue

  |___MainComponent.vue

            |____MoviesList.vue

            |____MovieDetails.vue

            |____Favourites.vue

All components are hooked up to VueX, where most state management takes place. Routing is done with Vue Router.

src/modules/movies.js is where you'd want to go to get a good idea of the VueX store.

The store contains data pertinent to the API calls to TMDB, and the appropriate getters and setters. For example, the amount of results we want,
or the language we want our results in.

The most important methods are ```fetchMovies``` and ```setSelectedMovie```.

```fetchMovies``` makes the calls to the /discover API and is called every time we hit refresh or we change the search settings, as well as upon initial page load.

```setSelectedMovie``` is called when a user clicks on a specific movie for more details. It grabs more detailed information from the /movie API, which then is displayed by the MovieDetails component.

The searching logic can be found in MainComponent and is a simple ES6 ```filter``` function done on the list of movies in the store, which then gets passed down to MoviesList as props.

I used ESLint with Airbnb style as requested, but there were a couple of rules that I found a little annoying in VueX, so I turned those off, namely no-shadow, no-return-reassign, and no-param-reassign. You can see my config in package.json.

#### Potential additions that I may have added, given more time

* Add an option when no search results are found to search the whole TMDB database (rather than just the movies that are in state right now). If the user chooses this option, we call the /search/movie API with the search term and display the results.

* Add options to filter search by genre and year.

* Add animations, transitions etc. Generally make the interface a bit prettier. Change default Vue logo to something else.

* Add an option to compare movies that are on the shortlist, then display all of their information side by side in a table.

* Recommend movies with a call to the /similar API and display them alongside the selected movie in MovieDetails.