'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields() 
    document.getElementById('modal').classList.remove('active')
}

const getLocalStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? [] //Vai buscar o que tem no meu local Storage caso nao tenha nada retorna um array vazio
const setLocalStorage = (dbClient) => localStorage.setItem('db_client',JSON.stringify(dbClient))


//CRUD - create read upadte dalete



//CREATE USERS

const createClient = (client) => {
    const dbClient = getLocalStorage()
    dbClient.push(client)
    console.log(dbClient);
    setLocalStorage(dbClient)
} 
//READ USERS

const readClient = () => getLocalStorage()

//UPDATE USERS

const updateClient = (index,client) => {
    const dbClient = readClient()
    dbClient[index] = client
    setLocalStorage(dbClient)
}

//DELETE  USERS

const deleteClient = index => {
    const db_client = readClient()
    db_client.splice(index,1)
    setLocalStorage(db_client)
}


//Validando se todos os campos foram preenchidos campos 
  
const isValidFields = () => document.forms['form'].reportValidity();

//Limpa tela

const clearFields = () => {
    const flieds = document.querySelectorAll('.modal-field')
    flieds.forEach(flied => flied.value = '');
}


//Interação com o Layout
const saveClient = () => {
    if(isValidFields()){
        const formDate = document.forms['form']
        const client = {
            nome : formDate.nome.value,
            email : formDate.email.value,
            cidade : formDate.cidade.value,
            celular : formDate.celular.value
        }
        const index = document.getElementById('nome').dataset.index
        if(index == 'new') {
            createClient(client);
            updateTable()
            closeModal()
        }else{
            updateClient(index,client)
            updateTable()
            closeModal()
        }
    }else{
        console.log('Cliente nao cadastrado');
    }
}

const creatRow = (client,index) => {
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="edit-${index}">Editar</button>
            <button type="button" class="button red" id="delete-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tableClient>tbody').appendChild(newRow)
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tableClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
    const dbClient = readClient()
    clearTable()
    dbClient.forEach(creatRow);
}

const fillFlieds = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) => {
    const client = readClient()[index]
    client.index = index
    fillFlieds(client)
    openModal()
}

const editDelete = (event,index) => {
    if(event.target.type == 'button'){
        const [action,index] = event.target.id.split('-')
        
        if(action == 'edit'){
            editClient(index)
        }else{
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o client ${client.nome}`)
            if(response){
                deleteClient(index)
                updateTable()
            }
        }
    }
}

updateTable()

//Eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click',saveClient)

document.querySelector('#tableClient>tbody')
    .addEventListener('click',editDelete)

document.getElementById('cancelar')
    .addEventListener('click',closeModal)