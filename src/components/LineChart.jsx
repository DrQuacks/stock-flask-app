import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useD3 from "../hooks/useD3";
import dateToDate from "../helpers/dateToDate";

const LineChart = ({chartData,plotPrefs}) => {
    console.log("chartData outside useD3 is: ",chartData)

    const data = chartData[0]
    const {semiLog,overlayRaw,overlayNew} = plotPrefs.current

    const colors = ["#619ED6", "#6BA547", "#F7D027", "#E48F1B", "#B77EA3", "#E64345", "#60CEED", "#9CF168", "#F7EA4A", "#FBC543", "#FFC9ED", "#E6696E"]

    const ref = useD3(
        (svg) => {
            const height = 700;
            const width = 1100;
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };

            
            //re-plotting, like for semilog, plots over original  plot
            //this is messy with colors, as the color looks like it changes

            svg.selectAll("#linePlot").remove()

            svg.select("#xAxis").remove()
            svg.select("#yAxis").remove()
            

            /*const xScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.xValue; })])
                .rangeRound([ 0, width - (margin.right + margin.left)]);*/

            const xDomain = d3.extent(chartData.reduce((acc,element) => {
                const thisExtent = d3.extent(element, function(d) { 
                    return dateToDate(d.date);
                })
                return [...acc,...thisExtent]
            },[]))
            
            const xScale = d3.scaleTime()
               /* .domain(d3.extent(data, function(d) { 
                    return dateToDate(d.date);
                }))*/
                .domain(xDomain)
                .rangeRound([ 0, width - (margin.right + margin.left)]);
            
            svg.append("g")
                .attr("id","xAxis")
                .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
                .call(d3.axisBottom(xScale));

            
            const yScaleType = semiLog ? d3.scaleLog() : d3.scaleLinear()

            const yMin = chartData.reduce((acc,element) => {
                const thisMin = d3.min(element, function(d) { return +d.yValue; })
                const newMin = thisMin < acc ? thisMin : acc
                return newMin
            },100000) //there's gotta be a better way to do this
            const yStart = semiLog ? yMin : 0

            const yEnd = chartData.reduce((acc,element) => {
                const thisMax = d3.max(element, function(d) { return +d.yValue; })
                const newMax = thisMax > acc ? thisMax : acc
                return newMax
            },0)
            
            const yScale = yScaleType
                .domain([yStart, yEnd])
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            svg.append("g")
                .attr("id","yAxis")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(d3.axisLeft(yScale));

            const lineVector = (d) => {
                const line = d3.line()
                .x((d) => xScale(dateToDate(d.date)))
                .y((d) => yScale(d.yValue))

                const linePlot = line(d)
                console.log("Line is: ",linePlot)

                return(linePlot)

            }

            const myColor = d3.scaleOrdinal().domain(chartData)
                .range(colors)
            
            function updateLines() {
                
                
                const lineUpdate = d3.select('.plotArea')
                    .selectAll('.linePlot')
                    .data(chartData)

                lineUpdate.exit().remove()

                const lineUpdateEnter = lineUpdate.enter()
                    .append("g")
                    .attr("id","linePlot")
                    .append("path")
                    .attr("id","linePath")
                    .attr("fill", "none")
                    //.attr("stroke", "steelblue")
                    .attr("stroke", (d) => {
                        return myColor(d)
                    })
                    .attr("stroke-width", 1.5)
                    .attr("d", lineVector)
                    .attr("transform", `translate(${margin.left},${margin.top})`)

                //console.log('updateLines was called, and lineUpdate is: ',lineUpdate)
                console.log('updateLines was called, and chartData is: ',chartData)
            }

            updateLines()
                

        },
        [chartData]
    )

    
    return (
        <svg
            className="plotArea"
            ref = {ref}
            style={{
                height: 800,
                width: 1100,
                marginRight: "0px",
                marginLeft: "0px",
            }}
        >
            <g className="lineGroup"></g>
            <g className="lineGroup"></g>
        </svg>
        )
}

export default LineChart