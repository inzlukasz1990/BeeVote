import React, { useState } from 'react';
import axios from 'axios';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import { Form, Button } from 'react-bootstrap';
import { useParams, useNavigate  } from 'react-router-dom';

const AddIdea = () => {
	const navigate = useNavigate ();
	const { boardId } = useParams();
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    setAuthHeader(localStorage.getItem('access_token'));

    const handleAdd = (event) => {
        event.preventDefault();

        const data = {
            user: JSON.parse(localStorage.getItem('user')).pk,
            board: boardId,
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
            <Form.Group controlId="content">
                <Form.Label>Content</Form.Label>
                <Form.Control type="text" value={content} onChange={e => setContent(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Idea
            </Button>
        </Form>
    );
};

export default AddIdea;
