import { Link } from "react-router-dom"

function Login() {
  return (
    <div>
        <div style={{display:"flex", flexDirection:"column", alignContent:"center"}}>
        <h2>Bem-vindo a calculamento de dre</h2>
        <input placeholder="Usuario"></input>
        <input placeholder="Senha"></input>
        <Link to={'/home'}>
         <button>Login</button>
         </Link>
     </div>
    </div>
  )
}

export default Login
