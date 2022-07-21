import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useD3 from "../hooks/useD3";
import dateToDate from "../helpers/dateToDate";

const LineChart = ({
    plotData,
    chartData,
    plotPrefs,
    stockKeys,
    setStartDate,
    startDate,
    setEndDate,
    endDate
}) => {
    console.log("plotData outside useD3 is: ",plotData)
    //const {data,start,end,min,max} = plotData

    const {semiLog,overlayRaw,overlayNew} = plotPrefs.current
    console.log('semilog is: ',semiLog)

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
            svg.select('#myLabel').remove()
            


            const xDomain = d3.extent(plotData.reduce((acc,element) => {
                const thisExtent = [dateToDate(element.start),dateToDate(element.end)]

                return [...acc,...thisExtent]
            },[]))

            //const xDomain = [dateToDate(start),dateToDate(end)]
            console.log('xDomain is: ',xDomain)
            const xScale = d3.scaleTime()
                .domain(xDomain)
                .rangeRound([ 0, width - (margin.right + margin.left)]);

            
            svg.append("g")
                .attr("id","xAxis")
                .attr("transform", `translate(${margin.left},${height - margin.bottom})`)
                .call(d3.axisBottom(xScale));

            
            const yScaleType = semiLog ? d3.scaleLog() : d3.scaleLinear()

            /*const yMin = chartData.reduce((acc,element) => {
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

            const yDomain = [min,max]*/

            const yDomain = d3.extent(plotData.reduce((acc,element) => {
                const thisExtent = [element.min,element.max]

                return [...acc,...thisExtent]
            },[]))


            const yScale = yScaleType
                .domain(yDomain)
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            svg.append("g")
                .attr("id","yAxis")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(d3.axisLeft(yScale));

            const lineVector = (d) => {
                console.log('d is: ',d)
                const line = d3.line()
                .x((d) => xScale(dateToDate(d.date)))
                .y((d) => yScale(d.yValue))

                const linePlot = line(d.data)
                //console.log("Line is: ",linePlot)

                return(linePlot)

            }

            const myColor = d3.scaleOrdinal().domain(plotData)
                .range(colors)

            /*const myLabelColor = d3.scaleOrdinal().domain(stockKeys)
                .range(colors)*/
            
            function updateLines() {
                
                
                const lineUpdate = d3.select('.plotArea')
                    .selectAll('.linePlot')
                    .data(plotData)


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

                lineUpdate.exit().remove()
                
                //console.log('updateLines was called, and lineUpdate is: ',lineUpdate)
                console.log('updateLines was called, and plotData is: ',plotData)

                /*console.log('stockKeys is: ',stockKeys)
                const labelUpdate = d3.select('.plotArea')
                    .selectAll(".myLabel")
                    .data(stockKeys)

                console.log('labelUpdate is: ',labelUpdate)


                const labelUpdateEnter = labelUpdate.enter()
                    .append("g")
                        .attr("id","myLabel")
                        .append("text")
                            .attr("id","myLabelText")
                            .attr("x", 120)
                            .attr("y", function(d,i){ return 100 + i*35}) // 100 is where the first dot appears. 25 is the distance between dots
                            .attr("fill", (d) => {
                                return myLabelColor(d)
                            })
                            .text(function(d){ return d})
                            .attr("text-anchor", "left")
                            .style("alignment-baseline", "middle")
                            .style("font-size","30px")

                labelUpdate.exit().remove()*/
                
            }

            updateLines()
                

        },
        [plotData,semiLog]
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