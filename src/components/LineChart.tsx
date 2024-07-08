import React , { useContext } from "react";
import * as d3 from "d3";
import useD3 from "../hooks/useD3";
import dateToDate from "../helpers/dateToDate";
import dateLocaleToString from "../helpers/dateLocaleToString";
import { StockContext } from "../StockContext";


const LineChart = () => {
    const {plotState,prefsState} = useContext(StockContext)!
    const {plotData} = plotState
    console.log("plotData outside useD3 is: ",plotData)

    const {semiLog,firstDeriv,secondDeriv,xDomain,selectedDayStrings,selectedPriceRange,localMins,localMaxs,dateTickValues,showModelLines,modelLineDays,modelLineStrings} = prefsState
    const showPlot = {
        price:true,
        raw:true,
        firstDeriv:firstDeriv,
        secondDeriv:secondDeriv,
        localMins:localMins,
        localMaxs:localMaxs
    }


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
            svg.selectAll("#modelPerformanceGroup").remove()
            svg.select("#xAxis").remove()
            svg.select("#xAxisGridLines").remove()
            svg.select("#yAxis").remove()
            svg.select("#yAxisGridLines").remove()
            svg.select("#y2Axis").remove()
            svg.select("#modelLines").remove()
            d3.selectAll(".tooltip").remove()

            const indexScale = d3.scaleLinear()
                .domain([0,(plotData[0].data.length - 1)])
                .rangeRound([ margin.left, width - (margin.right + margin.left)]);

            console.log('[xDomain,selectedDayValues,dateTickValues] in LineChart is: ',[xDomain,selectedDayStrings,dateTickValues])
            console.log('xDomain and scale xDomain are: ',[xDomain,d3.scaleTime().domain(xDomain)])

            const xScaleRange = [ margin.left, width - (margin.right + margin.left)]

            const xScaleShow = d3.scaleTime()
                .domain(xDomain)
                .rangeRound(xScaleRange)
                .clamp(true)

            const xScale = d3.scalePoint()
                //.domain(dayValues)
                .domain(selectedDayStrings)
                .range(xScaleRange)

            const xScaleBand = d3.scaleBand()
                //.domain(dayValues)
                .domain(selectedDayStrings)
                .range(xScaleRange)

            const inverseDomainRaw = d3.range(xScaleRange[0], xScaleRange[1], xScale.step())
            const inverseDomain = inverseDomainRaw.map(val => val.toString())
            const xScaleInverse = d3.scaleOrdinal()
                .domain(inverseDomain)
                .range(xScale.domain()) 
            
            const yScaleType = semiLog ? d3.scaleLog() : d3.scaleLinear()

            /*const yDomain = d3.extent(plotData.reduce((acc,element) => {
                const thisExtent = [element.min,element.max]
                return [...acc,...thisExtent]
            },[]))
            console.log('yDomain is: ',yDomain)*/

            const yDomain = selectedPriceRange

            const extentList = plotData.reduce<number[]>((acc,element) => {
                const thisDerivExtent = [element.minDeriv,element.maxDeriv]
                const thisDeriv2Extent = [element.minDeriv2,element.maxDeriv2]
                //this is kinda hacked together, and should be done better
                let values:number[] = []
                if (firstDeriv){
                    values = [...thisDerivExtent]
                    if (secondDeriv){
                        values = [...values,...thisDeriv2Extent]
                    }
                }
                else {
                    values = [...thisDerivExtent]
                }
                const thisExtent:[number,number] = d3.extent(values) as [number,number] //bad typing
                return [...acc,...thisExtent]
            },[])

            const y2Domain:[number,number] = d3.extent(extentList) as [number,number] //bad typing
            
            // const y2Domain = d3.extent(plotData.reduce<number[]>((acc,element) => {
            //     const thisDerivExtent = [element.minDeriv,element.maxDeriv]
            //     const thisDeriv2Extent = [element.minDeriv2,element.maxDeriv2]
            //     //this is kinda hacked together, and should be done better
            //     let values
            //     if (firstDeriv){
            //         values = [...thisDerivExtent]
            //         if (secondDeriv){
            //             values = [...values,...thisDeriv2Extent]
            //         }
            //     }
            //     else {
            //         values = [...thisDerivExtent]
            //     }
            //     const thisExtent = d3.extent(values)
            //     return [...acc,...thisExtent]
            // },[]))
            // //console.log('yDomain2 is: ',y2Domain)
            // //console.log('After yDomain2, yDomain is: ',yDomain)


            const yScale = yScaleType
                .domain(yDomain)
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            const rightYScale = d3.scaleLinear()
                .domain(y2Domain)
                .rangeRound([ height - (margin.top + margin.bottom), 0 ]);

            const xAxis = svg.append("g")
                .attr("id","xAxis")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(xScale)
                    .tickValues(dateTickValues['date'])
                    //.tickFormat((tick) => dateTickValues['scale'](tick))
                    //this scale is a problem but it's only used here.
                    //not sure I really need a scale. I wanna see how this looks
                    //once the file compiles
                    );
                //.call(d3.axisBottom(xScaleShow))

            const xAxisGridLines = svg.append("g")
                .attr("id","xAxisGridLines")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .attr("opacity",".05")
                .call(d3.axisBottom(xScale)
                    .tickValues(dateTickValues['date'])
                    .tickFormat(x => "")
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
                    .tickFormat(x => "")
                    .tickSize(-1*(width-(margin.right + 2*margin.left)))
                )

            if (firstDeriv || secondDeriv){
                const y2Axis = svg.append("g")
                    .attr("id","y2Axis")
                    .attr("transform", `translate(${width - margin.right - margin.left},${margin.top})`)
                    .call(d3.axisRight(rightYScale).tickFormat(d3.format('.2%')));
            }

            if (showModelLines){
                const modelLines = svg.append("g")
                    .attr("id","modelLines")
                    .attr("transform", `translate(0,${height - margin.bottom})`)
                    .attr("opacity",".3")
                    .call(d3.axisBottom(xScale)
                        // .tickValues(modelLineDays)
                        .tickValues(modelLineStrings)
                        .tickFormat(()=> "")
                        .tickSize(-1*(height - (margin.bottom + margin.top)))
                        .tickSizeOuter(0)
                    )
            }

            const modelPerformanceScale = d3.scaleOrdinal()
                // .domain([false,true])
                .domain(["false","true"])
                .range(["red","green"])


            function displayModelPerformance() {
                console.log('plotData is: ',plotData)
                if (plotData[0]['modelAnalysis']){
                    console.log('modelAnalysis is: ',plotData[0]['modelAnalysis'])
                    const modelPerformanceGroupUpdate = d3.select('.plotArea')
                        .selectAll('.modelPerformanceGroup')
                        .data(plotData[0]['modelAnalysis'])

                    const modelPerformanceGroupUpdateEnter = modelPerformanceGroupUpdate.enter()
                        .append("g")
                            .attr("id","modelPerformanceGroup")

                    modelPerformanceGroupUpdateEnter
                        .append('rect')
                        .attr("id","rectAnalysis")
                        .attr("fill", (d) => {
                            return modelPerformanceScale(d[1]['correct'])
                        })
                        .attr("x",(d) => {
                            return xScaleBand(dateToDate(d[0][0]))
                        })
                        .attr("y",margin.top)
                        .attr('width',xScaleBand.bandwidth)
                        .attr('height',height - (margin.top+margin.bottom))
                        .attr("opacity",0.15)

                        
                    modelPerformanceGroupUpdate.exit().remove()
                }

            }

            const lineVector = (lineVectorData,type) => {

                console.log('In lineVector, lineVectorData is: ',lineVectorData)
                console.log('In lineVector, plotPrefs is: ',prefsState)
                let newData = [...lineVectorData.data]
                const xDomainTime = [xDomain[0].getTime(),xDomain[1].getTime()]
                console.log('In lineVector, plotPrefs and xDomainTime is: ',{prefsState,xDomainTime})

                const lineNoY = d3.line()
                    .x((d) => xScale(dateToDate(d.date)))

                //console.log('In lineVector, d.data is: ',d.data)
                let line = lineNoY
                    .y((d) => {
                        if (type === "price"){
                            return yScale(d.price)
                        } else if (type === "raw") {
                            return yScale(d.rawPrice)
                        } else if (type === "firstDeriv") {
                            return rightYScale(d.derivFirst)
                        } else if (type === "secondDeriv") {
                            return rightYScale(d.derivSecond)
                        } else if (type === "localMins") {
                            return yScale(d.price)
                        } else if (type === "localMaxs") {
                            return yScale(d.price)
                        }
                })
                if (type === "localMins"){
                    newData = [...lineVectorData.localMins]
                    console.log('newData is: ',newData)
                    line = line.curve(d3.curveStepAfter)
                } else if (type === "localMaxs") {
                    newData = [...lineVectorData.localMaxs]
                    console.log('newData is: ',newData)
                    line = line.curve(d3.curveStepAfter)
                }


                const startIndex = newData.findIndex(row => dateToDate(row.date).getTime() >= xDomainTime[0])
                const endIndex = newData.findLastIndex(row => dateToDate(row.date).getTime() <= xDomainTime[1])

                const checkedStartIndex = startIndex === -1 ? 0:startIndex
                const checkedEndIndex = endIndex === -1 ? (newData.length - 1):endIndex

                const newSelectedData = newData.slice(checkedStartIndex,checkedEndIndex+1)
                console.log("In lineVector, [xDomain,newData,newSelectedData] is: ",[xDomain,newData,newSelectedData])
                const linePlot = line(newSelectedData)

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
                    const roundedRawX = rangePoints[roundedRawXIndex-1] //this feels like a fudge factor, need to fix
                    //console.log('roundedRawX and rawX is: ',[roundedRawX,rawX])
                    pointerX = xScaleInverse(roundedRawX)

                    pointerY = yScale.invert(rawY - margin.top)
                    //console.log('pointer is at: ',[pointerX,pointerY])
                    
                    const mappedX = pointerX
                    //eventually I need to make this more dynamic
                    console.log('mappedX is: ',mappedX)
                    console.log('mappedX type is: ',(typeof mappedX))
                    const [mappedY,mappedYRaw] = plotData[0].datePriceScale(mappedX)
                    
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
                        //console.log('outputted mappedX is: ',mappedX)
                        const mappedXStr = dateLocaleToString(mappedX.toLocaleString("en-US", {
                            timeZone: "America/Los_Angeles"
                          }))


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
                                .html(`Avg: $${mappedY.toFixed(2)} <br>Raw: $${mappedYRaw.toFixed(2)} <br>${mappedXStr}`)

                        }
                    }

                    const mappedXStr = dateLocaleToString(mappedX.toLocaleString("en-US", {
                        timeZone: "America/Los_Angeles"
                      }))

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
                            .html(`Avg: $${mappedY.toFixed(2)} <br>Raw: $${mappedYRaw.toFixed(2)} <br>${mappedXStr}`)
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
            displayModelPerformance()
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