import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { LogIn, AlertCircle } from 'lucide-react'
import Slider from '../components/Slider'

const Container = styled.div`
	min-height: 100vh;
	background-color: #f5f5f5;
`

const Content = styled.div`
	padding: 20px;
	max-width: 390px;
	margin: 0 auto;
`

const Card = styled.div`
	background: white;
	border-radius: 24px;
	padding: 28px 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const Title = styled.h1`
	font-size: 28px;
	font-weight: 600;
	margin-bottom: 8px;
	color: #1a1a1a;
	letter-spacing: -0.5px;
`

const Subtitle = styled.p`
	font-size: 14px;
	color: #666;
	margin-bottom: 32px;
`

const InputGroup = styled.div`
	margin-bottom: 20px;
`

const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #333;
	margin-bottom: 8px;
`

const Input = styled.input`
	width: 100%;
	padding: 14px 16px;
	border: 1px solid ${props => (props.error ? '#e53935' : '#e0e0e0')};
	border-radius: 12px;
	font-size: 16px;
	transition: all 0.2s;
	background: white;

	&:focus {
		outline: none;
		border-color: #1a1a1a;
	}
`

const ErrorMessage = styled.div`
	display: flex;
	align-items: center;
	gap: 6px;
	color: #e53935;
	font-size: 12px;
	margin-top: 6px;
`

const Button = styled.button`
	width: 100%;
	padding: 14px;
	background: #1a1a1a;
	color: white;
	border: none;
	border-radius: 12px;
	font-size: 16px;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	transition: background 0.2s;

	&:hover {
		background: #333;
	}
`

const LinkText = styled.div`
	text-align: center;
	margin-top: 24px;
	font-size: 14px;
	color: #666;

	a {
		color: #1a1a1a;
		text-decoration: none;
		font-weight: 500;
		margin-left: 4px;
	}
`

const Login = () => {
	const [loginInput, setLoginInput] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const findEmailByLogin = async login => {
		try {
			const usersRef = collection(db, 'users')
			const q = query(usersRef, where('login', '==', login))
			const querySnapshot = await getDocs(q)

			if (!querySnapshot.empty) {
				const userData = querySnapshot.docs[0].data()
				return userData.email
			}
			return null
		} catch (error) {
			console.error('Ошибка поиска логина:', error)
			return null
		}
	}

	const handleLogin = async e => {
		e.preventDefault()
		setError('')
		setLoading(true)

		if (loginInput === 'Admin26' && password === 'Demo20') {
			console.log('Администратор авторизован')
			localStorage.setItem('isAdmin', 'true')
			sessionStorage.setItem('isAdmin', 'true')
			localStorage.setItem('adminLogin', 'true')

			const adminUser = {
				uid: 'admin_uid_' + Date.now(),
				email: 'admin@banketam.net',
				displayName: 'Administrator',
				isAdmin: true,
			}
			localStorage.setItem('adminUser', JSON.stringify(adminUser))
			sessionStorage.setItem('adminUser', JSON.stringify(adminUser))

			setLoading(false)
			console.log('Перенаправление в админку...')
			navigate('/admin')
			return
		}

		try {
			let email = loginInput

			if (!loginInput.includes('@')) {
				const foundEmail = await findEmailByLogin(loginInput)
				if (foundEmail) {
					email = foundEmail
				} else {
					setError('Пользователь с таким логином не найден')
					setLoading(false)
					return
				}
			}

			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password,
			)

			localStorage.removeItem('isAdmin')
			localStorage.removeItem('adminLogin')
			localStorage.removeItem('adminUser')
			sessionStorage.removeItem('isAdmin')
			sessionStorage.removeItem('adminUser')

			setLoading(false)
			navigate('/dashboard')
		} catch (err) {
			console.error('Ошибка входа:', err)
			setError('Неверный логин или пароль')
			setLoading(false)
		}
	}

	return (
		<Container>
			<Content>
				<Slider />
				<Card>
					<Title>Вход</Title>
					<Subtitle>Войдите в свой аккаунт</Subtitle>

					<form onSubmit={handleLogin}>
						<InputGroup>
							<Label>Логин или Email</Label>
							<Input
								type='text'
								value={loginInput}
								onChange={e => setLoginInput(e.target.value)}
								error={error}
								placeholder='Admin26 или ваш логин'
								required
							/>
						</InputGroup>

						<InputGroup>
							<Label>Пароль</Label>
							<Input
								type='password'
								value={password}
								onChange={e => setPassword(e.target.value)}
								error={error}
								placeholder='••••••••'
								required
							/>
						</InputGroup>

						{error && (
							<ErrorMessage>
								<AlertCircle size={14} />
								{error}
							</ErrorMessage>
						)}

						<Button type='submit' disabled={loading}>
							<LogIn size={18} />
							{loading ? 'Вход...' : 'Войти'}
						</Button>
					</form>

					<LinkText>
						Еще не зарегистрированы?
						<Link to='/register'>Регистрация</Link>
					</LinkText>
				</Card>
			</Content>
		</Container>
	)
}

export default Login
