import './App.css';
import { Link } from 'react-router';

function App() {
  return (
    <div>
      <Link to="/document-visibility-hook">
        <h1>Document Visibility Hook</h1>
      </Link>
      <Link to="/media-query-hook">
        <h1>Media Query Hook</h1>
      </Link>
      <Link to="/media-query-component">
        <h1>Media Query Component</h1>
      </Link>
    </div>
  );
}

export default App;
