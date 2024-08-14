'use client'

import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import {
    Login,
    AddOutlined,
    SentimentDissatisfiedOutlined,
    VisibilityOff,
    Visibility,
} from '@mui/icons-material'
import { useAuth } from '@/hooks/auth'

axios.defaults.withCredentials = true

const getCSRFToken = async () => {
    return axios.defaults.headers.common['X-XSRF-TOKEN']
}

const Dashboard = () => {
    const [conversations, setConversations] = useState([])
    const [currentConversation, setCurrentConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const messagesEndRef = useRef(null)
    const [activeConversationId, setActiveConversationId] = useState(null)
    const { logout } = useAuth()
    const [recommendedQuestions, setRecommendedQuestions] = useState([])
    const [displayedText, setDisplayedText] = useState('')
    const [isAITyping, setIsAITyping] = useState(false)
    const { user } = useAuth({ middleware: 'auth' })

    useEffect(() => {
        fetchConversations()
    }, [])

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const fetchConversations = async () => {
        try {
            await getCSRFToken()
            const response = await axios.get(
                'http://localhost:8000/api/conversations',
            )
            setConversations(response.data)
        } catch (error) {
            console.error('Error fetching conversations:', error)
        }
    }

    const fetchMessages = async conversationId => {
        try {
            await getCSRFToken()
            const response = await axios.get(
                `http://localhost:8000/api/conversations/${conversationId}`,
            )
            setCurrentConversation(response.data)
            setMessages(response.data.messages)
            setActiveConversationId(conversationId)
            setRecommendedQuestions([])
        } catch (error) {
            console.error('Error fetching messages:', error)
        }
    }
    const createNewConversation = async (message = null) => {
        try {
            await getCSRFToken()
            const payload = message
                ? { message }
                : { title: 'New Conversation' }
            const response = await axios.post(
                'http://localhost:8000/api/conversations',
                payload,
            )
            const newConversation = response.data.conversation || response.data
            setConversations(prevConversations => [
                newConversation,
                ...prevConversations,
            ])
            setCurrentConversation(newConversation)
            setMessages(response.data.messages || [])
            setActiveConversationId(newConversation.id)
            setRecommendedQuestions(response.data.recommendedQuestions || [])
            setInput('')
        } catch (error) {
            console.error('Error creating new conversation:', error)
        }
    }

    const handleSubmit = async e => {
        e.preventDefault()
        if (!input.trim() || isLoading || isAITyping) return

        setIsLoading(true)
        try {
            if (!currentConversation) {
                await createNewConversation(input)
            } else {
                await getCSRFToken()
                const userMessage = {
                    id: 'user-' + Date.now(),
                    sender: 'user',
                    content: input,
                }
                setMessages(prev => [...prev, userMessage])
                setInput('')

                const response = await axios.post(
                    `http://localhost:8000/api/conversations/${currentConversation.id}/messages`,
                    { message: input },
                )
                const aiMessage =
                    response.data.messages[response.data.messages.length - 1]

                setMessages(prev => [...prev, aiMessage])

                simulateTyping(aiMessage.content)

                setRecommendedQuestions(response.data.recommendedQuestions)
            }
        } catch (error) {
            console.error('Error sending message:', error)
        }
        setIsLoading(false)
    }

    const handleCreateNewConversation = () => {
        setCurrentConversation(null)
        setMessages([])
        setActiveConversationId(null)
        setRecommendedQuestions([])
        setInput('')
    }
    const simulateTyping = (text, speed = 0.1) => {
        setIsAITyping(true)
        let i = 0
        setDisplayedText('')

        function typeChar() {
            if (i < text.length) {
                setDisplayedText(prev => prev + text.charAt(i))
                i++
                setTimeout(typeChar, speed)
            } else {
                setIsAITyping(false)
                setDisplayedText('')
            }
        }

        typeChar()
    }

    const handleRecommendedQuestionClick = question => {
        setInput(question)
    }

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const formatMessageContent = content => {
        const parts = content.split(/(```[\s\S]*?```|\n\n)/)

        return parts.map((part, idx) => {
            if (part.startsWith('```') && part.endsWith('```')) {
                const language = part.match(/```(\w+)/)?.[1] || ''
                const codeContent = part
                    .slice(part.indexOf('\n') + 1, -3)
                    .trim()
                return (
                    <pre
                        key={idx}
                        className="bg-gray-800 p-2 rounded-md text-white overflow-x-auto">
                        <code className={`language-${language}`}>
                            {codeContent}
                        </code>
                    </pre>
                )
            }

            if (part.startsWith('`') && part.endsWith('`')) {
                const inlineCode = part.slice(1, -1).trim()
                return (
                    <code
                        key={idx}
                        className="bg-gray-800 text-white p-1 rounded">
                        {inlineCode}
                    </code>
                )
            }

            return (
                <p key={idx} className="mb-2">
                    {part.trim()}
                </p>
            )
        })
    }

    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen)
    }

    return (
        <main className="grid min-h-screen grid-cols-1 lg:grid-cols-6 items-center">
            {!isDropdownOpen && (
                <div className="block lg:hidden bg-purple p-3">
                    <button
                        onClick={toggleDropdown}
                        className="text-teal-400 text-xl bg-beige p-2 rounded-lg flex flex-row align-center justify-center gap-4">
                        <Visibility /> Show Conversation
                    </button>
                </div>
            )}

            <div
                className={`${
                    isDropdownOpen ? 'block' : 'hidden'
                } lg:flex flex-col bg-beige h-full max-h-screen overflow-y-auto`}>
                <div className="flex justify-between p-3">
                    <div
                        className="w-12 h-12 overflow-hidden cursor-pointer rounded-md border-beige hover:border-beige border text-center hover:bg-purple"
                        title="Logout">
                        <Login
                            onClick={logout}
                            sx={{ width: 1, height: 1, p: 1 }}
                        />
                    </div>
                    {isDropdownOpen && (
                        <div className="block lg:hidden">
                            <button
                                onClick={toggleDropdown}
                                className="text-teal-400 text-xl p-3 flex flex-row align-center justify-center gap-4">
                                <VisibilityOff /> Hide Conversation
                            </button>
                        </div>
                    )}
                    <div
                        onClick={handleCreateNewConversation}
                        className="w-12 h-12 overflow-hidden cursor-pointer rounded-md border-beige hover:border-beige border text-center hover:bg-purple"
                        title="Create a New Conversation">
                        <AddOutlined sx={{ width: 1, height: 1, p: 1 }} />
                    </div>
                </div>
                <div className="flex flex-col p-3 px-5">
                    {conversations ? (
                        <>
                            {conversations.map(conversation => (
                                <div
                                    className={`rounded-lg p-2 border overflow-hidden text-start cursor-pointer mb-2 ${
                                        activeConversationId === conversation.id
                                            ? 'bg-purple border-purple text-teal-400'
                                            : 'border-beige hover:border-purple'
                                    }`}
                                    key={conversation.id}
                                    onClick={() =>
                                        fetchMessages(conversation.id)
                                    }>
                                    <p>{conversation.title}</p>
                                </div>
                            ))}
                        </>
                    ) : (
                        <h1 className="text-center bg-purple border border-semipurple p-2 text-black rounded-lg">
                            No conversations yet{' '}
                            <SentimentDissatisfiedOutlined />
                        </h1>
                    )}
                </div>
            </div>
            <div className="bg-purple z-10 items-center justify-between font-mono text-sm h-full max-h-full col-span-5 lg:col-span-5">
                <h1 className="lg:text-2xl font-bold lg:text-start text-lg text-center p-3 text-teal-400">
                    Currently Chatting with {user?.name}
                </h1>
                <div className="shadow-md w-full mx-auto h-fit">
                    {currentConversation ? (
                        <>
                            <div className="h-[50vh] lg:h-[70.5vh] overflow-y-auto p-4 space-y-4">
                                {messages.map((message, index) => (
                                    <div
                                        key={message.id}
                                        className={`flex ${
                                            message.sender === 'user'
                                                ? 'justify-end'
                                                : 'justify-start'
                                        }`}>
                                        <div
                                            className={`${
                                                message.sender === 'user'
                                                    ? 'bg-semipurple text-white'
                                                    : 'text-gray-200 bg-beige p-5'
                                            } rounded-lg p-3 max-w-full lg:max-w-3xl text-base`}>
                                            {message.sender === 'user' ? (
                                                message.content
                                            ) : (
                                                <div>
                                                    {index ===
                                                        messages.length - 1 &&
                                                    isAITyping
                                                        ? displayedText
                                                        : formatMessageContent(
                                                              message.content,
                                                          )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="p-2 h-[25vh] lg:h-[16vh] flex flex-col w-full overflow-y-auto">
                                {recommendedQuestions &&
                                recommendedQuestions.length > 0 ? (
                                    <>
                                        {recommendedQuestions.map(
                                            (question, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() =>
                                                        handleRecommendedQuestionClick(
                                                            question,
                                                        )
                                                    }
                                                    className="mr-2 mb-2 p-3 bg-semipurple text-white w-fit rounded-lg text-sm hover:bg-beige">
                                                    <p className="text-start text-white">
                                                        {question}
                                                    </p>
                                                </button>
                                            ),
                                        )}
                                    </>
                                ) : (
                                    <div className="flex justify-center items-center align-middle w-full h-full">
                                        <h1 className="text-teal-400 p-4 text-lg lg:text-xl lg:p-0 text-center">
                                            Start Chatting to get some question
                                            recommendation!
                                        </h1>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <div className="h-[75vh] lg:h-[86.5vh] flex items-center justify-center">
                            <p className="text-teal-400 p-4 text-lg lg:text-xl lg:p-0 text-center">
                                Start a new conversation by typing a message
                                below!
                            </p>
                        </div>
                    )}
                    <div>
                        <form onSubmit={handleSubmit} className="p-4 flex">
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Type your message..."
                                className="flex-grow px-3 py-2 border border-semipurple rounded-l-md focus:outline-none focus:ring-2 focus:ring-red text-white bg-beige placeholder-white"
                                disabled={isLoading || isAITyping}
                            />
                            <button
                                type="submit"
                                className="bg-beige text-white px-4 border border-semipurple py-2 rounded-r-md hover:bg-semipurple focus:outline-none focus:ring-2 focus:ring-beige"
                                disabled={isLoading || isAITyping}>
                                {isLoading
                                    ? 'Sending...'
                                    : isAITyping
                                      ? 'AI Typing...'
                                      : 'Send'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default Dashboard
