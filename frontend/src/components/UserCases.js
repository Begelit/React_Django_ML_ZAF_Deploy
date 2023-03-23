import React, { useState } from "react";
import { Form, Button, Image } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import axios from 'axios';

const UserCases = (note) => {

    const [selectedImage, setSelectedImage] = useState(null);
    const [imageObjURL, setimageObjURL] = useState(null);

    if (note.note == '4'){

        const handleImageChange = (event) => {
            if (event.target.files.length !== 0){
                setSelectedImage(event.target.files[0]);
                setimageObjURL(URL.createObjectURL(event.target.files[0]));
            }
        };
    
        const handleImageUpload = async() => {
            const formData = new FormData();
            formData.append('image', selectedImage);
            const response = await fetch(`/api/note/${note.note}/`,
                {
                    method: 'POST',
                    body: formData
                }).catch(error => {
                    console.log(error)
            })
            const data_return = await response.json().then((data) => {
                return data;
            }).catch(error => {
                console.log(error)
            })
            console.log(data_return, data_return.result);
            document.getElementById("BrainTumorH2-id").innerHTML = "Prediction: "+data_return.result;
        };

        return (
            <div className="container">
                <div className="uploadingimg-class">
                    <div className="row">
                        <div className="col">
                            <Form>
                                <Form.Group controlId="formFile" className="mb-3">
                                    <Form.Label>Select an image</Form.Label>
                                    <Form.Control type="file" onChange={handleImageChange} />
                                </Form.Group>
                                <Button variant="primary" onClick={handleImageUpload}>
                                    Upload Image
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
                <div className="prediction-class">
                    <div className="row">
                        <div className="col p-3">
                            <h2 align="center" id="BrainTumorH2-id">Prediction: </h2>
                        </div>
                    </div>
                </div>
                <div className="printedimg-class">
                    <div className="row">
                        <div className="col">
                            {/*<Image src={URL.createObjectURL(selectedImage)} fluid />*/}
                            {<Image src={imageObjURL} fluid />}
                            {/*<img
                                src={URL.createObjectURL(selectedImage)}
                            />*/}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default UserCases