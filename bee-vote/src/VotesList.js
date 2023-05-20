import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import { Table } from 'react-bootstrap';
import { useParams } from "react-router-dom";

const VotesList = () => {
  const { boardId, id } = useParams();
  const [votes, setVotes] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    setAuthHeader(localStorage.getItem('access_token'));

    axios.get(API_URL + `boards/${boardId}/ideas/${id}/votes/all_votes`)
      .then(response => {
        setVotes(response.data);
      })
      .catch(error => {
        setError('Error fetching votes');
      });
  }, []);

  return (
    <div>
      <h2>Votes</h2>
      {error && <div>{error}</div>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>User</th>
            <th>Idea</th>
            <th>Value</th>
          </tr>
        </thead>
        <tbody>
          {votes.map(vote => (
            <tr key={vote.id}>
              <td>{vote.id}</td>
              <td>{vote.user.username}</td>
              <td>{vote.idea}</td>
              <td>{vote.value ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VotesList;
