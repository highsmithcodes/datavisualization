import React, { useEffect } from 'react';
import * as d3 from 'd3';
import { transition } from 'd3';
import data from '../data/Population_By_Country_2020_data.csv';

function Page2() {
    const fetchData = async () => {
        // Load data from the CSV file
        const populationData = await d3.csv(data, (d) => ({
            country: d['Country (or dependency)'],
            population: +d['Population (2020)'],
          }));

        // Sort the data by population in descending order
        populationData.sort((a, b) => b.population - a.population);
        
        // Select the top 20 songs
        const top20Countries = populationData.slice(0, 20);

        // Define chart dimensions and margins
        const margin = { top: 20, right: 30, bottom: 70, left: 200 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
        
        // Create the SVG container
        const svg = d3.select('#chart-container')
            .append('svg')
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Define the x and y scales
        const x = d3
            .scaleLinear()
            .domain([0, d3.max(top20Countries, (d) => d.population)])
            .range([0, width]);

        const y = d3
            .scaleBand()
            .domain(top20Countries.map((d) => d.country))
            .range([0, height])
            .padding(0.1);

        // Create and append the bars
        svg.selectAll('.bar')
            .data(top20Countries)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', 0)
            .attr('width', 0) // Start with a width of 0 for the animation
            .attr('y', (d) => y(d.country))
            .attr('height', y.bandwidth())
            .style('fill', 'steelblue')
            .transition() // Add a smooth transition
            .duration(1000) // Set the animation duration in milliseconds
            .attr('width', (d) => x(d.population));

        // Add x-axis
        svg.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(10).tickFormat(d3.format('.2s')))
            .append('text')
            .attr('x', width / 2)
            .attr('y', 40)
            .attr('text-anchor', 'middle')
            .text('Population (2020)');

        // Add y-axis
        svg.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(y));

        // Add chart title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', -margin.top / 2)
            .attr('text-anchor', 'middle')
    };
    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className='container'>
            <h1>Top 20 Countries by Population 2020</h1>
            <div className='sub-title'>Countries in the world by population - 2020</div>
            <ul class="chart-details">
                <li>Chart Type: Bar Chart</li>
                <li>Data Source: <a href="https://www.kaggle.com/tanuprabhu/population-by-country-2020" target="_blank">Population by Country</a></li>
            </ul>
            <div id="chart-container"></div>
        </div>
    );
}

export default Page2;
