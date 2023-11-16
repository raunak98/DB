import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Button } from '@mui/material'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import translate from 'translations/translate'
import Icon from 'components/icon'
import useTheme from '../../../hooks/useTheme'
import * as Styled from './style'
import { selectReviewMetadata } from '../../../redux/review/review.selector'
import { fetchReviewMetadataStart } from '../../../redux/review/review.action'
import { fetchReviewsMetadataStart } from '../../../redux/reviews/reviews.action'

const ManageItemsModal = ({
  title,
  description,
  columns,
  handleClose,
  onSubmitCallback,
  localStoragedata,
  from,
  reviewId,
  certification
}) => {
  let items = []
  const reviewMetadata = useSelector(selectReviewMetadata)
  const dispatch = useDispatch()
  if (from === 'reviews table') {
    items = columns
  } else {
    items = localStoragedata || reviewMetadata?.columns
  }

  const [updatedItems, setUpdatedItems] = useState({
    shown: items.filter((item) =>
      item.display !== undefined
        ? item.display && item.id !== 'sticky'
        : item.initialDisplay && item.id !== 'sticky'
    ),
    hidden: items.filter((item) =>
      item.display !== undefined ? !item.display : !item.initialDisplay
    ),
    sticky: items.filter((item) => item.id === 'sticky'),
    mandatory: items.filter((item) => item.mandatory && item.id !== 'sticky')
  })
  const { theme } = useTheme()

  const onSubmit = () => {
    onSubmitCallback([...updatedItems.shown, ...updatedItems.hidden, ...updatedItems.sticky], false)
  }
  const onDefault = () => {
    let dataItems = ''
    if (from === 'reviews table') {
      dispatch(fetchReviewsMetadataStart())
      dataItems = columns
    } else {
      dispatch(fetchReviewMetadataStart(reviewId))
      dataItems = reviewMetadata?.columns
    }
    onSubmitCallback(dataItems, true)
  }

  // Moves an item from one list to another list.
  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source)
    const destClone = Array.from(destination)
    const [removed] = sourceClone.splice(droppableSource.index, 1)

    // TODO: Modify  the line below once real APIs will be used
    if (removed.display) {
      removed.display = !removed.display
    } else {
      removed.initialDisplay = !removed.initialDisplay
    }

    destClone.splice(droppableDestination.index < 2 ? 2 : droppableDestination.index, 0, removed)

    const result = {}
    result[droppableSource.droppableId] = sourceClone
    result[droppableDestination.droppableId] = destClone

    return result
  }

  // Reordering the result
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list)
    const [removed] = result.splice(startIndex, 1)
    result.splice(endIndex < 2 ? 2 : endIndex, 0, removed)

    return result
  }

  const onDragEnd = (result) => {
    const { source, destination } = result

    // If there is no destination
    if (!destination) {
      if (source.droppableId === 'shown') {
        const { shown, hidden } = move(
          updatedItems[source.droppableId],
          updatedItems.hidden,
          source,
          { droppableId: 'hidden', index: source.index }
        )
        setUpdatedItems({
          ...updatedItems,
          shown,
          hidden
        })
      }
      if (source.droppableId === 'hidden') {
        const { shown, hidden } = move(
          updatedItems[source.droppableId],
          updatedItems.shown,
          source,
          { droppableId: 'shown', index: source.index }
        )
        setUpdatedItems({
          ...updatedItems,
          shown,
          hidden
        })
      }
      return
    }

    // If item is being dropped in the same table
    if (source?.droppableId === destination?.droppableId) {
      const reorderedItems = reorder(
        updatedItems[source.droppableId],
        source.index,
        destination.index
      )

      if (source.droppableId === 'hidden') {
        setUpdatedItems({ ...updatedItems, hidden: reorderedItems })
      } else {
        setUpdatedItems({ ...updatedItems, shown: reorderedItems })
      }
      // If item is being dropped in the second table (e.g. From table "shown" to "hidden")
    } else {
      const { shown, hidden } = move(
        updatedItems[source.droppableId],
        updatedItems[destination.droppableId],
        source,
        destination
      )

      setUpdatedItems({
        ...updatedItems,
        shown,
        hidden
      })
    }
  }
  const getColumnId = (colId) => {
    if (
      [
        'SECURITY_ADGROUP',
        'SECURITY_VDRGROUP',
        'DORMANT_AD_ACCS',
        'SECURITY_ADGROUP_MAIN',
        'SECURITY_VDRGROUP_MAIN'
      ].includes(certification)
    ) {
      if (colId === 'username') {
        return 'govUserName'
      }
      return colId
    }
    if (
      [
        'AAA_ASA_DB',
        'AAA_ASA_UNIX',
        'AAA_ASA_WIN',
        'AAA_WIN_UNIX_DB_DBPASSPORT_FOBO',
        'AAA_WIN_UNIX_DB_DBPASSPORT_MOV',
        'ENDUSER_ACCS_DB',
        'ISA_WIN_UNIX_DB',
        'WIN_UNIX_DB_DBPASSPORT_FOBO'
      ].includes(certification)
    ) {
      if (colId === 'username') {
        return 'govUserName'
      }
      return colId
    }
    return colId
  }
  return (
    <>
      <Styled.Title>{title}</Styled.Title>
      <Styled.Description>{description}</Styled.Description>
      <Styled.MainWrapper>
        <DragDropContext onDragEnd={onDragEnd}>
          <Styled.SubWrapper>
            <Styled.Header>{translate('modal.manageItems.hidden')}</Styled.Header>
            <Droppable droppableId="shown">
              {(provider) => (
                <div {...provider.droppableProps} ref={provider.innerRef}>
                  {updatedItems?.shown?.map(
                    (item, index) =>
                      (item.header.text || item.header) && (
                        <Draggable
                          key={item.id}
                          draggableId={item.id}
                          index={index}
                          isDragDisabled={item.mandatory}
                        >
                          {(provided) => (
                            <Styled.Item
                              key={`item-${item.id}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              isDragDisabled={item.mandatory}
                            >
                              <Styled.ItemName>
                                {item.header?.text
                                  ? translate(`review.columnHeader.${getColumnId(item.id)}`)
                                  : translate(`review.columnHeader.${item.header}`)}
                              </Styled.ItemName>
                              <Styled.SortIcons>
                                <Icon name="chevronUp" size="xxtiny" />
                                <Icon name="chevronDown" size="xxtiny" />
                              </Styled.SortIcons>
                            </Styled.Item>
                          )}
                        </Draggable>
                      )
                  )}
                  {provider.placeholder}
                </div>
              )}
            </Droppable>
          </Styled.SubWrapper>
          <Styled.SubWrapper>
            <Styled.Header>{translate('modal.manageItems.shown')}</Styled.Header>
            <Droppable droppableId="hidden">
              {(provider) => (
                <div {...provider.droppableProps} ref={provider.innerRef}>
                  {updatedItems?.hidden?.map(
                    (item, index) =>
                      (item.header.text || item.header) && (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <Styled.Item
                              key={`item-${item.id}`}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <Styled.ItemName>
                                {item.header?.text
                                  ? translate(`review.columnHeader.${getColumnId(item.id)}`)
                                  : translate(`review.columnHeader.${item.header}`)}
                              </Styled.ItemName>
                              <Styled.SortIcons>
                                <Icon name="chevronUp" size="xxtiny" />
                                <Icon name="chevronDown" size="xxtiny" />
                              </Styled.SortIcons>
                            </Styled.Item>
                          )}
                        </Draggable>
                      )
                  )}
                  {provider.placeholder}
                </div>
              )}
            </Droppable>
          </Styled.SubWrapper>
        </DragDropContext>
      </Styled.MainWrapper>

      <Styled.SubmitButtonWrapper>
        <Button
          onClick={handleClose}
          sx={{ marginRight: '8px', color: `${theme === 'dark' ? '#fff' : '#000'}` }}
        >
          {translate('cancel.button')}
        </Button>
        <Button
          onClick={onDefault}
          sx={{ marginRight: '8px', color: `${theme === 'dark' ? '#fff' : '#000'}` }}
        >
          {translate('reset.button')}
        </Button>
        <Button
          variant="outlined"
          sx={{
            color: `${theme === 'dark' ? '#fff' : '#000'}`,
            borderColor: `${theme === 'dark' ? '#fff' : '#000'}`
          }}
          onClick={onSubmit}
        >
          {translate('popup.button.apply')}
        </Button>
      </Styled.SubmitButtonWrapper>
    </>
  )
}

export default React.memo(ManageItemsModal)
