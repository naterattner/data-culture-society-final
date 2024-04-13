// import * as d3 from '../node_modules/d3/dist/d3.min.js';
// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";


/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
	  height = window.innerHeight * 0.7,
	  heightBar = window.innerHeight * 0.95,
	  margin = { top: 20, bottom: 25, left: 23, right: 60 }, 
	  marginBar = { top: 20, bottom: 25, left: 32, right: 60 };

// these variables allow us to access anything we manipulate in init() but need access to in draw().
// All these variables are empty before we assign something to them.
let svg;
let xScale; 
let yScale;
let yAxis;
let xAxisGroup; 
let yAxisGroup;

// make an object with settings we can update in one place and call below
let parameters = {
	transitionDuration: 1250,
	xDomain: [1977, 2024],
	xTickValues: [1980, 1990, 2000, 2010, 2020],
	xTickLabels: ['1980', '\'90', '2000', '\'10', '\'20'],
};

/* APPLICATION STATE */
let state = {
	data: [],
	step: 0, // + YOUR FILTER SELECTION
	yAxisMetric: [], // The data we want to chart each slide
  };

/* LOAD DATA */
// + SET YOUR DATA PATH
// Promise.all([
// 	import('../data/final_quintiles_player_bins_with_overall.json'),
// ]).then(([data]) => {

// init();

// });


/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {

	console.log('init');
	
	// + CREATE SVG ELEMENT
	svg = d3.select("#viz")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [-width / 2, -height / 2, width, height])
		.attr("style", "max-width: 100%; height: auto;")
		.style("background-color", "lightblue");
	

}

init();