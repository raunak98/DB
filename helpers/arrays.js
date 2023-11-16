import React from 'react'
import { Link } from 'react-router-dom'
import _ from 'lodash'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { grey } from '@mui/material/colors'
import CollapsibleColumn from 'pageComponents/Review/CollapsibleColumn'
import ActionButtons from 'pageComponents/Review/ActionButtons'
import SingleSelectCheckbox from '../pageComponents/Review/SingleSelectCheckbox'
import MultipleSelectCheckbox from '../pageComponents/Review/MultipleSelectCheckbox'
import ToggleIcon from '../pageComponents/Review/ToggleIcon'
import ReviewDropbox from '../pageComponents/Review/Dropbox'
import ReviewTextIcon from '../pageComponents/Review/TextIcon'
import PopupLink from '../pageComponents/Review/PopupLink'
import ScrollButtons from '../components/scrollButtons'
import { getApiAction, scrollToLeft, scrollToRight } from './table'
import PopupIcon from '../pageComponents/Review/PopupIcon'
import colors from '../styles/colors'
import { ternaryCheck } from './utils'

export const filterArrayNew = (array, property) => _.groupBy(array, (n) => n[property])

const confirmedStatusArray = ['signed-off', 'expired']

export const SORTING_DIRECTIONS = {
  ASC: 'asc',
  DESC: 'desc'
}

export const PAGE_SIZES = [10, 25, 50, 100]

export const sortAlphabetically =
  (field, direction = SORTING_DIRECTIONS.ASC) =>
  (a, b) => {
    const x = a[field].toLowerCase()
    const y = b[field].toLowerCase()
    if (x < y) {
      return direction === SORTING_DIRECTIONS.ASC ? -1 : 1
    }
    if (x > y) {
      return direction === SORTING_DIRECTIONS.ASC ? 1 : -1
    }
    return 0
  }

export const sortNumerically =
  (field, direction = SORTING_DIRECTIONS.ASC) =>
  (a, b) => {
    if (a[field] < b[field]) {
      return direction === SORTING_DIRECTIONS.ASC ? -1 : 1
    }
    if (a[field] > b[field]) {
      return direction === SORTING_DIRECTIONS.ASC ? 1 : -1
    }
    return 0
  }

const getColumHeader = (headerMetaData, grouped, type) => {
  let header = ''

  if (headerMetaData.type === 'text') {
    header = headerMetaData.headerId ? headerMetaData.headerId : headerMetaData.text // translate(`review.columnHeader.${headerMetaData.text}`),
  }

  if (headerMetaData.type === 'component') {
    switch (headerMetaData.component) {
      case 'checkbox':
        header = type === 'GroupAdmin' ? '' : <MultipleSelectCheckbox type={type} expanded="true" /> // TODO When the header checkbox is ticked/unticked, then all rows checkboxes should also gets ticked/unticked.
        break
      case 'sticky':
        header = (
          <ScrollButtons
            onClickLeft={() => scrollToLeft('review-table')}
            onClickRight={() => scrollToRight('review-table')}
          />
        )
        break
      default:
        header = ''
    }
  }

  return header
}
export const defineColumns = (columnsMetaData, grouped, type) =>
  columnsMetaData.map((columnMetaData) => ({
    id: columnMetaData.id,
    header: getColumHeader(columnMetaData.header, grouped, type),
    sortable: columnMetaData.sortable,
    display: columnMetaData.initialDisplay,
    mandatory: columnMetaData.mandatory,
    order: columnMetaData.order,
    text: columnMetaData.header.text,
    sortKey: columnMetaData.header?.sortKey !== undefined ? columnMetaData.header?.sortKey : '',
    resizable: columnMetaData.type === 'text'
    // resizable: columnMetaData.resizable, // commented this to use when required for adding resize from metadata
  }))

