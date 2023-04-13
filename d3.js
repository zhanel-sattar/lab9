
const data = Array.from({ length: 100 }, () => [
    Math.random() * 500,
    Math.random() * 500,
  ]);
  
 
  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = 500 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;
  
  const xScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[0])])
    .range([0, width]);
  
  const yScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d[1])])
    .range([height, 0]);
  

  const xAxis = d3.axisBottom(xScale);
  const yAxis = d3.axisLeft(yScale);
  
  const svg = d3
    .select("#scatter-plot")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
  
  const xGridlines = d3.axisBottom(xScale).tickSize(-height).tickFormat("");
  const yGridlines = d3.axisLeft(yScale).tickSize(-width).tickFormat("");
  
  svg
    .append("g")
    .attr("class", "x-grid")
    .attr("transform", `translate(0, ${height})`)
    .call(xGridlines);
  
  svg.append("g").attr("class", "y-grid").call(yGridlines);
  
  svg
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height})`)
    .call(xAxis)
    .append("text")
    .attr("x", width / 2)
    .attr("y", 40)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .text("X-axis");
  
  svg
    .append("g")
    .attr("class", "y-axis")
    .call(yAxis)
    .append("text")
    .attr("x", -height / 2)
    .attr("y", -40)
    .attr("fill", "#000")
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Y-axis");
  
  svg
    .selectAll("circle")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(d[0]))
    .attr("cy", (d) => yScale(d[1]))
    .attr("r", 5)
    .attr("fill", "blue");
  

  d3.csv("titanic.csv").then((data) => {

    const ageDistribution = {
      "<10": 0,
      "10-20": 0,
      "20-30": 0,
      "30-40": 0,
      "40-50": 0,
      "50-60": 0,
      ">60": 0,
    };
  

    data.forEach((d) => {
      const age = +d.Age;
      if (age < 10) {
        ageDistribution["<10"]++;
      } else if (age >= 10 && age < 20) {
        ageDistribution["10-20"]++;
      } else if (age >= 20 && age < 30) {
        ageDistribution["20-30"]++;
      } else if (age >= 30 && age < 40) {
        ageDistribution["30-40"]++;
      } else if (age >= 40 && age < 50) {
        ageDistribution["40-50"]++;
      } else if (age >= 50 && age < 60) {
        ageDistribution["50-60"]++;
      } else {
        ageDistribution[">60"]++;
      }
    });
  
 
    const ageData = Object.keys(ageDistribution).map((key) => {
      return {
        ageRange: key,
        count: ageDistribution[key],
      };
    });
  

    const pie = d3.pie().value((d) => d.count);
  
  
    const arc = d3.arc().innerRadius(0).outerRadius(200);
  
    
    const pieSvg = d3.select("#pie-chart");
  
    
    const pieGroup = pieSvg.append("g").attr("transform", "translate(250,250)");
  

    const arcs = pieGroup
      .selectAll("path")
      .data(pie(ageData))
      .enter()
      .append("path")
      .attr("d", arc)
      .attr("fill", (d, i) => d3.schemeCategory10[i])
      .attr("stroke", "white")
      .style("stroke-width", "2px");
  

    pieGroup
      .selectAll("text")
      .data(pie(ageData))
      .enter()
      .append("text")
      .attr("transform", (d) => `translate(${arc.centroid(d)})`)
      .attr("text-anchor", "middle")
      .text((d) => `${d.data.ageRange}: ${d.data.count}`)
      .style("font-size", "9px");
  });
  