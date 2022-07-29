import React, { useState } from "react";

const PriceRangeContainer = ({min,max,updateMinPrice,updateMaxPrice}) => {

    const [formData, setFormData] = useState({"min":min,"max":max})


    const changeHandler = (event) => {
        const {name, value} = event.target
        setFormData(prevFormData => {
            return {
                ...prevFormData,
                [name]: value
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
                placeholder={min}
                onChange={changeHandler}
                name="min"
                value={formData.stockSymbol}
            />

            <input
                type="text"
                className="PriceInput"
                placeholder={max}
                onChange={changeHandler}
                name="max"
                value={formData.trailingDays}
            />
            <button className = "ResetPriceButton">UPDATE PRICE</button>

        </form>
    
    return PriceRange

}

export default PriceRangeContainer