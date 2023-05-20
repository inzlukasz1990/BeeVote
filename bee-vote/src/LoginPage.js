import React, { useState } from 'react';
import { Container, Tab, Nav, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { setTokens, setAuthHeader } from './auth';
import { API_URL } from './config';
import { useNavigate  } from 'react-router-dom';

const LoginPage = () => {
	const navigate = useNavigate ();
    const [key, setKey] = useState('login');
    const [error, setError] = useState(null);

    const login = async (event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const password = event.target.password.value;

        try {
            const response = await axios.post(API_URL + 'auth/login/', { username, password });
			setTokens(response.data.key, null);
            setError(null);
        } catch (error) {
            setError('Login failed');
        }
		
		try {
			setAuthHeader(localStorage.getItem('access_token'));
		} catch (error) {
			setError('Token invalid');
		}
		
		axios.get(API_URL + 'auth/user/')
			.then(response => {
                localStorage.setItem('user', JSON.stringify(response.data));
            })
			.catch(error => {
                setError('Error fetching user');
            });
		
		navigate('/boards');
    };

    const signup = async (event) => {
        event.preventDefault();

        const username = event.target.username.value;
        const email = event.target.email.value;
        const password1 = event.target.password1.value;
        const password2 = event.target.password2.value;

        try {
            const response = await axios.post(API_URL + 'auth/registration/', { username, email, password1, password2 });
            setError(null);
        } catch (error) {
            setError('Signup failed');
        }
		
		navigate('/boards');
    };

    return (
        <Container className="my-5">
            <Tab.Container id="login-signup-tabs" activeKey={key} onSelect={k => setKey(k)}>
                <Nav justify variant="tabs">
                    <Nav.Item>
                        <Nav.Link eventKey="login">Login</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                    </Nav.Item>
                </Nav>

                {error && <Alert variant='danger'>{error}</Alert>}

                <Tab.Content>
                    <Tab.Pane eventKey="login" className="my-3">
                        <Form onSubmit={login}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control name="username" type="text" placeholder="Enter username" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Password" />
                            </Form.Group>

                            <Button variant="primary" type="submit">Login</Button>
                        </Form>
                    </Tab.Pane>

                    <Tab.Pane eventKey="signup" className="my-3">
                        <Form onSubmit={signup}>
                            <Form.Group className="mb-3">
                                <Form.Label>Username</Form.Label>
                                <Form.Control name="username" type="text" placeholder="Enter username" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Enter email" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Password</Form.Label>
                                <Form.Control name="password1" type="password" placeholder="Password" />
                            </Form.Group>

                            <Form.Group className="mb-3">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control name="password2" type="password" placeholder="Confirm Password" />
                            </Form.Group>

                            <Button variant="primary" type="submit">Sign Up</Button>
                        </Form>
                    </Tab.Pane>
                </Tab.Content>
            </Tab.Container>
        </Container>
    );
};

export default LoginPage;
