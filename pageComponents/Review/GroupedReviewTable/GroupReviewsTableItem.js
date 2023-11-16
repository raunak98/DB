import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
// import { filterArrayNew } from 'helpers/arrays'
import MSearchBox from 'components/mSearchBox'
import Accordion from '../../../components/accordion'
// import MultipleSelectCheckbox from '../MultipleSelectCheckbox'
import {
  fetchReviewItemsSuccess,
  updateShowBigLoader,
  getReviewItemTotalCount,
  updateExpandIndex,
  setFilterData,
  updatePageSize,
  updatePagenUmber,
  updateGroupByKey,
  fetchReviewSortStart,
  fetchReviewerSortStart,
  fetchMonitorSortStart,
  updateSearch,
  updateSelectedReviewItems,
  updateGroupedItemsSearchFlag,
  fetchGroupByReviewerSearchStart
} from '../../../redux/review/review.action'
import {
  selectApplyFilters,
  selectReviewGropupPageNumber,
  selectReviewItems,
  selectNotificationMessage,
  selectReviewPageSize,
  selectReviewPageNumber,
  selectIsGoingForwardFlag,
  selectPaginationKeys,
  selectFilterData,
  selectGroupBykey,
  selectSortInfoData,
  selectSearchAfterKeyword,
  selectSelectedReviewItems,
  selectReviewTypeStatus,
  selectCertification,
  selectSeach,
  selectGroupedItemsSearchFlag,
  selectIsSemiAnnualCampaign
} from '../../../redux/review/review.selector'
import * as reviewApi from '../../../api/review'
import * as profileAPI from '../../../api/profile'
import ReviewTable from '../ReviewTable'
import {
  selectProfileDetailsSelector,
  selectProvisioningRoles
} from '../../../redux/profile/profile.selector'
import * as Styled from './style'

