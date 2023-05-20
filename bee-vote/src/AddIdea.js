import React, { useState } from 'react';
import axios from 'axios';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate  } from 'react-router-dom';
import SimpleMDE from "react-simplemde-editor";  // Import the react-simplemde-editor library
import "easymde/dist/easymde.min.css";  // Import the EasyMDE styles

const AddIdea = () => {
	const navigate = useNavigate ();
	const { boardId } = useParams();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    setAuthHeader(localStorage.getItem('access_token'));

    const handleAdd = (event) => {
        event.preventDefault();

        const data = {
            user: JSON.parse(localStorage.getItem('user')).pk,
            board: boardId,
            title,
            content,
            order: 0,
        };

        axios.post(API_URL + `boards/${boardId}/ideas/`, data)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                setError('Error adding idea');
            });

        navigate(`/boards/${boardId}`);
    };

    return (
        <Form onSubmit={handleAdd}>
            <h2>Add Idea</h2>
            {error && <div>{error}</div>}
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="content">
                <Form.Label>Content</Form.Label>
                {/* Add the SimpleMDE editor here */}
                <SimpleMDE onChange={setContent} value={content} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Idea
            </Button>
        </Form>
    );
};

export default AddIdea;
