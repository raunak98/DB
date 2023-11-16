import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
// import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Link } from 'react-router-dom'
import { styled } from '@mui/material/styles'
import Breadcrumb from 'components/breadcrumb'
import translate from 'translations/translate'
import * as Styled from './style'
import * as accountApi from '../../api/accountManagement'
import useTheme from '../../hooks/useTheme'
import { updateShowBigLoader } from '../../redux/review/review.action'
import { selectShowBigLoader } from '../../redux/review/review.selector'
import Loading from '../../components/loading'

const CustomizedAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  '& .Mui-expanded': {
    backgroundColor: theme.palette.mode === 'dark' ? '#2d3643' : '#EFF9FC'
  }
}))

const Requests = () => {
  const [accordionData, setAccordionData] = useState([])
  const { theme } = useTheme()
  const dispatch = useDispatch()

  const showBigLoader = useSelector(selectShowBigLoader)

  useEffect(async () => {
    localStorage.removeItem('component')
    dispatch(updateShowBigLoader(true))
    await accountApi.getMeta().then((res) => {
      setAccordionData(res)
    })
    dispatch(updateShowBigLoader(false))
  }, [])

  const renderNavElemnt = (item, isChildElement) => {
    if (item?.displayInMenu) {
      if (item.type === 'Accordion') {
        return (
          <Accordion
            defaultExpanded
            key={item.title}
            disableGutters
            sx={{
              textIndent: isChildElement ? '20px' : 0,
              borderTop: isChildElement ? '1px solid #e0e0e0' : '0'
            }}
          >
            <AccordionSummary
              disabled
              aria-controls="panel1a-content"
              id="panel1a-header"
              sx={{
                backgroundColor: theme === 'dark' ? '#3C485A' : '#B0DFF6',
                '&.MuiAccordionSummary-root.Mui-disabled': {
                  opacity: 1
                }
              }}
            >
              <Typography> {translate(`${item.title}`)}</Typography>
            </AccordionSummary>
            <CustomizedAccordionDetails
              sx={{ backgroundColor: theme === 'dark' ? '#1A2129' : '#FFF', padding: '0px' }}
            >
              {item.children && item.children.map((child) => renderNavElemnt(child, true))}
            </CustomizedAccordionDetails>
          </Accordion>
        )
      }
      return (
        <Styled.List key={item.title}>
          <Styled.Item
            sx={{
              textIndent: isChildElement ? '30px' : 0,
              borderTop: isChildElement ? '1px solid #e0e0e0' : '0'
            }}
          >
            <ArrowForwardIosIcon
              sx={{
                fontSize: 14,
                float: 'left',
                margin: '3px 15px 0px 0px',
                color: theme === 'dark' ? '#FFF' : '#757575'
              }}
            />
            <Link
              style={{ textDecoration: 'none', color: 'inherit' }}
              to={item.url ? item.url : ''}
            >
              {translate(`${item.title}`)}
            </Link>
          </Styled.Item>
        </Styled.List>
      )
    }
    return null
  }
  return (
    <>
      {showBigLoader && <Loading />}
      <Styled.BackButtonLink to="/dashboard">
        <Styled.BackButton>← {translate('create.ADAccount.back')}</Styled.BackButton>
      </Styled.BackButtonLink>
      {/* Breadcrumb component for application */}
      <Breadcrumb
        path={[
          { label: translate('navItem.label.dashboard'), url: './dashboard' },
          { label: translate('create.ADAccount.requests'), url: '' }
        ]}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Styled.HeaderWrapper>
          <h1 style={{ fontWeight: 'normal', marginBottom: '10px' }}>
            {translate('create.ADAccount.requests')}
          </h1>
        </Styled.HeaderWrapper>
      </div>

      {/* <Styled.AccordianHeaderWrapper>
        <Typography
          sx={{
            fontWeight: '400',
            fontSize: '16px',
            lineHeight: '24px',
            justifyContent: 'center',
            padding: '18px 7px'
          }}
        >
          {translate('metaData.Categories')}
        </Typography>
      </Styled.AccordianHeaderWrapper> */}

      {accordionData && accordionData.map((item) => renderNavElemnt(item))}
    </>
  )
}

export default Requests
