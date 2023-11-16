import React from 'react'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormHelperText from '@mui/material/FormHelperText'
import { LOCALES } from 'translations/locales'
import {
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  InputAdornment,
  FormGroup
} from '@mui/material'
import BasicTable from 'components/tableGenerator'
import AutocompleteWrapper from 'components/autocomplete'
import translate from 'translations/translate'
import Icon from '../icon'
import useTheme from '../../hooks/useTheme'
import * as accountApi from '../../api/accountManagement'

function formGenerator(
  formElement,
  fieldChangeHandler,
  fieldDisplayHandler,
  handleDisplayValue,
  helperFinder,
  categoryDataArray,
  valueFinder,
  errorFinder,
  optionFinder,
  optionReset,
  disabledFlagFinder,
  readOnlyFlagFinder,
  hiddenFlagFinder,
  columnSX,
  groupOwner,
  removeItems,
  groupMembershipData,
  resetAccountGroupValue,
  groupScopeDisable,
  callbackHandler,
  accounts,
  groups,
  servicePrincipalValue,
  toggleForm,
  toggleFormServer
) {
  const { theme } = useTheme()
  const madetoryErrorMsg = translate('form.mandatoryErrorMessage')
  const numericValidationMessage = translate('form.numericValidationMessage')
  const alphaValidationMessage = translate('form.alphaValidationMessage')
  const alphaNumericValidationMessage = translate('form.alphaNumericValidationMessage')
  const onlyAlphanumericTypeValidationMessage = translate(
    'form.onlyAlphanumericTypeValidationMessage'
  )

  const alphaNumericValidationMessageForDescription = translate(
    'form.alphaNumericValidationMessageForDescription'
  )
  const alphaNumericWithHyphenMessage = translate('form.alphaNumericWith_HyphenValidationMessage')
  const approverMinVal = translate('form.approverMinVal')

  // Change handler
  const handleChange = (event, value, element, reason, selectValueObjArr, v) => {
    const felement = element
    let errorState = false
    let errorMessage = ''
    let enteredValue = ''
    let displayLabel = ''
    let helperTextValue = ''

    if (Array.isArray(value)) {
      if (value.length === 0 && felement.requiredField) {
        errorState = true
        errorMessage = madetoryErrorMsg
      }
      if (value.length < 3 && element.id === 'dbagIMSApprovers') {
        errorState = true
        errorMessage = approverMinVal
      } else {
        displayLabel = value.map((item) => item.label).join(', ')
      }
      felement.error = errorState
      felement.helperText = errorMessage
      fieldChangeHandler(
        event,
        value,
        element.category,
        element.id,
        displayLabel,
        helperTextValue,
        reason,
        selectValueObjArr,
        v
      )
    } else {
      if (value === true) {
        enteredValue = true
        displayLabel = 'Yes'
      } else if (value === false) {
        enteredValue = false
        displayLabel = 'No'
      } else {
        enteredValue = value && value.value ? value.value : event.target.value
        if (felement?.id === 'ManagedPasswordIntervalInDays') {
          // This piece of code will reset to max and min values if the value exceeds MaxValue > 90 and MinValue < 1
          const input = parseInt(event?.target?.value, 10)
          if (input > felement?.maxValue) {
            enteredValue = felement?.maxValue
            displayLabel = felement?.maxValue
          }

          if (input < felement?.minValue) {
            enteredValue = felement?.minValue
            displayLabel = felement?.minValue
          }
        }
      }

      if (value && value.label) {
        displayLabel = value.label
      } else if (value && value.props && value.props.children) {
        displayLabel = value.props.children
      }
      if ((!enteredValue || enteredValue === '') && felement.requiredField) {
        errorState = true
        errorMessage = madetoryErrorMsg
      } else if (felement?.numericType) {
        errorState = !enteredValue?.match(/^\d+/)
        errorMessage = errorState ? numericValidationMessage : ''
      } else if (felement.alphaType) {
        errorState = !enteredValue.match(/^[a-zA-Z]*$/)
        errorMessage = errorState ? alphaValidationMessage : ''
      } else if (felement.alphaTypeWithSpace) {
        errorState = !enteredValue.match(/^[a-zA-Z ]*$/)
        errorMessage = errorState ? alphaValidationMessage : ''
      } else if (felement.alphanumericType && element.id === 'description') {
        errorState = !enteredValue.match(
          /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 \-_.,@\\()]+)$/
        )
        errorMessage = errorState ? alphaNumericValidationMessageForDescription : ''
      } else if (felement.alphanumericType && felement.required) {
        errorState = !enteredValue.match(
          /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 \-_.@\\]+)$/
        )
        errorMessage = errorState ? alphaNumericValidationMessage : ''
      } else if (felement.onlyAlphanumericType) {
        errorState = !enteredValue.match(
          /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9 \-_]+)$/
        )
        errorMessage = errorState ? onlyAlphanumericTypeValidationMessage : ''
      } else if (felement.alphanumericTypeWithHyphen) {
        errorState = !enteredValue.match(
          /^([a-zA-Z0-9\u0600-\u06FF\u0660-\u0669\u06F0-\u06F9\-_]+)$/
        )
        errorMessage = errorState ? alphaNumericWithHyphenMessage : ''
      }
      felement.error = errorState
      felement.helperText = errorMessage
      helperTextValue = errorMessage
      if (!errorState) {
        let payload
        switch (element.id) {
          case 'recipient':
            if (value.manager && value.manager !== '') {
              helperTextValue = `Manager: ${value.manager}`
            }
            // sent api to get primary account details
            payload = {
              targetName: 'mail',
              targetValue: value.value,
              pageSize: 10,
              pageNumber: 0
            }
            accountApi
              .getPrimaryAccountDetails('/v0/account/accountDetails', payload)
              .then((res) => {
                if (res) {
                  /* eslint no-underscore-dangle: 0 */
                  handleDisplayValue({
                    id: 'primaryAccount',
                    value: res?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                      ? res?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                      : '',
                    displayLabel: res?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                      ? res?.hits?.hits[0]?._source?.igaContent?.sAMAccountName
                      : '',
                    firstName: res?.hits?.hits[0]?._source?.userId?.givenName
                      ? res?.hits?.hits[0]?._source?.userId?.givenName
                      : '',
                    lastName: res?.hits?.hits[0]?._source?.userId?.sn
                      ? res?.hits?.hits[0]?._source?.userId?.sn
                      : '',
                    isValidAccount: Boolean(res && res?.hits && res?.hits?.total?.value !== 0)
                  })
                }
              })
            break
          case 'dbagCostcenter':
            // set the default value on basis of cost center response
            if (typeof value.value !== 'undefined') {
              accountApi
                .getOptionsById('/v0/governance/getDeptWithCCId', { costCenterId: value.value })
                .then((res) => {
                  if (res && res.length > 0) {
                    handleDisplayValue({
                      id: 'department',
                      value: res[0].value,
                      displayLabel: res[0].label
                    })
                  }
                })
            }

            break
          default:
            break
        }
      }

      fieldChangeHandler(
        event,
        enteredValue,
        element.category,
        element.id,
        displayLabel,
        helperTextValue,
        element.type,
        value,
        errorState
      )
    }
  }

  const handleMultiCheckbox = (event, value, element, reason, selectValueObjArr, v, index) => {
    const checkedOption = []
    const errorState = false
    // const errorMessage = ''
    let enteredValue = ''
    let displayLabel = ''
    const helperTextValue = ''
    console.log(reason, selectValueObjArr, v)

    if (element?.type === 'multiCheckbox') {
      element.options.forEach((option, i) => {
        if (i === index) {
          /* eslint no-param-reassign: "error" */
          option.checked = value
        }
      })

      const checkedValues = element.options.map((option) => {
        if (option.checked === true) {
          checkedOption.push(option.value)
        }
        return checkedOption
      })
      if (checkedValues[0]?.length === 0 || checkedValues?.length === 0) {
        enteredValue = ''
        displayLabel = ''
      }
      if (checkedValues?.toString() === '8' || checkedValues[0]?.toString() === '8') {
        enteredValue = '8'
        displayLabel = 'AES128'
      }
      if (checkedValues?.toString() === '16' || checkedValues[0]?.toString() === '16') {
        enteredValue = '16'
        displayLabel = 'AES256'
      }
      if (checkedValues?.toString() === '8,16' || checkedValues[0]?.toString() === '8,16') {
        enteredValue = '24'
        displayLabel = 'AES128,AES256'
      }
    }

    fieldChangeHandler(
      event,
      enteredValue,
      element.category,
      element.id,
      displayLabel,
      helperTextValue,
      element.type,
      value,
      errorState
    )
  }

  let categoryData = {}
  if (categoryDataArray.length > 0) {
    const data = categoryDataArray.filter((item) => item.id === formElement.id)
    categoryData = data.length > 0 ? data[0] : {}
  }

  const getDisbaleOption = (option, id) => {
    let disable = false
    if (id === 'groupScope') {
      if (groupScopeDisable === 'domain') {
        disable = !(option === groupScopeDisable)
      }
      if (groupScopeDisable === 'universal') {
        disable = option === 'global'
      }
    }

    return disable
  }

  if (formElement.type === 'text') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <>
          <Grid
            item
            xs={columnSX || ''}
            sx={{
              display: hiddenFlagFinder && hiddenFlagFinder(formElement.id) ? 'none' : 'inherit'
            }}
            key={`${formElement.id}_container`}
          >
            <FormControl
              sx={{ width: formElement?.infoText === undefined ? '91%' : '94%' }}
              margin="normal"
              key={formElement.id}
            >
              <TextField
                id={formElement.id}
                label={translate(`${formElement.label}`)}
                default={formElement.default}
                onChange={(e, v) => handleChange(e, v, formElement)}
                error={errorFinder(formElement.id) || formElement.error}
                helperText={helperFinder(formElement.id) || formElement.helperText}
                // inputProps={{
                //   readOnly: readOnlyFlagFinder(formElement.id),
                //   disabled: disabledFlagFinder(formElement.id),
                //   maxLength: formElement.maxLength,
                //   startAdornment: 'gM_'
                // }}
                InputProps={{
                  // Keeping the above code for future As it was modified from inputProps to InputProps
                  readOnly: readOnlyFlagFinder(formElement.id),
                  disabled: disabledFlagFinder(formElement.id),
                  maxLength: formElement.maxLength,
                  startAdornment: (
                    <InputAdornment position="start">{formElement?.startAdornment}</InputAdornment>
                  )
                }}
                required={formElement.showRequired || formElement.requiredField}
                fullWidth
                value={valueFinder(formElement.id)}
              />
            </FormControl>
            {formElement.infoText ? (
              <div style={{ marginTop: '30px', padding: '0px 5px' }}>
                <Icon name="info" size="small" title={translate(`${formElement.infoText}`)} />
              </div>
            ) : null}
          </Grid>
        </>
      )
    }
  }
  if (formElement.type === 'displayvalue') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <Grid
          item
          xs={columnSX}
          sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
          key={`${formElement.id}_container`}
        >
          <FormControl
            sx={{ width: formElement?.infoText === undefined ? '91%' : '94%' }}
            margin="normal"
            key={formElement.id}
            xs={6}
          >
            <TextField
              id={formElement.id}
              inputProps={{ readOnly: true, disabled: true }}
              fullWidth
              label={translate(`${formElement.label}`)}
              default={formElement.default}
              error={errorFinder(formElement.id) || formElement.error}
              value={valueFinder(formElement.id)}
              required={formElement.requiredField}
              helperText={helperFinder(formElement.id) || formElement.helperText}
            />
          </FormControl>
          {formElement.infoText ? (
            <div style={{ marginTop: '30px', padding: '0px 5px' }}>
              <Icon name="info" size="small" title={formElement.infoText} />
            </div>
          ) : null}
        </Grid>
      )
    }
  }
  if (formElement.type === 'dropdown') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <Grid
          item
          xs={columnSX}
          sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
          key={`${formElement.id}_container`}
        >
          <FormControl
            sx={{ width: formElement?.infoText === undefined ? '91%' : '94%' }}
            margin="normal"
            key={formElement.id}
            xs={6}
          >
            <InputLabel
              required={formElement.requiredField}
              id={formElement.id}
              error={errorFinder(formElement.id) || formElement.error}
            >
              {translate(`${formElement.label}`)}
            </InputLabel>
            <Select
              labelId={formElement.id}
              id={formElement.id}
              label={translate(`${formElement.label}`)}
              error={errorFinder(formElement.id) || formElement.error}
              onChange={(e, v) => handleChange(e, v, formElement)}
              required={formElement.requiredField}
              value={valueFinder(formElement.id) ? valueFinder(formElement.id) : ''}
              inputProps={{
                readOnly: readOnlyFlagFinder(formElement.id),
                disabled: disabledFlagFinder(formElement.id)
              }}
            >
              {Object.keys(categoryData).length > 0 && formElement.id === categoryData.id
                ? categoryData.options &&
                  categoryData.options.map((option) => (
                    <MenuItem
                      sx={{
                        borderStyle: 'solid',
                        borderColor: `${theme === 'dark' ? '#4f545b' : '#E7E7E7'}`,
                        borderWidth: '1.5px',
                        borderRadius: 0.1,
                        backgroundColor: `${theme === 'dark' ? '#1a2129' : '#FFF'} !important`,
                        '&:hover,&:focus': {
                          boxShadow: '1px -1px 1px #A9A9A9',
                          backgroundColor: `${theme === 'dark' ? '#1a2129' : '#FFF'} !important`
                        }
                      }}
                      value={option.value}
                      key={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))
                : formElement.options &&
                  formElement.options.map((option) => (
                    <MenuItem
                      sx={{
                        borderStyle: 'solid',
                        borderColor: `${theme === 'dark' ? '#4f545b' : '#E7E7E7'}`,
                        borderWidth: 'thin',
                        borderRadius: 0.1,
                        backgroundColor: `${theme === 'dark' ? '#1a2129' : '#FFF'} !important`,
                        '&:hover,&:focus': {
                          boxShadow: '1px -1px 1px #A9A9A9',
                          backgroundColor: `${theme === 'dark' ? '#1a2129' : '#FFF'} !important`
                        }
                      }}
                      disabled={getDisbaleOption(option.value, formElement.id)}
                      value={option.value}
                      key={option.value}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
            </Select>
            {(errorFinder(formElement.id) || formElement.error) === true && (
              <FormHelperText error={errorFinder(formElement.id) || formElement.error}>
                {helperFinder(formElement.id) || formElement.helperText}
              </FormHelperText>
            )}
          </FormControl>
          {formElement.infoText ? (
            <div style={{ marginTop: '30px', padding: '0px 5px' }}>
              <Icon name="info" size="small" title={translate(`${formElement.infoText}`)} />
            </div>
          ) : null}
        </Grid>
      )
    }
  }
  if (formElement.type === 'autocomplete') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <Grid
          item
          xs={formElement.id === 'servicePrincipalName' ? '12' : columnSX}
          sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
          key={`${formElement.id}_container`}
        >
          <FormControl
            sx={{
              width: formElement?.infoText === undefined ? '91%' : '100%',
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}
            margin="normal"
            key={formElement.id}
            xs={8}
          >
            <AutocompleteWrapper
              id={formElement.id}
              onChangeHandler={handleChange}
              url={formElement.url}
              title={
                [
                  'accountType',
                  'groupType',
                  'serverType',
                  'groupTypeForServer',
                  'dbagApplicationID',
                  'dbagCostcenter',
                  'dbagSupportGroup',
                  'dbagInfrastructureID',
                  'dbagIMSAuthContact',
                  'dbagIMSAuthContactDelegate',
                  'dbagIMSApprovers',
                  'mAMs',
                  'department',
                  'PrincipalsAllowedToRetrieveManagedPassword',
                  'servicePrincipalName',
                  'dbagsupportGroup',
                  'distinguishedName1',
                  'samDbagApplicationID',
                  'recipient'
                ].includes(formElement.id)
                  ? translate(`${formElement.label}`)
                  : formElement.label
              }
              isMultiple={formElement.isMultiple}
              categoryInfo={formElement}
              error={errorFinder(formElement.id) || formElement.error}
              helperText={helperFinder(formElement.id) || formElement.helperText}
              queryparameters={formElement.queryparameters}
              required={formElement.requiredField}
              autocompleteValue={valueFinder(formElement.id)}
              optionFinder={optionFinder(formElement.id)}
              optionReset={optionReset}
              readOnly={readOnlyFlagFinder(formElement.id)}
              disabled={disabledFlagFinder(formElement.id)}
              groupOwner={groupOwner}
              placeholder={translate(`${formElement.placeholder}`)}
              groupMembershipData={groupMembershipData}
              maxLimitValue={formElement.maxLimit}
              handleCallback={callbackHandler}
              accounts={accounts}
              groups={groups}
              toggleForm={toggleForm}
              toggleFormServer={toggleFormServer}
            />
          </FormControl>
          {formElement.infoText ? (
            <div style={{ marginTop: '30px', padding: '0px 5px' }}>
              <Icon name="info" size="small" title={translate(`${formElement.infoText}`)} />
            </div>
          ) : null}
        </Grid>
      )
    }
  }
  if (formElement.type === 'textarea') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <Grid
          item
          xs={columnSX}
          sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
          key={`${formElement.id}_container`}
        >
          <FormControl
            sx={{ width: formElement?.infoText === undefined ? '91%' : '94%' }}
            margin="normal"
            key={formElement.id}
            xs={6}
          >
            <TextField
              id={formElement.id}
              label={translate(`${formElement.label}`)}
              required={formElement.requiredField}
              multiline
              rows={4}
              fullWidth
              title={translate(`${formElement.label}`)}
              onChange={(e, v) => handleChange(e, v, formElement)}
              error={errorFinder(formElement.id) || formElement.error}
              helperText={helperFinder(formElement.id) || formElement.helperText}
              value={valueFinder(formElement.id)}
              inputProps={{
                readOnly: readOnlyFlagFinder(formElement.id),
                disabled: disabledFlagFinder(formElement.id),
                maxLength: formElement.maxLength
              }}
            />
          </FormControl>
          {formElement.infoText ? (
            <div style={{ marginTop: '30px', padding: '0px 5px' }}>
              <Icon name="info" size="small" title={translate(`${formElement.infoText}`)} />
            </div>
          ) : null}
        </Grid>
      )
    }
  }
  if (formElement.type === 'radioGroup') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <Grid
          item
          xs={columnSX}
          // sx={{ display: hiddenFlagFinder(formElement?.id) ? 'none' : 'inherit' }}
          key={`${formElement.id}_container`}
        >
          <FormControl margin="normal" key={formElement.id} xs={6}>
            <FormLabel id={formElement.id}>
              {formElement.id === 'requestType'
                ? translate(`${formElement.label}`)
                : formElement.label}
            </FormLabel>
            <RadioGroup
              row
              aria-labelledby={formElement.label}
              defaultValue={formElement.default}
              name={formElement.name}
              id={formElement.id}
              required={formElement.requiredField}
              inputProps={{
                readOnly: readOnlyFlagFinder(formElement.id),
                disabled: disabledFlagFinder(formElement.id)
              }}
              onChange={(e, v) => handleChange(e, v, formElement)}
            >
              {formElement.radioOptions.length > 0 &&
                formElement.radioOptions.map((radioElement) => (
                  <FormControlLabel
                    value={radioElement.value}
                    key={radioElement.value}
                    control={<Radio />}
                    label={
                      formElement.id === 'requestType'
                        ? translate(`${radioElement.label}`)
                        : radioElement.label
                    }
                  />
                ))}
            </RadioGroup>
          </FormControl>
          {formElement.infoText ? (
            <div style={{ marginTop: '30px', padding: '0px 5px' }}>
              <Icon name="info" size="small" title={formElement.infoText} />
            </div>
          ) : null}
        </Grid>
      )
    }
  }
  if (formElement.type === 'checkbox') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <Grid
          item
          xs={columnSX}
          sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
          key={`${formElement.id}_container`}
        >
          <FormControl sx={{ width: '94%' }} margin="normal" key={formElement.id} xs={6}>
            <FormControlLabel
              control={
                <Checkbox
                  id={formElement.id}
                  onChange={(e, v) => handleChange(e, v, formElement)}
                  error={errorFinder(formElement.id) || formElement.error}
                  helperText={helperFinder(formElement.id) || formElement.helperText}
                  required={formElement.requiredField}
                  value={valueFinder(formElement.id)}
                  inputProps={{
                    readOnly: readOnlyFlagFinder(formElement.id),
                    disabled: disabledFlagFinder(formElement.id)
                  }}
                  checked={valueFinder(formElement.id)}
                />
              }
              label={translate(`${formElement.label}`)}
            />
            {(errorFinder(formElement.id) || formElement.error) === true && (
              <FormHelperText error={errorFinder(formElement.id) || formElement.error}>
                {helperFinder(formElement.id) || formElement.helperText}
              </FormHelperText>
            )}
          </FormControl>
          {formElement.infoText ? (
            <div style={{ marginTop: '30px', padding: '0px 5px' }}>
              <Icon name="info" size="small" title={translate(`${formElement.infoText}`)} />
            </div>
          ) : null}
        </Grid>
      )
    }
  }
  if (formElement.type === 'multiCheckbox') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <Grid
          item
          xs={columnSX}
          sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
          key={`${formElement.id}_container`}
        >
          <FormControl sx={{ width: '94%' }} margin="normal" key={formElement.id} xs={6}>
            <p>{translate(`${formElement.label}`)}</p>
            <FormGroup sx={{ display: 'flex', flexDirection: 'row' }}>
              {formElement.options.map((item, index) => (
                // <p>{item?.label}</p>
                <FormControlLabel
                  sx={{ paddingRight: '15px' }}
                  key={item.id}
                  value={item.value}
                  control={
                    <Checkbox
                      defaultChecked={item?.checked}
                      onChange={(e, v) => handleMultiCheckbox(e, v, formElement, '', '', '', index)}
                    />
                  }
                  label={item.label}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Grid>
      )
    }
  }
  if (formElement.type === 'datepicker') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <>
          <Grid
            item
            xs={columnSX}
            sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
            key={`${formElement.id}_container`}
          >
            <FormControl sx={{ width: '94%' }} margin="normal" key={formElement.id}>
              <TextField
                InputLabelProps={{ shrink: true, required: true }}
                type="date"
                id={formElement.id}
                label={formElement.label}
                default={formElement.default}
                onChange={(e, v) => handleChange(e, v, formElement)}
                error={errorFinder(formElement.id) || formElement.error}
                helperText={helperFinder(formElement.id) || formElement.helperText}
                inputProps={{
                  readOnly: readOnlyFlagFinder(formElement.id),
                  disabled: disabledFlagFinder(formElement.id),
                  min: new Date().toISOString().slice(0, 10)
                }}
                required={formElement.requiredField}
                fullWidth
                value={valueFinder(formElement.id)}
              />
            </FormControl>
            {formElement.infoText ? (
              <div style={{ marginTop: '30px', padding: '0px 5px' }}>
                <Icon name="info" size="small" title={formElement.infoText} />
              </div>
            ) : null}
          </Grid>
        </>
      )
    }
  }
  if (formElement.type === 'table') {
    return (
      (valueFinder('accountCategory') === 'gMSA' ||
        ['accountTable', 'serverTable', 'groupTable'].includes(formElement.id)) && (
        <>
          <Grid
            item
            xs={formElement.id === 'gmsaTable' ? '12' : columnSX}
            sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
            key={`${formElement.id}_container`}
          >
            <FormControl sx={{ width: '100%' }} margin="normal" key={formElement.id}>
              {(errorFinder(formElement.id) || formElement.error) === true && (
                <FormHelperText error={errorFinder(formElement.id) || formElement.error}>
                  {helperFinder(formElement.id) || formElement.helperText}
                </FormHelperText>
              )}
              <BasicTable
                id={formElement.id}
                url={formElement.url}
                columns={formElement.columns}
                values={valueFinder(formElement.id)}
                removeSelected={(id, dn) => removeItems(id, dn)}
                servicePrincipalValue={servicePrincipalValue}
                category={valueFinder('accountCategory')}
              />
            </FormControl>
          </Grid>
        </>
      )
    )
  }
  if (formElement.type === 'datetimepicker') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      return (
        <>
          <Grid
            item
            xs={columnSX}
            sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
            key={`${formElement.id}_container`}
          >
            <FormControl sx={{ width: '94%' }} margin="normal" key={formElement.id}>
              <TextField
                InputLabelProps={{ shrink: true, required: true }}
                type="datetime-local"
                id={formElement.id}
                label={translate(`${formElement.label}`)}
                default={formElement.default}
                onChange={(e, v) => handleChange(e, v, formElement)}
                error={errorFinder(formElement.id) || formElement.error}
                helperText={helperFinder(formElement.id) || formElement.helperText}
                inputProps={{
                  readOnly: readOnlyFlagFinder(formElement.id),
                  disabled: disabledFlagFinder(formElement.id),
                  min: new Date().toISOString().slice(0, 16)
                }}
                required={formElement.requiredField}
                fullWidth
                value={valueFinder(formElement.id)}
              />
            </FormControl>
            {formElement.infoText ? (
              <div style={{ marginTop: '30px', padding: '0px 5px' }}>
                <Icon name="info" size="small" title={formElement.infoText} />
              </div>
            ) : null}
          </Grid>
        </>
      )
    }
  }
  /* eslint-disable */
  if (formElement.type === 'textContent') {
    if (!formElement.relatedTo || fieldDisplayHandler(formElement.relatedTo)) {
      const language = localStorage.getItem('language')
      return (
        <Grid
          item
          xs={12}
          sx={{ display: hiddenFlagFinder(formElement.id) ? 'none' : 'inherit' }}
          key={`${formElement.id}_container`}
        >
          <FormControl
            sx={{ width: formElement?.infoText === undefined ? '91%' : '94%' }}
            margin="normal"
            key={formElement.id}
            xs={6}
          >
            {/* <p>{formElement.default}</p> */}

            <div
              dangerouslySetInnerHTML={{
                __html:
                  language === LOCALES.DE_DE.key && formElement.id === 'pSIDescription'
                    ? formElement.defaultGerman
                    : formElement.default
              }}
            />
          </FormControl>
        </Grid>
      )
    }
  }
  return false
}

export default formGenerator
