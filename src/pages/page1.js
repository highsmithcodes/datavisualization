import React, { useEffect } from 'react';
import * as d3 from 'd3';

function Page1() {
    useEffect(() => {
        d3.csv('data/Coffee_data.csv').then(data => {
            // Parse the date and close values
            const parseDate = d3.timeParse('%Y-%m-%d');
            data.forEach(d => {
                d.date = parseDate(d.date);
                d.close = +d.close;
            });

            // Declare the chart dimensions and margins.
            const width = 800;
            const height = 400;
            const marginTop = 20;
            const marginRight = 20;
            const marginBottom = 30;
            const marginLeft = 50;

            // Create the x (horizontal position) scale.
            const x = d3.scaleTime()
                .domain(d3.extent(data, d => d.date))
                .range([marginLeft, width - marginRight]);

            // Create the y (vertical position) scale.
            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => d.close)])
                .nice()
                .range([height - marginBottom, marginTop]);

            // Create the SVG container.
            const svg = d3.select('#chart-container')
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            // Add the x-axis.
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x));

            // Add the y-axis.
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y));

            // Create area generator
            const area = d3.area()
                .x(d => x(d.date))
                .y0(height - marginBottom) // Bottom of the chart
                .y1(d => y(d.close));

            // Append the area path to the SVG
            svg.append("path")
                .datum(data)
                .attr("class", "area")
                .attr("fill", "steelblue")
                .attr("d", area);
        });
    }, []);

    return (
        <>
            <h1>Page1</h1>
            <div id="chart-container"></div>
        </>
    )
}

export default Page1;
