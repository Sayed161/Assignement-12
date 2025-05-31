import React from 'react'
import Hero from '../Shared/Hero'
import BestWorkers from '../Shared/bestWorkers'
import ListTasks from '../Shared/ListTasks'
import Testimonials from '../Shared/Testomonials'
import Workplace from '../Shared/Workplace'



const AuthLayout = () => {
  return (
    <div>
    <Hero/>
    <BestWorkers/>
    <ListTasks/>
    <Testimonials/>
    <Workplace/>
    </div>
  )
}

export default AuthLayout
