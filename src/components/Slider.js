import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SliderContainer = styled.div`
	position: relative;
	width: 100%;
	height: 280px;
	overflow: hidden;
	border-radius: 20px;
	margin-bottom: 32px;
	background-color: #e0e0e0;

	@media (min-width: 768px) {
		height: 450px;
		border-radius: 28px;
		margin-bottom: 48px;
	}

	@media (min-width: 1024px) {
		height: 550px;
	}
`

const SlidesWrapper = styled.div`
	display: flex;
	width: 100%;
	height: 100%;
	transition: transform 0.5s ease-in-out;
	transform: translateX(-${props => props.currentIndex * 100}%);
`

const Slide = styled.div`
	min-width: 100%;
	height: 100%;
	position: relative;
	background-color: #e0e0e0;
`

const SlideImage = styled.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
	display: block;
`

const Arrow = styled.button`
	position: absolute;
	top: 50%;
	transform: translateY(-50%);
	background: rgba(0, 0, 0, 0.5);
	border: none;
	border-radius: 50%;
	width: 36px;
	height: 36px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	color: white;
	transition: all 0.2s;
	z-index: 10;
	backdrop-filter: blur(4px);

	&:first-of-type {
		left: 12px;
	}

	&:last-of-type {
		right: 12px;
	}

	&:hover {
		background: rgba(0, 0, 0, 0.7);
		transform: translateY(-50%) scale(1.05);
	}

	@media (min-width: 768px) {
		width: 48px;
		height: 48px;

		&:first-of-type {
			left: 20px;
		}

		&:last-of-type {
			right: 20px;
		}

		svg {
			width: 24px;
			height: 24px;
		}
	}
`

const DotsContainer = styled.div`
	position: absolute;
	bottom: 16px;
	left: 0;
	right: 0;
	display: flex;
	justify-content: center;
	gap: 10px;
	z-index: 2;

	@media (min-width: 768px) {
		bottom: 24px;
		gap: 14px;
	}
`

const Dot = styled.button`
	width: 8px;
	height: 8px;
	border-radius: 50%;
	border: none;
	background: ${props =>
		props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'};
	cursor: pointer;
	padding: 0;
	transition: all 0.2s;

	&:hover {
		transform: scale(1.2);
	}

	@media (min-width: 768px) {
		width: 10px;
		height: 10px;
	}
`

const images = [
	'/images/1.jpg',
	'/images/2.jpg',
	'/images/3.jpg',
	'/images/4.jpg',
]

const Slider = () => {
	const [currentIndex, setCurrentIndex] = useState(0)
	const [loadedImages, setLoadedImages] = useState([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const preloadImages = async () => {
			const validImages = []
			for (const imgSrc of images) {
				try {
					await new Promise((resolve, reject) => {
						const img = new Image()
						img.onload = resolve
						img.onerror = reject
						img.src = imgSrc
					})
					validImages.push(imgSrc)
				} catch {
					validImages.push('https://picsum.photos/id/104/1200/650')
				}
			}
			setLoadedImages(validImages)
			setLoading(false)
		}

		preloadImages()
	}, [])

	useEffect(() => {
		if (loadedImages.length === 0) return

		const interval = setInterval(() => {
			setCurrentIndex(prev => (prev + 1) % loadedImages.length)
		}, 3000)
		return () => clearInterval(interval)
	}, [loadedImages])

	const goToPrev = () => {
		setCurrentIndex(
			prev => (prev - 1 + loadedImages.length) % loadedImages.length,
		)
	}

	const goToNext = () => {
		setCurrentIndex(prev => (prev + 1) % loadedImages.length)
	}

	if (loading || loadedImages.length === 0) {
		return (
			<SliderContainer>
				<div
					style={{
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						height: '100%',
						color: '#666',
					}}
				>
					Загрузка изображений...
				</div>
			</SliderContainer>
		)
	}

	return (
		<SliderContainer>
			<SlidesWrapper currentIndex={currentIndex}>
				{loadedImages.map((img, idx) => (
					<Slide key={idx}>
						<SlideImage src={img} alt={`Банкетный зал ${idx + 1}`} />
					</Slide>
				))}
			</SlidesWrapper>

			<Arrow direction='left' onClick={goToPrev}>
				<ChevronLeft size={24} />
			</Arrow>
			<Arrow direction='right' onClick={goToNext}>
				<ChevronRight size={24} />
			</Arrow>

			<DotsContainer>
				{loadedImages.map((_, idx) => (
					<Dot
						key={idx}
						active={idx === currentIndex}
						onClick={() => setCurrentIndex(idx)}
					/>
				))}
			</DotsContainer>
		</SliderContainer>
	)
}

export default Slider