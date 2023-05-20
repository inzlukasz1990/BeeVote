import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import ReactMarkdown from 'react-markdown';  // Import the react-markdown library

const IdeaDetails = () => {
  const { boardId, id } = useParams();
  const [idea, setIdea] = useState(null);

  useEffect(() => {
    setAuthHeader(localStorage.getItem('access_token'));

    axios.get(API_URL + `boards/${boardId}/ideas/${id}/`)
      .then(response => {
        setIdea(response.data);
      })
      .catch(error => {
        console.error('Error fetching idea');
      });
  }, [boardId, id]);

  return (
    <div>
      <h2>{idea?.title}</h2>
      <ReactMarkdown>{idea?.content}</ReactMarkdown>
    </div>
  );
};

export default IdeaDetails;
