/* eslint-disable */
import React, { useMemo, useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Accordion from '../../../components/accordion'
import MultipleSelectCheckbox from '../MultipleSelectCheckbox'
import TablePagination from '@mui/material/TablePagination'
import * as Styled from './style'
import GroupReviewsTableItem from './GroupReviewsTableItem'
import { updateGroupPageSize, updateGroupPagenUmber } from '../../../redux/review/review.action'
import translate from 'translations/translate'
import { selectApplyFilters } from '../../../redux/review/review.selector'

const GroupedReviewTable = ({
  items,
  data,
  metadata,
  reviewItemsData,
  reviewId,
  pageCount,
  monitorData,
  certificationId,
  type,
  isReviewerTabActive
}) => {
  const dispatch = useDispatch()
  const pageSizes = [10, 20, 30]
  const [currentPage, setCurrentPage] = useState(0)
  const [currentPageItems, setCurrentPageItems] = useState(pageSizes[0])
  const filterArray = useSelector(selectApplyFilters)

  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage)
    dispatch(updateGroupPagenUmber(newPage))
  }

  const handleChangeRowsPerPage = (event) => {
    setCurrentPageItems(event.target.value)
    dispatch(updateGroupPageSize(event.target.value))
    setCurrentPage(0)
    dispatch(updateGroupPagenUmber(0))
  }
  // eslint-disable-next-line no-unused-vars
  const checkIsMonitor = (monitorData, mail) => {
    let isMonitor = false
    if (
      monitorData &&
      monitorData.length &&
      monitorData[0]?.actors.length &&
      filterArray[0]?.id?.label === 'Reviewer'
    ) {
      const actorArray = monitorData[0].actors.map((actor) => {
        if (actor?.mail === mail && actor?.label === 'monitor') {
          isMonitor = true
        }
        return actor?.mail
      })
    }
    return isMonitor
  }

  return (
    <div>
      {items.length ? (
        metadata &&
        items.map((item, index) => (
          <GroupReviewsTableItem
            item={item}
            data={data}
            metadata={metadata}
            reviewItemsData={reviewItemsData}
            reviewId={reviewId}
            arrayOfGroup={items}
            isMonitor={checkIsMonitor(monitorData, item.key)}
            index={index}
            certificationId={certificationId}
            type={type}
            isReviewerTabActive={isReviewerTabActive}
          />
        ))
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#FFF',
            fontSize: '16px'
          }}
        >
          No data found
        </div>
      )}
      <Styled.PaginationWrapper>
        <TablePagination
          style={{
            padding: '0px',
            marginTop: '10px',
            background: 'transparent',
            fontSize: '12px',
            marginLeft: '77%',
            float: 'right'
          }}
          rowsPerPageOptions={pageSizes}
          component="div"
          count={Number(pageCount)}
          rowsPerPage={currentPageItems}
          labelRowsPerPage={translate('table.pagination')}
          page={currentPage}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Styled.PaginationWrapper>
    </div>
  )
}

export default GroupedReviewTable
