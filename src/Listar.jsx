import { useState, useEffect } from "react"
import { dados } from "./filmes";
import Swal from 'sweetalert2'

function Listar() {

    const [filmes, setFilmes] = useState ([]);

    const [adicionados, setAdicionados] = useState ([]);

    const [total, setTotal] = useState (0);
    const [hora, setHora] = useState(0);
    const [minutos, setMinutos] = useState (0);

    useEffect(()=> {
        setFilmes(dados)

        const totalDuracao = localStorage.getItem('totalDuracao');
        if (totalDuracao) {
            setTotal(parseInt(totalDuracao));
        }

        const filmesAdicionados = JSON.parse(localStorage.getItem('filmesAdicionados'));
        if (filmesAdicionados) {
            setAdicionados(filmesAdicionados);
        }
    },[])

    const lista = filmes.map(film => (
        <div className="card mb-5" key={film.id} style={{width:350}}>
            <img className="card-img-top h-75" src={film.foto} alt="Card image" / >
            <div  className="card-body">
                <h3 className="card-title">{film.titulo}</h3>
                <h5>Genero: {film.genero}</h5>
                <p>Duração: {film.duracao} min</p>
                <button onClick={() => adicionar(film)} className="btn btn-success mb-auto">Adicionar</button>
                <button onClick={()=> verSinopse(film)} className="btn btn-primary mb-auto float-end">Sinopse</button>
            </div>
        </div>
    ))

    function adicionar(film) {
        const filmeExistente = adicionados.find((f) => f.id === film.id);
        if (filmeExistente) {
          Swal.fire('Filme já foi adicionado', '', 'warning');
          return;
        }

        Swal.fire({
        title: 'Adicionar à lista?',
        icon: 'question',
        showDenyButton: true,
        confirmButtonText: 'Adicionar',
        denyButtonText: 'Não Adicionar',
        }).then((result) => {
        if (result.isConfirmed) {
            Swal.fire('Filme adicionado!', '', 'success');
            setAdicionados([...adicionados, film]);
            setTotal(total + film.duracao)
            localStorage.setItem('filmesAdicionados', JSON.stringify([...adicionados, film]));

            const novoTotal = total + film.duracao;
            localStorage.setItem('totalDuracao', novoTotal.toString());
        } else if (result.isDenied) {
            Swal.fire('Filme não foi adicionado', '', 'error');
        }
        });
    }

    const tabela = adicionados.map(tab => (
        <tr>
            <td>{tab.titulo}</td>
            <td>{tab.duracao} min</td>
            <td><button onClick={() => retirar(tab)} type="button" className="btn btn-danger">X</button></td>
        </tr>
    ))

    function retirar(tab) {
        Swal.fire({
            title: 'Retirar filme da lista lista?',
            icon: 'question',
            showDenyButton: true,
            confirmButtonText: 'Retirar',
            denyButtonText: 'Não Retirar',
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire('Filme removido da lista!', '', 'success');
                const novaLista = adicionados.filter(fl => fl.id !== tab.id);
                setTotal(total - tab.duracao)
                setAdicionados(novaLista);
                localStorage.setItem('filmesAdicionados', JSON.stringify(novaLista));

                let novoTotal = 0;
                novaLista.forEach((filme) => {
                novoTotal += filme.duracao;
                });
                localStorage.setItem('totalDuracao', novoTotal.toString());
            } else if (result.isDenied) {
                Swal.fire('Filme não removido da lista', '', 'error');
            }
        });
        
    }

    function retirarTudo() {
        if(adicionados.length > 0) {
            Swal.fire({
                title: 'Retirar todos os filmes da lista lista?',
                icon: 'question',
                showDenyButton: true,
                confirmButtonText: 'Retirar',
                denyButtonText: 'Não Retirar',
            }).then((result) => {
                if (result.isConfirmed) {
                    setAdicionados([])
                    setTotal(0)
                    localStorage.removeItem('filmesAdicionados');
                    localStorage.removeItem('totalDuracao');
                } else if (result.isDenied) {
                    Swal.fire('Filmes não removidos da lista', '', 'error');
                }
            });
        }
    }

    function verSinopse(film){
        Swal.fire(
            `${film.titulo}`,
            `${film.sinopse}`
          )
    }

    return (
        <div className="container">
            <div className="d-flex flex-wrap justify-content-between mt-4">
                {lista}
            </div>
            <table className="table table-dark table-hover">
                <thead>
                <tr>
                    <th>Titulo</th>
                    <th>Duração</th>
                    <td></td>
                </tr>
                </thead>
                <tbody>
                    {tabela}
                    <tr>
                        <td>Duração Total</td>
                        <td>{(total - (total % 60)) / 60} h e {total % 60} min</td>
                        <td><button onClick={() => retirarTudo()} type="button" className="btn btn-danger">X</button></td>
                    </tr>
                    
                </tbody>
            </table>
        </div>
        
    )
}

export default Listar