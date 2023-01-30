import * as Popover from '@radix-ui/react-popover';
import clsx from 'clsx';
import ProgressBar from './ProgressBar';
import dayjs from 'dayjs';
import HabitsList from './HabitsList';
import { useState } from 'react';

interface HabitDayProps {
    date: Date;
    defaultCompleted?: number
    amount?: number
}


export default function HabitDay({defaultCompleted=0, amount=0, date}:HabitDayProps){

    const [completed, setCompleted] = useState(defaultCompleted)

    const completePercent = amount > 0 ? Math.round((completed/amount) * 100) : 0

    const dayAndMonth = dayjs(date).format('DD/MM')

    const dayOfWeek = dayjs(date).format('dddd')

    function handleCompletedChange(completed:number){
        setCompleted(completed)
    }

    return(
        <Popover.Root>
            <Popover.Trigger 
                className={clsx('w-10 h-10 border border-zinc-800 rounded-lg transitions-colors', {
                    'bg-zinc-900': completePercent == 0,
                    'bg-blue-500':completePercent > 0 && completePercent <20,
                    'bg-blue-600':completePercent >= 20 && completePercent <40,
                    'bg-blue-700':completePercent >= 40 && completePercent <60,
                    'bg-blue-800':completePercent >= 60 && completePercent <80,
                    'bg-blue-900':completePercent >= 80,
                })}
                />

            <Popover.Portal>
                <Popover.Content className='min-w-[320px] p-6 rounded-2xl backdrop-blur bg-glass flex flex-col'>
                    <span className='text-sm'>
                        {dayOfWeek}
                    </span>

                    <span className='mt-1 leading-tight text-2xl font-bold'>
                        {dayAndMonth}
                    </span>
                    
                    <ProgressBar progress={completePercent}/>

                    <HabitsList date={date} onCompletedChange={handleCompletedChange}/>

                    <Popover.Arrow height={8} width={16} className="fill-glass"/>

                </Popover.Content>
            </Popover.Portal>
        </Popover.Root>
    )
}