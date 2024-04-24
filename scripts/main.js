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
// 	import('../assets/data/output.json'),
// ]).then(([data]) => {

// init();

// });

// data = './assets/data/merged_data_1yr.json'

fetch('https://raw.githubusercontent.com/naterattner/data-culture-society-final/master/assets/data/output_no_dir.json')
// fetch('../assets/data/output_no_dir.json')
    .then(response => response.json())
    .then(data => {
        // Process the JSON data
        // console.log(data);
		init(data);
    })
    .catch(error => {
        console.error('Error fetching JSON:', error);
    });

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init(data) {

	// The force simulation mutates links and nodes, so create a copy
	// so that re-evaluating this cell produces the same result.
	const links = data.links.map(d => ({...d}));
	const nodes = data.nodes.map(d => ({...d}));

	// Create a simulation with several forces.
	const simulation = d3.forceSimulation(nodes)
	.force("link", d3.forceLink(links).id(d => d.film))
	.force("charge", d3.forceManyBody().strength(-50))
	.force("x", d3.forceX())
	.force("y", d3.forceY());

	// + CREATE SVG ELEMENT
	svg = d3.select("#viz")
		.append("svg")
		.attr("width", width)
		.attr("height", height)
		.attr("viewBox", [-width / 2, -height / 2, width, height])
		.attr("style", "max-width: 100%; height: auto;")
		// .attr("style", "background-color:grey")


	// Add a line for each link, and a circle for each node.
	const link = svg.append("g")
	.attr("stroke", "#999")
	.attr("stroke-opacity", 0.6)
	.selectAll("line")
	.data(links)
	.join("line")
		// .attr("stroke-width", d => Math.sqrt(d.value));
		.attr("stroke-width", d => (d.value*1.5));

	const node = svg.append("g")
		.attr("stroke", "#fff")
		.attr("stroke-width", 1.5)
	  .selectAll("circle")
	  .data(nodes)
	  .join("circle")
		.attr("r", 5)
		.attr("fill", '#0096C7');

	node.append("title")
		.text(d => d.film);

	 // Add a drag behavior.
	 node.call(d3.drag()
	 .on("start", dragstarted)
	 .on("drag", dragged)
	 .on("end", dragended));

	 // Set the position attributes of links and nodes each time the simulation ticks.
	 simulation.on("tick", () => {
		link
			.attr("x1", d => d.source.x)
			.attr("y1", d => d.source.y)
			.attr("x2", d => d.target.x)
			.attr("y2", d => d.target.y);
	
		node
			.attr("cx", d => d.x)
			.attr("cy", d => d.y);
	  });

	// Reheat the simulation when drag starts, and fix the subject position.
	function dragstarted(event) {
		if (!event.active) simulation.alphaTarget(0.3).restart();
		event.subject.fx = event.subject.x;
		event.subject.fy = event.subject.y;
	  }
	
	  // Update the subject (dragged node) position during drag.
	  function dragged(event) {
		event.subject.fx = event.x;
		event.subject.fy = event.y;
	  }
	
	  // Restore the target alpha so the simulation cools after dragging ends.
	  // Unfix the subject position now that it’s no longer being dragged.
	  function dragended(event) {
		if (!event.active) simulation.alphaTarget(0);
		event.subject.fx = null;
		event.subject.fy = null;
	  }
	
	  // When this cell is re-run, stop the previous simulation. (This doesn’t
	  // really matter since the target alpha is zero and the simulation will
	  // stop naturally, but it’s a good practice.)
	//   invalidation.then(() => simulation.stop());

	  // Add tooltips on mouseover
	  
	  // Create tooltip element
	  const tooltip = d3.select(".tooltip") 
	  const tooltipFilm = d3.select(".tooltip-film")
	  const tooltipDirector = d3.select(".tooltip-director")
	//   .append("div")
	//   .html("tooltip" )
	//   .attr("class", "tooltip");

	  node.on("mouseover", function(event, d) {

		// Highlight node
		d3.select(this).attr("fill", "#000435");

		// Update tooltip text
		tooltipFilm.html(d.film);
		// tooltipDirector.html("Directed by " + d.director);
	  })
	  .on("mouseout", function() {
		// Hide tooltip
		tooltipFilm.html("");
		tooltipDirector.html("");

		d3.select(this).attr("fill", "#0096C7");
	  });
	

}

