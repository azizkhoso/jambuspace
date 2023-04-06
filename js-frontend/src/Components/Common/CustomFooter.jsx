import React from "react";
import {Container, Row, Col} from "react-bootstrap";
import { FaFacebookF, FaLinkedinIn, FaTwitter, FaYoutube, FaInstagram} from "react-icons/fa";

const CustomFooter = () => {
    return (
        <Container fluid className="home-footer py-4">
            <Container>
                <Row className="border-bottom py-3">
                    <Col md={6} className="d-flex align-items-center">
                        <p className="mb-0 text-white me-3">Follow Us</p>
                        <div className="social d-flex align-items-center justify-content-center">
                            <div className="p-1 px-2 m-1 border rounded-circle">
                                <FaFacebookF fontSize={15} fill="white" />
                            </div>
                            <div className="p-1 px-2 m-1 border rounded-circle">
                                <FaLinkedinIn fontSize={15} fill="white" />
                            </div>
                            <div className="p-1 px-2 m-1 border rounded-circle">
                                <FaTwitter fontSize={15} fill="white" />
                            </div>
                            <div className="p-1 px-2 m-1 border rounded-circle">
                                <FaYoutube fontSize={15} fill="white" />
                            </div>
                            <div className="p-1 px-2 m-1 border rounded-circle">
                                <FaInstagram fontSize={15} fill="white" />
                            </div>
                        </div>
                    </Col>

                    <Col
                        md={6}
                        className="d-flex align-items-center justify-content-end"
                    >
                        <p className="mb-0 text-white">Mobile app</p>
                        <div className="d-flex">
                            <div className="p-1 px-2 m-1 border rounded-circle">
                                <FaYoutube fontSize={15} fill="white" />
                            </div>

                            <div className="p-1 px-2 m-1 border rounded-circle">
                                <FaInstagram fontSize={15} fill="white" />
                            </div>
                        </div>
                    </Col>
                </Row>

                <Row className="py-1 footer-bottom">
                    <Col
                        sm={12}
                        md={12}
                        className="d-flex justify-content-center px-2 my-2"
                    >
                        <p className="mb-0 text-white footer-text">
                            © 2015 - 2022 JambuSpace® Global Inc.
                        </p>
                    </Col>

                    <Col
                        sm={12}
                        md={12}
                        className="d-flex align-items-center justify-content-center px-3 my-2"
                    >
                        <p className="mb-0 mx-3 text-white footer-text">
                            Terms of Service
                        </p>
                        <p className="mb-0 mx-3 text-white footer-text">
                            Privacy Policy
                        </p>
                        <p className="mb-0 mx-3 text-white footer-text">
                            CA Notice at Collection
                        </p>
                        <p className="mb-0 mx-3 text-white footer-text">
                            Cookie Settings
                        </p>
                        <p className="mb-0 mx-3 text-white footer-text">
                            Accessibility
                        </p>
                    </Col>
                </Row>
            </Container>
        </Container>
    );
};

export default CustomFooter;
