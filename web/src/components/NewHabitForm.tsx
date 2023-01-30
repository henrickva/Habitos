import {CheckSquareOffset, Check} from 'phosphor-react'
import * as Checkbox from '@radix-ui/react-checkbox';
import { FormEvent, useState} from "react";
import { api } from '../lib/axios';

const availableWeekDays = [
    'Domingo', 'Segunda-Feira', 'Terça-Feira','Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'
]

export default function NewHabitForm(){

    const [title, setTitle] = useState('')
    const [weekDays, setWeekDays] = useState<number[]>([])

    async function createNewHabit(event: FormEvent){
        event.preventDefault()

        if(!title || weekDays.length ==0){
            return
        }

        api.post('habits',{
            title,
            weekDays,
        })

        setTitle('')
        setWeekDays([])

        alert('Hábito criado com sucesso')
    }

    function handleToggleWeekDay(weekDay:number){
        if(weekDays.includes(weekDay)){
            const weekDaysWithRemovedOne = weekDays.filter(day=>day != weekDay)

            setWeekDays(weekDaysWithRemovedOne)
        }else{
            const weekDaysWithAddedOne = [...weekDays, weekDay]

            setWeekDays(weekDaysWithAddedOne)
        }
    }

    return(
        <form 
        className='w-full flex flex-col mt-4'
        onSubmit={createNewHabit}
        >
            <label htmlFor="title">
                Qual o sua meta?
            </label>

            <input 
                type='text'
                id='title'
                placeholder="ex. dormir, beber agua, etc.."
                className='mt-2 text-sm rounded p-2 text-blue-900 focus:outline-none'
                value={title}
                onChange={event => setTitle(event?.target.value)}
            />

            <label htmlFor="" className='mt-4'>
                Em quais dias da semana ?
            </label>
                
            <div className='mt-2 flex flex-col gap-2 '>
                {availableWeekDays.map((weekDay,index)=>{
                    return(
                        <Checkbox.Root
                            key={weekDay}
                            className='flex items-center gap-3 group'
                            checked={weekDays.includes(index)}
                            onCheckedChange={()=>
                                handleToggleWeekDay(index)
                            }>
                            <div className='h-6 w-6 rounded flex items-center justify-center bg-white group-data-[state=checked]:bg-blue-500 transition-colors'>
                                <Checkbox.Indicator>
                                    <Check size={20}/>
                                </Checkbox.Indicator>
                            </div>

                            <span className='text-sm'>
                                {weekDay}
                            </span>
                        </Checkbox.Root>
                    )
                })}

                
            </div>

            <button 
                type="submit" 
                className='flex justify-center bg-blue-300 hover:bg-blue-200 gap-3 p-2 mt-3 rounded-lg text-blue-900 transition-colors'
                >
                <CheckSquareOffset size={22} weight="fill" />
                Confirmar
            </button>
        </form>
    )
}