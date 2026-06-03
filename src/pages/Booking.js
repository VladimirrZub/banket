import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { auth, db } from '../firebase'
import { collection, addDoc } from 'firebase/firestore'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {
	Calendar as CalendarIcon,
	CreditCard,
	MapPin,
	ChevronLeft,
	Clock,
	CheckCircle,
} from 'lucide-react'

const Container = styled.div`
	min-height: 100vh;
	background-color: #f5f5f5;
`

const Header = styled.div`
	background: white;
	padding: 20px 5%;
	border-bottom: 1px solid #e0e0e0;
	display: flex;
	align-items: center;
	gap: 16px;
	position: sticky;
	top: 0;
	z-index: 10;

	@media (min-width: 768px) {
		padding: 24px 8%;
		gap: 24px;
	}
`

const BackButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: #333;
	padding: 8px;
	display: flex;
	align-items: center;
	transition: opacity 0.2s;

	&:hover {
		opacity: 0.7;
	}

	@media (min-width: 768px) {
		padding: 10px;

		svg {
			width: 28px;
			height: 28px;
		}
	}
`

const HeaderTitle = styled.h1`
	font-size: 24px;
	font-weight: 700;
	color: #1a1a1a;

	@media (min-width: 768px) {
		font-size: 32px;
	}
`

const Content = styled.div`
	max-width: 900px;
	margin: 0 auto;
	padding: 30px 5% 60px;

	@media (min-width: 768px) {
		padding: 48px 8% 80px;
	}
`

const Card = styled.div`
	background: white;
	border-radius: 28px;
	padding: 32px 28px;
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);

	@media (min-width: 768px) {
		padding: 48px 48px;
		border-radius: 36px;
	}
`

const FormTitle = styled.h2`
	font-size: 22px;
	font-weight: 700;
	color: #1a1a1a;
	margin-bottom: 8px;

	@media (min-width: 768px) {
		font-size: 28px;
		margin-bottom: 12px;
	}
`

const FormSubtitle = styled.p`
	font-size: 14px;
	color: #666;
	margin-bottom: 32px;

	@media (min-width: 768px) {
		font-size: 16px;
		margin-bottom: 40px;
	}
`

const InputGroup = styled.div`
	margin-bottom: 28px;

	@media (min-width: 768px) {
		margin-bottom: 32px;
	}
`

const Label = styled.label`
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 15px;
	font-weight: 600;
	color: #333;
	margin-bottom: 12px;

	@media (min-width: 768px) {
		font-size: 16px;
		margin-bottom: 14px;
		gap: 10px;
	}
`

const Select = styled.select`
	width: 100%;
	padding: 16px 18px;
	border: 1.5px solid #e0e0e0;
	border-radius: 18px;
	font-size: 16px;
	background: white;
	cursor: pointer;
	transition: all 0.2s;

	&:focus {
		outline: none;
		border-color: #1a1a1a;
	}

	@media (min-width: 768px) {
		padding: 18px 20px;
		font-size: 17px;
		border-radius: 20px;
	}
`

const StyledDatePicker = styled(DatePicker)`
	width: 100%;
	padding: 16px 18px;
	border: 1.5px solid #e0e0e0;
	border-radius: 18px;
	font-size: 16px;
	transition: all 0.2s;
	cursor: pointer;

	&:focus {
		outline: none;
		border-color: #1a1a1a;
	}

	@media (min-width: 768px) {
		padding: 18px 20px;
		font-size: 17px;
		border-radius: 20px;
	}
`

const Hint = styled.p`
	font-size: 12px;
	color: #999;
	margin-top: 8px;
	display: flex;
	align-items: center;
	gap: 6px;

	@media (min-width: 768px) {
		font-size: 13px;
		margin-top: 10px;
	}
`

const ErrorMessage = styled.div`
	color: #e53935;
	font-size: 13px;
	margin-top: 8px;
	display: flex;
	align-items: center;
	gap: 6px;

	@media (min-width: 768px) {
		font-size: 14px;
		margin-top: 10px;
	}
`

const SuccessMessage = styled.div`
	color: #4caf50;
	font-size: 14px;
	text-align: center;
	margin-top: 24px;
	padding: 16px;
	background: #e8f5e9;
	border-radius: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 10px;

	@media (min-width: 768px) {
		font-size: 16px;
		margin-top: 32px;
		padding: 20px;
		border-radius: 20px;
	}
