import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { signOut } from 'firebase/auth'
import { auth, db } from '../firebase'
import {
	collection,
	getDocs,
	updateDoc,
	doc,
	onSnapshot,
} from 'firebase/firestore'
import {
	LogOut,
	Filter,
	CheckCircle,
	XCircle,
	Clock,
	ChevronLeft,
	ChevronRight,
	RefreshCw,
} from 'lucide-react'

const Container = styled.div`
	min-height: 100vh;
	background-color: #f5f5f5;
`

const Header = styled.div`
	background: #1a1a1a;
	padding: 20px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 10;
`

const HeaderTitle = styled.h1`
	font-size: 20px;
	font-weight: 600;
	color: white;
`

const HeaderButtons = styled.div`
	display: flex;
	gap: 12px;
`

const IconButton = styled.button`
	background: none;
	border: none;
	cursor: pointer;
	color: white;
	padding: 8px;
	display: flex;
	align-items: center;
	gap: 6px;
	font-size: 14px;

	&:hover {
		opacity: 0.8;
	}
`

const Content = styled.div`
	padding: 20px;
	max-width: 1200px;
	margin: 0 auto;
`

const FilterBar = styled.div`
	background: white;
	border-radius: 16px;
	padding: 16px;
	margin-bottom: 20px;
	display: flex;
	gap: 12px;
	flex-wrap: wrap;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const FilterButton = styled.button`
	padding: 8px 16px;
	border: 1px solid ${props => (props.active ? '#1a1a1a' : '#e0e0e0')};
	border-radius: 24px;
	background: ${props => (props.active ? '#1a1a1a' : 'white')};
	color: ${props => (props.active ? 'white' : '#666')};
	cursor: pointer;
	font-size: 14px;
	display: flex;
	align-items: center;
	gap: 6px;
	transition: all 0.2s;

	&:hover {
		border-color: #1a1a1a;
	}
`

const StatsBar = styled.div`
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 12px;
	margin-bottom: 20px;
`

const StatCard = styled.div`
	background: white;
	border-radius: 16px;
	padding: 16px;
	text-align: center;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`

const StatNumber = styled.div`
	font-size: 28px;
	font-weight: 700;
	color: #1a1a1a;
`

const StatLabel = styled.div`
	font-size: 12px;
	color: #666;
	margin-top: 4px;
`

const BookingsGrid = styled.div`
	display: flex;
	flex-direction: column;
	gap: 16px;
`

const BookingCard = styled.div`
	background: white;
	border-radius: 16px;
	padding: 20px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	transition: transform 0.2s;

	&:hover {
		transform: translateY(-2px);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
	}
`

const BookingHeader = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: flex-start;
	margin-bottom: 12px;
	flex-wrap: wrap;
	gap: 10px;
`

const UserName = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
`

const StatusBadge = styled.span`
	padding: 4px 12px;
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

const BookingDetails = styled.div`
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
	gap: 12px;
	margin: 16px 0;
	padding: 12px 0;
	border-top: 1px solid #f0f0f0;
	border-bottom: 1px solid #f0f0f0;
`

const DetailItem = styled.div`
	font-size: 13px;
	color: #555;
`

const DetailLabel = styled.span`
	font-weight: 500;
	color: #999;
	margin-right: 6px;
`

const ActionButtons = styled.div`
	display: flex;
	gap: 12px;
	margin-top: 16px;
`

const ActionButton = styled.button`
	padding: 8px 16px;
	border: none;
	border-radius: 8px;
	font-size: 13px;
	font-weight: 500;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 6px;
	transition: opacity 0.2s;

	&:hover {
		opacity: 0.8;
	}
`

const ApproveButton = styled(ActionButton)`
	background: #4caf50;
	color: white;
`

const CompleteButton = styled(ActionButton)`
	background: #2196f3;
	color: white;
`

const Pagination = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	gap: 16px;
	margin-top: 24px;
	padding: 20px;
`

const PageButton = styled.button`
	padding: 8px 12px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	background: white;
	cursor: pointer;
	display: flex;
	align-items: center;
	gap: 4px;

	&:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}
`

const PageInfo = styled.span`
	font-size: 14px;
	color: #666;
`

const ReviewText = styled.div`
	margin-top: 12px;
	padding: 12px;
	background: #f9f9f9;
	border-radius: 8px;
	font-size: 13px;
	color: #666;
	font-style: italic;
