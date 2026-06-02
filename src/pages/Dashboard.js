import React, { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import {
	collection,
	query,
	where,
	getDocs,
	updateDoc,
	doc,
} from 'firebase/firestore'
import {
	LogOut,
	Calendar,
	MessageSquare,
	Star,
	ChevronRight,
} from 'lucide-react'
import Slider from '../components/Slider'

const Container = styled.div`
	min-height: 100vh;
	background-color: #f5f5f5;
`

const Header = styled.div`
	background: white;
	padding: 20px;
	border-bottom: 1px solid #e0e0e0;
	display: flex;
	justify-content: space-between;
	align-items: center;
`

const HeaderTitle = styled.h1`
	font-size: 24px;
	font-weight: 600;
	color: #1a1a1a;
`

const LogoutButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: #666;
	padding: 8px;
`

const Content = styled.div`
	padding: 20px;
	max-width: 390px;
	margin: 0 auto;
	width: 100%;
`

const Section = styled.div`
	margin-bottom: 32px;
`

const SectionTitle = styled.h2`
	font-size: 18px;
	font-weight: 600;
	color: #333;
	margin-bottom: 16px;
`

const BookingCard = styled.div`
	background: white;
	border-radius: 16px;
	padding: 16px;
	margin-bottom: 12px;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const BookingInfo = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12px;
`

const VenueName = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
`

const Status = styled.span`
	padding: 4px 10px;
	border-radius: 20px;
	font-size: 12px;
	font-weight: 500;
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
`

const BookingDetail = styled.p`
	font-size: 13px;
	color: #666;
	margin: 6px 0;
`

const ReviewSection = styled.div`
	margin-top: 12px;
	padding-top: 12px;
	border-top: 1px solid #e0e0e0;
`

const ReviewText = styled.textarea`
	width: 100%;
	padding: 12px;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
	font-size: 14px;
	resize: vertical;
	margin-bottom: 8px;

	&:focus {
		outline: none;
		border-color: #1a1a1a;
	}
`

const SubmitReviewButton = styled.button`
	padding: 8px 16px;
	background: #1a1a1a;
	color: white;
	border: none;
	border-radius: 20px;
	font-size: 13px;
	cursor: pointer;
`

const AddBookingButton = styled(Link)`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	width: 100%;
	padding: 14px;
	background: #1a1a1a;
	color: white;
	text-decoration: none;
	border-radius: 12px;
	font-weight: 500;
	margin-top: 16px;
`

const EmptyState = styled.div`
	text-align: center;
	padding: 40px;
	color: #999;
`

const Dashboard = () => {
	const [bookings, setBookings] = useState([])
	const [reviews, setReviews] = useState({})
	const navigate = useNavigate()
	const user = auth.currentUser

	useEffect(() => {
		if (user) {
			loadBookings()
		}
	}, [user])

	const loadBookings = async () => {
		const q = query(collection(db, 'bookings'), where('userId', '==', user.uid))
		const querySnapshot = await getDocs(q)
		const bookingsData = querySnapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
		}))
		setBookings(bookingsData)
	}

	const handleSubmitReview = async bookingId => {
		const reviewText = reviews[bookingId]
		if (!reviewText || !reviewText.trim()) return

		const bookingRef = doc(db, 'bookings', bookingId)
		await updateDoc(bookingRef, {
			review: reviewText,
			reviewDate: new Date().toISOString(),
		})

		await loadBookings()
		setReviews(prev => ({ ...prev, [bookingId]: '' }))
	}

	const handleLogout = async () => {
		await signOut(auth)
		navigate('/login')
	}

	return (
		<Container>
			<Header>
				<HeaderTitle>Личный кабинет</HeaderTitle>
				<LogoutButton onClick={handleLogout}>
					<LogOut size={20} />
				</LogoutButton>
			</Header>

			<Content>
				<Slider />

				<Section>
					<SectionTitle>Мои заявки</SectionTitle>
					{bookings.length === 0 ? (
						<EmptyState>У вас пока нет заявок</EmptyState>
					) : (
						bookings.map(booking => (
							<BookingCard key={booking.id}>
								<BookingInfo>
									<VenueName>{booking.venue}</VenueName>
									<Status status={booking.status}>{booking.status}</Status>
								</BookingInfo>
								<BookingDetail>
									<Calendar
										size={14}
										style={{ display: 'inline', marginRight: 6 }}
									/>
									Дата: {booking.date}
								</BookingDetail>
								<BookingDetail>Оплата: {booking.paymentMethod}</BookingDetail>

								{booking.status === 'Банкет завершен' && !booking.review && (
									<ReviewSection>
										<ReviewText
											placeholder='Оставьте отзыв о банкете...'
											value={reviews[booking.id] || ''}
											onChange={e =>
												setReviews(prev => ({
													...prev,
													[booking.id]: e.target.value,
												}))
											}
										/>
										<SubmitReviewButton
											onClick={() => handleSubmitReview(booking.id)}
										>
											<MessageSquare size={14} style={{ marginRight: 6 }} />
											Оставить отзыв
										</SubmitReviewButton>
									</ReviewSection>
								)}

								{booking.review && (
									<ReviewSection>
										<Star
											size={14}
											style={{
												color: '#ffc107',
												display: 'inline',
												marginRight: 6,
											}}
										/>
										<span style={{ fontSize: 13, color: '#666' }}>
											Ваш отзыв: {booking.review}
										</span>
									</ReviewSection>
								)}
							</BookingCard>
						))
					)}

					<AddBookingButton to='/booking'>
						<Calendar size={18} />
						Новая заявка
						<ChevronRight size={18} />
					</AddBookingButton>
				</Section>
			</Content>
		</Container>
	)
}

export default Dashboard
