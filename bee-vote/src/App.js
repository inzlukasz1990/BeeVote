import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import GroupManagement from './GroupManagement';
import BoardList from './BoardList';
import AddBoard from './AddBoard';
import EditBoard from './EditBoard';
import BoardDetails from './BoardDetails';
import AddIdea from './AddIdea';
import EditIdea from './EditIdea';

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<LoginPage />} />
        <Route path="/groups" element={<GroupManagement />} />
        <Route path="/boards" element={<BoardList />} />
        <Route path="/board/add" element={<AddBoard />} />
        <Route path="/board/edit/:id" element={<EditBoard />} />
		<Route path="/boards/:boardId" element={<BoardDetails />} />
		<Route path="/boards/:boardId/ideas/add" element={<AddIdea />} />
		<Route path="/boards/:boardId/ideas/:id/edit" element={<EditIdea />} />
      </Routes>
    </Router>
  );
};

export default App;
