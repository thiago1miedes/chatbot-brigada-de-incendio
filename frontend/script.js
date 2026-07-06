const API_URL = "http://127.0.0.1:5000/chat";

const chat = document.getElementById("chat");
const mensagemInput = document.getElementById("mensagem");
const btnEnviar = document.getElementById("btn-enviar");
const btnLimpar = document.getElementById("btn-limpar");

const MENSAGEM_BOAS_VINDAS =
  "Olá! Sou o assistente virtual da Brigada de Incêndio. Posso ajudar você com:\n\n" +
  "• Prevenção de incêndios\n" +
  "• Procedimentos de evacuação de emergência\n" +
  "• Uso e classes de extintores\n" +
  "• Classes de incêndio\n" +
  "• Procedimentos de emergência e primeiros socorros\n\n" +
  "Como posso ajudar você hoje?";

function adicionarMensagem(texto, autor) {
  const div = document.createElement("div");
  div.classList.add("message", autor);
  div.textContent = texto;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
  return div;
}

function exibirMensagemInicial() {
  chat.innerHTML = "";
  adicionarMensagem(MENSAGEM_BOAS_VINDAS, "bot");
}

async function enviarMensagem() {
  const texto = mensagemInput.value.trim();
  if (!texto) {
    return;
  }

  adicionarMensagem(texto, "user");
  mensagemInput.value = "";
  mensagemInput.disabled = true;
  btnEnviar.disabled = true;

  const placeholder = adicionarMensagem("Analisando sua pergunta...", "bot");

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mensagem: texto }),
    });

    const dados = await resposta.json();

    if (!resposta.ok) {
      placeholder.textContent =
        dados.erro || "Ocorreu um erro ao processar sua pergunta. Tente novamente.";
    } else {
      placeholder.textContent = dados.resposta;
    }
  } catch (erro) {
    placeholder.textContent =
      "Não foi possível conectar ao servidor. Verifique se o backend está em execução.";
  } finally {
    mensagemInput.disabled = false;
    btnEnviar.disabled = false;
    mensagemInput.focus();
  }
}

btnEnviar.addEventListener("click", enviarMensagem);

btnLimpar.addEventListener("click", exibirMensagemInicial);

mensagemInput.addEventListener("keydown", (evento) => {
  if (evento.key === "Enter" && !evento.shiftKey) {
    evento.preventDefault();
    enviarMensagem();
  }
});

exibirMensagemInicial();
