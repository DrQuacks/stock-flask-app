import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import useD3 from "../hooks/useD3";
import dateToDate from "../helpers/dateToDate";

const LineChart = ({
    plotData,
    plotPrefs,
    stockKeys,
    setStartDate,
    startDate,
    setEndDate,
    endDate
}) => {
    console.log("plotData outside useD3 is: ",plotData)

    const {semiLog,firstDeriv,secondDeriv} = plotPrefs.current
    const showPlot = {
        price:true,
        firstDeriv:firstDeriv,
        secondDeriv:secondDeriv
    }
    console.log('semilog is: ',semiLog)

    const colors = ["#619ED6", "#6BA547", "#F7D027", "#E48F1B", "#B77EA3", "#E64345", "#60CEED", "#9CF168", "#F7EA4A", "#FBC543", "#FFC9ED", "#E6696E"]

    const ref = useD3(
        (svg) => {
            const height = 700;
            const width = 1200;
            const margin = { top: 20, right: 50, bottom: 30, left: 50 }

            let pointerX,
                pointerY


            svg.selectAll("#symbolGroup").remove()
            svg.select("#xAxis").remove()
            svg.select("#yAxis").remove()
            svg.select("#y2Axis").remove()

            /*const xDomain = d3.extent(plotData.reduce((acc,element) => {
                const thisExtent = [dateToDate(element.start),dateToDate(element.end)]
                return [...acc,...thisExtent]
            },[]))*/

            const indexScale = d3.scaleLinear()
                .domain([0,(plotData[0].data.length - 1)])
                .rangeRound([ 0, width - (margin.right + margin.left)]);

            console.log('xDomain in LineChart is: ',plotPrefs.current.xDomain)

            const xScale = d3.scaleTime()
                .domain(plotPrefs.current.xDomain)
                .rangeRound([ margin.left, width - (margin.right + margin.left)])
                .clamp(true)


            
            const yScaleType = semiLog ? d3.scaleLog() : d3.scaleLinear()

            const yDomain = d3.extent(plotData.reduce((acc,element) => {
                const thisExtent = [element.min,element.max]
                return [...acc,...thisExtent]
            },[]))
            console.log('yDomain is: ',yDomain)

            const y2Domain = d3.extent(plotData.reduce((acc,element) => {
                const thisDerivExtent = [element.minDeriv,element.maxDeriv]
                const thisDeriv2Extent = [element.minDeriv2,element.maxDeriv2]
                //this is kinda hacked together, and should be done better
                let values
                if (firstDeriv){
                    values = [...thisDerivExtent]
                    if (secondDeriv){
                        values = [...values,...thisDeriv2Extent]
                    }
                }
                else {
                    values = [...thisDerivExtent]
                }
                const thisExtent = d3.extent(values)
                return [...acc,...thisExtent]
            },[]))
            console.log('yDomain2 is: ',y2Domain)
            console.log('After yDomain2, yDomain is: ',yDomain)


            const yScale = yScaleType
                .domain(yDomain)
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            const rightYScale = d3.scaleLinear()
                .domain(y2Domain)
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            const xAxis = svg.append("g")
                .attr("id","xAxis")
                //.attr("transform", `translate(${margin.left},${height - margin.bottom})`)
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale));

            const yAxis = svg.append("g")
                .attr("id","yAxis")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(d3.axisLeft(yScale).tickFormat(y => `$${y}`))

            if (firstDeriv || secondDeriv){
                console.log("A derivative box was checked")
                const y2Axis = svg.append("g")
                    .attr("id","y2Axis")
                    .attr("transform", `translate(${width - margin.right - margin.left},${margin.top})`)
                    .call(d3.axisRight(rightYScale).tickFormat(d3.format('.2%')));
            }

            svg.on("click", e => { 
                console.log(d3.pointer(e))
                const [rawX,rawY] = d3.pointer(e)
                pointerX = xScale.invert(rawX)
                pointerY = yScale.invert(rawY)
                console.log('pointer is at: ',[pointerX,pointerY])
            })

            svg.on("mousedown", e => { 
                console.log(d3.pointer(e))
                
                const [rawX,rawY] = d3.pointer(e)
                pointerX = xScale.invert(rawX - margin.left)
                pointerY = yScale.invert(rawY - margin.top)
                console.log('pointer is at: ',[pointerX,pointerY])

                const index = Math.floor(indexScale.invert(rawX - margin.left)) //I'm not sure this is accurate because of floor
                console.log('index is: ',index)
                const mappedY = plotData[0]['data'][index]['price']
                console.log('mappedY is: ',mappedY)
                const plotY = yScale(mappedY) + margin.top
                console.log('plotY is: ',plotY)
        
                svg.append("g")
                    .attr("id","tempMouseLine")
                        .append("line")
                        .attr("x1", rawX)
                        .attr("y1", margin.top)
                        .attr("x2", rawX)
                        .attr("y2", height - margin.bottom)
                        .style("stroke-width", 1)
                        .style("stroke", "gray")
                        .style("fill", "none");

                svg.append("g")
                    .attr("id","tempMouseLine")
                        .append("line")
                        .attr("x1", margin.left)
                        .attr("y1", plotY)
                        .attr("x2", width - margin.right)
                        .attr("y2", plotY)
                        .style("stroke-width", 1)
                        .style("stroke", "gray")
                        .style("fill", "none");
            })

            svg.on("mouseup", e => { 
                console.log(d3.pointer(e))
                console.log("mouse up")
                const [rawX,rawY] = d3.pointer(e)
                d3.selectAll("#tempMouseLine").remove()
            })

            const lineVector = (d,type) => {

                console.log('In lineVector, d is: ',d)
                console.log('In lineVector, plotPrefs is: ',plotPrefs.current)
                const lineNoY = d3.line()
                    .x((d) => xScale(dateToDate(d.date)))

                const line = lineNoY
                    .y((d) => {
                        if (type === "price"){
                            return yScale(d.price)
                        } else if (type === "firstDeriv") {
                            return rightYScale(d.derivFirst)
                        } else {
                            return rightYScale(d.derivSecond)
                        }
                })

                const linePlot = line(d.data)
                //console.log("Line is: ",linePlot)

                return(linePlot)

            }



            const myColor = d3.scaleOrdinal().domain(plotData)
                .range(colors)

            
            function updateLines() {
                
                const symbolGroupUpdate = d3.select('.plotArea')
                    .selectAll('.symbolGroup')
                    .data(plotData)

                const symbolGroupUpdateEnter = symbolGroupUpdate.enter()
                    .append("g")
                        .attr("id","symbolGroup")
                
                console.log('showPlot is: ',showPlot)
                Object.keys(showPlot).forEach((plotType) => {
                    if (showPlot[plotType]){
                        symbolGroupUpdateEnter.append("path")
                            .attr("id","linePath")
                            .attr("fill", "none")
                            .attr("stroke", (d) => {
                                return myColor(d)
                            })
                            .attr("stroke-width", 1.5)
                            .attr("d", (d)=>{
                                console.log("d is: ",d)
                                console.log("plotType is: ",plotType)
                                return lineVector(d,plotType)
                            })
                            //.attr("transform", `translate(${margin.left},${margin.top})`)
                            .attr("transform", `translate(0,${margin.top})`)
                            .attr("opacity","1")
                        }
                    })
                
                    symbolGroupUpdate.exit().remove()
                
                console.log('updateLines was called, and plotData is: ',plotData)
                
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
                width: 1200,
                marginRight: "0px",
                marginLeft: "0px",
            }}
        >
        </svg>
        )
}

export default LineChart