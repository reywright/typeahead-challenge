
  // Copied from here: https://davidwalsh.name/javascript-debounce-function
 function debounce(func, wait, immediate) {
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };

export default class Autocomplete {
  constructor(rootEl, options = {}) {
    this.rootEl = rootEl;
    this.options = {
      numOfResults: 10,
      data: [],
      ...options,
    };

    this.requestDebounced = debounce(function(query) {
      return this.request(query)
    }, this.options.endpointDebounce)

    this.init();

  }

  /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query, data) {
    if (!query) return [];

    // Filter for matching strings
    return data.filter((item) => {
      return item.text.toLowerCase().includes(query.toLowerCase());
    });
  }

  onQueryChange(e) {
    const query = e.target.value
    // Get data for the dropdown
    if (this.options.endpoint && query){
      this.requestDebounced(query)
    } else {
      let results = this.getResults(query, this.options.data);
      results = results.slice(0, this.options.numOfResults);
      this.updateDropdown(results);
    }

  }

  updateDropdown(results) {
    this.listEl.innerHTML = '';
    this.listEl.appendChild(this.createResultsEl(results));
  }

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();
    results.forEach((result) => {
      const el = document.createElement('li');
      el.classList.add('result');
      el.tabIndex = "-1" // allows elements to be focusable
      el.textContent = result.text;
      el.setAttribute('data-id', result.value)

      // Pass the value to the onSelect callback
      el.addEventListener('click', () => {
        this.tryToSelect(result.value)
      });

      fragment.appendChild(el);
    });
    return fragment;
  }

  createQueryInputEl() {
    const inputEl = document.createElement('input');
    inputEl.setAttribute('type', 'search');
    inputEl.setAttribute('name', 'query');
    inputEl.setAttribute('autocomplete', 'off');

    inputEl.addEventListener('input', this.onQueryChange.bind(this));

    return inputEl;
  }

  navigation(){
    this.rootEl.addEventListener('keydown', this.handleKeydown.bind(this))
  }

  focusTo(element){
    // We're now free to attempt to focus.
    if (element) element.focus()
  }

  tryToSelect(text){
    const { onSelect } = this.options;
    if (typeof onSelect === 'function') { 
      onSelect(text.toString());
    }
  }

  handleKeydown(e){

    // I'm not particularly sure about the performance of
    // document.activeElement, but if it's impactful,
    // we can cache the element we focus in both keydown
    // and onclick? Might be an over optimization at this
    // point.

    const activeEl = document.activeElement

    switch(e.key){

      case "ArrowDown": 
        if (activeEl.tagName === "INPUT"){
          this.focusTo(activeEl.nextSibling.firstChild)
        } else {
         this.focusTo(activeEl.nextSibling)
        }
       break;

      case "ArrowUp":
        if (activeEl.tagName === "INPUT") break;
        if (!activeEl.previousSibling){
          this.focusTo(activeEl.parentElement.previousSibling) 
        } else {
          this.focusTo(activeEl.previousSibling)
        }
        break;

      case "Enter":
        if (activeEl.tagName === "INPUT") break;
        this.tryToSelect(e.target.dataset.id)
        break;
    }

  }

  request(query){

    // I don't think async / await works in here, so I'll use
    // normal promises


    const url = this.options.endpoint
    .replace("{query}", query)
    .replace("{numOfResults}", this.options.numOfResults)

    fetch(url).then(data => {
      return data.json() 
    }).then(json => {
      const newItems = json[this.options.endpointArrayKey].map(item => ({
        text: item.login,
        value: item.id        
      }))
      this.updateDropdown(newItems);
    })

  }

  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl)

    // Build results dropdown
    this.listEl = document.createElement('ul');
    this.listEl.classList.add('results');
    this.rootEl.appendChild(this.listEl);
    this.navigation()
  }
}
