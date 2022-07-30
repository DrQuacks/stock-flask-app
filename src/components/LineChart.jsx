import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Tooltip } from "@mui/material";
import useD3 from "../hooks/useD3";
import dateToDate from "../helpers/dateToDate";
import dateToString from "../helpers/dateToString";

const LineChart = ({
    plotData,
    plotPrefs
}) => {
    console.log("plotData outside useD3 is: ",plotData)

    const {semiLog,firstDeriv,secondDeriv,xDomain,dayValues,selectedDayValues,selectedPriceRange} = plotPrefs.current
    const showPlot = {
        price:true,
        raw:true,
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


            //I feel like I'm mis-using d3 here. Shouldn't this be accomplished with exit()?
            svg.selectAll("#symbolGroup").remove()
            svg.select("#xAxis").remove()
            svg.select("#xAxisGridLines").remove()
            svg.select("#yAxis").remove()
            svg.select("#yAxisGridLines").remove()
            svg.select("#y2Axis").remove()
            d3.selectAll(".tooltip").remove()

            const indexScale = d3.scaleLinear()
                .domain([0,(plotData[0].data.length - 1)])
                .rangeRound([ margin.left, width - (margin.right + margin.left)]);

            //console.log('[xDomain,dayValues,selectedDayValues] in LineChart is: ',[xDomain,dayValues,selectedDayValues])

            const xScaleRange = [ margin.left, width - (margin.right + margin.left)]

            const xScaleShow = d3.scaleTime()
                .domain(xDomain)
                .rangeRound(xScaleRange)
                .clamp(true)

            const xScale = d3.scalePoint()
                //.domain(dayValues)
                .domain(selectedDayValues)
                .range(xScaleRange)

            const xScaleInverse = d3.scaleOrdinal()
                .domain(d3.range(xScaleRange[0], xScaleRange[1], xScale.step()))
                .range(xScale.domain()) 
            
            const yScaleType = semiLog ? d3.scaleLog() : d3.scaleLinear()

            /*const yDomain = d3.extent(plotData.reduce((acc,element) => {
                const thisExtent = [element.min,element.max]
                return [...acc,...thisExtent]
            },[]))
            console.log('yDomain is: ',yDomain)*/

            const yDomain = selectedPriceRange

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
            //console.log('yDomain2 is: ',y2Domain)
            //console.log('After yDomain2, yDomain is: ',yDomain)


            const yScale = yScaleType
                .domain(yDomain)
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            const rightYScale = d3.scaleLinear()
                .domain(y2Domain)
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            const xAxis = svg.append("g")
                .attr("id","xAxis")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScaleShow));

            const xAxisGridLines = svg.append("g")
                .attr("id","xAxisGridLines")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .attr("opacity",".05")
                .call(d3.axisBottom(xScaleShow)
                    .tickFormat("")
                    .tickSize(-1*(height - (margin.bottom + margin.top)))
                )

            const yAxis = svg.append("g")
                .attr("id","yAxis")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .call(d3.axisLeft(yScale).tickFormat(y => `$${y}`))

            const yAxisGridLines = svg.append("g")
                .attr("id","yAxisGridLines")
                .attr("transform", `translate(${margin.left},${margin.top})`)
                .attr("opacity",".05")
                .call(d3.axisLeft(yScale)
                    .tickFormat("")
                    .tickSize(-1*(width-(margin.right + 2*margin.left)))
                )

            if (firstDeriv || secondDeriv){
                console.log("A derivative box was checked")
                const y2Axis = svg.append("g")
                    .attr("id","y2Axis")
                    .attr("transform", `translate(${width - margin.right - margin.left},${margin.top})`)
                    .call(d3.axisRight(rightYScale).tickFormat(d3.format('.2%')));
            }


            const lineVector = (d,type) => {

                console.log('In lineVector, d is: ',d)
                console.log('In lineVector, plotPrefs is: ',plotPrefs.current)
                const lineNoY = d3.line()
                    .x((d) => xScale(dateToDate(d.date)))

                //console.log('In lineVector, d.data is: ',d.data)
                const line = lineNoY
                    .y((d) => {
                        if (type === "price"){
                            return yScale(d.price)
                        } else if (type === "raw") {
                            return yScale(d.rawPrice)
                        } else if (type === "firstDeriv") {
                            return rightYScale(d.derivFirst)
                        } else {
                            return rightYScale(d.derivSecond)
                        }
                })

                const newData = [...d.data]
                
                const xDomainTime = [xDomain[0].getTime(),xDomain[1].getTime()]
                //console.log("In the start of lineVector, [xDomainTime,xDomain,dayValues,d.daysList] is: ",[xDomainTime,xDomain,dayValues,d.daysList])

                const startIndex = d.daysList.findIndex(day => day.getTime() === xDomainTime[0])
                const endIndex = d.daysList.findIndex(day => day.getTime() === xDomainTime[1])
                //console.log("In lineVector, startIndex and endIndex are: ",[startIndex,endIndex])
                const checkedStartIndex = startIndex === -1 ? 0:startIndex
                const checkedEndIndex = endIndex === -1 ? (d.daysList.length - 1):endIndex
                //console.log("In lineVector, checkedstartIndex and checkedendIndex are: ",[checkedStartIndex,checkedEndIndex])
            
                const newSelectedData = newData.slice(checkedStartIndex,checkedEndIndex+1)
                //console.log("In lineVector, [xDomain,newData,newSelectedData] is: ",[xDomain,newData,newSelectedData])

                const linePlot = line(newSelectedData)
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
                        symbolGroupUpdateEnter
                            .append("path")
                            .attr("id","linePath")
                            .attr("fill", "none")
                            .attr("stroke", (d) => {
                                return myColor(d)
                            })
                            .attr("stroke-width", plotType === "price" ? 4:0.75)
                            .attr("d", (d)=>{
                                console.log("d is: ",d)
                                console.log("plotType is: ",plotType)
                                return lineVector(d,plotType)
                            })
                            .attr("transform", `translate(0,${margin.top})`)
                            .attr("opacity",plotType === "raw" ? 1:0.5)
                        }
                    })
                
                    symbolGroupUpdate.exit().remove()
                
                //console.log('updateLines was called, and plotData is: ',plotData)
                
            }

            function dragPointer() {
                const tooltip = d3.select("body").append("div")
                //const tooltip = d3.select(".PlotArea").append("div")
                    .attr("class", "tooltip")

                const calcXandY = (e) => {
                    const [rawX,rawY] = d3.pointer(e)
                    //console.log('yDOmain is: ',yDomain)

                    const rangePoints = xScaleInverse.domain()
                    //console.log('[rangePoints] is: ',[rangePoints]) 
                    const roundedRawXIndex = d3.bisectLeft(rangePoints, rawX)
                    const roundedRawX = rangePoints[roundedRawXIndex]
                    //console.log('roundedRawX is: ',roundedRawX)
                    pointerX = xScaleInverse(roundedRawX)

                    pointerY = yScale.invert(rawY - margin.top)
                    //console.log('pointer is at: ',[pointerX,pointerY])
                    
                    const mappedX = pointerX
                    //eventually I need to make this more dynamic
                    const [mappedY,mappedYRaw] = plotData[0].datePriceScale(mappedX)
                    //console.log('mappedX is: ',mappedX)
                    //console.log('mappedX type is: ',(typeof mappedX))
                    //console.log('mappedY is: ',mappedY)
                    const plotY = yScale(mappedY) + margin.top
                    const plotYRaw = yScale(mappedYRaw) + margin.top
                    //console.log('plotY is: ',plotY)
                    return {rawX,rawY,mappedX,mappedY,mappedYRaw,plotY,plotYRaw}
                }
            
                //for some reason this breaks when I switch browser windows
                svg.on("mousedown", e => { 
                    //console.log(d3.pointer(e))
                    e.preventDefault()

                    const {rawX,rawY,mappedX,mappedY,mappedYRaw,plotY,plotYRaw} = calcXandY(e)
                    svg.on("mousemove",eDrag => {
                        //console.log("eDrag is: ",d3.pointer(eDrag))
                        //console.log("e is: ",d3.pointer(e))
                        mouseMove(eDrag)
                    })

                    function mouseMove(eDrag) {
                        eDrag.preventDefault()
                        const {rawX,rawY,mappedX,mappedY,mappedYRaw,plotY,plotYRaw} = calcXandY(eDrag)

                        /*console.log('numericMappedX is: ',mappedX.getTime())
                        console.log('numericDay0 is: ',plotData[0].daysList[0].getTime())
                        console.log('numericDayEnd is: ',plotData[0].daysList[plotData[0].daysList.length - 1].getTime())*/

                        if (
                            mappedX.getTime() >= plotData[0].daysList[0].getTime() 
                            && rawX <= (width - margin.left - margin.right) 
                            && rawX >= (margin.left)
                        ){
                            d3.selectAll("#tempVerticalMouseLine")
                                .attr("x1", () => {
                                    //console.log('rawX was altered with a value of: ',rawX)
                                    return rawX
                                })
                                .attr("x2", rawX)

                            d3.selectAll("#tempHorizontalMouseLine")
                                .attr("y1", plotY)
                                .attr("y2", plotY)

                            d3.selectAll("#tempRawHorizontalMouseLine")
                                .attr("y1", plotYRaw)
                                .attr("y2", plotYRaw)

                            tooltip
                                .style("top", eDrag.pageY - 10 + "px")
                                .style("left", eDrag.pageX + 10 + "px")
                                .html(`Avg: $${mappedY.toFixed(2)} <br>Raw: $${mappedYRaw.toFixed(2)} <br>${dateToString(mappedX.toUTCString())}`)
                        }
                    }

                    if (
                        mappedX.getTime() >= plotData[0].daysList[0].getTime() 
                        && rawX <= (width - margin.left - margin.right) 
                        && rawX >= (margin.left)
                    ){
                        //console.log('I only want this once per drag')
                        svg.append("g")
                            .attr("id","tempVerticalMouseLine")
                                .append("line")
                                .attr("id","tempVerticalMouseLine")
                                .attr("x1", rawX)
                                .attr("y1", margin.top)
                                .attr("x2", rawX)
                                .attr("y2", height - margin.bottom)
                                .style("stroke-width", 1)
                                .style("stroke", "gray")
                                .style("fill", "none");

                        svg.append("g")
                            .attr("id","tempHorizontalMouseLine")
                                .append("line")
                                .attr("id","tempHorizontalMouseLine")
                                .attr("x1", margin.left)
                                .attr("y1", plotY)
                                .attr("x2", width - margin.right - margin.left)
                                .attr("y2", plotY)
                                .style("stroke-width", 2.5)
                                .style("stroke", "gray")
                                .style("fill", "none");

                        svg.append("g")
                            .attr("id","tempRawHorizontalMouseLine")
                                .append("line")
                                .attr("id","tempRawHorizontalMouseLine")
                                .attr("x1", margin.left)
                                .attr("y1", plotYRaw)
                                .attr("x2", width - margin.right - margin.left)
                                .attr("y2", plotYRaw)
                                .style("stroke-width", 0.9)
                                .style("stroke", "gray")
                                .style("fill", "none");
                        
                        tooltip
                            .style("background-color", "tan")
                            .style("border", "1px solid black")
                            .style("padding", "2px")
                            .style("top", e.pageY - 10 + "px")
                            .style("left", e.pageX + 10 + "px")
                            .style("opacity", 1)
                            .html(`Avg: $${mappedY.toFixed(2)} <br>Raw: $${mappedYRaw.toFixed(2)} <br>${dateToString(mappedX.toUTCString())}`)
                        }
                })

                svg.on("mouseup", e => { 
                    //console.log(d3.pointer(e))
                    //console.log("mouse up")
                    const [rawX,rawY] = d3.pointer(e)
                    d3.selectAll("#tempVerticalMouseLine").remove()
                    d3.selectAll("#tempHorizontalMouseLine").remove()
                    d3.selectAll("#tempRawHorizontalMouseLine").remove()
                    tooltip.style("opacity",0)
                    svg.on("mousemove",null)
                })

            }

            //boot
            updateLines()
            dragPointer()
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