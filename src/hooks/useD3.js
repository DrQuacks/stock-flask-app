import { useRef , useEffect } from "react";
import * as d3 from "d3"

const useD3 = (renderChartFn, dependencies) => {
    const ref = useRef(null) //custom change because of typing error

    useEffect(() => {
        renderChartFn(d3.select(ref.current))
        return () => {}
    },[...dependencies,renderChartFn])

    return ref

}

export default useD3