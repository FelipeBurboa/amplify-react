import { useEffect, useState } from 'react'
//import './App.css'
import { Amplify, API, graphqlOperation } from 'aws-amplify';
import { createTodo } from './graphql/mutations';
import { listTodos } from './graphql/queries';
import { withAuthenticator, Button, Heading, Text, TextField, View } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import awsExports from './aws-exports';
Amplify.configure(awsExports);

const initialState = {
  name: '',
  description: '',
};

const App = ({signOut, user}) => {
  const [formState, setFormState] = useState(initialState);
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    console.log('debug: ', 'Initial State');
    fetchTodos()
  }, [])
  
  function setInput(key, value) {
    setFormState({...formState,[key]:value})
    console.log('debug2: ', formState)
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos));
      const todos = todoData.data.listTodos.items;
      setTodos(todos);
      console.log('debug3: ', todos);
    }catch (err) {
      console.log('error fetching todos');
    }
  }

async function addTodo(){
  try {
    if (!formState.name || !formState.description) return;
    const todo = { ...formState };
    setTodos([...todos, todo]);
    setFormState(initialState);
    await API.graphql(graphqlOperation(createTodo, {input: todo}));
  } catch (err) {
    console.log('error creating todo: ', err);
  }
}

return (
<>
<View style={styles.container}>
  <Heading level={1}>Hello {user.username}</Heading>
  <Button style={styles.button} onClick={signOut}>Sign Out</Button>
  <Heading level={2}>Amplify Todo List</Heading>
  <TextField
    placeholder='Name'
    onChange={e => setInput('name', e.target.value)}
    style={styles.input}
    value={formState.name}
  />
  <TextField
    placeholder='Description'
    onChange={e => setInput('description', e.target.value)}
    style={styles.input}
    value={formState.description}
  />
  <Button style={styles.button} onClick={addTodo}>Create Todo</Button>
  {
    todos.map((todo, index) => (
      <div key={todo.id ? todo.id : index} style={styles.todo}>
        <p style={styles.todoName}>{todo.name}</p>
        <p style={styles.todoDescription}>{todo.description}</p>
      </div>
    ))
  }
</View>
</>
  /*
  <div style={styles.container}>
    <Heading level={1}>Hello User</Heading>
    <Button onClick={signOut}>Sign Out</Button>
    <h2>Amplify Todo List</h2>
    <input 
      onChange={e => setInput('name', e.target.value)}
      value={formState.name}
      placeholder='Name'
      style={styles.input}
    />
    <input
      onChange={e => setInput('description', e.target.value)}
      value={formState.description}
      placeholder='Description'
      style={styles.input}
    />
    <button style={styles.button} onClick={addTodo}>Create Todo</button>
    {
      todos.map((todo, index) => (
        <div key={todo.id ? todo.id : index} style={styles.todo}>
          <p style={styles.todoName}>{todo.name}</p>
          <p style={styles.todoDescription}>{todo.description}</p>
        </div>
      ))
    }
  </div>
)
*/
)
}

const styles = {
  container: { 
    width: 400,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ddd',
  },
  todo: {
    marginBottom:15
  },
  input: {
    border: 'none',
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 10,
    fontSize: 18,
  },
  todoName: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  todoDescription: {
    marginBottom: 0,
  },
  button: {
    backgroundColor: 'black',
    color: 'white',
    outline: 'none',
    fontSize: 18,
    padding: '12px 0px',
  },
}

export default withAuthenticator(App);
