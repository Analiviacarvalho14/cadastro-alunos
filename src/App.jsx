import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [idade, setIdade] = useState("");
  const [curso, setCurso] = useState("");
  const [nota1, setNota1] = useState("");
  const [nota2, setNota2] = useState("");

  const [idEdicao, setIdEdicao] = useState(null);
  const [busca, setBusca] = useState("");
  const [filtroCurso, setFiltroCurso] = useState("");

  const [alunos, setAlunos] = useState(() => {
    const salvos = localStorage.getItem("alunos");
    return salvos ? JSON.parse(salvos) : [];
  });

  useEffect(() => {
    localStorage.setItem("alunos", JSON.stringify(alunos));
  }, [alunos]);

  function limparForm() {
    setNome("");
    setEmail("");
    setIdade("");
    setCurso("");
    setNota1("");
    setNota2("");
    setIdEdicao(null);
  }

  function salvarAluno(e) {
    e.preventDefault();

    if (!nome || !email || !idade || !curso || nota1 === "" || nota2 === "") {
      alert("Preencha todos os campos!👀");
      return;
    }

    const n1 = Number(nota1);
    const n2 = Number(nota2);
    const media = (n1 + n2) / 2;
    const situacao = media >= 7 ? "Aprovado😍" : "Reprovado😱";

    if (idEdicao !== null) {
      setAlunos(
        alunos.map((item) =>
          item.id === idEdicao
            ? { id: idEdicao, nome, email, idade, curso, nota1: n1, nota2: n2, media, situacao }
            : item
        )
      );
    } else {
      const novoAluno = {
        id: Date.now(),
        nome,
        email,
        idade,
        curso,
        nota1: n1,
        nota2: n2,
        media,
        situacao,
      };
      setAlunos([...alunos, novoAluno]);
    }

    limparForm();
  }

  function preencherEdicao(aluno) {
    setIdEdicao(aluno.id);
    setNome(aluno.nome);
    setEmail(aluno.email);
    setIdade(aluno.idade);
    setCurso(aluno.curso);
    setNota1(aluno.nota1);
    setNota2(aluno.nota2);
  }

  function excluirAluno(id) {
    setAlunos(alunos.filter((item) => item.id !== id));
    if (idEdicao === id) limparForm();
  }

  const alunosFiltrados = alunos.filter((aluno) => {
    const bateNome = aluno.nome.toLowerCase().includes(busca.toLowerCase());
    const bateCurso = filtroCurso === "" || aluno.curso === filtroCurso;
    return bateNome && bateCurso;
  });

  return (
    <div className="container">
      <h1>Cadastro de Alunos👨‍🎓</h1>

      <form onSubmit={salvarAluno} className="form-aluno">
        <h2>{idEdicao ? "Editar Aluno" : "Cadastrar Aluno"}</h2>

        <div className="input-group">
          <label>Nome:</label>
          <input
            type="text"
            placeholder="Digite o nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>E-mail:</label>
          <input
            type="email"
            placeholder="Digite o e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Idade:</label>
          <input
            type="number"
            placeholder="Digite a idade"
            value={idade}
            onChange={(e) => setIdade(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Curso:</label>
          <select value={curso} onChange={(e) => setCurso(e.target.value)}>
            <option value="">Selecione</option>
            <option value="Desenvolvimento de Sistemas">Desenvolvimento de Sistemas</option>
            <option value="Informática">Informática</option>
            <option value="Administração">Administração</option>
          </select>
        </div>

        <div className="input-group-inline">
          <div>
            <label>Nota 1:</label>
            <input
              type="number"
              placeholder="0 a 10"
              value={nota1}
              onChange={(e) => setNota1(e.target.value)}
            />
          </div>
          <div>
            <label>Nota 2:</label>
            <input
              type="number"
              placeholder="0 a 10"
              value={nota2}
              onChange={(e) => setNota2(e.target.value)}
            />
          </div>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-salvar">
            {idEdicao ? "Atualizar Aluno" : "Cadastrar Aluno"}
          </button>
          {idEdicao && (
            <button type="button" className="btn-cancelar" onClick={limparForm}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      <div className="painel-busca">
        <div className="busca-item">
          <input
            type="text"
            placeholder="🔍 Pesquisar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>

        <div className="busca-item">
          <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)}>
            <option value="">Todos os cursos</option>
            <option value="Desenvolvimento de Sistemas">Desenvolvimento de Sistemas</option>
            <option value="Informática">Informática</option>
            <option value="Administração">Administração</option>
          </select>
        </div>
      </div>

      <div className="contador">
        Total de alunos: <strong>{alunosFiltrados.length}</strong>
      </div>

      <div className="tabela-container">
        {alunosFiltrados.length === 0 ? (
          <p className="mensagem-vazia">Nenhum aluno encontrado.</p>
        ) : (
          <table className="tabela-alunos">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Idade</th>
                <th>Curso</th>
                <th>Nota 1</th>
                <th>Nota 2</th>
                <th>Média</th>
                <th>Situação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunosFiltrados.map((aluno) => (
                <tr key={aluno.id}>
                  <td>{aluno.nome}</td>
                  <td>{aluno.email}</td>
                  <td>{aluno.idade}</td>
                  <td>{aluno.curso}</td>
                  <td>{aluno.nota1}</td>
                  <td>{aluno.nota2}</td>
                  <td><strong>{aluno.media.toFixed(1)}</strong></td>
                  <td>
                    <span className={`status ${aluno.situacao.toLowerCase()}`}>
                      {aluno.situacao}
                    </span>
                  </td>
                  <td className="acoes">
                    <button className="btn-editar" onClick={() => preencherEdicao(aluno)}>
                      Editar
                    </button>
                    <button className="btn-excluir" onClick={() => excluirAluno(aluno.id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;