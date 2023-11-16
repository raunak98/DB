import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useLocation } from 'react-router-dom'
import Button from '@mui/material/Button'
import Loading from 'components/loading'
import translate from 'translations/translate'
import Icon from '../../../components/icon'
import GenericModal from '../../../components/genericModal'
import { updateReviewNotificationMessage } from '../../../redux/review/review.action'
import * as reviewApi from '../../../api/review'
import * as Styled from './style'

const ReviewTextIcon = ({ cell, dataItem, columnType, certification, moduleType, properties }) => {
  const [infoType, setInfoType] = useState('')
  const [header, setHeader] = useState('')
  const [open, setOpen] = useState(false)
  const [accountInfo, setAccountInfo] = useState()
  const [infoMeta, setInfoMeta] = useState()
  const [entMeta, setEntMeta] = useState()
  const [userMeta, setUserMeta] = useState()
  const [loader, setLoader] = useState(false)
  // const { id } = useParams()
  const location = useLocation()
  const id = location?.state?.id
  const dispatch = useDispatch()
  const title = translate('textIcon.header.title')
  const requestTitle = translate('textIcon.request.title')
  const noRequestTitle = translate('textIcon.noRequest.title')

  const showAccountInfo = (itemId, type) => {
    setInfoType(type)
    if (type === 'accountName' || type === 'sAMAccountName') {
      setHeader(title)
      setLoader(true)
      reviewApi
        .getAccountInfoMetaData()
        .then((res) => {
          setInfoMeta(res)
          reviewApi
            .getAccountInfoById(itemId, id, certification)
            .then(async (data) => {
              let dataInfo = data
              if (!data.entitlement) {
                await reviewApi
                  .getEntInfoById(itemId, id)
                  .then((dataitem) => {
                    dataInfo = {
                      ...data,
                      entitlement: dataitem.dn
                    }
                  })
                  .catch((err) => {
                    console.error(err)
                    setLoader(false)
                  })
              }
              setLoader(false)
              setAccountInfo(dataInfo)
              setOpen(true)
            })
            .catch(() => {
              setLoader(false)
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: `error.fetchdata`
                })
              )
            })
        })
        .catch(() => {
          setLoader(false)
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: `error.fetchdata`
            })
          )
        })
    }
    if (type === 'entitlement') {
      setHeader('Entitlement Information')
      setLoader(true)
      reviewApi
        .getEntInfoMetaData()
        .then((res) => {
          setEntMeta(res)
          reviewApi
            .getEntInfoById(itemId, id, certification)
            .then((data) => {
              setLoader(false)
              setAccountInfo(data)
              setOpen(true)
            })
            .catch((err) => {
              console.error(err)
              setLoader(false)
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: `error.fetchdata`
                })
              )
            })
        })
        .catch(() => {
          setLoader(false)
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: `error.fetchdata`
            })
          )
        })
    }
    if (type === 'username') {
      setHeader('User Information')
      setLoader(true)
      reviewApi
        .getUserInfoMetaData()
        .then((res) => {
          setUserMeta(res)
          reviewApi
            .getUserInfoById(itemId, id)
            .then((data) => {
              setLoader(false)
              setAccountInfo(data)
              setOpen(true)
            })
            .catch((err) => {
              console.error(err)
              dispatch(
                updateReviewNotificationMessage({
                  type: 'Error',
                  message: `error.fetchdata`
                })
              )
            })
        })
        .catch(() => {
          dispatch(
            updateReviewNotificationMessage({
              type: 'Error',
              message: `error.fetchdata`
            })
          )
        })
    }
  }

  const iff = (consition, then, otherise) => (consition ? then : otherise)

  const renderElement = () => {
    if (infoType === 'accountName' || infoType === 'sAMAccountName') {
      return (
        <>
          <Styled.Table>
            <tbody>
              {infoMeta.map(
                (info) =>
                  accountInfo[info.id] &&
                  !accountInfo.error && (
                    <Styled.Row key={info.id}>
                      <Styled.Cell>
                        <Styled.CellLabel> {info.header.text}</Styled.CellLabel>
                      </Styled.Cell>
                      <Styled.Cell>
                        <Styled.CellValue>{accountInfo[info.id]}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                  )
              )}
            </tbody>
          </Styled.Table>
          {accountInfo.error !== '' && <span>{accountInfo.error}</span>}
        </>
      )
    }
    if (infoType === 'entitlement') {
      return (
        <>
          <Styled.Table>
            <tbody>
              {entMeta.map(
                (ent) =>
                  accountInfo[ent.id] && (
                    <Styled.Row key={ent.id}>
                      <Styled.Cell>
                        <Styled.CellLabel> {ent.header.text}</Styled.CellLabel>
                      </Styled.Cell>
                      <Styled.Cell>
                        <Styled.CellValue>{accountInfo[ent.id]}</Styled.CellValue>
                      </Styled.Cell>
                    </Styled.Row>
                  )
              )}
            </tbody>
          </Styled.Table>
          {accountInfo.error !== '' && <span>{accountInfo.error}</span>}
        </>
      )
    }
    return (
      <Styled.Table>
        <tbody>
          {userMeta.map(
            (user) =>
              accountInfo[user.id] && (
                <Styled.Row key={user.id}>
                  <Styled.Cell>
                    <Styled.CellLabel> {user.header.text}</Styled.CellLabel>
                  </Styled.Cell>
                  <Styled.Cell>
                    <Styled.CellValue>{accountInfo[user.id]}</Styled.CellValue>
                  </Styled.Cell>
                </Styled.Row>
              )
          )}
        </tbody>
      </Styled.Table>
    )
  }

  return (
    <>
      {open && (
        <GenericModal
          setOpen={setOpen}
          width={infoType === 'accountName' || infoType === 'username' ? '502px' : '702px'}
        >
          <div>
            <Styled.InfoWrapper>
              <Styled.HeaderWrapper>{header}</Styled.HeaderWrapper>
            </Styled.InfoWrapper>
            {renderElement()}
            <Button
              variant="contained"
              style={{
                float: 'right',
                marginTop: '25px',
                background: '#FFFFFF',
                color: '#333333',
                border: '2px solid rgb(208, 203, 203)'
              }}
              onClick={() => setOpen(false)}
            >
              Close
            </Button>
          </div>
        </GenericModal>
      )}
      <span
        style={{
          paddingLeft: '4px',
          display: 'inline-block',
          width: '75%'
        }}
      >
        {cell}
      </span>
      <span style={{ display: 'inline-block' }}>
        {cell &&
        !['Request History', 'Approval History', 'Approvals', 'Justifications', 'Drafts'].includes(
          moduleType
        ) ? (
          <Icon
            name="info"
            size="small"
            onClickCallback={() => {
              showAccountInfo(dataItem.id, columnType)
            }}
          />
        ) : (
          (columnType === 'recipient'
            ? dataItem.recipientMail
            : iff(
                dataItem?.requesterMail,
                dataItem.requesterMail,
                !['', null, undefined].includes(dataItem?.requester?.trim())
              )) && (
            <Icon
              title={
                columnType === 'recipient'
                  ? iff(dataItem.recipientMail, requestTitle, noRequestTitle)
                  : iff(dataItem.requester, requestTitle, noRequestTitle)
              }
              onClickCallback={() => {
                if (
                  properties.infoFieldLink &&
                  (dataItem.recipientMail || dataItem.requesterMail)
                ) {
                  window.open(
                    `${properties.infoFieldLink}${
                      columnType === 'recipient' ? dataItem.recipientMail : dataItem.requesterMail
                    }`,
                    '_blank'
                  )
                }
              }}
              name="info"
              size="small"
            />
          )
        )}
      </span>
      {loader && <Loading />}
    </>
  )
}

export default React.memo(ReviewTextIcon)
