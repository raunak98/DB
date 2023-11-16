import styled, { css } from 'styled-components'

export const Modal = styled.div`
  width: ${(props) => (props.width ? props.width : '')};
  height: ${(props) => (props.height ? props.height : '')};
  min-width: ${(props) => (props.width ? '' : '50vw')};
  max-height: ${(props) => (props.height ? '' : '70%')};
  background-color: #ffffff;
  position: fixed;
  top: 20%;
  left: 23%;
  right: 23%;
  z-index: 11;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  &::-webkit-scrollbar {
    width: 20px;
  }
  ::-webkit-scrollbar-track {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb {
    background-color: #d6dee1;
    border-radius: 20px;
    border: 6px solid transparent;
    background-clip: content-box;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #a8bbbf;
  }
  @media (max-width: 500px) {
    left: 0;
    transform: translate(0, 0);
    margin: 0 10px;
    width: 100%;
    height: 100%;
    max-height: 100%;
    top: 0;
  }
`
export const ModalContent = styled.div`
  ${({ theme }) => css`
    overflow-y: auto;
    padding: 25px;
    background-color: ${theme.colors.modalBackground};
  `}
`
export const ModalFooter = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
`
export const ConfirmButton = styled.div`
  ${({ theme }) => css`
    margin: 10px;
    color: ${theme.colors.textPrimary};
    height: 40px;
    border-radius: 5px;
    padding: 5px;
    text-align: center;
    width: 200px;
    cursor: pointer;
    background-color: #808080;
  `}
`
export const ModalShadow = styled.div`
  position: fixed;
  height: 100%;
  width: 100%;
  top: 0px;
  background-color: #333333;
  opacity: 0.7;
  z-index: 10;
`
export const ModalBanner = styled.div`
  margin-bottom: 20px;
  background-color: #808080;
  color: #ffffff;
  padding: 10px;
`

export const CloseButton = styled.button`
  ${({ theme }) => css`
    width: 22px;
    height: 22px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    background-color: transparent;
    cursor: pointer;
    border: 0px solid ${theme.colors.textPrimary};
    color: ${theme.colors.textPrimary};
    position: absolute;
    top: 13px;
    right: 30px;
  `}
`
