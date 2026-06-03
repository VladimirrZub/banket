import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'
import Admin from './pages/Admin'
import PrivateRoute from './components/PrivateRoute'

function App() {
	return (
		<Router>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
				<Route
					path='/dashboard'
					element={
						<PrivateRoute>
							<Dashboard />
						</PrivateRoute>
					}
				/>
				<Route
					path='/booking'
					element={
						<PrivateRoute>
							<Booking />
						</PrivateRoute>
					}
				/>
				<Route
					path='/admin'
					element={
						<PrivateRoute requireAdmin={true}>
							<Admin />
						</PrivateRoute>
					}
				/>
			</Routes>
		</Router>
	)
}

export default App