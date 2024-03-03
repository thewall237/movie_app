import AppLayout from '@/components/Layouts/AppLayout';
import { Box, Container, Grid, Typography } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import React from 'react'

const detail = ({ detail }) => {
  console.log(detail);
  return (
    <AppLayout
    header={
        <h2 className="font-semibold text-xl text-gray-800 leading-tight">
            Detail
        </h2>
    }>
    <Head>
        <title>Detail</title>
    </Head>

    <Box
        sx={{
          height: {xs: "auto", md: "70vh"},
          bgcolor: "red",
          position: "relative",
          display: "flex",
          alignItems: "center"
        }}>
        <Box 
          sx={{
            backgroundImage: `url(https://image.tmdb.org/t/p/w500/${detail.backdrop_path})`,
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right:0,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroudRepeat: "no-repeat",

            '&::before': {
              content: '""',
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(10px)",
            }
          }}
          />
        <Container sx={{ zIndex: 1}}>
          <Grid sx={{color: "white"}} container alignItems={'center'}>
            <Grid item xs={4} md={4} sx={{display: "flex", justifyContent: "center"}}>
              <img width="70%" src={`https://image.tmdb.org/t/p/w500/${detail.poster_path}`} alt={detail.title} />
            </Grid>
            <Grid item xs={8} md={8}>
              <Typography variant="h4" paragraph>{detail.title}</Typography>
              <Typography paragraph>{detail.overview}</Typography>
              <Typography variant='h6'>公開日{detail.release_date}</Typography>
            </Grid>
          </Grid>
        </Container>
    </Box>
    
    </AppLayout>
  )
}

// SSR
export async function getServerSideProps(context) {
  const { media_type, media_id } = context.params;

  try {
      const jpResponse = await axios.get(`https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=ja-JP`);
      
      let combinedData = {...jpResponse.data};

      if(!jpResponse.data.overview) {
        const enResponse = await axios.get(`https://api.themoviedb.org/3/${media_type}/${media_id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`);
        combinedData.overview = enResponse.data.overview;
      }
      return {
        props: {
          detail: combinedData
        }
      }
  } catch (error) {
    console.error(context);
    return {
      notFound: true
    }
  }
}


export default detail