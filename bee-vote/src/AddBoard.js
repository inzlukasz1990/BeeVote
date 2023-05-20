import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import { Form, Button } from 'react-bootstrap';
import { useNavigate  } from 'react-router-dom';

const AddBoard = () => {
	const navigate = useNavigate ();
    const [title, setTitle] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
		setAuthHeader(localStorage.getItem('access_token'));
		
        axios.get(API_URL + 'groups/user_groups/')
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                setError('Error fetching groups');
            });
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        const data = {
			user: JSON.parse(localStorage.getItem('user')).pk,
            title,
            group: selectedGroup,
        };

        axios.post(API_URL + 'boards/', data)
            .then(response => {
                console.log(response.data);
                setTitle('');
                setSelectedGroup(null);
            })
            .catch(error => {
                setError('Error creating board');
            });
		navigate('/boards');
    };

    return (
        <Form onSubmit={handleSubmit}>
            <h2>Add Board</h2>
            {error && <div>{error}</div>}
            <Form.Group controlId="title">
                <Form.Label>Title</Form.Label>
                <Form.Control type="text" value={title} onChange={e => setTitle(e.target.value)} />
            </Form.Group>
            <Form.Group controlId="group">
                <Form.Label>Group</Form.Label>
                <Form.Control as="select" value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}>
                    <option value="">Select a group...</option>
                    {groups.map(group => (
                        <option key={group.id} value={group.id}>{group.name}</option>
                    ))}
                </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit">
                Add Board
            </Button>
        </Form>
    );
};

export default AddBoard;
