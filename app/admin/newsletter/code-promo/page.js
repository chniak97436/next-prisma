"use client"
import React, { useState, useEffect } from 'react'
import { UserSearch } from 'lucide-react'
import { Mail,HandCoins } from 'lucide-react'

export default function codePromo() {

    const [noCodeUsed, setNoCodeUsed] = useState(true)
    const [promoCode, setPromoCode] = useState('')
    const [subject, setSubject] = useState('')
    const [text, setText] = useState('')
    const [submitStatus, setSubmitStatus] = useState(null) // null = not submitted, true = success, false = failed
    useEffect(() => {
         async function fetchUsedPromo() {
            const res = await fetch('/api/newsletter/?promoCodeUsed=true')
            const { emails } = await res.json();
            // Vérifier si le tableau emails est vide ou non
            if (emails.length === 0) {
                setNoCodeUsed(true);
            }
            else {
                setNoCodeUsed(false);
            }
            return ;
        }
        fetchUsedPromo()

    }, [noCodeUsed]);
    const codeSubmit = async (e) => {
        e.preventDefault()
        // ?promoCodeUsed=true recup les data qui on true la colonne promocode si code promo utillisé
        const res = await fetch('/api/newsletter/?promoCodeUsed=true')
        const { emails } = await res.json();

        console.log("to : ", emails);

        const payload = {
            subject,
            text,
            to: emails,
            promoCode,
        }
        console.log(payload)

        const sendCode = await fetch('/api/newsletter/codePromo/', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        })
        const data = await sendCode.json()
        if (data.succes) {
            setSubmitStatus(true)
        } else {
            setSubmitStatus(false)
        }
    }

    return (
        <div className=' text-[#F5CC60]'>
            <div className="p-1 bg-[#F5CC60]/40 rounded-lg mb-10">

                <h1 className='flex text-xl font-bold my-6 w-full '><UserSearch className='w-6 h-6 inline mx-4' />Envoyer un : code Promo.</h1>
            </div>
            {noCodeUsed ? (
                <div className="text-center py-12">
                    <HandCoins className="w-16 h-16 text-[#F5CC60]/80 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-[#F5CC60] mb-2">Aucun code promotion utilisé.</h3>
                    
                </div>
            ) : (

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
            )}
        </div>

    )
}
