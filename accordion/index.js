import React, { useState } from 'react'
import BlockOutlinedIcon from '@mui/icons-material/BlockOutlined'
import { Tooltip } from '@mui/material'
import Button from '@mui/material/Button'
import { useSelector, useDispatch } from 'react-redux'
import Icon from 'components/icon'
import translate from 'translations/translate'
import {
  selectExpandIndex,
  selectGroupBykey,
  selectGroupedItemsSearchFlag,
  selectReviewPageNumber,
  selectReviewPageSize,
  selectSelectedReviewItems,
  selectSortInfoData
} from '../../redux/review/review.selector'
import {
  updateExpandIndex,
  updateGroupedItemsSearchFlag,
  updateShowBigLoader,
  updateSortInfoData
} from '../../redux/review/review.action'
import * as Styled from './style'
import GenericModal from '../genericModal'

const Accordion = ({ children, headers, itemId, expanded, onLoadData, isMonitor, index }) => {
  if (itemId === undefined) {
    return null
  }
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const pageNumber = useSelector(selectReviewPageNumber)
  const pageSize = useSelector(selectReviewPageSize)
  const expandIndex = useSelector(selectExpandIndex)
  const loadedDataItem = useSelector(selectGroupBykey)
  const sortInfoData = useSelector(selectSortInfoData)
  const selectedReviewItems = useSelector(selectSelectedReviewItems)
  const groupedItemsSearchFlag = useSelector(selectGroupedItemsSearchFlag)
  const onIconClick = (index2) => {
    if (groupedItemsSearchFlag) {
      dispatch(updateGroupedItemsSearchFlag(false))
    }
    setOpen(false)
    if (sortInfoData.sortKey !== '') {
      dispatch(
        updateSortInfoData({
          sortKey: '',
          isAscending: 'asc',
          payload: {}
        })
      )
    }
    if (expandIndex !== index2) {
      dispatch(updateShowBigLoader(true))
      dispatch(updateExpandIndex(index2))
      onLoadData()
    } else {
      dispatch(updateExpandIndex(-1))
    }
  }
  const handleModalState = (ix) => {
    // when closing the same accordion
    if (ix === expandIndex) {
      if (
        pageNumber !== 0 ||
        pageSize !== 10 ||
        sortInfoData.sortKey !== '' ||
        selectedReviewItems.length !== 0
      ) {
        // Showing confirmation popup if any of the above thing is changed
        setOpen(true)
      } else {
        onIconClick(index)
      }
    } else if (expandIndex === -1) {
      // when all accordions are in closed state
      onIconClick(index)
    }
    // when trying to open a diff accordion when already one is opened
    else if (
      pageNumber !== 0 ||
      pageSize !== 10 ||
      sortInfoData.sortKey !== '' ||
      selectedReviewItems.length !== 0
    ) {
      // Showing confirmation popup if any of the above thing is changed
      setOpen(true)
    } else {
      onIconClick(index)
    }
  }
  return (
    <>
      {open && (
        <GenericModal setOpen={setOpen} width="702px">
          <div>
            <Styled.InfoWrapper>
              <Styled.HeaderWrapper>{translate('accordion.headerMessage')}</Styled.HeaderWrapper>
            </Styled.InfoWrapper>
            {translate('accordion.warningMessage')}
            <Styled.ButtonWrapper>
              <Button
                variant="contained"
                style={{
                  float: 'right',
                  marginTop: '45px',
                  background: '#fff',
                  color: '#333',
                  border: '2px solid rgb(208, 203, 203)'
                }}
                onClick={() => onIconClick(index)}
              >
                {translate('confirm.button')}
              </Button>
              <Button
                variant="contained"
                style={{
                  float: 'right',
                  marginTop: '45px',
                  marginRight: '15px',
                  background: '#fff',
                  color: '#333',
                  border: '2px solid rgb(208, 203, 203)'
                }}
                onClick={() => setOpen(false)}
              >
                {translate('cancel.button')}
              </Button>
            </Styled.ButtonWrapper>
          </div>
        </GenericModal>
      )}
      <Styled.MainContainer>
        <Styled.Wrapper data-testid="accordion" isDisable={isMonitor}>
          {headers.map((header, _index) => (
            <Styled.Header data-testid="accordion-header" expanded={expanded}>
              <div key={`accordion-header-${_index}`}>{header}</div>
            </Styled.Header>
          ))}
          <Styled.ExpandIcon>
            {!isMonitor ? (
              <Icon
                name={expandIndex === index ? 'chevronUp' : 'chevronDown'}
                size="tiny"
                onClickCallback={() =>
                  loadedDataItem === null ? onIconClick(index) : handleModalState(index)
                }
              />
            ) : (
              <Tooltip title={translate('accordion.title')}>
                <BlockOutlinedIcon sx={{ color: '#999' }} />
              </Tooltip>
            )}
          </Styled.ExpandIcon>
        </Styled.Wrapper>
        <Styled.Children data-testid="accordion-children" expanded={expandIndex === index}>
          {children}
        </Styled.Children>
      </Styled.MainContainer>
    </>
  )
}

export default Accordion
Accordion.defaultProps = {
  children: null,
  headers: []
}
