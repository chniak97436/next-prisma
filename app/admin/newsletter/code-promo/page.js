"use client"
import React, { useState } from 'react'
import { UserSearch } from 'lucide-react'
import { Mail } from 'lucide-react'


export default function codePromo() {

    const [promoCode, setPromoCode] = useState('')
    const [subject, setSubject] = useState('')
    const [text, setText] = useState('')
    const [to,setTo] = useState({})
    const [message, setMessage] = useState('')
    const [succes, setSucces] = useState(null)
    const [submitStatus, setSubmitStatus] = useState(null) // null = not submitted, true = success, false = failed

    const codeSubmit = async (e) => {
        e.preventDefault()
        // ?promoCodeUsed=true recup les data qui on true la colonne promocode le code promo
        const res = await fetch('/api/newsletter/?promoCodeUsed=true')
        const  {emails} = await res.json();

        // Les emails sont dans data.map
       
        console.log(emails);
        
        const payload = {
            subject,
            text,
            to : emails,
            promoCode,
        }
        console.log(payload)
        // const promo = await fetch('/api/newsletter/code-promo/?promoCodeUsed=true', {
        //     method: "POST",
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify(payload)
        // })
        // const {dt} = await promo.json()
        // const emails = dt.map(i => i.email);
        // console.log(emails)
        // if (emails) {
        //     setSubmitStatus(true)
        // } else {
        //     setSubmitStatus(false)
        // }
    }

    return (
        <div className=' text-[#F5CC60]'>
            <div className="p-1 bg-[#F5CC60]/40 rounded-lg mb-10">

                <h1 className='flex text-xl font-bold my-6 w-full '><UserSearch className='w-6 h-6 inline mx-4' />Envoyer un : code Promo.</h1>
            </div>

            <form onSubmit={codeSubmit} className='w-full mx-auto border border-[#F5CC60] p-6 rounded-md' >
                <div className='flex flex-col p-2 my-4'>
                    <label htmlFor='subject'
                        className='p-2 mb-1'
                    >Subject :
                    </label>
                    <input type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        placeholder='Subject...'
                        className='p-2 mb-1 border border-[#F5CC60] rounded'
                    />
                </div>

                <div className='flex flex-col p-2 my-4'>
                    <label htmlFor='promocode'
                        className='p-2 mb-1'
                    >code :
                    </label>
                    <input type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder='Code...'
                        className='p-2 mb-1 border border-[#F5CC60] rounded'
                    />
                </div>

                <div className='flex flex-col p-2 my-4'>
                    <label htmlFor='message'
                        className='p-2 mb-1' >Message :</label>
                    <textarea type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder='Votre message...'
                        className='p-2 mb-1 border border-[#F5CC60] rounded'
                    />
                </div>
                {submitStatus === true && (
                    <div className='w-[50%] mx-auto bg-green-800 text-green-300 mb-4 p-2 rounded'>
                        <p className='text-center font-bold'>Message envoyé avec succes.</p>
                    </div>
                )}
                {submitStatus === false && (
                    <div className='w-[50%] mx-auto bg-red-800 text-red-300 mb-4 p-2 rounded'>
                        <p className='text-center font-bold'>Echec lors de l'envoie du message.</p>
                    </div>
                )}
                <button type='submit'
                    className='px-2 py-1 bg-[#F5CC60]/40 hover:bg-[#F5CC60] hover:text-[#292322] text-[#F5CC60] font-black rounded'><Mail className='inline' /> Envoyer</button>
            </form>
        </div>

    )
}
