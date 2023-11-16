import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { updatePageNumberReviews } from 'redux/reviews/reviews.action'
import * as Styled from '../../../pages/myTasks/reviews/review/style'
import Table from '../../../components/table'
import { defineColumns, defineRows } from '../../../helpers/arrays'
import { selectReviewPageSize, selectReviewPageNumber } from '../../../redux/review/review.selector'
import { fetchReviewItemsSuccess } from '../../../redux/review/review.action'

const ReviewTable = ({
  rows,
  search,
  columns,
  hasPagination = true,
  metadata,
  type,
  reviewId,
  total,
  isGroupPagination,
  certification,
  isReviewerTabActive
}) => {
  const [data, setData] = useState({
    allColumns: [],
    rows: [],
    paginationSizes: [],
    hasSortableColumns: false,
    initialSortColumnId: ''
  })

  const [canNextPage, setCanNextPage] = useState(false)
  const [canPreviousPage, setCanPreviousPage] = useState(true)
  const pageSizeUpdated = useSelector(selectReviewPageSize)
  const pageNumberUpdated = useSelector(selectReviewPageNumber)
  const dispatch = useDispatch()

  useEffect(
    () => () => {
      dispatch(fetchReviewItemsSuccess({ reviewItems: [] }))
    },
    []
  )

  useEffect(
    () => () => {
      dispatch(fetchReviewItemsSuccess({ reviewItems: [] }))
    },
    []
  )

  useEffect(async () => {
    const rowsData = rows || []
    const columnData = columns || []
    const metaData = metadata || []

    const allColumns = defineColumns(columnData)
    const allRows = defineRows(metaData.columns, rowsData, type, certification)

    setData({
      ...data,
      allColumns,
      allRows,
      paginationSizes: metaData.paginationSizes,
      hasSortableColumns: metaData.hasSortableColumns,
      initialSortColumnId: metaData.initialSortColumnId
    })
  }, [rows, columns])

  const setPageIndex = (pageNumber) => {
    dispatch(updatePageNumberReviews(pageNumber))
  }
  const returnSearchResults = () => data.allRows
  const checkThegoToPreviousState = () => {
    setCanPreviousPage(pageNumberUpdated <= 0)
    let newPageCount = Math.round(total / pageSizeUpdated)
    if (total / pageSizeUpdated > Math.round(total / pageSizeUpdated)) {
      newPageCount += 1
    }
    setCanNextPage(pageNumberUpdated + 1 >= newPageCount)
  }
  useEffect(async () => {
    checkThegoToPreviousState()
  }, [])

  useEffect(async () => {
    checkThegoToPreviousState()
  }, [pageNumberUpdated, pageSizeUpdated])
  return (
    <>
      {!!data.allColumns.length && (
        <Styled.TableWrapper id="review-top-container">
          <Table
            hasPagination={hasPagination}
            pageSizes={data.paginationSizes}
            hasSort={data.hasSortableColumns}
            initialSortColumnId={data.initialSortColumnId}
            allColumns={columns}
            items={returnSearchResults()}
            type={type}
            reviewId={reviewId}
            pageIndex={pageNumberUpdated}
            setPageIndex={setPageIndex}
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
            total={total}
            isGroupPagination={isGroupPagination}
            search={search}
            certification={certification}
            isReviewerTabActive={isReviewerTabActive}
          />
        </Styled.TableWrapper>
      )}
    </>
  )
}

ReviewTable.defaultProps = {
  rows: [],
  search: [],
  columns: [],
  hasPagination: true,
  metadata: []
}

export default ReviewTable
