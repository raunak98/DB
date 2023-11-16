import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation, useHistory } from 'react-router-dom'
import { findDomain } from 'helpers/strings'
import translate from 'translations/translate'
import * as profileAPI from 'api/profile'
import {
  applicationNamePrefix,
  checkProvisioningValidation,
  checkModifiedValidation
} from 'helpers/utils'
import Dropdown from '../../../components/dropdown'
import EllipsisMenu from '../../../components/ellipsisMenu'
import GenericModal from '../../../components/genericModal'
import ReviewSendEmail from './SendEmail'
import ReviewForward from './Forward'
import AllowExceptions from './AllowExceptions'
import * as accountApi from '../../../api/accountManagement'
import * as adGroupApi from '../../../api/groupManagement'

import axios from '../../../axios'
import {
  isRowSelected,
  selectReviewItems,
  selectSortInfoData,
  selectApplyFilters,
  selectFilterData,
  selectReviewPageSize,
  selectSeach,
  selectReviewPageNumber,
  selectPaginationKeys,
  selectCampaignInfo,
  selectSelectedReviewItems,
  selectUpdateIsReviewerTabActive,
  selectIsSemiAnnualCampaign
} from '../../../redux/review/review.selector'
import {
  selectProvisioningRoles,
  selectProfileDetailsSelector
} from '../../../redux/profile/profile.selector'
import { selectGroupAssetsItems } from '../../../redux/myAssets/myAssets.selector'
// import * as adGroupApi from '../../../api/groupManagement'
import { getApiAction } from '../../../helpers/table'
import ActionModal from './ActionModal'
import * as reviewApi from '../../../api/review'
import { notificationMessageStrings } from '../../../helpers/language'
import {
  updateShowBigLoader,
  fetchReviewSortStart,
  fetchReviewerSortStart,
  fetchMonitorSortStart,
  updateReviewItemsStart,
  updateReviewNotificationMessage,
  updateShowSmallLoader,
  fetchReviewFilterStart,
  fetchReviewItemsStart,
  fetchReviewItemsSuccess,
  updateSelectedReviewItems,
  getReviewItemTotalCount,
  fetchReviewerdataStart
} from '../../../redux/review/review.action'