const GroupReviewsTableItem = ({
  item,
  data,
  metadata,
  // reviewItemsData,
  reviewId,
  // arrayOfGroup,
  isMonitor,
  index,
  certificationId,
  type,
  isReviewerTabActive
}) => {
  const dispatch = useDispatch()
  const filterArray = useSelector(selectApplyFilters)
  const reviewItems = useSelector(selectReviewItems)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  const noticationMessage = useSelector(selectNotificationMessage)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const filterData = useSelector(selectFilterData)
  const sortInfoData = useSelector(selectSortInfoData)
  const sortPaginationKeyword = useSelector(selectSearchAfterKeyword)
  const groupPageNumber = useSelector(selectReviewGropupPageNumber)
  const pageSize = useSelector(selectReviewPageSize)
  const pageNumber = useSelector(selectReviewPageNumber)
  const paginationKeysArray = useSelector(selectPaginationKeys)
  const isGoingForward = useSelector(selectIsGoingForwardFlag)
  // eslint-disable-next-line no-unused-vars
  const [filterKey, setFilterKey] = useState('')

  // const [reviewData, setReviewData] = useState([])
  const [userInfo, setUserInfo] = useState()

  // const isDataexist = (resData) => {
  //   let isTrue = false
  //   // eslint-disable-next-line no-unused-vars
  //   const arra = resData.map((e) => {
  //     if (Object.values(e).indexOf(item.key) !== -1) {
  //       isTrue = true
  //     }

  //     // }
  //     return isTrue
  //   })

  //   return isTrue
  // }

  const [clickedIndex, setClickedIndex] = useState(0)
  const loadedDataItem = useSelector(selectGroupBykey)
  const getReviewStatus = useSelector(selectReviewTypeStatus)
  const certType = useSelector(selectCertification)
  const searchValue = useSelector(selectSeach)
  const groupedItemsSearchFlag = useSelector(selectGroupedItemsSearchFlag)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const provisioningRoles = useSelector(selectProvisioningRoles)

  let isNewAccordion = false
  const [expandedAccordionkey, setExpandedAccordioKey] = useState()

  useEffect(() => {
    if (selectedReviewItems?.length !== 0) {
      const updatedItems =
        reviewItems?.length > 0 &&
        reviewItems.map((reviewItem) => {
          // Checking if we have already selected item
          const checkedItem = selectedReviewItems.find(
            (selectedReviewItem) => selectedReviewItem.id === reviewItem.id
          )
          return checkedItem ? { ...reviewItem, checked: true } : reviewItem
        })
      if (updatedItems?.length > 0) {
        setUpdatedReviewItems([...updatedItems])
      } else {
        setUpdatedReviewItems([])
      }
    } else if (reviewItems?.length > 0) {
      setUpdatedReviewItems([...reviewItems])
    } else {
      setUpdatedReviewItems([])
    }
  }, [reviewItems])

  // checkbox related changes
  // const isDataexist = (resData) => {
  //   let isTrue = false
  //   // eslint-disable-next-line no-unused-vars
  //   const arra = resData.map((e) => {
  //     if (Object.values(e).indexOf(item.key) !== -1) {
  //       isTrue = true
  //     }

  //     // }
  //     return isTrue
  //   })

  //   return isTrue
  // }

  // useEffect(() => {
  //   if (filterArray[0]?.id?.value) {
  //     switch (filterArray[0]?.id?.value) {
  //       case 'Username':
  //         setFilterKey('username')
  //         break
  //       case 'Account Name':
  //         setFilterKey('accountName')
  //         break
  //       case 'By Question':
  //         setFilterKey('question')
  //         break
  //       case 'NAR ID':
  //         setFilterKey('narId')
  //         break
  //       case 'Hostname':
  //         setFilterKey('resource')
  //         break
  //       case 'Resource Name':
  //         setFilterKey('resourceName')
  //         break
  //       case 'Application Name':
  //         setFilterKey('applicationName')
  //         break
  //       case 'Entitlement':
  //         setFilterKey('entitlement')
  //         break
  //       case 'GRP Name':
  //         setFilterKey('groupName')
  //         break
  //       default:
  //         setFilterKey('username')
  //         break
  //     }
  //   } else {
  //     setFilterKey('')
  //   }
  // }, [filterArray])

  useEffect(() => {
    // checkbox related changes
    // setExpanded(false)
    dispatch(updateExpandIndex(-1))
  }, [groupPageNumber])
  // checkbox related changes
  // useEffect(() => {
  //   const groupbyArray = filterArrayNew(reviewItemsData, filterKey)
  //   if (item.key && groupbyArray && groupbyArray.length) {
  //     setReviewData(groupbyArray[item.key])
  //   }
  // }, [reviewItemsData])

  const iff = (consition, then, otherise) => (consition ? then : otherise)
  const getStatus = () =>
    localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'

  // eslint-disable-next-line no-unused-vars
  const getPaginationKeyword = () =>
    isGoingForward
      ? iff(
          updatedReviewItems && updatedReviewItems[0]?.sort?.sort[0],
          updatedReviewItems[0]?.sort?.sort[0],
          null
        )
      : iff(sortPaginationKeyword.length > 0, sortPaginationKeyword.slice(-1)[0], '')

  const loadtData = async (datavalue, isNotificationChanged, isClearSearch) => {
    // checkbox related changes
    // const isData = isDataexist(updatedReviewItems)
    // if (!isLoadAgain) {
    // if (!expanded && !isData) dispatch(updateShowBigLoader(true))
    localStorage.setItem('certificationId', certificationId)

    dispatch(setFilterData({ ...filterData, groupByValue: datavalue.key }))
    if (filterArray.length === 2) {
      dispatch(updateShowBigLoader(true))
      if (filterArray[1]?.id?.label === 'Reviewer') {
        if (!isClearSearch && groupedItemsSearchFlag === true && searchValue !== '') {
          const reviewerSearchPayload = {
            campaignId: reviewId,
            searchItem: searchValue,
            status: type === 'History' ? getStatus() : getReviewStatus,
            pageSize,
            pageNumber,
            certType,
            userEmail: item.key,
            userRole: 'reviewer',
            filterBy: filterArray[0].id.type,
            filterByValue: filterArray[0].id.value
          }
          const res = await reviewApi.reviewerSearch(
            reviewerSearchPayload,
            userInfo.id,
            certType,
            provisioningRoles
          )
          dispatch(
            fetchReviewItemsSuccess({
              reviewItems: res
            })
          )
        } else {
          const filterAndGroupByForMonitor = {
            campaignId: reviewId,
            status: type === 'History' ? getStatus() : getReviewStatus,
            pageSize,
            pageNumber,
            filterBy: filterArray[0].id.type,
            filterByValue: filterArray[0].id.value,
            userRole: 'reviewer',
            userEmail: datavalue.key
          }
          const filterAndGroupByForMonitorSort = {
            ...filterAndGroupByForMonitor,
            sortBy: sortInfoData.sortKey,
            sortOrder: sortInfoData.isAscending
          }
          if (sortInfoData.sortKey !== '' && !isNewAccordion) {
            reviewApi
              .postSortFilterGroupByMonitorDataSa(
                filterAndGroupByForMonitorSort,
                userInfo?.id,
                certificationId,
                provisioningRoles
              )
              .then((response) => {
                dispatch(
                  fetchReviewItemsSuccess({
                    reviewItems: response?.normalizedData
                  })
                )
                dispatch(
                  getReviewItemTotalCount(
                    response?.normalizedData?.length > 0 &&
                      response?.normalizedData[0]?.total !== undefined
                      ? response.normalizedData[0]?.total
                      : 0
                  )
                )
              })
              .catch((error) => {
                console.error(error)
                dispatch(updateShowBigLoader(false))
              })
          } else {
            reviewApi
              .postFilterAndGroupByMonitorDataSa(
                filterAndGroupByForMonitor,
                userInfo?.id,
                certificationId,
                provisioningRoles
              )
              .then((response) => {
                dispatch(
                  fetchReviewItemsSuccess({
                    reviewItems: response?.normalizedData
                  })
                )
                dispatch(
                  getReviewItemTotalCount(
                    response?.normalizedData?.length > 0 &&
                      response?.normalizedData[0]?.total !== undefined
                      ? response.normalizedData[0]?.total
                      : 0
                  )
                )
              })
              .catch((error) => {
                console.error(error)
                dispatch(updateShowBigLoader(false))
              })
          }
        }
      } else {
        const filterAndGroupByForReviewer = {
          campaignId: reviewId,
          status: type === 'History' ? getStatus() : getReviewStatus,
          pageSize,
          pageNumber,
          filterBy: filterArray[0].id.type,
          filterByValue: filterArray[0].id.value,
          userRole: 'reviewer',
          userEmail: profileDetails?.mail,
          group: filterArray[1].id.type,
          groupedValue: datavalue.key
        }
        const filterAndGroupByForReviewerSort = {
          ...filterAndGroupByForReviewer,
          sortBy: sortInfoData.sortKey,
          sortOrder: sortInfoData.isAscending
        }
        if (sortInfoData.sortKey !== '' && !isNewAccordion) {
          reviewApi
            .postSortFilterAndGroupByDataSa(
              filterAndGroupByForReviewerSort,
              userInfo?.id,
              certificationId,
              provisioningRoles
            )
            .then((response) => {
              dispatch(
                fetchReviewItemsSuccess({
                  reviewItems: response?.normalizedData
                })
              )
              dispatch(
                getReviewItemTotalCount(
                  response?.normalizedData?.length > 0 &&
                    response?.normalizedData[0]?.total !== undefined
                    ? response.normalizedData[0]?.total
                    : 0
                )
              )
            })
            .catch((error) => {
              console.error(error)
              dispatch(updateShowBigLoader(false))
            })
        } else {
          reviewApi
            .postFilterAndGroupByDataSa(
              filterAndGroupByForReviewer,
              userInfo?.id,
              certificationId,
              provisioningRoles
            )
            .then((response) => {
              dispatch(
                fetchReviewItemsSuccess({
                  reviewItems: response?.normalizedData
                })
              )
              dispatch(
                getReviewItemTotalCount(
                  response?.normalizedData?.length > 0 &&
                    response?.normalizedData[0]?.total !== undefined
                    ? response.normalizedData[0]?.total
                    : 0
                )
              )
            })
            .catch((error) => {
              console.error(error)
              dispatch(updateShowBigLoader(false))
            })
        }
      }
    } else if (filterArray[0]?.id?.label === 'Reviewer') {
      dispatch(updateShowBigLoader(true))
      let payload = {
        campaignId: reviewId,
        decisionStatus: type === 'History' ? getStatus() : getReviewStatus,
        userRole: 'reviewer',
        userEmail: datavalue.key,
        pageSize,
        pageNumber
      }

      if (!isClearSearch && groupedItemsSearchFlag === true && searchValue !== '') {
        const reviewerSearchPayload = {
          campaignId: reviewId,
          searchItem: searchValue,
          status: type === 'History' ? getStatus() : getReviewStatus,
          pageSize,
          pageNumber,
          certType,
          userEmail: item.key,
          userRole: 'reviewer'
        }
        const res = await reviewApi.reviewerSearch(
          reviewerSearchPayload,
          userInfo.id,
          certType,
          provisioningRoles
        )
        dispatch(
          fetchReviewItemsSuccess({
            reviewItems: res
          })
        )
      } else if (pageNumber > 0 && paginationKeysArray && paginationKeysArray.length > 0) {
        // if (isNotificationChanged) {
        //   paginationKey = iff(paginationKeysArray.length > 0, paginationKeysArray.slice(-1)[0], '')
        // }
        payload = {
          ...payload
        }
      } else if (sortInfoData.sortKey !== '' && !isNewAccordion) {
        const sortingPayloadForMonitor = {
          campaignId: reviewId,
          status: type === 'History' ? getStatus() : getReviewStatus,
          userRole: 'reviewer',
          userEmail: datavalue.key,
          pageSize,
          pageNumber,
          sortBy: sortInfoData.sortKey,
          sortOrder: sortInfoData.isAscending
        }
        const sortingPayloadForReviewer = {
          campaignId: reviewId,
          status: type === 'History' ? getStatus() : getReviewStatus,
          userRole: 'reviewer',
          userEmail: profileDetails?.mail,
          pageSize,
          pageNumber,
          ...sortInfoData.payload
        }
        const reviewSortPayload = {
          campaignId: reviewId,
          decisionStatus: type === 'History' ? getStatus() : getReviewStatus, // can be decision status
          userRole: 'monitor',
          userEmail: datavalue.key,
          pageSize,
          pageNumber,
          ...sortInfoData.payload
        }

        if (isSemiAnnualCampaign) {
          if (isReviewerTabActive) {
            dispatch(fetchReviewerSortStart(sortingPayloadForReviewer))
          } else {
            dispatch(fetchMonitorSortStart(sortingPayloadForMonitor))
          }
        } else {
          dispatch(fetchReviewSortStart(reviewSortPayload))
        }
      } else if (isSemiAnnualCampaign) {
        const updatedPayload = { ...payload, status: payload.decisionStatus }
        delete updatedPayload.decisionStatus
        reviewApi
          .postMonitorData(updatedPayload, userInfo?.id, certificationId, provisioningRoles)
          .then((response) => {
            // checkbox related changes
            // setReviewData(response)
            // const containsData = isDataexist(updatedReviewItems)
            // const res = containsData ? response : [...reviewItemsData, ...response]
            dispatch(
              fetchReviewItemsSuccess({
                reviewItems: response?.normalizedData
              })
            )
            dispatch(
              getReviewItemTotalCount(
                response?.normalizedData?.length > 0 &&
                  response?.normalizedData[0]?.total !== undefined
                  ? response.normalizedData[0]?.total
                  : 0
              )
            )
          })
          .catch((error) => {
            console.error(error)
            dispatch(updateShowBigLoader(false))
          })
      } else {
        const payloadForElasticFilter = {
          campaignId: reviewId,
          decisionStatus: type === 'History' ? getStatus() : 'in-progress', // can be decision status
          userRole: 'monitor',
          userEmail: profileDetails?.mail,
          filterByEmail: datavalue.key,
          pageSize,
          pageNumber
        }
        reviewApi
          .elasticFilterByEmail(payloadForElasticFilter, userInfo?.id, certificationId)
          .then((response) => {
            // checkbox related changes
            // setReviewData(response)
            // const containsData = isDataexist(updatedReviewItems)
            // const res = containsData ? response : [...reviewItemsData, ...response]
            dispatch(
              fetchReviewItemsSuccess({
                reviewItems: response
              })
            )
            dispatch(
              getReviewItemTotalCount(
                response.length > 0 && response[0].total !== undefined ? response[0].total : 0
              )
            )
            dispatch(updateShowBigLoader(false))
          })
          .catch((error) => {
            console.error(error)
            dispatch(updateShowBigLoader(false))
          })
      }
    } else {
      let payloadSa = {
        campaignId: reviewId,
        filter: filterArray[0]?.id?.type,
        filterValue: datavalue.key,
        userEmail: profileDetails?.mail,
        userRole: 'reviewer',
        pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : getReviewStatus
      }
      let payload = {
        campaignId: reviewId,
        filter: filterArray[0]?.id?.type,
        filterValue: datavalue.key,
        userEmail: profileDetails?.mail,
        pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : getReviewStatus
      }
      const sortingPayloadForMonitor = {
        campaignId: reviewId,
        status: type === 'History' ? getStatus() : getReviewStatus,
        userRole: 'reviewer',
        userEmail: datavalue.key,
        pageSize,
        pageNumber,
        sortBy: sortInfoData.sortKey,
        sortOrder: sortInfoData.isAscending
      }

      if (pageNumber > 0) {
        payloadSa = {
          ...payloadSa
        }
      }

      if (sortInfoData.sortKey !== '' && !isNewAccordion) {
        payloadSa = {
          ...sortInfoData.payload,
          pageNumber
        }
        payload = {
          ...sortInfoData.payload,
          pageNumber
        }
        if (pageNumber > 0 && paginationKeysArray && paginationKeysArray.length > 0) {
          payload = {
            ...payload
          }
        }
        if (isSemiAnnualCampaign) {
          if (isReviewerTabActive) {
            dispatch(fetchReviewerSortStart(payloadSa))
          } else {
            dispatch(fetchMonitorSortStart(sortingPayloadForMonitor))
          }
        } else {
          dispatch(fetchReviewSortStart(payload))
        }
      } else {
        dispatch(updateShowBigLoader(true))
        if (isSemiAnnualCampaign) {
          // updated the API and payload for this as per changes provided from Debarshi
          const payloadForReviewerFilterSa = {
            campaignId: reviewId,
            group: filterArray[0]?.id?.type,
            groupedValue: datavalue.key,
            userEmail: profileDetails?.mail,
            userRole: 'reviewer',
            pageSize,
            pageNumber,
            status: type === 'History' ? getStatus() : getReviewStatus
          }
          reviewApi
            .groupByForReviewerTabExpandSa(
              payloadForReviewerFilterSa,
              userInfo?.id,
              certificationId,
              provisioningRoles
            )
            .then((response) => {
              // dispatch(fetchReviewerdataSuccess({ reviewerData: response }))
              // adding this because it will update the reviewitems useeffect here in this file and data gets loaded
              dispatch(
                fetchReviewItemsSuccess({
                  reviewItems: response
                })
              )
              dispatch(
                getReviewItemTotalCount(
                  response.length > 0 && response[0].total !== undefined ? response[0].total : 0
                )
              )
              dispatch(updateShowBigLoader(false))
            })
            .catch((error) => {
              console.error(error)
              dispatch(updateShowBigLoader(false))
            })
        } else {
          reviewApi
            .filterBy(payload, userInfo?.id, certificationId)
            .then((response) => {
              // checkbox related changes
              // setReviewData(response)
              // const containsData = isDataexist(updatedReviewItems)
              // const res = containsData ? response : [...reviewItemsData, ...response]
              dispatch(
                fetchReviewItemsSuccess({
                  reviewItems: response
                })
              )

              dispatch(
                getReviewItemTotalCount(
                  response.length > 0 && response[0].total !== undefined ? response[0].total : 0
                )
              )
              dispatch(updateShowBigLoader(false))
            })
            .catch((error) => {
              console.error(error)
              dispatch(updateShowBigLoader(false))
            })
        }
      }
    }
    // }
  }
  const onExpandClick = (_item, _index) => {
    dispatch(updateSelectedReviewItems([]))
    setClickedIndex(_index)
    isNewAccordion = true
    // checkbox related changes
    // const isData = isDataexist(updatedReviewItems)
    dispatch(updateGroupByKey(_item))
    dispatch(updatePageSize(10))
    dispatch(updatePagenUmber(0))
    loadtData(_item, false, false)
    setExpandedAccordioKey(_item?.key)
    // expandedAccordionkey = _item?.key
    // checkbox related changes
    // setExpanded(!expanded)
  }

  const handleSearch = async (search) => {
    dispatch(updateShowBigLoader(true))
    dispatch(updateGroupedItemsSearchFlag(true))
    dispatch(updateSearch(search))
    let payload
    if (filterArray.length === 2) {
      payload = {
        campaignId: reviewId,
        searchItem: search,
        status: type === 'History' ? getStatus() : getReviewStatus,
        pageSize,
        pageNumber,
        certType,
        userEmail: item.key,
        userRole: 'reviewer',
        filterBy: filterArray[0].id.type,
        filterByValue: filterArray[0].id.value
      }
    } else {
      payload = {
        campaignId: reviewId,
        searchItem: search,
        status: type === 'History' ? getStatus() : getReviewStatus,
        pageSize,
        pageNumber,
        certType,
        userEmail: item.key,
        userRole: 'reviewer'
      }
    }
    dispatch(fetchGroupByReviewerSearchStart(payload))
  }

  const clearSearchReviewDetais = () => {
    dispatch(updateShowBigLoader(true))
    dispatch(updateGroupedItemsSearchFlag(false))
    dispatch(updateSearch(''))
    if (loadedDataItem && filterArray.length > 0 && clickedIndex === index) {
      loadtData(loadedDataItem, false, true)
    }
    dispatch(updateShowBigLoader(false))
  }

  useEffect(() => {
    dispatch(updatePagenUmber(0))
  }, [pageSize])

  useEffect(() => {
    if (loadedDataItem && filterArray.length > 0 && clickedIndex === index) {
      loadtData(loadedDataItem, true, false)
    }
  }, [noticationMessage])

  useEffect(() => {
    if (loadedDataItem && filterArray.length > 0 && clickedIndex === index) {
      loadtData(loadedDataItem, false, false)
    }
  }, [pageNumber, pageSize])

  useEffect(() => {
    profileAPI.getUserInfo().then((response) => {
      setUserInfo(response)
    })
  }, [])

  const isNullValue = (itemValue) =>
    (groupPageNumber > 0 && itemValue.key === 'nullValue') ||
    (groupPageNumber === 0 && itemValue.doc_count === 0)

  // TODO : As per the ticket #IAMTRVMW-13013 ,commenting the below code to show all the users, if everything works fine we can remove after deployment
  // if (profileDetails?.mail === item.key) {
  //   return null
  // }
  const checkIsMonitor = () => {
    let isExpUserMonitor = false
    // eslint-disable-next-line no-unused-vars
    const actorArray = updatedReviewItems[0].actors.map((actor) => {
      if (
        actor?.mail === expandedAccordionkey &&
        actor?.label &&
        actor?.label.includes('monitor')
      ) {
        isExpUserMonitor = true
      }
      return actor?.mail
    })
    return isExpUserMonitor
  }
  const isSemiAnnualMonitor = () => {
    if (!isSemiAnnualCampaign) {
      return false
    }
    if (isSemiAnnualCampaign && !isReviewerTabActive) {
      if (updatedReviewItems.length > 0) {
        return checkIsMonitor()
      }
      return false
    }
    return false
  }
  const getTabledata = () =>
    updatedReviewItems && updatedReviewItems.length > 0 ? (
      <ReviewTable
        key={item.key}
        rows={updatedReviewItems}
        search={data.search}
        columns={data.columns}
        hasPagination
        paginationSizes={data.paginationSizes}
        hasSortableColumns={data.hasSortableColumns}
        initialSortColumnId={data.initialSortColumnId}
        metadata={metadata}
        total={updatedReviewItems[0].total}
        isGroupPagination
        certification={certType}
        isReviewerTabActive={isReviewerTabActive}
      />
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
    )
  return !isNullValue(item) ? (
    <Accordion
      key={item.key}
      headers={[
        // checkbox related changes
        // <MultipleSelectCheckbox
        //   reviewData={reviewItemsData}
        //   arrayOfGroup={arrayOfGroup}
        //   index={index}
        //   expanded={expanded}
        // />,
        item.key,
        `${item.doc_count} user entitlements`
      ]}
      itemId={item.key}
      // expanded={expanded}
      onLoadData={() => {
        onExpandClick(item, index)
      }}
      isMonitor={isMonitor}
      index={index}
    >
      {filterData.currentFilter === 'Reviewer' &&
        isSemiAnnualCampaign &&
        !isSemiAnnualMonitor() && (
          <Styled.TableOptionsWrapper>
            <MSearchBox
              onSearchCallback={handleSearch}
              placeholder="Search"
              onClearCallback={clearSearchReviewDetais}
              type="Group By Reviewer Table"
            />
          </Styled.TableOptionsWrapper>
        )}
      {!isSemiAnnualMonitor() ? (
        getTabledata()
      ) : (
        <div
          style={{
            textAlign: 'center',
            padding: '10px',
            backgroundColor: '#FFF',
            fontSize: '16px'
          }}
        >
          <span>Not Authorised to view another Monitors Records</span>
        </div>
      )}
    </Accordion>
  ) : (
    ''
  )
}

export default GroupReviewsTableItem
