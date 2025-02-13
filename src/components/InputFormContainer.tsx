import React, { useState , useContext , ChangeEvent } from "react"
import * as d3 from "d3";
import sendToPython from "../helpers/sendToPython"
import dateToDate from "../helpers/dateToDate";
import { StockContext } from "../StockContext";
import { ModelAnalysis, ModelAnalysisRaw, PlotData , PlotDatum, StockDatum } from "../static/initialPlotState";

type SampleType = "Open" | "Close" | "High" | "Low" | "Open/Close"

type InputFormData = {
    stockSymbol: string;
    trailingDays: string;
    stepSize: string;
    max: string;
    // trainingBounds: string[];
    trainingBounds: [number,number,number];
    overlayNew: boolean;
    customDate: boolean;
    avgType: string;
    sampleType: SampleType;
    startAmount: string;
    availableCash: string;
    buySell: string;
    startInvest: Date;
    endInvest: Date;
}

function InputFormContainer(
    {
        inputFormBuilder,
        route,
        modelSample,
        isModelInput=false
    }:{
        inputFormBuilder:({ formData, handleChangeCallBack, handleChangeCheckboxCallBack, handleChangeSliderCallBack }: {
            formData: InputFormData;
            handleChangeCallBack: (event: (ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLSelectElement>)) => void;
            handleChangeCheckboxCallBack:(event: ChangeEvent<HTMLInputElement>) => void;
            // handleChangeSliderCallBack: (event: Event, value: [number, number, number]) => void
            handleChangeSliderCallBack: (event: Event, value: number[]|number) => void
        }) => React.JSX.Element,
        route:string,
        modelSample?:any,
        isModelInput?:boolean
    }
) {

    const { plotState, prefsState, plotDispatch, prefsDispatch, inputDispatch} = useContext(StockContext)!

    const [formData, setFormData] = useState<InputFormData>( //this is a terrible way to initialize this
        {
            stockSymbol: "", 
            trailingDays: "",
            stepSize:"",
            max:"",
            //trainStart:"",
            //trainEnd:"",
            //testEnd:"",
            // trainingBounds:['0','80','100'],
            trainingBounds:[0,80,100],
            overlayNew: false,
            customDate: false,
            avgType: "Constant",
            sampleType: modelSample || "Close",
            startAmount: "",
            availableCash: "",
            buySell: "",
            startInvest: new Date(),
            endInvest: new Date()
        }
    )

    function handleChange(event: (ChangeEvent<HTMLInputElement>|ChangeEvent<HTMLSelectElement>)) {
        // const {name, value, type, checked} = event.target
        const {name, value, type} = event.target

        console.log('debugHandleChange',{name, value, type, event,formData,prefsState,plotState})
        // if ((name === "trainingBounds") && !prefsState.showModelLines){
        if ((name === "trainingBounds")){
            const {dayValues} = prefsState
            const dayArray = formData.trainingBounds.map((bound) => {
                // const index = Math.floor(((parseInt(bound)/100) * dayValues.length) - 1)
                const index = Math.floor(((bound/100) * dayValues.length) - 1)
                return dayValues[index]
            })
            const modelLineStrings = dayArray.map(day => day.toString())
            prefsDispatch({type:"update_model_lines",showModelLines:true,modelLineDays:dayArray,modelLineStrings})
        }
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: name === "trainingBounds" ? parseInt(value) : value
            }
        })
    }
    function handleChangeCheckbox(event: ChangeEvent<HTMLInputElement>) {
        const {name,checked} = event.target

        // console.log('debugHandleChange',{name, value, type, checked,event,formData,prefsState,plotState})
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: checked
            }
        })
    }
    // function handleChangeSlider(event: Event, value: [number,number,number]) {
    function handleChangeSlider(event: Event, value: number[]|number) {
        const hackyValue:[number,number,number] = (value.constructor === Array) ? [value[0],value[1],value[2]] : [0,1,2]
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                "trainingBounds": hackyValue
            }
        })
    }

    function generateScale(dataArray:StockDatum[]) {

        const domain = dataArray.map((row) => {
            // if (row.type){
            //     return dateToDate(row.date,row.type)
            // }
            // return dateToDate(row.date)
            // const dateWithTime = new Date(row.date)
            // dateWithTime.setHours(0,0,0,0)
            // return dateWithTime
            const date = dateToDate(row.date)
            return date
        })
        const range:[number,number][] = dataArray.map((row) => [row.price,row.rawPrice])

        const priceArray:number[] = dataArray.map((row) => row.price)
        const rawPriceArray:number[] = dataArray.map((row) => row.rawPrice)

        console.log('debugPointerScale',{domain,priceArray,rawPriceArray})
        const datePriceScale = d3.scaleOrdinal<Date,number>()
            .domain(domain) //bad typing
            .range(priceArray)

        const dateRawPriceScale = d3.scaleOrdinal<Date,number>()
            .domain(domain) //bad typing
            .range(rawPriceArray)
        return {datePriceScale,dateRawPriceScale}
    }

    // function generateLookup(dataArray:StockDatum[]) {
    //     const {dateToPrice,priceToDate} = dataArray.reduce((acc,row) => {

    //     })
    // }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const prefs = {
            overlayNew: formData.overlayNew,
            customDate: formData.customDate,
            doubleDates: formData.sampleType === "Open/Close" ? true : false
        }
        //setPrefs(prefs)
        inputDispatch({type:'update_input_prefs',prefs})
        
        //I need to handle blank inputs
        //what's in here is working from the outside, but it's logging errors in python
        const data = sendToPython(formData,route)
        const resolvedDataDict:any = await data
        console.log('resolvedDataDict is: ',resolvedDataDict)
        let newPlotDataList:PlotData = [] //yeah, uhh, this should be done with reduce...

        if (isModelInput){
            const modelAnalysisFormatted:ModelAnalysis = (resolvedDataDict.modelAnalysis as ModelAnalysisRaw).map(entry => {
                const sampleTimeArray = entry[0]
                const dateString = sampleTimeArray[0]
                const formattedDate = dateToDate(dateString)
                return [[formattedDate,sampleTimeArray[1]],entry[1]]
            })
            const {plotData} = plotState
            plotData.forEach((plot) =>{
                newPlotDataList = [
                    ...newPlotDataList,
                    {...plot,modelAnalysis:modelAnalysisFormatted,splits:resolvedDataDict.splits}
                ]
            })
        } else {
            const plotKeys = Object.keys(resolvedDataDict.plotData)
            plotKeys.forEach((resolvedDataKey,index) => {
                const days = formData.trailingDays || (parseInt(formData.stepSize)*(index+1)).toString()
                console.log("days is: ",days)
                const resolvedData = resolvedDataDict.plotData[resolvedDataKey]
                console.log('resolvedDataKey and resolvedData are: ',[resolvedDataKey,resolvedData])
                const resolvedDaysList = resolvedData.stockFeatures.days_list as any[] 
                const formattedDays = resolvedDaysList.map((day) => dateToDate(day))
                const {datePriceScale,dateRawPriceScale} = generateScale(resolvedData.stockArray)
                //console.log('[formattedDays] is: ',[formattedDays])
                const newPlotData:PlotDatum = {
                    name:formData.stockSymbol,
                    data:resolvedData.stockArray,
                    trailingDays:days,
                    avgType:formData.avgType,
                    sampleType:formData.sampleType,
                    start:dateToDate(resolvedData.stockFeatures.start_date),
                    end:dateToDate(resolvedData.stockFeatures.end_date),
                    min:resolvedData.stockFeatures.min_price,
                    max:resolvedData.stockFeatures.max_price,
                    minDeriv:resolvedData.stockFeatures.min_deriv,
                    maxDeriv:resolvedData.stockFeatures.max_deriv,
                    minDeriv2:resolvedData.stockFeatures.min_deriv2,
                    maxDeriv2:resolvedData.stockFeatures.max_deriv2,
                    datePriceScale,
                    dateRawPriceScale,
                    daysList:formattedDays,
                    localMins:resolvedData.localMinsandMaxs[0],
                    localMaxs:resolvedData.localMinsandMaxs[1],
                    //modelAnalysis:resolvedDataDict.modelAnalysis,
                    //splits:resolvedDataDict.splits
                }
                newPlotDataList = [...newPlotDataList,newPlotData]
            })
        }
        console.log('debugFormData',{formData,newPlotDataList})

        //handleInput(newPlotDataList)
        if(prefs.overlayNew){
            plotDispatch({type:'update_data',data:newPlotDataList})
        } else {
            plotDispatch({type:'replace_data',data:newPlotDataList})
        }
 
        console.log("event is: ",event)
        setFormData((priorForm) => {
            const clearedForm = {...priorForm,
                stockSymbol: "", 
                trailingDays: "",
                stepSize: "",
                max: ""
            }
            return clearedForm
        })
    }

    const InputForm = inputFormBuilder({
        formData,
        handleChangeCallBack:handleChange,
        handleChangeCheckboxCallBack:handleChangeCheckbox,
        handleChangeSliderCallBack:handleChangeSlider
    })
    //console.log('InputForm is: ',InputForm)

    return (
        <form
            className="PlotInputForm"
            onSubmit={handleSubmit}
        >
           {InputForm}
        </form>
    )

}

export {InputFormContainer,InputFormData,SampleType}