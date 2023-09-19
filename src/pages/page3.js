import React, { useEffect } from 'react';
import * as d3 from 'd3';
import states from '../data/State_Coordinates.csv'

function Page3() {
  const fetchData = async () => {
    const width = 800; // Specify the width of your SVG container
    const height = 600; // Specify the height of your SVG container

    // Load your state coordinates data
    const stateCoordinatesData = await d3.json(states);
    console.log(stateCoordinatesData)

    // Create an SVG container
    const svg = d3
      .select('#map-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // Create a group for the map
    const mapGroup = svg.append('g');

    // Create a Mercator projection
    const projection = d3.geoMercator()
      .fitSize([width, height], stateCoordinatesData);

    mapGroup
      .selectAll('.state')
      .data(stateCoordinatesData.features)
      .enter()
      .append('path')
      .attr('class', 'state')
      .attr('d', d3.geoPath().projection(projection))
      .style('fill', 'lightgray')
      .style('stroke', 'white');
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className='container'>
      <h1>US Map</h1>
      <div className='sub-title'>Map of US states</div>
      <div id="map-container"></div>
    </div>
  );
}

export default Page3;
