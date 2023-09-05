import React, { useEffect } from 'react';
import * as d3 from 'd3';
import data from '../data/Song_data.csv';

function Page2() {
    useEffect(() => {
        const fetchData = async () => {
            // Load data from the CSV file
            const songData = await d3.csv(data);

            // Sort the data by popularity in descending order
            songData.sort((a, b) => b.popularity - a.popularity);

            // Select the top 20 songs
            const top20Songs = songData.slice(0, 20);

            // Define chart dimensions and margins
            const margin = { top: 20, right: 30, bottom: 70, left: 100 };
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
            const x = d3.scaleLinear()
                .domain([0, 100]) // Popularity scale from 0 to 100
                .range([0, width]);

            const y = d3.scaleBand()
                .domain(top20Songs.map(d => d.song))
                .range([0, height])
                .padding(0.1);

            // Create and append the bars
            svg.selectAll('.bar')
                .data(top20Songs)
                .enter()
                .append('rect')
                .attr('class', 'bar')
                .attr('x', 0)
                .attr('width', d => x(d.popularity))
                .attr('y', d => y(d.song))
                .attr('height', y.bandwidth())
                .style('fill', 'steelblue');

            // Add x-axis
            svg.append('g')
                .attr('class', 'x-axis')
                .attr('transform', `translate(0,${height})`)
                .call(d3.axisBottom(x).ticks(10)); // Show 10 ticks on x-axis

            // Add y-axis
            svg.append('g')
                .attr('class', 'y-axis')
                .call(d3.axisLeft(y));

            // Add chart title
            svg.append('text')
                .attr('x', width / 2)
                .attr('y', -margin.top / 2)
                .attr('text-anchor', 'middle')
                .text('Top 20 Songs by Popularity');
        };

        fetchData();
    }, []);

    return (
        <div className='container'>
            <h1>Top 20 Songs by Popularity</h1>
            <div id="chart-container"></div>
        </div>
    );
}

export default Page2;
