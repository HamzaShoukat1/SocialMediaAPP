import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../button'
import { useSIgnoutAccountmutation } from '@/lib/reactquery/queryandmutations'
import { useAppDispatch, useAppSelector } from '@/Store/usehook'
import { logout } from '@/Store/AuthSlice'

const TopBar = () => {
    const dispatch = useAppDispatch()
      const { user } = useAppSelector(state => state.auth);
    
    const {mutate:SignOut} = useSIgnoutAccountmutation({
         onSuccess: ()=> {
        dispatch(logout())
        naviagte('/sign-in')
            }
    })
    const naviagte = useNavigate()

    
  return (
    <section className=' sticky top-0 '>

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
              {user?.$id && (
                  <Link to={`/profile/${user?.$id}`} className='flex items-center gap-3'>
                <img src={ user?.imageUrl || '/assets/icons/profile-placeholder.svg' } className='h-8 w-8   rounded-full' />

                </Link>
              )}


            </div>


        </div>
        
    </section>

  )
}

export default TopBar