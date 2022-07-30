import React, { useEffect, useState } from "react";

const PriceRangeContainer = ({min,max,updateMinPrice,updateMaxPrice}) => {

    console.log("[min,max] is: ",[min,max])
    const [formData, setFormData] = useState({"min":0,"max":0})

    useEffect(() => {
        const newMin = +min
        const newMax = +max
        setFormData({"min":newMin.toFixed(2),"max":newMax.toFixed(2)})
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

    const updateHandler = (event) => {
        event.preventDefault()
        updateMinPrice(formData.min)
        updateMaxPrice(formData.max)
    }

    const PriceRange
        = <form
        className="PriceRangeForm"
        onSubmit={updateHandler}
    >
            <input
                type="text"
                className="PriceInput"
                onChange={changeHandler}
                name="max"
                value={`$${formData.max}`}
            />
            
            <input
                type="text"
                className="PriceInput"
                onChange={changeHandler}
                name="min"
                value={`$${formData.min}`}
            />

            
            <button className = "ResetPriceButton">UPDATE PRICE</button>

        </form>
    
    return PriceRange

}

export default PriceRangeContainer