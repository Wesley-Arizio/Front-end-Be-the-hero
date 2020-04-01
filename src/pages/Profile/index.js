import React, { useEffect, useState } from 'react';
import  { Link, useHistory } from 'react-router-dom';

import api from '../../services/api';

import './style.css';
import logoImg from '../../assets/logo.svg';
import { FiPower, FiTrash2 } from 'react-icons/fi';

export default function Profile(){

    const history = useHistory();

    const [incidents, setIncidents] = useState( [] );

    const ongName = localStorage.getItem('ongName');
    const ongId = localStorage.getItem('ongId');

    async function handleDelete(id){
        try{
            await api.delete(`incidents/${id}`, {
                headers:{
                    Authorization: ongId,
                }
            });
            setIncidents(incidents.filter(incident => incident.id !== id));
        }catch(err){
            alert("Erro ao deletar o incidente");
        }
    }
    function handleLogOut(){
        localStorage.clear();
        history.push('/')
    }

    useEffect( () => {
        api.get('profile', {
            headers:{
                Authorization: ongId,
            }
        }).then( response => {
            setIncidents(response.data);
        });
    }, [ ongId ]);
    return(
        <div className="profile-container">
            <header>
                <img src={logoImg} alt="Be The Hero" />
                <span>Bem vinda, {ongName} </span>

                <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
                <button  onClick={handleLogOut} type="button">
                    <FiPower size={ 18 } color="#e02041"/>
                </button>
            </header>

            <h1>Casos Cadastrados</h1>

            <ul>
                {incidents.map(incident => (
                    <li key={incident.id}>
                        <strong>Caso: </strong>
                        <p> {incident.title} </p>

                        <strong>Descrição: </strong>
                        <p> {incident.description} </p>

                        <strong>Valor: </strong>
                        <p> {Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(incident.value)} </p>

                        <button onClick={() => handleDelete(incident.id)} type="button">
                        <FiTrash2 size={ 20 } color="#a8a8b3"/>
                        </button>
                    </li>

                ))}
            </ul>
        </div>
    );
}