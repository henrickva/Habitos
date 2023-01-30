import { prisma } from './prisma'
import {FastifyInstance} from "fastify";
import {z} from 'zod'
import dayjs from 'dayjs'

export async function appRoutes(app: FastifyInstance){
    //criando uma rota que vai colocar o habito de acordo com o que o usuario digitar (criação do hábito)
    //precisa reber dois parametros que é o titulo e o dia da semana.
    app.post('/habits', async(request)=>{

        const createHabitBody = z.object({
            title: z.string(),
            weekDays: z.array(
                z.number()
                .min(0)
                .max(6)
                )
        })

        const { title, weekDays } = createHabitBody.parse(request.body)

        const today = dayjs().startOf('day').toDate()

        await prisma.habit.create({
            data:{
                title,
                create_at: today,
                weekDays: {
                    create: weekDays.map(weekDay =>{
                        return{
                            week_day: weekDay,
                        }
                    })
                }
            }
        })
    })

    //criando uma rota do que vai retornar os habitos de um dia especifico no calendário
    app.get('/day', async (request) => {
        
        const getDayParams = z.object({
            date: z.coerce.date() //coerce basicamente vai receber uma string e transformar ela em number
        })

        const { date } = getDayParams.parse(request.query)

        const parsedDate = dayjs(date).startOf('day')
        const weekDay = parsedDate.get('day')

        const possibleHabits = await prisma.habit.findMany({
            where:{
                create_at: {
                    lte: date,
                },
                weekDays: {
                    some: {
                        week_day: weekDay,
                    }
                }
            }
        })

        //retornar habitos completos do dia 

        const day = await prisma.day.findUnique({
            where: {
                date: parsedDate.toDate(),
            },
            include: {
                dayHabits: true,
            }
        })

        const completedHabits = day?.dayHabits.map(dayHabit =>{
            return dayHabit.habit_id
        })?? []

        return {
            possibleHabits, 
            completedHabits, // fazendo retorno apenas do id do habito que foi completado naquel dia
        }
    })

    //marcar e desmarcar os hábitos
    app.patch('/habits/:id/toggle', async (request)=>{
        
        const toggleHabitsParams = z.object({
            id: z.string().uuid(),
        })

        const {id} = toggleHabitsParams.parse(request.params) 

        const today = dayjs().startOf('day').toDate()
        
        let day = await prisma.day.findUnique({
            where:{
                date: today,
            }
        })

        if (!day) {
            day = await prisma.day.create({
                data:{
                    date:today,
                }
            })
        }
        
        const dayHabit = await prisma.dayHabit.findUnique({
            where: {
                day_id_habit_id: {
                    day_id: day.id,
                    habit_id: id,
                }
            }
        })

        if(dayHabit){
            await prisma.dayHabit.delete({
                where:{
                    id:dayHabit.id
                }
            })
        }else{
            //completando o hábito no dia pela primeira vez 
            await prisma.dayHabit.create({
                data:{
                    day_id: day.id,
                    habit_id: id,
                }
            })
        }    
    })

    app.get('/summary', async ()=>{
        
        const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(count(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed,
        (
          SELECT
            cast(count(*) as float)
          FROM habit_week_days HDW
          JOIN habits H
            ON H.id = HDW.habit_id
          WHERE
            HDW.week_day = cast(strftime('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.create_at <= D.date
        ) as amount
      FROM days D
    `
        return summary
    })
}




