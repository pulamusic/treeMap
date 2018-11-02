const width=1000;
const height=700;
let data;

dataset={
	kickstarter:{url:'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json',title:'Kickstarter Pledges',description:'Kickstarter Funding Data'},
	movies:{url:'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json',title:'Movie Sales',description: 'Movie Sales Data'},
	videogames:{url:'https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json',title:'Video Game Sales',description:'Video Game Sales Data'}}

function populate(set){

	document.getElementById('title').innerHTML=dataset[set].title
  document.getElementById('description').innerHTML=dataset[set].description

req=new XMLHttpRequest();
req.open("GET",dataset[set].url,true)
req.send()
req.onload=function(){
  let data=JSON.parse(req.responseText)
	console.log(data)
	drawD3(data)
}

function drawD3(data){
const body=d3.select('body')

const tooltip = body.append("div")
  .attr("class", "tooltip")
  .attr("id", "tooltip")
  .style("opacity", 0);

const svg = d3.select("svg")
      	    .attr("width",width)
            .attr("height",height);



const fader = function(color) { return d3.interpolateRgb(color, "#fff")(0.2); }

    color = d3.scaleOrdinal(d3.schemeCategory20.map(fader)),
    format = d3.format(",d");

const treemap = d3.treemap()
    .size([width, height])
    .paddingInner(1);


  const root = d3.hierarchy(data)
      					 .eachBefore(function(d) { d.data.id = (d.parent ? d.parent.data.id + "." : "") + d.data.name; })
      					 .sum(d=>d.value)
      					 .sort(function(a, b) { return b.height - a.height || b.value - a.value; });

  treemap(root);

  const cell = svg.selectAll("g")
    .data(root.leaves())
    .enter()
		.append("g")
    .attr("transform", function(d) { return "translate(" + d.x0 + "," + d.y0 + ")"; });

  cell.append("rect")
      .attr("id", function(d) { return d.data.id; })
			.attr('class','tile')
      .attr("width", function(d) { return d.x1 - d.x0; })
      .attr("height", function(d) { return d.y1 - d.y0; })
      .attr("fill", function(d) { return color(d.parent.data.id); })
			.attr('data-name',d=>d.data.name)
			.attr('data-category',d=>d.data.category )
			.attr('data-value',d=>d.data.value)
			.on("mousemove", function(d) {
        console.log("mouseover");
        tooltip.style("opacity", .9);
        tooltip.html(
          'Name: ' + d.data.name +
          '<br>Category: ' + d.data.category +
          '<br>Value: ' + d.data.value
        )
        .attr("data-value", d.data.value)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
        tooltip.style("opacity", 0);
      })


  cell.append("text")
      .attr("clip-path", function(d) { return "url(#clip-" + d.data.id + ")"; })
    .selectAll("tspan")
      .data(function(d) { return d.data.name.split(/(?=[A-Z][^A-Z])/g); })
    .enter().append("tspan")

      .attr("x", 4)
      .attr("y", function(d, i) { return 13 + i * 10; })
      .text(function(d) { return d; });

	var legend=d3.select('#legend')
							 .attr('width',width)

	var categories = root.leaves().map(function(nodes){
    return nodes.data.category;
  });
  categories = categories.filter(function(category, index, self){
    return self.indexOf(category)===index;
  })

  var legendWidth = +legend.attr("width");
  const LEGEND_OFFSET = 10;
  const LEGEND_RECT_SIZE = 15;
  const LEGEND_H_SPACING = 150;
  const LEGEND_V_SPACING = 10;
  const LEGEND_TEXT_X_OFFSET = 3;
  const LEGEND_TEXT_Y_OFFSET = -2;
  var legendElemsPerRow = Math.floor(legendWidth/LEGEND_H_SPACING);

  var legendElem = legend
    .append("g")
    .attr("transform", "translate(60," + LEGEND_OFFSET + ")")
    .selectAll("g")
    .data(categories)
    .enter().append("g")
    .attr("transform", function(d, i) {
      return 'translate(' +
      ((i%legendElemsPerRow)*LEGEND_H_SPACING) + ',' +
      ((Math.floor(i/legendElemsPerRow))*LEGEND_RECT_SIZE + (LEGEND_V_SPACING*(Math.floor(i/legendElemsPerRow)))) + ')';
    })

  legendElem.append("rect")
     .attr('width', LEGEND_RECT_SIZE)
     .attr('height', LEGEND_RECT_SIZE)
     .attr('class','legend-item')
     .attr('fill', function(d){
       return color(d);
     })

   legendElem.append("text")
     .attr('x', LEGEND_RECT_SIZE + LEGEND_TEXT_X_OFFSET)
     .attr('y', LEGEND_RECT_SIZE + LEGEND_TEXT_Y_OFFSET)
     .text(function(d) { return d; });


}
}
//let set='movies'
populate('kickstarter')


// document.getElementById('kickstarter').addEventListener('click',()=>{
// 	populate('kickstarter')
// })
// document.getElementById('movies').addEventListener('click',()=>{
// 	populate('movies')
// })
// document.getElementById('videogames').addEventListener('click',()=>{
// 	populate('videogames')
// })
