import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../button'
import { useSIgnoutAccountmutation } from '@/lib/reactquery/queryandmutations'
import { useEffect } from 'react'
import { useAuthContext } from '@/context/Authcontext/AuthContext'

const TopBar = () => {
    const {mutate:SignOut, isSuccess} = useSIgnoutAccountmutation()
    const naviagte = useNavigate()
    const {user} = useAuthContext()
    useEffect(() => {
        if(isSuccess) naviagte(0)
     
    }, [isSuccess])
    
  return (
    <section className='  '>

        <div className='flex justify-between py-3 px-5'>
            <Link to='/' className='flex items-center gap-2'>
            <img src='/assets/icons/images/logo.svg'
            //   alt='logo' 
              width={130}
             height={320}
             />
            </Link>

            {/* // */}
            <div className='flex gap-3'>
                <Button variant='ghost' className='md:hidden'
                onClick={()=> SignOut()}>
                    <img src='/assets/icons/logout.svg' alt='logout' />
                </Button>
                <Link to={`/profile/${user.id}`} className='flex items-center gap-3'>
                <img src={ user.imageUrl || '/assets/icons/profile-placeholder.svg' } className='h-8 w-8   rounded-full' />

                </Link>


            </div>


        </div>
        
    </section>

  )
}

export default TopBar