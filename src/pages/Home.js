import React from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import Slider from '../components/Slider'
import { Calendar, MapPin, CreditCard, Users, Clock, Star, ArrowRight } from 'lucide-react'

const Container = styled.div`
	min-height: 100vh;
	background-color: #f5f5f5;
`

const Header = styled.div`
	background: white;
	padding: 16px 5%;
	display: flex;
	justify-content: space-between;
	align-items: center;
	position: sticky;
	top: 0;
	z-index: 10;
	box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

	@media (min-width: 768px) {
		padding: 20px 8%;
	}
`

const Logo = styled.div`
	font-size: 20px;
	font-weight: 700;
	color: #1a1a1a;
	letter-spacing: -0.5px;

	@media (min-width: 768px) {
		font-size: 28px;
	}
`

const ButtonGroup = styled.div`
	display: flex;
	gap: 12px;
`

const LoginButton = styled.button`
	padding: 8px 20px;
	background: white;
	border: 1px solid #1a1a1a;
	border-radius: 30px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	color: #1a1a1a;
	transition: all 0.2s;

	&:hover {
		background: #1a1a1a;
		color: white;
	}

	@media (min-width: 768px) {
		padding: 10px 28px;
		font-size: 16px;
	}
`

const RegisterButton = styled.button`
	padding: 8px 20px;
	background: #1a1a1a;
	border: none;
	border-radius: 30px;
	font-size: 14px;
	font-weight: 500;
	cursor: pointer;
	color: white;
	transition: background 0.2s;

	&:hover {
		background: #333;
	}

	@media (min-width: 768px) {
		padding: 10px 28px;
		font-size: 16px;
	}
`

const MainContent = styled.main`
	max-width: 1200px;
	margin: 0 auto;
	padding: 40px 5%;

	@media (min-width: 768px) {
		padding: 60px 8%;
	}
`

const Hero = styled.div`
	text-align: center;
	margin: 40px 0 60px;

	@media (min-width: 768px) {
		margin: 60px 0 80px;
	}
`

const HeroTitle = styled.h1`
	font-size: 36px;
	font-weight: 700;
	color: #1a1a1a;
	margin-bottom: 16px;
	letter-spacing: -0.5px;

	@media (min-width: 768px) {
		font-size: 52px;
	}
`

const HeroSubtitle = styled.p`
	font-size: 16px;
	color: #666;
	line-height: 1.6;
	max-width: 600px;
	margin: 0 auto;

	@media (min-width: 768px) {
		font-size: 20px;
	}
`

const Section = styled.section`
	margin-bottom: 60px;

	@media (min-width: 768px) {
		margin-bottom: 80px;
	}
`

const SectionTitle = styled.h2`
	font-size: 28px;
	font-weight: 600;
	color: #333;
	margin-bottom: 30px;
	text-align: center;

	@media (min-width: 768px) {
		font-size: 36px;
		margin-bottom: 40px;
	}
`

const FeaturesGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;

	@media (min-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(4, 1fr);
		gap: 24px;
	}
`

const FeatureCard = styled.div`
	background: white;
	border-radius: 20px;
	padding: 24px;
	text-align: center;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	transition: transform 0.2s;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	}
`

const FeatureIcon = styled.div`
	width: 64px;
	height: 64px;
	background: #1a1a1a;
	border-radius: 32px;
	display: flex;
	align-items: center;
	justify-content: center;
	margin: 0 auto 16px;
	color: white;

	@media (min-width: 768px) {
		width: 80px;
		height: 80px;
		border-radius: 40px;

		svg {
			width: 36px;
			height: 36px;
		}
	}
`

const FeatureTitle = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 8px;

	@media (min-width: 768px) {
		font-size: 18px;
	}
`

const FeatureDesc = styled.p`
	font-size: 13px;
	color: #999;
	line-height: 1.4;

	@media (min-width: 768px) {
		font-size: 14px;
	}
`

const VenuesGrid = styled.div`
	display: grid;
	grid-template-columns: 1fr;
	gap: 16px;

	@media (min-width: 640px) {
		grid-template-columns: repeat(2, 1fr);
	}

	@media (min-width: 1024px) {
		grid-template-columns: repeat(4, 1fr);
	}
`