export const defineRows = (columnsMetaData, dataItems, type, certification) => {
  if (dataItems && dataItems.length === 0) return []
  return dataItems.map((dataItem) => {
    const row = {}

    columnsMetaData?.forEach((columnMetaData) => {
      let cell
      switch (columnMetaData.type) {
        case 'checkbox':
          cell =
            type === 'GroupAdmin' ? (
              ''
            ) : (
              <SingleSelectCheckbox
                isChecked={dataItem.checked}
                name={`${columnMetaData.id}-${dataItem.id}`}
                reviewId={dataItem.id}
                dataItem={dataItem}
                type={type}
              />
            )
          break
        case 'dropdownToPopup':
          cell = (
            <div style={{ width: '130px' }}>
              <ReviewDropbox
                columnMetaData={columnMetaData}
                id={dataItem.id}
                permission={dataItem.permissions}
                data={dataItem}
                dataType={type}
                certificationDesc={certification}
              />
            </div>
          )
          break
        case 'icon':
          cell = (
            <ToggleIcon
              permission={
                dataItem?.permissions && dataItem.permissions[getApiAction(columnMetaData.id)]
              }
              status={dataItem.status}
              iconActive={columnMetaData.properties.iconActive}
              iconInactive={columnMetaData.properties.iconInactive}
              type={columnMetaData.id}
              reviewId={dataItem.id}
            />
          )
          break
        case 'actionButtons':
          cell = (
            <ActionButtons
              actions={columnMetaData.properties.options}
              status={dataItem.status}
              reviewId={dataItem.id}
              comments={dataItem.comment}
              isDisabled={
                (type && type === 'History') ||
                (dataItem.decision && confirmedStatusArray.includes(dataItem.decision.status))
              }
            />
          )
          break
        case 'iconPopup':
          cell = (
            <PopupIcon
              permission={
                dataItem?.permissions && dataItem.permissions[getApiAction(columnMetaData.id)]
              }
              iconActive={columnMetaData.properties.iconActive}
              iconInactive={columnMetaData.properties.iconInactive}
              type={columnMetaData.id}
              // id={dataItem.id} // uncomment if not working with reviewId
              columnMetaData={columnMetaData}
              dataItem={dataItem}
              comments={dataItem.comment}
              status={dataItem.status}
              reviewId={dataItem.id}
              isDisabled={
                (type && type === 'History') ||
                (dataItem.decision && confirmedStatusArray.includes(dataItem.decision.status))
              }
            />
          )
          break
        case 'longMenu':
          cell = (
            <div style={{ width: '130px' }}>
              <ReviewDropbox
                columnMetaData={columnMetaData}
                reviewId={dataItem.id}
                permission={dataItem.permissions}
                type="longMenu"
                isDisabled={
                  (type && type === 'History') ||
                  (dataItem.decision && confirmedStatusArray.includes(dataItem.decision.status))
                }
                reviewActors={dataItem.actors ? dataItem.actors : []}
                dataType={type}
                certificationDesc={certification}
              />
            </div>
          )
          break
        case 'linkToPopup':
          cell = (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <PopupLink
                columnMetaData={columnMetaData}
                dataItem={dataItem}
                permission={
                  dataItem?.permissions && dataItem.permissions[getApiAction(columnMetaData.id)]
                }
              />
              {columnMetaData.id === 'comment' && dataItem?.comment?.length > 0 && (
                <FontAwesomeIcon icon="bell" color={colors.primary} />
              )}
            </div>
          )
          break
        case 'redirectButton':
          cell = ternaryCheck(
            ['/my-team'].includes(window.location.pathname),
            null,
            (dataItem?.name && dataItem.name.toLowerCase().includes('vdr data group main cycle')) ||
              (dataItem?.name &&
                dataItem.name.toLowerCase().includes('ad data group main cycle')) ? (
              // dataItem.name.toLowerCase().includes('securitygroupad') ? (
              <Link
                to={{
                  pathname: `${window.location.pathname}/semiAnnual`,
                  state: columnMetaData.properties.redirectProps.reduce(
                    (accumulator, currentProp) => ({
                      ...accumulator,
                      [currentProp]: dataItem[currentProp],
                      type
                    }),
                    {}
                  )
                }}
                style={{ textDecoration: 'none', display: 'flex', color: 'inherit' }}
              >
                {columnMetaData.id === 'name' ? (
                  dataItem[columnMetaData.id]
                ) : (
                  <ArrowForwardIosIcon sx={{ color: grey[700] }} fontSize="small" />
                )}
              </Link>
            ) : (
              <Link
                to={{
                  pathname: `${window.location.pathname}/review`,
                  state: columnMetaData.properties.redirectProps.reduce(
                    (accumulator, currentProp) => ({
                      ...accumulator,
                      [currentProp]: dataItem[currentProp],
                      type
                    }),
                    {}
                  )
                }}
                style={{ textDecoration: 'none', display: 'flex', color: 'inherit' }}
              >
                {columnMetaData.id === 'name' ? (
                  dataItem[columnMetaData.id]
                ) : (
                  <ArrowForwardIosIcon sx={{ color: grey[700] }} fontSize="small" />
                )}
              </Link>
            )
          )

          break
        case 'collapsColumn':
          cell = (
            <div>
              <CollapsibleColumn
                columnMetaData={columnMetaData}
                dataItem={dataItem}
                type={type}
                status={dataItem.status}
                comments={dataItem.comment}
              />
            </div>
          )
          break
        default:
          if (
            columnMetaData.id === 'status' &&
            certification === 'SELF_ASSESSMENT' &&
            [null, undefined, ''].includes(dataItem[columnMetaData.id]) === false
          ) {
            cell = dataItem[columnMetaData.id] === 'certify' ? 'YES' : 'Not-Applicable'
          } else if (columnMetaData.id === 'status') {
            cell =
              dataItem[columnMetaData.id] === 'certify' ? 'maintain' : dataItem[columnMetaData.id]
          } else {
            cell = dataItem[columnMetaData.id]
          }
      }

      if (
        ['/my-team'].includes(window.location.pathname) &&
        columnMetaData.type === 'redirectButton'
      ) {
        row.path = columnMetaData
      }

      row[columnMetaData.id] = columnMetaData.hasInfo ? (
        <ReviewTextIcon
          dataItem={dataItem}
          cell={cell}
          columnType={columnMetaData.id}
          certification={certification}
          moduleType={type}
          properties={columnMetaData.properties}
        />
      ) : (
        cell
      )
    })

    row.confirmedDecision = dataItem?.confirmedDecision ? dataItem.confirmedDecision : ''
    row.checked = typeof dataItem.checked !== 'undefined' ? dataItem.checked : ''
    row.id = dataItem.id

    return row
  })
}
