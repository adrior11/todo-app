document.getElementById('addTodoButton').addEventListener('click', async () => {
    const description = document.getElementById('newTodoDescription').value;

    if (!description) {
        alert('Please enter a todo description');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/todo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description }),
        });

        if (response.ok) {
            // TODO: refetch
            window.location.reload();
        } else {
            alert('Error adding todo');
        }
    } catch (err) {
        alert('Failed to send request. Please try again.');
    }
});

document.querySelectorAll('.todo-checkbox').forEach(checkbox => {
    checkbox.addEventListener('change', async (event) => {
        const todoId = event.target.getAttribute('data-id');
        const isCompleted = event.target.checked;

        try {
            const response = await fetch(`http://localhost:3000/todo/${todoId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: isCompleted }),
            });

            if (!response.ok) {
                alert('Error updating todo');
            }
        } catch (err) {
            alert('Failed to send request. Please try again.');
        }
    });
});

document.getElementById('clearTodosButton').addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all todos?')) {
        try {
            const response = await fetch('http://localhost:3000/todo', {
                method: 'DELETE',
            });

            if (response.ok) {
                window.location.reload();
            } else {
                alert('Error clearing todos');
            }
        } catch (err) {
            alert('Failed to send request. Please try again.');
        }
    }
});
