// Select DOM items
const menuBtn = document.querySelector('.menu-btn');
const menu = document.querySelector('.menu');
const menuNav = document.querySelector('.menu-nav');
const menuBranding = document.querySelector('.menu-branding');
const navItems = document.querySelectorAll('.nav-item');

// Set Inital State of Menu (default is false)
let showMenu = false;

menuBtn.addEventListener('click', toggleMenu);

function toggleMenu() {
  if (!showMenu) {
    menuBtn.classList.add('close');
    menu.classList.add('show');
    menuNav.classList.add('show');
    menuBranding.classList.add('show');
    navItems.forEach(item => item.classList.add('show'));

    // set menu state
    showMenu = true

  } else {
    menuBtn.classList.remove('close');
    menu.classList.remove('show');
    menuNav.classList.remove('show');
    menuBranding.classList.remove('show');
    navItems.forEach(item => item.classList.remove('show'));

    // set menu state
    showMenu = false

  }
}

//Create SVG element
var svg = d3.select("div#container")
.append("svg")
.attr("preserveAspectRatio", "xMidYMax meet")
.attr("viewBox", "0 0 1350 700")
.classed("svg-content", true);

//Define map projection
var projection = d3.geoMercator()																	.scale([240])
                    .translate([650,400]);
                

//Define path generator
var path = d3.geoPath()
         .projection(projection);

d3.json("https://unpkg.com/world-atlas@1/world/	110m.json", function(error, world) {
if (error) throw error;
  svg.selectAll("path")
  .data(topojson.feature(world , world.objects.countries).features)
  .enter().
  append("path")
  .attr("d", path)
  .style("opacity", 0.7)
  .style("fill", "black")

  //Load in agriculture data
  d3.csv("location_viz.csv", function(data) {
    
    svg.selectAll("circle")
        .raise()
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
          return projection([d.lon, d.lat])[0];
        })
        .attr("cy", function(d) {
          return projection([d.lon, d.lat])[1];
        })
        .attr("r", function(d) {
          return 15;})
        //size of circle being duration
//				.
        .style("fill", "aqua")
        .style("stroke", "white")
        .style("stroke-width", 0.5)
        .style("opacity", 0.7)

        .on("mouseover", function(p) {
           d3.select(this)
           .transition()
            .duration(500)
            .style("opacity", 1)
            .style("fill", "orange")
            .attr("r", function(d) {
              return parseInt(d.month) * 3 + 14;
            });
        
          //Get this bar's x/y values, then augment for the tooltip
          var div = d3.select("body").append("div")
          .attr("class", "tooltip")
          .style("display", "none");

          var xPosition = parseFloat(d3.event.pageX)-30 ;
          var yPosition = parseFloat(d3.event.pageY)-820 ;

          //location
          d3.select("#tooltip")
            .style("left", xPosition + "px")
            .style("top", yPosition + "px")						
            .select("#place")
            .text(p.place);

          //time
          if (p.month < 1) {
              d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")						
                .select("#time")
                .text("I spent less than a month here in the past 5 years.");
              } else if (p.month == 1) {
              d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")						
                .select("#time")
                .text("I spent approximately " + p.month + " month here in the past 5 years.");

            } else {
              d3.select("#tooltip")
                .style("left", xPosition + "px")
                .style("top", yPosition + "px")						
                .select("#time")
                .text("I spent approximately  " + p.month + " months here in the past 5 years.");
            };


   
          //Show the tooltip
          d3.select("#tooltip").classed("hidden", false);

        })




        .on("mouseout", function(d) {
          //Hide the tooltip
          d3.select("#tooltip").classed("hidden", true)

           d3.select(this)
             .transition()
            .duration(250)
            .style("fill", "aqua")
            .style("stroke", "white")
            .style("stroke-width", 0.5)
            .style("opacity", 0.7)
            .attr("r", function(d) {
              return 15;
            })	
            
         });
     
});
});

