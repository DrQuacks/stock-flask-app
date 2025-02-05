import {useContext} from 'react'
import { StockContext } from '../StockContext'
import calcStartEnd from '../helpers/calcStartEnd'
import calcDayValues from '../helpers/calcDayValues'
import { PlotData } from '../static/initialPlotState'

const useDatePrefs = (data:PlotData) => {
    const {prefsDispatch} = useContext(StockContext)
    const xDomain = calcStartEnd(data)
    const dayValues = calcDayValues(data)
    prefsDispatch({type:"update_date_range",xDomain,dayValues})
}

export default useDatePrefs