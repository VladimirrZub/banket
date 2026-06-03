import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import {
	collection,
	query,
	where,
	onSnapshot,
	updateDoc,
	doc,
	getDoc,
} from 'firebase/firestore'
import {
	LogOut,
	Calendar,
	MessageSquare,
	Star,
	ChevronRight,
	User,
	Phone,
	Mail,
	Clock,
	CreditCard,
	Plus,
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
	justify-content: space-between;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 10;

	@media (min-width: 768px) {
		padding: 24px 8%;
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

const LogoutButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: #666;
	padding: 10px;
	display: flex;
	align-items: center;
	gap: 8px;
	font-size: 14px;

	&:hover {
		color: #1a1a1a;
	}

	@media (min-width: 768px) {
		font-size: 16px;
		gap: 10px;
	}
`

const Content = styled.div`
	max-width: 1200px;
	margin: 0 auto;
	padding: 30px 5%;

	@media (min-width: 768px) {
		padding: 48px 8%;
	}
`

const Section = styled.div`
	margin-bottom: 48px;

	@media (min-width: 768px) {
		margin-bottom: 64px;
	}
`

const SectionTitle = styled.h2`
	font-size: 22px;
	font-weight: 600;
	color: #333;
	margin-bottom: 20px;
	display: flex;
	align-items: center;
	justify-content: space-between;

	@media (min-width: 768px) {
		font-size: 28px;
		margin-bottom: 28px;
	}
`

const Badge = styled.span`
	background: #1a1a1a;
	color: white;
	padding: 4px 12px;
	border-radius: 20px;
	font-size: 14px;
	font-weight: 500;
`

const ProfileCard = styled.div`
	background: white;
	border-radius: 24px;
	padding: 28px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);

	@media (min-width: 768px) {
		padding: 40px;
		border-radius: 32px;
	}
`

const ProfileHeader = styled.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	text-align: center;
	margin-bottom: 28px;

	@media (min-width: 768px) {
		flex-direction: row;
		text-align: left;
		gap: 24px;
		margin-bottom: 32px;
	}
`

const ProfileAvatar = styled.div`
	width: 80px;
	height: 80px;
	border-radius: 50%;
	background: #1a1a1a;
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	margin-bottom: 16px;

	@media (min-width: 768px) {
		width: 100px;
		height: 100px;
		margin-bottom: 0;

		svg {
			width: 48px;
			height: 48px;
		}
	}
`

const ProfileInfo = styled.div`
	flex: 1;
`

const ProfileName = styled.h3`
	font-size: 24px;
	font-weight: 700;
	color: #1a1a1a;
	margin-bottom: 8px;

	@media (min-width: 768px) {
		font-size: 28px;
	}
`

const ProfileEmail = styled.p`
	font-size: 14px;
	color: #666;
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;

	@media (min-width: 768px) {
		justify-content: flex-start;
		font-size: 16px;
	}
`

const ProfileDetails = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;
	padding-top: 24px;
	border-top: 1px solid #f0f0f0;

	@media (min-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
	}
`

const ProfileDetail = styled.div`
	font-size: 15px;
	color: #555;
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: #f9f9f9;
	border-radius: 16px;

	svg {
		color: #1a1a1a;
		flex-shrink: 0;
	}

	@media (min-width: 768px) {
		font-size: 16px;
		padding: 16px;
		gap: 14px;
	}
`

const BookingsGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 20px;

	@media (min-width: 768px) {
		grid-template-columns: repeat(2, 1fr);
		gap: 24px;
	}
`

const BookingCard = styled.div`
	background: white;
	border-radius: 20px;
	padding: 20px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
	transition: transform 0.2s;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 768px) {
		padding: 24px;
		border-radius: 24px;
	}
`

const BookingHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 16px;
	flex-wrap: wrap;
	gap: 12px;
`

const VenueName = styled.h3`
	font-size: 18px;
	font-weight: 700;
	color: #1a1a1a;

	@media (min-width: 768px) {
		font-size: 20px;
	}
`

const Status = styled.span`
	padding: 6px 14px;
	border-radius: 30px;
	font-size: 12px;
	font-weight: 600;
	background: ${props => {
		switch (props.status) {
			case 'Новая':
				return '#fff3e0'
			case 'Банкет назначен':
				return '#e8f5e9'
			case 'Банкет завершен':
				return '#e3f2fd'
			default:
				return '#f5f5f5'
		}
	}};
	color: ${props => {
		switch (props.status) {
			case 'Новая':
				return '#e65100'
			case 'Банкет назначен':
				return '#2e7d32'
			case 'Банкет завершен':
				return '#1565c0'
			default:
				return '#666'
		}
	}};

	@media (min-width: 768px) {
		font-size: 13px;
		padding: 6px 16px;
	}
`

const BookingDetails = styled.div`
	display: flex;
	flex-direction: column;
	gap: 12px;
	margin: 16px 0;
	padding: 16px 0;
	border-top: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0;
`

const BookingDetail = styled.div`
	font-size: 14px;
	color: #555;
	display: flex;
	align-items: center;
	gap: 10px;

	@media (min-width: 768px) {
		font-size: 15px;
	}
`

const ReviewSection = styled.div`
	margin-top: 16px;
`

const ReviewTextarea = styled.textarea`
	width: 100%;
	padding: 14px;
	border: 1.5px solid #e0e0e0;
	border-radius: 16px;
	font-size: 14px;
	resize: vertical;
	margin-bottom: 12px;
	font-family: inherit;

	&:focus {
		outline: none;
		border-color: #1a1a1a;
	}

	@media (min-width: 768px) {
		padding: 16px;
		font-size: 15px;
		border-radius: 18px;
	}
`

const SubmitReviewButton = styled.button`
	padding: 10px 20px;
	background: #1a1a1a;
	color: white;
	border: none;
	border-radius: 30px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	display: inline-flex;
	align-items: center;
	gap: 8px;
	transition: all 0.2s;

	&:hover {
		background: #333;
		transform: translateY(-1px);
	}

	@media (min-width: 768px) {
		padding: 12px 24px;
		font-size: 15px;
	}
`

const ReviewText = styled.div`
	margin-top: 16px;
	padding: 14px;
	background: #f9f9f9;
	border-radius: 16px;
	font-size: 14px;
	color: #555;
	display: flex;
	gap: 10px;

	@media (min-width: 768px) {
		padding: 16px;
		font-size: 15px;
		border-radius: 18px;
	}
`

const AddBookingButton = styled(Link)`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	width: 100%;
	max-width: 350px;
	margin: 40px auto 0;
	padding: 16px 28px;
	background: #1a1a1a;
	color: white;
	text-decoration: none;
	border-radius: 60px;
	font-weight: 600;
	font-size: 16px;
	transition: all 0.2s;

	&:hover {
		background: #333;
		transform: translateY(-2px);
	}

	@media (min-width: 768px) {
		max-width: 400px;
		padding: 18px 32px;
		font-size: 18px;
		gap: 14px;
	}
`

const EmptyState = styled.div`
	text-align: center;
	padding: 60px 20px;
	background: white;
	border-radius: 24px;
	color: #999;

	svg {
		margin-bottom: 16px;
		opacity: 0.5;
	}

	p {
		font-size: 16px;
	}

	@media (min-width: 768px) {
		padding: 80px;
		border-radius: 32px;

		p {
			font-size: 18px;
		}
	}
`

const Dashboard = () => {
	const [bookings, setBookings] = useState([])
	const [reviews, setReviews] = useState({})
	const [userData, setUserData] = useState(null)
	const navigate = useNavigate()
	const user = auth.currentUser

	useEffect(() => {
		if (!user) return

		// Загружаем данные пользователя один раз
		const loadUserData = async () => {
			try {
				const userDoc = await getDoc(doc(db, 'users', user.uid))
				if (userDoc.exists()) {
					setUserData(userDoc.data())
				}
			} catch (error) {
				console.error('Ошибка загрузки данных пользователя:', error)
			}
		}
		loadUserData()

		// РЕАЛЬНОЕ ВРЕМЯ: подписываемся на обновления заявок
		const q = query(collection(db, 'bookings'), where('userId', '==', user.uid))
		const unsubscribe = onSnapshot(q, (snapshot) => {
			const bookingsData = snapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))
			console.log('Заявки обновлены в реальном времени:', bookingsData.length)
			setBookings(bookingsData)
		}, (error) => {
			console.error('Ошибка при получении заявок:', error)
		})

		// Отписываемся при размонтировании компонента
		return () => unsubscribe()
	}, [user])

	const handleSubmitReview = async (bookingId) => {
		const reviewText = reviews[bookingId]
		if (!reviewText || !reviewText.trim()) return

		const bookingRef = doc(db, 'bookings', bookingId)
		await updateDoc(bookingRef, {
			review: reviewText,
			reviewDate: new Date().toISOString(),
		})

		setReviews(prev => ({ ...prev, [bookingId]: '' }))
	}

	const handleLogout = async () => {
		await signOut(auth)
		navigate('/login')
	}

	const formatDate = (dateStr) => {
		if (!dateStr) return 'Не указана'
		if (dateStr.includes('-')) {
			const [year, month, day] = dateStr.split('-')
			return `${day}.${month}.${year}`
		}
		return dateStr
	}

	return (
		<Container>
			<Header>
				<HeaderTitle>Личный кабинет</HeaderTitle>
				<LogoutButton onClick={handleLogout}>
					<LogOut size={18} />
					Выйти
				</LogoutButton>
			</Header>

			<Content>
				<Section>
					<SectionTitle>
						Мой профиль
						<Badge>{userData?.login || 'Пользователь'}</Badge>
					</SectionTitle>
					<ProfileCard>
						<ProfileHeader>
							<ProfileAvatar>
								<User size={40} />
							</ProfileAvatar>
							<ProfileInfo>
								<ProfileName>{userData?.fullName || user?.displayName || 'Пользователь'}</ProfileName>
								<ProfileEmail>
									<Mail size={16} />
									{user?.email}
								</ProfileEmail>
							</ProfileInfo>
						</ProfileHeader>
						<ProfileDetails>
							<ProfileDetail>
								<User size={18} />
								Логин: {userData?.login || 'Не указан'}
							</ProfileDetail>
							<ProfileDetail>
								<Phone size={18} />
								Телефон: {userData?.phone || 'Не указан'}
							</ProfileDetail>
						</ProfileDetails>
					</ProfileCard>
				</Section>

				<Section>
					<SectionTitle>
						Мои заявки
						<Badge>{bookings.length}</Badge>
					</SectionTitle>

					{bookings.length === 0 ? (
						<EmptyState>
							<Calendar size={48} />
							<p>У вас пока нет заявок</p>
						</EmptyState>
					) : (
						<BookingsGrid>
							{bookings.map(booking => (
								<BookingCard key={booking.id}>
									<BookingHeader>
										<VenueName>{booking.venue}</VenueName>
										<Status status={booking.status}>{booking.status}</Status>
									</BookingHeader>

									<BookingDetails>
										<BookingDetail>
											<Calendar size={16} />
											Дата: {formatDate(booking.dateOriginal || booking.date)}
										</BookingDetail>
										<BookingDetail>
											<CreditCard size={16} />
											Оплата: {booking.paymentMethod}
										</BookingDetail>
										<BookingDetail>
											<Clock size={16} />
											Создана: {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Неизвестно'}
										</BookingDetail>
									</BookingDetails>

									{booking.status === 'Банкет завершен' && !booking.review && (
										<ReviewSection>
											<ReviewTextarea
												placeholder='Оставьте отзыв о банкете...'
												value={reviews[booking.id] || ''}
												onChange={e =>
													setReviews(prev => ({
														...prev,
														[booking.id]: e.target.value,
													}))
												}
											/>
											<SubmitReviewButton onClick={() => handleSubmitReview(booking.id)}>
												<MessageSquare size={16} />
												Оставить отзыв
											</SubmitReviewButton>
										</ReviewSection>
									)}

									{booking.review && (
										<ReviewSection>
											<ReviewText>
												<Star size={16} style={{ color: '#ffc107', flexShrink: 0 }} />
												<span>Ваш отзыв: {booking.review}</span>
											</ReviewText>
										</ReviewSection>
									)}
								</BookingCard>
							))}
						</BookingsGrid>
					)}

					<AddBookingButton to='/booking'>
						<Plus size={20} />
						Создать новую заявку
						<ChevronRight size={18} />
					</AddBookingButton>
				</Section>
			</Content>
		</Container>
	)
}

export default Dashboard