const VenueCard = styled.div`
	background: white;
	border-radius: 20px;
	padding: 20px;
	display: flex;
	align-items: center;
	gap: 16px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
	transition: transform 0.2s;

	&:hover {
		transform: translateY(-4px);
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
	}

	@media (min-width: 768px) {
		flex-direction: column;
		text-align: center;
		padding: 28px;
		gap: 12px;
	}
`

const VenueIcon = styled.div`
	width: 56px;
	height: 56px;
	background: #f0f0f0;
	border-radius: 16px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #1a1a1a;

	@media (min-width: 768px) {
		width: 80px;
		height: 80px;
		border-radius: 40px;

		svg {
			width: 36px;
			height: 36px;
		}
	}
`

const VenueInfo = styled.div`
	flex: 1;

	@media (min-width: 768px) {
		flex: none;
	}
`

const VenueName = styled.h3`
	font-size: 16px;
	font-weight: 600;
	color: #1a1a1a;
	margin-bottom: 4px;

	@media (min-width: 768px) {
		font-size: 18px;
		margin-bottom: 8px;
	}
`

const VenueType = styled.p`
	font-size: 12px;
	color: #999;

	@media (min-width: 768px) {
		font-size: 14px;
	}
`

const CTAButton = styled.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 12px;
	width: 100%;
	max-width: 300px;
	margin: 20px auto 0;
	padding: 16px 32px;
	background: #1a1a1a;
	color: white;
	border: none;
	border-radius: 50px;
	font-size: 16px;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.2s;

	&:hover {
		background: #333;
		transform: translateY(-2px);
	}

	@media (min-width: 768px) {
		max-width: 350px;
		padding: 18px 40px;
		font-size: 18px;
	}
`

const Home = () => {
	const navigate = useNavigate()

	const features = [
		{ icon: <Calendar size={28} />, title: 'Быстрое бронирование', desc: 'Оформление заявки за 5 минут' },
		{ icon: <MapPin size={28} />, title: 'Лучшие залы', desc: 'Только проверенные площадки' },
		{ icon: <CreditCard size={28} />, title: 'Удобная оплата', desc: 'Любой способ оплаты' },
		{ icon: <Star size={28} />, title: 'Отзывы клиентов', desc: '100% реальные отзывы' },
	]

	const venues = [
		{ name: 'Торжественный зал', type: 'Банкетный зал', icon: <MapPin size={28} /> },
		{ name: 'Изумруд', type: 'Ресторан', icon: <MapPin size={28} /> },
		{ name: 'Сакура', type: 'Летняя веранда', icon: <MapPin size={28} /> },
		{ name: 'Уют', type: 'Закрытая веранда', icon: <MapPin size={28} /> },
	]

	return (
		<Container>
			<Header>
				<Logo>Банкетам.Нет</Logo>
				<ButtonGroup>
					<LoginButton onClick={() => navigate('/login')}>Вход</LoginButton>
					<RegisterButton onClick={() => navigate('/register')}>Регистрация</RegisterButton>
				</ButtonGroup>
			</Header>

			<MainContent>
				<Slider />

				<Hero>
					<HeroTitle>Идеальный банкет</HeroTitle>
					<HeroSubtitle>
						Выберите лучшее помещение для вашего праздника среди проверенных залов и ресторанов
					</HeroSubtitle>
				</Hero>

				<Section>
					<SectionTitle>Почему выбирают нас</SectionTitle>
					<FeaturesGrid>
						{features.map((feature, index) => (
							<FeatureCard key={index}>
								<FeatureIcon>{feature.icon}</FeatureIcon>
								<FeatureTitle>{feature.title}</FeatureTitle>
								<FeatureDesc>{feature.desc}</FeatureDesc>
							</FeatureCard>
						))}
					</FeaturesGrid>
				</Section>

				<Section>
					<SectionTitle>Популярные помещения</SectionTitle>
					<VenuesGrid>
						{venues.map((venue, index) => (
							<VenueCard key={index}>
								<VenueIcon>{venue.icon}</VenueIcon>
								<VenueInfo>
									<VenueName>{venue.name}</VenueName>
									<VenueType>{venue.type}</VenueType>
								</VenueInfo>
							</VenueCard>
						))}
					</VenuesGrid>
				</Section>

				<CTAButton onClick={() => navigate('/register')}>
					Начать бронирование
					<ArrowRight size={20} />
				</CTAButton>
			</MainContent>
		</Container>
	)
}

export default Home