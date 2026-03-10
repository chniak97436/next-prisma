import { CloudLightning } from 'lucide-react'
import React, { useState } from 'react'
import { useCart } from './CartContext';

export default function CodePromo() {
    const [code, setCode] = useState('')
    const [succes , setSucces] = useState(null)
    const [message, setMessage] = useState('')
    const { setRemise } = useCart();

    const codePromo = async (e) => {
        e.preventDefault()
        const token = localStorage.getItem('token')
        const res = await fetch('/api/newsletter/check-promo/',{
            method : "POST",
            headers :{
                Authorization : `Bearer ${token}`,
            },
            body : JSON.stringify(
                {code}
            )
        })
        const data = await res.json()
        if (data.valide) {
           setSucces(true)
           setMessage(data.message)
           setRemise(data.remise)
           return message
        } else {
            setSucces(false)
            setMessage(data.message)
            return message
        }
    }

    return (
        <div className='ml-auto justify-center  space-x-3 '>
            {succes ? 
            (<p className=' text-left text-green-500 font-bold'>{message}</p>) 
            : 
            (<p className='text-left text-red-500 font-bold'>{message}</p>)}
            <button onClick={codePromo} className={`${succes ? 'disabled' : 'mt-4 w-full md:w-auto px-2 py-1 bg-[#F5CC60] text-[#292322] border-2 cursor-pointer border-[#292322] font-bold rounded-lg hover:bg-[#e7ba48] transition'}`}>
                Code Promo :
            </button>
            <input type="text"
                className='border-2 border-[#292322] py-1 w-[40%] text-[#292322] px-2 rounded-lg outline-0  bg-[#F5CC60]'
                value={code}
                onChange={(e) => setCode(e.target.value)} />
        </div>
    )
}
