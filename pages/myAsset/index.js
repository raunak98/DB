import React, { useState, useEffect } from 'react'

import { Link, useHistory } from 'react-router-dom'
import { Button, Grid, Box, Tabs, Tab, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useSelector, useDispatch } from 'react-redux'
import CircularProgress from '@mui/material/CircularProgress'
import { blue } from '@mui/material/colors'
import { defineColumns, defineRows } from 'helpers/arrays'
import { generateOptions } from 'helpers/table'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import MSearchBox from 'components/mSearchBox'
import { getPersonalAssetsByMail, applicationNamePrefix } from 'helpers/utils'
import { findDomain } from 'helpers/strings'
import GenericModal from 'components/genericModal'
import * as assetsApi from '../../api/assetsManagement'
import * as profileAPI from '../../api/profile'
import * as accountApi from '../../api/accountManagement'
import * as adGroupApi from '../../api/groupManagement'
import AssetTable from '../../pageComponents/Assets/MyAssetTable'
import { selectNotificationMessage } from '../../redux/review/review.selector'
import { selectAccountTypeItems } from '../../redux/dashboard/dashboard.selector'
import { fetchAccountTypeItemsSuccess } from '../../redux/dashboard/dashboard.action'
import * as Styled from './style'
import Loading from '../../components/loading'
import GRIDTable from './GRIDTable'
import GroupTable from './GroupTable'
import IndirectlyOwnedGroupTable from './IndirectlyOwnedGroupTable'
import { updateReviewNotificationMessage } from '../../redux/review/review.action'
import {
  selectShowBigLoader,
  selectShowSmallLoader,
  selectMyAssetsItems,
  selectPerosnalAssetsMetadata,
  isMyAssetsFetching,
  selectAssetsPageNumber,
  selectAssetsPageSize,
  selectMyAssetsSortInfoData,
  selectAssetsGroupPageSize,
  selectAssetsGroupPageNumber,
  selectGroupAssetsItems
} from '../../redux/myAssets/myAssets.selector'

import {
  fetchMyAssetsItemsStart,
  fetchMyAssetsItemsSuccess,
  fetchPersonalAssetsMetadataStart,
  updateShowBigLoader,
  updateAssetsIsGoingForwardFlag,
  updateAssetsPaginationKeys,
  updateAssetsPageSize,
  updateAssetsPageNumber,
  fetchMyAssetsSearchStart,
  fetchMyAssetsSortStart,
  fetchGroupAssetsItemsStart,
  updateAssetsGroupIsGoingForwardFlag,
  updateAssetsGroupPaginationKeys,
  updateAssetGroupsPageSize,
  updateAssetsGroupPageNumber,
  fetchMyGroupAssetsSearchStart
} from '../../redux/myAssets/myAssets.action'
import { selectProfileDetailsSelector } from '../../redux/profile/profile.selector'

