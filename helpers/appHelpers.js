export const showModal = (modalId) => {
  const modalContainer = document.getElementById(modalId)
  if (modalContainer) {
    modalContainer.classList.add('show')
    const modalContent = modalContainer.querySelector('#modal-content')
    modalContent.scrollTo(0, 0)
  }
}

export const closeModal = (modalId) => {
  const modalContainer = document.getElementById(modalId)
  if (modalContainer) {
    modalContainer.classList.remove('show')
  }
}

export const getsemiAnnualBaseUrl = () => '/v1/user'
