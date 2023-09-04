import React, { useEffect } from 'react';
import * as d3 from 'd3';
import coffeeData from '../data/Coffee_data.csv';
import cocoaData from '../data/Cocoa_data.csv';
import cottonData from '../data/Cotton_data.csv';

function Page1() {
    useEffect(() => {
        const fetchData = async () => {
            // Load data for coffee, cocoa, and cotton
            const coffee = await d3.csv(coffeeData);
            const cocoa = await d3.csv(cocoaData);
            const cotton = await d3.csv(cottonData);

            // Create an object to store crop information
            const crops = {
                Coffee: {
                    data: coffee,
                    color: 'steelblue',
                },
                Cocoa: {
                    data: cocoa,
                    color: 'orange',
                },
                Cotton: {
                    data: cotton,
                    color: 'green',
                },
            };

            // Combine data from the three datasets
            const combinedData = [];

            // Iterate through each crop and assign data and labels
            Object.keys(crops).forEach(cropName => {
                const crop = crops[cropName];
                const parseDate = d3.timeParse('%Y-%m-%d');
                crop.data.forEach(d => {
                    d.date = parseDate(d.date);
                    d.close = +d.close;
                    d.crop = cropName;
                });
                combinedData.push(...crop.data);
            });

            // Declare the chart dimensions and margins.
            const width = 800;
            const height = 400;
            const marginTop = 20;
            const marginRight = 20;
            const marginBottom = 50; // Increased to accommodate the legend
            const marginLeft = 50;

            // Create the x (horizontal position) scale.
            const x = d3.scaleTime()
                .domain([d3.min(combinedData, d => d.date), d3.max(combinedData, d => d.date)])
                .range([marginLeft, width - marginRight]);

            // Create the y (vertical position) scale.
            const y = d3.scaleLinear()
                .domain([0, d3.max(combinedData, d => d.close)])
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

            // Create line generator for each crop
            const line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.close));

            // Group the data by crop label
            const dataByCrop = d3.group(combinedData, d => d.crop);

            // Add a line for each crop
            dataByCrop.forEach((cropData, cropLabel) => {
                svg.append("path")
                    .datum(cropData)
                    .attr("class", "line")
                    .attr("fill", "none")
                    .attr("stroke", crops[cropLabel].color)
                    .attr("d", line);
            });

            // Create a legend
            const legend = svg.append("g")
                .attr("class", "legend")
                .attr("transform", `translate(${width - marginRight - 120},${marginTop})`);

            const legendEntries = Object.keys(crops);

            // Add colored rectangles and labels for each crop in the legend
            legend.selectAll(".legend-entry")
                .data(legendEntries)
                .enter().append("g")
                .attr("class", "legend-entry")
                .attr("transform", (d, i) => `translate(0,${i * 20})`)
                .each(function (d) {
                    const group = d3.select(this);
                    group.append("rect")
                        .attr("width", 15)
                        .attr("height", 15)
                        .attr("fill", crops[d].color);
                    group.append("text")
                        .attr("x", 20)
                        .attr("y", 10)
                        .attr("dy", "0.35em")
                        .text(d);
                });
        };

        fetchData();
    }, []);

    return (
        <>
            <h1>Line Chart for Crops</h1>
            <div id="chart-container"></div>
        </>
    );
}

export default Page1;
