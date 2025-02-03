import React , { useContext , Fragment } from "react";
import { StockContext } from "../StockContext";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';



const StatsTable = ({type}:{type:('targets' | 'predictions')}) => {

    const {plotState} = useContext(StockContext)!
    const {plotData} = plotState
    const {splits} = plotData[0]
    if (splits) {
        const {against_targets,against_predictions} = splits
        const thisData = type === 'targets' ? against_targets : against_predictions

        const Stats = (plotData[0].modelAnalysis && plotData[0].modelAnalysis.length === 0) ? <Fragment></Fragment> : 
            <div className='StatsSection'>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Against {type}</TableCell>
                        <TableCell align="right">Prediction Up</TableCell>
                        <TableCell align="right">Prediction Down</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow
                            key={type+'up'}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">Target Up</TableCell>
                            <TableCell align="right">{thisData.targetUp_predictionUp}</TableCell>
                            <TableCell align="right">{thisData.targetUp_predictionDown}</TableCell>
                        </TableRow>
                        <TableRow
                            key={type+'down'}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">Target Down</TableCell>
                            <TableCell align="right">{thisData.targetDown_predictionUp}</TableCell>
                            <TableCell align="right">{thisData.targetDown_predictionDown}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
                </TableContainer>
            </div>

        return Stats
    } else {
        return <Fragment></Fragment>
    }
}

export default StatsTable