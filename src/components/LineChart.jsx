import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useD3 from "../hooks/useD3";

const LineChart = (chartData) => {
    console.log("chartData outside useD3 is: ",chartData)

    const data = chartData.chartData

    const ref = useD3(
        (svg) => {
            const height = 500;
            const width = 500;
            const margin = { top: 20, right: 30, bottom: 30, left: 40 };

            const xScale = d3.scaleLinear()
                .domain([0, 5])
                .rangeRound([ 0, width - (margin.right + margin.left)]);
            
            svg.append("g")
                .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
                .call(d3.axisBottom(xScale));

            const yScale = d3.scaleLinear()
                .domain([ 0, 15])
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            svg.append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(d3.axisLeft(yScale));


            const line = d3.line()
                .x((d) => xScale(d.xValue))
                .y((d) => yScale(d.yValue))

            const linePlot = line(data)

            console.log("Line is: ",linePlot)
            svg.append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 1.5)
                .attr("d", linePlot)
                .attr("transform", `translate(${margin.left},${margin.top})`)
                

        },
        [chartData.length]
    )

    

        return (
            <svg
                ref = {ref}
                style={{
                    height: 500,
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