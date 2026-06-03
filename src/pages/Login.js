import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { LogIn, AlertCircle, ArrowLeft } from 'lucide-react'

const Container = styled.div`
	min-height: 100vh;
	background-color: #f5f5f5;
	display: flex;
	flex-direction: column;
`

const Header = styled.div`
	padding: 24px 5%;

	@media (min-width: 768px) {
		padding: 32px 8%;
	}
`

const BackButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: #1a1a1a;
	padding: 8px 0;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	font-size: 16px;
	font-weight: 500;

	&:hover {
		opacity: 0.7;
	}
`

const Content = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 20px 5% 60px;

	@media (min-width: 768px) {
		padding: 40px 8% 80px;
	}
`

const Card = styled.div`
	background: white;
	border-radius: 32px;
	padding: 40px 32px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
	max-width: 520px;
	width: 100%;

	@media (min-width: 768px) {
		padding: 56px 48px;
		border-radius: 40px;
	}
`

const Title = styled.h1`
	font-size: 36px;
	font-weight: 700;
	margin-bottom: 12px;
	color: #1a1a1a;
	letter-spacing: -0.5px;

	@media (min-width: 768px) {
		font-size: 44px;
	}
`

const Subtitle = styled.p`
	font-size: 16px;
	color: #666;
	margin-bottom: 40px;

	@media (min-width: 768px) {
		font-size: 18px;
		margin-bottom: 48px;
	}
`

const InputGroup = styled.div`
	margin-bottom: 24px;
`

const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 600;
	color: #333;
	margin-bottom: 10px;

	@media (min-width: 768px) {
		font-size: 15px;
		margin-bottom: 12px;
	}
`

const Input = styled.input`
	width: 100%;
	padding: 16px 18px;
	border: 1.5px solid ${props => (props.error ? '#e53935' : '#e0e0e0')};
	border-radius: 16px;
	font-size: 16px;
	transition: all 0.2s;
	background: white;

	&:focus {
		outline: none;
		border-color: #1a1a1a;
	}

	@media (min-width: 768px) {
		padding: 18px 20px;
		font-size: 17px;
		border-radius: 18px;
	}
`

const ErrorMessage = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #e53935;
	font-size: 13px;
	margin-top: 8px;
`

const Button = styled.button`
	width: 100%;
	padding: 16px;
	background: #1a1a1a;
	color: white;
	border: none;
	border-radius: 16px;
	font-size: 17px;
	font-weight: 600;
	cursor: pointer;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;
	transition: all 0.2s;
	margin-top: 8px;

	&:hover {
		background: #333;
		transform: translateY(-1px);
	}

	&:disabled {
		opacity: 0.6;
		cursor: not-allowed;
		transform: none;
	}

	@media (min-width: 768px) {
		padding: 18px;
		font-size: 18px;
		border-radius: 18px;
	}
`

const LinkText = styled.div`
	text-align: center;
	margin-top: 32px;
	font-size: 15px;
	color: #666;

	a {
		color: #1a1a1a;
		text-decoration: none;
		font-weight: 600;
		margin-left: 6px;
	}

	@media (min-width: 768px) {
		margin-top: 40px;
		font-size: 16px;
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

			await signInWithEmailAndPassword(auth, email, password)

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
			<Header>
				<BackButton onClick={() => navigate('/')}>
					<ArrowLeft size={20} />
					На главную
				</BackButton>
			</Header>
			<Content>
				<Card>
					<Title>Добро пожаловать</Title>
					<Subtitle>Войдите в свой аккаунт</Subtitle>

					<form onSubmit={handleLogin}>
						<InputGroup>
							<Label>Логин или Email</Label>
							<Input
								type='text'
								value={loginInput}
								onChange={e => setLoginInput(e.target.value)}
								error={error}
								placeholder='Ваш логин'
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
								<AlertCircle size={16} />
								{error}
							</ErrorMessage>
						)}

						<Button type='submit' disabled={loading}>
							<LogIn size={20} />
							{loading ? 'Вход...' : 'Войти'}
						</Button>
					</form>

					<LinkText>
						Еще не зарегистрированы?
						<Link to='/register'>Создать аккаунт</Link>
					</LinkText>
				</Card>
			</Content>
		</Container>
	)
}

export default Login