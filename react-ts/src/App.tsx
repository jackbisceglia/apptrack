import { useState, useEffect } from 'react';
import './App.css'

function App() {
  // store email
  const [email, setEmail] = useState(''); // '' is the initial state value

  // post email to the db
  const [postID, setPostID] = useState([])
  useEffect(() => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emailAddress: email,
          preferenceList: 'INTERN',
        })
    };

    fetch('https://reqres.in/api/posts', requestOptions)
      .then(response => response.json())
      .then(data => setPostID(data.id));
  }, []);
  console.log(postID)

  return (
    <div className="App flex justify-center items-center h-screen">
      <div className="App-header flex justify-center items-center max-w-screen-sm w-10/12 flex-col">
        <h1 className='flex justify-center text-center m-3 font-bold text-cyan-700 md:text-5xl sm:text-4xl text-2xl'>Sign up for the mailing list!</h1>
        <p className='flex justify-center w-full'>
          <input
            className="shadow appearance-none border rounded w-9/12 m-1 px-3 text-cyan-700 leading-tight focus:outline-none focus:shadow-outline text-lg"
            id="username"
            type="text"
            placeholder="Email"
            value={email}
            // onInput={e => setEmail(e.target.value)}
          />
          <button type="button" className='m-1 p-3 px-4 bg-cyan-700 rounded-md text-white text-bold text-lg'>
            Sign Up!
          </button>
        </p>
      </div>
    </div>
  )
}

export default App
