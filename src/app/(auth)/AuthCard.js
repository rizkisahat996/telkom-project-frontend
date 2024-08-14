const AuthCard = ({ logo, children }) => (
    <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-purple">
        <div>{logo}</div>
        <h2>AI Chat Bot Assistant by Rizki Sahat</h2>
        <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-beige shadow-md overflow-hidden sm:rounded-lg">
            {children}
        </div>
    </div>
)

export default AuthCard
