import React, { useState } from 'react'
import LinkButton from 'components/linkButton'
import GenericModal from 'components/genericModal'
import ReviewComments from './Comments'
import { toCapitalize } from '../../../helpers/strings'
import History from './History'
import Justification from './Justification'

const PopupLink = ({ columnMetaData, dataItem, permission = true }) => {
  const [open, setOpen] = useState(false)
  const handleClick = () => {
    if (permission) {
      setOpen(true)
    }
  }
  const handleClose = () => {
    setOpen(false)
  }
  const getPopupLinkType = () => {
    switch (columnMetaData.id) {
      case 'comment':
        return (
          <ReviewComments
            comments={dataItem.comment}
            reviewId={dataItem.id}
            handleClose={handleClose}
          />
        )
      case 'history':
        return <History dataItem={dataItem} />
      case 'justification':
        return <Justification dataItem={dataItem} />
      default:
        return <p>{columnMetaData.id}</p>
    }
  }

  return (
    <>
      {open && (
        <GenericModal
          setOpen={setOpen}
          width={columnMetaData.id === 'justification' ? '502px' : '702px'}
        >
          {getPopupLinkType()}
        </GenericModal>
      )}

      <LinkButton
        disabled={!permission}
        text={
          columnMetaData.properties.textId
            ? toCapitalize(columnMetaData.properties.textId) // translate()
            : dataItem[columnMetaData.id]
        }
        onClickCallback={handleClick}
      />
    </>
  )
}

export default PopupLink
