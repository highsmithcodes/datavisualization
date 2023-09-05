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
                .attr("height", height)

            // Add the x-axis.
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x));

            svg.append("text")
                .attr("class", "x-axis-label")
                .attr("x", width / 2)  // Position at the center of the chart
                .attr("y", height - 10) // Adjust the 'y' position to your preference
                .style("text-anchor", "middle")
                .style("font-size", "12px") 
                .text("Year"); // Replace with your desired label text

            svg.append("text")
                .attr("class", "y-axis-label")
                .attr("transform", "rotate(-90)") // Rotate the label vertically
                .attr("x", -height / 2) // Position it on the left side of the chart
                .attr("y", 9) // Adjust the 'y' position to your preference
                .style("text-anchor", "middle") // Center-align the text
                .style("font-size", "12px") 
                .text("Stock Market Closing Value"); // Replace with your desired label text


            
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y)
                    .tickSize(-width + marginLeft + marginRight) // This controls the length of the grid lines
                    .tickFormat("") // This removes the tick labels, you can provide a function to format them
                );
        
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height - marginBottom})`)
                .call(d3.axisBottom(x)
                    .tickSize(-height + marginTop + marginBottom) // This controls the length of the grid lines
                    .tickFormat("") // This removes the tick labels, you can provide a function to format them
                );
            
            // Add the y-axis.
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${marginLeft},0)`)
                .call(d3.axisLeft(y));

            // Create line generator for each crop
            const line = d3.line()
                .x(d => x(d.date))
                .y(d => y(d.close))
                .curve(d3.curveBasis);
            
            // Style the y-axis grid lines
            svg.selectAll(".y-axis line")
                .style("stroke-opacity", 0.2); // Adjust opacity as needed

            // Style the x-axis grid lines
            svg.selectAll(".x-axis line")
                .style("stroke-opacity", 0.2); // Adjust opacity as needed

            // Style the outer chart lines (bounding lines)
            svg.selectAll(".x-axis path")
                .style("stroke-opacity", 0.2); // Adjust opacity as needed

            svg.selectAll(".y-axis path")
                .style("stroke-opacity", 0.2); // Adjust opacity as needed

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
                .attr("transform", `translate(${width - marginRight - 110}, 30)`) // Adjust the translation as needed
                .attr("id", "legend");

            const legendEntries = Object.keys(crops);

            // Create a function to show/hide the tooltip
            const showTooltip = (event, data) => {
                const tooltip = document.getElementById("tooltip");
                const tooltipDate = document.getElementById("tooltip-date");
                const tooltipClose = document.getElementById("tooltip-close");
          
                // Position the tooltip near the mouse pointer
                tooltip.style.left = `${event.pageX}px`;
                tooltip.style.top = `${event.pageY - 30}px`; // Offset for better positioning
          
                // Populate the tooltip with data
                tooltipDate.textContent = `Date: ${data.date}`;
                tooltipClose.textContent = `Close: ${data.close}`;
          
                // Show the tooltip
                tooltip.style.display = "block";
              };
          
              const hideTooltip = () => {
                const tooltip = document.getElementById("tooltip");
                tooltip.style.display = "none";
              };
          
              // Add event listeners to data points for hover interactions
              svg.selectAll(".line")
                  .on("mouseover", (event, d) => showTooltip(event, d))
                  .on("mouseout", () => hideTooltip());

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
        <div className='container'>
            <h1>Closing Value for Crops</h1>
            <div className='sub-title'>Agricultural Commodities Futures Data</div>
            <ul class="chart-details">
                <li>Chart Type: Line Chart</li>
                <li>Data Source: <a href="https://www.kaggle.com/datasets/guillemservera/agricultural-futures?resource=download" target="_blank">Agricultural Futures</a></li>
            </ul>
            
            <div id="tooltip" style={{ display: "none" }}>
            <span id="tooltip-date"></span><br />
            <span id="tooltip-close"></span>
            </div>
            <div id="chart-container"></div>
        </div>
    );
}

export default Page1;
