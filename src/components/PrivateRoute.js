import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { auth } from '../firebase'

const PrivateRoute = ({ children, requireAdmin = false }) => {
	const [user, setUser] = useState(null)
	const [loading, setLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)

	useEffect(() => {
		const checkAdmin = () => {
			const adminFlag =
				localStorage.getItem('isAdmin') === 'true' ||
				sessionStorage.getItem('isAdmin') === 'true'
			const adminUser = localStorage.getItem('adminUser')

			if (adminFlag || adminUser) {
				setIsAdmin(true)
				setUser({ uid: 'admin', email: 'admin@banketam.net' })
				setLoading(false)
				return true
			}
			return false
		}

		if (checkAdmin()) {
			return
		}

		const unsubscribe = auth.onAuthStateChanged(firebaseUser => {
			setUser(firebaseUser)
			setLoading(false)
		})

		return () => unsubscribe()
	}, [])

	if (loading) {
		return (
			<div
				style={{
					padding: 20,
					textAlign: 'center',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '100vh',
				}}
			>
				Загрузка...
			</div>
		)
	}

	if (!user) {
		return <Navigate to='/login' />
	}

	if (requireAdmin) {
		const isAdminUser =
			isAdmin ||
			localStorage.getItem('isAdmin') === 'true' ||
			sessionStorage.getItem('isAdmin') === 'true' ||
			user?.email === 'admin@banketam.net'

		if (!isAdminUser) {
			console.log('Доступ запрещен: требуется администратор')
			return <Navigate to='/dashboard' />
		}
	}

	return children
}

export default PrivateRoute
