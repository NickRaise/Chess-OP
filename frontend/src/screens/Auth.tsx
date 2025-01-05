import AuthOptions from '../components/AuthOptions'
import Heading from '../components/Heading'
const Auth = () => {
    return (
        <div className='h-full flex justify-center items-center'>
            <div className='p-4 md:p-0'>
                <Heading title='Enter the Game World' />
                <AuthOptions />
            </div>
        </div>
    )
}

export default Auth