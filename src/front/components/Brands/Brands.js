import React, {Component} from 'react';
import {Container} from 'react-bootstrap'
import {isMobile} from "react-device-detect";

class Brands extends Component {
    render() {
        const params = {
            slidesPerView: 6,
            spaceBetween: 10,
            breakpoints: {
                1024: {
                    slidesPerView: 6,
                    spaceBetween: 10
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 30
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                320: {
                    slidesPerView: 3,
                    spaceBetween: 10
                }
            }
        }

        return (
            <Container fluid>
                <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                    {
                        this.props.brands.map((brand, index) => (
                            <div key={index} style={{backgroundColor: 'green', width: '', height: '', margin: '10px 10px'}}>
                                {/*{brand.name}*/}
                                <div style={{
                                    backgroundImage: `url(${brand.logo})`,
                                    backgroundColor: '#fff',
                                    padding: "10px",
                                    backgroundSize: "cover",
                                    backgroundRepeat: "no-repeat",
                                    width: isMobile ? "120px" : '210px',
                                    height: isMobile ? "80px" : '130px'
                                }}/>
                            </div>
                        ))
                    }
                </div>
            </Container>
        );
    }
}

export default Brands;
