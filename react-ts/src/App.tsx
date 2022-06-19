import './App.css'

function App() {
  return (
    <div className="App flex justify-center items-center h-screen">
      <div className="App-header flex justify-center items-center max-w-screen-md w-9/12 flex-col">
        <h1 className='flex justify-center text-center m-3 font-bold text-5xl text-cyan-700'>Sign up for the mailing list!</h1>
        <p className='flex justify-center max-w-screen-sm w-full'>
          <input className="shadow appearance-none border rounded w-9/12 m-1 px-3 text-cyan-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Email"/>
          <button type="button" className='m-1 p-3 px-4 bg-cyan-700 rounded-md text-white text-bold text-lg'>
            Sign Up!
          </button>
        </p>
      </div>
    </div>
  )
}

export default App
