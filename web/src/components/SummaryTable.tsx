import { useEffect, useState } from "react"
import { generateDatesFromYearBeggining } from "../utils/generate-range"
import HabitDay from "./HabitDay"
import { api } from "../lib/axios"
import dayjs from "dayjs"


const weekDays = [ 'D','S','T','Q', 'Q','S','S',]

const summaryDates = generateDatesFromYearBeggining()

//colocando uma quatidade minima de "quadradinhos"
const minumumSummaryDateSize = 18 * 7

const amountOfDaysToFill =  minumumSummaryDateSize - summaryDates.length  

type Summary = Array<{
    id:string;
    date:string;
    amount:number;
    completed:number;
}> 


export default function SummaryTable(){

    const [summary, setSummary] = useState<Summary>([])

    useEffect(() =>{
      api.get('summary').then(response => {
        setSummary(response.data)
      })
    },[])

    return(
        <div className="w-full flex ">
            <div className="grid grid-rows-7 grid-flow-row gap-3">
                {weekDays.map((weekDay,i)=>{ //quando temos um map é preciso colocar uma key que precisa ser uma string 
                    return(
                        <div 
                            key={`${weekDay}- ${i}`} 
                            className="text-md h-10 w-10 flex justify-center items-center">
                            {weekDay}
                        </div>
                    )
                })}
            </div>

            <div className="grid grid-rows-7 grid-flow-col gap-3">
                {summary.length >0 && summaryDates.map(date=>{

                    const dayInSummary = summary.find(day => {
                        return (
                            dayjs(date).isSame(day.date, 'day')
                        )
                    })

                    return <HabitDay 
                                key={date.toDateString()}
                                amount={dayInSummary?.amount}
                                date={date} 
                                defaultCompleted={dayInSummary?.completed} 
                            /> 
                })}

                {amountOfDaysToFill > 0 && 
                    Array.from({length: amountOfDaysToFill}).map((_,i)=>{
                        return(
                            <div 
                            key ={i}
                            className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-lg opacity-40 cursor-not-allowed"></div>
                        )
                    })}
            </div>
        </div>
    )
}