const ReviewDropbox = ({
  columnMetaData,
  reviewId,
  permission,
  type,
  data,
  isDisabled,
  reviewActors,
  dataType,
  moduleType,
  groupId,
  certificationDesc
}) => {
  const [modalType, setModalType] = useState()
  const [open, setOpen] = useState(false)
  const [certification, setCertification] = useState('')
  // const { id } = useParams()
  const location = useLocation()
  const id = location?.state?.id
  const dispatch = useDispatch()
  const history = useHistory()
  const reviewItems = useSelector(selectReviewItems)

  // Get selected review items
  const selectedReviewItems = useSelector(selectSelectedReviewItems)

  const [updatedReviewItems, setUpdatedReviewItems] = useState([])
  const isSelected = useSelector(isRowSelected)
  const sortInfoData = useSelector(selectSortInfoData)
  const filterArray = useSelector(selectApplyFilters)
  const filterData = useSelector(selectFilterData)
  const pageSize = useSelector(selectReviewPageSize)
  const pageNumber = useSelector(selectReviewPageNumber)
  const isReviewerTabActiveSelector = useSelector(selectUpdateIsReviewerTabActive)
  const paginationKeysArray = useSelector(selectPaginationKeys)
  const campaignInfo = useSelector(selectCampaignInfo)
  const isSemiAnnualCampaign = useSelector(selectIsSemiAnnualCampaign)
  const selectedGroup = useSelector(selectGroupAssetsItems)
  const profile = useSelector(selectProfileDetailsSelector)
  const [loading, setLoading] = React.useState(false)
  const [columnData, setcolumnData] = React.useState([])
  const timer = React.useRef
  const search = useSelector(selectSeach)
  const profileDetails = useSelector(selectProfileDetailsSelector)
  const provisioningRoles = useSelector(selectProvisioningRoles)
  const getStatus = () =>
    localStorage.getItem('historyStatus') === 'complete'
      ? 'signed-off,expired,cancelled'
      : 'expired'

  useEffect(() => {
    if (selectedReviewItems?.length !== 0) {
      const updatedItems = reviewItems.map((reviewItem) => {
        // Checking if we have already selected item
        const checkedItem = selectedReviewItems.find(
          (selectedReviewItem) => selectedReviewItem.id === reviewItem.id
        )
        return checkedItem ? { ...reviewItem, checked: true } : reviewItem
      })
      setUpdatedReviewItems([...updatedItems])
    } else {
      setUpdatedReviewItems([...reviewItems])
    }
  }, [reviewItems])
  const noCsvRecords = translate('review.exportCsv.noRecords')
  const uniqueReqError = translate('request.unique.errormessage')
  const blockMemebership = translate('block.membership')
  const unblockMemebership = translate('unblock.membership')
  const blockModifyDelete = translate('block.ModifyDelete')
  const unblockModifyDelete = translate('unblock.ModifyDelete')

  const accountName = translate('metaData.AccountName')
  const accountDomain = translate('metaData.AccountDomain')
  const groupName = translate('metaData.GroupName')
  const groupDomain = translate('metaData.GroupDomain')
  const membershipAction = translate('review.action')
  const businessJustification = translate('metaData.BusinessJustification')

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const checkGroupUniqueRequest = async () => {
    setLoading(true)
    let distinguishedName

    if (selectedGroup && Object.keys(selectedGroup).length !== 0 && moduleType === 'ModifyGroup') {
      const selected = selectedGroup?.groupData?.filter((resp) => resp.id === reviewId)
      if (selected.length) {
        distinguishedName =
          // eslint-disable-next-line no-underscore-dangle
          selected[0]?.groupDetails?._source?.igaContent?.distinguishedName
      }
    }
    const payload = {
      targetFilter: {
        operator: 'AND',
        operand: [
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'decision.status',
              targetValue: 'in-progress'
            }
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.isDraft',
              targetValue: false
            }
          },
          {
            operator: 'OR',
            operand: [
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.operation',
                  targetValue: 'Amend'
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.operation',
                  targetValue: 'Delete'
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.operation',
                  targetValue: 'Add Membership'
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.operation',
                  targetValue: 'Remove Membership'
                }
              }
            ]
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.category',
              targetValue: 'AD Group'
            }
          },
          {
            operator: 'EQUALS',
            operand: {
              targetName: 'request.common.applicationName',
              targetValue: `${applicationNamePrefix}${findDomain(distinguishedName)}`
            }
          },
          {
            operator: 'OR',
            operand: [
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.groupDetails.distinguishedName',
                  targetValue: distinguishedName
                }
              },
              {
                operator: 'EQUALS',
                operand: {
                  targetName: 'request.common.groupDetails.distinguishedName',
                  targetValue: distinguishedName
                }
              }
            ]
          }
        ]
      }
    }
    const resp = await accountApi.validateUniqueRequest(payload)
    setLoading(false)
    if (resp?.result?.length > 0) {
      return false
    }
    return true
  }
  const checkForFilter = async (_id) => {
    const userInfo = await profileAPI.getUserInfo()
    if (filterArray.length > 0) {
      let payload = {
        campaignId: _id,
        filter: filterArray[0].id.type,
        filterValue: filterArray[0].id.value,
        pageSize,
        pageNumber,
        status: type === 'History' ? getStatus() : 'in-progress'
      }
      if (pageNumber > 0) {
        const paginationKey = paginationKeysArray.slice(-1)[0]
        payload = {
          ...payload,
          search_after_primaryKey: paginationKey
        }
      }
      if (filterArray.length === 2) {
        if (isReviewerTabActiveSelector) {
          const filterAndGroupByForReviewer = {
            campaignId: _id,
            status: type === 'History' ? getStatus() : 'in-progress',
            pageSize,
            pageNumber,
            filterBy: filterArray[0].id.type,
            filterByValue: filterArray[0].id.value,
            userRole: 'reviewer',
            userEmail: profileDetails?.mail,
            group: filterArray[1].id.type,
            groupedValue: filterData.groupByValue
          }
          reviewApi
            .postFilterAndGroupByDataSa(
              filterAndGroupByForReviewer,
              userInfo?.id,
              certification,
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
          const filterAndGroupByForMonitor = {
            campaignId: _id,
            status: type === 'History' ? getStatus() : 'in-progress',
            pageSize,
            pageNumber,
            filterBy: filterArray[0].id.type,
            filterByValue: filterArray[0].id.value,
            userRole: 'reviewer',
            userEmail: filterData.groupByValue
          }
          reviewApi
            .postFilterAndGroupByMonitorDataSa(
              filterAndGroupByForMonitor,
              userInfo?.id,
              certification,
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
      } else if (filterData.currentFilter === 'All') {
        dispatch(fetchReviewFilterStart(payload))
      }
    } else if (search !== '') {
      const payload = {
        campaignId: _id,
        searchItem: search,
        pageSize,
        pageNumber,
        status: dataType === 'History' ? getStatus() : 'in-progress',
        certType: certification
      }
      const semiAnnualSearchPayload = {
        campaignId: _id,
        searchItem: search,
        status: dataType === 'History' ? getStatus() : 'in-progress',
        pageSize,
        pageNumber,
        certType: certification,
        userEmail: profileDetails?.mail,
        userRole: 'reviewer'
      }
      let resp
      if (isSemiAnnualCampaign) {
        resp = await reviewApi.searchByReviewerSa(
          semiAnnualSearchPayload,
          userInfo.id,
          certification,
          provisioningRoles
        )
      } else {
        resp = await reviewApi.searchBy(payload, userInfo.id, certification)
      }
      dispatch(
        fetchReviewItemsSuccess({
          reviewItems: resp
        })
      )
    } else {
      const loggedInUserEmail = localStorage.getItem('loggedInUserEmail')

      const reviewerPayload = {
        campaignId: id,
        status: type === 'History' ? getStatus() : 'in-progress',
        userEmail: loggedInUserEmail || profileDetails?.mail,
        userRole: 'reviewer',
        pageSize,
        pageNumber
      }
      if (isSemiAnnualCampaign && isReviewerTabActiveSelector) {
        dispatch(fetchReviewerdataStart(reviewerPayload))
      } else {
        dispatch(fetchReviewItemsStart(id))
      }
    }
  }

  const handleRevoke = (reviewDataId) => {
    const reviewData = []
    reviewData.push({
      id: reviewDataId,
      comments: [{ action: 'comment', comment: 'Revoke' }],
      decision: 'revoke'
    })
    const payload = {
      items: reviewData
    }
    if (payload.items.length > 1) {
      dispatch(updateShowBigLoader(true))
    } else {
      dispatch(updateShowSmallLoader(true))
    }
    reviewApi
      .reviewActions('revoke', id, payload) // Need to change to .reviewAction('comment', id, payload)
      .then((res) => {
        const isReviewIdSelected = selectedReviewItems.filter((item) => item.id === reviewId)

        if (isReviewIdSelected.length !== 0) {
          const otherReviewItems = selectedReviewItems.filter((item) => item.id !== reviewId)

          dispatch(
            updateSelectedReviewItems([
              ...otherReviewItems,

              { ...isReviewIdSelected[0], status: 'revoke' }
            ])
          )
        }
        if (sortInfoData.sortKey !== '') {
          if (isSemiAnnualCampaign) {
            if (isReviewerTabActiveSelector) {
              dispatch(fetchReviewerSortStart(sortInfoData.payload))
            } else {
              dispatch(fetchMonitorSortStart(sortInfoData.payload))
            }
          } else {
            dispatch(fetchReviewSortStart(sortInfoData.payload))
          }
        } else {
          checkForFilter(id)
        }
        if (res.status === 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: notificationMessageStrings.REVOKE_SUCESS
            })
          )
        }
      })
      .catch((err) => {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: `${err}`
          })
        )
      })
  }

  const callDecisionApi = (action, reviewDataId) => {
    dispatch(updateShowBigLoader(true))
    const item = []
    item.push({
      id: reviewDataId,
      comments:
        action === 'not-applicable'
          ? [{ action: 'comment', comment: 'Not-Applicable' }]
          : [
              {
                action: 'comment',
                comment: certification === 'ISA_WIN_UNIX_DB' ? 'ISA' : 'Maintain'
              }
            ],
      decision: action === 'not-applicable' ? 'revoke' : 'certify'
    })

    const payload = {
      items: item
    }
    // Call Certify API Call
    const apiToCall = action === 'not-applicable' ? 'revoke' : 'certify'
    reviewApi
      .reviewActions(apiToCall, id, payload)
      .then((res) => {
        const isReviewIdSelected = selectedReviewItems.filter(
          (selectedItem) => selectedItem.id === reviewId
        )
        if (isReviewIdSelected.length !== 0) {
          const otherReviewItems = selectedReviewItems.filter(
            (selectedItem) => selectedItem.id !== reviewId
          )
          dispatch(
            updateSelectedReviewItems([
              ...otherReviewItems,
              {
                ...isReviewIdSelected[0],
                status: action === 'not-applicable' ? 'revoke' : 'certify'
              }
            ])
          )
        }
        if (sortInfoData.sortKey !== '') {
          if (isSemiAnnualCampaign) {
            if (isReviewerTabActiveSelector) {
              dispatch(fetchReviewerSortStart(sortInfoData.payload))
            } else {
              dispatch(fetchMonitorSortStart(sortInfoData.payload))
            }
          } else {
            dispatch(fetchReviewSortStart(sortInfoData.payload))
          }
        } else {
          checkForFilter(id)
        }
        if (res.status === 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message:
                action === 'not-applicable'
                  ? notificationMessageStrings.REVIEW_ENTRY_SUCESS
                  : notificationMessageStrings.ACCESS_MAINTAIN_SUCCESS
            })
          )
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }

  const callDbDecisions = (action, reviewDataId) => {
    dispatch(updateShowBigLoader(true))
    const item = []
    item.push({
      id: reviewDataId,
      comments: [
        {
          action: 'comment',
          comment: action === 'EUA' ? 'End-User Account' : action
        }
      ],
      decision: 'certify'
    })

    const payload = {
      items: item
    }

    reviewApi
      .reviewActions('certify', id, payload)
      .then(() => {
        const isReviewIdSelected = selectedReviewItems.filter(
          (selectedItem) => selectedItem.id === reviewId
        )
        if (isReviewIdSelected.length !== 0) {
          const otherReviewItems = selectedReviewItems.filter(
            (selectedItem) => selectedItem.id !== reviewId
          )
          dispatch(
            updateSelectedReviewItems([
              ...otherReviewItems,
              { ...isReviewIdSelected[0], status: 'certify' }
            ])
          )
        }
        dispatch(
          updateReviewNotificationMessage({
            type: 'Success',
            message: notificationMessageStrings.REVIEW_ENTRY_SUCESS
          })
        )
        if (sortInfoData.sortKey !== '') {
          if (isSemiAnnualCampaign) {
            if (isReviewerTabActiveSelector) {
              dispatch(fetchReviewerSortStart(sortInfoData.payload))
            } else {
              dispatch(fetchMonitorSortStart(sortInfoData.payload))
            }
          } else {
            dispatch(fetchReviewSortStart(sortInfoData.payload))
          }
        } else {
          checkForFilter(id)
        }
      })
      .catch((err) => {
        console.error(err)
      })
  }
  const doApiCall = (reviewDataId, action) => {
    if (['maintain', 'not-applicable'].includes(action)) {
      callDecisionApi(action, reviewDataId)
    } else {
      callDbDecisions(action.toUpperCase(), reviewDataId)
    }
  }

  const doAction = (action) => {
    if (
      ['maintain', 'revoke', 'eua', 'aaa', 'asa', 'isa', 'yes', 'not-applicable'].includes(action)
    ) {
      if (action === 'revoke') {
        handleRevoke(reviewId)
      } else {
        doApiCall(reviewId, action)
      }
    }
  }

  const onCallback = () => {
    if (!loading) {
      setLoading(true)
      timer.current = window.setTimeout(() => {
        setLoading(false)
      }, 2000)
    }
  }

  const csvmaker = (dat, operation) => {
    const csvRows = []
    let headers
    if (operation === 'exportmembership') {
      headers = [groupName, groupDomain, accountName, accountDomain]
    } else {
      headers = [
        groupName,
        groupDomain,
        accountName,
        accountDomain,
        membershipAction,
        businessJustification
      ]
    }

    csvRows.push(headers.join(','))
    dat?.forEach((elm) => {
      const values = headers.map((header) => {
        let val = ''
        const headerName = header.split(' ').join('')

        // val = elm[header] ? elm[header] : ''
        val = elm[headerName] ? elm[headerName] : ''
        return `"${val}"`
      })
      csvRows.push(values.join(','))
    })
    return csvRows.join('\n')
  }
  const getCurrentDate = () => {
    const padto2Digits = (num) => num.toString().padStart(2, '0')
    const date = new Date()
    const currentDate = `${padto2Digits(date.getDate())}${padto2Digits(date.getMonth() + 1)}${date
      .getFullYear()
      .toString()
      .substr(-2)}${padto2Digits(date.getHours())}${padto2Digits(date.getMinutes())}`
    return currentDate
  }
  const download = (dat, err, operation) => {
    const blob = new Blob([dat], { type: 'text/csv' })
    const url1 = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.setAttribute('href', url1)
    const date = getCurrentDate()
    a.setAttribute(
      'download',
      err
        ? `errors_${date}`
        : iff(
            operation === 'exportmembership',
            `ExportMembership.csv`,
            `RevokeMembershipExport.csv`
          )
    )

    a.click()
    dispatch(updateShowBigLoader(false))
  }
  const downloadCSV = async (normalizedData, operation) => {
    const csvdata = csvmaker(normalizedData, operation)
    download(csvdata, false, operation)
  }

  const callModify = (requestJustification, groupDetailsObject) => {
    const adGroupDetails = {}
    // eslint-disable-next-line no-underscore-dangle
    const distinguishedName = data?.groupDetails?._source?.igaContent?.distinguishedName
    const commonObject = {
      applicationName: `${applicationNamePrefix}${findDomain(distinguishedName)}`,
      // eslint-disable-next-line no-underscore-dangle
      groupDN: data?.groupDetails?._source?.igaContent?.distinguishedName,
      Accessio_Request_No: '',
      requestorMail: profile.mail,
      category: 'AD Group',
      operation: 'Amend',
      isDraft: false,
      requestJustification
    }
    // const groupDetailsObject = {}
    // groupDetailsObject.dbagModifiedby = selected === 'blockmodifydelete' ? 'Descoped' : '169700-1'
    adGroupDetails.common = commonObject
    adGroupDetails.common.groupDetails = groupDetailsObject
    setLoading(true)
    adGroupApi
      .modifyAdGroup(adGroupDetails)
      .then((res) => {
        if (res?.status === 200) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Success',
              message: 'modify.group.success.message'
            })
          )
          history.push(`/history/requestHistory`)
        } else {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: 'request.error.message'
            })
          )
        }
        setLoading(false)
      })
      .catch(() => {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: 'request.error.message'
          })
        )
        setLoading(false)
      })
  }

  const onChange = async (selectedOptionId) => {
    if (isDisabled) {
      setOpen(false)
    }
    const selected = selectedOptionId.toLowerCase()
    const reviews = updatedReviewItems.map((e) => {
      if (e.id === reviewId) {
        if (e.action === modalType) {
          e.action = null
        } else {
          e.action = modalType
        }
      }
      return e
    })
    dispatch(updateReviewItemsStart([...reviews]))
    setModalType(selected)
    /* eslint-disable no-underscore-dangle */
    if (selected === 'addmembership') {
      history.push(
        `/requests/request/adGroupMembership/addOrRemove?groupName=${data?.groupDetails?._source?.igaContent?.displayName}`
      )
    } else if (selected === 'linkforrequesthistory') {
      history.push({
        pathname: `/my-asset/historicalRequestHistory`,
        state: { dataItem: data }
      })
    } else if (
      [
        'reassign',
        'email',
        'forward',
        'allowexceptions',
        'transferownership',
        'linkformembership'
      ].includes(selected)
    ) {
      if (selected === 'transferownership') {
        if (!(await checkGroupUniqueRequest())) {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: uniqueReqError
            })
          )
        } else {
          setOpen(true)
        }
      } else {
        setOpen(true)
      }
    } else if (selected === 'exportmembership') {
      let groupDN
      if (
        selectedGroup &&
        Object.keys(selectedGroup).length !== 0 &&
        moduleType === 'ModifyGroup'
      ) {
        const selectedData = selectedGroup?.groupData?.filter((resp) => resp.id === reviewId)
        if (selectedData.length) {
          groupDN =
            // eslint-disable-next-line no-underscore-dangle
            selectedData[0]?.groupDetails?._source?.igaContent?.distinguishedName
        }
      }
      const exportMembership = await axios
        .get(`/v0/governance/getAdGroupMembers?groupDn=${groupDN}`)
        .then((res) => {
          let result = []
          if (res?.status === 200) {
            if (Array.isArray(res?.data) && res?.data.length > 0) {
              result = res?.data?.map((item) => ({
                AccountName: item.dn ? item.dn.split(',')[0].split('=')[1] : '',
                AccountDomain: item.dn ? findDomain(item.dn) : '',
                GroupName: item.grpDn ? item.grpDn.split(',')[0].split('=')[1] : '',
                GroupDomain: item.grpDn ? findDomain(item.grpDn) : ''
              }))
            } else if (Object.keys(res?.data).length > 0) {
              result = [
                {
                  AccountName: res.data.dn ? res.data.dn.split(',')[0].split('=')[1] : '',
                  AccountDomain: res.data.dn ? findDomain(res.data.dn) : '',
                  GroupName: res.data.grpDn ? res.data.grpDn.split(',')[0].split('=')[1] : '',
                  GroupDomain: res.data.grpDn ? findDomain(res.data.grpDn) : ''
                }
              ]
            }
          } else if (res?.status === 204) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: `${noCsvRecords}`
              })
            )
          }

          return result
        })
        .catch((err) => err)
      if (exportMembership?.length !== 0) {
        downloadCSV(exportMembership, selected)
      }
    } else if (selected === 'revokemembershipexport') {
      let selectedGroupName
      if (
        selectedGroup &&
        Object.keys(selectedGroup).length !== 0 &&
        moduleType === 'ModifyGroup'
      ) {
        const selectedData = selectedGroup?.groupData?.filter((resp) => resp.id === reviewId)
        if (selectedData.length) {
          selectedGroupName =
            // eslint-disable-next-line no-underscore-dangle
            selectedData[0]?.groupDetails?._source?.igaContent?.cn
        }
      }
      const revokeMembershipExport = await axios
        .get(
          `v0/governance/getRevokedGroupMembership?groupName=${selectedGroupName}&email=${profile.mail}`
        )
        .then((res) => {
          let result = []
          if (res?.status === 200) {
            if (Array.isArray(res?.data) && res?.data.length > 0) {
              result = res?.data?.map((item) => ({
                GroupName: item.groupName ? item.groupName : '',
                GroupDomain: item.groupDomain ? item.groupDomain : '',
                AccountName: item.accountName ? item.accountName : '',
                AccountDomain: item.accountDomain ? item.accountDomain : '',
                Action: item.action ? item.action : '',
                BusinessJustification: item.justification ? item.justification : ''
              }))
            } else if (Object.keys(res?.data).length > 0) {
              result = [
                {
                  GroupName: res.data.groupName ? res.data.groupName : '',
                  GroupDomain: res.data.groupDomain ? res.data.groupDomain : '',
                  AccountName: res.data.accountName ? res.data.accountName : '',
                  AccountDomain: res.data.accountDomain ? res.data.accountDomain : '',
                  Action: res.data.action ? res.data.action : '',
                  BusinessJustification: res.data.justification ? res.data.justification : ''
                }
              ]
            }
          } else if (res?.status === 204) {
            dispatch(
              updateReviewNotificationMessage({
                type: 'Success',
                message: `${noCsvRecords}`
              })
            )
          }

          return result
        })
        .catch((err) => err)
      if (revokeMembershipExport?.length !== 0) {
        downloadCSV(revokeMembershipExport, selected)
      }
    } else if (['blockmembership', 'unblockmembership'].includes(selected)) {
      const uniqueRequest = await checkGroupUniqueRequest()
      if (uniqueRequest) {
        const requestJustification =
          selected === 'blockmembership' ? `${blockMemebership}` : `${unblockMemebership}`
        const groupDetailsObject = {}
        groupDetailsObject.dbagProvisioningBy =
          selected === 'blockmembership' ? 'Descoped' : '169700-1'
        callModify(requestJustification, groupDetailsObject)
      } else {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: uniqueReqError
          })
        )
      }
    } else if (['blockmodifydelete', 'unblockmodifydelete'].includes(selected)) {
      const uniqueRequest = await checkGroupUniqueRequest()
      if (uniqueRequest) {
        const requestJustification =
          selected === 'blockmodifydelete' ? `${blockModifyDelete}` : `${unblockModifyDelete}`
        const groupDetailsObject = {}
        groupDetailsObject.dbagModifiedBy =
          selected === 'blockmodifydelete' ? 'Descoped' : '169700-1'
        callModify(requestJustification, groupDetailsObject, 'blockUnblockmodifydelete')
      } else {
        dispatch(
          updateReviewNotificationMessage({
            type: 'Error',
            message: uniqueReqError
          })
        )
      }
    } else {
      doAction(selected)
    }
    onCallback()
  }

  const closeModal = (value) => {
    setOpen(value)
  }

  const getModalType = () => {
    switch (modalType) {
      case 'email':
        return <ReviewSendEmail closeModal={setOpen} />
      case 'reassign':
        return (
          <ActionModal
            closeModal={closeModal}
            reviewSelectedId={[reviewId]}
            reviewActors={reviewActors}
            type={moduleType}
          />
        )
      case 'transferownership':
        return (
          <ActionModal
            closeModal={closeModal}
            reviewSelectedId={[groupId]}
            reviewActors={reviewActors}
            type={modalType}
          />
        )
      case 'linkformembership':
        return (
          <>
            <p>
              {`${window?.location?.origin}/requests/request/adGroupMembership/addOrRemove?groupName=${data?.groupDetails?._source?.igaContent?.displayName}`}
            </p>
          </>
        )

      case 'forward':
        return (
          <ReviewForward
            closeModal={closeModal}
            data={data}
            reviewSelectedId={[reviewId]}
            type="forward"
          />
        )
      case 'allowexceptions':
        return (
          <AllowExceptions
            closeModal={closeModal}
            reviewId={reviewId}
            type={dataType}
            onCallback={onCallback}
          />
        )
      default:
        return null
    }
  }

  React.useEffect(() => {
    if (campaignInfo) {
      setCertification(campaignInfo?.description)
    }
  }, [updatedReviewItems])

  React.useEffect(() => {
    if (columnMetaData && columnMetaData?.properties?.options) {
      let isApprover = false
      let groupOwner = false
      if (
        data?.groupDetails?._source?.igaContent?.dbagIMSApprovers &&
        data?.groupDetails?._source?.igaContent?.dbagIMSApprovers.includes(profileDetails?.mail)
      ) {
        isApprover = true
      }
      if (
        (data?.groupDetails?._source?.igaContent?.object?.dbagIMSAuthContact &&
          data?.groupDetails?._source?.igaContent?.object?.dbagIMSAuthContact ===
            profileDetails?.mail) ||
        (data?.groupDetails?._source?.igaContent?.object?.dbagIMSAuthContactDelegate &&
          data?.groupDetails?._source?.igaContent?.object?.dbagIMSAuthContactDelegate ===
            profileDetails?.mail)
      ) {
        groupOwner = true
      }
      let result
      let modofiedResult
      if (
        ![''].includes(data?.groupDetails?._source?.igaContent?.object?.dbagProvisioningBy) &&
        data?.groupDetails?._source?.igaContent?.object?.dbagProvisioningBy === 'Descoped'
      ) {
        result = 'Unblock'
      } else {
        result =
          ![''].includes(data?.groupDetails?._source?.igaContent?.object?.dbagProvisioningBy) &&
          (!data?.groupDetails?._source?.igaContent?.object?.dbagProvisioningBy
            ? checkProvisioningValidation('null')
            : checkProvisioningValidation(
                data?.groupDetails?._source?.igaContent?.object?.dbagProvisioningBy
              ))
      }
      if (
        ![''].includes(data?.groupDetails?._source?.igaContent?.object?.dbagModifiedBy) &&
        data?.groupDetails?._source?.igaContent?.object?.dbagModifiedBy === 'Descoped'
      ) {
        modofiedResult = 'Unblock'
      } else {
        modofiedResult =
          ![''].includes(data?.groupDetails?._source?.igaContent?.object?.dbagModifiedBy) &&
          (!data?.groupDetails?._source?.igaContent?.object?.dbagModifiedBy
            ? checkModifiedValidation('null')
            : checkModifiedValidation(
                data?.groupDetails?._source?.igaContent?.object?.dbagModifiedBy
              ))
      }
      let updateColumnData = columnMetaData?.properties?.options

      if (result === 'Unblock') {
        updateColumnData = updateColumnData.filter((item) => item.id !== 'blockMembership')
      } else {
        updateColumnData = updateColumnData.filter((item) => item.id !== 'unblockMembership')
      }

      if (modofiedResult === 'Unblock') {
        updateColumnData = updateColumnData.filter((item) => item.id !== 'blockModifyDelete')
      } else {
        updateColumnData = updateColumnData.filter((item) => item.id !== 'unblockModifyDelete')
      }
      if (isApprover && groupOwner !== true) {
        updateColumnData = updateColumnData.filter(
          (item) =>
            ![
              'blockModifyDelete',
              'unblockModifyDelete',
              'unblockMembership',
              'blockMembership',
              'transferOwnership'
            ].includes(item.id)
        )
      }

      setcolumnData(updateColumnData)
    }
  }, [columnMetaData])
  return (
    <>
      {open && <GenericModal setOpen={setOpen}>{getModalType()}</GenericModal>}
      {type === 'longMenu' ? (
        <EllipsisMenu
          placeholder={columnMetaData.header.text}
          disabled={isDisabled}
          options={columnData.map((option) => ({
            label: option.id,
            value: option.id ? option.id : '',
            isDisabled:
              !['GroupAdmin', 'ModifyGroup', 'IndirectlyOwnedGroup'].includes(moduleType) &&
              permission[getApiAction(option.id)] !== undefined
                ? permission[getApiAction(option.id)]
                : false
          }))}
          onChangeCallback={onChange}
          certification={certification || certificationDesc}
        />
      ) : (
        <Dropdown
          disabled={isSelected}
          selected={modalType}
          placeholder={columnMetaData.properties.placeholderId} // translate(),
          options={columnMetaData.properties.options.map((option) => ({
            label: option.id, // translate(),
            value: option.id,
            isDisabled:
              permission[getApiAction(option.id)] !== undefined
                ? !permission[getApiAction(option.id)]
                : false
          }))}
          onChangeCallback={onChange}
        />
      )}
    </>
  )
}

ReviewDropbox.defaultProps = {}

export default React.memo(ReviewDropbox)
