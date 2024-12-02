// src/app/home.tsx (hoặc src/pages/home.tsx)
import { CrownOutlined } from "@ant-design/icons";
import { Result } from "antd";
import React from "react";
import "@/app/(view)/styles/homepage.css";
import "@/app/(view)/js/index.js";

const HomePage = () => {
  return (
    // CONTENT BODY
    <div className="container">
      {/* SLIDESHOW */}
      <div className="slideshow_container">
        <div className="mySlides">
          <div className="numbertext">1 / 4</div>
          <img src="https://scontent.fsgn2-7.fna.fbcdn.net/v/t39.30808-6/460714297_830458182589031_6622012419330441947_n.jpg?_nc_cat=108&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGAVzpJIo1NOIDejcet6lA-U_4vclqIrvBT_i9yWoiu8DjhZKZN2PWChXgiimt3Pk97idCLvRu6tRi2SI2_JrDy&_nc_ohc=Nlcblm69pOgQ7kNvgGCps7L&_nc_zt=23&_nc_ht=scontent.fsgn2-7.fna&_nc_gid=A56Ttq_WLpNVIpfcdA1UnSd&oh=00_AYDsEdOcUAz9q-_QbHPgeXW-rTLpj7JSyriZMtVV6MpS8A&oe=67510451" 
            alt="Church" 
            style={{ width: "100%" }} 
            className="img_slide"
          />
        </div>

        <div className="mySlides">
          <div className="numbertext">2 / 4</div>
          <img src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/460926532_830458199255696_6297684085940191585_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeFab18liYfPIHTzO0k1ycZcn_A_AV8A7pmf8D8BXwDumSveZe4mKg-s-8_sAnK90ZxbbU3h68_MsV809QNxnL5a&_nc_ohc=KhQ-FFkKgqsQ7kNvgFJ6bPe&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=AHiZiMIF_4wUP0MWH2gsMSq&oh=00_AYBkGX6IfTW1QFLQEbsJByLalFCPFaikSLmhoSno22Ww8A&oe=6750FC8F" 
            alt="Church" 
            style={{ width: "100%" }} 
            className="img_slide"
          />
        </div>
        
        <div className="mySlides">
          <div className="numbertext">3 / 4</div>
          <img src="https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/460714155_830458222589027_2749287994792875887_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeGuDWUxyry3goR_KYwgK9k05iQ0zCl3ciTmJDTMKXdyJPyhgVIj7WKurJmy6dEz63smNhdSkivXKqmH503_4wGg&_nc_ohc=hOCOXfZJhvgQ7kNvgGxTEkF&_nc_zt=23&_nc_ht=scontent.fsgn2-9.fna&_nc_gid=AywNVOO7IUqkO2cVDGLWSJS&oh=00_AYAXevp1ayDxB4YbkrQgBKdh8C4GQlhaBZW3Y8B4KayChw&oe=6750F309" 
            alt="Church" 
            style={{ width: "100%" }} 
            className="img_slide"
          />
        </div>
        <div className="mySlides">
          <div className="numbertext">4 / 4</div>
          <img src="https://scontent.fsgn2-11.fna.fbcdn.net/v/t39.30808-6/460646639_830458685922314_3014483418841473016_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeG3jsYwiYjQdHUrMPS2Sd2EXeIsPjGRp99d4iw-MZGn396ZAWG3rkLnN4T8QExWkAXfH2EssNqngCJcyb8nnLii&_nc_ohc=DSaoP5t3RJEQ7kNvgH_2zTg&_nc_zt=23&_nc_ht=scontent.fsgn2-11.fna&_nc_gid=Aq71gDP3VBdlJSu3iI3ZN50&oh=00_AYBQE4fAQYs1xcpoT2kmJSST5kGojkxZLQ2X4eEkmwJYRw&oe=67511E94" 
            alt="Church" 
            style={{ width: "100%" }} 
            className="img_slide"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
