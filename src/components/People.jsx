import PropTypes from "prop-types";
import { Person } from "./Person";
import { useState } from "react";

export const People = ( { people, setPeople } ) => {

    // Estado para gfestionar el Id de la persona
  const [ editingId, setEditingId] =useState(null);

  // Estado para establecer si se está editando a una persona
  const [ isEditing, setIsEditing] = useState(false);

  // Estado para almacenar temporalmente los datos de la persona que se está editando
  const [editedPerson, setEditedPerson] = useState(
    {
      name: '',
      role: '',
      img: '',
    }
  );
  
  // Estado para eliminar
  const[ personToDelete, setPersonToDelete] = useState(null);

  // Método para gestionar los campos del formulario 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPerson(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // Método para crear una nueva persona en el Team
  const handleCreate = (e) => {
    e.preventDefault();

    // Agregar persona al array
    setPeople([... people, { id: people.length + 1, ...editedPerson}]);

    // Reiniciar estado del formulario
    setEditedPerson(
      {
        name: '',
        role: '',
        img: ''
      }
    )
  };

  //  Método para editar a una persona
  const handleEdit = (id) => {
    setEditingId(id);
    setIsEditing(true);

  // Crear un array nuevo
  const personToEdit = people.find(person => person.id === id);

    setEditedPerson({ ...personToEdit})
  }

  // Método para guardar los cambios después de editar una persona
  const handleSave = (e) => {

    // Prevenir recarga automática del navegador
    e.preventDefault();

    // Crear array nuevo reemplazando los datos de la persona editada
    const updatePeople = people.map(person => person.id === editingId ? editedPerson : person);

    //  Actualiczar el estado de personas con el array actualizado
    setPeople(updatePeople);
    setIsEditing(false);
    setEditingId(null);
    setEditedPerson({
      name:'',
      role: '',
      img:''
    });
  }

  // Metodos para eliminar una persona del array
  
  // 1, guardar el id de la persona
  const handleDelete = (id) => {
    setPersonToDelete(id)
  }

  // 2. Confirmar la eliminación
  const confirmDelete = () => {

  // Filtro en el array para elimianr la persona que coincide con el id
    setPeople(people.filter(person => person.id != personToDelete));
    
    setPersonToDelete(null);
  };

  // Confirmación o cancelar eliminación
  const cancelDelete = () => {
    setPersonToDelete(null);
  };

  return (
    <div>
      <h2 className='text-center my-4'>IT Team</h2>
      <div className='container'>
        <div className='row d-flex flex-wrap row-cols-1 row-cols-md-2 row-cols-lg-3'>
          {
            people.map((people) => {
              return (
                <div key={people.id}>
                  <Person
                    id={people.id}
                    name={people.name}
                    img={people.img}
                    role={people.role}
                    handleEdit={() => handleEdit(people.id)}
                    handleDelete={ () => handleDelete(people.id)}
                  />
                </div>
              );
            })
          }
        </div>
      </div>
      {/* Formulario */}
      <div className="container">
          <h2 className="text-center mt-4"> {isEditing ? 'Actualizar empleado': 'Crear nuevo empleado'} </h2>
          <form>
            <div>
              <label htmlFor="name">Nombres</label>
              <input type="text" name="name" value={editedPerson.name} required onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="role">Rol</label>
              <input type="text" name="role" value={editedPerson.role} required onChange={handleChange}/>
            </div>
            <div>
              <label htmlFor="img">Avatar</label>
              <input type="text" name="img" value={editedPerson.img} required onChange={handleChange}/>
            </div>

            <div className="mt-2 text-center">
              <button type="submit" className="btn btn-secondary" onClick={isEditing ? handleSave : handleCreate}> {isEditing ? 'Editar Usuario' : 'Crear Usuario'} </button>
            </div>
          </form>
      </div>
      {/* Modal de confirmación para elminar */}
      <div id="deleteModal" className="modal fade" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                  <h4 className="modal-title">Confirmar eliminación</h4>
              <button type="button" className="btn-close" data-bs-dismiss="modal" onClick={cancelDelete}></button>
              </div>
              <div className="modal-body">
                <p>¿Está seguro de eliminar al empleado {people.find(person => person.id === personToDelete)?.name}?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={cancelDelete}>Cancelar</button>
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={confirmDelete}>Eliminar</button>
              </div>
            </div>
          </div>
      </div>
    </div>
  )
};

People.propTypes = {
  people: PropTypes.array,
  setPeople: PropTypes.func
}