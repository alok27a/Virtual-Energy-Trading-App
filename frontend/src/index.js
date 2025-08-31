import React from 'react'
import ReactDOM from 'react-dom/client'
import theme from './config/theme'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'

import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import DashboardPage from './pages/DashboardPage'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthProvider } from './context/AuthContext'

const router = createBrowserRouter([
	{
		path: '/',
		element: (
			<ProtectedRoute>
				<DashboardPage />
			</ProtectedRoute>
		)
	},
	{
		path: '/login',
		element: <LoginPage />
	},
	{
		path: '/signup',
		element: <SignupPage />
	}
])

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
	<React.StrictMode>
		<ChakraProvider theme={theme}>
			<AuthProvider>
				<RouterProvider router={router} />
			</AuthProvider>
		</ChakraProvider>
	</React.StrictMode>
)
