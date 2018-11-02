const kickstarter = d3.select("#kickstarter");
const movie = d3.select("#movie");
const game = d3.select("#game");
const data = [
  {
    url:
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/kickstarter-funding-data.json",
    text: ["Kickstarter pledges", "Top 100 most pledged kickstarter compaigns grouped by category"]
  },
  {
    url:
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/movie-data.json",
    text: ["Movie sales", "Top 100 highest grossing movies grouped by genre"]
  },
  {
    url:
      "https://cdn.rawgit.com/freeCodeCamp/testable-projects-fcc/a80ce8f9/src/data/tree_map/video-game-sales-data.json",
    text: ["Video games sales", "Top 100 most sold video games grouped by platform"]
  }
];
const w = 1000;
const h = 600;
const padding = 100;
const header = d3
  .select("body")
  .append("h1")
  .attr("id", "title");
const descr = d3
  .select("body")
  .append("p")
  .attr("id", "description");
const svg = d3
  .select("body")
  .append("svg")
  .attr("width", w)
  .attr("height", h + h);
const tool = d3
  .select("body")
  .append("div")
  .attr("id", "tooltip");
function json(data) {
  d3.json(data.url).then(function(json) {
    if (svg.selectAll("g")._groups[0].length > 0) {
      svg.selectAll("g").remove();
    }
    header.text(data.text[0]);
    descr.text(data.text[1]);
    var root = d3.hierarchy(json);
    var treemap = d3
      .treemap()
      .size([w, h])
      .padding(1);
    root = treemap(
      root
        .sum(function(d) {
          return d.value;
        })
        .sort(function(a, b) {
          return b.height - a.height || b.value - a.value;
        })
    ).leaves();
    let categories = [];
    root.map(val => {
      if (categories.indexOf(val.data.category) == -1) {
        categories.push(val.data.category);
      }
    });
    const colors = d3.scaleOrdinal(d3.schemePaired);
    const nodes = svg
      .selectAll("g")
      .data(root)
      .enter()
      .append("g")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`);
    nodes
      .append("rect")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.value)
      .style("fill", d => colors(d.data.category))
      .on("mouseover", function(d) {
        tool
          .style("display", "block")
          .attr("data-value", () => d.data.value)
          .style("top", event.pageY - 25 + "px")
          .style("left", event.pageX + 15 + "px")
          .html(
            `<span>${d.data.name}</span><br><span>${
              d.data.category
            }</span><br><span>${d.data.value}</span>`
          );
      })
      .on("mouseout", function(d) {
        tool.style("display", "none");
      });
    nodes
      .append("foreignObject")
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .html(d => d.data.name);

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${(w - 530) / 2},${h + padding / 2})`);
    legend
      .selectAll("rect")
      .data(categories)
      .enter()
      .append("rect")
      .attr("class", "legend-item")
      .attr("width", 30)
      .attr("height", 30)
      .attr("x", (d, i) => 250 * (i % 3))
      .attr("y", (d, i) => 70 * Math.floor(i / 3))
      .style("fill", d => colors(d));
    legend
      .selectAll("text")
      .data(categories)
      .enter()
      .append("text")
      .attr("x", (d, i) => 250 * (i % 3) + 40)
      .attr("y", (d, i) => 70 * Math.floor(i / 3) + 20)
      .text(d => d);
  });
}
document.body.onload = json(data[0]);
kickstarter.on("click", () => json(data[0]));
movie.on("click", () => json(data[1]));
game.on("click", () => json(data[2]));
