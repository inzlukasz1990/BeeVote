import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { setAuthHeader } from './auth';
import { API_URL } from './config';
import { ListGroup, Button, Table } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const BoardDetails = () => {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [ideas, setIdeas] = useState([]);
  const [error, setError] = useState(null);
  const [hasOrderChanged, setHasOrderChanged] = useState(false);  // New state

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = (result) => {
    const items = reorder(ideas, result.source.index, result.destination.index);

    setIdeas(items);
    setHasOrderChanged(true);  // Set the state to true when order changes
  };

  const saveOrder = () => {
    // Make PATCH requests to update the order in the server
    // Update all ideas because we don't know how many have been moved
    ideas.forEach((idea, index) => {
      axios.patch(API_URL + `boards/${boardId}/ideas/${idea.id}/`, {
        order: index,  // update the order of idea
      })
      .then(response => {
        setHasOrderChanged(false);  // Reset the state after saving
      })
      .catch(error => {
        setError('Error saving order');
      });
    });
  };

  useEffect(() => {
    setAuthHeader(localStorage.getItem('access_token'));
    
    axios.get(API_URL + `boards/${boardId}/`)
      .then(response => {
        setBoard(response.data);
      })
      .catch(error => {
        setError('Error fetching board');
      });
    
    axios.get(API_URL + `boards/${boardId}/ideas/`)
      .then(response => {
        // Add isOwner field to each idea
        const ideasWithOwnership = response.data.map(idea => ({
          ...idea, 
          isOwner: parseInt(idea.user) === parseInt(JSON.parse(localStorage.getItem('user')).pk),
        }));
        setIdeas(ideasWithOwnership);
      })
      .catch(error => {
        setError('Error fetching ideas');
      });
  }, [boardId]);
  
  console.log(ideas);
  
  const deleteIdea = (ideaId) => {
    axios.delete(API_URL + `boards/${boardId}/ideas/${ideaId}/`)
      .then(response => {
        setIdeas(ideas.filter(idea => idea.id !== ideaId));
      })
      .catch(error => {
        setError('Error deleting idea');
      });
  };
  
	const voteOnIdea = (ideaId, value) => {
		axios.post(API_URL + `boards/${boardId}/ideas/${ideaId}/votes/`, {
			value: value,
		})
		.then(response => {
			// Refresh the list of ideas to reflect the new vote
			axios.get(API_URL + `boards/${boardId}/ideas/`)
			  .then(response => {
				const ideasWithOwnership = response.data.map(idea => ({
				  ...idea, 
				  isOwner: parseInt(idea.user) === parseInt(JSON.parse(localStorage.getItem('user')).pk),
				}));
				setIdeas(ideasWithOwnership);
			  })
			  .catch(error => {
				setError('Error fetching ideas');
			  });
		})
		.catch(error => {
			setError('Error voting on idea');
		});
	};
	
  return (
    <div>
      <h2>{board?.title}</h2>
      {error && <div>{error}</div>}
      <Link to={`/boards/${boardId}/ideas/add`}>
        <Button variant="primary" className="mb-3">Add Idea</Button>
      </Link>
      {hasOrderChanged && 
        <Button variant="success" className="mb-3" onClick={saveOrder}>Save Order</Button>
      }
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <ListGroup {...provided.droppableProps} ref={provided.innerRef}>
                {ideas.map((idea, index) => (
                    <Draggable key={idea.id} draggableId={(Math.random() + 1).toString(36).substring(7)} index={index} isDragDisabled={!idea.isOwner}>
                        {(provided) => (
                            <ListGroup.Item
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                            >
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>Idea Title</th>
                                            <th>Author</th>
                                            <th>Edit/Delete</th>
                                            <th>Vote Up/Down</th>
                                            <th>Votes Positive</th>
                                            <th>Votes Negative</th>
                                            <th>Users</th>
                                            <th>Votes Majority</th>
                                            <th>Voting Start</th>
                                            <th>Voting End</th>
                                            <th>Voting Result</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><Link to={`/boards/${boardId}/ideas/${idea.id}/details`}>{idea.title}</Link></td>
                                            <td><Link to={`/boards/${boardId}/ideas/${idea.id}/votes`}>{idea.user.username}</Link></td>
                                            <td>
                                                <Link to={`/boards/${boardId}/ideas/${idea.id}/edit`}>
                                                    <Button variant="secondary" className="mr-2">Edit</Button>
                                                </Link>
                                                <Button variant="danger" onClick={() => deleteIdea(idea.id)}>Delete</Button>
                                            </td>
                                            <td>
                                                <Button variant="success" onClick={() => voteOnIdea(idea.id, 1)}>Vote Up</Button>
                                                <Button variant="danger" onClick={() => voteOnIdea(idea.id, 0)}>Vote Down</Button>
                                            </td>
                                            <td>{idea.votes.positive}</td>
                                            <td>{idea.votes.negative}</td>
                                            <td>{idea.votes.users}</td>
                                            <td>{idea.votes.has_majority > 0 ? 'Yes' : 'No'}</td>
                                            <td>{idea.voting_start}</td>
                                            <td>{idea.voting_end}</td>
                                            <td>{idea.voting_result ? "Yes" : "No"}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </ListGroup.Item>

                        )}
                    </Draggable>
                ))}
                {provided.placeholder}
            </ListGroup>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default BoardDetails;
