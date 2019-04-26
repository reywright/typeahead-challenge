We’ve built a simple Autocomplete/Typeahead component in vanilla JavaScript
(compiled with Babel 7) that lets you type in a query and shows a list of
matching results in a dropdown, just like how Google's search box works.


Currently, the component can only query against a static data array and only
works with mouse clicks. Your task is to:

1. Enhance the component so that it also accepts an HTTP endpoint as data source.

    For example, if you wire up the component to
    `https://api.github.com/search/users?q={query}&per_page=${numOfResults}`,
    and if you type `foo` in the input, the component dropdown should show
    Github users with logins that start with `foo`. When you select a user from
    the results, `item` in the `onSelect(item)` callback should be the selected
    Github user's id.

    (The enhanced component only needs to work with either a data array or a
    HTTP source, not both.)

2. Implement keyboard shortcuts to navigate the results dropdown using up/down
   arrow keys and to select a result using the Enter key.


- The component should be reusable. It should be possible to have multiple
  instances of the component on the same page.
- The "States" example that uses a data array should continue to work.
- The component should accept any HTTP endpoint, not just the
  `https://api.github.com/users` example above.
- Your component should work correctly in Chrome, don’t worry about
  cross-browser compatibility.
- You can use small DOM helpers like jQuery or utilities from Lodash, but not
  larger libraries/frameworks like React, Angular or Vue.js
- You _can_ modify all parts of the existing code, but you don't _need_ to do
  that to provide a great solution.
- Document your component in `SOLUTION.md`.