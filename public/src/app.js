document.addEventListener('DOMContentLoaded', () => {
    const toggleRegisterButton = document.getElementById('toggle-register');
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');

    if (toggleRegisterButton && registerForm && loginForm) {
        toggleRegisterButton.addEventListener('click', function() {
            registerForm.style.display = 'block';
            loginForm.style.display = 'none';
            toggleRegisterButton.style.display = 'none';
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                alert('Login realizado com sucesso');
                onLoginSuccess();
            } else {
                alert('Erro! Dados incorretos');
            }
        });
    }

    const registerFormElement = document.getElementById('register-form');
    if (registerFormElement) {
        registerFormElement.addEventListener('submit', async function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email-reg').value;
            const password = document.getElementById('password-reg').value;

            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ nome: name, email, password })
            });

            if (response.ok) {
                alert('Cadastro realizado com sucesso');

                document.getElementById('register-form').style.display = 'none';
                document.getElementById('login-form').style.display = 'flex';
                document.getElementById('toggle-register').style.display = 'block';
            } else {
                alert('Erro! Não foi possível realizar o seu cadastro');
            }
        });
    }

    async function loadTasks() {
        const response = await fetch('/tasks');
        const { tasks } = await response.json();
    
        const taskListElement = document.getElementById('tasks-list');
        taskListElement.innerHTML = '';
    
        tasks.forEach(task => {
            const taskItem = document.createElement('li');
            taskItem.classList.add('task-item');
            if (task.status === 'completed') taskItem.classList.add('completed');
    
            // Criar div para checkbox e descrição
            const taskContentDiv = document.createElement('div');
            taskContentDiv.classList.add('task-content');
    
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.status === 'completed';
            checkbox.classList.add('task-checkbox');
            checkbox.addEventListener('change', async () => {
                await fetch(`/tasks/${task.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: checkbox.checked ? 'completed' : 'pending' })
                });
                taskItem.classList.toggle('completed');
            });
    
            const taskText = document.createElement('span');
            taskText.classList.add('task-text');
            taskText.textContent = task.descricao;
    
            taskContentDiv.appendChild(checkbox);
            taskContentDiv.appendChild(taskText);
    
            // Criar div para ícones de editar e excluir
            const iconDiv = document.createElement('div');
            iconDiv.classList.add('icon-container');
    
            // Botão de editar
            const editButton = document.createElement('button');
            editButton.innerHTML = '✏️'; // Ícone de lápis
            editButton.classList.add('edit-button');
            editButton.addEventListener('click', async () => {
                const newDescription = prompt('Digite a nova descrição da tarefa:', task.descricao);
                if (newDescription) {
                    await fetch(`/tasks/${task.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ descricao: newDescription })
                    });
                    loadTasks(); // Recarregar as tarefas após a edição
                }
            });
    
            // Botão de excluir
            const deleteButton = document.createElement('button');
            deleteButton.innerHTML = '🗑️'; // Ícone de lixeira
            deleteButton.classList.add('delete-button');
            deleteButton.addEventListener('click', async () => {
                if (confirm('Tem certeza que deseja excluir esta tarefa?')) {
                    await fetch(`/tasks/${task.id}`, {
                        method: 'DELETE'
                    });
                    loadTasks(); // Recarregar as tarefas após a exclusão
                }
            });
    
            iconDiv.appendChild(editButton);
            iconDiv.appendChild(deleteButton);
    
            taskItem.appendChild(taskContentDiv); // Adiciona a div de conteúdo à tarefa
            taskItem.appendChild(iconDiv); // Adiciona a div de ícones à tarefa
            taskListElement.appendChild(taskItem);
        });
    }

    document.getElementById('add-task-btn').addEventListener('click', async () => {
        const descricao = prompt('Digite a descrição da nova tarefa:');
        if (descricao) {
            await fetch('/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ descricao, status: 'pending' })
            });
            loadTasks();
        }
    });

    function onLoginSuccess() {
        const addTaskButton = document.getElementById('add-task-btn');
        const logoutButton = document.getElementById('logout-btn');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const toggleRegisterButton = document.getElementById('toggle-register');

        if (addTaskButton) addTaskButton.style.display = 'block';
        if (logoutButton) logoutButton.style.display = 'block';

        if (loginForm) loginForm.style.display = 'none';
        if (registerForm) registerForm.style.display = 'none';
        if (toggleRegisterButton) toggleRegisterButton.style.display = 'none';

        loadTasks();
    }

    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', async () => {
            await fetch('/logout', { method: 'POST' });
            location.reload();
        });
    }
});