// This function use to get UI for Tab Panels
function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      style={{ width: '100%' }}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const MyAsset = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const history = useHistory()
  const accountTypeItems = useSelector(selectAccountTypeItems)
  // Get My Assets records from redux
  const results = useSelector(selectMyAssetsItems)
  const getNotificationMessage = useSelector(selectNotificationMessage)
  const modifyMeta = useSelector(selectPerosnalAssetsMetadata)
  const isFetching = useSelector(isMyAssetsFetching)
  const showBigLoader = useSelector(selectShowBigLoader)
  const showSmallLoading = useSelector(selectShowSmallLoader)
  const pageNumber = useSelector(selectAssetsPageNumber)
  const pageSize = useSelector(selectAssetsPageSize)
  const pageSizeGroup = useSelector(selectAssetsGroupPageSize)
  const pageNumberGroup = useSelector(selectAssetsGroupPageNumber)
  const sortInfoData = useSelector(selectMyAssetsSortInfoData)
  const profile = useSelector(selectProfileDetailsSelector)
  const groupAssetsItems = useSelector(selectGroupAssetsItems)

  const transferOwnershipErrorMsg = translate('myAssets.certify.failure')
  const transferOwnershipSuccessMsg = translate('myAssets.certify.success')

  const [modifyTabs, setModifyTabs] = useState([])
  const [value, setValue] = useState(0)
  const [userInfo, setUserInfo] = useState({})
  const [signOffModal, setSignOffModal] = useState(false)
  const [actionCount, setActionCount] = useState(0)
  const [dataToCertify, setDataToCertify] = useState([])

  const [initialData, setInitialData] = useState({
    columns: [],
    rows: [],
    paginationSizes: undefined,
    hasSortableColumns: false,
    initialSortColumnId: '',
    bulkActions: [],
    // Filter by
    filterResultsOptions: [],
    defaultFilterResultsId: 'All',

    // Group by
    groupResultsOptions: [],
    defaultGroupResultsId: 'All',

    // Search
    search: ''
  })

  const showBulkActions = () => {
    if (groupAssetsItems && groupAssetsItems?.groupData?.length > 0) {
      /* eslint no-restricted-syntax: ["error", "FunctionExpression", "WithStatement", "BinaryExpression[operator='in']"] */
      for (const item of groupAssetsItems?.groupData) {
        if (
          item.checked &&
          ['Pending Review', 'Overdue Review and Members Removed', 'Overdue Review'].includes(
            item.status
          )
        ) {
          return true
        }
      }
    }
    return false
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const fetchMyPersonnelAssetData = () => {
    const searchDetails = localStorage.getItem('searchValue')
    if (![null, undefined, ''].includes(searchDetails)) {
      const payload = {
        searchIn: 'MyAssets-PersonalAccounts',
        searchInValue: '_id',
        searchFor: searchDetails,
        pageSize,
        pageNumber
      }

      dispatch(fetchMyAssetsSearchStart(payload))
    } else if (pageNumber > 0) {
      if (sortInfoData.sortKey !== '') {
        let sortPayload = sortInfoData.payload
        sortPayload = {
          ...sortPayload,
          pageSize,
          pageNumber
        }
        dispatch(fetchMyAssetsSortStart(sortPayload))
      } else {
        dispatch(
          fetchMyAssetsItemsStart(getPersonalAssetsByMail(userInfo?.id, pageSize, pageNumber))
        )
      }
    } else {
      profileAPI
        .getUserInfo()
        .then((res) => {
          if (res) {
            setUserInfo(res)
            dispatch(
              fetchMyAssetsItemsStart(getPersonalAssetsByMail(res?.id, pageSize, pageNumber)) // getPersonalAssetsByMail
            )
          }
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  // It will handles the tab change panel view
  const handleChange = (event, newValue) => {
    setValue(newValue)
    if (newValue === 0) {
      dispatch(fetchPersonalAssetsMetadataStart())
      dispatch(updateShowBigLoader(true))
      dispatch(updateAssetsPaginationKeys([]))
      dispatch(updateAssetsIsGoingForwardFlag(true))
      dispatch(updateAssetsPageSize(10))
      dispatch(updateAssetsPageNumber(0))
      fetchMyPersonnelAssetData()
    } else if (newValue === 2) {
      const payload = {
        pageSize: pageSizeGroup,
        userEmail: `${profile.mail}`,
        pageNumber: pageNumberGroup
      }
      dispatch(fetchGroupAssetsItemsStart(payload))
      dispatch(updateShowBigLoader(true))
      dispatch(updateAssetsGroupPaginationKeys([]))
      dispatch(updateAssetsGroupIsGoingForwardFlag(true))
      dispatch(updateAssetGroupsPageSize(10))
      dispatch(updateAssetsGroupPageNumber(0))
    }
  }

  const handleSearch = (search) => {
    localStorage.setItem('searchValue', search)
    let payload = {}
    if (value === 0) {
      dispatch(updateAssetsPageSize(10))
      dispatch(updateAssetsPageNumber(0))
      payload = {
        searchIn: 'MyAssets-PersonalAccounts',
        searchInValue: '_id',
        searchFor: search,
        pageSize,
        pageNumber
      }
      dispatch(updateShowBigLoader(true))
      dispatch(fetchMyAssetsSearchStart(payload))
    } else if (value !== 1) {
      dispatch(updateAssetGroupsPageSize(10))
      dispatch(updateAssetsGroupPageNumber(0))
      payload = {
        searchIn: 'MyAssets-Groups',
        searchInValue: '_id',
        searchFor: search,
        pageSize: pageSizeGroup,
        pageNumber: pageNumberGroup,
        userEmail: `${profile.mail}`
      }
      dispatch(updateShowBigLoader(true))
      dispatch(fetchMyGroupAssetsSearchStart(payload))
    }
  }
  const clearSearch = () => {
    dispatch(updateShowBigLoader(true))
    dispatch(updateAssetsPageNumber(0))
    localStorage.setItem('searchValue', '')
    if (value === 0) {
      dispatch(
        fetchMyAssetsItemsStart(getPersonalAssetsByMail(userInfo?.id, pageSize, pageNumber)) // getPersonalAssetsByMail
      )
    } else if (value === 2) {
      const payload = {
        pageSize: pageSizeGroup,
        userEmail: `${profile.mail}`,
        pageNumber: pageNumberGroup
      }
      dispatch(fetchGroupAssetsItemsStart(payload))
      dispatch(updateShowBigLoader(true))
      dispatch(updateAssetsGroupPaginationKeys([]))
      dispatch(updateAssetsGroupIsGoingForwardFlag(true))
      dispatch(updateAssetGroupsPageSize(10))
      dispatch(updateAssetsGroupPageNumber(0))
    }
  }

  const getType = () => {
    let selectedType = ''
    switch (value) {
      case 0:
        selectedType = 'MyAssets-PersonalAccounts'
        break

      case 1:
        selectedType = 'MyAssets-NonPersonalAccounts'
        break

      case 2:
        selectedType = 'MyAssets-Groups'
        break

      default:
        break
    }
    return selectedType
  }

  useEffect(() => {
    dispatch(updateShowBigLoader(true))
    dispatch(fetchMyAssetsItemsSuccess({ myAssetsItems: {} }))

    if (value === 0) {
      fetchMyPersonnelAssetData()
    }
    dispatch(updateShowBigLoader(false))
  }, [pageNumber, pageSize])

  // To render the table when data is available
  useEffect(() => {
    if (modifyMeta && Object.keys(results)?.length !== 0) {
      const columns = defineColumns(modifyMeta.columns, false, 'Modify')
      const rows = defineRows(modifyMeta.columns, results.assetsData, 'Modify')

      const filterResultsOptions = generateOptions(modifyMeta.filterBy, modifyMeta.initialFilterBy)

      const groupResultsOptions = generateOptions(modifyMeta.groupBy, modifyMeta.initialGroupBy)

      setInitialData({
        ...initialData,
        columns,
        rows,
        paginationSizes: modifyMeta.paginationSizes,
        hasSortableColumns: modifyMeta.hasSortableColumns,
        initialSortColumnId: modifyMeta.initialSortColumnId,
        bulkActions: modifyMeta.bulkActions,
        filterResultsOptions: filterResultsOptions.options,
        defaultFilterResultsId: filterResultsOptions.defaultOptionId,
        groupResultsOptions: groupResultsOptions.options,
        defaultGroupResultsId: groupResultsOptions.defaultOptionId
      })
    }
  }, [modifyMeta, results, isFetching])

  useEffect(() => {
    if (
      getNotificationMessage.message &&
      ['success', 'Success', 'info', 'Error', 'error'].includes(getNotificationMessage.type)
    ) {
      setTimeout(() => {
        // dispatch here
        dispatch(
          updateReviewNotificationMessage({
            type: '',
            message: '',
            action: ''
          })
        )
      }, 5000)
    }
  }, [getNotificationMessage])

  useEffect(() => {
    if (value === 0 || value === 1) {
      dispatch(updateAssetsPageSize(10))
      dispatch(updateAssetsPageNumber(0))
    }
    if (value === 2 || value === 3) {
      dispatch(updateAssetGroupsPageSize(10))
      dispatch(updateAssetsGroupPageNumber(0))
    }
  }, [value])

  useEffect(
    () => () => {
      dispatch(updateAssetsIsGoingForwardFlag(true))
      dispatch(updateAssetsPaginationKeys([]))
      dispatch(updateAssetsGroupIsGoingForwardFlag(true))
      dispatch(updateAssetsGroupPaginationKeys([]))
      localStorage.setItem('searchValue', '')
    },
    []
  )

  // To Get metadata and  api data on Initital Page
  useEffect(async () => {
    if (!accountTypeItems?.accountTypeItems && accountTypeItems?.length === 0) {
      const resp = await accountApi.getAccountCategory()
      dispatch(fetchAccountTypeItemsSuccess({ accountTypeItems: resp }))
      if (resp) {
        assetsApi
          .getModifyTabMeta()
          .then((res) => {
            setModifyTabs(res.result)
          })
          .catch((err) => console.error(err))
        dispatch(fetchPersonalAssetsMetadataStart())
        dispatch(updateShowBigLoader(true))
        localStorage.setItem('component', 'Modify')
      }
    } else {
      assetsApi
        .getModifyTabMeta()
        .then((res) => {
          setModifyTabs(res.result)
        })
        .catch((err) => console.error(err))
      dispatch(fetchPersonalAssetsMetadataStart())
      dispatch(updateShowBigLoader(true))
      localStorage.setItem('component', 'Modify')
    }
    localStorage.removeItem('myTeam-userId')
    localStorage.removeItem('myTeam-userEmail')
    localStorage.removeItem('myTeam-userName')
  }, [])

  const openSignOffModal = () => {
    let counter = 0
    const certifyData = []

    if (groupAssetsItems && groupAssetsItems?.groupData?.length > 0) {
      for (const item of groupAssetsItems?.groupData) {
        if (
          ['Pending Review', 'Overdue Review and Members Removed', 'Overdue Review'].includes(
            item.status
          ) &&
          item.status !== undefined &&
          item.checked
        ) {
          certifyData.push(item)
          counter += 1
        }
      }
    }

    setDataToCertify(certifyData)
    setActionCount(counter)
    console.log(actionCount)

    setSignOffModal(true)
  }
  const sendNotification = (isSuccessful, count) => {
    dispatch(
      updateReviewNotificationMessage({
        type: isSuccessful ? 'Success' : 'Error',
        message: isSuccessful
          ? `${count} AD Group(s) ${transferOwnershipSuccessMsg} `
          : `${transferOwnershipErrorMsg} ${count} AD Group(S)`,
        action: 'confirm'
      })
    )
  }

  const confirmDecisions = async () => {
    let successCounter = 0
    let failCounter = 0
    const finalPayloads = []
    for (const element of dataToCertify) {
      if (element) {
        const adGroupDetails = {}
        /* eslint no-underscore-dangle: 0 */
        const commonObject = {
          applicationName: `${applicationNamePrefix}${findDomain(
            element?.groupDetails?._source?.igaContent?.distinguishedName
          )}`,
          requestorMail: `${profile.mail}`,
          category: 'AD Group',
          operation: 'Amend',
          groupDN: element?.groupDetails?._source?.igaContent?.object?.dn,
          requestJustification: `Certified ${element.groupDetails?._source?.igaContent?.cn}`,
          Accessio_Request_No: '',
          groupDetails: {
            dbagObjectLastRecertified: ''
          }
        }
        adGroupDetails.common = commonObject
        // eslint-disable-next-line no-await-in-loop
        const response = await adGroupApi.modifyAdGroup(adGroupDetails).catch((err) => {
          console.error(err)
          return err
        })
        finalPayloads.push(response)
        setSignOffModal(false)
      }
    }
    finalPayloads.forEach((result) => {
      if (result?.status === 200) {
        successCounter += 1
      } else {
        failCounter += 1
      }
    })
    if (successCounter > 0) {
      sendNotification(true, successCounter)
      history.push(`/history/requestHistory`)
    }
    if (failCounter > 0) {
      const payload = {
        pageSize: pageSizeGroup,
        userEmail: `${profile.mail}`,
        pageNumber: pageNumberGroup
      }
      dispatch(fetchGroupAssetsItemsStart(payload))
      setTimeout(() => {
        sendNotification(false, failCounter)
      }, 1000)
    }
  }

  return (
    <>
      {signOffModal && (
        <GenericModal width="700px" setOpen={setSignOffModal}>
          <div>
            <p style={{ fontWeight: 'bold' }}>Confirmation</p>
            <p>
              By submitting this form, I agree that all the AD attribute information is up to date
              correct
            </p>
          </div>
          <Styled.ButtonWrapper>
            <Button
              onClick={() => confirmDecisions()}
              variant="outlined"
              sx={{
                color: `${theme === 'dark' ? '#ffffff' : '#000000'}`,
                borderColor: ' 1px solid rgba(255, 255, 255, 0.4);'
              }}
            >
              Confirm
            </Button>
            <Button
              onClick={() => setSignOffModal(false)}
              sx={{ marginRight: '8px', color: `${theme === 'dark' ? '#ffffff' : '#000000'}` }}
            >
              Cancel
            </Button>
          </Styled.ButtonWrapper>
        </GenericModal>
      )}
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <Button
          variant="text"
          sx={{ fontSize: '14px', color: theme.palette.mode === 'dark' ? '#FFF' : '#0A1C33' }}
        >
          ← {translate('review.back')}
        </Button>
      </Link>
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: './dashboard' },
          { label: translate('myAssets.header'), url: '' }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Grid container>
          <Grid item xs={12} style={{ display: 'flex' }}>
            <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
              {translate('myAssets.header')}
            </h1>
            <div style={{ marginTop: '22px', marginLeft: '5px' }}>
              {showSmallLoading && (
                <CircularProgress
                  size={23}
                  sx={{ top: '5px', marginBottom: '10px', position: 'relative', color: blue[500] }}
                />
              )}
            </div>
          </Grid>
        </Grid>
      </div>
      <Grid sx={{ padding: '9px 11px 6px 9px' }}>
        {showBigLoader && <Loading />}
        <Grid item xs={12}>
          <Box
            sx={{
              width: '100%',
              backgroundColor: `${theme.palette.mode === 'dark' ? '#1a2129' : '#FFF'}`
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={value}
                onChange={handleChange}
                variant="scrollable"
                scrollButtons="auto"
                aria-label="myAssets-tabs"
              >
                {modifyTabs &&
                  modifyTabs.map((tabDetails) => (
                    <Tab
                      key={tabDetails.id}
                      sx={{ fontSize: '16px' }}
                      label={translate(tabDetails.label)}
                    />
                  ))}
              </Tabs>
            </Box>
            <Grid
              item
              xs={12}
              sx={{
                background: theme.palette.mode === 'dark' ? '#182B44' : '#FFF',
                display: 'flex'
              }}
            >
              {![1, 3].includes(value) ? (
                <MSearchBox
                  onSearchCallback={handleSearch}
                  onClearCallback={clearSearch}
                  placeholder={
                    value === 0
                      ? translate('myAsset.search.placeholder')
                      : iff(
                          value === 1,
                          translate('myAsset.search.placeholder.nonpersonal'),
                          translate('myAsset.search.placeholder.group')
                        )
                  }
                  data=""
                  filterResultsOptions=""
                  groupResultsOptions=""
                  isManageColumnRequired={false}
                  isExport={value === 2}
                  type={getType()}
                />
              ) : null}
            </Grid>
            {modifyTabs &&
              modifyTabs.map((tabPanel) => {
                switch (tabPanel.id) {
                  case '1':
                    return (
                      <TabPanel key={tabPanel.id} value={value} index={Number(tabPanel.index)}>
                        {results && (
                          <AssetTable
                            rows={results.assetsData}
                            search={initialData.search}
                            columns={initialData.columns}
                            paginationSizes={initialData.paginationSizes}
                            hasSortableColumns={initialData.hasSortableColumns}
                            initialSortColumnId={initialData.initialSortColumnId}
                            bulkActions={initialData.bulkActions}
                            metadata={modifyMeta}
                            type="Modify"
                            total={results?.total ? results?.total : 0}
                            myAssetType="Personal"
                          />
                        )}
                      </TabPanel>
                    )
                  case '2':
                    return (
                      <TabPanel key={tabPanel.id} value={value} index={Number(tabPanel.index)}>
                        <GRIDTable userInfo={userInfo} />
                      </TabPanel>
                    )
                  case '3':
                    return (
                      <TabPanel key={tabPanel.id} value={value} index={Number(tabPanel.index)}>
                        <GroupTable />
                      </TabPanel>
                    )
                  case '4':
                    return (
                      <TabPanel key={tabPanel.id} value={value} index={Number(tabPanel.index)}>
                        <IndirectlyOwnedGroupTable />
                      </TabPanel>
                    )

                  default:
                    return <></>
                }
              })}
          </Box>
        </Grid>
        {value === 2 && showBulkActions() && (
          <div
            style={{
              bottom: 0,
              width: '100%',
              background: theme === 'dark' ? '#182b44' : '#fff',
              zIndex: 1400,
              position: 'fixed',
              left: '-1px',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '16px',
              fontWeight: 400,
              color: theme === 'dark' ? '#fff' : '#333',
              borderTop: theme === 'dark' ? '1px solid #404854' : '1px solid #ccc'
            }}
          >
            {translate('myAsset.certify.message')}
            <Button
              style={{ marginLeft: '10px' }}
              variant="outlined"
              onClick={() => openSignOffModal()}
              sx={{
                color: `${theme === 'dark' ? '#fff' : '#333'}`,
                borderColor: `${theme === 'dark' ? '#fff' : '#333'}`,
                fontSize: '14px',
                fontWeight: 'semi-bold',
                marginTop: '10px',
                marginBottom: '10px',
                height: '30px'
              }}
            >
              {translate('review.certify')}
            </Button>
          </div>
        )}
      </Grid>
    </>
  )
}
export default MyAsset
