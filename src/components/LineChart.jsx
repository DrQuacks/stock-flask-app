import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useD3 from "../hooks/useD3";
import dateToDate from "../helpers/dateToDate";

const LineChart = ({chartData}) => {
    console.log("chartData outside useD3 is: ",chartData)

    const data = chartData

    const ref = useD3(
        (svg) => {
            const height = 700;
            const width = 800;
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };

            svg.select("#xAxis").remove()
            svg.select("#yAxis").remove()
            svg.select("#linePlot").remove()

            /*const xScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.xValue; })])
                .rangeRound([ 0, width - (margin.right + margin.left)]);*/

            const xScale = d3.scaleTime()
                .domain(d3.extent(data, function(d) { 
                    console.log("d.date is: ",d.date)
                    console.log("dateToString(d.date) is: ",dateToDate(d.date))
                    return dateToDate(d.date);
                }))
                .rangeRound([ 0, width - (margin.right + margin.left)]);
            
            svg.append("g")
                .attr("id","xAxis")
                .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
                .call(d3.axisBottom(xScale));

            const yScale = d3.scaleLinear()
                .domain([0, d3.max(data, function(d) { return +d.yValue; })])
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            svg.append("g")
                .attr("id","yAxis")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(d3.axisLeft(yScale));

            
            


            const line = d3.line()
                .x((d) => xScale(dateToDate(d.date)))
                .y((d) => yScale(d.yValue))

            const linePlot = line(data)

            console.log("Line is: ",linePlot)
            svg.append("path")
                .datum(data)
                .attr("id","linePlot")
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", linePlot)
                .attr("transform", `translate(${margin.left},${margin.top})`)
                

        },
        [chartData]
    )

    

        return (
            <svg
                ref = {ref}
                style={{
                    height: 800,
                    width: "100%",
                    marginRight: "0px",
                    marginLeft: "0px",
                }}
            >
                <g className="plot-area" />
                <g className="x-axis" />
                <g className="y-axis" />
            </svg>
          )
}

export default LineChart