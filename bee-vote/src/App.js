import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Navbar, Nav } from 'react-bootstrap';
import LoginPage from './LoginPage';
import GroupManagement from './GroupManagement';
import BoardList from './BoardList';
import AddBoard from './AddBoard';
import EditBoard from './EditBoard';
import BoardDetails from './BoardDetails';
import AddIdea from './AddIdea';
import EditIdea from './EditIdea';
import VotesList from "./VotesList";
import IdeaDetails from "./IdeaDetails";

const App = () => {
  return (
    <Router>
      <Navbar bg="dark" variant="dark">
        <Navbar.Brand href="/">BeeVote</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/groups">Groups</Nav.Link>
          <Nav.Link as={Link} to="/boards">Boards</Nav.Link>
        </Nav>
      </Navbar>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/groups" element={<GroupManagement />} />
        <Route path="/boards" element={<BoardList />} />
        <Route path="/board/add" element={<AddBoard />} />
        <Route path="/board/edit/:id" element={<EditBoard />} />
		    <Route path="/boards/:boardId" element={<BoardDetails />} />
		    <Route path="/boards/:boardId/ideas/add" element={<AddIdea />} />
            <Route path="/boards/:boardId/ideas/:id/details" element={<IdeaDetails />} />
		    <Route path="/boards/:boardId/ideas/:id/edit" element={<EditIdea />} />
            <Route path="/boards/:boardId/ideas/:id/votes" element={<VotesList />} />
      </Routes>
    </Router>
  );
};

export default App;
