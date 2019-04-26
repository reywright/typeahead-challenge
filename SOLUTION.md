# Solution Docs

<!-- Include documentation, additional setup instructions, notes etc. here -->

## CSS

For some reason the inputs were a bit weird out of the box. I added some
flexbox on body to fix it up a bit.

## Autocomplete API

High level: added the endpoint as asked, but also added a key option, and a debounce option.

- It's not particularly guaranteed that for another endpoint, that the array of users
will be contained on "items". So added an option for a key. I could potentially
make a way to go multiple levels deep in the future.
- Also added a way to pass in a debounce interval. This was a nice feature I thought I could
add, and then also realized halfway in that I needed this, as the github api 403's if you
aggressively start hitting it (which will happen if it's being fired on every keystroke)

## Error handling

I've opted to not really do too much regarding error handling, as I don't think the move
is to display the errors inside as dropdown content, and it would require me to evolve the UI,
and it sort of seems like while I have the ability to add that UI, that it's not sort of being
asked for.

## Keyboard navigation

- I opted to not use any libraries here, especially since this is super easy to do with
the chrome only requirement.
- The first important thing was for me to put tabindex=-1 on all the items, else the
browser cannot focus them, even if you directly run the focus method on them
- I found it easier to click on the siblings first, and start focusing between siblings,
which was easy enough: grab the current focused item, find the next / previous sibling,
and run the focus method on it.
- For the enter logic, I put data-attributes on the elements for the ids, and then sent that into
the onSelect function
- How I handled boundaries: 
  - Input doesn't have any items above it, so I broke out of the switch when an arrow up was
  encountered there
  - I also did a break when executing enter on input, so that it wouldn't try to "select"
  - arrow up on the topmost list item would go to the parent, and then the prev sibling to go
  the input
  - lastly, on the selector code, if the next / prev element was never found, I don't attempt
  to focus the element (which handles the last list item)
  - I could potentially add some acessibility stuff (in terms of aria) in the future.

## HTTP Endpoint

- So... the only tricky thing I ran into here, was the debounce code. Everything else was fairly
straightforward. If I had more time, I would have liked to promise-fy the debounce request, so
that I could assign the list in the same method that the states are getting assigned in.
- From there, pretty simple: If an endpoint exists, debounce the request, passing in the query. Once the request function fired, did some simple string manipulation to get the query, and the numOfRequests in here.
Then, used the endpointArrayKey to select from the right key, did a map to get the data in a proper shape,
and then added it to results.

## How I would add on in the future

I touched a bit on this in the other sections, but just to quickly go over some things that pop out as
things I would like more time to noodle on:

- Definitely would get async/await in here.
- Add more accessibility like features
- Build a better debounce, that has promise like features, so that I can do all that results assignment
in one co-located place
- A lot of logic in this component isn't necessarily associated with it, and could be more general purposed. 
Either start to build out more general usage DOM utilities, or find some battle tested ones already used.
- Test it

This was a pretty cool exercise idea! I didn't spend too much time on it, but hopefully the general premise
is there.
