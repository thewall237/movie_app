import AppLayout from '@/components/Layouts/AppLayout';
import laravelAxios from '@/lib/laravelAxios';
import { Box, Button, Card, CardContent, Container, Fab, Grid, Modal, Rating, TextareaAutosize, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import Head from 'next/head';
import React, { useEffect, useState } from 'react'
import AddIcon from '@mui/icons-material/Add'
import StarIcon from '@mui/icons-material/Star'

const detail = ({ detail, media_type, media_id }) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] =  useState(0);
  const [review, setReview] = useState("");
  const [reviews, setReviews] = useState([]);
  
  const handleOpen = () => {
    setOpen(true);
  }
  
  const handleClose = () => {
    setOpen(false);
  }
  
  const handleReviewChange = (e) => {
    setReview(e.target.value);
  }
  
  const handleRatingChange = (e, newValue) => {
    setRating(newValue);
  }
  
  const isDisabled = !rating || !review.trim();
  
  const handleReviewAdd = async() => {
    handleClose();
    try {
      const response = await laravelAxios.post(`api/reviews`, {
        content: review,
        rating: rating,
        media_type: media_type,
        media_id: media_id,
      });
      const newReview = response.data;

      setReviews([...reviews, newReview]);

      setReview("");
      setRating(0);
      const updatedReviews = [...reviews, newReview];
      updateAverageRating(updatedReviews);
    } catch(error) {
      console.log(error)
    } 
  }

  const updateAverageRating = (updatedReviews) => {
    if(updatedReviews.length > 0) {
      // レビューの星の数の合計値を計算
      const totalRating = updatedReviews.reduce((acc, review) => acc + review.rating, 0);
      const average = (totalRating / updatedReviews.length).toFixed(1);
      console.log(average)
    }

  }
  useEffect(() => {
      const fetchReviews = async() => {
          try {
            const response = await laravelAxios.get(`api/reviews/${media_type}/${media_id}`);
            setReviews(response.data);
          }catch(error){
              console.log(error);
          }
      }
      fetchReviews();

  },[media_type,media_id])

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

    {/* 映画情報部分 */}
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
              <Typography variant="h4" paragraph>{detail.title || detail.name}</Typography>
              <Typography paragraph>{detail.overview}</Typography>
              <Box
                gap={2}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mb:2
                }}
              >
                <Rating
                  readOnly
                  precision={0.5}
                  emptyIcon={<StarIcon style={{color: "white"}}/>}
                />
                <Typography
                  sx={{
                    ml:1,
                    fontSize: '1.5rem',
                    fontWeight: "bold"
                  }}
                >
                  3
                </Typography>
              </Box>
              <Typography variant='h6'>
                  {media_type == "movie" ? `公開日：${detail.release_date}` : `初回放送日：${detail.first_air_date}`}
              </Typography>
            </Grid>
          </Grid>
        </Container>
    </Box>
    {/* 映画情報ここまで */}

    {/* レビュー内容表示 */}
    <Container sx={{py:4}}>
          <Typography
              component={"h1"}
              variant='h4'
              align='center'
              gutterBottom
          >
            レビュー一覧
          </Typography>

          <Grid container spacing={3}>
              {reviews.map((review) => (
                  <Grid item xs={12} key={review.id}>
                        <Card>
                            <CardContent>
                                <Typography
                                    variant='h6'
                                    component={"div"}
                                    gutterBottom
                                >
                                    {review.user.name}
                                </Typography>

                                <Rating
                                    value={review.rating}
                                    readOnly
                                />

                                <Typography
                                    variant='body2'
                                    color="textSeconfary"
                                    paragraph
                                >
                                    {review.content}
                                </Typography>
                            </CardContent>
                        </Card>
                  </Grid>
              ))}
          </Grid>
    </Container>
    {/* レビュー内容表示ここまで */}
    
    {/* レビュー追加ボタン */}
    <Box
        sx={{
            position: "fixed",
            bottom: "16px",
            right: "16px",
            zIndex: 5,
        }}
    >
        <Tooltip title="レビュー追加">
            <Fab
                  style={{background: "#1976d2", color: "white"}}
                  onClick={handleOpen}
                >
                  <AddIcon />
            </Fab>
        </Tooltip>
    </Box>
    {/* レビュー追加ボタンここまで */}

    {/* モーダルウィンドウ */}
    <Modal open={open} onClose={handleClose}>
          <Box
              sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  border: "2px solid, #000",
                  boxShadow: 24,
                  p: 8,
              }}
          >
              <Typography variant='h6' component="h2">
                    レビューを書く
              </Typography>

              <Rating
                  required
                  onChange={handleRatingChange}
                  value={rating}
              />
              <TextareaAutosize
                  required
                  minRows={5}
                  placeholder="レビュー内容"
                  style={{ width: "100px", marginTop: "10px" }}
                  onChange={handleReviewChange}
                  value={review}
              />

              <Button
                  variant='outlined'
                  disabled={isDisabled}
                  onClick={handleReviewAdd}
              >
                    送信
              </Button>
          </Box>

    </Modal>

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
          detail: combinedData,
          media_type,
          media_id
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