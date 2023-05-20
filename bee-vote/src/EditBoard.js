import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate  } from 'react-router-dom';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import { Form, Button } from 'react-bootstrap';

const EditBoard = () => {
	const navigate = useNavigate ();
    const { id } = useParams();  // Pobierz id z parametrów URL
    const [title, setTitle] = useState('');
    const [groups, setGroups] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState('');
    const [error, setError] = useState(null);

    useEffect(() => {
		setAuthHeader(localStorage.getItem('access_token'));
		
        // Pobierz dane tablicy
        axios.get(API_URL + `boards/${id}/`)
            .then(response => {
                setTitle(response.data.title);
                setSelectedGroup(response.data.group);
            })
            .catch(error => {
                setError('Error fetching board data');
            });
		
		// Pobierz grupy
        axios.get(API_URL + 'groups/')
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                setError('Error fetching groups');
            });
    }, [id]);

    const handleEdit = (event) => {
        event.preventDefault();

        const data = {
			user: localStorage.getItem('user_pk'),
            title,
            group: selectedGroup,
        };

        axios.put(API_URL + `boards/${id}/`, data)
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                setError('Error editing board');
            });
		navigate('/boards');
    };

    return (
        <Form onSubmit={handleEdit}>
            <h2>Edit Board</h2>
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
                Save Changes
            </Button>
        </Form>
    );
};

export default EditBoard;
