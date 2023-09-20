import React, { useEffect } from 'react';
import * as d3 from 'd3';
import map from '../data/us-states.geojson';
import data from '../data/Largest_Companies_data.csv';

function Page3() {
  useEffect(() => {
    const fetchData = async () => {
      const width = 800; // Specify the width of your SVG container
      const height = 600; // Specify the height of your SVG container

      // Load U.S. map GeoJSON data
      const usMapData = await d3.json(map); // Replace with your GeoJSON file

      const companyData = await d3.csv(data);

      // Create an SVG container
      const svg = d3
        .select('#chart-container')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

      // Create a group for the map
      const mapGroup = svg.append('g');

      // Create a projection for the map (e.g., Albers USA)
      const projection = d3.geoAlbersUsa().fitSize([width, height], usMapData);

      // Filter out features with invalid geometries
      const validFeatures = usMapData.features.filter((feature) => {
        return feature.geometry && feature.geometry.type === 'Polygon';
      });

      // Create paths for the U.S. states
      mapGroup
        .selectAll('.state')
        .data(validFeatures)
        .enter()
        .append('path')
        .attr('class', 'state')
        .attr('d', d3.geoPath().projection(projection))
        .style('fill', 'white')
        .style('stroke', 'black');

      // Group company data by state and calculate total employees per state
      const stateData = d3.rollup(
        companyData,
        (v) => d3.sum(v, (d) => parseInt(d.Employees.replace(/,/g, ''))), // Parse employee count as an integer
        (d) => d.Headquarters.split(', ')[1] // Extract state from headquarters
      );

      // Define bubble size scale based on employee count
      const bubbleSizeScale = d3.scaleSqrt()
        .domain([0, d3.max(stateData.values())]) // Max employees for scaling
        .range([0, 30]); // Adjust the range for desired bubble size

      // Create bubbles for each state based on employee count
      mapGroup
        .selectAll('.bubble')
        .data(validFeatures)
        .enter()
        .append('circle')
        .attr('class', 'bubble')
        .attr('cx', (d) => projection(d3.geoCentroid(d))[0])
        .attr('cy', (d) => projection(d3.geoCentroid(d))[1])
        .transition() // Add a transition for the bubble growth
        .duration(1000) // Duration of the transition in milliseconds
        .attr('r', (d) => {
          const stateName = d.properties.name;
          const employees = stateData.get(stateName) || 0;
          return bubbleSizeScale(employees);
        })
        .style('fill', 'blue') // Fill color for bubbles
        .style('opacity', 0.7); // Adjust opacity as needed
    };

    fetchData();
  }, []);

  return (
    <div className='container'>
      <h1>Most Employees of Large Revenue Companies in the U.S</h1>
      <div className='sub-title'>Top U.S. Companies by Revenue: Powerhouses Driving Economic Success</div>
      <ul class="chart-details">
          <li>Chart Type: Bubble Chart</li>
          <li>Data Source: <a href="https://www.kaggle.com/datasets/yaranathakur/largest-companies-in-the-united-states-by-revenue" target="_blank">Largest companies in the United States by revenue</a></li>
          <li>GeoJson Source: <a href="https://www.kaggle.com/datasets/pompelmo/usa-states-geojson" target="_blank">US States GeoJson</a></li>
      </ul>
      <div id='chart-container'></div>
    </div>
  );
}

export default Page3;
