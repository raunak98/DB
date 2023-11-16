import React from 'react'
import ReactDOM from 'react-dom'
import CloseIcon from '@mui/icons-material/Close'
import * as Styled from './style'

const ModalContainer = ({ setOpen, children, width, height }) => {
  const close = () => {
    setOpen(false)
  }

  return ReactDOM.createPortal(
    <>
      <Styled.ModalShadow onClick={close} />
      <Styled.Modal width={width} height={height}>
        <Styled.CloseButton onClick={close}>
          <CloseIcon />
        </Styled.CloseButton>
        <Styled.ModalContent>{children}</Styled.ModalContent>
      </Styled.Modal>
    </>,
    document.getElementById('global-modal')
  )
}

export default React.memo(ModalContainer)
