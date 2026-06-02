import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import {
	Calendar as CalendarIcon,
	CreditCard,
	MapPin,
	ChevronLeft,
} from 'lucide-react'

const Container = styled.div`
	min-height: 100vh;
	background-color: #f5f5f5;
`

const Header = styled.div`
	background: white;
	padding: 20px;
	border-bottom: 1px solid #e0e0e0;
	display: flex;
	align-items: center;
	gap: 16px;
`

const BackButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: #333;
	padding: 8px;
	display: flex;
	align-items: center;
`

const HeaderTitle = styled.h1`
	font-size: 24px;
	font-weight: 600;
	color: #1a1a1a;
`

const Content = styled.div`
	padding: 20px;
	max-width: 390px;
	margin: 0 auto;
`

const Card = styled.div`
	background: white;
	border-radius: 24px;
	padding: 24px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`

const InputGroup = styled.div`
	margin-bottom: 24px;
`

const Label = styled.label`
	display: block;
	font-size: 14px;
	font-weight: 500;
	color: #333;
	margin-bottom: 8px;
`

const Select = styled.select`
	width: 100%;
	padding: 14px 16px;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
	font-size: 16px;
	background: white;
	cursor: pointer;

	&:focus {
		outline: none;
		border-color: #1a1a1a;
	}
`

const Input = styled.input`
	width: 100%;
	padding: 14px 16px;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
	font-size: 16px;

	&:focus {
		outline: none;
		border-color: #1a1a1a;
	}
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
	transition: background 0.2s;

	&:hover {
		background: #333;
	}
`

const ErrorMessage = styled.div`
	color: #e53935;
	font-size: 12px;
	margin-top: 6px;
`

const SuccessMessage = styled.div`
	color: #4caf50;
	font-size: 14px;
	text-align: center;
	margin-top: 16px;
`

const venues = [
	{ id: 1, name: 'Зал "Торжественный"', type: 'Зал' },
	{ id: 2, name: 'Ресторан "Изумруд"', type: 'Ресторан' },
	{ id: 3, name: 'Летняя веранда "Сакура"', type: 'Летняя веранда' },
	{ id: 4, name: 'Закрытая веранда "Уют"', type: 'Закрытая веранда' },
	{ id: 5, name: 'Зал "Мраморный"', type: 'Зал' },
]

const paymentMethods = [
	'Наличными',
	'Банковской картой',
	'Безналичный расчет',
	'Предоплата 50%',
]

const Booking = () => {
	const [formData, setFormData] = useState({
		venue: '',
		date: '',
		paymentMethod: '',
	})
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const navigate = useNavigate()

	const validateDate = dateStr => {
		const regex = /^\d{2}\.\d{2}\.\d{4}$/
		if (!regex.test(dateStr)) return false

		const [day, month, year] = dateStr.split('.')
		const date = new Date(year, month - 1, day)
		const today = new Date()
		today.setHours(0, 0, 0, 0)

		return date >= today
	}

	const formatDateForDB = dateStr => {
		const [day, month, year] = dateStr.split('.')
		return `${year}-${month}-${day}`
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		setSuccess('')

		if (!formData.venue || !formData.date || !formData.paymentMethod) {
			setError('Заполните все поля')
			return
		}

		if (!validateDate(formData.date)) {
			setError(
				'Укажите корректную дату в формате ДД.ММ.ГГГГ (не ранее сегодняшнего дня)',
			)
			return
		}

		const user = auth.currentUser
		if (!user) {
			navigate('/login')
			return
		}

		try {
			await addDoc(collection(db, 'bookings'), {
				userId: user.uid,
				userName: user.displayName,
				venue: formData.venue,
				date: formatDateForDB(formData.date),
				dateOriginal: formData.date,
				paymentMethod: formData.paymentMethod,
				status: 'Новая',
				createdAt: new Date().toISOString(),
			})

			setSuccess('Заявка успешно создана!')
			setTimeout(() => navigate('/dashboard'), 1500)
		} catch (err) {
			setError('Ошибка при создании заявки')
		}
	}

	return (
		<Container>
			<Header>
				<BackButton onClick={() => navigate('/dashboard')}>
					<ChevronLeft size={24} />
				</BackButton>
				<HeaderTitle>Новая заявка</HeaderTitle>
			</Header>

			<Content>
				<Card>
					<form onSubmit={handleSubmit}>
						<InputGroup>
							<Label>
								<MapPin
									size={14}
									style={{ display: 'inline', marginRight: 6 }}
								/>
								Выберите помещение
							</Label>
							<Select
								value={formData.venue}
								onChange={e =>
									setFormData({ ...formData, venue: e.target.value })
								}
								required
							>
								<option value=''>Выберите из списка</option>
								{venues.map(venue => (
									<option key={venue.id} value={venue.name}>
										{venue.type} - {venue.name}
									</option>
								))}
							</Select>
						</InputGroup>

						<InputGroup>
							<Label>
								<CalendarIcon
									size={14}
									style={{ display: 'inline', marginRight: 6 }}
								/>
								Дата начала банкета
							</Label>
							<Input
								type='text'
								placeholder='ДД.ММ.ГГГГ'
								value={formData.date}
								onChange={e =>
									setFormData({ ...formData, date: e.target.value })
								}
								required
							/>
							<ErrorMessage>Формат: 25.12.2024</ErrorMessage>
						</InputGroup>

						<InputGroup>
							<Label>
								<CreditCard
									size={14}
									style={{ display: 'inline', marginRight: 6 }}
								/>
								Способ оплаты
							</Label>
							<Select
								value={formData.paymentMethod}
								onChange={e =>
									setFormData({ ...formData, paymentMethod: e.target.value })
								}
								required
							>
								<option value=''>Выберите способ оплаты</option>
								{paymentMethods.map(method => (
									<option key={method} value={method}>
										{method}
									</option>
								))}
							</Select>
						</InputGroup>

						{error && (
							<ErrorMessage style={{ marginBottom: 16 }}>{error}</ErrorMessage>
						)}
						{success && <SuccessMessage>{success}</SuccessMessage>}

						<Button type='submit'>Отправить заявку</Button>
					</form>
				</Card>
			</Content>
		</Container>
	)
}

export default Booking
