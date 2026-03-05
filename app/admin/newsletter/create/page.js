"use client"
import { Group, Mail, User, UserSearch } from 'lucide-react';
import React, { useState } from 'react'


export default function createNewsletter() {
  const [newsletter, setNewsletter] = useState(null)
  const [subject, setSubject] = useState('')
  const [text, setText] = useState('')
  const [submitStatus, setSubmitStatus] = useState(null) // null = not submitted, true = success, false = failed

  const newsSubmit = async (e) => {
    e.preventDefault()
    const res = await fetch('/api/newsletter')
    const data = await res.json()
    // API returns { data: [...] }, so access data.data
    const subscribers = data.data || []
    const to = subscribers.map((mail) => mail.email)
    console.log("Emails to send:", to)

    // Send emails aux users inscris avec l array (to) 
    const payload = {
            subject,
            text,
            to
        }
    const response = await fetch('/api/newsletter/send/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })
    const dt = await response.json()
        if (dt) {
            setSubmitStatus(true)
        } else {
            setSubmitStatus(false)
        }
  }

  return (
    <div className=' text-[#F5CC60]'>
      <div className="p-1 bg-[#F5CC60]/40 rounded-lg mb-10">

        <h1 className='flex text-xl font-bold my-6 w-full'><UserSearch className='w-6 h-6 inline mr-2' />Envoyer une <strong className='flex flex-row align-bottom'>  : NEWSLETTER</strong></h1>
      </div>


      <form onSubmit={newsSubmit} className='w-full mx-auto border border-[#F5CC60] p-6 rounded-md' >
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
