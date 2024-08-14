import LoginLinks from '@/app/LoginLinks'
import ApplicationLogo from '@/components/ApplicationLogo'

export const metadata = {
    title: 'Chat Bot',
}

const Home = () => {
    return (
        <>
            <div className="relative items-top justify-center min-h-screen bg-purple sm:items-center sm:pt-0 flex flex-col">
                <div className="flex flex-col sm:justify-center items-center pt-6 sm:pt-0">
                    <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    <h2>AI Chat Bot Assistant by Rizki Sahat</h2>
                </div>
                <LoginLinks />
            </div>
        </>
    )
}

export default Home
