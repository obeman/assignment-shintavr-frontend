import logo from './logo.svg';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/auth';
import { GoogleAuthProvider } from "firebase/auth";
import { getAuth , signInWithPopup} from "firebase/auth";
import { useState, useEffect } from "react";
import ListPost   from './components/post';

const auth = getAuth();
auth.languageCode = 'it';
// To apply the default browser preference instead of explicitly setting it.
// auth.useDeviceLanguage();

const provider = new GoogleAuthProvider();

function App() {

  const [authGoogle, setAuthGoogle] = useState(
    false || window.localStorage.getItem('auth') === 'true'
    );
  const [token, setToken] = useState("");
  const [username, setUsername] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if(user){
        setAuthGoogle(true);
        window.localStorage.setItem('auth', 'true');
        user.getIdToken().then((token) => {
          setToken(token);
        });  
        setUsername(user.displayName);
        setUser(user);
      
      }
    })
  },[]);

  async function doLogin(){
    signInWithPopup(auth, provider)
      .then((result) => {
        if(result){
          setAuthGoogle(true);
          window.localStorage.setItem('auth', 'true');
        }
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
    }).catch((error) => {   
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = GoogleAuthProvider.credentialFromError(error);
      console.log(errorMessage);
    });
  }

  async function doLogout(){
    auth.signOut().then(() => {
          setAuthGoogle(false);
          window.localStorage.removeItem('auth');
          alert("You're logged out");
        }).catch((error) => {
          console.log(error.message);
        });
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {authGoogle ? (
          <ListPost token={token} doLogout={doLogout} user={user}/>
        ) : (
        <button onClick={doLogin}>Login with Google</button>
        )}
      </header>
    </div>
  );
}

export default App;
