import React from 'react';
import {Carousel } from "react-bootstrap";
import img1 from "../../../assets/images/img1.png";
import img2 from "../../../assets/images/img2.jpg";
import img3 from "../../../assets/images/img3.jpg";
const Banner = () => {
    return (
        <div>
        {/* Carousel */}
            <Carousel>
                <Carousel.Item interval={1000}>
                <img className="d-block w-100" src={img1} alt="Slide 1" />
                </Carousel.Item>
                <Carousel.Item interval={2000}>
                <img className="d-block w-100" src={img2} alt="Slide 2" />
                </Carousel.Item>
                <Carousel.Item>
                <img className="d-block w-100" src={img3} alt="Slide 3" />
                </Carousel.Item>
            </Carousel>
        </div>
    );
}

export default Banner;