`

const EmptyState = styled.div`
	text-align: center;
	padding: 60px 20px;
	color: #999;

	svg {
		margin-bottom: 16px;
		opacity: 0.5;
	}
`

const Admin = () => {
	const [allBookings, setAllBookings] = useState([])
	const [filteredBookings, setFilteredBookings] = useState([])
	const [activeFilter, setActiveFilter] = useState('all')
	const [currentPage, setCurrentPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [stats, setStats] = useState({ new: 0, assigned: 0, completed: 0 })
	const itemsPerPage = 5
	const navigate = useNavigate()

	// Проверка прав администратора при загрузке
	useEffect(() => {
		const isAdmin =
			localStorage.getItem('isAdmin') === 'true' ||
			sessionStorage.getItem('isAdmin') === 'true'

		if (!isAdmin) {
			console.log('Нет прав администратора, перенаправление')
			navigate('/login')
			return
		}

		loadBookings()

		// Настройка реального времени для обновления заявок
		const unsubscribe = onSnapshot(
			collection(db, 'bookings'),
			snapshot => {
				const bookingsData = snapshot.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}))
				console.log('Загружено заявок в реальном времени:', bookingsData.length)
				setAllBookings(bookingsData)
				updateStats(bookingsData)
				setLoading(false)
			},
			error => {
				console.error('Ошибка загрузки заявок:', error)
				setLoading(false)
			},
		)

		return () => unsubscribe()
	}, [navigate])

	useEffect(() => {
		filterBookings()
	}, [activeFilter, allBookings])

	const updateStats = bookings => {
		const newCount = bookings.filter(b => b.status === 'Новая').length
		const assignedCount = bookings.filter(
			b => b.status === 'Банкет назначен',
		).length
		const completedCount = bookings.filter(
			b => b.status === 'Банкет завершен',
		).length
		setStats({
			new: newCount,
			assigned: assignedCount,
			completed: completedCount,
		})
	}

	const loadBookings = async () => {
		try {
			setLoading(true)
			const querySnapshot = await getDocs(collection(db, 'bookings'))
			const bookingsData = querySnapshot.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))
			console.log('Загружено заявок:', bookingsData.length)
			console.log('Данные заявок:', bookingsData)
			setAllBookings(bookingsData)
			updateStats(bookingsData)
		} catch (error) {
			console.error('Ошибка загрузки заявок:', error)
		} finally {
			setLoading(false)
		}
	}

	const filterBookings = () => {
		if (activeFilter === 'all') {
			setFilteredBookings(allBookings)
		} else {
			setFilteredBookings(allBookings.filter(b => b.status === activeFilter))
		}
		setCurrentPage(1)
	}

	const updateStatus = async (bookingId, newStatus) => {
		try {
			const bookingRef = doc(db, 'bookings', bookingId)
			await updateDoc(bookingRef, { status: newStatus })
			console.log(`Статус заявки ${bookingId} изменен на ${newStatus}`)
		} catch (error) {
			console.error('Ошибка обновления статуса:', error)
			alert('Ошибка при обновлении статуса: ' + error.message)
		}
	}

	const handleLogout = async () => {
		localStorage.removeItem('isAdmin')
		localStorage.removeItem('adminLogin')
		localStorage.removeItem('adminUser')
		sessionStorage.removeItem('isAdmin')
		sessionStorage.removeItem('adminUser')

		try {
			await signOut(auth)
		} catch (error) {
			console.error('Ошибка выхода:', error)
		}

		navigate('/login')
	}

	const totalPages = Math.ceil(filteredBookings.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const currentBookings = filteredBookings.slice(
		startIndex,
		startIndex + itemsPerPage,
	)

	if (loading) {
		return (
			<Container>
				<Header>
					<HeaderTitle>Панель администратора</HeaderTitle>
					<HeaderButtons>
						<IconButton onClick={handleLogout}>
							<LogOut size={20} />
						</IconButton>
					</HeaderButtons>
				</Header>
				<Content>
					<div style={{ textAlign: 'center', padding: 60 }}>
						Загрузка заявок...
					</div>
				</Content>
			</Container>
		)
	}

	return (
		<Container>
			<Header>
				<HeaderTitle>Панель администратора</HeaderTitle>
				<HeaderButtons>
					<IconButton onClick={loadBookings}>
						<RefreshCw size={18} />
						Обновить
					</IconButton>
					<IconButton onClick={handleLogout}>
						<LogOut size={20} />
					</IconButton>
				</HeaderButtons>
			</Header>

			<Content>
				<StatsBar>
					<StatCard>
						<StatNumber>{stats.new}</StatNumber>
						<StatLabel>Новые заявки</StatLabel>
					</StatCard>
					<StatCard>
						<StatNumber>{stats.assigned}</StatNumber>
						<StatLabel>Назначенные</StatLabel>
					</StatCard>
					<StatCard>
						<StatNumber>{stats.completed}</StatNumber>
						<StatLabel>Завершенные</StatLabel>
					</StatCard>
				</StatsBar>

				<FilterBar>
					<FilterButton
						active={activeFilter === 'all'}
						onClick={() => setActiveFilter('all')}
					>
						<Filter size={14} />
						Все ({allBookings.length})
					</FilterButton>
					<FilterButton
						active={activeFilter === 'Новая'}
						onClick={() => setActiveFilter('Новая')}
					>
						<Clock size={14} />
						Новые ({stats.new})
					</FilterButton>
					<FilterButton
						active={activeFilter === 'Банкет назначен'}
						onClick={() => setActiveFilter('Банкет назначен')}
					>
						<CheckCircle size={14} />
						Назначенные ({stats.assigned})
					</FilterButton>
					<FilterButton
						active={activeFilter === 'Банкет завершен'}
						onClick={() => setActiveFilter('Банкет завершен')}
					>
						<XCircle size={14} />
						Завершенные ({stats.completed})
					</FilterButton>
				</FilterBar>

				<BookingsGrid>
					{currentBookings.length === 0 ? (
						<EmptyState>
							<RefreshCw size={48} />
							<p>Нет заявок с таким статусом</p>
							<button
								onClick={loadBookings}
								style={{
									marginTop: 16,
									padding: '8px 20px',
									background: '#1a1a1a',
									color: 'white',
									border: 'none',
									borderRadius: 8,
									cursor: 'pointer',
								}}
							>
								Обновить список
							</button>
						</EmptyState>
					) : (
						currentBookings.map(booking => (
							<BookingCard key={booking.id}>
								<BookingHeader>
									<UserName>{booking.userName || 'Пользователь'}</UserName>
									<StatusBadge status={booking.status}>
										{booking.status}
									</StatusBadge>
								</BookingHeader>

								<BookingDetails>
									<DetailItem>
										<DetailLabel>Помещение:</DetailLabel>
										{booking.venue || 'Не указано'}
									</DetailItem>
									<DetailItem>
										<DetailLabel>Дата:</DetailLabel>
										{booking.dateOriginal || booking.date || 'Не указана'}
									</DetailItem>
									<DetailItem>
										<DetailLabel>Оплата:</DetailLabel>
										{booking.paymentMethod || 'Не указан'}
									</DetailItem>
									<DetailItem>
										<DetailLabel>ID заявки:</DetailLabel>
										{booking.id.substring(0, 8)}...
									</DetailItem>
								</BookingDetails>

								{booking.review && (
									<ReviewText>Отзыв: {booking.review}</ReviewText>
								)}

								<ActionButtons>
									{booking.status === 'Новая' && (
										<ApproveButton
											onClick={() =>
												updateStatus(booking.id, 'Банкет назначен')
											}
										>
											<CheckCircle size={14} />
											Назначить банкет
										</ApproveButton>
									)}
									{booking.status === 'Банкет назначен' && (
										<CompleteButton
											onClick={() =>
												updateStatus(booking.id, 'Банкет завершен')
											}
										>
											<XCircle size={14} />
											Завершить банкет
										</CompleteButton>
									)}
								</ActionButtons>
							</BookingCard>
						))
					)}
				</BookingsGrid>

				{totalPages > 1 && (
					<Pagination>
						<PageButton
							onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
							disabled={currentPage === 1}
						>
							<ChevronLeft size={16} />
							Назад
						</PageButton>
						<PageInfo>
							Страница {currentPage} из {totalPages}
						</PageInfo>
						<PageButton
							onClick={() =>
								setCurrentPage(prev => Math.min(totalPages, prev + 1))
							}
							disabled={currentPage === totalPages}
						>
							Вперед
							<ChevronRight size={16} />
						</PageButton>
					</Pagination>
				)}
			</Content>
		</Container>
	)
}

export default Admin
