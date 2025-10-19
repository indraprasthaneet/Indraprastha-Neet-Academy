import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from 'react-redux';
// Import local review images
import image1 from '../assets/reviews/image1.png';
import image2 from '../assets/reviews/image2.png';
import image3 from '../assets/reviews/image3.png';
import image5 from '../assets/reviews/image5.png';
import image6 from '../assets/reviews/image6.png';


function ReviewPage() {
  const [latestReview,setLatestReview] =useState([]);
  const {allReview} = useSelector(state=>state.review)
  
  // Static review data for Indraprastha Neet Academy
  const staticReviews = [
    {
      id: 1,
      user: {
        name: "Arjun Sharma",
        photoUrl: image1,
        role: "NEET Aspirant"
      },
      rating: 5,
      comment: "Indraprastha Neet Academy transformed my preparation journey completely. The structured approach and experienced faculty helped me achieve my dream score in NEET."
    },
    {
      id: 2,
      user: {
        name: "Priya Patel",
        photoUrl: image2,
        role: "Medical Student"
      },
      rating: 5,
      comment: "The academy's comprehensive study material and mock tests were instrumental in my success. Indraprastha Neet Academy truly understands what NEET aspirants need."
    },
    {
      id: 3,
      user: {
        name: "Rahul Verma",
        photoUrl: image3,
        role: "NEET Qualifier"
      },
      rating: 4,
      comment: "Outstanding teaching methodology and personalized attention at Indraprastha Neet Academy. The doubt clearing sessions were particularly helpful for complex topics."
    },
    {
      id: 4,
      user: {
        name: "Sneha Gupta",
        photoUrl: image5,
        role: "AIIMS Qualifier"
      },
      rating: 5,
      comment: "The academy's focus on conceptual clarity and regular practice tests made all the difference. Indraprastha Neet Academy is the best choice for serious NEET preparation."
    },
  ];
  
  useEffect(()=>{
    // Show static reviews if no dynamic reviews are available, otherwise show dynamic reviews
    if (allReview && allReview.length > 0) {
      setLatestReview(allReview.slice(0,6));
    } else {
      setLatestReview(staticReviews);
    }
    },[allReview])
  return (
     <div className='flex items-center justify-center flex-col'>
      <h1 className='md:text-[45px] text-[30px] font-semibold text-center mt-[30px] px-[20px]'>Real Reviews from Real Learners</h1>
      <span className='lg:w-[50%] md:w-[80%] text-[15px] text-center mt-[30px] mb-[30px] px-[20px]'>Discover how our Indraprastha Neet Academy is transforming learning experiences through real feedback from students and professionals worldwide.</span>
    <div className='w-[100%] min-[100vh] flex items-center justify-center flex-wrap gap-[50px] lg:p-[50px] md:p-[30px] p-[10px] mb-[40px]

    '>
      
     
            {
                latestReview.map((item,index)=>(
                    <ReviewCard key={item.id || index} rating={item.rating} image={item.user.photoUrl} text={item.comment} name={item.user.name} role={item.user.role} />
                ))
            }
             
    
    
    </div>
    </div>
  )
}
 

export default ReviewPage
