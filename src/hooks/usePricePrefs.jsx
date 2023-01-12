import {useContext} from 'react'
import { StockContext } from '../StockContext'
import calcMinMax from '../helpers/calcMinMax'

const usePricePrefs = (data) => {
    const {prefsDispatch} = useContext(StockContext)
    const priceRange = calcMinMax(data)
    prefsDispatch({type:"update_price_prefs",priceRange})
}

export default usePricePrefs