# ⚓ Batalha Naval (Battleship)

Bem-vindo ao projeto **Batalha Naval**. Esta é uma implementação moderna e *full-stack* do clássico jogo de estratégia naval. O projeto foi desenvolvido como **Trabalho de Conclusão de Curso (TCC)**, focando em uma arquitetura robusta, conteinerizada e responsiva para partidas entre jogadores (PvP).

O sistema utiliza um backend em Django para gerenciar a lógica de jogo e validações, um frontend em React para uma experiência interativa e Docker para orquestração de todo o ambiente.

**Autor:** Matheus da Silva Cirqueira (Clancy)

## ✨ Funcionalidades

O foco deste projeto é oferecer a experiência tradicional de Batalha Naval com qualidade técnica de engenharia de software:

* **Modos Multiplayer (PvP)**:
    * **Multiplayer Online**: Crie um *lobby* e compartilhe um código único para jogar contra um amigo em outra máquina.
    * **PvP Local**: Jogue contra um amigo no mesmo computador, com uma tela de troca de turno para manter a privacidade do posicionamento dos navios.
* **Jogabilidade Responsiva & Dinâmica**:
    * **Tabuleiro Adaptável**: O jogo ajusta automaticamente o layout. Em dispositivos móveis, utiliza o clássico tabuleiro **10x10**. Em desktops (widescreen), o jogo expande para uma visualização épica de **32x8**.
    * **Compromisso de Partida**: Para garantir o *fair play* em partidas online, o sistema previne saídas acidentais. O botão de voltar é desativado e fechar a aba conta como rendição automática.
* **Interface Moderna**:
    * **Leaderboard**: Um Hall da Fama que rastreia e exibe os comandantes com maior número de vitórias.
    * **Design Clean**: Interface de usuário limpa, com modais personalizados, ícones intuitivos e tema consistente.
    * **Ajuda Integrada**: Um modal de ajuda explica as regras para novos jogadores.
* **Ambiente Conteinerizado**: Configuração simples e rápida em qualquer máquina utilizando Docker.

-----

## 🛠️ Tech Stack

Este projeto foi construído utilizando um conjunto de tecnologias modernas e amplamente utilizadas no mercado:

* **Backend**: Python, Django, Django REST Framework
* **Frontend**: JavaScript, React, Vite, Tailwind CSS
* **Banco de Dados**: MySQL
* **Infraestrutura**: Docker, Docker Compose
* **Reverse Proxy**: Caddy

-----

## 🚀 Como Executar o Projeto

Siga as instruções abaixo para rodar o projeto na sua máquina local.

### Pré-requisitos

Certifique-se de ter o **Docker** e o **Docker Compose** instalados no seu sistema.

### Executando com um Comando (Script Automatizado)

O projeto inclui um script que gerencia todo o processo de configuração, desde a construção dos containers até as migrações do banco de dados.

1.  **Clone o Repositório**

    ```bash
    git clone <url-do-seu-repositorio>
    cd BattleShipGame
    ```

2.  **Execute o Script de Inicialização**
    Abra seu terminal na raiz do projeto e execute:

    ```bash
    ./start.sh
    ```

    Este script irá:
    * Parar containers antigos em execução.
    * Construir as novas imagens Docker.
    * Iniciar todos os serviços (Django, MySQL, Frontend).
    * Aplicar as migrações necessárias no banco de dados.
    * Iniciar o servidor de desenvolvimento.

### 3. Pronto para Jogar

Com o script rodando, abra seu navegador e acesse a URL fornecida no terminal (geralmente `http://localhost:5173`). Divirta-se!

-----

### Comandos Manuais do Docker (Opcional)

Se preferir gerenciar os serviços manualmente sem o script:

* **Para parar todos os serviços**:

    ```bash
    docker-compose down
    ```

* **Para ver os logs do backend**:

    ```bash
    docker-compose logs -f web
    ```
