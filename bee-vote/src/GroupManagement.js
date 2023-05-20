import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { setTokens, setAuthHeader } from './auth';
import { API_URL } from './config';
import { Button, Container, Row, Col, Card, Alert } from 'react-bootstrap';

const GroupManagement = () => {
    const [groups, setGroups] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        setAuthHeader(localStorage.getItem('access_token'));

        // Pobierz dostępne grupy po załadowaniu komponentu
        axios.get(API_URL + 'groups/')
            .then(response => {
                setGroups(response.data);
            })
            .catch(error => {
                setError('Error fetching groups');
            });
    }, []);

    const joinGroup = (groupId) => {
        axios.post(API_URL + `users/${JSON.parse(localStorage.getItem('user')).pk}/join_group/`, { group: groupId })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                setError('Error joining group');
            });
    };

    const leaveGroup = (groupId) => {
        axios.post(API_URL + `users/${JSON.parse(localStorage.getItem('user')).pk}/leave_group/`, { group: groupId })
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                setError('Error leaving group');
            });
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2>Group Management</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {groups.map(group => (
                        <Card key={group.id} className="mb-3">
                            <Card.Body>
                                <Card.Title>{group.name}</Card.Title>
                                <Button variant="primary" onClick={() => joinGroup(group.id)}>Join</Button>{' '}
                                <Button variant="danger" onClick={() => leaveGroup(group.id)}>Leave</Button>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
};

export default GroupManagement;
