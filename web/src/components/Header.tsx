import {Plus, XCircle} from 'phosphor-react'
import * as Dialog from '@radix-ui/react-dialog';
import NewHabitForm from './NewHabitForm';

export default function Header() {
  return(
      <div className="w-full max-w-3xl mx-auto flex justify-between items-center">
        <h1 className="font-semibold">Hábitos</h1>

        <Dialog.Root>
          <Dialog.Trigger
            type="button" 
            className="border border-blue-900 hover:border-blue-300 hover:text-blue-300 rounded-md px-6 py-4 flex items-center gap-2"
            >
            <Plus size={20} /> 
            Novo Habito
          </Dialog.Trigger> 

          <Dialog.Portal>
            <Dialog.Overlay className="w-screen h-screen fixed backdrop-blur-sm bg-glass inset-0"/>
            <Dialog.Content 
              className='absolute p-10 bg-blue-900 rounded-2xl max-w-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'
              >
                <Dialog.Close className='absolute right-3 top-3 text-white '>
                  <XCircle size={22} />
                </Dialog.Close>

                <Dialog.Title className='text-2xl leading-tight'>
                  Criar Hábito
                </Dialog.Title>

                <NewHabitForm />
                
            </Dialog.Content>   
          </Dialog.Portal>

        </Dialog.Root>    
      </div>
    )
}