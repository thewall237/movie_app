import AppLayout from '@/components/Layouts/AppLayout'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Button, CardActionArea, CardMedia, Typography } from '@mui/material';
import Link from 'next/link';

const Home = () => {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get('api/getPopularMovies');
                // console.log(response.data.results);
                setMovies(response.data.results);
                console.log(movies);
            } catch (error) {
                console.log(error);
            }
        }
        fetchMovies();
    }, [])

    return (
        <AppLayout
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Home
                </h2>
            }>
            <Head>
                <title>Home</title>
            </Head>

            <Swiper
            spaceBetween={20}
            slidesPerView={5}
            onSlideChange={() => console.log('slide change')}
            onSwiper={(swiper) => console.log(swiper)}
            breakpoints={{
                0: {
                    slidesPerView: 1,
                },
                500: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20,
                },
                768: {
                    slidesPerView: 4,
                    spaceBetween: 40,
                },
                1024: {
                    slidesPerView: 5,
                    spaceBetween: 50,
                },
            }}
            >
                {movies.map((movie) => (
                    <SwiperSlide key={movie.id}>
                        <Link href={`detail/movie/${movie.id}`}>
                        <CardActionArea>
                            <CardMedia
                                component={"img"}
                                sx={{
                                    aspectRatio: '2/3',
                                }}
                                image={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                alt={movie.title}
                            />
                        </CardActionArea>
                        </Link>
                        <Typography>
                            公開日：{movie.release_date}
                        </Typography>
                    </SwiperSlide>
                ))}

            </Swiper>

        </AppLayout>
    )
}

export default Home
