import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { UserPlus, AlertCircle, CheckCircle, ArrowLeft } from 'lucide-react'

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
	max-width: 560px;
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
	margin-bottom: 20px;
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
	font-size: 12px;
	margin-top: 8px;
`

const SuccessMessage = styled.div`
	display: flex;
	align-items: center;
	gap: 8px;
	color: #4caf50;
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
	margin-top: 16px;

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
		margin-top: 20px;
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

const Register = () => {
	const [formData, setFormData] = useState({
		login: '',
		password: '',
		confirmPassword: '',
		fullName: '',
		phone: '',
		email: '',
	})
	const [errors, setErrors] = useState({})
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const validateForm = () => {
		const newErrors = {}

		const loginRegex = /^[a-zA-Z0-9]{6,}$/
		if (!loginRegex.test(formData.login)) {
			newErrors.login =
				'Логин должен содержать только латинские буквы и цифры, минимум 6 символов'
		}

		if (formData.password.length < 8) {
			newErrors.password = 'Пароль должен содержать минимум 8 символов'
		}

		if (formData.password !== formData.confirmPassword) {
			newErrors.confirmPassword = 'Пароли не совпадают'
		}

		if (!formData.fullName.trim()) {
			newErrors.fullName = 'Введите ФИО'
		}

		const phoneRegex = /^[\d+\-() ]{10,}$/
		if (!phoneRegex.test(formData.phone)) {
			newErrors.phone = 'Введите корректный номер телефона'
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
		if (!emailRegex.test(formData.email)) {
			newErrors.email = 'Введите корректный email'
		}

		setErrors(newErrors)
		return Object.keys(newErrors).length === 0
	}

	const handleRegister = async e => {
		e.preventDefault()
		setSuccess('')
		setErrors({})
		setLoading(true)

		if (!validateForm()) {
			setLoading(false)
			return
		}

		try {
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				formData.email,
				formData.password,
			)

			await updateProfile(userCredential.user, {
				displayName: formData.fullName,
			})

			await setDoc(doc(db, 'users', userCredential.user.uid), {
				login: formData.login,
				fullName: formData.fullName,
				phone: formData.phone,
				email: formData.email,
				createdAt: new Date().toISOString(),
			})

			setSuccess(
				'Регистрация успешна! Сейчас вы будете перенаправлены на страницу входа...',
			)
			setTimeout(() => navigate('/login'), 2000)
		} catch (err) {
			console.error('Ошибка регистрации:', err)
			if (err.code === 'auth/email-already-in-use') {
				setErrors({ email: 'Пользователь с таким email уже существует' })
			} else if (err.code === 'auth/weak-password') {
				setErrors({ password: 'Слишком слабый пароль' })
			} else {
				setErrors({ general: 'Ошибка регистрации: ' + err.message })
			}
		} finally {
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
					<Title>Создать аккаунт</Title>
					<Subtitle>Заполните форму для регистрации</Subtitle>

					<form onSubmit={handleRegister}>
						<InputGroup>
							<Label>Логин</Label>
							<Input
								value={formData.login}
								onChange={e =>
									setFormData({ ...formData, login: e.target.value })
								}
								error={errors.login}
								placeholder='ivan123 (только латиница и цифры)'
							/>
							{errors.login && (
								<ErrorMessage>
									<AlertCircle size={14} />
									{errors.login}
								</ErrorMessage>
							)}
						</InputGroup>

						<InputGroup>
							<Label>Email</Label>
							<Input
								type='email'
								value={formData.email}
								onChange={e =>
									setFormData({ ...formData, email: e.target.value })
								}
								error={errors.email}
								placeholder='ivan@example.com'
							/>
							{errors.email && (
								<ErrorMessage>
									<AlertCircle size={14} />
									{errors.email}
								</ErrorMessage>
							)}
						</InputGroup>

						<InputGroup>
							<Label>Пароль</Label>
							<Input
								type='password'
								value={formData.password}
								onChange={e =>
									setFormData({ ...formData, password: e.target.value })
								}
								error={errors.password}
								placeholder='минимум 8 символов'
							/>
							{errors.password && (
								<ErrorMessage>
									<AlertCircle size={14} />
									{errors.password}
								</ErrorMessage>
							)}
						</InputGroup>

						<InputGroup>
							<Label>Подтверждение пароля</Label>
							<Input
								type='password'
								value={formData.confirmPassword}
								onChange={e =>
									setFormData({ ...formData, confirmPassword: e.target.value })
								}
								error={errors.confirmPassword}
							/>
							{errors.confirmPassword && (
								<ErrorMessage>
									<AlertCircle size={14} />
									{errors.confirmPassword}
								</ErrorMessage>
							)}
						</InputGroup>

						<InputGroup>
							<Label>ФИО</Label>
							<Input
								value={formData.fullName}
								onChange={e =>
									setFormData({ ...formData, fullName: e.target.value })
								}
								error={errors.fullName}
								placeholder='Иванов Иван Иванович'
							/>
							{errors.fullName && (
								<ErrorMessage>
									<AlertCircle size={14} />
									{errors.fullName}
								</ErrorMessage>
							)}
						</InputGroup>

						<InputGroup>
							<Label>Телефон</Label>
							<Input
								value={formData.phone}
								onChange={e =>
									setFormData({ ...formData, phone: e.target.value })
								}
								error={errors.phone}
								placeholder='+7 999 123-45-67'
							/>
							{errors.phone && (
								<ErrorMessage>
									<AlertCircle size={14} />
									{errors.phone}
								</ErrorMessage>
							)}
						</InputGroup>

						{success && (
							<SuccessMessage>
								<CheckCircle size={16} />
								{success}
							</SuccessMessage>
						)}
						{errors.general && (
							<ErrorMessage>
								<AlertCircle size={14} />
								{errors.general}
							</ErrorMessage>
						)}

						<Button type='submit' disabled={loading}>
							<UserPlus size={20} />
							{loading ? 'Регистрация...' : 'Зарегистрироваться'}
						</Button>
					</form>

					<LinkText>
						Уже есть аккаунт?
						<Link to='/login'>Войти</Link>
					</LinkText>
				</Card>
			</Content>
		</Container>
	)
}

export default Register