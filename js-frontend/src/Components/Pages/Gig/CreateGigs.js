import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Row, Col, Container, Form, Button } from "react-bootstrap";
import axios from "axios";
import { BASE_URL } from "../../utils/contants";
const CreateGigs = () => {
  const user = JSON.parse(localStorage.getItem("authUser"))._id;
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setdescription] = useState("");
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("user", user);
    formData.append("price", price);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("image", image);
    axios
      .post(`${BASE_URL}/api/gig/upload`, formData, {
        // headers: { "Content-Type": "multipart/form-data boundary=MyBoundary" },
      })
      .then((data) => {
        navigate("/pages/gigs");
      })
      .catch((err) => console.log(err));
  };
  return (
    <Container>
      <Row>
        <Col md="6" className="d-flex flex-column">
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Label className="my-3">Gig Title</Form.Label>
              <Form.Control
                required
                type="text"
                name="title"
                placeholder="Title"
                value={title}
                onChange={(e) => {
                  e.preventDefault();
                  setTitle(e.target.value);
                }}
              />
              <Form.Label className="my-3">Gig Description</Form.Label>
              <Form.Control
                required
                as={"textarea"}
                type="text"
                name="description"
                placeholder="Description"
                value={description}
                onChange={(e) => {
                  e.preventDefault();
                  setdescription(e.target.value);
                }}
              />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Upload your gig Image here</Form.Label>
              <Form.Control
                required
                type="file"
                name="image"
                onChange={(e) => {
                  setImage(e.target.files[0]);
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Set Price For Your Gig</Form.Label>
              <Form.Control
                required
                type="number"
                onChange={(e) => {
                  setPrice(e.target.value);
                }}
              />
            </Form.Group>
            <Button className="my-3" variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateGigs;
