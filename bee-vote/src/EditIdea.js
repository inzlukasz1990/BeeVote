import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import { Form, Button } from 'react-bootstrap';
import SimpleMDE from "react-simplemde-editor";  // Import the react-simplemde-editor library
import "easymde/dist/easymde.min.css";  // Import the EasyMDE styles

const EditIdea = () => {
	const navigate = useNavigate ();
    const { boardId, id } = useParams();
    const [idea, setIdea] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [error, setError] = useState(null);

    setAuthHeader(localStorage.getItem('access_token'));

    useEffect(() => {
        axios.get(API_URL + `boards/${boardId}/ideas/${id}/`)
            .then(response => {
                setIdea(response.data);
                setTitle(response.data.title);
                setContent(response.data.content);
            })
            .catch(error => {
                setError('Error fetching idea');
            });
    }, [id]);

    const handleEdit = (event) => {
        event.preventDefault();

        const data = {
            user: idea.user,
            board: idea.board,
            title,
            content,
        };

        axios.put(API_URL + `boards/${boardId}/ideas/${id}/`, data)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                setError('Error editing idea');
            });

        navigate(`/boards/${boardId}`);
    };

    return (
        <Form onSubmit={handleEdit}>
            <h2>Edit Idea</h2>
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
                Save Changes
            </Button>
        </Form>
    );
};

export default EditIdea;