`

const Button = styled.button`
	width: 100%;
	padding: 16px;
	background: #1a1a1a;
	color: white;
	border: none;
	border-radius: 60px;
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
		gap: 12px;
		margin-top: 24px;
	}
`

const venues = [
	{ id: 1, name: 'Зал "Торжественный"', type: 'Банкетный зал', capacity: 'до 150 чел' },
	{ id: 2, name: 'Ресторан "Изумруд"', type: 'Ресторан', capacity: 'до 80 чел' },
	{ id: 3, name: 'Летняя веранда "Сакура"', type: 'Летняя веранда', capacity: 'до 60 чел' },
	{ id: 4, name: 'Закрытая веранда "Уют"', type: 'Закрытая веранда', capacity: 'до 40 чел' },
	{ id: 5, name: 'Зал "Мраморный"', type: 'Банкетный зал', capacity: 'до 200 чел' },
]

const paymentMethods = [
	{ id: 'cash', name: 'Наличными', icon: '💰' },
	{ id: 'card', name: 'Банковской картой', icon: '💳' },
	{ id: 'transfer', name: 'Безналичный расчет', icon: '🏦' },
	{ id: 'prepay', name: 'Предоплата 50%', icon: '📝' },
]

const Booking = () => {
	const [formData, setFormData] = useState({
		venue: '',
		date: null,
		paymentMethod: '',
	})
	const [error, setError] = useState('')
	const [success, setSuccess] = useState('')
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const formatDateForDB = (date) => {
		if (!date) return ''
		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()
		return `${year}-${month}-${day}`
	}

	const formatDateForDisplay = (date) => {
		if (!date) return ''
		const day = String(date.getDate()).padStart(2, '0')
		const month = String(date.getMonth() + 1).padStart(2, '0')
		const year = date.getFullYear()
		return `${day}.${month}.${year}`
	}

	const handleSubmit = async e => {
		e.preventDefault()
		setError('')
		setSuccess('')
		setLoading(true)

		if (!formData.venue || !formData.date || !formData.paymentMethod) {
			setError('Заполните все поля')
			setLoading(false)
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
				dateOriginal: formatDateForDisplay(formData.date),
				paymentMethod: formData.paymentMethod,
				status: 'Новая',
				createdAt: new Date().toISOString(),
			})

			setSuccess('Заявка успешно создана! Перенаправление...')
			setTimeout(() => navigate('/dashboard'), 2000)
		} catch (err) {
			console.error('Ошибка:', err)
			setError('Ошибка при создании заявки. Попробуйте позже.')
		} finally {
			setLoading(false)
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
					<FormTitle>Забронировать помещение</FormTitle>
					<FormSubtitle>
						Заполните форму и мы свяжемся с вами для подтверждения
					</FormSubtitle>

					<form onSubmit={handleSubmit}>
						<InputGroup>
							<Label>
								<MapPin size={18} />
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
										{venue.type} - {venue.name} ({venue.capacity})
									</option>
								))}
							</Select>
						</InputGroup>

						<InputGroup>
							<Label>
								<CalendarIcon size={18} />
								Дата начала банкета
							</Label>
							<StyledDatePicker
								selected={formData.date}
								onChange={(date) => setFormData({ ...formData, date })}
								dateFormat="dd.MM.yyyy"
								placeholderText="Выберите дату"
								minDate={new Date()}
								locale="ru"
								required
							/>
							<Hint>
								<Clock size={12} />
								Выберите удобную дату из календаря
							</Hint>
						</InputGroup>

						<InputGroup>
							<Label>
								<CreditCard size={18} />
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
									<option key={method.id} value={method.name}>
										{method.icon} {method.name}
									</option>
								))}
							</Select>
						</InputGroup>

						{error && (
							<ErrorMessage>
								⚠️ {error}
							</ErrorMessage>
						)}

						{success && (
							<SuccessMessage>
								<CheckCircle size={20} />
								{success}
							</SuccessMessage>
						)}

						<Button type='submit' disabled={loading}>
							{loading ? 'Отправка...' : 'Отправить заявку'}
							{!loading && <span>→</span>}
						</Button>
					</form>
				</Card>
			</Content>
		</Container>
	)
}

export default Booking