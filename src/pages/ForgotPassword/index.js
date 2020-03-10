import React, { useState } from 'react';
import { Link, withRouter } from "react-router-dom";
import api from "../../services/api";
import Load from "../../components/Load";
import "./styles.css";

function ForgotPassword({ history }) {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoad, setIsLoad] = useState(false);

    async function handleForgotPassword(event) {
        event.preventDefault();
        setIsLoad(true);
        if (!email) {
            setError("Preencha com seu e-mail para continuar!");
            setIsLoad(false);
        } else {
          try {
            const response = await api.post("/forgot_password", { email });
            console.log("handleForgotPassword | response", response.data);
            setIsLoad(false);
            if(!response.data.status === 200) {
              setError("Ocorreu um erro. ;-;");
            }
            setError(response.data.message);
          } catch (error) {
            console.log("handleForgotPassword | error", error);
            setError("Houve um problema com o esqueci minha senha, verifique seu e-mail. ;-;");
            setIsLoad(false);
          }
        }
    };

    return (
      <div className="forgot-password">
        <Load isShow={isLoad}/>
        <form onSubmit={handleForgotPassword}>
          {error && <p>{error}</p>}
          <input
            type="email"
            placeholder="Endereço de e-mail"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
          <button type="submit">Enviar</button>
          <hr />
          <Link to="/">Voltar</Link>
        </form>
      </div>
    );

}

export default withRouter(ForgotPassword);