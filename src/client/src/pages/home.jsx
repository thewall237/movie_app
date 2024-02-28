import AppLayout from '@/components/Layouts/AppLayout'
import axios from 'axios'
import Head from 'next/head'
import { useEffect, useState } from 'react'

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
                console.log(error)
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
                <title>Laravel - Home</title>
            </Head>

            {movies.map((movie) => (
                <img src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`} alt={movie.title} key={movie.id} />
            ))}
        </AppLayout>
    )
}

export default Home
