import * as Checkbox from '@radix-ui/react-checkbox'
import dayjs from 'dayjs';
import { Check } from 'phosphor-react';
import { useEffect, useState } from 'react'
import { api } from '../lib/axios';

interface HabitsListProps{
    date: Date;
    onCompletedChange: (completed: number) => void;
}

interface HabitsInfo{
    possibleHabits:Array<{
        id:string,
        title:string,
        create_at:string,
    }>,
    completedHabits:string[]
}

export default function HabitsList({date, onCompletedChange}: HabitsListProps){

    const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

    useEffect(()=>{
        api.get('day',{
            params:{
                date: date.toISOString(),
            }
        }).then(response =>{
            setHabitsInfo(response.data)
        })
    }, [])

    const isDayInPast = dayjs(date).endOf('day').isBefore(new Date()) 

    async function handleToggleHabit(habitId:string){
        const isHabitAlredyCompleted = habitsInfo!.completedHabits.includes(habitId)

        await api.patch(`habits/${habitId}/toggle`)

        let completedHabits:string[] = []

        if(isHabitAlredyCompleted){

            completedHabits= habitsInfo!.completedHabits.filter(id => id != habitId)
            
        }else{

            completedHabits = [...habitsInfo!.completedHabits, habitId]
    
        }

        setHabitsInfo({
            possibleHabits: habitsInfo!.possibleHabits,
            completedHabits,
        })

        onCompletedChange(completedHabits.length)
    }

    return(
        <div className='mt-4 flex flex-col gap-3'>

            {habitsInfo?.possibleHabits.map(habit =>{
                return(
                <Checkbox.Root
                    key={habit.id}
                    onCheckedChange={()=>handleToggleHabit(habit.id)}
                    checked={habitsInfo.completedHabits.includes(habit.id)}
                    className='flex items-center gap-3 group'>
                    <div className='h-6 w-6 rounded flex items-center justify-center bg-zinc-800 group-data-[state=checked]:bg-blue-500 transition-colors'>
                        <Checkbox.Indicator>
                            <Check size={20}/>
                        </Checkbox.Indicator>
                    </div>
    
                    <span className='group-data-[state=checked]:line-through'>
                        {habit.title}
                    </span>
    
                </Checkbox.Root>
                )
            })}

            
        </div>
    )
}