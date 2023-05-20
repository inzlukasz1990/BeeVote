import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import { Table, Button } from 'react-bootstrap';

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAuthHeader(localStorage.getItem('access_token'));
    
    axios.get(API_URL + 'boards/')
      .then(response => {
        setBoards(response.data);
      })
      .catch(error => {
        setError('Error fetching boards');
      });
  }, []);

  const deleteBoard = (id) => {
    axios.delete(API_URL + `boards/${id}/`)
      .then(response => {
        setBoards(boards.filter(board => board.id !== id));
      })
      .catch(error => {
        setError('Error deleting board');
      });
  };

  return (
    <div>
      <h2>Boards</h2>
      {error && <div>{error}</div>}
      <Link to="/board/add">Add Board</Link>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>User</th>
            <th>Group</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {boards.map(board => (
            <tr key={board.id}>
              <td>{board.id}</td>
              <td><Link to={`/boards/${board.id}`}>{board.title}</Link></td>
              <td>{board.user}</td>
              <td>{board.group}</td>
              <td>
                <Link to={`/board/edit/${board.id}`}>Edit</Link>
                <Button variant="danger" onClick={() => deleteBoard(board.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default BoardList;
