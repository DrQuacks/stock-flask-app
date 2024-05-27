import React, { useEffect, useState, useContext } from "react";
import { StockContext } from "../StockContext";


// const PriceRangeContainer = ({min,max,minData,maxData,updateMinPrice,updateMaxPrice,setPrefs}) => {
const PriceRangeContainer = () => {


    const { prefsState, prefsDispatch} = useContext(StockContext)!
    const {selectedPriceRange,priceRange} = prefsState
    const [min,max] = selectedPriceRange
    const [minData,maxData] = priceRange
    console.log("[min,max] is: ",[min,max])
    console.log("[minData,maxData] is: ",[minData,maxData])
    const [formData, setFormData] = useState({min:0,max:0})

    useEffect(() => {
        console.log('min and max changed to: ',[min,max])
        const newMin = +min
        const newMax = +max
        const newFormData = {min:+newMin.toFixed(2),max:+newMax.toFixed(2)}
        setFormData(newFormData)
    },[min,max])

    console.log("stateful [min,max] is: ",[formData.min,formData.max])
    console.log('formData is: ',formData)


    const changeHandler = (event) => {
        const {name, value} = event.target
        const numValue = +(value.substring(1))
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: numValue
            }
        })
    }

    const updateHandler = (event) => { //I don't think I should be altering priceRange, right? Just selectedPriceRange.
        event.preventDefault()
        prefsDispatch({type:"update_selected_price_range",selectedPriceRange:[formData.min,formData.max]})
    }

    const resetHandler = (event) => {
        event.preventDefault()
        prefsDispatch({type:"update_selected_price_range",selectedPriceRange:[minData,maxData]})
    }

    
    const styleLabel = {
        "color":"white",
        "gridColumn":"1",
    }

    const PriceRange
        = <form
        className="PriceRangeForm"
        onSubmit={updateHandler}
    >
            <div className = "DateElement" style ={{"gridRow":1}}>
                <label
                    className="DatePickerLabel"
                    htmlFor="DatePicker"
                    style={styleLabel}
                >
                    Max Price: 
                </label>
                    <input
                        type="text"
                        className="PriceInput"
                        onChange={changeHandler}
                        name="max"
                        value={`$${formData.max}`}
                    />
            </div>
            
            <div className = "DateElement" style ={{"gridRow":2}}>
                <label
                    className="DatePickerLabel"
                    htmlFor="DatePicker"
                    style={styleLabel}
                >
                    Min Price: 
                </label>
                <input
                    type="text"
                    className="PriceInput"
                    onChange={changeHandler}
                    name="min"
                    value={`$${formData.min}`}
                />
            </div>

            
            <div className="DateButtons">
                <button onClick = {updateHandler} className = "UpdateDateButton">UPDATE</button>
                <button onClick = {resetHandler} className = "ResetDateButton">RESET</button>
            </div>

        </form>
    
    return PriceRange

}

export default PriceRangeContainer