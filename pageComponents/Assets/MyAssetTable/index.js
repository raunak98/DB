/* eslint-disable */
import React, { useEffect, useState } from 'react'
import * as Styled from '../../../pages/myAsset/style'
import Table from '../../../components/table'
import { defineColumns, defineRows } from '../../../helpers/arrays'
import { useDispatch } from 'react-redux'

const MyAssetTable = ({
  rows,
  search,
  columns,
  hasPagination = type === 'AccessGroup' ? false : true,
  metadata,
  type,
  reviewId,
  total,
  myAssetType,
  selectedUserDetails
}) => {
  const [data, setData] = useState({
    allColumns: [],
    rows: [],
    paginationSizes: undefined,
    hasSortableColumns: false,
    initialSortColumnId: ''
  })

  const [pageIndex, setPageIndex] = useState(0)
  const [canNextPage, setCanNextPage] = useState(false)
  const [canPreviousPage, setCanPreviousPage] = useState(true)
  const pageSizeUpdated = 10
  const dispatch = useDispatch()

  useEffect(async () => {
    const rowsData = rows || []
    const columnData = columns || []
    const metaData = metadata || []

    const allColumns = defineColumns(columnData)
    const allRows = defineRows(metaData.columns, rowsData, type)

    setData({
      ...data,
      allColumns,
      allRows,
      paginationSizes: metaData.paginationSizes,
      hasSortableColumns: metaData.hasSortableColumns,
      initialSortColumnId: metaData.initialSortColumnId
    })
  }, [rows, columns])

  const returnSearchResults = () => {
    if (search === '') return data.allRows
    return data.allRows.filter((row) =>
      row?.accountName?.props?.cell?.toLowerCase().includes(search?.toLowerCase())
    )
  }
  const checkThegoToPreviousState = () => {
    setCanPreviousPage(!(pageIndex <= 0))
    let newPageCount = Math.round(total / pageSizeUpdated)
    if (total / pageSizeUpdated > Math.round(total / pageSizeUpdated)) {
      newPageCount++
    }
    setCanNextPage(!(pageIndex + 1 >= newPageCount))
  }
  useEffect(async () => {
    checkThegoToPreviousState()
  }, [])

  useEffect(async () => {
    checkThegoToPreviousState()
  }, [pageIndex, pageSizeUpdated])
  return (
    <>
      {!!data.allColumns.length && (
        <Styled.TableWrapper id="assets-top-container">
          <Table
            hasPagination={hasPagination}
            pageSizes={data.paginationSizes}
            hasSort={data.hasSortableColumns}
            initialSortColumnId={data.initialSortColumnId}
            allColumns={columns}
            items={returnSearchResults()}
            type={type}
            reviewId={reviewId}
            pageIndex={pageIndex}
            setPageIndex={setPageIndex}
            canNextPage={canNextPage}
            canPreviousPage={canPreviousPage}
            total={total}
            myAssetType={myAssetType}
            selectedUserDetails={selectedUserDetails}
          />
        </Styled.TableWrapper>
      )}
    </>
  )
}

MyAssetTable.defaultProps = {
  rows: [],
  search: [],
  columns: [],
  hasPagination: true,
  metadata: []
}

export default MyAssetTable
