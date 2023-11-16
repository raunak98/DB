import * as React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { styled } from '@mui/material/styles'
import CheckTwoToneIcon from '@mui/icons-material/CheckTwoTone'
import Paper from '@mui/material/Paper'
import translate from 'translations/translate'
import useTheme from '../../hooks/useTheme'
import { selectCertification } from '../../redux/review/review.selector'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'left',
  color: theme.palette.text.secondary
}))
function Tag(props) {
  const { label, openValue, index, themes, ...other } = props

  return (
    <Item
      xs={8}
      {...other}
      style={{
        background: 'transparent',
        borderWidth: 1,
        // eslint-disable-next-line no-nested-ternary
        borderColor: themes === 'dark' ? '#fff' : index === openValue ? '#333' : '#A9A9A9',
        justifyContent: 'space-between'
      }}
    >
      <span style={{ fontWeight: 400 }}>{label}</span>
      {index === openValue ? (
        <CheckTwoToneIcon color={themes === 'dark' ? '#fff' : '#333'} />
      ) : null}
    </Item>
  )
}

Tag.propTypes = {
  label: PropTypes.string.isRequired
}

const StyledTag = styled(Tag)(
  ({ theme }) => `
  display: flex;
  align-items: center;
  height: 40px;
  width: 210px;
  margin: 2px;
  line-height: 22px;
  background-color: ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.08)' : '#fafafa'};
  border: 1px solid ${theme.palette.mode === 'dark' ? '#303030' : '#e8e8e8'};
  border-radius: 1px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;
  margin:5px;
  cursor: pointer;


  &:focus {
    border-color: ${theme.palette.mode === 'dark' ? '#177ddc' : '#40a9ff'};
    background-color: ${theme.palette.mode === 'dark' ? '#003b57' : '#e6f7ff'};
  }

  & span {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: clip;
    font-family: 'Open Sans', sans-serif;
    color:  ${theme.palette.mode === 'dark' ? '#ffffff' : '#333333'};
  }

  & svg {
    font-size: 22px;
    cursor: pointer;
    padding: 0px;
    margin: 1px 1px 5px 14px
    color:  ${theme.palette.mode === 'dark' ? '#ffffff' : '#333333'};

  }
`
)

export default function filterPopUp({ value, index, addToApplyFilter, openValue, setOpenValue }) {
  const { theme } = useTheme()
  const reviewCertification = useSelector(selectCertification)
  const checkGovCampaignandLabel = (label) => {
    if (
      [
        'SECURITY_ADGROUP',
        'SECURITY_VDRGROUP',
        'DORMANT_AD_ACCS',
        'SECURITY_ADGROUP_MAIN',
        'SECURITY_VDRGROUP_MAIN'
      ].includes(reviewCertification)
    ) {
      if (label === 'Username') {
        return true
      }
      return false
    }
    if (
      [
        'AAA_ASA_DB',
        'AAA_ASA_UNIX',
        'AAA_ASA_WIN',
        'AAA_WIN_UNIX_DB_DBPASSPORT_FOBO',
        'AAA_WIN_UNIX_DB_DBPASSPORT_MOV',
        'ENDUSER_ACCS_DB',
        'ISA_WIN_UNIX_DB',
        'WIN_UNIX_DB_DBPASSPORT_FOBO'
      ].includes(reviewCertification)
    ) {
      if (label === 'Username') {
        return true
      }
      return false
    }
    return false
  }
  // const checkGuardianCampaignLabel = () => {
  //   return true
  // }
  return (
    <>
      <StyledTag
        key={index}
        index={index}
        label={
          checkGovCampaignandLabel(value.label)
            ? translate(`popup.text.govUsername`)
            : translate(`popup.text.${value.label}`)
        }
        onClick={() =>
          index === openValue
            ? (setOpenValue(-1), addToApplyFilter(false))
            : (setOpenValue(index), addToApplyFilter(true))
        }
        openValue={openValue}
        themes={theme}
      />
    </>
  )
}
